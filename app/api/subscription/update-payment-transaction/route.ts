import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Paddle } from "@paddle/paddle-node-sdk";

const paddle = new Paddle(process.env.PADDLE_API_KEY!);

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        // Get subscription ID from database
        if (!supabaseAdmin) {
            return NextResponse.json({ error: "Database not available" }, { status: 500 });
        }

        const { data: user, error: userError } = await supabaseAdmin
            .from("users")
            .select("paddle_subscription_id")
            .eq("id", userId)
            .single();

        if (userError || !user?.paddle_subscription_id) {
            return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
        }

        // Get transaction for payment method update
        const transaction = await paddle.subscriptions.getPaymentMethodChangeTransaction(user.paddle_subscription_id);

        return NextResponse.json({ transactionId: transaction.id });
    } catch (error) {
        console.error("Error getting payment update transaction:", error);
        return NextResponse.json({ error: "Failed to get payment update transaction" }, { status: 500 });
    }
}
