export default function Loading() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1e3a5f] border-t-transparent" />
                <p className="text-sm font-medium text-slate-500 animate-pulse">Loading workspace...</p>
            </div>
        </div>
    );
}
