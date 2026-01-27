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
import { MoreVertical, Search, ShieldCheck, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Lease } from "@/lib/types";
import { getLeaseStatus, formatCurrency } from "@/lib/lease-utils";

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
            <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white p-16 flex flex-col items-center justify-center text-center group">
                <div className="bg-[#1e3a5f]/5 p-6 rounded-[2rem] mb-6 group-hover:scale-110 transition-transform duration-500">
                    <ShieldCheck className="h-12 w-12 text-[#1e3a5f]" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your Portfolio is Unprotected</h3>
                <p className="text-slate-500 mt-3 mb-8 max-w-sm font-medium leading-relaxed">
                    You haven't added any leases yet. Start your <span className="text-[#1e3a5f] font-bold">Safety Net</span> today by uploading your first document.
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
                    placeholder="Search by tenant or address..."
                    className="pl-10 h-10 w-full max-w-sm bg-white border-slate-200 focus-visible:ring-[#1e3a5f] rounded-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
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
                                <TableCell colSpan={6} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
                                        <div className="bg-slate-50 p-3 rounded-full">
                                            <Search className="h-6 w-6 text-slate-300" />
                                        </div>
                                        <p className="text-sm font-medium">No results for "{searchQuery}"</p>
                                        <Button
                                            variant="link"
                                            className="text-[#1e3a5f] h-auto p-0"
                                            onClick={() => setSearchQuery("")}
                                        >
                                            Clear search
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLeases.map((lease) => {
                                const eventDate = lease.rent_increase_date || lease.lease_end_date;
                                const eventType = lease.rent_increase_date ? "Rent Increase" : "Lease Expiry";
                                const status = getLeaseStatus(lease);

                                return (
                                    <TableRow key={lease.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="py-4">
                                            <Link href={`/leases/${lease.id}`} className="hover:underline">
                                                <div className="font-bold text-slate-900">{lease.tenant_name}</div>
                                            </Link>
                                            <div className="text-xs text-slate-400">{lease.property_address}</div>
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
                                            <Badge className={
                                                status === "urgent" ? "bg-red-100 text-red-700 border-red-200" :
                                                    status === "warning" ? "bg-amber-100 text-amber-700 border-amber-200" :
                                                        "bg-[#2d6a4f]/10 text-[#2d6a4f] border-[#2d6a4f]/20"
                                            }>
                                                {status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100/50">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                                <Link href={`/leases/${lease.id}`}>
                                                    <Button variant="ghost" size="sm" className="text-[#1e3a5f] hover:bg-[#1e3a5f]/10 font-bold text-[10px] tracking-tight uppercase px-3 h-8 border border-[#1e3a5f]/20">
                                                        Manage
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
        </div>
    );
}
