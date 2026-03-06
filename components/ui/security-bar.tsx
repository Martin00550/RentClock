"use client";

import { ShieldCheck, Lock, Cloud, Check } from "lucide-react";

export function SecurityBar({ variant = "full" }: { variant?: "full" | "subtle" }) {
    if (variant === "subtle") {
        return (
            <div className="px-8 py-6 border-t border-slate-200 bg-slate-50/50">
                <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400">
                    <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">256-bit SSL/TLS</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Protected by Clerk</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Cloud className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Daily Secure Backups</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="bg-slate-50 border-y border-slate-200 py-12">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex flex-col gap-2 max-w-sm text-center md:text-left">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Industry-Standard Security</h4>
                        <p className="text-xl font-black text-slate-900 leading-tight">
                            Secure your lease data. Built for property managers.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#1e3a5f]/5 p-2 rounded-lg text-[#1e3a5f]">
                                <Lock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-[#1e3a5f] uppercase tracking-wide">Encrypted</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">SSL/TLS 256-bit</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-[#1e3a5f]/5 p-2 rounded-lg text-[#1e3a5f]">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-[#1e3a5f] uppercase tracking-wide">Protected</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Clerk Guard</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-[#2d6a4f]/5 p-2 rounded-lg text-[#2d6a4f]">
                                <Cloud className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-[#2d6a4f] uppercase tracking-wide">Redundant</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Cloud Backups</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-[#d4a853]/5 p-2 rounded-lg text-[#d4a853]">
                                <Check className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-[#d4a853] uppercase tracking-wide">Private</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Your Data Only</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
