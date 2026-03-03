"use server";

import { resend } from "@/lib/resend";

export async function sendTestEmail(toEmail?: string) {
    if (!resend) {
        return { success: false, error: "Email service not configured (missing RESEND_API_KEY)" };
    }

    try {
        const data = await resend.emails.send({
            from: "RentClock <alerts@rentclock.online>",
            to: toEmail || 'vaskomartin3@gmail.com',
            subject: '🔔 RentClock Test Alert',
            html: `
                <div style="font-family: 'Inter', sans-serif; background-color: #f8fafc; padding: 40px; color: #1e293b;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <div style="background-color: #1e3a5f; padding: 32px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Test Notification</h1>
                        </div>
                        <div style="padding: 40px;">
                            <p style="font-size: 16px; line-height: 24px; margin-bottom: 24px;">Your RentClock email integration is working perfectly!</p>
                            
                            <div style="background-color: #f1f5f9; padding: 24px; border-radius: 16px; margin-bottom: 32px;">
                                <div style="margin-bottom: 4px;">
                                    <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b;">Status</span>
                                    <div style="font-size: 18px; font-weight: 900; color: #2d6a4f;">Active & Verified</div>
                                </div>
                            </div>

                            <a href="https://rentclock.online/dashboard" style="display: block; background-color: #1e3a5f; color: #ffffff; padding: 16px 24px; text-align: center; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(30, 58, 95, 0.3);">Go to Dashboard →</a>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 11px; line-height: 18px;">
                        <p style="margin: 0;">&copy; 2026 RentClock. All rights reserved.</p>
                        <p style="margin: 4px 0;">Martin Vasko, Ulica Jozefa Adamca 9983/24, 917 01 Trnava, Slovakia</p>
                        <p style="margin: 8px 0;">
                            <a href="https://rentclock.online/settings" style="color: #64748b; text-decoration: underline;">Unsubscribe</a>
                        </p>
                    </div>
                </div>
            `
        });

        return { success: true, data };
    } catch (error) {
        return { success: false, error };
    }
}
