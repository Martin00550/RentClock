import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

export async function updateUserSubscriptionStatus(
    userId: string,
    isPro: boolean,
    paddleCustomerId?: string,
    paddleSubscriptionId?: string
) {
    const { error } = await supabaseAdmin
        .from("users")
        .update({
            is_pro: isPro,
            subscription_status: isPro ? "active" : "canceled",
            ...(paddleCustomerId && { paddle_customer_id: paddleCustomerId }),
            ...(paddleSubscriptionId && { paddle_subscription_id: paddleSubscriptionId })
        })
        .eq("id", userId);

    if (error) {
        console.error("Error updating user subscription status:", error);
        throw error;
    }
}
