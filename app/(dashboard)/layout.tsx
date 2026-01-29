"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { OnboardingWizard } from "@/components/dashboard/onboarding-wizard";
import { SecurityBar } from "@/components/ui/security-bar";
import { SidebarProvider } from "@/components/dashboard/sidebar-context";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="flex h-screen bg-slate-50 text-slate-900">
                <Sidebar />
                <OnboardingWizard />
                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-7xl px-8 py-10">
                        {children}
                    </div>
                    <div className="mt-auto">
                        <SecurityBar variant="subtle" />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
