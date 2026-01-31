"use client";

import { LandingHeader } from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-slate-50 min-h-screen flex flex-col font-display text-slate-900">
            <LandingHeader />
            <main className="grow">
                {children}
            </main>
            <LandingFooter />
        </div>
    );
}
