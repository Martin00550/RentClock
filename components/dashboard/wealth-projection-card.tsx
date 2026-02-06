"use client";

import { useState, useMemo } from "react";
import { formatCurrency } from "@/lib/lease-utils";
import { Lease } from "@/lib/types";
import { TrendingUp, ArrowUpRight, LucideIcon, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WealthProjectionCardProps {
    leases: Lease[];
    inflationRate: number; // as a decimal, e.g., 0.034
}

export function WealthProjectionCard({ leases, inflationRate }: WealthProjectionCardProps) {
    const [years, setYears] = useState<5 | 10 | 15>(10);

    const data = useMemo(() => {
        const totalMonthlyRent = leases.reduce((sum, lease) => sum + (lease.monthly_rent || 0), 0);
        const annualBase = totalMonthlyRent * 12;

        const projection = [];
        let compoundedRent = annualBase;
        let cumulativeProtected = 0;
        let cumulativeFlat = 0;

        for (let i = 0; i <= years; i++) {
            projection.push({
                year: i,
                annualProtected: compoundedRent,
                annualFlat: annualBase,
                totalProtected: cumulativeProtected,
                totalFlat: cumulativeFlat,
                delta: cumulativeProtected - cumulativeFlat,
            });

            cumulativeFlat += annualBase;
            cumulativeProtected += compoundedRent;
            compoundedRent *= (1 + inflationRate);
        }

        return projection;
    }, [leases, inflationRate, years]);

    const finalDelta = data[data.length - 1].delta;
    const maxVal = data[data.length - 1].annualProtected;
    const minVal = data[0].annualFlat;

    return (
        <Card
            className="border-slate-200 bg-white overflow-hidden shadow-2xl shadow-slate-200/50"
            style={{ borderRadius: 'var(--fluid-radius)' }}
        >
            <CardHeader style={{ padding: 'var(--fluid-p)', paddingBottom: '1rem' }}>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[#d4a853] font-black uppercase tracking-widest text-[10px]">
                            <TrendingUp className="h-3 w-3" />
                            <span>10-Year Wealth Mapping</span>
                        </div>
                        <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Revenue Protection Map</CardTitle>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        {[5, 10, 15].map((y) => (
                            <button
                                key={y}
                                onClick={() => setYears(y as 5 | 10 | 15)}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-black rounded-lg transition-all",
                                    years === y ? "bg-[#1e3a5f] text-white shadow-lg" : "text-slate-500 hover:text-slate-800"
                                )}
                            >
                                {y}Y
                            </button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent style={{ padding: 'var(--fluid-p)', paddingTop: 0 }}>
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#2d6a4f]/5 border border-[#2d6a4f]/10 p-6 rounded-3xl">
                            <span className="text-[10px] text-[#2d6a4f] font-black uppercase tracking-widest leading-none">Net Gain Potential</span>
                            <div className="text-4xl font-black text-[#2d6a4f] mt-2 tracking-tighter">
                                +{formatCurrency(finalDelta)}
                            </div>
                            <p className="text-xs text-slate-500 mt-2 font-medium">
                                Cumulative extra revenue captured by indexing to {(inflationRate * 100).toFixed(1)}% inflation.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-[#1e3a5f]" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-sm font-bold text-slate-600">Protected Path</span>
                                        <span className="text-sm font-black text-slate-900">{formatCurrency(data[data.length - 1].annualProtected / 12)}/mo</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                                        <div className="h-full bg-[#1e3a5f] rounded-full" style={{ width: '100%' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-slate-300" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-sm font-bold text-slate-500">Unprotected (Flat)</span>
                                        <span className="text-sm font-black text-slate-500">{formatCurrency(data[0].annualFlat / 12)}/mo</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                                        <div className="h-full bg-slate-300 rounded-full" style={{ width: `${(data[0].annualFlat / maxVal) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <div className="flex gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                                    Projection assumes 100% occupancy and annual adjustments consistent with current CPI benchmarks.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 relative h-[200px] md:h-[300px] w-full flex items-end">
                        <svg viewBox={`0 0 ${years} 100`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                            {/* Gradients */}
                            <defs>
                                <linearGradient id="protectedGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.1" />
                                    <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Flat Path Line */}
                            <line
                                x1="0"
                                y1={100 - ((minVal / maxVal) * 80)}
                                x2={years}
                                y2={100 - ((minVal / maxVal) * 80)}
                                stroke="#cbd5e1"
                                strokeWidth="0.5"
                                strokeDasharray="1 1"
                            />

                            {/* Protected Path Area */}
                            <path
                                d={`M 0 ${100 - ((minVal / maxVal) * 80)} ${data.map(d => `L ${d.year} ${100 - ((d.annualProtected / maxVal) * 80)}`).join(' ')} L ${years} 100 L 0 100 Z`}
                                fill="url(#protectedGradient)"
                            />

                            {/* Protected Path Line */}
                            <path
                                d={`M 0 ${100 - ((minVal / maxVal) * 80)} ${data.map(d => `L ${d.year} ${100 - ((d.annualProtected / maxVal) * 80)}`).join(' ')}`}
                                fill="none"
                                stroke="#1e3a5f"
                                strokeWidth="1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {/* Data Points */}
                            {data.map((d, i) => (
                                <circle
                                    key={i}
                                    cx={d.year}
                                    cy={100 - ((d.annualProtected / maxVal) * 80)}
                                    r="0.5"
                                    fill="white"
                                    stroke="#1e3a5f"
                                    strokeWidth="0.2"
                                />
                            ))}
                        </svg>

                        {/* Legend / Axes labels */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                <span>{formatCurrency(maxVal)} (Annually)</span>
                                <span>YEAR {years}</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-slate-100 pb-1 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                <span>{formatCurrency(minVal)} (Annually)</span>
                                <span>YEAR 0</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <Link href="/profit-protection">
                        <Button variant="ghost" className="text-[#1e3a5f] font-black hover:bg-slate-100 rounded-xl group px-8 border-2 border-slate-100">
                            Deep Dive Audit
                            <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

import Link from "next/link";
