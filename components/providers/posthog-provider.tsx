"use client";

import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, Suspense } from "react";

function PostHogPageView() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
            let url = window.origin + pathname;
            if (searchParams && searchParams.toString()) {
                url = url + `?${searchParams.toString()}`;
            }
            posthog.capture("$pageview", {
                $current_url: url,
            });
        }
    }, [pathname, searchParams]);

    return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
            const consent = localStorage.getItem("rentclock_cookie_consent");

            posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
                api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
                capture_pageview: false, // Managed manually above
                capture_pageleave: true, // Track when users leave
                persistence: "localStorage+cookie",
                autocapture: false, // Disable autocapture until consented
            });

            // If consent is missing or explicitly declined, we stop capturing
            if (!consent || consent === "declined") {
                posthog.opt_out_capturing();
            } else if (consent === "accepted") {
                posthog.opt_in_capturing();
            }
        }
    }, []);

    return (
        <PHProvider client={posthog}>
            <Suspense fallback={null}>
                <PostHogPageView />
            </Suspense>
            {children}
        </PHProvider>
    );
}
