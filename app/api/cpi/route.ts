import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const CPI_SERIES_ID = "CUUR0000SA0";

export async function GET() {
    try {
        const response = await fetch("https://api.bls.gov/publicAPI/v1/timeseries/data/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                seriesid: [CPI_SERIES_ID],
                startyear: (new Date().getFullYear() - 1).toString(),
                endyear: new Date().getFullYear().toString(),
            }),
            next: { revalidate: 86400 }
        });

        if (!response.ok) {
            throw new Error(`BLS API Error: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status !== "REQUEST_SUCCEEDED" || !data.Results?.series?.[0]?.data?.length) {
            return NextResponse.json(
                { error: "Failed to fetch CPI data from BLS" },
                { status: 502 }
            );
        }

        const allData = data.Results.series[0].data;
        const latest = allData[0]; // Most recent month

        // Find same month from previous year for year-over-year calculation
        const previousYearData = allData.find(
            (d: { period: string; year: string; value: string }) => d.period === latest.period && d.year === String(parseInt(latest.year) - 1)
        );

        // Calculate year-over-year percentage change
        let yoyChange = 0.034; // Default fallback to 3.4%
        if (previousYearData) {
            const currentValue = parseFloat(latest.value);
            const previousValue = parseFloat(previousYearData.value);
            yoyChange = (currentValue - previousValue) / previousValue;
        }

        return NextResponse.json({
            latest: latest,
            yoyChange: Number(yoyChange.toFixed(4)), // e.g., 0.034 for 3.4%
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

