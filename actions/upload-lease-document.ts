"use server";

import { logger } from "@/lib/logger";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function uploadLeaseDocument(leaseId: string, formData: FormData) {
    const { userId } = await auth();
    if (!userId) {
        return { error: "Unauthorized" };
    }

    const file = formData.get("file") as File;
    if (!file) {
        return { error: "No file provided" };
    }

    try {
        // 1. Upload to Storage
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = file.type;
        const extension = mimeType.split("/")[1] || "pdf";
        const fileName = `${userId}/${uuidv4()}.${extension}`;

        const { error: uploadError } = await supabaseAdmin
            .storage
            .from("leases-pdf")
            .upload(fileName, buffer, {
                contentType: mimeType,
                cacheControl: "3600",
                upsert: false
            });

        if (uploadError) {
            logger.error("Storage upload error", uploadError, { fileName, userId });
            return { error: "Failed to upload file to storage" };
        }

        // 2. Update Lease Record with PATH (Secure)
        // We now store the path "userId/uuid.pdf" instead of the public URL.
        const { error: updateError } = await supabaseAdmin
            .from("leases")
            .update({ pdf_url: fileName }) // Storing the path in the pdf_url column for now
            .eq("id", leaseId)
            .eq("user_id", userId); // Security check

        if (updateError) {
            logger.error("Database update error", updateError, { leaseId, userId });
            return { error: "Failed to update lease record" };
        }

        revalidatePath(`/leases/${leaseId}`);
        return { success: true, pdfUrl: fileName };

    } catch (error) {
        logger.error("Server action error", error, { leaseId, userId });
        return { error: "Failed to upload document" };
    }
}
