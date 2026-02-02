import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Sync Email to DB (for Admin Search)
    const email = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    if (email) {
        // Fire and forget update
        supabaseAdmin.from("users").update({ email }).eq("id", userId).then();
    }

    const { data, error } = await supabaseAdmin
        .from("users")
        .select("has_onboarded, calendar_token, is_pro, phone, email_notifications_enabled, paddle_customer_id, paddle_subscription_id, bonus_leases, referral_code, referred_by")
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
        phone: data?.phone || "",
        email_notifications_enabled: data?.email_notifications_enabled ?? true,
        paddle_customer_id: data?.paddle_customer_id || null,
        paddle_subscription_id: data?.paddle_subscription_id || null,
        bonus_leases: data?.bonus_leases || 0,
        referral_code: data?.referral_code || null
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
        const { has_onboarded, phone, calendar_token, email, email_notifications_enabled } = body;

        const updates: {
            has_onboarded?: boolean;
            phone?: string;
            calendar_token?: string;
            email?: string;
            email_notifications_enabled?: boolean
        } = {};
        if (typeof has_onboarded === 'boolean') updates.has_onboarded = has_onboarded;
        if (phone !== undefined) updates.phone = phone;
        if (calendar_token) updates.calendar_token = calendar_token;
        if (email) updates.email = email;
        if (typeof email_notifications_enabled === 'boolean') updates.email_notifications_enabled = email_notifications_enabled;

        // Check if user exists first to decide on insert vs update, or use upsert
        const { error } = await supabaseAdmin
            .from("users")
            .upsert({
                id: userId,
                ...updates
            }, { onConflict: "id" });

        if (error) {
            console.error("Error updating user profile:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Error parsing request:", e);
        return new NextResponse("Invalid request", { status: 400 });
    }
}
