import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!supabaseAdmin) {
        return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    // Verify the lease belongs to this user before deleting
    const { data: lease, error: fetchError } = await supabaseAdmin
        .from("leases")
        .select("id, user_id, pdf_url")
        .eq("id", id)
        .eq("user_id", userId)
        .single();

    if (fetchError || !lease) {
        return NextResponse.json(
            { error: "Lease not found or access denied" },
            { status: 404 }
        );
    }

    // Delete associated PDF from storage if it exists
    if (lease.pdf_url) {
        try {
            let filePath: string | null = null;

            // Handle both full URLs and relative paths
            if (lease.pdf_url.startsWith('http://') || lease.pdf_url.startsWith('https://')) {
                // Parse full URL properly
                const url = new URL(lease.pdf_url);
                const pathSegments = url.pathname.split('/').filter(Boolean);

                // Validate: expect at least 2 segments (userId/filename.pdf)
                if (pathSegments.length >= 2) {
                    const fileName = pathSegments[pathSegments.length - 1];
                    const pathUserId = pathSegments[pathSegments.length - 2];

                    // Security: verify the userId in path matches authenticated user
                    if (pathUserId === userId && fileName && fileName.endsWith('.pdf')) {
                        filePath = `${pathUserId}/${fileName}`;
                    } else {
                        console.warn(`PDF path validation failed for lease ${id}: userId mismatch or invalid filename`);
                    }
                }
            } else {
                // Handle relative paths (e.g., /storage/v1/object/public/leases-pdf/userId/file.pdf)
                const pathSegments = lease.pdf_url.split('/').filter(Boolean);

                // Look for leases-pdf bucket in path
                const bucketIndex = pathSegments.indexOf('leases-pdf');
                if (bucketIndex !== -1 && bucketIndex + 2 < pathSegments.length) {
                    const pathUserId = pathSegments[bucketIndex + 1];
                    const fileName = pathSegments[bucketIndex + 2];

                    // Validate path format and ownership
                    if (pathUserId === userId && fileName && fileName.endsWith('.pdf')) {
                        filePath = `${pathUserId}/${fileName}`;
                    } else {
                        console.warn(`PDF path validation failed for lease ${id}: userId mismatch or invalid filename`);
                    }
                }
            }

            if (filePath) {
                console.log(`Attempting to delete PDF from storage: ${filePath}`);
                const { error: storageError } = await supabaseAdmin.storage
                    .from("leases-pdf")
                    .remove([filePath]);

                if (storageError) {
                    console.error(`Failed to delete PDF ${filePath}:`, storageError);
                } else {
                    console.log(`Successfully deleted PDF: ${filePath}`);
                }
            } else {
                console.warn(`Could not extract valid file path from pdf_url for lease ${id}: ${lease.pdf_url}`);
            }
        } catch (storageError) {
            console.error("Error deleting PDF from storage:", storageError);
            // Continue with lease deletion even if PDF deletion fails
        }
    }

    // Delete the lease
    const { error: deleteError } = await supabaseAdmin
        .from("leases")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

    if (deleteError) {
        console.error("Error deleting lease:", deleteError);
        return NextResponse.json(
            { error: "Failed to delete lease" },
            { status: 500 }
        );
    }

    return NextResponse.json({ success: true });
}
