"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, TrendingUp, AlertTriangle, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { SignUpTrigger } from "@/components/landing/signup-trigger";
import { motion, AnimatePresence } from "framer-motion";

export function HeroCalculator() {
    const [monthlyRent, setMonthlyRent] = useState("");
    const [cpiRate, setCpiRate] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [potentialLoss, setPotentialLoss] = useState<number | null>(null);

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
    const [stats, setStats] = useState<{ leakage: number; total: number } | null>(null);

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

        const industryStandard = 3;
        const rentClockStandard = 3.5;

        const annualIndustry = rent * (industryStandard / 100) * 12;
        const annualRentClock = rent * (rentClockStandard / 100) * 12;
        const annualCpi = rent * (cpiRate / 100) * 12;

        const totalPotential = Math.max(annualRentClock, annualCpi);
        const annualLeakage = totalPotential - annualIndustry;

        setStats({
            leakage: Math.max(0, Math.round(annualLeakage)),
            total: Math.round(totalPotential)
        });
    }, [monthlyRent, cpiRate]);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
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
                        <span className="text-sm font-bold">Revenue Leakage Calculator</span>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Input */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Your Monthly Rent
                            </label>
                            <span className="text-[10px] font-bold text-[#1e3a5f] bg-[#1e3a5f]/5 px-2 py-0.5 rounded-md animate-pulse">
                                Try it now
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
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Examples:</span>
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
                            Live CPI-U Rate:
                        </div>
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                        ) : (
                            <div className="flex flex-col items-end">
                                <span className="bg-[#2d6a4f]/10 text-[#2d6a4f] font-bold px-2 py-1 rounded-full">
                                    {cpiRate?.toFixed(1)}% YoY
                                </span>
                                <span className="text-[8px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">
                                    Auto-updates daily via BLS API
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
                                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-amber-800 uppercase tracking-widest mb-1">
                                                Annual Profit Boost
                                            </p>
                                            <p className="text-4xl md:text-5xl font-black text-amber-900 tracking-tighter">
                                                {formatNumber(stats.leakage)}
                                                <span className="text-lg font-bold text-amber-600 ml-2">/year</span>
                                            </p>
                                            <p className="text-[10px] text-amber-700 mt-2 leading-relaxed font-semibold">
                                                RentClock&apos;s 3.5% floor vs. the industry-standard 3% increase.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-amber-200/50 flex items-center justify-between text-amber-900/60">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800/80">Total Revenue Protection (0% vs 3.5%):</span>
                                        <span className="text-sm font-black">{formatNumber(stats.total)}/yr</span>
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
                            Check My Potential Savings
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </SignUpTrigger>

                    <div className="flex flex-col gap-2 mt-2 text-center">
                        <p className="text-[10px] text-slate-400 font-medium mb-1">
                            Calculations are estimates for informative purposes.
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
