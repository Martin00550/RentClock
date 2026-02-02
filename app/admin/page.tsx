import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, DollarSign, Activity, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/lease-utils";
import { AdminUserSearch } from "@/components/admin/user-search";
import { AdminReferralAudit } from "@/components/admin/referral-audit";
import { AdminScanLogs } from "@/components/admin/scan-logs";
import { AdminAuditor } from "@/components/admin/auditor";
import { AdminMegaphone } from "@/components/admin/megaphone";
import { ProductHealth } from "@/components/admin/product-health";

// SECURITY: Allowlist
// SECURITY: Allowlist from Environment Variable
const ALLOWED_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim()).filter(Boolean);

// Fallback for development safety if env is missing (optional but good for dev)
if (process.env.NODE_ENV === "development" && ALLOWED_EMAILS.length === 0) {
    console.warn("⚠️ No ADMIN_EMAILS environment variable set. Admin access disabled.");
}

export default async function AdminPage() {
    const user = await currentUser();

    if (!user) return redirect("/sign-in");

    const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;

    if (!email || !ALLOWED_EMAILS.includes(email)) {
        console.warn(`Unauthorized admin access attempt: ${email}`);
        return redirect("/dashboard");
    }

    // --- PULSE METRICS ---
    // 1. Total Users
    const { count: userCount } = await supabaseAdmin
        .from("users")
        .select("*", { count: "exact", head: true });

    // 2. Pro Users
    const { count: proCount } = await supabaseAdmin
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("is_pro", true);

    // 3. fetch all leases to filter active ones
    const { data: allLeases } = await supabaseAdmin
        .from("leases")
        .select("monthly_rent, lease_end_date")
        .returns<{ monthly_rent: number; lease_end_date: string | null }[]>();

    const today = new Date().toISOString().split("T")[0];
    const typedLeases = allLeases || [];

    // Filter for active leases (no end date or end date in future)
    const activeLeases = typedLeases.filter(lease => !lease.lease_end_date || lease.lease_end_date >= today);
    const activeLeaseCount = activeLeases.length;

    // 4. Total Revenue Protected (Active Only)
    const totalRevenueProtected = activeLeases.reduce((sum, lease) => sum + (lease.monthly_rent || 0), 0) * 12; // Annualized

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <ShieldCheck className="h-8 w-8 text-indigo-600" />
                            Command Center
                        </h1>
                        <p className="text-slate-500 font-medium italic mt-1">
                            &ldquo;Be sure you know the condition of your flocks, give careful attention to your herds;&rdquo; — <span className="not-italic font-mono text-slate-700">{email}</span>
                        </p>
                    </div>
                    <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold text-sm animate-pulse flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        System Healthy
                    </div>
                </div>

                {/* PULSE METRICS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="border-l-4 border-l-indigo-500 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">{userCount}</div>
                            <p className="text-xs text-slate-500 mt-1">
                                <span className="text-indigo-600 font-bold">{proCount}</span> are Pro Members
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Active Leases</CardTitle>
                            <FileText className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">{activeLeaseCount}</div>
                            <p className="text-xs text-slate-500 mt-1">Active documents under guard</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-amber-500 shadow-sm md:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Total Revenue Protected</CardTitle>
                            <DollarSign className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">{formatCurrency(totalRevenueProtected)}</div>
                            <p className="text-xs text-slate-500 mt-1">Annualized value of active leases</p>
                        </CardContent>
                    </Card>
                </div>

                {/* POSTHOG LINK */}
                <div className="flex justify-end -mt-4">
                    <a
                        href="https://us.posthog.com/project/settings"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                    >
                        View Live Traffic on PostHog &rarr;
                    </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* USER MANAGEMENT */}
                    <div className="lg:col-span-2 space-y-8">
                        <AdminMegaphone />
                        <ProductHealth />
                        <AdminUserSearch />
                        <AdminScanLogs />
                    </div>

                    {/* SIDEBAR WIDGETS */}
                    <div className="space-y-8">
                        <AdminReferralAudit />
                        <AdminAuditor />
                    </div>
                </div>
            </div>
        </div>
    );
}
