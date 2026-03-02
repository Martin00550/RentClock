import { supabaseAdmin } from "@/lib/supabase-admin";
import { currentUser } from "@clerk/nextjs/server";

export async function getOrCreateUserProfile(userId: string) {
    if (!supabaseAdmin) {
        return { user: null, error: "Database connection not available" };
    }

    // 1. Try to fetch existing
    const { data: userProfile, error: profileError } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

    if (userProfile && !profileError) {
        return { user: userProfile, error: null };
    }

    // 2. If missing, attempt JIT creation
    if (!userProfile) {
        try {
            const clerkUser = await currentUser();

            if (clerkUser) {
                const email = clerkUser.emailAddresses[0]?.emailAddress || "";

                const { data: newUser, error: createError } = await supabaseAdmin
                    .from("users")
                    .insert({
                        id: userId,
                        email: email,
                        is_pro: false,
                        created_at: new Date().toISOString()
                    })
                    .select()
                    .single();

                if (!createError && newUser) {
                    return { user: newUser, error: null };
                } else {
                    console.error("Failed to auto-create user:", createError);
                    return { user: null, error: "Failed to create user record" };
                }
            }
        } catch (err) {
            console.error("JIT user creation failed:", err);
            return { user: null, error: "Authentication system error" };
        }
    }

    return { user: null, error: "User not found" };
}
