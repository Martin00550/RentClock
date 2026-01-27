"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    FileText,
    Sparkles,
    Settings,
    PlusCircle,
    CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";

const NAV_ITEMS = [
    { name: "Command Center", href: "/dashboard", icon: BarChart3 },
    { name: "Lease Portfolio", href: "/leases", icon: FileText },
    { name: "New Lease", href: "/ai-import", icon: PlusCircle },
    { name: "Profit Protection", href: "/profit-protection", icon: Sparkles },
    { name: "Billing", href: "/billing", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user } = useUser();

    return (
        <div className="flex h-full w-64 flex-col bg-slate-900 text-slate-300">
            <div className="flex flex-col px-6 pt-6">
                <span className="text-2xl font-black text-white tracking-tighter">RentClock</span>
                <span className="text-[10px] text-[#d4a853] uppercase tracking-[0.2em] font-bold mt-1">Portfolio Safety Net</span>
            </div>

            <nav className="flex-1 space-y-1 px-4 mt-8">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all",
                                isActive
                                    ? "bg-[#d4a853]/10 text-[#d4a853] border border-[#d4a853]/20"
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                            )}
                        >
                            <item.icon className={cn(
                                "mr-3 h-5 w-5 transition-colors",
                                isActive ? "text-[#d4a853]" : "text-slate-500 group-hover:text-slate-300"
                            )} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto p-4 border-t border-slate-800/50">
                <div className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-slate-800/50 transition-colors group">
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                userButtonAvatarBox: "h-10 w-10 rounded-xl"
                            }
                        }}
                    />
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold text-white truncate">{user?.fullName || "Landlord User"}</span>
                        <span className="text-[10px] text-slate-400 truncate">{user?.primaryEmailAddress?.emailAddress}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
