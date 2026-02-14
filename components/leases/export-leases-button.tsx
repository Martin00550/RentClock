"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Lease } from "@/lib/types";
import { format } from "date-fns";

import { calculateLeakage } from "@/lib/lease-utils";

interface ExportLeasesButtonProps {
    leases: Lease[];
    cpiRate?: number;
}

export function ExportLeasesButton({ leases, cpiRate }: ExportLeasesButtonProps) {
    const handleExport = () => {
        if (!leases || leases.length === 0) return;

        // Define CSV Headers
        const headers = [
            "Tenant Name",
            "Property Address",
            "Monthly Rent",
            "Next Increase Amount",
            "Increase Date",
            "Lease Start",
            "Lease End",
            "Status",
            "Revenue Optimization Opportunity (Annual)"
        ];

        // Format Rows
        const rows = leases.map(lease => {
            const leakage = calculateLeakage(lease, cpiRate);
            return [
                `"${lease.tenant_name}"`, // Quote strings to handle commas
                `"${lease.property_address || ''}"`,
                `"${lease.monthly_rent || 0}"`,
                `"${lease.rent_increase_amount || 0}"`,
                `"${lease.rent_increase_date || ''}"`,
                `"${lease.lease_start_date || ''}"`,
                `"${lease.lease_end_date || ''}"`,
                `"${getParams(lease)}"`,
                `"${leakage.toFixed(2)}"`
            ];
        });

        // Combine
        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");

        // Create Blob and Download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `rentclock_portfolio_${format(new Date(), "yyyy-MM-dd")}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Quick status helper (simplified version of the one in utils)
    const getParams = (lease: Lease) => {
        // Just a placeholder/simplified status for the CSV
        if (!lease.lease_end_date) return "Active";
        return new Date(lease.lease_end_date) < new Date() ? "Expired" : "Active";
    }

    return (
        <Button
            id="leases-export-button"
            variant="outline"
            className="h-12 px-6 rounded-xl font-bold border-2 border-slate-200 text-slate-600 hover:border-[#1e3a5f] hover:text-[#1e3a5f] flex items-center gap-2"
            onClick={handleExport}
            disabled={leases.length === 0}
        >

            <Download className="h-4 w-4" />
            Export CSV
        </Button>
    );
}
