"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductHealth, ProductHealthStats } from "@/actions/get-admin-stats";
import { Cpu, Users, MapPin, TrendingUp, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/lease-utils";

export function ProductHealth() {
    const [stats, setStats] = useState<ProductHealthStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const data = await getProductHealth();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch product stats:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 text-[#1e3a5f] animate-spin" />
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                Product Health & Intelligence
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AI Reliability */}
                <Card className="rounded-2xl border-indigo-100 shadow-sm overflow-hidden">
                    <div className="bg-indigo-50/50 p-4 border-b border-indigo-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-indigo-600" />
                            <span className="font-bold text-indigo-900 text-sm">AI Core Reliability</span>
                        </div>
                        <span className="text-[10px] font-mono text-indigo-400 uppercase">{stats.aiTotalScans} Scans Processed</span>
                    </div>
                    <CardContent className="p-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-slate-900">{stats.aiSuccessRate.toFixed(1)}%</span>
                            <span className="text-sm font-medium text-slate-500">Success Rate</span>
                        </div>
                        <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                style={{ width: `${stats.aiSuccessRate}%` }}
                            />
                        </div>
                        <p className="mt-3 text-xs text-slate-400">
                            Measures the accuracy of the Gemini lease extraction engine.
                        </p>
                    </CardContent>
                </Card>

                {/* Sticky Factor */}
                <Card className="rounded-2xl border-emerald-100 shadow-sm overflow-hidden">
                    <div className="bg-emerald-50/50 p-4 border-b border-emerald-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-emerald-600" />
                            <span className="font-bold text-emerald-900 text-sm">Sticky Factor</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase">Retention KPI</span>
                    </div>
                    <CardContent className="p-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-slate-900">{stats.stickyUserPercent.toFixed(1)}%</span>
                            <span className="text-sm font-medium text-slate-500">Multi-Lease Users</span>
                        </div>
                        <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                style={{ width: `${stats.stickyUserPercent}%` }}
                            />
                        </div>
                        <p className="mt-3 text-xs text-slate-400">
                            Percentage of active users managing more than one property.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Top Markets */}
            <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 py-4">
                    <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        Top Performing Markets
                    </CardTitle>
                </CardHeader>
                <div className="p-0">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-3 text-left">State</th>
                                <th className="px-6 py-3 text-left">Leases</th>
                                <th className="px-6 py-3 text-right">Portfolio Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {stats.topMarkets.map((market, i) => (
                                <tr key={market.state} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 font-bold text-slate-800">{market.state}</td>
                                    <td className="px-6 py-4 text-slate-600">{market.count}</td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-700">
                                        {formatCurrency(market.value)}
                                    </td>
                                </tr>
                            ))}
                            {stats.topMarkets.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center py-8 text-slate-400 italic">
                                        Not enough data to determine top markets
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
