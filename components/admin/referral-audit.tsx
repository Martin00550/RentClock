"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Info } from "lucide-react";
import { useEffect, useState } from "react";
// We'll fetch this client side for simplicity or could be server component
// Let's make it client side to auto-refresh or simple fetch
import { supabase } from "@/lib/supabase"; // Use client client if public? 
// Wait, admin needs admin client. Better to use a server action to fetch this data.
// Let's add 'getReferralAudit' to admin-actions.

import { getReferralAudit } from "@/actions/admin-actions";
import { ReferralLog } from "@/lib/types";

export function AdminReferralAudit() {
    const [auditLog, setAuditLog] = useState<ReferralLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getReferralAudit();
                if (res.logs) {
                    setAuditLog(res.logs);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    return (
        <Card className="shadow-md h-full border-slate-200">
            <CardHeader className="bg-slate-50 pb-4">
                <CardTitle className="text-xl flex items-center gap-2 text-slate-700">
                    <Users className="h-5 w-5" /> Referral Audit
                </CardTitle>
                <CardDescription>Visualizing the viral loop.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-auto max-h-[500px]">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0">
                            <tr>
                                <th className="p-4">Referee (New User)</th>
                                <th className="p-4">Referred By</th>
                                <th className="p-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-slate-400">Loading audit log...</td>
                                </tr>
                            ) : auditLog.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-slate-400 bg-slate-50/50">
                                        <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        No referrals recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                auditLog.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-slate-700 truncate max-w-[150px]" title={log.id}>{log.id}</p>
                                            <p className="text-xs text-slate-400">{log.email || "No email"}</p>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                                    Referrer
                                                </div>
                                                <span className="font-mono text-xs text-slate-500 truncate max-w-[100px]">{log.referred_by}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-500 text-xs">
                                            {new Date(log.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
