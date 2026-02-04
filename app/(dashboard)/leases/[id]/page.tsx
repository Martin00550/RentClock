import { getSignedLeaseUrl } from "@/lib/storage";
import { EditTenantDialog } from "@/components/leases/edit-tenant-dialog";
// import { DeleteLeaseDialog } from "@/components/leases/delete-lease-dialog";
import { AddToCalendar } from "@/components/ui/add-to-calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowLeft,
    Calendar,
    Clock,
    DollarSign,
    User,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { notFound, redirect } from "next/navigation";
import { Lease } from "@/lib/types";
import { format, differenceInDays } from "date-fns";
import { getLeaseStatus, formatCurrency, getNextRelevantEvent, calculateRevenueImpact } from "@/lib/lease-utils";
import { NoticeButton } from "@/components/leases/notice-button";
import { CpiCalculator } from "@/components/leases/cpi-calculator";
import { LeaseSplitView } from "@/components/leases/lease-split-view";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const { data: lease } = await supabaseAdmin
        .from("leases")
        .select("tenant_name, lease_end_date, property_address")
        .eq("id", id)
        .single();

    if (!lease) return { title: "Lease Not Found | RentClock" };

    const status = getLeaseStatus(lease as Lease);
    const statusEmoji = status === "urgent" ? "🚨" : status === "warning" ? "⚠️" : "✅";

    return {
        title: `${statusEmoji} ${lease.tenant_name} | RentClock Alert`,
        description: `Lease expires ${lease.lease_end_date}. Action required for ${lease.property_address}.`,
        openGraph: {
            title: `${lease.tenant_name} - Lease Alert`,
            description: `Lease Status: ${status.toUpperCase()} at ${lease.property_address}`,
            type: "website",
        }
    };
}

export default async function LeaseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    // ... existing setup ...
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const [{ data, error }, { data: userData }] = await Promise.all([
        supabaseAdmin
            .from("leases")
            .select("*")
            .eq("id", id)
            .eq("user_id", userId)
            .single(),
        supabaseAdmin
            .from("users")
            .select("is_pro")
            .eq("id", userId)
            .single()
    ]);

    if (error || !data) {
        if (error && error.code !== "PGRST116") {
            console.error("Error fetching lease:", error);
        }
        notFound();
    }

    const isPro = userData?.is_pro || false;
    const lease: Lease = data;

    // SECURE SIGNED URL GENERATION
    const signedPdfUrl = await getSignedLeaseUrl(lease.pdf_url);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Derived Calculations
    const startDate = lease.lease_start_date ? new Date(lease.lease_start_date) : new Date(lease.created_at);

    // Status
    const status = getLeaseStatus(lease);
    const leaseAgeYears = ((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);
    const revenueImpact = calculateRevenueImpact(lease);

    // Intelligent Calculation using shared util
    const nextEvent = getNextRelevantEvent(lease);
    const nextEventDate = nextEvent?.date || null;
    const nextEventName = nextEvent?.type || "None";

    const daysUntilEvent = nextEventDate ? differenceInDays(nextEventDate, today) : 0;
    const isOverdue = daysUntilEvent < 0;

    // Formatting the string
    const timeString = !nextEventDate
        ? "No upcoming events"
        : isOverdue
            ? `Overdue by ${Math.abs(daysUntilEvent)} days`
            : daysUntilEvent === 0
                ? "Due Today"
                : `Action required in ${daysUntilEvent} days`;

    // ... (rest of the component) ...

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <LeaseSplitView pdfUrl={signedPdfUrl || ""} leaseId={lease.id}>
                <div className="flex flex-col gap-10">

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/leases">
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100">
                                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                                </Button>
                            </Link>
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{lease.tenant_name}</h1>
                                <Badge className={
                                    status === "urgent" ? "bg-red-100 text-red-700 border-red-200" :
                                        status === "warning" ? "bg-amber-100 text-amber-700 border-amber-200" :
                                            "bg-[#2d6a4f]/10 text-[#2d6a4f] border-[#2d6a4f]/20"
                                            + " uppercase tracking-widest font-bold text-[10px] px-3 py-1"}>
                                    {status.toUpperCase()}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <EditTenantDialog lease={lease} isPro={isPro} />
                            {/* <DeleteLeaseDialog leaseId={id} tenantName={lease.tenant_name} /> */}
                        </div>
                    </div>

                    {/* SECTION 1: TOP STATS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 group-data-[is-split=true]/content:grid-cols-1 gap-6 transition-all duration-500">
                        <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-8 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-[#1e3a5f]/10 p-3 w-fit rounded-2xl">
                                <Calendar className="h-6 w-6 text-[#1e3a5f]" />
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em]">Lease Tenure</span>
                                <div className="text-3xl font-black text-slate-900 mt-1">{leaseAgeYears} Years</div>
                            </div>
                        </div>
                        <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-8 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-[#1e3a5f]/10 p-3 w-fit rounded-2xl">
                                <Clock className="h-6 w-6 text-[#1e3a5f]" />
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em]">Next Critical Date</span>
                                <div className={isOverdue ? "text-3xl font-black text-red-600 mt-1 uppercase" : "text-3xl font-black text-slate-900 mt-1 uppercase"}>
                                    {isOverdue ? "OVERDUE" : (nextEventDate ? `${daysUntilEvent} Days` : "NONE")}
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#2d6a4f]/5 border-2 border-[#2d6a4f]/10 rounded-[2rem] p-8 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-[#2d6a4f]/10 p-3 w-fit rounded-2xl">
                                <DollarSign className="h-6 w-6 text-[#2d6a4f]" />
                            </div>
                            <div>
                                <span className="text-[10px] text-[#2d6a4f]/60 font-extrabold uppercase tracking-[0.2em]">Estimated Yearly Gains</span>
                                <div className="text-3xl font-black text-[#2d6a4f] mt-1">+{formatCurrency(revenueImpact)}</div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: DETAILS & TIMELINE */}
                    <div className="grid gap-8 lg:grid-cols-12 group-data-[is-split=true]/content:grid-cols-1 items-start transition-all duration-500">
                        {/* LEFT: TENANT INFO */}
                        <div className="lg:col-span-4 group-data-[is-split=true]/content:col-span-1 h-full">
                            <Card className="rounded-[2.5rem] border-slate-200 shadow-sm h-full overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-[#1e3a5f] p-3 rounded-2xl shadow-lg shadow-slate-900/10">
                                            <User className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Tenant Context</h3>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Direct Details</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Primary Location</span>
                                        <div className="text-lg font-bold text-slate-800 leading-tight">
                                            {lease.property_address}
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-slate-100 flex flex-col gap-4">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Financial Baseline</span>
                                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Base Monthly Rent</span>
                                            <div className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">
                                                {formatCurrency(lease.monthly_rent)}
                                            </div>
                                            {lease.rent_increase_amount && (
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="bg-[#2d6a4f] text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Adjustment Active</span>
                                                    <p className="text-[10px] text-[#2d6a4f] font-black">
                                                        +{formatCurrency(lease.rent_increase_amount)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT: LIFECYCLE */}
                        <div className="lg:col-span-8 group-data-[is-split=true]/content:col-span-1 h-full">
                            <Card className="rounded-[2.5rem] border-slate-200 shadow-sm h-full overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Lease Pulse-line</CardTitle>
                                </CardHeader>
                                <CardContent className="p-10">
                                    <div className="relative pl-10 space-y-16 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                                        {/* TIMELINE ITEM 1: Created */}
                                        <div className="relative">
                                            <div className="absolute -left-[51px] top-1 bg-white border-2 border-slate-200 rounded-full p-2.5 z-10">
                                                <CheckCircle2 className="h-5 w-5 text-slate-300" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                    {format(startDate, "MMMM d, yyyy")}
                                                </span>
                                                <h4 className="text-2xl font-black text-slate-800 tracking-tight">Lease Onboarded</h4>
                                                <p className="text-slate-500 font-medium max-w-md leading-relaxed">Financial terms locked and verification complete.</p>
                                            </div>
                                        </div>

                                        {/* TIMELINE ITEM 2 (ACTIVE) */}
                                        {nextEventDate && (
                                            <div className="relative">
                                                <div className="absolute -left-[51px] top-1 bg-[#1e3a5f] rounded-full p-2.5 z-10 shadow-xl shadow-slate-900/20">
                                                    <Clock className="h-5 w-5 text-white" />
                                                </div>
                                                <div className="pt-2 flex flex-col gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <Badge className={
                                                            isOverdue ? "bg-red-600 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase" :
                                                                "bg-[#1e3a5f] text-white font-black text-[10px] px-3 py-1 rounded-full uppercase"
                                                        }>{isOverdue ? "Action Overdue" : "Strategy Pending"}</Badge>
                                                        <span className={isOverdue ? "text-[10px] font-black text-red-600 uppercase tracking-widest" : "text-[10px] font-black text-[#1e3a5f]/60 uppercase tracking-widest"}>
                                                            Target: {format(nextEventDate, "MMM d, yyyy")}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-10">
                                                        <div>
                                                            <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic">{nextEventName}</h4>
                                                            <p className={isOverdue ? "text-red-500 font-bold text-sm mt-2 max-w-sm" : "text-slate-500 font-medium text-sm mt-2 max-w-sm"}>
                                                                {timeString}. Prepare notice documentation immediately.
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            {isPro && (
                                                                <AddToCalendar
                                                                    event={{
                                                                        title: `${lease.tenant_name} - ${nextEventName}`,
                                                                        description: `Reminder for ${nextEventName}. Property: ${lease.property_address}`,
                                                                        location: lease.property_address || undefined,
                                                                        startDate: nextEventDate
                                                                    }}
                                                                    className="h-12 px-6 rounded-2xl font-bold border-2"
                                                                />
                                                            )}
                                                            {isPro && (
                                                                <NoticeButton lease={lease} type={nextEventName === "Rent Increase" ? "rent-increase" : "renewal"} />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* SECTION 3: FULL WIDTH CALCULATOR */}
                    <div className="w-full">
                        <CpiCalculator currentRent={lease.monthly_rent} />
                    </div>
                </div>
            </LeaseSplitView>
        </div>
    );
}
