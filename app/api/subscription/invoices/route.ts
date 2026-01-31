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
        // Get customer ID from database
        const { data: user, error: userError } = await supabaseAdmin
            .from("users")
            .select("paddle_customer_id")
            .eq("id", userId)
            .single();

        if (userError || !user?.paddle_customer_id) {
            return NextResponse.json({ invoices: [] });
        }

        // List transactions for this customer
        const transactionCollection = paddle.transactions.list({
            customerId: [user.paddle_customer_id],
            status: ["billed", "completed", "past_due"]
        });

        const invoices = [];
        for await (const transaction of transactionCollection) {
            invoices.push({
                id: transaction.id,
                status: transaction.status,
                createdAt: transaction.createdAt,
                total: transaction.details?.totals?.total || "0",
                currencyCode: transaction.currencyCode
            });
        }

        // Sort by date, newest first
        invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json({ invoices });
    } catch (error) {
        console.error("Error fetching invoices:", error);
        return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
    }
}
