"use client";

export default function LeasesLoading() {
    return (
        <div className="flex flex-col gap-10 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-10 w-64 bg-slate-200 rounded-xl" />
                    <div className="h-5 w-80 bg-slate-100 rounded-lg" />
                </div>
                <div className="h-12 w-44 bg-slate-200 rounded-xl" />
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="h-14 bg-slate-50 border-b border-slate-100" />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 border-b border-slate-50 flex items-center gap-4 px-6">
                        <div className="h-4 w-32 bg-slate-100 rounded" />
                        <div className="h-4 w-48 bg-slate-100 rounded" />
                        <div className="h-4 w-24 bg-slate-100 rounded ml-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
}
