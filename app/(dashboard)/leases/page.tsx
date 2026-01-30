import { LeaseTable } from "@/components/leases/lease-table";
import { ExportLeasesButton } from "@/components/leases/export-leases-button";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Lease } from "@/lib/types";
import { redirect } from "next/navigation";


export default async function LeasesPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const { data: leases, error } = await supabaseAdmin
        .from("leases")
        .select("*")
        .eq("user_id", userId);

    if (error) {
        console.error("Error fetching leases:", error);
    }

    const typedLeases = (leases as Lease[]) || [];

    return (

        <div className="flex flex-col gap-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Lease Portfolio</h1>
                    <p className="text-slate-500 text-base md:text-lg font-medium">Manage all your active and upcoming lease agreements.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <ExportLeasesButton leases={typedLeases} />
                    <Link href="/ai-import" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto bg-[#1e3a5f] hover:bg-[#2a4a73] text-white px-6 h-12 rounded-xl font-bold shadow-lg shadow-slate-200 flex items-center justify-center gap-2 transition-all">
                            <Plus className="h-5 w-5" />
                            Add New Lease
                        </Button>
                    </Link>
                </div>
            </div>

            <LeaseTable leases={typedLeases} />
        </div>

    );
}
