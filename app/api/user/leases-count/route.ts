import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { count, error } = await supabaseAdmin
        .from("leases")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

    if (error) {
        console.error("Error counting leases:", error);
        return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count: count || 0 });
}
