import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { checkRateLimit } from "@/lib/ratelimit";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@/lib/logger";

const LeaseSchema = z.object({
    tenant_name: z.string().default("Unknown Tenant"),
    property_address: z.string().default("Unknown Address"),
    monthly_rent: z.preprocess((val) => {
        if (typeof val === "string") return parseFloat(val.replace(/,/g, ""));
        return val;
    }, z.number().default(0)),
    rent_increase_amount: z.preprocess((val) => {
        if (typeof val === "string") return parseFloat(val.replace(/,/g, ""));
        return val;
    }, z.number().nullable().default(null)),
    lease_start_date: z.string().transform(val => val.split("T")[0]).nullable().default(null),
    lease_end_date: z.string().transform(val => val.split("T")[0]).nullable().default(null),
    rent_increase_date: z.string().transform(val => val.split("T")[0]).nullable().default(null),
    rent_schedule: z.array(z.object({
        date: z.string().transform(val => val.split("T")[0]),
        amount: z.number()
    })).optional().default([]),
});

// Force dynamic - essential for handling FormData
// Force dynamic - essential for handling FormData
export const dynamic = 'force-dynamic';

import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    const startTime = Date.now();
    let logError = "";
    let fileName = "unknown";
    let userId = "";

    try {
        const { userId: authUserId } = await auth();
        if (!authUserId) {
            logError = "Unauthorized";
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        userId = authUserId;

        if (!process.env.GEMINI_API_KEY) {
            logError = "Server configuration error";
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        // --- RATE LIMITING ---
        const limitCheck = await checkRateLimit(userId, 20, 3600); // Limit by UserID
        if (!limitCheck.success) {
            logError = "Hourly scan limit reached";
            return NextResponse.json(
                { error: "Hourly scan limit reached." },
                { status: 429 }
            );
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            logError = "No file provided";
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }
        fileName = file.name;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = file.type;

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest"];

        let result = null;
        let usedModel = "";
        let lastError = null;
        const isMultimodal = ["application/pdf", "image/png", "image/jpeg", "image/webp"].includes(mimeType);

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: { temperature: 0 }
                });

                const prompt = `
                    You are a rigorous data extraction AI for US Commercial Real Estate leases.
                    Examine the provided lease document and extract the following fields.
                    Return ONLY valid JSON. 
                    
                    Fields to extract:
                    - tenant_name (string): Full name of the tenant entity.
                    - property_address (string): Full property address (US Format).
                    - monthly_rent (number): Current monthly rent amount (numeric only).
                    - rent_increase_amount (number): The dollar amount of the next scheduled rent increase (if any).
                    - lease_start_date (string, ISO format YYYY-MM-DD): The commencement date.
                    - lease_end_date (string, ISO format YYYY-MM-DD): The expiration date.
                    - rent_increase_date (string, ISO format YYYY-MM-DD): Date of the next scheduled rent increase.
                    - rent_schedule (array of {date: string, amount: number}): Every scheduled rent change found in the lease (step-ups).
                    
                    CRITICAL: 
                    1. All dates MUST be returned in ISO YYYY-MM-DD format.
                    2. Currency values MUST be numeric.
                `;

                if (isMultimodal) {
                    result = await model.generateContent([
                        prompt,
                        { inlineData: { data: buffer.toString("base64"), mimeType: mimeType } }
                    ]);
                } else {
                    result = await model.generateContent(`${prompt}\n\nDocument Context:\n${buffer.toString("utf-8")}`);
                }

                usedModel = modelName;
                break;
            } catch (err: unknown) {
                lastError = err instanceof Error ? err : new Error(String(err));
            }
        }

        if (!result) {
            throw lastError || new Error("Failed to generate content");
        }

        const response = await result.response;
        const textResponse = response.text();
        const jsonString = textResponse.replace(/```json|```/g, "").trim();

        // Validate with Zod
        let data;
        try {
            const rawData = JSON.parse(jsonString);
            const parsed = LeaseSchema.safeParse(rawData);

            if (!parsed.success) {
                if (rawData.tenant_name && rawData.monthly_rent) {
                    data = rawData;
                } else {
                    throw new Error("AI returned invalid data structure");
                }
            } else {
                data = parsed.data;
            }
        } catch {
            logError = "AI returned invalid JSON";
            throw new Error("AI returned invalid JSON");
        }

        // --- PERSIST DOCUMENT TO STORAGE ---
        const extension = mimeType.split("/")[1] || "pdf";
        const storageFileName = `${userId}/${uuidv4()}.${extension}`;

        const { error: uploadError } = await supabaseAdmin
            .storage
            .from("leases-pdf")
            .upload(storageFileName, buffer, {
                contentType: mimeType,
                cacheControl: "3600",
                upsert: false
            });

        if (uploadError) {
            logger.error("Failed to upload lease", { error: uploadError });
        }

        // Store the path, not the public URL
        const pdfUrl = storageFileName;

        // --- SUCCESS LOGGING ---
        const duration = Date.now() - startTime;

        // Fire and forget log
        if (userId) {
            supabaseAdmin.from("scan_logs").insert({
                user_id: userId,
                file_name: fileName,
                status: "success",
                duration_ms: duration,
                token_usage: 0
            }).then();
        }

        return NextResponse.json({ success: true, data, used_model: usedModel, pdf_url: pdfUrl });

    } catch (error: unknown) {
        logger.error("Scan error", { error, userId, fileName: fileName || "unknown" });
        const errorMessage = error instanceof Error ? error.message : "Failed to process lease";

        // --- ERROR LOGGING ---
        const duration = Date.now() - startTime;
        if (userId) {
            supabaseAdmin.from("scan_logs").insert({
                user_id: userId,
                file_name: fileName,
                status: "failed",
                duration_ms: duration,
                error_message: logError || errorMessage
            }).then();
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
