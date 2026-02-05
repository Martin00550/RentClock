"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search, ShieldCheck, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Lease } from "@/lib/types";
import { getLeaseStatus, formatCurrency } from "@/lib/lease-utils";
import { ActionMenu } from "./action-menu";
import { cn } from "@/lib/utils";

export function LeaseTable({ leases }: { leases: Lease[] }) {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter leases based on search query
    const filteredLeases = leases.filter((lease) => {
        const query = searchQuery.toLowerCase();
        return (
            lease.tenant_name?.toLowerCase().includes(query) ||
            lease.property_address?.toLowerCase().includes(query)
        );
    });

    if (leases.length === 0) {
        return (
            <div className="rounded-2xl md:rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white p-16 flex flex-col items-center justify-center text-center group">
                <div className="bg-[#1e3a5f]/5 p-6 rounded-[2rem] mb-6 group-hover:scale-110 transition-transform duration-500">
                    <ShieldCheck className="h-12 w-12 text-[#1e3a5f]" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your Portfolio is Unprotected</h3>
                <p className="text-slate-500 mt-3 mb-8 max-w-sm font-medium leading-relaxed">
                    <p className="text-slate-600 mb-6">You haven&apos;t added any leases yet.</p> Start your <span className="text-[#1e3a5f] font-bold">Safety Net</span> today by uploading your first document.
                    <br /><span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-2 block">First 3 Leases are Free Forever</span>
                </p>
                <Link href="/ai-import">
                    <Button className="bg-[#1e3a5f] hover:bg-[#2a4a73] text-white px-8 h-14 rounded-2xl font-black shadow-xl shadow-slate-900/10 flex items-center gap-3 transition-all hover:scale-105 active:scale-95">
                        <Plus className="h-5 w-5" />
                        Protect Your First Lease
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                    id="leases-search"
                    placeholder="Search by tenant or address..."
                    className="pl-10 h-10 w-full max-w-sm bg-white border-slate-200 focus-visible:ring-[#1e3a5f] rounded-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-semibold text-xs uppercase tracking-wider">Tenant & Address</TableHead>
                                <TableHead className="font-semibold text-xs uppercase tracking-wider">Monthly Rent</TableHead>
                                <TableHead className="font-semibold text-xs uppercase tracking-wider">Lease Expiry</TableHead>
                                <TableHead className="font-semibold text-xs uppercase tracking-wider">Next Critical Event</TableHead>
                                <TableHead className="font-semibold text-xs uppercase tracking-wider text-center">Status</TableHead>
                                <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLeases.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                        No results for &quot;{searchQuery}&quot;
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredLeases.map((lease) => {
                                    const status = getLeaseStatus(lease);
                                    const eventDate = lease.rent_increase_date || lease.lease_end_date;
                                    const eventType = lease.rent_increase_date ? "Rent Increase" : "Lease Expiry";

                                    return (
                                        <TableRow key={lease.id} className="hover:bg-slate-50/50 transition-colors">
                                            <TableCell className="py-4">
                                                <Link href={`/leases/${lease.id}`} className="hover:underline">
                                                    <div className="font-bold text-slate-900 leading-tight">{lease.tenant_name}</div>
                                                </Link>
                                                <div className="text-[10px] text-slate-400 font-medium">{lease.property_address}</div>
                                            </TableCell>
                                            <TableCell className="py-4 font-bold text-slate-700">
                                                {formatCurrency(lease.monthly_rent || 0)}
                                            </TableCell>
                                            <TableCell className="py-4 font-medium text-slate-600">
                                                {lease.lease_end_date ? format(new Date(lease.lease_end_date), "MM/dd/yyyy") : "N/A"}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-xs font-bold text-[#1e3a5f]">{eventType}</span>
                                                    <span className="text-slate-400 text-[10px]">
                                                        {eventDate ? format(new Date(eventDate), "MM/dd/yyyy") : "N/A"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 text-center">
                                                <Badge className={cn(
                                                    "font-bold text-[10px] px-2",
                                                    status === "urgent" ? "bg-red-100 text-red-700 border-red-200" :
                                                        status === "warning" ? "bg-amber-100 text-amber-700 border-amber-200" :
                                                            "bg-[#2d6a4f]/10 text-[#2d6a4f] border-[#2d6a4f]/20"
                                                )}>
                                                    {status.replace("_", " ").toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <ActionMenu lease={lease} />
                                                    <Link href={`/leases/${lease.id}`}>
                                                        <Button variant="ghost" size="sm" className="text-[#1e3a5f] hover:bg-[#1e3a5f]/10 font-bold text-[10px] tracking-tight uppercase px-3 h-8 border border-[#1e3a5f]/20">
                                                            Open
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-slate-100">
                    {filteredLeases.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 text-sm">
                            No results for &quot;{searchQuery}&quot;
                        </div>
                    ) : (
                        filteredLeases.map((lease) => {
                            const status = getLeaseStatus(lease);
                            const eventDate = lease.rent_increase_date || lease.lease_end_date;
                            const eventType = lease.rent_increase_date ? "Rent Increase" : "Lease Expiry";

                            return (
                                <div key={lease.id} className="p-4 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <Link href={`/leases/${lease.id}`}>
                                                <div className="font-bold text-slate-900 leading-tight text-base">{lease.tenant_name}</div>
                                            </Link>
                                            <div className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{lease.property_address}</div>
                                        </div>
                                        <Badge className={cn(
                                            "font-bold text-[10px] px-2",
                                            status === "urgent" ? "bg-red-100 text-red-700 border-red-200" :
                                                status === "warning" ? "bg-amber-100 text-amber-700 border-amber-200" :
                                                    "bg-[#2d6a4f]/10 text-[#2d6a4f] border-[#2d6a4f]/20"
                                        )}>
                                            {status.replace("_", " ").toUpperCase()}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Rent</span>
                                            <span className="text-sm font-bold text-slate-900">{formatCurrency(lease.monthly_rent || 0)}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Expiry</span>
                                            <span className="text-sm font-bold text-slate-700">
                                                {lease.lease_end_date ? format(new Date(lease.lease_end_date), "MMM d, yyyy") : "N/A"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Next Event</span>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="bg-[#1e3a5f]/5 text-[#1e3a5f] border-none text-[10px] font-bold px-0">
                                                    {eventType}: {eventDate ? format(new Date(eventDate), "MMM d") : "N/A"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ActionMenu lease={lease} />
                                            <Link href={`/leases/${lease.id}`}>
                                                <Button size="sm" className="bg-[#1e3a5f] text-white font-black text-[10px] uppercase tracking-wider h-10 rounded-xl px-4">
                                                    Open
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
