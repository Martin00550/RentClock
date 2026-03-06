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

const MAX_FREE_LEASES = 3;

async function checkLeaseLimit(userId: string): Promise<{ allowed: boolean; currentCount: number; error?: string }> {
    if (!supabaseAdmin) {
        return { allowed: false, currentCount: 0, error: "Database not available" };
    }

    try {
        const { count, error: countError } = await supabaseAdmin
            .from("leases")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId);

        if (countError) {
            logger.error("Failed to count leases", { userId, error: countError });
            return { allowed: false, currentCount: 0, error: "Failed to validate lease limits" };
        }

        const currentCount = count || 0;
        return { allowed: true, currentCount };
    } catch (error) {
        logger.error("Error in checkLeaseLimit", { userId, error });
        const { count } = await supabaseAdmin
            .from("leases")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId);
        return { allowed: true, currentCount: count || 0 };
    }
}

export async function createLease(prevState: CreateLeaseState, formData: FormData): Promise<CreateLeaseState> {
    const { userId } = await auth();

    if (!userId) {
        return { error: "Unauthorized" };
    }

    // 1. Fetch User Status (with JIT creation)
    const { getOrCreateUserProfile } = await import("@/lib/auth-service");
    const { user: userProfile, error: userError } = await getOrCreateUserProfile(userId);

    if (userError || !userProfile) {
        return { error: userError || "Failed to fetch user profile" };
    }

    // 2. Check if user is Pro (pro users bypass limit)
    const isPro = userProfile.is_pro || false;

    if (!isPro) {
        // Check lease limit with locking to prevent race conditions
        const { allowed, currentCount, error: limitError } = await checkLeaseLimit(userId);

        if (limitError) {
            return { error: limitError };
        }

        if (!allowed) {
            logger.warn("Lease limit check failed", { userId });
            return { error: "Failed to validate lease limits" };
        }

        // Calculate effective limit including bonus leases
        const bonusLeases = userProfile.bonus_leases || 0;
        const effectiveLimit = MAX_FREE_LEASES + bonusLeases;

        if (currentCount >= effectiveLimit) {
            logger.warn("Lease limit exceeded", { 
                userId, 
                currentCount, 
                effectiveLimit,
                bonusLeases 
            });
            return { error: "Lease limit reached. Upgrade to Pro to add more properties." };
        }
    }

    // 3. Parse Data with Zod
    const { LeaseSchema } = await import("@/lib/schemas");

    // Convert FormData to object for Zod
    const rawData = {
        tenant_name: formData.get("tenant_name"),
        tenant_email: formData.get("tenant_email") || null,
        tenant_phone: formData.get("tenant_phone") || null,
        property_name: formData.get("property_name") || null,
        property_address: formData.get("property_address"),
        state: formData.get("state") || null,
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
    if (!supabaseAdmin) return { error: "Database not available" };

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
