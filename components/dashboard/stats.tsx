"use client";

import { AlertCircle, Hash, TrendingUp } from "lucide-react";
import { calculateLeakage, formatCurrency, getNextRelevantEvent } from "@/lib/lease-utils";
import { differenceInDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface StatCardProps {
    title: string;
    value: string | number;
    subtextText?: string;
    subtextTrend?: "up" | "down";
    icon: React.ReactNode;
    variant?: "default" | "urgent" | "upcoming";
}

export function StatCard({ title, value, subtextText, subtextTrend, icon, variant = "default" }: StatCardProps) {
    const variantStyles = {
        default: "bg-white border-slate-200",
        urgent: "bg-red-50 border-red-100",
        upcoming: "bg-amber-50 border-amber-100",
    };

    const titleStyles = {
        default: "text-slate-500",
        urgent: "text-red-700",
        upcoming: "text-amber-700",
    };

    return (
        <Card
            className={`shadow-sm ${variantStyles[variant]}`}
            style={{ borderRadius: 'var(--fluid-radius)' }}
        >
            <CardHeader
                className="flex flex-row items-center justify-between space-y-0 pb-2"
                style={{ padding: 'var(--fluid-p)', paddingBottom: '0.5rem' }}
            >
                <CardTitle className={`text-sm font-medium ${titleStyles[variant]}`}>{title}</CardTitle>
                <div className={variant === "default" ? "text-slate-400" : variant === "urgent" ? "text-red-500" : "text-amber-500"}>
                    {icon}
                </div>
            </CardHeader>
            <CardContent style={{ padding: 'var(--fluid-p)', paddingTop: 0 }}>
                <div className="text-3xl font-black tracking-tighter">{value}</div>
                {subtextText && (
                    <p className="mt-1 flex items-center text-xs text-slate-500">
                        {subtextTrend === "up" && <TrendingUp className="mr-1 h-3 w-3 text-[#2d6a4f]" />}
                        <span>{subtextText}</span>
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

import { Lease } from "@/lib/types";

export function DashboardStats({ leases, protectedCount }: { leases: Lease[]; protectedCount: number }) {
    // Calculate stats
    const totalLeases = leases.length;

    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const sixtyDaysFromNow = new Date();
    sixtyDaysFromNow.setDate(today.getDate() + 60);

    // Urgent: Events in next 30 days
    // Urgent: Events in next 30 days
    const urgentCount = leases.filter(lease => {
        const nextEvent = getNextRelevantEvent(lease);
        if (!nextEvent) return false;

        const daysAway = differenceInDays(nextEvent.date, today);
        return daysAway <= 30;
    }).length;

    // Calculate "Yield Opportunity" (Sum of leakage across portfolio)
    const yearlyProtection = leases.reduce((sum, lease) => {
        return sum + calculateLeakage(lease);
    }, 0);

    return (
        <div className="grid " style={{ gap: 'var(--fluid-gap)', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <Link href="/leases" className="block">
                <StatCard
                    title="Protected Leases"
                    value={protectedCount}
                    subtextText={`Out of ${totalLeases} total`}
                    subtextTrend="up"
                    icon={<Hash className="h-4 w-4" />}
                />
            </Link>
            <Link href="/profit-protection" className="block">
                <StatCard
                    title="Immediate Attention"
                    value={urgentCount}
                    subtextText={urgentCount > 0 ? "Action needed to secure profit" : "All revenue secure"}
                    icon={<AlertCircle className="h-4 w-4" />}
                    variant={urgentCount > 0 ? "urgent" : "default"}
                />
            </Link>
            <Link href="/profit-protection" className="block" id="dashboard-kpi-revenue">
                <StatCard
                    title="Possible Rent Increases"
                    value={formatCurrency(yearlyProtection)}
                    subtextText={yearlyProtection > 0 ? "Based on current CPI vs. your increases" : "Yield integrity secure"}
                    icon={<TrendingUp className="h-4 w-4" />}
                    variant="upcoming"
                />
            </Link>
        </div>
    );
}
