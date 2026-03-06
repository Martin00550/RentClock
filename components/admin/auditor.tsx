"use client";

import { useEffect, useState } from "react";
import { auditorCheck } from "@/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReceiptText, AlertTriangle, CheckCircle } from "lucide-react";

import { UserProfile } from "@/lib/types";

export function AdminAuditor() {
    const [users, setUsers] = useState<Partial<UserProfile>[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        auditorCheck().then(res => {
            if (res.users) setUsers(res.users);
            setLoading(false);
        });
    }, []);

    return (
        <Card className="shadow-md border-amber-100 h-full">
            <CardHeader className="bg-amber-50/50 pb-4">
                <CardTitle className="text-xl flex items-center gap-2 text-amber-900">
                    <ReceiptText className="h-5 w-5" /> The Auditor
                </CardTitle>
                <CardDescription>Users with <span className="font-bold">Pro Access</span> but no subscription ID (Manual Gift?).</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                {loading ? (
                    <div className="text-slate-400 text-sm">Auditing records...</div>
                ) : users.length === 0 ? (
                    <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 p-4 rounded-xl">
                        <CheckCircle className="h-5 w-5" /> No discrepancies found.
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-amber-600 font-bold text-sm bg-amber-50 p-3 rounded-lg border border-amber-100">
                            <AlertTriangle className="h-4 w-4" />
                            {users.length} Manual/Gifted Pro Accounts Found
                        </div>
                        <div className="max-h-[300px] overflow-auto space-y-2">
                            {users.map(u => (
                                <div key={u.id} className="text-xs p-2 bg-slate-50 border border-slate-100 rounded flex justify-between">
                                    <span className="font-mono text-slate-500">{u.email || u.id}</span>
                                    <span className="text-slate-400">{u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A"}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
