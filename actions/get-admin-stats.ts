"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { Lease, ScanLog } from "@/lib/types";

export interface MarketStat {
    state: string;
    count: number;
    value: number;
}

export interface ProductHealthStats {
    aiSuccessRate: number;
    aiTotalScans: number;
    stickyUserPercent: number; // Users with > 1 lease
    topMarkets: MarketStat[];
}

export async function getProductHealth(): Promise<ProductHealthStats> {
    // 1. AI Reliability (Scan Logs)
    const { data: logs } = await supabaseAdmin
        .from("scan_logs")
        .select("status");

    const typedLogs = (logs as unknown as Pick<ScanLog, 'status'>[]) || [];
    const totalScans = typedLogs.length;
    const successScans = typedLogs.filter(l => l.status === 'success').length;
    const aiSuccessRate = totalScans > 0 ? (successScans / totalScans) * 100 : 0;

    // 2. Sticky Factor (Leases per User)
    // We need all leases to group by user_id
    const { data: leases } = await supabaseAdmin
        .from("leases")
        .select("user_id, monthly_rent, property_address");

    const typedLeases = (leases as unknown as Pick<Lease, 'user_id' | 'monthly_rent' | 'property_address'>[]) || [];

    // Group by User
    const leasesByUser: Record<string, number> = {};
    const usersWithLeases = new Set<string>();

    typedLeases.forEach(l => {
        leasesByUser[l.user_id] = (leasesByUser[l.user_id] || 0) + 1;
        usersWithLeases.add(l.user_id);
    });

    const totalActiveUsers = usersWithLeases.size;
    const stickyUsers = Object.values(leasesByUser).filter(count => count > 1).length;

    const stickyUserPercent = totalActiveUsers > 0 ? (stickyUsers / totalActiveUsers) * 100 : 0;

    // 3. Market Insights (State Extraction)
    const marketMap: Record<string, { count: number; value: number }> = {};

    typedLeases.forEach(l => {
        if (!l.property_address) return;

        // Naive extraction: try to find State abbreviation (2 uppercase chars before zipcode)
        // or just look for the last comma segment
        // "123 Main St, Austin, TX 78701" -> "TX"
        // "456 Broad St, New York, NY" -> "NY"

        const parts = l.property_address.split(",");
        let state = "Unknown";

        if (parts.length >= 2) {
            const stateZip = parts[parts.length - 1].trim();
            const statePart = stateZip.split(" ")[0]; // "TX" from "TX 78701"

            if (statePart && statePart.length === 2) {
                state = statePart.toUpperCase();
            } else if (parts.length >= 3) {
                // Try second to last part if last part was just zip or country?
                // Fallback: use usage
                const potentialState = parts[parts.length - 2].trim().split(" ")[0];
                if (potentialState && potentialState.length === 2) state = potentialState.toUpperCase();
            }
        }

        if (!marketMap[state]) marketMap[state] = { count: 0, value: 0 };
        marketMap[state].count += 1;
        marketMap[state].value += (l.monthly_rent || 0) * 12; // Annualized
    });

    const topMarkets = Object.entries(marketMap)
        .map(([state, stats]) => ({ state, ...stats }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5

    return {
        aiSuccessRate,
        aiTotalScans: totalScans,
        stickyUserPercent,
        topMarkets
    };
}
