import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Paddle } from "@paddle/paddle-node-sdk";

const paddle = new Paddle(process.env.PADDLE_API_KEY!);

export async function POST() {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        // Get subscription ID from database
        const { data: user, error: userError } = await supabaseAdmin
            .from("users")
            .select("paddle_subscription_id")
            .eq("id", userId)
            .single();

        if (userError || !user?.paddle_subscription_id) {
            return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
        }

        // Cancel subscription at end of billing period
        await paddle.subscriptions.cancel(user.paddle_subscription_id, {
            effectiveFrom: "next_billing_period"
        });

        return NextResponse.json({ success: true, message: "Subscription will be cancelled at the end of the billing period." });
    } catch (error) {
        console.error("Error cancelling subscription:", error);
        return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
    }
}
