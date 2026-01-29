"use client";

import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { DeleteLeaseDialog } from "./delete-lease-dialog";
import { Lease } from "@/lib/types";

interface ActionMenuProps {
    lease: Lease;
}

export function ActionMenu({ lease }: ActionMenuProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100/50 rounded-full">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2 rounded-2xl border-slate-200" align="end">
                <DeleteLeaseDialog leaseId={lease.id} tenantName={lease.tenant_name} />
            </PopoverContent>
        </Popover>
    );
}
