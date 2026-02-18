"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays, differenceInDays, isValid } from "date-fns";
import { 
    Calendar as CalendarIcon, 
    Clock, 
    AlertTriangle, 
    ArrowRight, 
    ShieldCheck, 
    CheckCircle2,
    XCircle,
    Bell,
    DollarSign
} from "lucide-react";
import { SignUpTrigger } from "@/components/landing/signup-trigger";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type UrgencyState = "safe" | "warning" | "critical" | "overdue";

interface AuditResult {
    noticeDeadline: Date;
    daysRemaining: number;
    urgency: UrgencyState;
}

const NOTICE_PERIODS = [
    { value: 60, label: "60 days" },
    { value: 90, label: "90 days" },
    { value: 120, label: "120 days" },
];

const URGENCY_CONFIG: Record<UrgencyState, {
    gradient: string;
    headerGradient: string;
    icon: React.ReactNode;
    headline: string;
    subheadline: (days: number) => string;
    ctaText: string;
    impactText: (days: number, monthlyRent?: number) => string;
}> = {
    safe: {
        gradient: "from-emerald-50 to-emerald-100/50 border-emerald-200",
        headerGradient: "from-emerald-600 to-emerald-800",
        icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
        headline: "Your Notice Window is Open",
        subheadline: (days) => `You have ${days} days to capture market rates`,
        ctaText: "Prepare Your Notice",
        impactText: () => "You're on track to maximize your rental income.",
    },
    warning: {
        gradient: "from-amber-50 to-amber-100/50 border-amber-200",
        headerGradient: "from-amber-500 to-orange-600",
        icon: <Bell className="h-5 w-5 text-amber-600" />,
        headline: "Action Recommended",
        subheadline: (days) => `Only ${days} days left to avoid revenue lock-in`,
        ctaText: "Generate Notice Now",
        impactText: (days, monthlyRent) => {
            if (monthlyRent && monthlyRent > 0) {
                const potentialLoss = Math.round(monthlyRent * 12 * 0.035);
                return `Missing this deadline could cost you ${formatCurrency(potentialLoss)}/year.`;
            }
            return "Time is running out to secure your rent increase.";
        },
    },
    critical: {
        gradient: "from-red-50 to-rose-100/50 border-red-200",
        headerGradient: "from-red-600 to-rose-700",
        icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
        headline: "URGENT: Notice Deadline Approaching",
        subheadline: (days) => `${days} days to act or lose potential revenue`,
        ctaText: "Emergency Notice Generator",
        impactText: (days, monthlyRent) => {
            if (monthlyRent && monthlyRent > 0) {
                const potentialLoss = Math.round(monthlyRent * 12 * 0.035);
                return `Act now or lose ${formatCurrency(potentialLoss)}/year in potential revenue.`;
            }
            return "Immediate action required to avoid missing your window.";
        },
    },
    overdue: {
        gradient: "from-slate-100 to-slate-200/50 border-slate-300",
        headerGradient: "from-slate-700 to-slate-900",
        icon: <XCircle className="h-5 w-5 text-slate-600" />,
        headline: "Window Closed",
        subheadline: () => "You're locked at current rates until next year",
        ctaText: "Set Alert for Next Window",
        impactText: (days, monthlyRent) => {
            if (monthlyRent && monthlyRent > 0) {
                const potentialLoss = Math.round(monthlyRent * 12 * 0.035);
                return `Missed opportunity: ${formatCurrency(potentialLoss)}/year in lost revenue.`;
            }
            return "The deadline has passed. Set a reminder for next year.";
        },
    },
};

function formatCurrency(num: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(num);
}

function calculateAudit(leaseExpiration: Date, noticePeriod: number): AuditResult {
    const today = new Date();
    const noticeDeadline = subDays(leaseExpiration, noticePeriod);
    const daysRemaining = differenceInDays(noticeDeadline, today);

    let urgency: UrgencyState;
    if (daysRemaining < 0) {
        urgency = "overdue";
    } else if (daysRemaining <= 29) {
        urgency = "critical";
    } else if (daysRemaining <= 59) {
        urgency = "warning";
    } else {
        urgency = "safe";
    }

    return {
        noticeDeadline,
        daysRemaining,
        urgency,
    };
}

export function NoticeWindowAudit() {
    const [leaseExpiration, setLeaseExpiration] = useState<Date | undefined>(undefined);
    const [noticePeriod, setNoticePeriod] = useState<number>(90);
    const [monthlyRent, setMonthlyRent] = useState("");
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [result, setResult] = useState<AuditResult | null>(null);
    const [showRentInput, setShowRentInput] = useState(false);

    useEffect(() => {
        if (leaseExpiration && isValid(leaseExpiration)) {
            const auditResult = calculateAudit(leaseExpiration, noticePeriod);
            setResult(auditResult);
        } else {
            setResult(null);
        }
    }, [leaseExpiration, noticePeriod]);

    const handleDateSelect = (date: Date | undefined) => {
        setLeaseExpiration(date);
        setCalendarOpen(false);
    };

    const handleQuickDate = (daysFromNow: number) => {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        setLeaseExpiration(date);
    };

    const config = result ? URGENCY_CONFIG[result.urgency] : null;
    const rentValue = monthlyRent ? parseFloat(monthlyRent.replace(/,/g, "")) : 0;

    return (
        <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-linear-to-r from-[#1e3a5f] to-[#d4a853] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>

            <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className={cn(
                    "bg-linear-to-r px-6 py-4 transition-all duration-500",
                    result ? config?.headerGradient : "from-[#1e3a5f] to-[#2a4a73]"
                )}>
                    <div className="flex items-center gap-2 text-white">
                        <Clock className="h-5 w-5 text-[#d4a853]" />
                        <span className="text-sm font-bold">Notice Window Audit</span>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Lease Expiration Date */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Lease Expiration Date
                            </label>
                            <span className="text-[10px] font-bold text-[#1e3a5f] bg-[#1e3a5f]/5 px-2 py-0.5 rounded-md animate-pulse">
                                Required
                            </span>
                        </div>
                        
                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full h-16 justify-start text-left font-normal rounded-xl border-slate-200 hover:bg-slate-50 transition-all",
                                        !leaseExpiration && "text-slate-400"
                                    )}
                                >
                                    <CalendarIcon className="mr-3 h-5 w-5 text-slate-400" />
                                    <span className="text-lg">
                                        {leaseExpiration ? format(leaseExpiration, "MMMM d, yyyy") : "Select a date..."}
                                    </span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={leaseExpiration}
                                    onSelect={handleDateSelect}
                                    initialFocus
                                    disabled={(date) => date < new Date()}
                                />
                            </PopoverContent>
                        </Popover>

                        {/* Quick Date Buttons */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Quick:</span>
                            {[
                                { label: "90 days", days: 90 },
                                { label: "6 months", days: 180 },
                                { label: "1 year", days: 365 },
                            ].map((option) => (
                                <button
                                    key={option.days}
                                    onClick={() => handleQuickDate(option.days)}
                                    className="text-[10px] font-bold text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white border border-[#1e3a5f]/20 px-2 py-1 rounded-md transition-all"
                                >
                                    +{option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notice Period Dropdown */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Required Notice Period
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {NOTICE_PERIODS.map((period) => (
                                <button
                                    key={period.value}
                                    onClick={() => setNoticePeriod(period.value)}
                                    className={cn(
                                        "py-3 px-2 rounded-xl text-sm font-bold transition-all border",
                                        noticePeriod === period.value
                                            ? "bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-md"
                                            : "bg-slate-50 text-slate-600 border-slate-200 hover:border-[#1e3a5f]/50"
                                    )}
                                >
                                    {period.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Optional Monthly Rent */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Monthly Rent (Optional)
                            </label>
                            <button
                                onClick={() => setShowRentInput(!showRentInput)}
                                className="text-[10px] font-bold text-[#1e3a5f] hover:underline"
                            >
                                {showRentInput ? "Hide" : "Add for revenue impact"}
                            </button>
                        </div>
                        
                        <AnimatePresence>
                            {showRentInput && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="relative group/input"
                                >
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        type="text"
                                        placeholder="e.g. 5,000"
                                        value={monthlyRent}
                                        onChange={(e) => setMonthlyRent(e.target.value)}
                                        className="pl-10 h-14 text-2xl font-bold rounded-xl border-slate-200 focus-visible:ring-[#1e3a5f] bg-slate-50/50"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Audit Result Card */}
                    <AnimatePresence mode="wait">
                        {result && config && (
                            <motion.div
                                key={result.urgency}
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: "auto", scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                    "rounded-xl p-5 border-2 overflow-hidden bg-linear-to-br",
                                    config.gradient
                                )}
                            >
                                <div className="flex flex-col gap-4">
                                    {/* Header */}
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            "p-2.5 rounded-lg mt-0.5",
                                            result.urgency === "safe" && "bg-emerald-100",
                                            result.urgency === "warning" && "bg-amber-100",
                                            result.urgency === "critical" && "bg-red-100",
                                            result.urgency === "overdue" && "bg-slate-200",
                                        )}>
                                            {config.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className={cn(
                                                "text-xs font-black uppercase tracking-widest mb-1",
                                                result.urgency === "safe" && "text-emerald-800",
                                                result.urgency === "warning" && "text-amber-800",
                                                result.urgency === "critical" && "text-red-800",
                                                result.urgency === "overdue" && "text-slate-700",
                                            )}>
                                                {result.urgency === "critical" && "🚨 "}
                                                Notice Deadline
                                            </p>
                                            <p className={cn(
                                                "text-3xl md:text-4xl font-black tracking-tighter",
                                                result.urgency === "safe" && "text-emerald-900",
                                                result.urgency === "warning" && "text-amber-900",
                                                result.urgency === "critical" && "text-red-900",
                                                result.urgency === "overdue" && "text-slate-800",
                                            )}>
                                                {format(result.noticeDeadline, "MMMM d, yyyy")}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Days Remaining */}
                                    <div className="flex items-baseline gap-2">
                                        <span className={cn(
                                            "text-4xl md:text-5xl font-black",
                                            result.urgency === "safe" && "text-emerald-700",
                                            result.urgency === "warning" && "text-amber-700",
                                            result.urgency === "critical" && "text-red-700 animate-pulse",
                                            result.urgency === "overdue" && "text-slate-600",
                                        )}>
                                            {result.daysRemaining < 0 ? 0 : result.daysRemaining}
                                        </span>
                                        <span className={cn(
                                            "text-lg font-bold",
                                            result.urgency === "safe" && "text-emerald-600",
                                            result.urgency === "warning" && "text-amber-600",
                                            result.urgency === "critical" && "text-red-600",
                                            result.urgency === "overdue" && "text-slate-500",
                                        )}>
                                            days {result.daysRemaining < 0 ? "overdue" : "remaining"}
                                        </span>
                                    </div>

                                    {/* Subheadline */}
                                    <p className={cn(
                                        "text-sm font-semibold",
                                        result.urgency === "safe" && "text-emerald-700",
                                        result.urgency === "warning" && "text-amber-700",
                                        result.urgency === "critical" && "text-red-700",
                                        result.urgency === "overdue" && "text-slate-600",
                                    )}>
                                        {config.subheadline(result.daysRemaining < 0 ? 0 : result.daysRemaining)}
                                    </p>

                                    {/* Impact Statement */}
                                    <div className="pt-3 border-t border-slate-200/50">
                                        <p className={cn(
                                            "text-xs font-medium leading-relaxed",
                                            result.urgency === "safe" && "text-emerald-700/80",
                                            result.urgency === "warning" && "text-amber-700/80",
                                            result.urgency === "critical" && "text-red-700/80",
                                            result.urgency === "overdue" && "text-slate-600/80",
                                        )}>
                                            {config.impactText(result.daysRemaining, rentValue > 0 ? rentValue : undefined)}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* CTA */}
                    <SignUpTrigger>
                        <Button
                            className={cn(
                                "w-full h-14 rounded-xl font-bold text-base transition-all shadow-lg flex items-center justify-center gap-2",
                                result 
                                    ? "bg-[#1e3a5f] hover:bg-[#2a4a73] text-white"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed hover:bg-slate-200"
                            )}
                            disabled={!result}
                        >
                            {result ? (
                                <>
                                    {URGENCY_CONFIG[result.urgency].ctaText}
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            ) : (
                                "Enter a date to see your deadline"
                            )}
                        </Button>
                    </SignUpTrigger>

                    <div className="flex flex-col gap-2 mt-2 text-center">
                        <p className="text-[10px] text-slate-400 font-medium mb-1">
                            Don&apos;t let a missed deadline cost you thousands.
                        </p>
                        <div className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 rounded-xl border border-slate-100">
                            <CheckCircle2 className="h-4 w-4 text-[#2d6a4f]" />
                            <p className="text-sm font-bold text-slate-600">
                                First 3 Leases Free • No Credit Card
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
