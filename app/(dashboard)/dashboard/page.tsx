import { DashboardStats } from "@/components/dashboard/stats";
import { ImminentCriticalDates } from "@/components/dashboard/critical-dates";
import { ReferralCTA } from "@/components/dashboard/referral-cta";
import { ReferralClaimer } from "@/components/dashboard/referral-claimer";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, ArrowRight, ShieldCheck } from "lucide-react";
import { WealthProjectionCard } from "@/components/dashboard/wealth-projection-card";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Lease } from "@/lib/types";
import { redirect } from "next/navigation";
import { differenceInDays, parseISO, isPast, isFuture } from "date-fns";
import { fetchCPIStats } from "@/lib/cpi";
import { calculateAtRiskAmount, formatCurrency } from "@/lib/lease-utils";

export default async function DashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error("CRITICAL: Supabase environment variables are missing!");
    }

    // Parallel Fetching: Leases + User Profile
    const [leasesRes, profileRes] = (supabaseAdmin)
        ? await Promise.all([
            supabaseAdmin.from("leases").select("*").eq("user_id", userId),
            supabaseAdmin.from("users").select("referral_code, bonus_leases, is_pro").eq("id", userId).single()
        ])
        : [{ data: [], error: null }, { data: null, error: null }];

    const leases = (leasesRes.data as Lease[]) || [];
    const userProfile = profileRes.data;

    // JIT Referral Code Generation
    let referralCode = userProfile?.referral_code;
    if (userProfile && !referralCode) {
        // Generate a simple unique code: RC-[RANDOM]
        const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
        referralCode = `RC-${randomPart}`;

        // Update DB
        if (supabaseAdmin) {
            const { error: updateError } = await supabaseAdmin
                .from("users")
                .update({ referral_code: referralCode })
                .eq("id", userId);

            if (updateError) {
                console.error("Failed to generate referral code", updateError);
            }
        }
    }

    const isPro = userProfile?.is_pro || false;
    const bonusLeases = userProfile?.bonus_leases || 0;

    // Fetch CPI Stats
    const { yoyChange } = await fetchCPIStats();
    const inflationRate = (yoyChange * 100).toFixed(1);

    // --- SAFETY NET LOGIC ---
    let portfolioStatus: 'empty' | 'at_risk' | 'protected' = 'empty';

    if (leases.length > 0) {
        // Assume protected first, check for risks
        portfolioStatus = 'protected';

        const hasRisk = leases.some(lease => {
            // Case 1: Rent Increase Date is in the past (Immediate Risk)
            if (lease.rent_increase_date && isPast(parseISO(lease.rent_increase_date)) && !isFuture(parseISO(lease.rent_increase_date))) {
                return true; // Risk found
            }

            // Case 2: No Increase Date AND Lease > 1 year old (Stale Pricing)
            if (!lease.rent_increase_date && lease.lease_start_date) {
                const start = parseISO(lease.lease_start_date);
                if (differenceInDays(new Date(), start) > 365) {
                    return true; // Risk found
                }
            }

            // Case 3: No valid dates at all but active? (Edge case, treat as neutral but here strict)
            return false;
        });

        if (hasRisk) {
            portfolioStatus = 'at_risk';
        }
    }

    const atRiskAmount = calculateAtRiskAmount(leases, yoyChange);

    const protectedCount = leases.filter(lease => {
        // Rent Increase Date in past => risk
        if (lease.rent_increase_date && isPast(parseISO(lease.rent_increase_date)) && !isFuture(parseISO(lease.rent_increase_date))) {
            return false;
        }
        // No increase date and lease > 1yr old => risk
        if (!lease.rent_increase_date && lease.lease_start_date) {
            const start = parseISO(lease.lease_start_date);
            if (differenceInDays(new Date(), start) > 365) {
                return false;
            }
        }
        return true;
    }).length;

    return (
        <div className="flex flex-col gap-10">
            <ReferralClaimer />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Portfolio Safety Net</h1>
                    <p className="text-slate-500 text-base md:text-lg font-medium">Protecting your properties from the invisible bleed.</p>
                </div>
                <Link href="/quick-add" className="w-full md:w-auto" id="dashboard-quick-add">
                    <Button className="w-full md:w-auto bg-[#1e3a5f] hover:bg-[#2a4a73] text-white px-8 h-12 md:h-14 rounded-2xl font-bold font-display text-base md:text-lg shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 transition-all">
                        <Plus className="h-5 w-5 md:h-6 md:w-6" strokeWidth={3} />
                        Protect a New Lease
                    </Button>
                </Link>
            </div>

            {/* DYNAMIC SAFETY NET BANNER */}
            {/* EMPTY STATE */}
            {portfolioStatus === 'empty' && (
                <div id="dashboard-safety-net-empty" className="bg-slate-50 border-2 border-slate-200 border-dashed p-6 md:p-10 rounded-premium text-slate-800 relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
                        <div className="space-y-4 max-w-xl">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-200 p-1.5 rounded-lg">
                                    <ShieldCheck className="h-4 w-4 text-slate-500" />
                                </div>
                                <span className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">Safety Net Inactive</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-slate-800">
                                Arm your <span className="text-[#1e3a5f]">Safety Net</span>.
                            </h2>
                            <p className="text-slate-500 font-medium text-base md:text-lg">
                                Add your first lease to start tracking revenue risks and critical dates automatically.
                            </p>
                        </div>
                        <Link href="/quick-add" className="w-full md:w-auto">
                            <Button className="w-full md:w-auto h-14 md:h-16 px-8 rounded-2xl bg-[#1e3a5f] text-white font-black text-base md:text-lg hover:bg-[#2a4a73] transition-colors shadow-lg shadow-[#1e3a5f]/20">
                                Add First Property <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {/* AT RISK STATE */}
            {portfolioStatus === 'at_risk' && (
                <div id="dashboard-safety-net-risk" className="bg-linear-to-br from-[#1e3a5f] via-[#2a4a73] to-[#d4a853] p-6 md:p-10 rounded-premium text-white relative overflow-hidden shadow-2xl shadow-indigo-900/40 group cursor-pointer transition-transform hover:scale-[1.01]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#d4a853]/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
                        <div className="space-y-4 max-w-xl">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
                                    <TrendingUp className="h-4 w-4 text-[#d4a853]" />
                                </div>
                                <span className="text-[#d4a853] font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">Safety Net Warning</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                                You have <span className="text-white border-b-4 border-[#d4a853]/50">{formatCurrency(atRiskAmount)} in potential rent increases</span> at risk.
                            </h2>
                            <p className="text-white/90 font-medium text-base md:text-lg">
                                Inflation has risen by {inflationRate}% this year. Check which leases are eligible for a rent adjustment.
                            </p>
                        </div>
                        <Link href="/profit-protection" className="w-full md:w-auto">
                            <Button className="w-full md:w-auto h-14 md:h-16 px-8 rounded-2xl bg-[#d4a853] text-[#1e3a5f] font-black text-base md:text-lg hover:bg-white hover:text-[#1e3a5f] transition-all shadow-lg shadow-black/20 group-hover:shadow-[#d4a853]/30 border-2 border-[#d4a853]">
                                View {formatCurrency(atRiskAmount)} in Missed Revenue <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {/* PROTECTED STATE */}
            {portfolioStatus === 'protected' && (
                <div id="dashboard-safety-net-protected" className="bg-linear-to-br from-emerald-700 via-teal-700 to-emerald-600 p-6 md:p-10 rounded-premium text-white relative overflow-hidden shadow-2xl shadow-emerald-900/30 group cursor-pointer transition-transform hover:scale-[1.01]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
                        <div className="space-y-4 max-w-xl">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
                                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                                </div>
                                <span className="text-emerald-100 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">Safety Net Active</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                                Portfolio <span className="text-white border-b-4 border-emerald-400/30">Protected</span>.
                            </h2>
                            <p className="text-white/90 font-medium text-base md:text-lg">
                                All leases are tracking with market rates. We&apos;ll notify you when the next opportunity arises.
                            </p>
                        </div>
                        <Link href="/profit-protection" className="w-full md:w-auto">
                            <Button className="w-full md:w-auto h-14 md:h-16 px-8 rounded-2xl bg-white text-emerald-900 font-black text-base md:text-lg hover:bg-emerald-50 transition-colors shadow-lg shadow-black/20 group-hover:shadow-white/10">
                                View Portfolio Health <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {leases.length > 0 && (
                <div id="wealth-projection-section">
                    <WealthProjectionCard leases={leases} inflationRate={yoyChange} />
                </div>
            )}

            <DashboardStats leases={leases} protectedCount={protectedCount} />

            <div id="dashboard-critical-dates">
                <ImminentCriticalDates leases={leases} />
            </div>

            {/* REFERRAL SYSTEM */}
            {referralCode && (
                <ReferralCTA
                    referralCode={referralCode}
                    isPro={isPro}
                    bonusLeases={bonusLeases}
                />
            )}

        </div>
    );
}
