"use server";

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
            console.error("Upload error:", uploadError);
            return { error: "Failed to upload file to storage" };
        }

        // 2. Get Public URL
        const { data: publicUrlData } = supabaseAdmin
            .storage
            .from("leases-pdf")
            .getPublicUrl(fileName);

        const pdfUrl = publicUrlData.publicUrl;

        // 3. Update Lease Record
        const { error: updateError } = await supabaseAdmin
            .from("leases")
            .update({ pdf_url: pdfUrl })
            .eq("id", leaseId)
            .eq("user_id", userId); // Security check

        if (updateError) {
            console.error("Database update error:", updateError);
            return { error: "Failed to update lease record" };
        }

        revalidatePath(`/leases/${leaseId}`);
        return { success: true, pdfUrl };

    } catch (error) {
        console.error("Server action error:", error);
        return { error: "Internal server error" };
    }
}
