import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { checkRateLimit } from "@/lib/ratelimit";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { v4 as uuidv4 } from "uuid";

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
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    console.log("📂 /api/scan-lease hit");
    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "Missing GEMINI_API_KEY in server environment" },
                { status: 500 }
            );
        }

        // --- RATE LIMITING ---
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const limitCheck = await checkRateLimit(ip, 50, 3600); // Increased to 50 for bulk support

        if (!limitCheck.success) {
            console.warn(`🛑 Rate limit exceeded for IP: ${ip}`);
            return NextResponse.json(
                { error: "Rate limit exceeded. You can scan up to 50 leases per hour." },
                { status: 429 }
            );
        }
        console.log(`Usage: ${limitCheck.remaining}/${limitCheck.limit} remaining for ${ip}`);
        // ---------------------

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            console.error("❌ No file uploaded");
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }
        console.log(`✅ File received: ${file.name} (${file.size} bytes)`);

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = file.type;

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Try models in order of preference
        const modelsToTry = ["gemini-2.0-flash-exp", "gemini-1.5-flash"];

        let result = null;
        let usedModel = "";
        let lastError = null;

        const isMultimodal = ["application/pdf", "image/png", "image/jpeg", "image/webp"].includes(mimeType);

        for (const modelName of modelsToTry) {
            try {
                console.log(`🤖 Attempting scan with model: ${modelName} (${isMultimodal ? "Multimodal" : "Text Only"})`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: {
                        temperature: 0,
                    }
                });

                const prompt = `
                    You are a rigorous data extraction AI for US Commercial Real Estate leases.
                    Examine the provided lease document (PDF or Image) and extract the following fields.
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
                        {
                            inlineData: {
                                data: buffer.toString("base64"),
                                mimeType: mimeType
                            }
                        }
                    ]);
                } else {
                    // Fallback for text files or others (simplified)
                    result = await model.generateContent(`${prompt}\n\nDocument Context:\n${buffer.toString("utf-8")}`);
                }

                usedModel = modelName;
                break;
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : "Unknown error";
                console.warn(`Model ${modelName} failed:`, errorMessage);
                lastError = err instanceof Error ? err : new Error(String(err));
            }
        }

        if (!result) {
            console.error("All models failed.");
            throw lastError || new Error("Failed to generate content with any model");
        }

        console.log(`✅ Success with model: ${usedModel}`);
        const response = await result.response;
        const textResponse = response.text();
        const jsonString = textResponse.replace(/```json|```/g, "").trim();

        // Validate with Zod
        let data;
        try {
            const rawData = JSON.parse(jsonString);
            const parsed = LeaseSchema.safeParse(rawData);

            if (!parsed.success) {
                console.error("❌ Zod Validation Failed:", parsed.error);
                // Attempt to salvage partially correct data or return raw if critical fields exist
                if (rawData.tenant_name && rawData.monthly_rent) {
                    console.warn("⚠️ Returning raw data despite validation failure (best effort).");
                    data = rawData;
                } else {
                    throw new Error("AI returned invalid data structure");
                }
            } else {
                data = parsed.data;
            }
        } catch (jsonError) {
            console.error("❌ JSON Parse or Validation Error:", jsonError);
            return NextResponse.json(
                { error: "AI response was not valid JSON or matched schema." },
                { status: 500 }
            );
        }

        // --- PERSIST DOCUMENT TO STORAGE ---
        console.log(`📤 Uploading ${mimeType} to storage...`);
        const extension = mimeType.split("/")[1] || "pdf";
        const fileName = `${uuidv4()}.${extension}`;

        const { error: uploadError } = await supabaseAdmin
            .storage
            .from("leases-pdf")
            .upload(fileName, buffer, {
                contentType: mimeType,
                cacheControl: "3600",
                upsert: false
            });

        let pdfUrl = "";
        if (uploadError) {
            console.error("❌ Storage upload failed:", uploadError);
            // Don't fail the whole request just because storage failed, but log it
        } else {
            const { data: publicUrlData } = supabaseAdmin
                .storage
                .from("leases-pdf")
                .getPublicUrl(fileName);
            pdfUrl = publicUrlData.publicUrl;
            console.log(`✅ PDF Persisted: ${pdfUrl}`);
        }
        // ------------------------------

        return NextResponse.json({ success: true, data, used_model: usedModel, pdf_url: pdfUrl });

    } catch (error: unknown) {
        console.error("Scan error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to process lease";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
