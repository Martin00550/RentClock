"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { SignUpTrigger } from "@/components/landing/signup-trigger";
import { SignInTrigger } from "@/components/landing/signin-trigger";

export function LandingHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-slate-50/80 backdrop-blur-md">
            <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/" className="text-2xl font-black tracking-tighter text-slate-900 leading-none">
                        RentClock
                    </Link>
                </div>
                <nav className="hidden md:flex items-center gap-10">
                    <Link className="text-sm font-semibold text-slate-600 hover:text-[#1e3a5f] transition-colors" href="/#problem">The Problem</Link>
                    <Link className="text-sm font-semibold text-slate-600 hover:text-[#1e3a5f] transition-colors" href="/#how-it-works">How it Works</Link>
                    <Link className="text-sm font-semibold text-slate-600 hover:text-[#1e3a5f] transition-colors" href="/#pricing">Pricing</Link>
                    <Link className="text-sm font-semibold text-slate-600 hover:text-[#1e3a5f] transition-colors" href="/blog">Resources</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <SignedIn>
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-sm font-bold text-slate-600">Dashboard</Button>
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    <SignedOut>
                        <SignInTrigger>
                            <Button variant="ghost" className="text-sm font-bold text-slate-600">Log in</Button>
                        </SignInTrigger>
                        <SignUpTrigger>
                            <Button className="bg-[#1e3a5f] hover:bg-[#2a4a73] text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-slate-900/10">
                                Start Tracking for Free
                            </Button>
                        </SignUpTrigger>
                    </SignedOut>
                </div>
            </div>
        </header>
    );
}
