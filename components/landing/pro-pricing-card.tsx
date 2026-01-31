"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignUpTrigger } from "@/components/landing/signup-trigger";
import { CheckCircle2 } from "lucide-react";

export function ProPricingCard() {
    const [isAnnual, setIsAnnual] = useState(true);

    const price = isAnnual ? 39 : 49;
    const period = isAnnual ? "/month" : "/month";
    const billingNote = isAnnual ? "Billed annually at $468/year" : "Billed monthly";

    return (
        <div className="bg-white border-2 border-[#1e3a5f] rounded-2xl p-8 shadow-xl relative">
            {isAnnual && (
                <div className="absolute top-0 left-0 right-0 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-[2px] bg-[#1e3a5f] absolute top-1/2 left-0 -translate-y-1/2 opacity-20" />
                    <div className="bg-[#1e3a5f] text-white text-[13px] font-extrabold px-6 py-2 rounded-full uppercase tracking-widest relative shadow-xl border border-white/10">
                        Save $120 Per Year
                    </div>
                </div>
            )}
            <div className="mb-6 pt-4">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-2">
                    Pro
                </h3>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-3 mb-4 p-1 bg-slate-100 rounded-xl">
                    <button
                        onClick={() => setIsAnnual(false)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!isAnnual
                            ? "bg-white text-[#1e3a5f] shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setIsAnnual(true)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isAnnual
                            ? "bg-white text-[#1e3a5f] shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        Annual
                    </button>
                </div>

                <div className="flex items-baseline gap-2 justify-center">
                    <span className="text-5xl font-extrabold text-slate-900">${price}</span>
                    <span className="text-slate-500">{period}</span>
                    {isAnnual && <span className="text-sm text-slate-400 line-through">$49</span>}
                </div>
                <p className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-tight text-center">
                    Less than 15 mins of a lawyer&apos;s billable hour
                </p>
                <p className="text-sm text-[#2d6a4f] font-medium mt-1 text-center">{billingNote}</p>
            </div>
            <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-[#2d6a4f] shrink-0" />
                    <span><strong>Unlimited Leases</strong></span>
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-[#2d6a4f] shrink-0" />
                    <span>Profit Protection Analytics</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-[#2d6a4f] shrink-0" />
                    <span>Auto-Generates PDF Notices</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-[#2d6a4f] shrink-0" />
                    <span>Automated Lease Entry</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-[#2d6a4f] shrink-0" />
                    <span>Lease & Rent Increase Alerts (Email)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-[#2d6a4f] shrink-0" />
                    <span>Lease & Rent Increase Alerts (SMS)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-[#2d6a4f] shrink-0" />
                    <span>Calendar Sync</span>
                </li>
            </ul>
            <SignUpTrigger redirectUrl={`/billing?checkout=${isAnnual ? 'pro_annual' : 'pro_monthly'}`}>
                <Button className="w-full bg-[#1e3a5f] hover:bg-[#2a4a73] text-white py-5 h-auto rounded-xl font-bold text-lg transition-colors shadow-lg shadow-slate-900/10">
                    Start 7-Day Free Trial
                </Button>
            </SignUpTrigger>
            <p className="text-center text-slate-400 text-sm mt-4 leading-relaxed px-4">
                Trial is free. Payments covered by 14-day money-back guarantee.
            </p>
        </div >
    );
}
