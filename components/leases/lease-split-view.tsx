"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaseSplitViewProps {
    pdfUrl: string;
    children: React.ReactNode;
}

export function LeaseSplitView({ pdfUrl, children }: LeaseSplitViewProps) {
    const [isSplit, setIsSplit] = useState(false);

    return (
        <div className={cn("relative min-h-screen transition-all duration-500", isSplit ? "flex gap-4" : "")}>
            {/* Main Content Area */}
            <div
                className={cn("transition-all duration-500 group/content", isSplit ? "w-1/2 overflow-y-auto h-[calc(100vh-100px)] lg:h-auto" : "w-full")}
                data-is-split={isSplit}
            >
                {/* 
                <div className="flex justify-end mb-4">
                    <Button
                        onClick={() => setIsSplit(!isSplit)}
                        variant="outline"
                        className="rounded-xl border-[#1e3a5f]/20 text-[#1e3a5f] font-bold text-xs flex items-center gap-2 hover:bg-[#1e3a5f]/5"
                    >
                        {isSplit ? (
                            <>
                                <Minimize2 className="h-4 w-4" />
                                Close Side-by-Side
                            </>
                        ) : (
                            <>
                                <Maximize2 className="h-4 w-4" />
                                Open Side-by-Side View
                            </>
                        )}
                    </Button>
                </div>
                */}
                {children}
            </div>

            {/* PDF Viewer Side Panel */}
            {/* {isSplit && (
                <div className="w-1/2 h-[calc(100vh-40px)] sticky top-4 border-2 border-slate-200 rounded-[2.5rem] overflow-hidden bg-slate-100 shadow-2xl animate-in slide-in-from-right-10 duration-500">
                    <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-[#1e3a5f]/10 p-2 rounded-lg text-[#1e3a5f]">
                                <FileText className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-black text-[#1e3a5f] uppercase tracking-widest">Lease Document Vault</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSplit(false)}
                            className="rounded-full hover:bg-rose-50 hover:text-rose-600"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full border-none"
                        title="Lease Document"
                    />
                </div>
            )} */}
        </div>
    );
}
