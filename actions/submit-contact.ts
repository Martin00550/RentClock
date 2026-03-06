"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export async function submitContactForm(formData: {
    name: string;
    email: string;
    message: string;
}) {
    if (!supabaseAdmin) {
        return { success: false, error: "Database not available" };
    }

    const { name, email, message } = formData;

    const { error } = await supabaseAdmin.from("contact_submissions").insert({
        name,
        email,
        message,
    });

    if (error) {
        console.error("Contact form error:", error);
        return { success: false, error: "Failed to submit" };
    }

    return { success: true };
}
