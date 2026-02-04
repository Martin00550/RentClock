import { DashboardStats } from "@/components/dashboard/stats";
import { ImminentCriticalDates } from "@/components/dashboard/critical-dates";
import { ReferralCTA } from "@/components/dashboard/referral-cta";
import { ReferralClaimer } from "@/components/dashboard/referral-claimer";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Lease } from "@/lib/types";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error("CRITICAL: Supabase environment variables are missing!");
    }

    // Parallel Fetching: Leases + User Profile
    const [leasesRes, profileRes] = await Promise.all([
        supabaseAdmin.from("leases").select("*").eq("user_id", userId),
        supabaseAdmin.from("users").select("referral_code, bonus_leases, is_pro").eq("id", userId).single()
    ]);

    const leases = (leasesRes.data as Lease[]) || [];
    const userProfile = profileRes.data;

    // JIT Referral Code Generation
    let referralCode = userProfile?.referral_code;
    if (userProfile && !referralCode) {
        // Generate a simple unique code: RC-[RANDOM]
        const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
        referralCode = `RC-${randomPart}`;

        // Update DB
        const { error: updateError } = await supabaseAdmin
            .from("users")
            .update({ referral_code: referralCode })
            .eq("id", userId);

        if (updateError) {
            console.error("Failed to generate referral code", updateError);
        }
    }

    const isPro = userProfile?.is_pro || false;
    const bonusLeases = userProfile?.bonus_leases || 0;

    return (
        <div className="flex flex-col gap-10">
            <ReferralClaimer />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Portfolio Safety Net</h1>
                    <p className="text-slate-500 text-base md:text-lg font-medium">Protecting your properties from the invisible bleed.</p>
                </div>
                <Link href="/ai-import" className="w-full md:w-auto" id="dashboard-quick-add">
                    <Button className="w-full md:w-auto bg-[#1e3a5f] hover:bg-[#2a4a73] text-white px-8 h-12 md:h-14 rounded-2xl font-bold font-display text-base md:text-lg shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 transition-all">
                        <Plus className="h-5 w-5 md:h-6 md:w-6" strokeWidth={3} />
                        Protect a New Lease
                    </Button>
                </Link>
            </div>

            {/* PROFIT PROTECTION TEASER */}
            <div className="bg-linear-to-r from-[#1e3a5f] to-[#2a4a73] p-6 md:p-10 rounded-3xl text-white relative overflow-hidden shadow-2xl shadow-[#1e3a5f]/20 group cursor-pointer transition-transform hover:scale-[1.01]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
                    <div className="space-y-4 max-w-xl">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#d4a853] p-1.5 rounded-lg">
                                <TrendingUp className="h-4 w-4 text-[#1e3a5f]" />
                            </div>
                            <span className="text-[#d4a853] font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">Safety Net Armed</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                            You have <span className="text-[#d4a853] border-b-4 border-[#d4a853]/30">Revenue at Risk</span>.
                        </h2>
                        <p className="text-white/70 font-medium text-base md:text-lg">
                            Inflation has risen by 3.4% this year. Check which leases are eligible for a rent adjustment.
                        </p>
                    </div>

                    <Link href="/profit-protection" className="w-full md:w-auto">
                        <Button className="w-full md:w-auto h-14 md:h-16 px-8 rounded-2xl bg-white text-[#1e3a5f] font-black text-base md:text-lg hover:bg-slate-100 transition-colors shadow-lg shadow-black/20 group-hover:shadow-white/10">
                            View Opportunities <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>

            <DashboardStats leases={leases} />

            {/* REFERRAL SYSTEM */}
            {referralCode && (
                <ReferralCTA
                    referralCode={referralCode}
                    isPro={isPro}
                    bonusLeases={bonusLeases}
                />
            )}

            <ImminentCriticalDates leases={leases} />
        </div>
    );
}
