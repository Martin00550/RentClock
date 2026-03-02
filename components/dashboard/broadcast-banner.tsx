import { supabaseAdmin } from "@/lib/supabase-admin";
import { AlertTriangle } from "lucide-react";

export async function BroadcastBanner() {
    if (!supabaseAdmin) return null;

    // Server Component Fetch
    const { data } = await supabaseAdmin
        .from("system_settings")
        .select("value, is_active")
        .eq("key", "global_broadcast_message")
        .single();

    if (!data?.is_active || !data?.value) return null;

    return (
        <div className="bg-indigo-600 text-white px-4 py-3 text-center text-sm font-bold flex items-center justify-center gap-2 shadow-sm animate-in slide-in-from-top duration-500 relative z-50">
            <AlertTriangle className="h-4 w-4" />
            {data.value}
        </div>
    );
}
