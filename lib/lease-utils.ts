import { Lease } from "./types";
import { differenceInDays, parseISO } from "date-fns";

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

export function calculateRevenueImpact(lease: Lease): number {
    // Annualized rent increase amount
    if (!lease.rent_increase_amount) {
        // PREVIOUSLY: Fallback to 3% of monthly rent * 12
        // FIX: Return 0. Do not assume 3%. Users must enter this data or extracting it from lease.
        // This ensures the dashboard doesn't lie to the user.
        return 0;
    }
    return lease.rent_increase_amount * 12;
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
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
        .filter(e => differenceInDays(e.dateObj, today) >= 0) // keep only future/today
        .sort((a, b) => differenceInDays(a.dateObj, b.dateObj)); // sort by soonest

    if (events.length === 0) return null;

    return {
        date: events[0].dateObj,
        type: events[0].type
    };
}
