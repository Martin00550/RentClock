"use client";

import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
    return (
        <div className="flex flex-col gap-10 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-10 w-80 bg-slate-200 rounded-xl" />
                    <div className="h-5 w-64 bg-slate-100 rounded-lg" />
                </div>
                <div className="h-14 w-56 bg-slate-200 rounded-2xl" />
            </div>

            {/* Profit Teaser Skeleton */}
            <div className="h-48 bg-slate-200 rounded-[2.5rem]" />

            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-40 bg-slate-100 rounded-3xl" />
                <div className="h-40 bg-slate-100 rounded-3xl" />
                <div className="h-40 bg-slate-100 rounded-3xl" />
            </div>

            {/* Table Skeleton */}
            <div className="h-64 bg-slate-100 rounded-3xl" />
        </div>
    );
}
