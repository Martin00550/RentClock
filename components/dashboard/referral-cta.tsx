"use client";

import { Copy, Gift, ShieldCheck, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ReferralCTAProps {
    referralCode: string;
    isPro: boolean;
    bonusLeases: number;
}

export function ReferralCTA({ referralCode, isPro, bonusLeases }: ReferralCTAProps) {
    const [copied, setCopied] = useState(false);

    // Pro Users: Use static Coupon Code
    // Free Users: Use unique Referral Link
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const referralLink = isPro ? "FRIEND20" : `${baseUrl}/sign-up?ref=${referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        // Only trigger toast/alert if needed, but the button text change is usually enough feedback
        setTimeout(() => setCopied(false), 2000);
    };

    if (isPro) {
        // PRO VERSION: "Share the Wealth"
        return (
            <Card className="bg-[#1e3a5f] text-white overflow-hidden relative border-none shadow-2xl rounded-3xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4a853]/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2 max-w-xl">
                        <div className="flex items-center gap-2 text-[#d4a853] font-bold uppercase tracking-wider text-xs">
                            <Gift className="h-4 w-4" />
                            <span>Exclusive Pro Perk</span>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight">Be the Hero. Gift 20% Off.</h3>
                        <p className="text-slate-300 font-medium">
                            Your status unlocks a special discount for your network. Share this code so they can save 20% on RentClock Pro.
                        </p>
                    </div>
                    <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-3 bg-white/10 p-2 pl-4 rounded-xl border border-white/10 w-full md:w-auto">
                            <span className="font-mono font-bold text-[#d4a853] tracking-widest text-sm md:text-base">FRIEND20</span>
                            <Button
                                onClick={handleCopy}
                                size="sm"
                                className="bg-white text-[#1e3a5f] hover:bg-slate-100 font-bold ml-auto md:ml-0"
                            >
                                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                {copied ? "Copied" : "Copy Code"}
                            </Button>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">Applies at checkout.</p>
                    </div>
                </div>
            </Card>
        );
    }

    // FREE VERSION: "Unlock Space"
    return (
        <Card className="bg-linear-to-r from-emerald-600 to-emerald-800 text-white overflow-hidden relative border-none shadow-xl rounded-3xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2 text-emerald-200 font-bold uppercase tracking-wider text-xs">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Expand Your Safety Net</span>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">Unlock +1 Free Lease Slot</h3>
                    <p className="text-emerald-100 font-medium leading-relaxed">
                        Help a friend stop the bleed. When they join using your link, you get
                        <span className="font-bold text-white"> +1 free slot </span>
                        added to your account.
                        <span className="mt-1 opacity-75 text-sm font-bold bg-black/20 inline-block px-2 py-0.5 rounded-lg">Current Bonuses Unlocked: {bonusLeases}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto bg-black/20 p-2 pl-4 rounded-xl border border-white/10">
                    <span className="text-sm font-bold text-white/80 whitespace-nowrap hidden md:inline">Invite Link:</span>
                    <Button
                        onClick={handleCopy}
                        size="sm"
                        className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold w-full md:w-auto"
                    >
                        {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                        {copied ? "Copied" : "Copy Link"}
                    </Button>
                </div>
            </div>
        </Card>
    );
}
