import { supabaseAdmin } from "@/lib/supabase-admin";
import { resend } from "@/lib/resend";
import { sendSms } from "@/lib/sms";
import { differenceInDays, parseISO } from "date-fns";

export async function processLeaseReminders() {
    const today = new Date();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rentclock.online";

    // 1. Fetch leases that need reminders
    const { data: leases, error } = await supabaseAdmin
        .from("leases")
        .select("*, users!inner(email, phone, is_pro, email_notifications_enabled)")
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

            const userGlobalEmail = lease.users?.email_notifications_enabled ?? true;
            const emailEnabled = userGlobalEmail && (
                (daysUntil === 90 && (lease.reminder_90_days_email ?? true)) ||
                (daysUntil === 60 && (lease.reminder_60_days_email ?? true)) ||
                (daysUntil === 30 && (lease.reminder_30_days_email ?? true)) ||
                (daysUntil === 7 && (lease.reminder_7_days_email ?? true)) ||
                (daysUntil === 0)
            );

            const smsEnabled =
                (daysUntil === 90 && lease.reminder_90_days_sms) ||
                (daysUntil === 60 && lease.reminder_60_days_sms) ||
                (daysUntil === 30 && lease.reminder_30_days_sms) ||
                (daysUntil === 7 && lease.reminder_7_days_sms);

            if (emailEnabled && lease.users?.email) {
                promises.push(
                    resend.emails.send({
                        from: "RentClock <alerts@rentclock.online>",
                        to: [lease.users.email],
                        subject: `🚨 Action Required: ${lease.tenant_name} (${daysUntil} days left)`,
                        html: `
                            <div style="font-family: 'Inter', sans-serif; background-color: #f8fafc; padding: 40px; color: #1e293b;">
                                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                                    <div style="background-color: #1e3a5f; padding: 32px; text-align: center;">
                                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Critical Date Alert</h1>
                                    </div>
                                    <div style="padding: 40px;">
                                        <p style="font-size: 16px; line-height: 24px; margin-bottom: 24px;">The lease for <strong>${lease.tenant_name}</strong> requires your immediate attention.</p>
                                        
                                        <div style="background-color: #f1f5f9; padding: 24px; border-radius: 16px; margin-bottom: 32px;">
                                            <div style="margin-bottom: 12px;">
                                                <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b;">Action Required In</span>
                                                <div style="font-size: 24px; font-weight: 900; color: #1e3a5f;">${daysUntil} Days</div>
                                            </div>
                                            <div>
                                                <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b;">Lease End Date</span>
                                                <div style="font-size: 18px; font-weight: 700; color: #475569;">${lease.lease_end_date}</div>
                                            </div>
                                        </div>

                                        <a href="${appUrl}/leases/${lease.id}" style="display: block; background-color: #1e3a5f; color: #ffffff; padding: 16px 24px; text-align: center; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(30, 58, 95, 0.3);">Protect Your Revenue →</a>
                                        
                                        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 32px;">
                                            Don't leave money on the table. RentClock helps you catch 100% of scheduled rent increases.
                                        </p>
                                    </div>
                                </div>
                                <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 11px; line-height: 18px;">
                                    <p style="margin: 0;">&copy; 2026 RentClock. All rights reserved.</p>
                                    <p style="margin: 4px 0;">Martin Vasko, Ulica Jozefa Adamca 9983/24, 917 01 Trnava, Slovakia</p>
                                    <p style="margin: 4px 0;">You are receiving this because you enabled lease alerts on RentClock.</p>
                                    <p style="margin: 8px 0;">
                                        <a href="${appUrl}/settings" style="color: #64748b; text-decoration: underline;">Unsubscribe</a> or 
                                        <a href="${appUrl}/settings" style="color: #64748b; text-decoration: underline;">Manage Preferences</a>
                                    </p>
                                </div>
                            </div>
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
