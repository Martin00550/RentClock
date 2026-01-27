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
            const urlParts = lease.pdf_url.split('/');
            const fileName = urlParts[urlParts.length - 1];
            if (fileName) {
                await supabaseAdmin.storage
                    .from("leases-pdf")
                    .remove([`${userId}/${fileName}`]);
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
