"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export type CreateLeaseState = {
    message?: string;
    error?: string;
    success?: boolean;
}

export async function createLease(prevState: CreateLeaseState, formData: FormData): Promise<CreateLeaseState> {
    const { userId } = await auth();

    if (!userId) {
        return { error: "Unauthorized" };
    }

    // 1. Fetch User Status & Lease Count
    let { data: userProfile, error: profileError } = await supabaseAdmin
        .from("users")
        .select("is_pro")
        .eq("id", userId)
        .single();

    // JIT User Creation (Self-healing)
    if (!userProfile) {
        try {
            const { currentUser } = await import("@clerk/nextjs/server");
            const clerkUser = await currentUser();

            if (clerkUser) {
                const email = clerkUser.emailAddresses[0]?.emailAddress || "";

                const { error: createError } = await supabaseAdmin
                    .from("users")
                    .insert({
                        id: userId,
                        email: email,
                        is_pro: false,
                        created_at: new Date().toISOString()
                    });

                if (!createError) {
                    userProfile = { is_pro: false }; // success
                } else {
                    console.error("Failed to auto-create user:", createError);
                }
            }
        } catch (err) {
            console.error("JIT user creation failed:", err);
        }
    }

    if (!userProfile) {
        // Double check if it was a real connection error or just missing
        if (profileError && profileError.code !== "PGRST116") {
            return { error: "Failed to fetch user profile" };
        }
        // If still missing after JIT attempt, we can't proceed due to FK constraints usually
        return { error: "User account not fully synchronized. Please try again in a moment." };
    }

    const { count, error: countError } = await supabaseAdmin
        .from("leases")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

    if (countError) {
        return { error: "Failed to validate lease limits" };
    }

    // 2. Enforce Limit
    const isPro = userProfile.is_pro || false;
    const currentCount = count || 0;

    if (!isPro && currentCount >= 3) {
        return { error: "Lease limit reached. Upgrade to Pro to add more properties." };
    }

    // 3. Parse Data
    // We expect the client to pass raw values, we'll sanitize slightly here
    const rawData = {
        tenant_name: formData.get("tenant_name") as string,
        property_address: formData.get("property_address") as string,
        monthly_rent: parseFloat(formData.get("monthly_rent") as string) || null,
        rent_increase_amount: parseFloat(formData.get("rent_increase_amount") as string) || null,
        lease_start_date: formData.get("lease_start_date") as string || null,
        lease_end_date: formData.get("lease_end_date") as string || null,
        rent_increase_date: formData.get("rent_increase_date") as string || null,
        notice_period_days: 60, // Default fixed for now
        reminder_90_days_email: formData.get("reminder_90_days_email") === "true",
        reminder_60_days_email: formData.get("reminder_60_days_email") === "true",
        reminder_30_days_email: formData.get("reminder_30_days_email") === "true",
        reminder_7_days_email: formData.get("reminder_7_days_email") === "true",
        reminder_90_days_sms: formData.get("reminder_90_days_sms") === "true",
        reminder_60_days_sms: formData.get("reminder_60_days_sms") === "true",
        reminder_30_days_sms: formData.get("reminder_30_days_sms") === "true",
        reminder_7_days_sms: formData.get("reminder_7_days_sms") === "true",
        pdf_url: formData.get("pdf_url") as string || null,
    };

    // 4. Insert Lease
    const { error: insertError } = await supabaseAdmin
        .from("leases")
        .insert({
            user_id: userId,
            ...rawData
        });

    if (insertError) {
        console.error("Insert error:", insertError);
        return { error: "Failed to save lease record." };
    }

    revalidatePath("/dashboard");
    revalidatePath("/leases");

    return { success: true, message: "Lease secured successfully." };
}
