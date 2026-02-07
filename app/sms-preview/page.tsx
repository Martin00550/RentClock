"use client";

import { Card } from "@/components/ui/card";
import { Smartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SMSPreviewPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <div className="flex justify-center mb-6">
                        <div className="bg-[#1e3a5f] p-4 rounded-3xl shadow-xl">
                            <Image src="/icon-192.png" alt="RentClock" width={48} height={48} />
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">SMS Compliance Preview</h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        This page is for Toll-Free Verification (TFV) purposes to demonstrate the RentClock SMS opt-in flow and compliance disclosures.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-100">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        Compliant Opt-in Flow
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden max-w-2xl mx-auto">
                    <div className="bg-slate-900 p-4 text-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Verification Environment</span>
                    </div>
                    <div className="p-8 md:p-12">
                        {/* REPLICATED SMS CONFIGURATION CARD */}
                        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 md:gap-8">
                            <div className="bg-[#1e3a5f] p-5 rounded-[2rem] shadow-2xl shadow-slate-900/20 shrink-0">
                                <Smartphone className="h-10 w-10 text-white" />
                            </div>
                            <div className="flex-1 w-full space-y-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-1 justify-center md:justify-start">
                                        <Image src="/icon-192.png" alt="RentClock" width={24} height={24} className="rounded-lg shadow-sm" />
                                        <span className="text-[12px] font-black text-[#1e3a5f] uppercase tracking-widest">RentClock</span>
                                    </div>
                                    <h4 className="text-xl md:text-2xl font-black text-slate-900 leading-tight tracking-tighter">SMS Configuration</h4>
                                    <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Manage the phone number used for profit protection alerts.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2 w-full text-center md:text-left">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</Label>
                                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto md:mx-0">
                                            <div className="flex gap-2">
                                                <div className="w-[100px] h-12 flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-700 shadow-sm">
                                                    +1
                                                </div>
                                                <Input
                                                    placeholder="555-0123"
                                                    disabled
                                                    className="h-12 flex-1 bg-slate-50 border-slate-200 rounded-xl px-4 font-bold text-slate-400 shadow-sm cursor-not-allowed"
                                                />
                                            </div>
                                            <Button
                                                disabled
                                                className="h-12 bg-[#1e3a5f] text-white rounded-xl font-black shadow-lg opacity-80 px-6 cursor-not-allowed"
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 max-w-md mx-auto md:mx-0">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                                            Demo mode: No data will be saved.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-slate-400 text-[10px] mt-4 leading-relaxed max-w-md">
                                            By providing your phone number, you agree to receive automated transactional text messages (alerts and reminders) from RentClock. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply STOP to cancel or HELP for more information. View our <Link href="/privacy" className="underline hover:text-[#1e3a5f]">Privacy Policy</Link> and <Link href="/terms" className="underline hover:text-[#1e3a5f]">Terms of Service</Link>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="rounded-[2rem] border-slate-200 bg-white p-6 shadow-xl hover:shadow-2xl transition-all border-l-4 border-l-[#1e3a5f]">
                        <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#1e3a5f] rounded-full" />
                            Privacy Policy
                        </h5>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                            Independent clause stating mobile info is not shared for marketing.
                        </p>
                        <Link href="/privacy">
                            <Button variant="outline" className="w-full rounded-xl font-bold text-xs uppercase tracking-widest h-10">Read Policy</Button>
                        </Link>
                    </Card>

                    <Card className="rounded-[2rem] border-slate-200 bg-white p-6 shadow-xl hover:shadow-2xl transition-all border-l-4 border-l-[#d4a853]">
                        <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#d4a853] rounded-full" />
                            Terms of Service
                        </h5>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                            Includes detailed HELP/STOP instructions and carrier terms.
                        </p>
                        <Link href="/terms">
                            <Button variant="outline" className="w-full rounded-xl font-bold text-xs uppercase tracking-widest h-10">Read Terms</Button>
                        </Link>
                    </Card>
                </div>

                <div className="text-center pt-8 border-t border-slate-200">
                    <Link href="/" className="text-sm font-bold text-slate-400 hover:text-[#1e3a5f] transition-colors">
                        &larr; Return to RentClock Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
