"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Mail, MessageSquare } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { Lease } from "@/lib/types";
import { getLeaseStatus, formatCurrency, getNextRelevantEvent } from "@/lib/lease-utils";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function ImminentCriticalDates({ leases }: { leases: Lease[] }) {
    const today = new Date();

    // Sort by upcoming date
    // Sort by upcoming date
    const criticalLeases = leases
        .map(lease => {
            const nextEvent = getNextRelevantEvent(lease);
            if (!nextEvent) return null;

            const daysUntil = differenceInDays(nextEvent.date, today);
            const status = getLeaseStatus(lease);

            return {
                ...lease,
                eventDate: nextEvent.date,
                daysUntil,
                eventType: nextEvent.type,
                computedStatus: status
            };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .filter(item => item.daysUntil >= 0) // Only future events
        .sort((a, b) => a.daysUntil - b.daysUntil)
        .slice(0, 5); // Top 5

    return (
        <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
            <div className="p-6 border-b flex items-center justify-between sticky left-0 bg-white z-10">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Profit Protection Alarms</h2>
                    <p className="text-sm text-slate-500">Upcoming events requiring your final approval.</p>
                </div>
                <Link href="/leases">
                    <Button variant="ghost" size="sm" className="text-[#1e3a5f] hover:text-[#2a4a73] font-bold uppercase text-[10px] tracking-widest">
                        View Entire Portfolio
                    </Button>
                </Link>
            </div>
            <Table className="min-w-[700px] md:min-w-full">
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Tenant & Property</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider text-center">Event</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Due Date</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Countdown</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {criticalLeases.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                No upcoming critical dates found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        criticalLeases.map((lease) => (
                            <TableRow key={lease.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="py-4">
                                    <Link href={`/leases/${lease.id}`} className="hover:underline">
                                        <div className="font-bold text-slate-900 leading-tight">{lease.tenant_name}</div>
                                    </Link>
                                    <div className="text-[10px] text-slate-400 font-medium">{lease.property_address}</div>
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <Badge variant="secondary" className="bg-[#1e3a5f]/10 text-[#1e3a5f] border-[#1e3a5f]/20 font-bold text-[10px] px-2">
                                            {lease.eventType}
                                        </Badge>
                                        {lease.eventType === "Rent Increase" && (
                                            <span className="text-[9px] font-black text-[#2d6a4f] uppercase tracking-tighter">
                                                ROI Impact: {lease.rent_increase_amount ? formatCurrency(lease.rent_increase_amount) : "High"}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 font-bold text-slate-700 text-sm">
                                    {format(lease.eventDate, "MM/dd/yyyy")}
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "h-2 w-2 rounded-full",
                                            lease.computedStatus === "urgent" ? "bg-red-500 animate-pulse" :
                                                lease.computedStatus === "warning" ? "bg-amber-500" : "bg-slate-300"
                                        )} />
                                        <span className={cn(
                                            "text-xs",
                                            lease.computedStatus === "urgent" ? "text-red-600 font-black" :
                                                lease.computedStatus === "warning" ? "text-amber-600 font-bold" : "text-slate-500 font-medium"
                                        )}>
                                            In {lease.daysUntil} days
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                    <div className="flex items-center gap-2 justify-end">
                                        <div className="flex gap-1 mr-2">
                                            {(lease.reminder_60_days_email || lease.reminder_30_days_email) && (
                                                <Mail className="h-3 w-3 text-slate-400" />
                                            )}
                                            {(lease.reminder_60_days_sms || lease.reminder_30_days_sms) && (
                                                <MessageSquare className="h-3 w-3 text-slate-400" />
                                            )}
                                        </div>
                                        <Link href={`/leases/${lease.id}`}>
                                            <Button size="sm" className="bg-[#1e3a5f]/10 text-[#1e3a5f] hover:bg-[#1e3a5f]/20 font-black text-[10px] tracking-tight uppercase border border-[#1e3a5f]/20 h-8 rounded-lg">
                                                {lease.computedStatus === "urgent" ? "Resolve" : "Review"}
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
