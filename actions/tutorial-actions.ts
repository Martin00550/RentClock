"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getCompletedTutorials() {
    try {
        const user = await currentUser();
        if (!user) return { seen_tutorials: [], has_onboarded: false, is_pro: false, has_phone: false };

        const { data, error } = await supabaseAdmin
            .from("users")
            .select("seen_tutorials, has_onboarded, is_pro, phone")
            .eq("id", user.id)
            .single();

        if (error) {
            console.error("Error fetching tutorials:", error);
            return { seen_tutorials: [], has_onboarded: false, is_pro: false, has_phone: false };
        }

        return {
            seen_tutorials: data?.seen_tutorials || [],
            has_onboarded: !!data?.has_onboarded,
            is_pro: !!data?.is_pro,
            has_phone: !!data?.phone
        };
    } catch (err) {
        console.error("Server error fetching tutorials:", err);
        return { seen_tutorials: [], has_onboarded: false, is_pro: false, has_phone: false };
    }
}

export async function markTutorialComplete(tourId: string) {
    try {
        const user = await currentUser();
        if (!user) return { success: false, error: "Unauthorized" };

        // 1. Get current list
        const { data: current, error: fetchError } = await supabaseAdmin
            .from("users")
            .select("seen_tutorials")
            .eq("id", user.id)
            .single();

        if (fetchError) {
            console.error("Error fetching current tutorials:", fetchError);
            return { success: false, error: "Failed to fetch profile" };
        }

        const existing = current?.seen_tutorials || [];
        if (existing.includes(tourId)) {
            return { success: true }; // Already marked
        }

        const updated = [...existing, tourId];

        // 2. Update list
        const { error: updateError } = await supabaseAdmin
            .from("users")
            .update({ seen_tutorials: updated })
            .eq("id", user.id);

        if (updateError) {
            console.error("Error updating tutorials:", updateError);
            return { success: false, error: "Failed to update profile" };
        }

        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        console.error("Server error marking tutorial:", err);
        return { success: false, error: "Server error" };
    }
}

export async function completeOnboardingAction() {
    try {
        const user = await currentUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const { error } = await supabaseAdmin
            .from("users")
            .update({ has_onboarded: true })
            .eq("id", user.id);

        if (error) {
            console.error("Error completing onboarding:", error);
            return { success: false, error: "Failed to update profile" };
        }

        revalidatePath("/dashboard");
        revalidatePath("/", "layout"); // Ensure global layout state updates
        return { success: true };
    } catch (err) {
        console.error("Server error completing onboarding:", err);
        return { success: false, error: "Server error" };
    }
}
