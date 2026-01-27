"use client";

export default function AIImportLoading() {
    return (
        <div className="flex flex-col gap-10 animate-pulse">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <div className="h-10 w-64 bg-slate-200 rounded-xl" />
                <div className="h-5 w-96 bg-slate-100 rounded-lg" />
            </div>

            {/* Upload Card Skeleton */}
            <div className="h-80 bg-white rounded-3xl border-2 border-dashed border-slate-200" />
        </div>
    );
}
