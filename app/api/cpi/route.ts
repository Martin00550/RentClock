import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';


import { fetchCPIStats } from "@/lib/cpi";

export async function GET() {
    try {
        const { latest, yoyChange, error } = await fetchCPIStats();

        if (error || !latest) {
            return NextResponse.json(
                { error: error || "Failed to fetch CPI data" },
                { status: 502 }
            );
        }

        return NextResponse.json({
            latest: latest,
            yoyChange: Number(yoyChange.toFixed(4)),
            meta: {
                source: "U.S. Bureau of Labor Statistics",
                series: "CPI-U (All Items)",
                updated: new Date().toISOString()
            }
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}

