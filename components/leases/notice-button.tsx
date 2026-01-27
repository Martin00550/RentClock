"use client";

import { Button } from "@/components/ui/button";
import { Lease } from "@/lib/types";
import { generateRentIncreaseNotice, generateRenewalReminder } from "@/lib/notice-generator";
import { FileDown } from "lucide-react";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface NoticeButtonProps {
    lease: Lease;
    type: "rent-increase" | "renewal";
    isPro?: boolean;
}

export function NoticeButton({ lease, type, isPro = false }: NoticeButtonProps) {
    const handleGenerate = () => {
        if (!isPro) {
            alert("This is a Pro feature! Upgrade to RentClock Pro to generate legal notices.");
            return;
        }
        const content = type === "rent-increase"
            ? generateRentIncreaseNotice(lease)
            : generateRenewalReminder(lease);

        // In a real app, this would download a PDF. 
        // For Steve, we'll copy it to clipboard and show an alert to prove the feature works.
        navigator.clipboard.writeText(content);
        alert(`${type === "rent-increase" ? "Rent Increase Notice" : "Renewal Reminder"} generated and copied to clipboard!\n\nYou can now paste this into an email or document.`);
    };

    return (
        <div className="relative group">
            {!isPro && (
                <div className="absolute -top-2 -right-2 z-10 scale-0 group-hover:scale-100 transition-transform">
                    <Link href="/settings">
                        <Badge className="bg-[#d4a853] text-[#1e3a5f] font-black border-2 border-white shadow-lg">PRO</Badge>
                    </Link>
                </div>
            )}
            <Button
                onClick={handleGenerate}
                className={cn(
                    "bg-[#1e3a5f] hover:bg-[#2a4a73] text-white rounded-xl h-12 px-6 flex items-center gap-2 font-bold shadow-lg shadow-slate-900/10 transition-all",
                    !isPro && "opacity-80 grayscale-[0.5]"
                )}
            >
                <FileDown className="h-4 w-4" />
                Generate Notice
            </Button>
        </div>
    );
}
