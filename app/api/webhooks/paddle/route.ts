import { NextRequest, NextResponse } from "next/server";
import { Paddle, EventName } from "@paddle/paddle-node-sdk";
import { updateUserSubscriptionStatus } from "@/lib/supabase-admin";

const paddle = new Paddle(process.env.PADDLE_API_KEY!);

const MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes

function extractTimestamp(signature: string): number | null {
    const tsMatch = signature.match(/ts=(\d+)/);
    return tsMatch ? parseInt(tsMatch[1], 10) : null;
}

function isTimestampValid(timestamp: number): boolean {
    const now = Date.now();
    const diff = now - timestamp * 1000; // Convert to milliseconds
    return diff >= 0 && diff <= MAX_AGE_MS;
}

export async function POST(req: NextRequest) {
    const signature = req.headers.get("paddle-signature") || "";
    const body = await req.text();

    try {
        // Validate timestamp to prevent replay attacks
        const timestamp = extractTimestamp(signature);
        if (!timestamp) {
            console.error("Paddle webhook rejected: missing timestamp in signature");
            return NextResponse.json({ error: "Invalid signature format" }, { status: 400 });
        }

        if (!isTimestampValid(timestamp)) {
            console.error(`Paddle webhook rejected: timestamp too old (${timestamp})`);
            return NextResponse.json({ error: "Webhook timestamp expired" }, { status: 400 });
        }

        if (signature && body) {
            const eventData = await paddle.webhooks.unmarshal(body, process.env.PADDLE_WEBHOOK_SECRET!, signature);

            if (eventData) {
                console.log(`Received Paddle webhook: ${eventData.eventType}`);

                // Extract custom data (userId)
                // Note: customData is usually under eventData.data
                const userId = (eventData.data as { customData?: { userId?: string } }).customData?.userId;

                if (!userId) {
                    console.error("No userId found in Paddle webhook customData");
                    return NextResponse.json({ error: "No userId" }, { status: 400 });
                }

                switch (eventData.eventType) {
                    case EventName.SubscriptionCreated:
                    case EventName.SubscriptionUpdated:
                        // The status is available on the data object for subscription events
                        const status = (eventData.data as { status?: string }).status;
                        const customerId = (eventData.data as { customerId?: string }).customerId;
                        const subscriptionId = (eventData.data as { id?: string }).id;
                        await updateUserSubscriptionStatus(
                            userId,
                            status === "active" || status === "trialing",
                            customerId,
                            subscriptionId
                        );
                        break;

                    case EventName.SubscriptionCanceled:
                        await updateUserSubscriptionStatus(userId, false);
                        break;

                    default:
                        console.log(`Unhandled event type: ${eventData.eventType}`);
                }
            }
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Paddle webhook error:", error);
        return NextResponse.json({ error: "Webhook error" }, { status: 500 });
    }
}
