import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Twilio } from "twilio";

export async function POST(req: NextRequest) {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch user data
    const { data: user, error: userError } = await supabaseAdmin
        .from("users")
        .select("phone, is_pro")
        .eq("id", userId)
        .single();

    if (userError || !user) {
        return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
        );
    }

    // Gate behind Pro
    if (!user.is_pro) {
        return NextResponse.json(
            { error: "SMS alerts are a Pro feature. Upgrade to test." },
            { status: 403 }
        );
    }

    if (!user.phone) {
        return NextResponse.json(
            { error: "No phone number saved. Please save your number first." },
            { status: 400 }
        );
    }

    // Check Twilio credentials
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
        console.error("Missing Twilio credentials");
        return NextResponse.json(
            { error: "SMS service not configured" },
            { status: 500 }
        );
    }

    try {
        const client = new Twilio(accountSid, authToken);

        await client.messages.create({
            body: `🔔 RentClock Test Alert: Your SMS notifications are working! You'll receive alerts here when lease deadlines approach.`,
            from: fromNumber,
            to: user.phone
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Twilio error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to send test SMS" },
            { status: 500 }
        );
    }
}
