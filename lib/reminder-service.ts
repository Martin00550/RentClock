import { supabaseAdmin } from "@/lib/supabase-admin";
import { resend } from "@/lib/resend";
import { sendSms } from "@/lib/sms";
import { differenceInDays, parseISO, startOfDay } from "date-fns";

export async function processLeaseReminders() {
    const today = startOfDay(new Date());
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rentclock.online";

    // 1. Fetch leases with user data and tracking flags
    if (!supabaseAdmin) {
        return { message: "Database connection not available.", count: 0 };
    }

    const { data: leases, error } = await supabaseAdmin
        .from("leases")
        .select("*, users!inner(email, phone, is_pro, email_notifications_enabled)");

    if (error) throw error;

    // Triggers in descending order for "highest matching trigger" logic
    // Triggers in ASCENDING order so we match the MOST URGENT / SPECIFIC trigger first.
    // Example: If daysUntil is 0, we want to match 0, not 90.
    const triggers = [0, 7, 30, 60, 90];
    const sortedTriggers = [...triggers].sort((a, b) => a - b);

    const actionableItems = [];

    for (const lease of leases || []) {
        const events = [];

        // --- CHECK LEASE EXPIRY ---
        if (lease.lease_end_date) {
            const expiryDate = startOfDay(parseISO(lease.lease_end_date));
            const daysUntil = differenceInDays(expiryDate, today);
            const lastSent = lease.last_expiry_alert_sent ?? 1000;

            // Robust logic: Find the highest trigger point we have reached since the last alert
            const bestTrigger = sortedTriggers.find(t => daysUntil <= t && t < lastSent);

            if (bestTrigger !== undefined) {
                events.push({
                    type: "expiry",
                    daysUntil: bestTrigger,
                    actualDays: daysUntil,
                    date: lease.lease_end_date,
                    fieldToUpdate: "last_expiry_alert_sent"
                });
            }
        }

        // --- CHECK RENT INCREASE ---
        if (lease.rent_increase_date) {
            const increaseDate = startOfDay(parseISO(lease.rent_increase_date));
            const daysUntil = differenceInDays(increaseDate, today);
            const lastSent = lease.last_increase_alert_sent ?? 1000;

            const bestTrigger = sortedTriggers.find(t => daysUntil <= t && t < lastSent);

            if (bestTrigger !== undefined) {
                events.push({
                    type: "increase",
                    daysUntil: bestTrigger,
                    actualDays: daysUntil,
                    date: lease.rent_increase_date,
                    fieldToUpdate: "last_increase_alert_sent"
                });
            }
        }

        if (events.length > 0) {
            actionableItems.push({ lease, events });
        }
    }

    if (actionableItems.length === 0) {
        return { message: "No reminders needed today.", count: 0 };
    }

    // 2. Send Notifications and Update Tracking
    const results = await Promise.all(
        actionableItems.map(async ({ lease, events }) => {
            const userGlobalEmail = lease.users?.email_notifications_enabled ?? true;
            const notificationResults = [];
            const dbUpdates: Record<string, number> = {};

            for (const event of events) {
                const triggerLevel = event.daysUntil;
                const isExpiry = event.type === "expiry";
                const eventLabel = isExpiry ? "Lease Expiration" : "Rent Increase";
                const eventColor = isExpiry ? "#ef4444" : "#2d6a4f";

                // Check specific preferences for this trigger level
                const emailAllowed = userGlobalEmail && (
                    (triggerLevel === 90 && (lease.reminder_90_days_email ?? true)) ||
                    (triggerLevel === 60 && (lease.reminder_60_days_email ?? true)) ||
                    (triggerLevel === 30 && (lease.reminder_30_days_email ?? true)) ||
                    (triggerLevel === 7 && (lease.reminder_7_days_email ?? true)) ||
                    (triggerLevel === 0)
                );

                const smsAllowed =
                    (triggerLevel === 90 && lease.reminder_90_days_sms) ||
                    (triggerLevel === 60 && lease.reminder_60_days_sms) ||
                    (triggerLevel === 30 && lease.reminder_30_days_sms) ||
                    (triggerLevel === 7 && lease.reminder_7_days_sms) ||
                    (triggerLevel === 0);

                // --- EMAIL PAYLOAD ---
                if (emailAllowed && lease.users?.email && resend) {
                    notificationResults.push(
                        resend.emails.send({
                            from: "RentClock <alerts@rentclock.online>",
                            to: [lease.users.email],
                            subject: `🚨 ${eventLabel}: ${lease.tenant_name} (${triggerLevel} days left)`,
                            html: `
                                <div style="font-family: 'Inter', sans-serif; background-color: #f8fafc; padding: 40px; color: #1e293b;">
                                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                                        <div style="background-color: #1e3a5f; padding: 32px; text-align: center;">
                                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">${eventLabel} Alert</h1>
                                        </div>
                                        <div style="padding: 40px;">
                                            <p style="font-size: 16px; line-height: 24px; margin-bottom: 24px;">
                                                ${isExpiry
                                    ? `The lease for <strong>${lease.tenant_name}</strong> is expiring soon.`
                                    : `A scheduled <strong>Rent Increase</strong> for <strong>${lease.tenant_name}</strong> is coming up.`
                                }
                                                Requires immediate attention.
                                            </p>
                                            
                                            <div style="background-color: #f1f5f9; padding: 24px; border-radius: 16px; margin-bottom: 32px; border-left: 4px solid ${eventColor};">
                                                <div style="margin-bottom: 12px;">
                                                    <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b;">Action Required In</span>
                                                    <div style="font-size: 24px; font-weight: 900; color: #1e3a5f;">${triggerLevel} Days</div>
                                                </div>
                                                <div>
                                                    <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b;">Target Date</span>
                                                    <div style="font-size: 18px; font-weight: 700; color: #475569;">${event.date}</div>
                                                </div>
                                                ${!isExpiry && lease.rent_increase_amount ? `
                                                <div style="margin-top: 12px;">
                                                     <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b;">Yield Protection</span>
                                                     <div style="font-size: 18px; font-weight: 700; color: #2d6a4f;">+$${lease.rent_increase_amount}/mo</div>
                                                </div>
                                                ` : ''}
                                            </div>

                                            <a href="${appUrl}/leases/${lease.id}" style="display: block; background-color: #1e3a5f; color: #ffffff; padding: 16px 24px; text-align: center; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px;">
                                                ${isExpiry ? "Prepare Renewal Offer →" : "Generate Increase Notice →"}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            `,
                        }).then(res => ({ type: 'email', ...res }))
                    );
                }

                // --- SMS PAYLOAD ---
                if (smsAllowed && lease.users?.phone && lease.users?.is_pro) {
                    const smsBody = isExpiry
                        ? `RentClock: Lease for ${lease.tenant_name} expires in ${triggerLevel} days. Review: ${appUrl}/leases/${lease.id}`
                        : `RentClock: Rent Increase for ${lease.tenant_name} is due in ${triggerLevel} days. Protect yield: ${appUrl}/leases/${lease.id}`;

                    notificationResults.push(
                        sendSms(lease.users.phone, smsBody).then(res => ({ type: 'sms', ...res }))
                    );
                }

                // Stage DB update for this event
                dbUpdates[event.fieldToUpdate] = triggerLevel;
            }

            // Execute notifications and then update lease tracking state
            const eventResults = await Promise.all(notificationResults);

            if (Object.keys(dbUpdates).length > 0 && supabaseAdmin) {
                await supabaseAdmin
                    .from("leases")
                    .update(dbUpdates)
                    .eq("id", lease.id);
            }

            return { leaseId: lease.id, results: eventResults };
        })
    );

    return { sent: results.length, details: results };
}
