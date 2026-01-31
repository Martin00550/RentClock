import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Paddle } from "@paddle/paddle-node-sdk";

const paddle = new Paddle(process.env.PADDLE_API_KEY!);

export async function GET(req: NextRequest) {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const transactionId = req.nextUrl.searchParams.get("transactionId");

    if (!transactionId) {
        return NextResponse.json({ error: "Transaction ID required" }, { status: 400 });
    }

    try {
        const invoicePdf = await paddle.transactions.getInvoicePDF(transactionId);

        return NextResponse.json({ url: invoicePdf.url });
    } catch (error) {
        console.error("Error fetching invoice PDF:", error);
        return NextResponse.json({ error: "Failed to fetch invoice PDF" }, { status: 500 });
    }
}
