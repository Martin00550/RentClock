"use client";

export default function ProfitProtectionLoading() {
    return (
        <div className="flex flex-col gap-10 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-10 w-72 bg-slate-200 rounded-xl" />
                    <div className="h-5 w-96 bg-slate-100 rounded-lg" />
                </div>
            </div>

            {/* CPI Card Skeleton */}
            <div className="h-32 bg-slate-100 rounded-3xl" />

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="h-36 bg-slate-100 rounded-3xl" />
                <div className="h-36 bg-slate-100 rounded-3xl" />
                <div className="h-36 bg-slate-100 rounded-3xl" />
                <div className="h-36 bg-slate-100 rounded-3xl" />
            </div>

            {/* Opportunities List Skeleton */}
            <div className="space-y-4">
                <div className="h-6 w-48 bg-slate-200 rounded-lg" />
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100" />
                ))}
            </div>
        </div>
    );
}
