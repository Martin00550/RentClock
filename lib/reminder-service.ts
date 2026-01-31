import { supabaseAdmin } from "@/lib/supabase-admin";
import { resend } from "@/lib/resend";
import { sendSms } from "@/lib/sms";
import { differenceInDays, parseISO, startOfDay, addDays } from "date-fns";

export async function processLeaseReminders() {
    const today = startOfDay(new Date());
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rentclock.online";

    // 1. Fetch ALL leases that are either active or have future dates
    // We don't want to filter too strictly in SQL because we need to check two different date columns
    // Scanning all leases for a specific user ID would be better, but here we scan ALL leases in the system.
    // In a real high-scale app, we would use a more specific SQL query or a dedicated "reminders" table.
    // For now, fetching "active" leases is safe.
    const { data: leases, error } = await supabaseAdmin
        .from("leases")
        .select("*, users!inner(email, phone, is_pro, email_notifications_enabled)");
    // Removed .gte("lease_end_date") constraint to ensure we catch rent increases even if lease_end_date is weird
    // We will filter in memory.

    if (error) throw error;

    // Filter for specific trigger windows (90, 60, 30, 7, 0)
    // We check BOTH Lease Expiration AND Rent Increase
    const triggers = [90, 60, 30, 7, 0];

    const actionableItems = [];

    for (const lease of leases || []) {
        const events = [];

        // Check Lease Expiry
        if (lease.lease_end_date) {
            const expiryDate = startOfDay(parseISO(lease.lease_end_date));
            const daysUntil = differenceInDays(expiryDate, today);

            if (triggers.includes(daysUntil)) {
                events.push({ type: "expiry", daysUntil, date: lease.lease_end_date });
            }
        }

        // Check Rent Increase (NEW)
        if (lease.rent_increase_date) {
            const increaseDate = startOfDay(parseISO(lease.rent_increase_date));
            const daysUntil = differenceInDays(increaseDate, today);

            if (triggers.includes(daysUntil)) {
                events.push({ type: "increase", daysUntil, date: lease.rent_increase_date });
            }
        }

        if (events.length > 0) {
            actionableItems.push({ lease, events });
        }
    }

    if (actionableItems.length === 0) {
        return { message: "No reminders needed today.", count: 0 };
    }

    // 2. Send Notifications
    const results = await Promise.all(
        actionableItems.map(async ({ lease, events }) => {
            const userGlobalEmail = lease.users?.email_notifications_enabled ?? true;
            const notificationResults = [];

            for (const event of events) {
                const daysUntil = event.daysUntil;
                const isExpiry = event.type === "expiry";
                const eventLabel = isExpiry ? "Lease Expiration" : "Rent Increase";
                const eventColor = isExpiry ? "#ef4444" : "#2d6a4f"; // Red for expiry, Green for money

                // Check specific preferences
                // We use the same preference toggles for both events for now (implied "Lease Alerts")
                // Or we could derive it. Let's use the existing toggles as "Global Lease Alert" toggles per window.
                const emailAllowed = userGlobalEmail && (
                    (daysUntil === 90 && (lease.reminder_90_days_email ?? true)) ||
                    (daysUntil === 60 && (lease.reminder_60_days_email ?? true)) ||
                    (daysUntil === 30 && (lease.reminder_30_days_email ?? true)) ||
                    (daysUntil === 7 && (lease.reminder_7_days_email ?? true)) ||
                    (daysUntil === 0)
                );

                const smsAllowed =
                    (daysUntil === 90 && lease.reminder_90_days_sms) ||
                    (daysUntil === 60 && lease.reminder_60_days_sms) ||
                    (daysUntil === 30 && lease.reminder_30_days_sms) ||
                    (daysUntil === 7 && lease.reminder_7_days_sms) ||
                    (daysUntil === 0);

                // --- EMAIL PAYLOAD ---
                if (emailAllowed && lease.users?.email) {
                    notificationResults.push(
                        resend.emails.send({
                            from: "RentClock <alerts@rentclock.online>",
                            to: [lease.users.email],
                            subject: `🚨 ${eventLabel}: ${lease.tenant_name} (${daysUntil} days left)`,
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
                                                    <div style="font-size: 24px; font-weight: 900; color: #1e3a5f;">${daysUntil} Days</div>
                                                </div>
                                                <div>
                                                    <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b;">Target Date</span>
                                                    <div style="font-size: 18px; font-weight: 700; color: #475569;">${event.date}</div>
                                                </div>
                                                ${!isExpiry && lease.rent_increase_amount ? `
                                                <div style="margin-top: 12px;">
                                                     <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b;">New Revenue</span>
                                                     <div style="font-size: 18px; font-weight: 700; color: #2d6a4f;">+$${lease.rent_increase_amount}/mo</div>
                                                </div>
                                                ` : ''}
                                            </div>

                                            <a href="${appUrl}/leases/${lease.id}" style="display: block; background-color: #1e3a5f; color: #ffffff; padding: 16px 24px; text-align: center; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(30, 58, 95, 0.3);">
                                                ${isExpiry ? "Prepare Renewal Offer →" : "Generate Increase Notice →"}
                                            </a>
                                            
                                            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 32px;">
                                                RentClock Automated Intelligence.
                                            </p>
                                        </div>
                                    </div>
                                    <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 11px; line-height: 18px;">
                                        <p style="margin: 0;">&copy; 2026 RentClock.</p>
                                        <p style="margin: 8px 0;">
                                            <a href="${appUrl}/settings" style="color: #64748b; text-decoration: underline;">Manage Preferences</a>
                                        </p>
                                    </div>
                                </div>
                            `,
                        }).then(res => ({ type: 'email', ...res }))
                    );
                }

                // --- SMS PAYLOAD ---
                if (smsAllowed && lease.users?.phone && lease.users?.is_pro) {
                    const smsBody = isExpiry
                        ? `RentClock: Lease for ${lease.tenant_name} expires in ${daysUntil} days. Review: ${appUrl}/leases/${lease.id} Reply STOP to opt out.`
                        : `RentClock: Rent Increase for ${lease.tenant_name} is due in ${daysUntil} days. Capture revenue: ${appUrl}/leases/${lease.id} Reply STOP to opt out.`;

                    notificationResults.push(
                        sendSms(lease.users.phone, smsBody).then(res => ({ type: 'sms', ...res }))
                    );
                }
            }

            return { leaseId: lease.id, results: await Promise.all(notificationResults) };
        })
    );

    return { sent: results.length, details: results };
}
