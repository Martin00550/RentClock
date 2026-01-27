import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client only if credentials exist
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendSms(to: string, body: string) {
    if (!client || !fromNumber) {
        console.warn("⚠️ SMS skipped: Missing Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_PHONE_NUMBER)");
        return { success: false, error: "Missing credentials" };
    }

    try {
        const message = await client.messages.create({
            body,
            from: fromNumber,
            to,
        });
        console.log(`✅ SMS sent to ${to}: ${message.sid}`);
        return { success: true, sid: message.sid };
    } catch (error) {
        console.error(`❌ SMS failed to ${to}:`, error);
        return { success: false, error };
    }
}
