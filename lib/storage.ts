import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Generates a signed URL for a lease document.
 * Handles both legacy (full Public URL) and new (storage path) formats.
 * 
 * @param pathOrUrl - The distinct storage path or legacy public URL stored in the DB.
 * @returns A temporary signed URL valid for 1 hour, or null if invalid.
 */
export async function getSignedLeaseUrl(pathOrUrl: string | null): Promise<string | null> {
    if (!pathOrUrl) return null;

    try {
        let path = pathOrUrl;

        // 1. Detect Legacy Public URL
        // Example: https://xyz.supabase.co/storage/v1/object/public/leases-pdf/user_123/doc.pdf
        if (pathOrUrl.startsWith("http")) {
            const url = new URL(pathOrUrl);
            const parts = url.pathname.split("/leases-pdf/");
            if (parts.length > 1) {
                path = parts[1]; // "user_123/doc.pdf"
            } else {
                // If we can't parse it, it might be an external link? 
                // For now, return as-is if it assumes public access, OR fail safe.
                // Better to try signing it if we can extract the path.
                return pathOrUrl;
            }
        }

        // 2. Generate Signed URL
        if (!supabaseAdmin) return pathOrUrl;

        const { data, error } = await supabaseAdmin
            .storage
            .from("leases-pdf")
            .createSignedUrl(path, 3600); // 1 hour

        if (error) {
            console.error("Error signing URL:", error);
            return null;
        }

        return data.signedUrl;

    } catch (error) {
        console.error("Error processing lease URL:", error);
        return null;
    }
}
