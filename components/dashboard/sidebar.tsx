"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    FileText,
    Sparkles,
    Settings,
    PlusCircle,
    CreditCard,
    ChevronLeft,
    ChevronRight,
    LifeBuoy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import { useSidebar } from "./sidebar-context";
import { useTutorial } from "@/components/tutorial/tutorial-provider";

const NAV_ITEMS = [
    { name: "Command Center", href: "/dashboard", icon: BarChart3, color: "text-blue-500", id: "sidebar-home" },
    { name: "Lease Portfolio", href: "/leases", icon: FileText, color: "text-indigo-500", id: "sidebar-leases" },
    { name: "New Lease", href: "/ai-import", icon: PlusCircle, color: "text-[#2d6a4f]", id: "sidebar-new-lease" },
    { name: "Profit Protection", href: "/profit-protection", icon: Sparkles, color: "text-[#d4a853]", id: "sidebar-profit" },
    { name: "Billing", href: "/billing", icon: CreditCard, color: "text-rose-500", id: "sidebar-billing" },
    { name: "Settings", href: "/settings", icon: Settings, color: "text-slate-500", id: "sidebar-settings" },
    { name: "Support", href: "mailto:support@rentclock.online", icon: LifeBuoy, color: "text-emerald-500", id: "sidebar-support" },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user } = useUser();
    const { isCollapsed, toggleSidebar } = useSidebar();

    return (
        <div className={cn(
            "flex h-full flex-col bg-slate-900 transition-all duration-300 relative border-r border-slate-800/50",
            isCollapsed ? "w-20" : "w-64"
        )}>
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-20 bg-[#1e3a5f] text-white p-1 rounded-full border border-slate-700 shadow-xl hover:scale-110 transition-transform z-50"
            >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>

            <div className={cn("flex flex-col px-6 pt-6 transition-all duration-300", isCollapsed ? "px-4 items-center" : "")}>
                {isCollapsed ? (
                    <div className="h-10 w-10 rounded-xl overflow-hidden border border-slate-700 shadow-lg shadow-slate-900/50 hover:scale-110 transition-transform flex items-center justify-center bg-[#1e3a5f]">
                        <Image
                            src="/icon-192.png"
                            alt="RC"
                            width={40}
                            height={40}
                            className="h-full w-full object-cover scale-[1.7]"
                        />
                    </div>
                ) : (
                    <span className="text-2xl font-black text-white tracking-tighter">RentClock</span>
                )}
            </div>

            <nav className={cn("flex-1 space-y-1 px-4 mt-12 transition-all", isCollapsed ? "px-2" : "")}>
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            id={item.id}
                            title={isCollapsed ? item.name : ""}
                            className={cn(
                                "group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all relative",
                                isActive
                                    ? "bg-[#d4a853]/10 text-[#d4a853] border border-[#d4a853]/20"
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200",
                                isCollapsed ? "justify-center px-0 h-12 w-12 mx-auto" : ""
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 transition-colors",
                                !isCollapsed ? "mr-3" : "",
                                isActive ? "text-[#d4a853]" : "text-slate-500 group-hover:text-slate-300"
                            )} />
                            {!isCollapsed && <span>{item.name}</span>}

                            {/* Active Indicator Bar */}
                            {isActive && (
                                <div className={cn(
                                    "absolute bg-[#d4a853] rounded-full",
                                    isCollapsed ? "left-0 top-1/2 -translate-y-1/2 w-1 h-6" : "left-0 w-1 h-3/5"
                                )} />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className={cn("mt-auto p-4 border-t border-slate-800/50", isCollapsed ? "p-2" : "")}>

                {/* TUTORIAL RESTART BUTTON */}
                <RestartTourButton isCollapsed={isCollapsed} />

                <div className={cn(
                    "flex items-center gap-3 px-2 py-3 rounded-xl transition-all group",
                    !isCollapsed ? "hover:bg-slate-800/50" : "justify-center"
                )}>
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                userButtonAvatarBox: "h-10 w-10 rounded-xl"
                            }
                        }}
                    />
                    {!isCollapsed && (
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-white truncate">{user?.fullName || "Landlord User"}</span>
                            <span className="text-[10px] text-slate-400 truncate">{user?.primaryEmailAddress?.emailAddress}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function RestartTourButton({ isCollapsed }: { isCollapsed: boolean }) {
    const pathname = usePathname();
    const { startTour } = useTutorial();

    // Determine current tour
    let currentTourId = "";
    if (pathname === "/dashboard" || pathname === "/") currentTourId = "home";
    else if (pathname === "/leases") currentTourId = "leases";
    else if (pathname === "/profit-protection") currentTourId = "profit";

    if (!currentTourId) return null;

    return (
        <button
            onClick={() => startTour(currentTourId)}
            className={cn(
                "mb-4 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all border border-slate-700/50 bg-slate-800/20 hover:bg-slate-800 hover:border-slate-600 text-slate-400 hover:text-white group",
                isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto" : ""
            )}
            title="Restart Page Guide"
        >
            <Sparkles className={cn("h-4 w-4 text-emerald-500", isCollapsed ? "" : "mr-0")} />
            {!isCollapsed && <span className="text-xs font-bold">Restart Guide</span>}
        </button>
    );
}
