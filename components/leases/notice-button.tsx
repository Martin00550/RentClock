"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lease } from "@/lib/types";
import { FileDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { pdf } from "@react-pdf/renderer";
import { LeaseNoticePDF } from "./lease-notice-pdf";

interface NoticeButtonProps {
    lease: Lease;
    type: "rent-increase" | "renewal";
}

export function NoticeButton({ lease, type }: NoticeButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const blob = await pdf(<LeaseNoticePDF lease={lease} type={type} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${lease.tenant_name.replace(/\s+/g, '_')}_Notice.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="relative group">
            <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={cn(
                    "bg-[#1e3a5f] hover:bg-[#2a4a73] text-white rounded-xl h-12 px-6 flex items-center gap-2 font-bold shadow-lg shadow-slate-900/10 transition-all disabled:opacity-70"
                )}
            >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                {isGenerating ? "Generating..." : "Download Official Notice"}
            </Button>
        </div>
    );
}
