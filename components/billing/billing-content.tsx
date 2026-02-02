"use client";

import { BadgeCheck, ExternalLink, CreditCard, History, XCircle, ChevronDown, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useRef, useCallback } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { useSearchParams } from "next/navigation";

interface Invoice {
    id: string;
    status: string;
    createdAt: string;
    total: string;
    currencyCode: string;
}

export function BillingContent() {
    const { user } = useUser();
    const searchParams = useSearchParams();
    const [isPro, setIsPro] = useState(false);
    const [leaseCount, setLeaseCount] = useState(0);
    const [paddle, setPaddle] = useState<Paddle>();
    const hasTriggeredAutoCheckout = useRef(false);

    // Modal states
    const [showInvoicesModal, setShowInvoicesModal] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loadingInvoices, setLoadingInvoices] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [updatingPayment, setUpdatingPayment] = useState(false);

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

    const handleCheckout = useCallback((priceId: string) => {
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
    }, [paddle, user]);

    // Handle Auto-Checkout from Landing Page
    useEffect(() => {
        const checkoutType = searchParams.get("checkout");

        if (paddle && user && checkoutType && !isPro && !hasTriggeredAutoCheckout.current) {
            hasTriggeredAutoCheckout.current = true;

            const priceId = checkoutType === 'pro_annual'
                ? process.env.NEXT_PUBLIC_PADDLE_PRO_ANNUAL_PRICE_ID
                : checkoutType === 'pro_monthly'
                    ? process.env.NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID
                    : null;

            if (priceId) {
                handleCheckout(priceId);
            }
        }
    }, [paddle, user, isPro, searchParams, handleCheckout]);



    // Update Payment Method - Opens Paddle Checkout with saved transaction
    const handleUpdatePayment = async () => {
        if (!paddle) return;
        setUpdatingPayment(true);

        try {
            const res = await fetch("/api/subscription/update-payment-transaction");
            if (!res.ok) throw new Error("Failed to get transaction");

            const { transactionId } = await res.json();

            paddle.Checkout.open({
                transactionId
            });
        } catch (error) {
            console.error("Error updating payment:", error);
            alert("Failed to open payment update. Please try again.");
        } finally {
            setUpdatingPayment(false);
        }
    };

    // Fetch Invoices
    const handleOpenInvoices = async () => {
        setShowInvoicesModal(true);
        setLoadingInvoices(true);

        try {
            const res = await fetch("/api/subscription/invoices");
            if (res.ok) {
                const data = await res.json();
                setInvoices(data.invoices || []);
            }
        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoadingInvoices(false);
        }
    };

    // Download Invoice PDF
    const handleDownloadInvoice = async (transactionId: string) => {
        try {
            const res = await fetch(`/api/subscription/invoice-pdf?transactionId=${transactionId}`);
            if (res.ok) {
                const { url } = await res.json();
                window.open(url, "_blank");
            }
        } catch (error) {
            console.error("Error downloading invoice:", error);
        }
    };

    // Cancel Subscription
    const handleCancelSubscription = async () => {
        setCancelling(true);

        try {
            const res = await fetch("/api/subscription/cancel", { method: "POST" });
            if (res.ok) {
                setShowCancelDialog(false);
                alert("Your subscription will be cancelled at the end of the current billing period.");
                window.location.reload();
            } else {
                throw new Error("Failed to cancel");
            }
        } catch (error) {
            console.error("Error cancelling subscription:", error);
            alert("Failed to cancel subscription. Please try again or contact support.");
        } finally {
            setCancelling(false);
        }
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

    const formatCurrency = (amount: string, currency: string) => {
        const num = parseInt(amount) / 100;
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(num);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <>
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
                                                {["Unlimited Leases", "Profit Protection Analytics", "Auto-Generates PDF Notices", "Automated Lease Entry", "Lease & Rent Increase Alerts (Email)", "Lease & Rent Increase Alerts (SMS)", "Calendar Sync"].map((feature) => (
                                                    <div key={feature} className="flex items-center gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                                        <div className="bg-[#d4a853]/20 p-1 rounded-full"><BadgeCheck className="h-5 w-5 text-[#d4a853]" /></div>
                                                        <span className="text-sm font-bold text-slate-200">{feature}</span>
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <>
                                                {["3 Active Leases", "Profit Protection Analytics", "Auto-Generates PDF Notices", "Automated Lease Entry", "Lease & Rent Increase Alerts (Email)"].map((feature) => (
                                                    <div key={feature} className="flex items-center gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                                        <div className="bg-[#d4a853]/20 p-1 rounded-full"><BadgeCheck className="h-5 w-5 text-[#d4a853]" /></div>
                                                        <span className="text-sm font-bold text-slate-200">{feature}</span>
                                                    </div>
                                                ))}
                                            </>
                                        )}

                                    </div>
                                    {isPro ? (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button className="w-full h-16 bg-white/10 hover:bg-white/20 text-white font-black text-lg rounded-2xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]">
                                                    Manage Subscription
                                                    <ChevronDown className="h-5 w-5" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-64 bg-slate-900 border-white/10 p-2 rounded-2xl shadow-2xl" align="end">
                                                <div className="flex flex-col gap-1">
                                                    <button
                                                        onClick={handleUpdatePayment}
                                                        disabled={updatingPayment}
                                                        className="flex items-center gap-3 w-full p-3 hover:bg-white/5 rounded-xl text-left transition-colors group disabled:opacity-50"
                                                    >
                                                        <div className="bg-blue-500/20 p-2 rounded-lg group-hover:bg-blue-500/30">
                                                            {updatingPayment ? <Loader2 className="h-4 w-4 text-blue-400 animate-spin" /> : <CreditCard className="h-4 w-4 text-blue-400" />}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-white">Update Payment</span>
                                                            <span className="text-[10px] text-slate-400">Change your card info</span>
                                                        </div>
                                                    </button>

                                                    <button
                                                        onClick={handleOpenInvoices}
                                                        className="flex items-center gap-3 w-full p-3 hover:bg-white/5 rounded-xl text-left transition-colors group"
                                                    >
                                                        <div className="bg-purple-500/20 p-2 rounded-lg group-hover:bg-purple-500/30">
                                                            <History className="h-4 w-4 text-purple-400" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-white">Billing History</span>
                                                            <span className="text-[10px] text-slate-400">View past invoices</span>
                                                        </div>
                                                    </button>

                                                    <div className="h-px bg-white/5 my-1" />

                                                    <button
                                                        onClick={() => setShowCancelDialog(true)}
                                                        className="flex items-center gap-3 w-full p-3 hover:bg-red-500/10 rounded-xl text-left transition-colors group"
                                                    >
                                                        <div className="bg-red-500/20 p-2 rounded-lg group-hover:bg-red-500/30">
                                                            <XCircle className="h-4 w-4 text-red-400" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-white group-hover:text-red-400">Cancel Subscription</span>
                                                            <span className="text-[10px] text-slate-400">Stop future charges</span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
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
                                    <p className="text-center text-slate-500 text-sm font-medium">
                                        Trial is free. Payments covered by 14-day money-back guarantee.
                                    </p>
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

            {/* Invoices Modal */}
            <Dialog open={showInvoicesModal} onOpenChange={setShowInvoicesModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black">Billing History</DialogTitle>
                        <DialogDescription>View and download your past invoices.</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto">
                        {loadingInvoices ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                            </div>
                        ) : invoices.length === 0 ? (
                            <p className="text-center text-slate-500 py-8">No invoices found.</p>
                        ) : (
                            invoices.map((invoice) => (
                                <div key={invoice.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div>
                                        <p className="font-bold text-slate-900">{formatDate(invoice.createdAt)}</p>
                                        <p className="text-sm text-slate-500">{formatCurrency(invoice.total, invoice.currencyCode)}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDownloadInvoice(invoice.id)}
                                        className="text-[#1e3a5f] hover:bg-[#1e3a5f]/10"
                                    >
                                        <Download className="h-4 w-4 mr-1" />
                                        PDF
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Cancel Subscription Dialog */}
            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black text-red-600">Cancel Subscription?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-600">
                            Your subscription will remain active until the end of your current billing period. After that, you will lose access to Pro features including unlimited leases, SMS alerts, and calendar sync.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={cancelling}>Keep Subscription</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancelSubscription}
                            disabled={cancelling}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {cancelling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Cancel Subscription
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
