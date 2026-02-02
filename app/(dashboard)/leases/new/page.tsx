import { AddLeaseForm } from "@/components/leases/add-lease-form";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { redirect } from "next/navigation";

export default async function NewLeasePage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    // Fetch lease count and user profile
    const [leasesRes, userRes] = await Promise.all([
        supabaseAdmin.from("leases").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabaseAdmin.from("users").select("is_pro, bonus_leases").eq("id", userId).single()
    ]);

    const leaseCount = leasesRes.count || 0;
    const isPro = userRes.data?.is_pro || false;
    const bonusLeases = userRes.data?.bonus_leases || 0;

    return (
        <div className="mx-auto max-w-6xl">
            <AddLeaseForm leaseCount={leaseCount} isPro={isPro} bonusLeases={bonusLeases} />
        </div>
    );
}
