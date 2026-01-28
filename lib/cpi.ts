

export interface CPIDataPoint {
    year: string;
    period: string;
    periodName: string;
    value: string;
    footnotes: unknown[];
}

export interface CPIResponse {
    status: string;
    responseTime: number;
    message: string[];
    Results: {
        series: {
            seriesID: string;
            data: CPIDataPoint[];
        }[];
    };
}

// "CUUR0000SA0" is the standard "CPI-U: All items in U.S. city average, all urban consumers, not seasonally adjusted"
// This is the most common index used for commercial lease escalations.
const CPI_SERIES_ID = "CUUR0000SA0";

export async function fetchLatestCPI(): Promise<CPIDataPoint | null> {
    try {
        // BLS Public API v1 (No key required, limited quota but sufficient for caching)
        const response = await fetch("https://api.bls.gov/publicAPI/v1/timeseries/data/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                seriesid: [CPI_SERIES_ID],
                startyear: (new Date().getFullYear() - 1).toString(), // Get last 2 years to be safe
                endyear: new Date().getFullYear().toString(),
            }),
            next: { revalidate: 86400 } // Cache for 24 hours
        });

        if (!response.ok) {
            throw new Error(`BLS API Error: ${response.statusText}`);
        }

        const data: CPIResponse = await response.json();

        if (data.status !== "REQUEST_SUCCEEDED" || !data.Results.series[0].data.length) {
            console.error("BLS API returned invalid data:", data);
            return null;
        }

        // Data is usually returned sorted by year/period descending (newest first)
        return data.Results.series[0].data[0];
    } catch (error) {
        console.error("Failed to fetch CPI data:", error);
        return null;
    }
}

export function calculateCPIIncrease(
    baseIndex: number,
    currentIndex: number,
    currentRent: number
): { newRent: number; percentage: number; increaseAmount: number } {
    if (baseIndex === 0) return { newRent: currentRent, percentage: 0, increaseAmount: 0 };

    const percentage = ((currentIndex - baseIndex) / baseIndex) * 100;
    // Commercial leases typically don't allow negative CPI adjustments (deflation)
    const effectivePercentage = Math.max(0, percentage);

    const increaseAmount = currentRent * (effectivePercentage / 100);
    const newRent = currentRent + increaseAmount;

    return {
        newRent: Number(newRent.toFixed(2)),
        percentage: Number(effectivePercentage.toFixed(2)),
        increaseAmount: Number(increaseAmount.toFixed(2))
    };
}
