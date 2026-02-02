"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileText, X, ExternalLink, Upload, Loader2, ShieldCheck } from "lucide-react";
import { uploadLeaseDocument } from "@/actions/upload-lease-document";

interface LeaseSplitViewProps {
    pdfUrl: string;
    leaseId: string;
    children: React.ReactNode;
}

/**
 * LeaseSplitView document vault.
 * Now supports "Safety Net" upload if the document is missing.
 */
export function LeaseSplitView({ pdfUrl, leaseId, children }: LeaseSplitViewProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadLeaseDocument(leaseId, formData);
            if (result.error) {
                alert(result.error);
            } else {
                alert("Document vaulted successfully");
                // The page will revalidate, so pdfUrl prop will update
            }
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="relative min-h-screen">
            {/* TOGGLE BUTTON - Floating */}
            <div className="fixed bottom-8 right-8 z-50">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "h-14 rounded-full shadow-2xl transition-all duration-300 font-bold flex items-center gap-3 px-6",
                        isOpen
                            ? "bg-white text-slate-800 hover:bg-slate-100 ring-2 ring-slate-200"
                            : !pdfUrl
                                ? "bg-amber-500 text-white hover:bg-amber-600 hover:scale-105" // Amber for "Missing Action"
                                : "bg-[#1e3a5f] text-white hover:bg-[#2a4a73] hover:scale-105"
                    )}
                >
                    {isOpen ? (
                        <>
                            <X className="h-5 w-5" />
                            Close Vault
                        </>
                    ) : !pdfUrl ? (
                        <>
                            <Upload className="h-5 w-5" />
                            Upload Lease
                        </>
                    ) : (
                        <>
                            <FileText className="h-5 w-5" />
                            View Original Lease
                        </>
                    )}
                </Button>
            </div>

            {/* MAIN CONTENT WRAPPER */}
            <div className={cn(
                "transition-all duration-500 ease-in-out w-full",
                isOpen ? "hidden md:block md:pr-[50%]" : "pr-0"
            )}>
                <div className={cn(
                    "transition-all duration-500",
                    isOpen ? "opacity-100" : ""
                )}>
                    {children}
                </div>
            </div>

            {/* SIDE PANEL (VAULT) */}
            <div className={cn(
                "fixed top-0 right-0 h-screen bg-slate-100 border-l border-slate-200 shadow-2xl transition-transform duration-500 ease-in-out z-40 flex flex-col",
                isOpen ? "translate-x-0 w-full md:w-[50%]" : "translate-x-full w-full md:w-[50%]"
            )}>
                {/* HEADER */}
                <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 mt-16 md:mt-0">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className={cn("h-4 w-4", !pdfUrl ? "text-amber-500" : "text-[#1e3a5f]")} />
                        <span className="font-bold text-slate-700 text-sm uppercase tracking-wider">
                            {!pdfUrl ? "Document Vault (Empty)" : "Original Lease Document"}
                        </span>
                    </div>
                    {pdfUrl && (
                        <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="text-[#1e3a5f] hover:bg-[#1e3a5f]/10 text-xs font-bold gap-2">
                                <ExternalLink className="h-3 w-3" />
                                Open in New Tab
                            </Button>
                        </a>
                    )}
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 bg-slate-200 p-4 overflow-hidden relative flex flex-col">
                    {pdfUrl ? (
                        // VIEW MODE
                        <>
                            <iframe
                                src={pdfUrl}
                                className="w-full h-full rounded-xl shadow-inner bg-white relative z-10"
                                title="Lease Document"
                            />
                            {/* LOADING SPINNER */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-0">
                                <Loader2 className="animate-spin h-8 w-8 text-[#1e3a5f] mb-2" />
                                <span className="text-xs font-bold uppercase tracking-widest">Loading Document...</span>
                            </div>
                        </>
                    ) : (
                        // UPLOAD MODE (Safety Net)
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="bg-white rounded-[2rem] p-8 max-w-sm text-center shadow-sm space-y-6">
                                <div className="mx-auto bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center">
                                    <Upload className="h-8 w-8 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">Secure Your Lease</h3>
                                    <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                                        This lease record is currently missing the original PDF. Upload it now to ensure you have a backup.
                                    </p>
                                </div>
                                <label className="block">
                                    <input
                                        type="file"
                                        accept="application/pdf,image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        disabled={isUploading}
                                    />
                                    <div className={cn(
                                        "cursor-pointer bg-[#1e3a5f] text-white py-4 rounded-xl font-bold hover:bg-[#2a4a73] transition-all active:scale-95 flex items-center justify-center gap-2",
                                        isUploading ? "opacity-75 cursor-not-allowed" : ""
                                    )}>
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Vaulting...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4" />
                                                Choose File
                                            </>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
