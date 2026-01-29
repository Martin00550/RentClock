"use client";

import { cn } from "@/lib/utils";

interface LeaseSplitViewProps {
    pdfUrl: string;
    children: React.ReactNode;
}

/**
 * LeaseSplitView provides a wrapper for lease content.
 * Note: Side-by-side PDF preview ("Lease Document Vault") is currently hidden.
 */
export function LeaseSplitView({ children }: LeaseSplitViewProps) {
    return (
        <div className={cn("relative min-h-screen transition-all duration-500")}>
            <div className="transition-all duration-500 w-full">
                {children}
            </div>
        </div>
    );
}
