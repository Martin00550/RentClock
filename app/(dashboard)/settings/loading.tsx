"use client";

export default function SettingsLoading() {
    return (
        <div className="flex flex-col gap-10 animate-pulse">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <div className="h-10 w-48 bg-slate-200 rounded-xl" />
                <div className="h-5 w-72 bg-slate-100 rounded-lg" />
            </div>

            {/* Settings Cards Skeleton */}
            <div className="space-y-6">
                <div className="h-48 bg-white rounded-3xl border border-slate-100" />
                <div className="h-32 bg-white rounded-3xl border border-slate-100" />
            </div>
        </div>
    );
}
