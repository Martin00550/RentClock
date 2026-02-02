"use client";

import { useEffect } from "react";
import { claimReferral } from "@/actions/claim-referral";

export function ReferralClaimer() {
    useEffect(() => {
        // Attempt to claim referral on mount
        // This is low-priority, so we don't need to block UI
        const claim = async () => {
            try {
                await claimReferral();
            } catch (e) {
                // Silently fail
                console.error("Referral claim failed silently", e);
            }
        };
        claim();
    }, []);

    return null; // Invisible component
}
