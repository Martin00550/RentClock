"use client";

import { BadgeCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";

export function BillingContent() {
    const { user } = useUser();
    const [isPro, setIsPro] = useState(false);
    const [leaseCount, setLeaseCount] = useState(0);
    const [paddle, setPaddle] = useState<Paddle>();

    useEffect(() => {
        initializePaddle({
            environment: (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as "sandbox" | "production") || "production",
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
            eventCallback: (data) => {
                if (data.name === "checkout.completed") {
                    window.location.reload();
                }
            }
        }).then((paddleInstance) => {
            if (paddleInstance) {
                setPaddle(paddleInstance);
            }
        });
    }, []);

    const handleCheckout = (priceId: string) => {
        if (!paddle || !user) return;

        paddle.Checkout.open({
            items: [{ priceId, quantity: 1 }],
            customer: {
                email: user.primaryEmailAddress?.emailAddress || ""
            },
            customData: {
                userId: user.id
            }
        });
    };

    useEffect(() => {
        async function loadData() {
            if (!user) return;
            try {
                // Fetch Pro status
                const profileRes = await fetch("/api/user/profile");
                if (profileRes.ok) {
                    const data = await profileRes.json();
                    setIsPro(data.is_pro || false);
                }

                // Fetch lease count
                const leasesRes = await fetch("/api/user/leases-count");
                if (leasesRes.ok) {
                    const leasesData = await leasesRes.json();
                    setLeaseCount(leasesData.count || 0);
                }
            } catch (error) {
                console.error("Error loading billing data:", error);
            }
        }
        loadData();
    }, [user]);

    return (
        <div className="flex flex-col gap-8 max-w-5xl">
            <div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Billing & Usage</h1>
                <p className="text-slate-500 mt-2 text-lg">Manage your subscription and monitor your lease usage.</p>
            </div>

            <div>
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Current Plan</h3>
                    <div className={isPro
                        ? "bg-[#d4a853]/10 text-[#d4a853] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#d4a853]/20"
                        : "bg-[#2d6a4f]/10 text-[#2d6a4f] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#2d6a4f]/20"
                    }>
                        {isPro ? "Pro Plan" : "Free Plan"}
                    </div>
                </div>

                <div className="grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <Card className={`rounded-[2.5rem] ${isPro ? "bg-[#1e3a5f]" : "bg-slate-900"} text-white overflow-hidden shadow-2xl relative`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4a853]/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                            <CardContent className="p-10 space-y-10">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4a853]/80">Active Subscription</span>
                                    <h4 className="text-4xl font-black tracking-tighter">{isPro ? "Pro" : "Free Forever"}</h4>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl font-black tracking-tighter">{isPro ? "$39" : "$0"}</span>
                                    <span className="text-slate-400 font-bold text-xl tracking-tight">
                                        {isPro ? "/month after 7-day trial" : "/month"}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {isPro ? (
                                        <>
                                            {["Unlimited leases", "Profit Protection Analytics", "Legal Notice Generation", "Email Alerts (7/30/60/90 Days)", "SMS Alerts (7/30/60/90 Days)", "Calendar Sync"].map((feature) => (
                                                <div key={feature} className="flex items-center gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                                    <div className="bg-[#d4a853]/20 p-1 rounded-full"><BadgeCheck className="h-5 w-5 text-[#d4a853]" /></div>
                                                    <span className="text-sm font-bold text-slate-200">{feature}</span>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            {["3 active leases", "Profit Protection Analytics", "Legal Notice Generation", "Email Alerts (7/30/60/90 Days)", "No credit card required"].map((feature) => (
                                                <div key={feature} className="flex items-center gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                                    <div className="bg-[#d4a853]/20 p-1 rounded-full"><BadgeCheck className="h-5 w-5 text-[#d4a853]" /></div>
                                                    <span className="text-sm font-bold text-slate-200">{feature}</span>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                                {isPro ? (
                                    <a href="https://sandbox-buyers-portal.paddle.com/subscriptions" target="_blank" rel="noopener noreferrer">
                                        <Button className="w-full h-16 bg-white/10 hover:bg-white/20 text-white font-black text-lg rounded-2xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]">
                                            Manage Subscription
                                            <ExternalLink className="h-5 w-5" />
                                        </Button>
                                    </a>
                                ) : (
                                    <Button
                                        onClick={() => handleCheckout(process.env.NEXT_PUBLIC_PADDLE_PRO_ANNUAL_PRICE_ID || "")}
                                        className="w-full h-16 bg-[#1e3a5f] hover:bg-[#2a4a73] text-white font-black text-lg rounded-2xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]"
                                    >
                                        Upgrade to Pro
                                        <ExternalLink className="h-5 w-5" />
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-7 flex flex-col gap-8 pt-6">
                        {!isPro && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="font-extrabold text-slate-800 text-lg">Lease Limit Usage</span>
                                    <span className="font-black text-[#1e3a5f] text-lg">{Math.round((leaseCount / 3) * 100)}%</span>
                                </div>
                                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                                    <div
                                        className={`h-full rounded-full shadow-lg shadow-slate-200 transition-all duration-1000 ease-out ${leaseCount >= 3 ? "bg-red-500" : leaseCount >= 2 ? "bg-amber-500" : "bg-[#1e3a5f]"
                                            }`}
                                        style={{ width: `${Math.min((leaseCount / 3) * 100, 100)}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-[12px] font-black text-slate-400 uppercase tracking-[0.15em]">
                                    <span>{leaseCount} of 3 leases tracked</span>
                                    <span>{Math.max(0, 3 - leaseCount)} slots remaining</span>
                                </div>
                                {leaseCount >= 2 && (
                                    <div className={`p-4 rounded-2xl border ${leaseCount >= 3 ? "bg-red-50 border-red-200 text-red-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
                                        <p className="text-sm font-bold">
                                            {leaseCount >= 3
                                                ? "You've reached your free limit. Upgrade to Pro for unlimited leases."
                                                : "1 slot remaining. Upgrade now for unlimited leases."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                        {isPro && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="font-extrabold text-slate-800 text-lg">Leases Under Protection</span>
                                    <span className="font-black text-[#2d6a4f] text-lg">{leaseCount} Active</span>
                                </div>
                                <div className="p-6 bg-[#2d6a4f]/5 border border-[#2d6a4f]/10 rounded-2xl">
                                    <p className="text-sm font-bold text-[#2d6a4f]">
                                        ✓ Unlimited leases with your Pro subscription
                                    </p>
                                </div>
                            </div>
                        )}
                        {!isPro && (
                            <Card className="rounded-3xl border-[#1e3a5f]/20 bg-[#1e3a5f]/5 p-8 flex flex-col gap-6">
                                <h4 className="font-extrabold text-slate-900 tracking-tight">Upgrade to Pro</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white border-2 border-[#1e3a5f] rounded-2xl relative">
                                        <div className="absolute -top-3 left-4 bg-[#d4a853] text-[#1e3a5f] text-[10px] font-bold px-2 py-0.5 rounded-full">Save 20%</div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">Annual <span className="text-[#2d6a4f]">(Recommended)</span></span>
                                            <span className="text-2xl font-black text-slate-900">$39<span className="text-sm text-slate-500 font-medium">/mo</span></span>
                                            <span className="text-xs text-slate-500">7-day free trial, then $468/year</span>
                                        </div>
                                        <Button
                                            onClick={() => handleCheckout(process.env.NEXT_PUBLIC_PADDLE_PRO_ANNUAL_PRICE_ID || "")}
                                            className="bg-[#1e3a5f] hover:bg-[#2a4a73] text-white font-bold"
                                        >
                                            Start Free Trial
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-500">Monthly</span>
                                            <span className="text-xl font-black text-slate-600">$49<span className="text-sm text-slate-400 font-medium">/mo</span></span>
                                            <span className="text-xs text-slate-500">7-day free trial, then $49/mo</span>
                                        </div>
                                        <Button
                                            onClick={() => handleCheckout(process.env.NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID || "")}
                                            variant="outline"
                                            className="border-slate-300 text-slate-600 font-bold"
                                        >
                                            Start Free Trial
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
            {/* Help & Support */}
            <div className="mt-12 pt-12 border-t border-slate-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-10 bg-slate-50 border border-slate-200 rounded-[2.5rem]">
                    <div className="text-center md:text-left space-y-2">
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">Need help or a refund?</h4>
                        <p className="text-slate-500 font-medium">Every subscription is backed by the full RentClock 14-day money-back guarantee.</p>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Reach out directly to</span>
                        <a href="mailto:support@rentclock.online" className="text-xl md:text-2xl font-black text-[#1e3a5f] hover:scale-105 transition-transform">
                            support@rentclock.online
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
