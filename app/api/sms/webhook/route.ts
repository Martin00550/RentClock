import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const body = formData.get("Body")?.toString().toLowerCase();
        const from = formData.get("From")?.toString();

        console.log(`📩 Incoming SMS from ${from}: ${body}`);

        // Twilio expects a TwiML response
        const twiml = new twilio.twiml.MessagingResponse();

        // Handle common keywords
        if (body === "stop" || body === "unsubscribe") {
            // Twilio handles the actual unsubscription logic on their end automatically,
            // but we can acknowledge it here if we want to add custom logic.
            return new NextResponse(twiml.toString(), {
                headers: { "Content-Type": "text/xml" },
            });
        }

        // Default response for other messages (optional)
        // You can leave it empty to send no response back
        // twiml.message("Thanks for contacting RentClock support.");

        return new NextResponse(twiml.toString(), {
            headers: { "Content-Type": "text/xml" },
        });
    } catch (error) {
        console.error("Webhook error:", error);
        return new NextResponse("<Response></Response>", {
            headers: { "Content-Type": "text/xml" },
        });
    }
}
