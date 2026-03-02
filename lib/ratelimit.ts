import { supabaseAdmin } from "@/lib/supabase-admin";

export async function checkRateLimit(identifier: string, limit: number = 10, windowSeconds: number = 3600): Promise<{ success: boolean; limit: number; remaining: number }> {
    const key = `ratelimit:${identifier}`;
    const now = new Date();

    // 1. Get current count
    if (!supabaseAdmin) {
        return { success: true, limit, remaining: limit };
    }
    const { data, error } = await supabaseAdmin
        .from("rate_limits")
        .select("*")
        .eq("key", key)
        .single();

    if (error && error.code !== "PGRST116") { // Ignore "Row not found" error
        console.error("Rate limit check error:", error);
        return { success: true, limit, remaining: limit }; // Fail open if DB error
    }

    // 2. If no record, create one
    if (!data) {
        await supabaseAdmin.from("rate_limits").insert({ key, count: 1, last_request: now.toISOString() });
        return { success: true, limit, remaining: limit - 1 };
    }

    // 3. Check for window expiration (reset if needed)
    const lastRequest = new Date(data.last_request);
    const timeDiffSeconds = (now.getTime() - lastRequest.getTime()) / 1000;

    if (timeDiffSeconds > windowSeconds) {
        // Window expired, reset count
        await supabaseAdmin.from("rate_limits").update({ count: 1, last_request: now.toISOString() }).eq("key", key);
        return { success: true, limit, remaining: limit - 1 };
    }

    // 4. Check limit
    if (data.count >= limit) {
        return { success: false, limit, remaining: 0 };
    }

    // 5. Increment
    await supabaseAdmin.from("rate_limits").update({ count: data.count + 1, last_request: now.toISOString() }).eq("key", key);
    return { success: true, limit, remaining: limit - (data.count + 1) };
}
