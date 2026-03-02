"use server";

import { logger } from "@/lib/logger";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { APP_CONFIG } from "@/lib/config";

const ALLOWED_EMAILS = APP_CONFIG.ADMIN.ALLOWED_EMAILS;

async function verifyAdmin() {
    const user = await currentUser();
    if (!user) return false;

    const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    return !!(email && (ALLOWED_EMAILS as readonly string[]).includes(email));
}

export type HealthStats = {
    ai_success_rate_24h: number; // 0-100
    active_subscribers: number;
    sticky_users: number; // Users with > 1 active lease
    users_at_limit: number; // Free users with >= 3 leases
};

export async function getHealthStats(): Promise<{ stats?: HealthStats; error?: string }> {
    if (!supabaseAdmin) return { error: "Database not available" };
    try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) return { error: "Unauthorized" };

        const stats: HealthStats = {
            ai_success_rate_24h: 0,
            active_subscribers: 0,
            sticky_users: 0,
            users_at_limit: 0
        };

        // 1. AI SUCCESS RATE (Last 24 hours)
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data: logs, error: logsError } = await supabaseAdmin
            .from("scan_logs")
            .select("status")
            .gte("created_at", yesterday);

        if (!logsError && logs && logs.length > 0) {
            const successCount = logs.filter(l => l.status === "success").length;
            stats.ai_success_rate_24h = Math.round((successCount / logs.length) * 100);
        }

        // 2. ACTIVE SUBSCRIBERS
        const { count: subCount, error: subError } = await supabaseAdmin
            .from("users")
            .select("*", { count: "exact", head: true })
            .eq("is_pro", true);

        if (!subError) stats.active_subscribers = subCount || 0;

        // 3. STICKY USERS (Query is complex on simplified schema, doing simple fetch)
        // Ideally: SELECT count(*) FROM users WHERE (select count(*) from leases where user_id = users.id) > 1
        // Simplified: Fetch all leases, group in memory (Not scalable for 10k users, fine for <500)
        // SCALABLE ALTERNATIVE: RPC function.
        // For MVP: We will skip or do a rough heuristic if needed. 
        // Better: Let's create an RPC function later. For now, we will query limited leases.

        const { data: activeLeases } = await supabaseAdmin
            .from("leases")
            .select("user_id");

        if (activeLeases) {
            const userCounts: Record<string, number> = {};
            activeLeases.forEach(l => {
                userCounts[l.user_id] = (userCounts[l.user_id] || 0) + 1;
            });

            stats.sticky_users = Object.values(userCounts).filter(c => c > 1).length;
        }

        return { stats };

    } catch (error) {
        logger.error("Failed to fetch health stats", { error });
        return { error: "Failed to fetch stats" };
    }
}
