"use server";

import { logger } from "@/lib/logger";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export interface VaultDocument {
    id: string;
    lease_id: string;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
    created_at: string;
}

export async function uploadVaultDocument(leaseId: string, formData: FormData) {
    const { userId } = await auth();
    if (!userId) {
        return { error: "Unauthorized" };
    }

    const file = formData.get("file") as File;
    if (!file) {
        return { error: "No file provided" };
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = file.type;
        const extension = mimeType.split("/")[1] || "bin";
        const originalName = file.name;
        const fileName = `${userId}/vault/${leaseId}/${uuidv4()}.${extension}`;

        if (!supabaseAdmin) {
            return { error: "Database not available" };
        }

        const { error: uploadError } = await supabaseAdmin
            .storage
            .from("leases-pdf")
            .upload(fileName, buffer, {
                contentType: mimeType,
                cacheControl: "3600",
                upsert: false
            });

        if (uploadError) {
            logger.error("Storage upload error", { error: uploadError, fileName, userId });
            return { error: "Failed to upload file to storage" };
        }

        const { data: docData, error: docError } = await supabaseAdmin
            .from("lease_documents")
            .insert({
                lease_id: leaseId,
                user_id: userId,
                file_name: originalName,
                file_path: fileName,
                file_type: mimeType,
                file_size: file.size
            })
            .select()
            .single();

        if (docError) {
            logger.error("Database insert error", { error: docError, leaseId, userId });
            await supabaseAdmin.storage.from("leases-pdf").remove([fileName]);
            if (docError.message.includes("relation") && docError.message.includes("does not exist")) {
                return { error: "Document vault not configured. Please run the SQL migration." };
            }
            return { error: "Failed to save document record" };
        }

        revalidatePath(`/leases/${leaseId}`);
        return { success: true, document: docData };

    } catch (error) {
        logger.error("Server action error", { error, leaseId, userId });
        return { error: "Failed to upload document" };
    }
}

export async function getVaultDocuments(leaseId: string): Promise<VaultDocument[]> {
    const { userId } = await auth();
    if (!userId) {
        return [];
    }

    if (!supabaseAdmin) {
        return [];
    }

    try {
        const { data, error } = await supabaseAdmin
            .from("lease_documents")
            .select("*")
            .eq("lease_id", leaseId)
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            logger.error("Error fetching vault documents", { error, leaseId });
            if (error.message.includes("relation") && error.message.includes("does not exist")) {
                return [];
            }
            return [];
        }

        return data || [];
    } catch (error) {
        logger.error("Error fetching vault documents", { error, leaseId });
        return [];
    }
}

export async function getSignedDocumentUrl(filePath: string): Promise<string | null> {
    if (!supabaseAdmin) return null;

    try {
        const { data, error } = await supabaseAdmin
            .storage
            .from("leases-pdf")
            .createSignedUrl(filePath, 3600);

        if (error) {
            console.error("Error signing URL:", error);
            return null;
        }

        return data.signedUrl;
    } catch (error) {
        console.error("Error processing document URL:", error);
        return null;
    }
}

export async function deleteVaultDocument(documentId: string, filePath: string, leaseId: string) {
    const { userId } = await auth();
    if (!userId) {
        return { error: "Unauthorized" };
    }

    if (!supabaseAdmin) {
        return { error: "Database not available" };
    }

    try {
        const { error: storageError } = await supabaseAdmin
            .storage
            .from("leases-pdf")
            .remove([filePath]);

        if (storageError) {
            logger.error("Storage delete error", { error: storageError, filePath });
        }

        const { error: dbError } = await supabaseAdmin
            .from("lease_documents")
            .delete()
            .eq("id", documentId)
            .eq("user_id", userId);

        if (dbError) {
            logger.error("Database delete error", { error: dbError, documentId });
            return { error: "Failed to delete document" };
        }

        revalidatePath(`/leases/${leaseId}`);
        return { success: true };

    } catch (error) {
        logger.error("Delete error", { error, documentId });
        return { error: "Failed to delete document" };
    }
}
