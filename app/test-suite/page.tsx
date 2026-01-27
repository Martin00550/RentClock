"use client";

import { Button } from "@/components/ui/button";
import { seedTestLease } from "@/actions/seed-test-lease";
import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export default function TestSuitePage() {
    const [status, setStatus] = useState<"idle" | "creating" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleCreate = async () => {
        setStatus("creating");
        const res = await seedTestLease();
        if (res.success) {
            setStatus("success");
            setMessage(`Lease created! Expiry: 7 days from now.`);
        } else {
            setStatus("error");
            setMessage(res.error || "Failed to create lease");
        }
    };

    return (
        <div className="p-12 max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">QA Test Suite</h1>
                <p className="text-slate-500">Tools to verify scanning and alert logic.</p>
            </div>

            <div className="grid gap-6">
                <div className="border rounded-2xl p-6 bg-white space-y-4">
                    <h2 className="font-bold text-lg">1. Create Test Data</h2>
                    <p className="text-sm text-slate-600">
                        Creates a dummy lease expiring in exactly 7 days. This should trigger the "Urgent" alert logic immediately.
                    </p>
                    <Button onClick={handleCreate} disabled={status === "creating"} className="bg-[#1e3a5f]">
                        {status === "creating" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Test Lease
                    </Button>
                    {status === "success" && (
                        <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 p-3 rounded-xl">
                            <CheckCircle2 className="h-5 w-5" />
                            {message}
                        </div>
                    )}
                </div>

                <div className="border rounded-2xl p-6 bg-white space-y-4">
                    <h2 className="font-bold text-lg">2. Trigger Alerts</h2>
                    <p className="text-sm text-slate-600">
                        Manually runs the check that usually happens at 8 AM.
                    </p>
                    <Link href="/api/trigger-alerts" target="_blank">
                        <Button variant="outline" className="w-full border-[#1e3a5f] text-[#1e3a5f] font-bold">
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Run Alert Check Now
                        </Button>
                    </Link>
                    <p className="text-xs text-slate-400 italic">Opens JSON result in new tab. Check your Email/SMS!</p>
                </div>
            </div>
        </div>
    );
}
