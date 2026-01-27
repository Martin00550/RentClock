"use server";

import { resend } from "@/lib/resend";

export async function sendTestEmail() {
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'vaskomartin3@gmail.com',
            subject: 'Hello World',
            html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
        });

        return { success: true, data };
    } catch (error) {
        return { success: false, error };
    }
}
