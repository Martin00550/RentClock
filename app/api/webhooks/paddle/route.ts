import { NextRequest, NextResponse } from "next/server";
import { Paddle, EventName } from "@paddle/paddle-node-sdk";
import { updateUserSubscriptionStatus } from "@/lib/supabase-admin";

const paddle = new Paddle(process.env.PADDLE_API_KEY!);

export async function POST(req: NextRequest) {
    const signature = req.headers.get("paddle-signature") || "";
    const body = await req.text();

    try {
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
                        await updateUserSubscriptionStatus(userId, status === "active" || status === "trialing");
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
