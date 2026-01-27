import { config } from "dotenv";
import path from "path";

// Load environment variables FIRST
const envPath = path.resolve(process.cwd(), ".env.local");
console.log(`📂 Loading env from: ${envPath}`);
config({ path: envPath });

async function main() {
    console.log("🚀 Starting Reminder Service Test...");

    try {
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY - check .env.local");
        }
        console.log("✅ Env vars loaded");

        // Import dynamically so env vars are set BEFORE the module initializes
        const { processLeaseReminders } = await import("../lib/reminder-service");

        console.log("🔄 Calling processLeaseReminders...");
        const result = await processLeaseReminders();
        console.log("✅ Reminder Service Result:", JSON.stringify(result, null, 2));

    } catch (error) {
        console.error("❌ Test Failed:", error);
    }
}

main();
