import { Lease } from "./types";
import { differenceInDays, parseISO } from "date-fns";

export const RENT_INCREASE_FLOOR = 3.5;
export const INDUSTRY_STANDARD = 3.0;

export function getLeaseStatus(lease: Partial<Lease>): "active" | "warning" | "urgent" {
    if (!lease.lease_end_date && !lease.rent_increase_date) return "active";

    const today = new Date();
    const dates = [
        lease.lease_end_date ? parseISO(lease.lease_end_date) : null,
        lease.rent_increase_date ? parseISO(lease.rent_increase_date) : null,
    ].filter(Boolean) as Date[];

    if (dates.length === 0) return "active";

    const minDays = Math.min(...dates.map(d => differenceInDays(d, today)));

    if (minDays <= 30) return "urgent";
    if (minDays <= 90) return "warning";
    return "active";
}

// Returns the IDEAL annual increase amount based on proper indexing
export function calculateTargetAnnualIncrease(lease: Lease, liveCpiRate: number = 0): number {
    const monthlyRent = lease.monthly_rent || 0;
    const floorRate = RENT_INCREASE_FLOOR / 100;
    // Use the greater of Floor or CPI
    const targetRate = Math.max(floorRate, liveCpiRate);

    return monthlyRent * targetRate * 12;
}

// Returns the ACTUAL/SCHEDULED annual increase amount
export function calculateActualAnnualIncrease(lease: Lease): number {
    const actualMonthlyIncrease = lease.rent_increase_amount || 0;
    return actualMonthlyIncrease * 12;
}

// Returns the DIFFERENCE (Leakage) - Money left on the table
export function calculateLeakage(lease: Lease, liveCpiRate: number = 0): number {
    const target = calculateTargetAnnualIncrease(lease, liveCpiRate);
    const actual = calculateActualAnnualIncrease(lease);

    // If actual is greater than target (e.g. 10% increase), there is NO leakage.
    // We do NOT return negative leakage (surplus).
    return Math.max(0, target - actual);
}

/**
 * @deprecated Use calculateTargetAnnualIncrease or calculateLeakage depending on intent.
 * Kept for backward compatibility during refactor, but updated to behave like "Potential Total New Revenue"
 */
export function calculateRevenueImpact(lease: Lease, liveCpiRate?: number): number {
    const target = calculateTargetAnnualIncrease(lease, liveCpiRate || 0);
    const actual = calculateActualAnnualIncrease(lease);
    return Math.max(target, actual);
}

// Returns the asset valuation impact based on a 6.5% Cap Rate benchmark
export function calculateAssetValueGap(annualImpact: number): number {
    return annualImpact / 0.065;
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(amount);
}

export function getNextRelevantEvent(lease: Lease): { date: Date; type: "Rent Increase" | "Lease Expiry" } | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize today

    const events = [
        { date: lease.rent_increase_date, type: "Rent Increase" as const },
        { date: lease.lease_end_date, type: "Lease Expiry" as const }
    ]
        .filter(e => e.date) // filter nulls
        .map(e => ({
            ...e,
            dateObj: parseISO(e.date!) // verify parseISO handles the string format
        }))
        .filter(e => differenceInDays(e.dateObj, today) >= -30) // keep past 30 days (overdue) + future
        .sort((a, b) => differenceInDays(a.dateObj, b.dateObj)); // sort by soonest

    if (events.length === 0) return null;

    return {
        date: events[0].dateObj,
        type: events[0].type
    };
}
export function calculateAtRiskAmount(leases: Lease[], liveCpiRate?: number): number {
    return leases.reduce((total, lease) => {
        // Only count leakage for leases that are actually "At Risk" (e.g. Expired or Upcoming)
        // OR simply show Total Potential Leakage across the portfolio?
        // "Uncollected Profit" usually implies the gap across the board.

        // Strict Mode: Only count leakage if the date is passed? 
        // User Request: "Truthful". Truthful means if I have a lease renewing in 6 months, 
        // I haven't lost that money YET. But it IS "At Risk" if I don't act.

        // Let's count ALL leakage as "Revenue Opportunity" / "At Risk"
        // This aligns with "Profit Protection" - protecting the FUTURE profit.

        return total + calculateLeakage(lease, liveCpiRate || 0);
    }, 0);
}
