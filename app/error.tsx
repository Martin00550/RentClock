"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application Error:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-md w-full">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Something went wrong!</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    An unexpected error occurred. The RentClock team has been notified.
                    <br />
                    <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded mt-2 inline-block text-slate-400">
                        {error.message || "Unknown Error"}
                    </span>
                </p>
                <div className="flex gap-4 justify-center">
                    <Button
                        onClick={() => window.location.href = "/"}
                        variant="outline"
                        className="rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                    >
                        Go Home
                    </Button>
                    <Button
                        onClick={() => reset()}
                        className="bg-[#1e3a5f] hover:bg-[#2a4a73] text-white rounded-xl font-bold shadow-lg shadow-slate-900/10 flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </Button>
                </div>
            </div>
        </div>
    );
}
