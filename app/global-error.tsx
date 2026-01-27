"use client";

import { Manrope } from "next/font/google";
import "./globals.css";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body className={`${manrope.variable} font-sans antialiased min-h-screen flex items-center justify-center bg-slate-900 text-white`}>
                <div className="max-w-md p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto ring-1 ring-red-500/20">
                        <AlertTriangle className="h-10 w-10 text-red-500" />
                    </div>

                    <div>
                        <h2 className="text-3xl font-black tracking-tight mb-2">Critical System Error</h2>
                        <p className="text-slate-400 font-medium">
                            The application encountered a critical failure in the root layout.
                        </p>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 font-mono text-xs text-red-300 text-left overflow-auto max-h-32">
                        {error.message}
                    </div>

                    <Button
                        onClick={() => reset()}
                        className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-red-900/20"
                    >
                        Restart Application
                    </Button>
                </div>
            </body>
        </html>
    );
}
