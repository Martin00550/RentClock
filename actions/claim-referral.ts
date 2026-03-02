"use server";

import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function claimReferral() {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };
    if (!supabaseAdmin) return { error: "Database not available" };

    const cookieStore = await cookies();
    const refCode = cookieStore.get("rentclock_ref")?.value;

    if (!refCode) return { success: false, message: "No referral cookie found" };

    try {
        // 1. Check if user already has a referrer
        const { data: userProfile, error: profileError } = await supabaseAdmin
            .from("users")
            .select("referred_by")
            .eq("id", userId)
            .single();

        if (profileError || userProfile?.referred_by) {
            // Already referred or error
            return { success: false, message: "Already referred" };
        }

        // 2. Find the referrer by code
        const { data: referrer, error: referrerError } = await supabaseAdmin
            .from("users")
            .select("id, bonus_leases")
            .eq("referral_code", refCode)
            .single();

        if (referrerError || !referrer) {
            return { success: false, message: "Invalid referral code" };
        }

        // 3. Prevent self-referral
        if (referrer.id === userId) {
            return { success: false, message: "Cannot refer yourself" };
        }

        // 4. Update Referrer (+1 Bonus Lease)
        const newBonus = (referrer.bonus_leases || 0) + 1;
        await supabaseAdmin
            .from("users")
            .update({ bonus_leases: newBonus })
            .eq("id", referrer.id);

        // 5. Update Current User (Set referred_by)
        await supabaseAdmin
            .from("users")
            .update({ referred_by: referrer.id })
            .eq("id", userId);

        // 6. Clear Cookie
        // Note: You can't delete cookies in a Server Action called from a Client Component easily 
        // without returning a directive, but often we just leave it or let middleware handle expiration.
        // Ideally, we'd delete it, but for now we just mark the DB.

        revalidatePath("/dashboard");
        return { success: true, message: "Referral claimed" };

    } catch (error) {
        console.error("Referral claim error:", error);
        return { error: "Internal server error" };
    }
}
