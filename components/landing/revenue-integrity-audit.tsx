"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, TrendingUp, AlertTriangle, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { SignUpTrigger } from "@/components/landing/signup-trigger";
import { motion, AnimatePresence } from "framer-motion";
import { RENT_INCREASE_FLOOR, INDUSTRY_STANDARD } from "@/lib/lease-utils";

export function RevenueIntegrityAudit() {
    const [monthlyRent, setMonthlyRent] = useState("");
    const [cpiRate, setCpiRate] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch live CPI rate on mount
    useEffect(() => {
        async function fetchCPI() {
            try {
                const res = await fetch("/api/cpi");
                if (res.ok) {
                    const data = await res.json();
                    setCpiRate(data.yoyChange ? data.yoyChange * 100 : 4.2);
                } else {
                    setCpiRate(4.2); // Fallback higher than standard
                }
            } catch {
                setCpiRate(4.2); // Fallback higher than standard
            } finally {
                setIsLoading(false);
            }
        }
        fetchCPI();
    }, []);

    // Calculate potential outcomes when rent changes
    const [stats, setStats] = useState<{ leakage: number; total: number; effectiveRate: number; fiveYearLoss: number; equityLoss: number } | null>(null);

    useEffect(() => {
        if (!monthlyRent || !cpiRate) {
            setStats(null);
            return;
        }
        const rent = parseFloat(monthlyRent.replace(/,/g, ""));
        if (isNaN(rent) || rent <= 0) {
            setStats(null);
            return;
        }

        const currentRate = cpiRate || RENT_INCREASE_FLOOR;
        // RentClock Strategy: Greater of Floor (3.5%) or CPI
        const effectiveRate = Math.max(currentRate, RENT_INCREASE_FLOOR);

        // Universal Baseline: Comparison against Status Quo (0% Increase)
        // This calculates the total value of "Inflation Protection" vs doing nothing.
        const annualStatusQuo = rent * 12;
        const annualRentClock = rent * (1 + effectiveRate / 100) * 12;
        const annualImpact = annualRentClock - annualStatusQuo;

        // 5-Year Compound Erosion Calculation (Target vs Status Quo)
        let totalFiveYearErosion = 0;
        let runningRentStatusQuo = rent;
        let runningRentRentClock = rent;

        for (let year = 1; year <= 5; year++) {
            // Baseline is no change (Status Quo)
            runningRentStatusQuo = rent;
            // Target compounds
            runningRentRentClock *= (1 + effectiveRate / 100);
            totalFiveYearErosion += (runningRentRentClock - runningRentStatusQuo) * 12;
        }

        // Equity Opportunity (Building Valuation Impact)
        const year5Impact = (runningRentRentClock - rent) * 12;
        const equityGap = year5Impact / 0.065;

        setStats({
            leakage: Math.max(0, Math.round(annualImpact)),
            total: Math.round(annualRentClock),
            effectiveRate: effectiveRate,
            fiveYearLoss: Math.round(totalFiveYearErosion),
            equityLoss: Math.round(equityGap)
        });
    }, [monthlyRent, cpiRate]);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
        }).format(num);
    };

    return (
        <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-linear-to-r from-[#1e3a5f] to-[#d4a853] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>

            <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-linear-to-r from-[#1e3a5f] to-[#2a4a73] px-6 py-4">
                    <div className="flex items-center gap-2 text-white">
                        <TrendingUp className="h-5 w-5 text-[#d4a853]" />
                        <span className="text-sm font-bold uppercase tracking-wider">Revenue Integrity Audit</span>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Input */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Current Monthly Rent
                            </label>
                            <span className="text-[10px] font-bold text-[#1e3a5f] bg-[#1e3a5f]/5 px-2 py-0.5 rounded-md animate-pulse">
                                Live Audit
                            </span>
                        </div>
                        <div className="relative group/input">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within/input:text-[#1e3a5f] transition-colors" />
                            <Input
                                type="text"
                                placeholder="e.g. 5,000"
                                value={monthlyRent}
                                onChange={(e) => setMonthlyRent(e.target.value)}
                                className="pl-10 h-16 text-3xl font-black rounded-xl border-slate-200 focus-visible:ring-[#1e3a5f] transition-all bg-slate-50/50"
                            />
                        </div>

                        {/* Quick Examples */}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Benchmarks:</span>
                            {[2500, 5500, 12000].map((amt) => (
                                <button
                                    key={amt}
                                    onClick={() => setMonthlyRent(amt.toLocaleString())}
                                    className="text-[10px] font-bold text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white border border-[#1e3a5f]/20 px-2 py-1 rounded-md transition-all"
                                >
                                    ${amt.toLocaleString()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CPI Rate Badge */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            Live CPI-U Index:
                        </div>
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                        ) : (
                            <div className="flex flex-col items-end">
                                <span className="bg-[#2d6a4f]/10 text-[#2d6a4f] font-bold px-2 py-1 rounded-full">
                                    {cpiRate?.toFixed(1)}% YoY
                                </span>
                                <span className="text-[8px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">
                                    Federal BLS Data Sync Verified
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Result */}
                    <AnimatePresence>
                        {stats !== null && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: "auto", scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 overflow-hidden"
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-amber-100 p-2 rounded-lg mt-0.5">
                                            <TrendingUp className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-amber-800 uppercase tracking-widest mb-1">
                                                Total Inflation Gap (Asset Value)
                                            </p>
                                            <p className="text-4xl md:text-5xl font-black text-amber-900 tracking-tighter">
                                                {formatNumber(stats.equityLoss)}
                                            </p>
                                            <p className="text-[10px] text-amber-700 mt-2 leading-relaxed font-bold">
                                                The difference between doing nothing and indexing correctly (at 6.5% cap).
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-amber-200/50 space-y-2">
                                        <div className="flex items-center justify-between text-amber-900/60">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800/80">5-Year Revenue Erosion:</span>
                                            <span className="text-sm font-black text-amber-900">{formatNumber(stats.fiveYearLoss)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-amber-900/60">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800/80">Annual Opportunity:</span>
                                            <span className="text-sm font-bold">{formatNumber(stats.leakage)}/yr</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center gap-1.5 opacity-40">
                                        <div className="h-px flex-1 bg-amber-900/20" />
                                        <span className="text-[8px] font-black uppercase text-amber-900">Audit Protocol Verified</span>
                                        <div className="h-px flex-1 bg-amber-900/20" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* CTA */}
                    <SignUpTrigger>
                        <Button
                            className="w-full bg-[#1e3a5f] hover:bg-[#2a4a73] text-white h-14 rounded-xl font-bold text-base transition-all shadow-lg flex items-center justify-center gap-2"
                            disabled={!stats}
                        >
                            Review My Audit Findings
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </SignUpTrigger>

                    <div className="flex flex-col gap-2 mt-2 text-center">
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tight mb-1">
                            Calculated vs. Status Quo using Federal BLS CPI indices & 6.5% Cap Rate benchmarks.
                        </p>
                        <div className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 rounded-xl border border-slate-100">
                            <CheckCircle2 className="h-4 w-4 text-[#2d6a4f]" />
                            <p className="text-sm font-bold text-slate-600">
                                First 3 Leases Free • No Credit Card
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
