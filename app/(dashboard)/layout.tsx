"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { OnboardingWizard } from "@/components/dashboard/onboarding-wizard";
import { SecurityBar } from "@/components/ui/security-bar";
import { SidebarProvider } from "@/components/dashboard/sidebar-context";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { BarChart3, FileText, Sparkles, Settings, PlusCircle, CreditCard } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
                {/* Desktop Sidebar */}
                <div className="hidden md:flex h-full">
                    <Sidebar />
                </div>

                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    {/* Mobile Header */}
                    <header className="md:hidden flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
                        <span className="text-xl font-black tracking-tighter">RentClock</span>
                        <div className="flex items-center gap-4">
                            <Link href="/settings">
                                <Settings className="h-5 w-5 text-slate-400" />
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
                        <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 md:py-10">
                            {children}
                        </div>
                        <div className="mt-auto">
                            <SecurityBar variant="subtle" />
                        </div>
                    </main>

                    {/* Mobile Bottom Navigation */}
                    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-between px-2 pt-2 pb-6 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                        <MobileNavItem href="/dashboard" icon={BarChart3} label="Home" />
                        <MobileNavItem href="/leases" icon={FileText} label="Leases" />

                        {/* Primary Action Button */}
                        <div className="-mt-10 relative">
                            <Link href="/ai-import">
                                <div className="bg-[#1e3a5f] p-4 rounded-full shadow-2xl shadow-[#1e3a5f]/40 text-white border-4 border-slate-50 active:scale-90 transition-transform">
                                    <PlusCircle className="h-7 w-7" />
                                </div>
                            </Link>
                        </div>

                        <MobileNavItem href="/profit-protection" icon={Sparkles} label="Profit" />
                        <MobileNavItem href="/billing" icon={CreditCard} label="Billing" />
                    </nav>
                </div>
                <OnboardingWizard />
            </div>
        </SidebarProvider>
    );
}

function MobileNavItem({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
    return (
        <Link href={href} className="flex flex-col items-center gap-1 group">
            <Icon className="h-5 w-5 text-slate-400 group-hover:text-[#1e3a5f] transition-colors" />
            <span className="text-[10px] font-bold text-slate-500 group-hover:text-[#1e3a5f]">{label}</span>
        </Link>
    );
}

