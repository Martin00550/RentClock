"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";

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

    // 1. Fetch User Status & Lease Count (with JIT creation)
    const { getOrCreateUserProfile } = await import("@/lib/auth-service");
    const { user: userProfile, error: userError } = await getOrCreateUserProfile(userId);

    if (userError || !userProfile) {
        return { error: userError || "Failed to fetch user profile" };
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

    // 3. Parse Data with Zod
    const { LeaseSchema } = await import("@/lib/schemas");

    // Convert FormData to object for Zod
    const rawData = {
        tenant_name: formData.get("tenant_name"),
        property_address: formData.get("property_address"),
        monthly_rent: formData.get("monthly_rent"),
        rent_increase_amount: formData.get("rent_increase_amount"),
        lease_start_date: formData.get("lease_start_date") || null,
        lease_end_date: formData.get("lease_end_date") || null,
        rent_increase_date: formData.get("rent_increase_date") || null,
        reminder_90_days_email: formData.get("reminder_90_days_email") === "true",
        reminder_60_days_email: formData.get("reminder_60_days_email") === "true",
        reminder_30_days_email: formData.get("reminder_30_days_email") === "true",
        reminder_7_days_email: formData.get("reminder_7_days_email") === "true",
        reminder_90_days_sms: formData.get("reminder_90_days_sms") === "true",
        reminder_60_days_sms: formData.get("reminder_60_days_sms") === "true",
        reminder_30_days_sms: formData.get("reminder_30_days_sms") === "true",
        reminder_7_days_sms: formData.get("reminder_7_days_sms") === "true",
        pdf_url: formData.get("pdf_url") || null,
    };

    const parsed = LeaseSchema.safeParse(rawData);

    if (!parsed.success) {
        logger.error("Validation failed", { errors: parsed.error.format() });
        return { error: "Invalid lease data. Please check expected fields." };
    }

    const leaseData = parsed.data;

    // 4. Insert Lease
    const { error: insertError } = await supabaseAdmin
        .from("leases")
        .insert({
            user_id: userId,
            ...leaseData
        });

    if (insertError) {
        logger.error("Insert error in createLease", { error: insertError, userId });
        return { error: "Failed to save lease record." };
    }

    revalidatePath("/dashboard");
    revalidatePath("/leases");

    return { success: true, message: "Lease secured successfully." };
}
