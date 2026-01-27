import { inngest } from "./client";
import { processLeaseReminders } from "@/lib/reminder-service";

export const checkLeaseReminders = inngest.createFunction(
    { id: "check-lease-reminders" },
    { cron: "0 8 * * *" }, // Run every day at 8 AM
    async ({ step }) => {
        return step.run("process-reminders", async () => {
            return await processLeaseReminders();
        });
    }
);
