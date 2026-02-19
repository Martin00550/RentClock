"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Info, ArrowRight } from "lucide-react";
import { formatCurrency, RENT_INCREASE_FLOOR } from "@/lib/lease-utils";
import { CPIDataPoint } from "@/lib/cpi";

export function CpiCalculator({ currentRent }: { currentRent: number }) {
    const [cpiData, setCpiData] = useState<CPIDataPoint | null>(null);
    const [baseRent, setBaseRent] = useState(currentRent);
    const [calculatedRent, setCalculatedRent] = useState<number | null>(null);
    const [yoyChange, setYoyChange] = useState(0.034); // Default fallback

    useEffect(() => {
        async function loadCpi() {
            try {
                const res = await fetch("/api/cpi");
                const json = await res.json();
                if (json.latest) {
                    setCpiData(json.latest);
                }
                if (json.yoyChange !== undefined) {
                    setYoyChange(json.yoyChange);
                }
            } catch (err: unknown) {
                console.error("Failed to load CPI", err);
            }
        }
        loadCpi();
    }, []);

    const handleCalculate = () => {
        // Most CRE leases are "Greater of X% or CPI increase"
        const floor = RENT_INCREASE_FLOOR / 100;
        const increase = Math.max(floor, yoyChange);
        setCalculatedRent(baseRent * (1 + increase));
    };

    const displayPercentage = Math.max(RENT_INCREASE_FLOOR / 100, yoyChange) * 100;
    const cpiPercentage = (yoyChange * 100).toFixed(1);

    return (
        <Card id="cpi-calculator-card" className="border-slate-200 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden group transition-all duration-500 hover:shadow-indigo-500/5" style={{ borderRadius: 'var(--fluid-radius)' }}>

            <CardHeader className="bg-linear-to-br from-slate-50 to-white border-b border-slate-100 space-y-4" style={{ padding: 'var(--fluid-p)' }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#1e3a5f] p-3 rounded-2xl shadow-xl shadow-slate-900/10 transition-transform group-hover:scale-110 duration-500">
                            <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight leading-none">Profit Protector</CardTitle>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Fair Market Calculator</p>
                        </div>
                    </div>
                </div>

                {cpiData ? (
                    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-200 p-3 rounded-2xl shadow-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Live U.S. CPI-U Index</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-lg font-black text-[#1e3a5f]">{cpiData.value}</span>
                                <span className="text-[10px] font-bold text-slate-400">({cpiData.periodName} {cpiData.year})</span>
                                <span className="ml-2 bg-green-50 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full">+{cpiPercentage}% YoY</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-14 bg-slate-50 rounded-2xl animate-pulse" />
                )}
            </CardHeader>

            <CardContent className="space-y-8" style={{ padding: 'var(--fluid-p)' }}>
                {/* INFO ALERT */}
                <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-3xl flex gap-4 transition-colors hover:bg-indigo-50 duration-300">
                    <div className="bg-white p-1.5 h-fit rounded-lg shadow-sm">
                        <Info className="h-4 w-4 text-indigo-600" />
                    </div>
                    <p className="text-xs text-indigo-900/80 leading-relaxed font-semibold">
                        Most commercial leases include a <span className="text-indigo-900 font-black">&quot;Greater of CPI or {RENT_INCREASE_FLOOR}%&quot;</span> clause. Use this tool to ensure you aren&apos;t leaving money on the table.
                    </p>
                </div>

                {/* INPUTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Rent</Label>
                        <div className="relative group/input">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold transition-colors group-focus-within/input:text-[#1e3a5f]">$</span>
                            <Input
                                type="number"
                                value={baseRent}
                                onChange={(e) => setBaseRent(Number(e.target.value))}
                                className="h-14 pl-8 rounded-2xl bg-slate-50/50 border-slate-200 border-2 font-black text-lg text-slate-900 focus-visible:ring-0 focus-visible:border-[#1e3a5f] transition-all hover:bg-white"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strategy</Label>
                        <div className="h-14 flex items-center px-4 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-400 uppercase tracking-widest shadow-inner cursor-not-allowed">
                            {RENT_INCREASE_FLOOR}% Floor + CPI
                        </div>
                    </div>
                </div>

                {/* RESULTS */}
                {calculatedRent ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="bg-[#2d6a4f] rounded-3xl shadow-2xl shadow-[#2d6a4f]/20 relative overflow-hidden group/result" style={{ padding: 'var(--fluid-p)' }}>
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/result:rotate-12 transition-transform duration-700">
                                <TrendingUp className="h-24 w-24 text-white" />
                            </div>
                            <div className="relative z-10 space-y-2">
                                <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">New Lease Target</span>
                                <div className="text-4xl font-black text-white tracking-tighter">
                                    {formatCurrency(calculatedRent)}
                                </div>
                                <p className="text-xs text-indigo-100 font-medium">
                                    The calculation uses the higher of {RENT_INCREASE_FLOOR}% or CPI ({cpiPercentage}%) for this calculation.
                                    This matches the &quot;Greater of X% or CPI&quot; clause often found in commercial leases.
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full">+{displayPercentage.toFixed(1)}% Optimization</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={() => setCalculatedRent(null)}
                            variant="ghost"
                            className="w-full text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 rounded-xl"
                        >
                            Reset Calculation
                        </Button>
                    </div>
                ) : (
                    <Button
                        onClick={handleCalculate}
                        className="w-full h-16 bg-[#1e3a5f] hover:bg-[#2a4a73] text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-95 group/btn"
                    >
                        Calculate Optimized Rent
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                )}

                <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest leading-loose">
                    * Automated inflation indexing powered by US BLS Public Data. <br />
                    Verify legal terms in Exhibit B of your lease agreement.
                </p>
            </CardContent>
        </Card>
    );
}
