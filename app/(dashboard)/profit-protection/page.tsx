import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, AlertCircle, ArrowRight, DollarSign, BarChart3 } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { redirect } from "next/navigation";
import { formatCurrency, calculateRevenueImpact } from "@/lib/lease-utils";
import { CpiCalculator } from "@/components/leases/cpi-calculator";
import { Lease } from "@/lib/types";
import { ActionMenu } from "@/components/leases/action-menu";

export default async function ProfitProtectionPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const { data: leases, error } = await supabaseAdmin
        .from("leases")
        .select("*")
        .eq("user_id", userId);

    if (error) {
        console.error("Error fetching leases:", error);
    }



    const typedLeases = (leases as Lease[]) || [];

    // Calculate Portfolio Metrics
    const totalPortfolioValue = typedLeases.reduce((sum, lease) => sum + (lease.monthly_rent || 0), 0);
    const totalRevenueOpportunity = typedLeases.reduce((sum, lease) => sum + calculateRevenueImpact(lease), 0);
    const leasesWithOpportunity = typedLeases.filter(lease => calculateRevenueImpact(lease) > 0);

    return (
        <div className="flex flex-col gap-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="bg-[#d4a853]/10 p-2 rounded-xl">
                        <TrendingUp className="h-6 w-6 text-[#d4a853]" />
                    </div>
                    <span className="text-[10px] text-[#d4a853] font-bold uppercase tracking-[0.2em]">Revenue Protection</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Portfolio Safety Net</h1>
                <p className="text-slate-500 text-lg max-w-2xl">
                    Analyze your entire portfolio against inflation. Identify revenue leakage and execute rent adjustments instantly.
                </p>
            </div>



            {/* PORTFOLIO HEALTH GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-[2rem] border-slate-200 shadow-sm bg-[#1e3a5f] text-white">
                    <CardContent className="p-8 flex flex-col gap-4">
                        <div className="bg-white/10 p-3 w-fit rounded-2xl">
                            <DollarSign className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <span className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em]">Annual Revenue at Risk</span>
                            <div className="text-4xl font-black text-white mt-2 tracking-tight">+{formatCurrency(totalRevenueOpportunity)}<span className="text-lg text-white/40 font-bold ml-1">/yr</span></div>
                        </div>
                        <div className="mt-auto pt-4 border-t border-white/10">
                            <p className="text-xs text-white/80 font-medium">
                                Potential gains from pending CPI adjustments across {leasesWithOpportunity.length} leases.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-slate-200 shadow-sm">
                    <CardContent className="p-8 flex flex-col gap-4">
                        <div className="bg-slate-100 p-3 w-fit rounded-2xl">
                            <BarChart3 className="h-6 w-6 text-slate-600" />
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Portfolio Base Rent</span>
                            <div className="text-4xl font-black text-slate-900 mt-2 tracking-tight">{formatCurrency(totalPortfolioValue)}<span className="text-lg text-slate-400 font-bold ml-1">/mo</span></div>
                        </div>
                        <div className="mt-auto pt-4 border-t border-slate-100">
                            <p className="text-xs text-slate-500 font-medium">
                                Total monthly volume currently under management.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-slate-200 shadow-sm bg-linear-to-br from-indigo-50 to-white">
                    <CardContent className="p-8 flex flex-col gap-4 h-full">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
                            <span className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em]">Live Market Signal</span>
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                            <p className="text-2xl font-black text-indigo-950 leading-tight">
                                CPI-U Index is trending <span className="text-indigo-600">Upwards</span>.
                            </p>
                            <p className="text-sm text-indigo-800/60 mt-2 font-medium">
                                Inflation is currently outpacing fixed 3% increases in 4 regions.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* ACTIONABLE LEASES LIST */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        Revenue Leakage Detected
                    </h3>
                    <div className="flex flex-col gap-4 relative">

                        {typedLeases.length === 0 ? (
                            <Card className="rounded-3xl border-slate-200 p-8 text-center bg-slate-50/50">
                                <p className="text-slate-500 mb-6">Our automated system monitors this 24/7. &quot;Set it and forget it&quot; peace of mind.</p>
                            </Card>
                        ) : leasesWithOpportunity.length > 0 ? (
                            leasesWithOpportunity.map(lease => {
                                const impact = calculateRevenueImpact(lease);
                                return (
                                    <div key={lease.id} className="relative group">
                                        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ActionMenu lease={lease} />
                                        </div>
                                        <Link href={`/leases/${lease.id}`}>
                                            <Card className="group rounded-[2rem] border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-[#1e3a5f]/30">
                                                <CardContent className="p-6 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-2xl bg-[#1e3a5f]/5 flex items-center justify-center text-xl font-black text-[#1e3a5f]">
                                                            {lease.tenant_name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 text-lg group-hover:text-[#1e3a5f] transition-colors">{lease.tenant_name}</h4>
                                                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{lease.property_address}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-right">
                                                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Opportunity</span>
                                                            <span className="text-xl font-black text-[#2d6a4f] mt-1 block">+{formatCurrency(impact)}/yr</span>
                                                        </div>
                                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#1e3a5f] transition-colors">
                                                            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </div>
                                )
                            })
                        ) : (
                            <Card className="rounded-3xl border-slate-200 p-8 text-center bg-slate-50/50">
                                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <TrendingUp className="h-6 w-6 text-green-600" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900">Portfolio Optimized</h4>
                                <p className="text-slate-500 font-medium mt-2">Great job! No revenue leakage detected across your active leases.</p>
                            </Card>
                        )}
                    </div>
                </div>

                {/* GLOBAL CALCULATOR */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Global Calculator</h3>
                    {/* We can reuse the calculator here, or create a specific global one. 
                        For now, let's use the component but maybe suggest it's for 'Scenario Planning' 
                        by passing the total portfolio value as default. 
                    */}
                    <CpiCalculator currentRent={totalPortfolioValue} />

                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-2">How this works</h4>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-sm text-slate-600">
                                <div className="h-1.5 w-1.5 rounded-full bg-[#d4a853] mt-2 shrink-0" />
                                <span><strong>Automated Analysis:</strong> RentClock scans every lease for &quot;CPI&quot; or &quot;Market Rate&quot; adjustment clauses.</span>
                            </li>
                            <li className="flex gap-3 text-sm text-slate-600">
                                <div className="h-1.5 w-1.5 rounded-full bg-[#d4a853] mt-2 shrink-0" />
                                <span><strong>Real-Time Indexing:</strong> RentClock pulls the latest BLS data (Consumer Price Index) to find the exact multiplier.</span>
                            </li>
                            <li className="flex gap-3 text-sm text-slate-600">
                                <div className="h-1.5 w-1.5 rounded-full bg-[#d4a853] mt-2 shrink-0" />
                                <span><strong>One-Click Notice:</strong> Generate professional legal notices with the correct math already done.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
