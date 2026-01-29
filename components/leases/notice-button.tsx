"use client";

import { Button } from "@/components/ui/button";
import { Lease } from "@/lib/types";
import { generateRentIncreaseNotice, generateRenewalReminder } from "@/lib/notice-generator";
import { FileDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoticeButtonProps {
    lease: Lease;
    type: "rent-increase" | "renewal";
}

export function NoticeButton({ lease, type }: NoticeButtonProps) {
    const handleGenerate = () => {
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
            <Button
                onClick={handleGenerate}
                className={cn(
                    "bg-[#1e3a5f] hover:bg-[#2a4a73] text-white rounded-xl h-12 px-6 flex items-center gap-2 font-bold shadow-lg shadow-slate-900/10 transition-all"
                )}
            >
                <FileDown className="h-4 w-4" />
                Generate Notice
            </Button>
        </div>
    );
}
