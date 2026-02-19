"use client";

import { useState, useMemo } from "react";
import { formatCurrency, RENT_INCREASE_FLOOR, calculateAssetValueGap } from "@/lib/lease-utils";
import { Lease } from "@/lib/types";
import { TrendingUp, ArrowUpRight, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface WealthProjectionCardProps {
    leases: Lease[];
    inflationRate: number; // as a decimal, e.g., 0.034
}

export function WealthProjectionCard({ leases, inflationRate }: WealthProjectionCardProps) {
    const [years, setYears] = useState<5 | 10 | 15>(10);

    // RentClock Strategy: Use the higher of Floor or Live CPI
    const effectiveRate = Math.max(inflationRate, RENT_INCREASE_FLOOR / 100);

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
            compoundedRent *= (1 + effectiveRate);
        }

        return projection;
    }, [leases, effectiveRate, years]);

    const finalDelta = data[data.length - 1].delta;
    const maxVal = data[data.length - 1].annualProtected;
    const minVal = data[0].annualFlat;

    // SVG CONFIGURATION
    const WIDTH = 1000;
    const HEIGHT = 300;
    const PADDING_Y = 40; // Space for stroke caps and improved visuals

    // Scale functions
    const getX = (year: number) => (year / years) * WIDTH;
    // Map value to Y coordinate (inverted because SVG Y=0 is top)
    // We add padding to avoid clipping at the very top/bottom
    const getY = (val: number) => {
        const domain = maxVal - minVal || 1; // avoid divide by zero
        // effective height is HEIGHT - (2 * PADDING_Y)
        const range = HEIGHT - (2 * PADDING_Y);
        const normalized = (val - minVal) / domain;
        return HEIGHT - PADDING_Y - (normalized * range);
    };

    // Generate Path Commands
    const protectedPathD = `
        M 0 ${getY(minVal)}
        ${data.map(d => `L ${getX(d.year)} ${getY(d.annualProtected)}`).join(' ')}
    `;

    const areaPathD = `
        ${protectedPathD}
        L ${WIDTH} ${HEIGHT}
        L 0 ${HEIGHT}
        Z
    `;

    const flatLineY = getY(minVal);

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
                            <span>{years}-Year Asset Yield Sentinel</span>
                        </div>
                        <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Yield Protection Map</CardTitle>
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
                            <span className="text-[10px] text-[#2d6a4f] font-black uppercase tracking-widest leading-none">Asset Appreciation Gap</span>
                            <div className="text-4xl font-black text-[#2d6a4f] mt-2 tracking-tighter">
                                {formatCurrency(calculateAssetValueGap(data[data.length - 1].annualProtected - data[data.length - 1].annualFlat))}
                            </div>
                            <p className="text-xs text-slate-500 mt-2 font-medium">
                                Valuation difference at Year {years} based on a 6.5% target cap rate between indexing correctly vs. baseline.
                            </p>
                            <div className="mt-4 pt-4 border-t border-[#2d6a4f]/10">
                                <span className="text-[10px] text-[#2d6a4f] font-black uppercase tracking-widest leading-none">Total Yield Gain</span>
                                <div className="text-2xl font-black text-[#2d6a4f] mt-1 tracking-tighter">
                                    +{formatCurrency(finalDelta)}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-[#1e3a5f]" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-sm font-bold text-slate-600">Yield-Protected Path</span>
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
                                        <span className="text-sm font-bold text-slate-500">Stale Baseline</span>
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

                    <div className="lg:col-span-8 relative w-full aspect-2/1 md:aspect-3/1 flex items-center bg-slate-50/50 rounded-3xl border border-slate-100 overflow-hidden">

                        {/* CHART CONTAINER */}
                        <div className="absolute inset-0 p-6">
                            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="protectedGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.15" />
                                        <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0" />
                                    </linearGradient>
                                    {/* Mask for grid lines to not overlap with area if needed, skipping for cleaner look */}
                                </defs>

                                {/* GRID LINES (Vertical) */}
                                {data.map((d, i) => (
                                    <line
                                        key={`grid-v-${i}`}
                                        x1={getX(d.year)}
                                        y1={0}
                                        x2={getX(d.year)}
                                        y2={HEIGHT}
                                        stroke="#e2e8f0" // slate-200
                                        strokeWidth="1"
                                        strokeDasharray="4 4"
                                        opacity={0.5}
                                    />
                                ))}

                                {/* AREA FILL */}
                                <path
                                    d={areaPathD}
                                    fill="url(#protectedGradient)"
                                />

                                {/* FLAT LINE (Baseline) */}
                                <line
                                    x1="0"
                                    y1={flatLineY}
                                    x2={WIDTH}
                                    y2={flatLineY}
                                    stroke="#94a3b8" // slate-400
                                    strokeWidth="2"
                                    strokeDasharray="6 6"
                                    vectorEffect="non-scaling-stroke"
                                />

                                {/* PROTECTED LINE (The Growth) */}
                                <path
                                    d={protectedPathD}
                                    fill="none"
                                    stroke="#1e3a5f"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    vectorEffect="non-scaling-stroke"
                                    className="drop-shadow-md"
                                />

                                {/* DATA POINTS */}
                                {data.map((d, i) => {
                                    const isLast = i === data.length - 1;
                                    const isFirst = i === 0;

                                    // Only show first, last, and middle points to avoid clutter
                                    if (!isLast && !isFirst && i % Math.ceil(years / 2) !== 0) return null;

                                    return (
                                        <g key={`point-${i}`}>
                                            {isLast && (
                                                <>
                                                    <circle
                                                        cx={getX(d.year)}
                                                        cy={getY(d.annualProtected)}
                                                        r="12"
                                                        fill="#1e3a5f"
                                                        opacity="0.1"
                                                        className="animate-pulse"
                                                    />
                                                    <circle
                                                        cx={getX(d.year)}
                                                        cy={getY(d.annualProtected)}
                                                        r="8"
                                                        fill="#1e3a5f"
                                                        opacity="0.2"
                                                    />
                                                </>
                                            )}
                                            <circle
                                                cx={getX(d.year)}
                                                cy={getY(d.annualProtected)}
                                                r={isLast ? "4" : "3"}
                                                fill="white"
                                                stroke="#1e3a5f"
                                                strokeWidth="2"
                                            />
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>

                        {/* AXIS LABELS OVERLAY */}
                        <div className="absolute inset-x-6 bottom-2 flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            <span>Year 0</span>
                            <span>Year {years}</span>
                        </div>
                        <div className="absolute inset-y-6 right-2 flex flex-col justify-between items-end text-[9px] font-black text-slate-400 uppercase tracking-widest pointer-events-none">
                            <span className="bg-white/80 backdrop-blur-sm px-1 rounded">{formatCurrency(maxVal)}</span>
                            <span className="bg-white/80 backdrop-blur-sm px-1 rounded">{formatCurrency(minVal)}</span>
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
