import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { checkRateLimit } from "@/lib/ratelimit";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@/lib/logger";
import { auth } from "@clerk/nextjs/server";

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
    lease_start_date: z.preprocess(
        (val) => {
            if (val === null || val === undefined) return null;
            if (typeof val === "string") return val.split("T")[0];
            return val;
        },
        z.string().nullable().default(null)
    ),
    lease_end_date: z.preprocess(
        (val) => {
            if (val === null || val === undefined) return null;
            if (typeof val === "string") return val.split("T")[0];
            return val;
        },
        z.string().nullable().default(null)
    ),
    rent_increase_date: z.preprocess(
        (val) => {
            if (val === null || val === undefined) return null;
            if (typeof val === "string") return val.split("T")[0];
            return val;
        },
        z.string().nullable().default(null)
    ),
    rent_schedule: z.array(z.object({
        date: z.preprocess(
            (val) => {
                if (typeof val === "string") return val.split("T")[0];
                return val;
            },
            z.string()
        ),
        amount: z.number()
    })).optional().default([]),
});

export const dynamic = 'force-dynamic';

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
        const limitCheck = await checkRateLimit(userId, 20, 3600);
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

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = file.type;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash-latest"];

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

RETURN FORMAT: Return ONLY a raw JSON object. Do NOT use markdown code blocks. Do NOT wrap in triple backticks. Do NOT add explanatory text before or after the JSON. Return ONLY the JSON object.

Fields to extract:
- tenant_name (string): Full name of the tenant entity.
- tenant_email (string or null): Tenant email address if found.
- tenant_phone (string or null): Tenant phone number if found.
- property_name (string or null): Name of the property/building if found.
- property_address (string): Full property address (US Format).
- state (string or null): US state abbreviation (e.g., TX, CA, NY).
- monthly_rent (number): Current monthly rent amount (numeric only, no $ or commas).
- rent_increase_amount (number or null): The dollar amount of the next scheduled rent increase (if any). Use null if not found.
- lease_start_date (string, ISO format YYYY-MM-DD): The commencement date. Use null if not found.
- lease_end_date (string, ISO format YYYY-MM-DD): The expiration date. Use null if not found.
- rent_increase_date (string, ISO format YYYY-MM-DD): Date of the next scheduled rent increase. Use null if not found.
- notice_period_days (number or null): Number of days notice required for rent increase (common values: 30, 60, 90). Use null if not found.
- rent_schedule (array of {date: string, amount: number}): Every scheduled rent change found in the lease (step-ups). Use empty array [] if none found.

EXAMPLE RESPONSE:
{"tenant_name":"ABC Corp","tenant_email":"john@abccorp.com","tenant_phone":"555-123-4567","property_name":"Main Street Plaza","property_address":"123 Main St, Austin, TX 78701","state":"TX","monthly_rent":2500,"rent_increase_amount":100,"lease_start_date":"2024-01-01","lease_end_date":"2029-12-31","rent_increase_date":"2025-01-01","notice_period_days":60,"rent_schedule":[]}

CRITICAL RULES:
1. Return ONLY valid JSON - no markdown, no text, no code blocks.
2. All dates MUST be in ISO YYYY-MM-DD format.
3. Currency values MUST be numbers without $ or commas.
4. Use null for missing fields, never omit them.
5. Use empty array [] for rent_schedule if none found.
6. State MUST be a 2-letter US state abbreviation.
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

        let textResponse: string;
        try {
            const response = await result.response;
            textResponse = response.text();
        } catch (responseError) {
            logger.error("Failed to get AI response text", { 
                error: responseError instanceof Error ? responseError.message : String(responseError)
            });
            throw new Error("AI response was empty or unreadable. Please try again or enter details manually.");
        }
        
        if (!textResponse || textResponse.trim().length === 0) {
            throw new Error("AI returned empty response. Please try again or enter details manually.");
        }
        
        // More robust JSON extraction
        let jsonString = textResponse;
        
        // Remove markdown code blocks with various formats
        jsonString = jsonString.replace(/```json\s*/gi, "");
        jsonString = jsonString.replace(/```\s*/g, "");
        jsonString = jsonString.replace(/`{3,}/g, ""); // Any triple backticks
        
        // Try to find JSON within the text (in case there's explanatory text)
        const jsonMatch = jsonString.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
            jsonString = jsonMatch[0];
        }
        
        // Handle case where JSON is wrapped in quotes
        if (jsonString.startsWith('"') && jsonString.endsWith('"')) {
            try {
                jsonString = JSON.parse(jsonString);
            } catch {
                // If unwrapping fails, continue with original
            }
        }
        
        jsonString = jsonString.trim();
        
        // Log the cleaned response for debugging
        logger.info("AI response cleaned", { 
            originalLength: textResponse.length, 
            cleanedLength: jsonString.length,
            preview: jsonString.substring(0, 200)
        });

        let data;
        try {
            const rawData = JSON.parse(jsonString) as Record<string, unknown>;
            const parsed = LeaseSchema.safeParse(rawData);

            if (!parsed.success) {
                // Try to extract partial data if full validation fails
                logger.warn("Schema validation failed, using partial data", { issues: parsed.error.issues });
                data = {
                    tenant_name: String(rawData.tenant_name || "Unknown Tenant"),
                    property_address: String(rawData.property_address || "Unknown Address"),
                    monthly_rent: typeof rawData.monthly_rent === 'number' ? rawData.monthly_rent : 
                                  typeof rawData.monthly_rent === 'string' ? parseFloat(rawData.monthly_rent.replace(/,/g, '')) : 0,
                    rent_increase_amount: typeof rawData.rent_increase_amount === 'number' ? rawData.rent_increase_amount :
                                          typeof rawData.rent_increase_amount === 'string' ? parseFloat(rawData.rent_increase_amount.replace(/,/g, '')) : null,
                    lease_start_date: typeof rawData.lease_start_date === 'string' ? rawData.lease_start_date.split('T')[0] : null,
                    lease_end_date: typeof rawData.lease_end_date === 'string' ? rawData.lease_end_date.split('T')[0] : null,
                    rent_increase_date: typeof rawData.rent_increase_date === 'string' ? rawData.rent_increase_date.split('T')[0] : null,
                    rent_schedule: Array.isArray(rawData.rent_schedule) ? rawData.rent_schedule : []
                };
            } else {
                data = parsed.data;
            }
        } catch (parseError) {
            // Log the actual response for debugging
            logger.error("JSON parse failed", { 
                error: parseError instanceof Error ? parseError.message : String(parseError),
                originalResponse: textResponse.substring(0, 500),
                cleanedResponse: jsonString.substring(0, 500)
            });
            
            // Try one more time with a more aggressive cleanup
            try {
                // Remove all non-printable characters and try again
                const cleaned = jsonString.replace(/[^\x20-\x7E\s]/g, '');
                const rawData = JSON.parse(cleaned) as Record<string, unknown>;
                data = rawData as z.infer<typeof LeaseSchema>;
                logger.info("JSON parsed after aggressive cleanup");
            } catch {
                logError = "AI returned invalid JSON format";
                throw new Error(`AI returned invalid JSON. The document may be corrupted or unreadable. Please try again or enter details manually.`);
            }
        }

        // --- PERSIST DOCUMENT TO STORAGE (AFTER VALIDATION) ---
        const extension = mimeType.split("/")[1] || "pdf";
        const storageFileName = `${userId}/${uuidv4()}.${extension}`;
        let pdfUrl: string | null = null;

        if (supabaseAdmin) {
            const { error: uploadError } = await supabaseAdmin
                .storage
                .from("leases-pdf")
                .upload(storageFileName, buffer, {
                    contentType: mimeType,
                    cacheControl: "3600",
                    upsert: false
                });

            if (uploadError) {
                logger.error("Failed to upload lease after AI validation", { error: uploadError });
            } else {
                pdfUrl = storageFileName;
            }
        } else {
            logger.error("Supabase Admin not available for storage upload");
        }

        // --- SUCCESS LOGGING ---
        const duration = Date.now() - startTime;

        if (userId && supabaseAdmin) {
            try {
                await supabaseAdmin.from("scan_logs").insert({
                    user_id: userId,
                    file_name: fileName,
                    status: "success",
                    duration_ms: duration,
                    token_usage: 0
                });
            } catch (e) {
                logger.error("Scan logging failed", { e });
            }
        }

        return NextResponse.json({ success: true, data, used_model: usedModel, pdf_url: pdfUrl });

    } catch (error: unknown) {
        logger.error("Scan error", { error, userId, fileName: fileName || "unknown" });
        const errorMessage = error instanceof Error ? error.message : "Failed to process lease";

        const duration = Date.now() - startTime;
        if (userId && supabaseAdmin) {
            try {
                await supabaseAdmin.from("scan_logs").insert({
                    user_id: userId,
                    file_name: fileName,
                    status: "failed",
                    duration_ms: duration,
                    error_message: logError || (error instanceof Error ? error.message : String(error))
                });
            } catch (e) {
                logger.error("Scan error logging failed", { e });
            }
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
