"use client";

import { useEffect, useState } from "react";
import { getScanLogs } from "@/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, CheckCircle, XCircle, Clock } from "lucide-react";
import { ScanLog } from "@/lib/types";

export function AdminScanLogs() {
    const [logs, setLogs] = useState<ScanLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getScanLogs().then(res => {
            if (res.logs) setLogs(res.logs);
            setLoading(false);
        });
    }, []);

    return (
        <Card className="shadow-md border-indigo-100 h-full">
            <CardHeader className="bg-slate-50 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2 text-indigo-900">
                            <BrainCircuit className="h-5 w-5" /> AI Brain Scan
                        </CardTitle>
                        <CardDescription>Live feed of document extraction logic.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-auto max-h-[500px]">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0">
                            <tr>
                                <th className="p-4">Status</th>
                                <th className="p-4">File Name</th>
                                <th className="p-4">Duration</th>
                                <th className="p-4">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={4} className="p-8 text-center text-slate-400">Scanning neural pathways...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan={4} className="p-8 text-center text-slate-400">No activity recorded.</td></tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/50">
                                        <td className="p-4">
                                            {log.status === "success" ? (
                                                <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs"><CheckCircle className="h-3 w-3" /> OK</span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-red-600 font-bold text-xs" title={log.error_message}><XCircle className="h-3 w-3" /> ERR</span>
                                            )}
                                        </td>
                                        <td className="p-4 font-mono text-xs text-slate-700 truncate max-w-[150px]" title={log.file_name}>{log.file_name}</td>
                                        <td className="p-4 text-xs text-slate-500">{log.duration_ms}ms</td>
                                        <td className="p-4 text-xs text-slate-400 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(log.created_at).toLocaleTimeString()}
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
