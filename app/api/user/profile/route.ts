import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data, error } = await supabaseAdmin
        .from("users")
        .select("has_onboarded, calendar_token, is_pro, phone")
        .eq("id", userId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
        console.error("Error fetching user profile:", error);
        return new NextResponse("Error fetching profile", { status: 500 });
    }

    // If user doesn't exist or is missing token, we might handle it here or let client handle partial data
    // For now, return what we have. If no data (first login), returns null/empty.

    // Ensure token exists if user exists
    let calendar_token = data?.calendar_token;
    if (data && !calendar_token) {
        calendar_token = uuidv4();
        await supabaseAdmin
            .from("users")
            .update({ calendar_token })
            .eq("id", userId);
    }

    return NextResponse.json({
        has_onboarded: data?.has_onboarded ?? false,
        calendar_token: calendar_token || null,
        is_pro: data?.is_pro ?? false,
        phone: data?.phone || ""
    });
}

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    // Note: auth() doesn't return full user object in new Clerk versions directly without currentUser(), but userId is sufficient.

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { has_onboarded, phone, calendar_token, email } = body;

        const updates: { has_onboarded?: boolean; phone?: string; calendar_token?: string; email?: string } = {};
        if (typeof has_onboarded === 'boolean') updates.has_onboarded = has_onboarded;
        if (phone !== undefined) updates.phone = phone;
        if (calendar_token) updates.calendar_token = calendar_token;
        if (email) updates.email = email; // Only if we need to sync email on first create

        // Check if user exists first to decide on insert vs update, or use upsert
        const { error } = await supabaseAdmin
            .from("users")
            .upsert({
                id: userId,
                ...updates,
                updated_at: new Date().toISOString()
            }, { onConflict: "id" });

        if (error) {
            console.error("Error updating user profile:", error);
            return new NextResponse("Error updating profile", { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Error parsing request:", e);
        return new NextResponse("Invalid request", { status: 400 });
    }
}
