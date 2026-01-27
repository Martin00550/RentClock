import { supabaseAdmin } from "@/lib/supabase-admin";
import { resend } from "@/lib/resend";
import { sendSms } from "@/lib/sms";
import { differenceInDays, parseISO } from "date-fns";

export async function processLeaseReminders() {
    const today = new Date();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rentclock.com";

    // 1. Fetch leases that need reminders
    const { data: leases, error } = await supabaseAdmin
        .from("leases")
        .select("*, users!inner(email, phone, is_pro)")
        .gte("lease_end_date", today.toISOString());

    if (error) throw error;

    // Filter for specific trigger windows
    const relevantLeases = leases?.filter(lease => {
        if (!lease.lease_end_date) return false;
        const expiryDate = parseISO(lease.lease_end_date);
        const daysUntil = differenceInDays(expiryDate, today);
        return [90, 60, 30, 7, 0].includes(daysUntil);
    }) || [];

    if (relevantLeases.length === 0) {
        return { message: "No reminders needed today.", count: 0 };
    }

    // 2. Send Notifications (Email + SMS)
    const results = await Promise.all(
        relevantLeases.map(async (lease) => {
            const expiryDate = parseISO(lease.lease_end_date);
            const daysUntil = differenceInDays(expiryDate, today);
            const promises = [];

            const emailEnabled =
                (daysUntil === 90 && (lease.reminder_90_days_email ?? true)) ||
                (daysUntil === 60 && (lease.reminder_60_days_email ?? true)) ||
                (daysUntil === 30 && (lease.reminder_30_days_email ?? true)) ||
                (daysUntil === 7 && (lease.reminder_7_days_email ?? true)) ||
                (daysUntil === 0); // Always alert day-of

            const smsEnabled =
                (daysUntil === 90 && lease.reminder_90_days_sms) ||
                (daysUntil === 60 && lease.reminder_60_days_sms) ||
                (daysUntil === 30 && lease.reminder_30_days_sms) ||
                (daysUntil === 7 && lease.reminder_7_days_sms);

            if (emailEnabled && lease.users?.email) {
                promises.push(
                    resend.emails.send({
                        from: "RentClock <alerts@rentclock.com>",
                        to: [lease.users.email],
                        subject: `🚨 Action Required: ${lease.tenant_name} (${daysUntil} days left)`,
                        html: `
                            <h1>Critical Date Alert</h1>
                            <p>The lease for <strong>${lease.tenant_name}</strong> expires in <strong>${daysUntil} days</strong> on ${lease.lease_end_date}.</p>
                            <p>Please review and take action.</p>
                            <br />
                            <a href="${appUrl}/leases/${lease.id}" style="background-color: #1e3a5f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Lease</a>
                        `,
                    }).then(res => ({ type: 'email', ...res }))
                );
            }

            if (smsEnabled && lease.users?.phone && lease.users?.is_pro) {
                const smsBody = `RentClock Alert: Lease for ${lease.tenant_name} expires in ${daysUntil} days. Review now: ${appUrl}/leases/${lease.id}`;
                promises.push(
                    sendSms(lease.users.phone, smsBody).then(res => ({ type: 'sms', ...res }))
                );
            }

            const operationResults = await Promise.all(promises);
            return { leaseId: lease.id, results: operationResults };
        })
    );

    return { sent: results.length, details: results };
}
