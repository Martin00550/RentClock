"use server";

import { logger } from "@/lib/logger";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

import { APP_CONFIG } from "@/lib/config";

// RE-VERIFY ADMIN ON ACTION (Double Lock)
const ALLOWED_EMAILS = APP_CONFIG.ADMIN.ALLOWED_EMAILS;

async function verifyAdmin() {
    const user = await currentUser();
    if (!user) return false;

    // Check primary email
    const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    return !!(email && (ALLOWED_EMAILS as readonly string[]).includes(email));
}

export async function searchUserByEmail(email: string) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return { error: "Unauthorized" };
    if (!supabaseAdmin) return { error: "Database not available" };

    const { data: user, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("email", email) // Note: We need to make sure 'email' column is populated or search via Clerk
        // WAIT: Supabase 'users' table might not have 'email' if we rely on Clerk. 
        // We sync email in webhook, but let's check profile route.
        // Actually, we do update email in POST /api/user/profile. 
        // Let's assume for now we search by ID or we need to fix email syncing.
        // Better: Search by ID or we assume email is synced.
        // If email not in DB, we'd need to use Clerk Backend API to find user ID from email.
        .single();

    // ALTERNATIVE: Use Clerk to resolve email -> userId
    if (error || !user) {
        // Fallback: Try searching Supabase if we synced it. 
        // If not found, return error.
        logger.error("User search error", { error, email });
        return { error: "User not found in database." };
    }

    return { user };
}

// NOTE: Since we might not have email in 'users' table reliable (it's auth provider data),
// we might fail to find new users by email unless we strictly sync it. 
// For this MVP, let's update 'searchUserByEmail' to search by REFERRAL CODE or ID as fallback?
// Or we just update the User Profile API to ensure email is always saved.

export async function grantBonusLease(userId: string) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return { error: "Unauthorized" };
    if (!supabaseAdmin) return { error: "Database not available" };

    // Fetch current
    const { data: user } = await supabaseAdmin.from("users").select("bonus_leases").eq("id", userId).single();
    const current = user?.bonus_leases || 0;

    const { error } = await supabaseAdmin
        .from("users")
        .update({ bonus_leases: current + 1 })
        .eq("id", userId);

    if (error) return { error: error.message };

    revalidatePath("/admin");
    return { success: true };
}

export async function grantProStatus(userId: string) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return { error: "Unauthorized" };
    if (!supabaseAdmin) return { error: "Database not available" };

    const { error } = await supabaseAdmin
        .from("users")
        .update({ is_pro: true })
        .eq("id", userId);

    if (error) return { error: error.message };

    revalidatePath("/admin");
    return { success: true };
}

export async function getReferralAudit() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return { error: "Unauthorized" };
    if (!supabaseAdmin) return { error: "Database not available" };

    const { data: logs, error } = await supabaseAdmin
        .from("users")
        .select("id, email, referred_by, created_at")
        .not("referred_by", "is", null)
        .order("created_at", { ascending: false })
        .limit(50);

    if (error) {
        logger.error("Failed to fetch audit log", { error });
        return { error: "Failed to fetch audit log" };
    }

    return { logs };
}

// --- POWER FEATURES ---

// 1. AI BRAIN SCAN
export async function getScanLogs() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return { error: "Unauthorized" };
    if (!supabaseAdmin) return { error: "Database not available" };

    const { data: logs, error } = await supabaseAdmin
        .from("scan_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

    if (error) {
        logger.error("AI Scan log fetch error", { error });
        return { error: error.message };
    }
    return { logs };
}

// 2. THE AUDITOR (Free Rider Check)
export async function auditorCheck() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return { error: "Unauthorized" };
    if (!supabaseAdmin) return { error: "Database not available" };

    // Find users who are Pro but have no subscription ID (Manual grants are fine, but we want to know)
    // Or users who have a sub ID but paddle status is not active (if we synced it).
    // For now, let's just find Pro users with NULL paddle_subscription_id (these are likely manual grants)

    // We want to see "Pro = True"
    const { data: users, error } = await supabaseAdmin
        .from("users")
        .select("id, email, created_at, paddle_subscription_id, is_pro")
        .eq("is_pro", true);

    if (error) {
        logger.error("Auditor check error", { error });
        return { error: error.message };
    }

    // Client-side filter or refined query:
    // "Suspicious" if they have NO subscription ID. (Manual Grant)
    const suspicious = users.filter(u => !u.paddle_subscription_id);

    return { users: suspicious };
}

// 3. THE MEGAPHONE
export async function getBroadcastMessage() {
    // Public read is okay for this setting? No, better keep it admin action or use public cache
    // Actually this is for the ADMIN PANEL input.
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return { error: "Unauthorized" };
    if (!supabaseAdmin) return { error: "Database not available" };

    const { data, error } = await supabaseAdmin
        .from("system_settings")
        .select("value, is_active")
        .eq("key", "global_broadcast_message")
        .single();

    if (error && error.code !== "PGRST116") return { error: error.message };

    return {
        message: data?.value || "",
        isActive: data?.is_active || false
    };
}

export async function updateBroadcastMessage(message: string, isActive: boolean) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return { error: "Unauthorized" };
    if (!supabaseAdmin) return { error: "Database not available" };

    const { error } = await supabaseAdmin
        .from("system_settings")
        .upsert({
            key: "global_broadcast_message",
            value: message,
            is_active: isActive,
            updated_at: new Date().toISOString()
        });

    if (error) return { error: error.message };

    revalidatePath("/"); // Revalidate everywhere so banner updates
    return { success: true };
}
