"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHealthStats, HealthStats } from "@/actions/get-health-stats";
import { Loader2, Activity, Users, ShieldCheck, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function ProductHealth() {
    const [stats, setStats] = useState<HealthStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getHealthStats().then(res => {
            if (res.stats) setStats(res.stats);
            setLoading(false);
        }).catch(err => {
            console.error("Failed to load health stats:", err);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!stats) return <div className="p-4 text-red-500">Failed to load health stats.</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-500" />
                Live Vitals
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. AI Reliability */}
                <Card className="border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
                            AI Reliability (24h)
                            <Zap className="h-4 w-4 text-amber-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.ai_success_rate_24h}%</div>
                        <Progress value={stats.ai_success_rate_24h} className="h-2 mt-2"
                            indicatorClassName={stats.ai_success_rate_24h > 90 ? "bg-emerald-500" : "bg-red-500"}
                        />
                        <p className="text-xs text-slate-400 mt-2">
                            Target: &gt;95% lease scan success
                        </p>
                    </CardContent>
                </Card>

                {/* 2. Sticky Factor */}
                <Card className="border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
                            Sticky Users
                            <Users className="h-4 w-4 text-blue-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.sticky_users}</div>
                        <p className="text-xs text-slate-400 mt-2">
                            Users with &gt;1 active lease
                        </p>
                    </CardContent>
                </Card>

                {/* 3. Monetization */}
                <Card className="border-slate-200 bg-slate-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
                            Active Pros
                            <ShieldCheck className="h-4 w-4 text-[#d4a853]" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#1e3a5f]">{stats.active_subscribers}</div>
                        <p className="text-xs text-slate-400 mt-2">
                            Total active subscriptions
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
