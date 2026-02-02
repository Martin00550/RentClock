"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Shield, Gift, Loader2, CheckCircle, Smartphone, Calendar, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserProfile } from "@/lib/types"; // Make sure types are exported
import { Separator } from "@/components/ui/separator";

// We'll need server actions for the search and updates
import { searchUserByEmail, grantBonusLease, grantProStatus } from "@/actions/admin-actions";

export function AdminUserSearch() {
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<UserProfile | null>(null);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;

        setIsLoading(true);
        setResult(null);
        setError("");
        setSuccessMsg("");

        try {
            const res = await searchUserByEmail(query);
            if (res.error) {
                setError(res.error);
            } else {
                setResult(res.user);
            }
        } catch (err) {
            setError("Search failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGrantBonus = async () => {
        if (!result) return;
        if (!confirm(`Grant +1 Lease Slot to ${result.email}?`)) return;

        try {
            const res = await grantBonusLease(result.id);
            if (res.success) {
                setResult({ ...result, bonus_leases: (result.bonus_leases || 0) + 1 });
                setSuccessMsg("Granted +1 Lease Slot");
            } else {
                setError(res.error || "Failed");
            }
        } catch (err) {
            setError("Action failed");
        }
    };

    const handleGrantPro = async () => {
        if (!result) return;
        if (!confirm(`UPGRADE ${result.email} TO LIFETIME PRO? Make sure you mean it.`)) return;

        try {
            const res = await grantProStatus(result.id);
            if (res.success) {
                setResult({ ...result, is_pro: true });
                setSuccessMsg("Upgraded to Pro");
            } else {
                setError(res.error || "Failed");
            }
        } catch (err) {
            setError("Action failed");
        }
    };

    return (
        <Card className="shadow-md border-indigo-100 h-full">
            <CardHeader className="bg-indigo-50/50 pb-4">
                <CardTitle className="text-xl flex items-center gap-2 text-indigo-900">
                    <Search className="h-5 w-5" /> User Management
                </CardTitle>
                <CardDescription>Search explicitly by full email address.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        placeholder="steve@example.com"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="bg-white"
                    />
                    <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                    </Button>
                </form>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium">
                        {error}
                    </div>
                )}

                {successMsg && (
                    <div className="p-3 bg-emerald-50 text-emerald-600 text-sm rounded-lg font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle className="h-4 w-4" /> {successMsg}
                    </div>
                )}

                {result && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-slate-500 text-xs uppercase tracking-wider font-bold">User ID</p>
                                <p className="font-mono text-xs text-slate-700 truncate" title={result.id}>{result.id}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs uppercase tracking-wider font-bold">Created</p>
                                <p className="text-slate-700">{new Date(result.created_at).toLocaleDateString()}</p>
                            </div>

                            {/* STATUS BADGES */}
                            <div className="col-span-2 flex flex-wrap gap-2 mt-2">
                                <div className={`px-2 py-1 rounded-md text-xs font-bold border ${result.is_pro ? "bg-indigo-100 text-indigo-700 border-indigo-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                                    {result.is_pro ? "PRO MEMBER" : "FREE PLAN"}
                                </div>
                                <div className="px-2 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                    <Gift className="h-3 w-3" />
                                    {result.bonus_leases || 0} Bonus Slots
                                </div>
                                {result.phone && (
                                    <div className="px-2 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                                        <Smartphone className="h-3 w-3" /> SMS Active
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="pt-4 flex gap-2">
                            <Button
                                onClick={handleGrantBonus}
                                variant="outline"
                                className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                            >
                                <Gift className="h-4 w-4 mr-2" />
                                +1 Lease Slot
                            </Button>

                            {!result.is_pro && (
                                <Button
                                    onClick={handleGrantPro}
                                    variant="outline"
                                    className="flex-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800"
                                >
                                    <Shield className="h-4 w-4 mr-2" />
                                    Gift Pro
                                </Button>
                            )}
                        </div>

                        {/* REF INFO */}
                        {result.referred_by ? (
                            <p className="text-xs text-slate-400 mt-2">Referred by user: {result.referred_by}</p>
                        ) : (
                            <p className="text-xs text-slate-400 mt-2">No referrer recorded.</p>
                        )}
                        <p className="text-xs text-slate-400">Referral Code: <span className="font-mono">{result.referral_code || "None"}</span></p>

                    </div>
                )}
            </CardContent>
        </Card>
    );
}
