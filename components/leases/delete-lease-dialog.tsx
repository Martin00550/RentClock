"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteLeaseDialogProps {
    leaseId: string;
    tenantName: string;
}

export function DeleteLeaseDialog({ leaseId, tenantName }: DeleteLeaseDialogProps) {
    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/leases/${leaseId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                router.push("/leases");
            } else {
                const data = await res.json();
                alert("Error: " + (data.error || "Failed to delete lease"));
            }
        } catch {
            alert("Network error. Please try again.");
        } finally {
            setDeleting(false);
            setOpen(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-10 px-3 text-red-500 hover:text-red-600 hover:bg-red-50 font-bold text-sm rounded-xl"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Lease
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl border-slate-200">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-black text-slate-900">
                        Delete Lease?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-600 text-base">
                        This will permanently remove the lease for <strong className="text-slate-900">{tenantName}</strong> and all associated data including reminders, calendar events, and any uploaded documents.
                        <br /><br />
                        <span className="text-red-600 font-semibold">This action cannot be undone.</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3 mt-4">
                    <AlertDialogCancel className="rounded-xl font-bold h-12 px-6">
                        Keep Lease
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleting}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold h-12 px-6"
                    >
                        {deleting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Forever
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
