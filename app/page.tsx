"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ProPricingCard } from "@/components/landing/pro-pricing-card";
import { SignUpTrigger } from "@/components/landing/signup-trigger";
import { SignInTrigger } from "@/components/landing/signin-trigger";
import { FaqSection } from "@/components/landing/faq-section";
import {
    CheckCircle2,
    TrendingDown,
    AlertTriangle,
    XCircle,
    Upload,
    ShieldCheck,
    Lock
} from "lucide-react";
import { HeroCalculator } from "@/components/landing/hero-calculator";
import { motion } from "framer-motion";

const revealProps = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" as const }
};

export default function LandingPage() {

    return (
        <div className="bg-slate-50 text-slate-900 antialiased font-display">
            {/* HEADER */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-slate-50/80 backdrop-blur-md">
                <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-black tracking-tighter text-slate-900 leading-none">RentClock</h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-10">
                        <Link className="text-sm font-semibold text-slate-600 hover:text-[#1e3a5f] transition-colors" href="#problem">The Problem</Link>
                        <Link className="text-sm font-semibold text-slate-600 hover:text-[#1e3a5f] transition-colors" href="#how-it-works">How it Works</Link>
                        <Link className="text-sm font-semibold text-slate-600 hover:text-[#1e3a5f] transition-colors" href="#pricing">Pricing</Link>
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

            <main>
                {/* HERO */}
                <section className="relative pt-24 pb-20 px-6 bg-slate-50">
                    <motion.div
                        className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex flex-col gap-8">
                            <div className="inline-flex items-center gap-2 bg-[#d4a853]/10 text-[#1e3a5f] border border-[#d4a853]/30 px-3 py-1.5 rounded-full w-fit">
                                <CheckCircle2 className="h-4 w-4 text-[#d4a853]" />
                                <span className="text-xs font-bold uppercase tracking-wider">First 3 Leases Free • No Credit Card</span>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-900">
                                The safety net your commercial portfolio is missing
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
                                Spreadsheets don&apos;t send reminders. RentClock ensures you never miss a rent increase or renewal option again—without the enterprise complexity.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <SignUpTrigger>
                                    <Button className="bg-[#1e3a5f] hover:bg-[#2a4a73] text-white px-10 py-5 rounded-3xl font-bold text-xl transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 w-fit h-auto">
                                        <span>Start Tracking for Free</span>
                                    </Button>
                                </SignUpTrigger>

                            </div>

                            {/* HERO TRUST SIGNALS */}
                            <div className="flex flex-wrap items-center gap-6 pt-2">
                                <div className="flex items-center gap-2 text-slate-500 whitespace-nowrap">
                                    <ShieldCheck className="h-4 w-4 text-[#2d6a4f]" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">Secure Encryption</span>
                                </div>

                                <div className="flex items-center gap-2 text-slate-500 whitespace-nowrap">
                                    <Lock className="h-4 w-4 text-[#2d6a4f]" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">Private Data Handling</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative group">
                            <HeroCalculator />
                        </div>
                    </motion.div>
                </section>

                {/* PROBLEM */}
                <section className="py-24 bg-slate-50" id="problem">
                    <motion.div
                        className="max-w-[1200px] mx-auto px-6"
                        {...revealProps}
                    >
                        <div className="max-w-[800px] mb-16">
                            <h2 className="text-[#d4a853] font-bold uppercase tracking-widest text-sm mb-4">The Cost of Inaction</h2>
                            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Managing property is a professional duty</h3>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Don&apos;t let a busy schedule compromise your returns. Commercial leases are full of traps, and a single missed window can lock you into old rates for years.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center mb-6">
                                    <TrendingDown className="h-6 w-6" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-3">The 3% Leak</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    It&apos;s not just one month. It&apos;s a permanent reduction in your property&apos;s value. Miss a 3% bump on a $5,000 lease? That&apos;s $1,800/year you never get back.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center mb-6">
                                    <AlertTriangle className="h-6 w-6" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-3">The Holdover Trap</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    Don&apos;t let leases expire into month-to-month terms without your knowledge. Lose your leverage and risk sudden vacancies.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center mb-6">
                                    <XCircle className="h-6 w-6" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-3">The Spreadsheet Crash</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    Excel is great for math, but terrible for alerts. It relies on you being perfect every day. RentClock doesn&apos;t.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* HOW IT WORKS */}
                <section className="py-24 bg-slate-50" id="how-it-works">
                    <motion.div
                        className="max-w-[1200px] mx-auto px-6"
                        {...revealProps}
                    >
                        <div className="text-center max-w-[700px] mx-auto mb-20">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Start tracking Today. No training required.</h2>
                            <p className="text-lg text-slate-600">If you can use email, you can use RentClock. Built for growing portfolios.</p>
                        </div>
                        <div className="relative max-w-4xl mx-auto">
                            <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block"></div>
                            <div className="space-y-16">
                                <div className="relative flex items-start gap-8 md:gap-16">
                                    {/* Step 1: Upload UI Snippet */}
                                    <div className="shrink-0 w-24 h-24 bg-white border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center gap-1 z-10 shadow-sm overflow-hidden group-hover:border-[#1e3a5f] transition-colors">
                                        <div className="bg-slate-50 p-2 rounded-lg">
                                            <Upload className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Lease.pdf</span>
                                    </div>
                                    <div className="pt-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm grow">
                                        <h4 className="text-xl font-bold text-slate-900 mb-2">1. Securely Upload Lease</h4>
                                        <p className="text-lg text-slate-600">Simply upload your PDF. RentClock highlights key dates for you to review. <strong>You always have the final say.</strong> Fast, private processing.</p>
                                    </div>
                                </div>
                                <div className="relative flex items-start gap-8 md:gap-16">
                                    {/* Step 2: Alarms UI Snippet */}
                                    <div className="shrink-0 w-24 h-24 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center z-10 shadow-sm gap-2">
                                        <div className="w-12 h-6 bg-[#2d6a4f] rounded-full relative p-1 transition-all">
                                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-500 uppercase text-center leading-tight">60 Days<br />Alert</span>
                                    </div>
                                    <div className="pt-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm grow">
                                        <h4 className="text-xl font-bold text-slate-900 mb-2">2. Verify Key Dates</h4>
                                        <p className="text-lg text-slate-600">Review the automated suggestions. Nothing is active until you say so. You stay in control.</p>
                                    </div>
                                </div>
                                <div className="relative flex items-start gap-8 md:gap-16">
                                    {/* Step 3: Calendar UI Snippet */}
                                    <div className="shrink-0 w-24 h-24 bg-white border border-slate-200 rounded-2xl flex flex-col z-10 shadow-sm overflow-hidden">
                                        <div className="bg-[#1e3a5f] h-4 w-full" />
                                        <div className="p-2 flex flex-col items-center justify-center grow gap-1">
                                            <div className="bg-green-100 p-1 rounded-full">
                                                <CheckCircle2 className="h-4 w-4 text-[#2d6a4f]" />
                                            </div>
                                            <span className="text-[8px] font-bold text-slate-600 uppercase text-center">Add to Calendar</span>
                                        </div>
                                    </div>
                                    <div className="pt-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm grow">
                                        <h4 className="text-xl font-bold text-slate-900 mb-2">3. Sleep Soundly</h4>
                                        <p className="text-lg text-slate-600">Get alerts 90, 60, and 30 days out. Add directly to Outlook or Google Calendar. Whether you&apos;re at the office or on the golf course, you&apos;ll know what&apos;s coming.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* PRICING */}
                <section className="py-24 bg-slate-50" id="pricing">
                    <motion.div
                        className="max-w-[1200px] mx-auto px-6"
                        {...revealProps}
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Fair pricing for peace of mind</h2>
                            <p className="text-slate-600">Start free. Upgrade when you need more.</p>
                        </div>
                        <div className="max-w-[900px] mx-auto grid md:grid-cols-2 gap-8">
                            {/* FREE TIER */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Free</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-extrabold text-slate-900">$0</span>
                                        <span className="text-slate-500">/month</span>
                                    </div>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 text-slate-600">
                                        <CheckCircle2 className="h-5 w-5 text-[#2d6a4f] shrink-0" />
                                        <span><strong>3 Active Leases</strong></span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-600">
                                        <CheckCircle2 className="h-5 w-5 text-[#2d6a4f] shrink-0" />
                                        <span>Profit Protection Analytics</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-600">
                                        <CheckCircle2 className="h-5 w-5 text-[#2d6a4f] shrink-0" />
                                        <span>Legal Notice Generation</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-600">
                                        <CheckCircle2 className="h-5 w-5 text-[#2d6a4f] shrink-0" />
                                        <span>Automated Lease Review</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-600">
                                        <CheckCircle2 className="h-5 w-5 text-[#2d6a4f] shrink-0" />
                                        <span>Email Alerts (7, 30, 60, 90 Days)</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-400">
                                        <CheckCircle2 className="h-5 w-5 text-slate-400 shrink-0" />
                                        <span>SMS Alerts (7, 30, 60, 90 Days) (Pro)</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-400">
                                        <CheckCircle2 className="h-5 w-5 text-slate-400 shrink-0" />
                                        <span>Google & Outlook Calendar Integration (Pro)</span>
                                    </li>
                                </ul>
                                <SignUpTrigger>
                                    <Button className="w-full bg-[#1e3a5f] hover:bg-[#2a4a73] text-white py-5 h-auto rounded-xl font-black text-lg transition-all shadow-lg">
                                        Get Started Free
                                    </Button>
                                </SignUpTrigger>
                            </div>

                            {/* PRO TIER */}
                            <ProPricingCard />
                        </div>

                        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 text-sm text-amber-900/60 max-w-[800px] mx-auto mt-12 text-center leading-relaxed">
                            <span className="font-bold text-amber-900/80">State-Specific Notice:</span> Lease notification requirements vary by state (e.g., California has specific notice periods). Please consult with legal counsel before relying solely on RentClock for compliance.
                        </div>
                    </motion.div>
                </section>

                {/* FINAL CTA BAND */}
                <section className="py-20 bg-[#1e3a5f] relative overflow-hidden">
                    {/* Subtle Abstract Background Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute -top-24 -left-24 w-96 h-96 border-40 border-white rounded-full" />
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 border-40 border-white rounded-full" />
                    </div>

                    <div className="max-w-[800px] mx-auto text-center px-6 relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                            You have nothing to lose but your spreadsheets.
                        </h2>
                        <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto">
                            Start tracking your first 3 leases today. Stop the revenue leakage now.
                        </p>
                        <div className="flex flex-col items-center gap-8">
                            <SignUpTrigger>
                                <Button className="bg-[#d4a853] hover:bg-[#c49843] text-[#ffffff] px-14 py-7 rounded-3xl font-black text-2xl transition-all shadow-2xl flex items-center justify-center gap-3 mx-auto h-auto group">
                                    <span>Set My Safety Net For Free</span>
                                </Button>
                            </SignUpTrigger>
                            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                                <div className="flex items-center gap-3 text-slate-300 font-bold text-sm">
                                    <div className="bg-emerald-500 rounded-full p-0.5 shadow-lg shadow-emerald-500/20">
                                        <CheckCircle2 className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="uppercase tracking-widest">No credit card required</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300 font-bold text-sm">
                                    <div className="bg-emerald-500 rounded-full p-0.5 shadow-lg shadow-emerald-500/20">
                                        <CheckCircle2 className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="uppercase tracking-widest">Start tracking today</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <FaqSection />
            </main >

            {/* FOOTER */}
            < footer className="bg-white border-t border-slate-200 py-16" >
                <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="text-2xl font-black tracking-tighter text-slate-900">RentClock</h2>
                        </div>
                        <p className="text-slate-500 max-w-sm">
                            RentClock helps you protect your investment income with modern technology and extreme simplicity.
                        </p>
                    </div>
                    <div>
                        <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-400">Platform</h5>
                        <ul className="space-y-4 text-slate-500">
                            <li><Link className="hover:text-[#1e3a5f] transition-colors" href="/#pricing">Pricing</Link></li>
                            <li><Link className="hover:text-[#1e3a5f] transition-colors" href="#">Security</Link></li>
                            <li><Link className="hover:text-[#1e3a5f] transition-colors" href="/#how-it-works">How it works</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-400">Legal</h5>
                        <ul className="space-y-4 text-slate-500">
                            <li><Link className="hover:text-[#1e3a5f] transition-colors" href="/privacy">Privacy Policy</Link></li>
                            <li><Link className="hover:text-[#1e3a5f] transition-colors" href="/terms">Terms of Service</Link></li>
                            <li><Link className="hover:text-[#1e3a5f] transition-colors" href="/refund-policy">Refund Policy</Link></li>
                            <li><Link className="hover:text-[#1e3a5f] transition-colors" href="/contact">Contact RentClock</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-[1200px] mx-auto px-6 mt-16 pt-12 border-t border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1e3a5f]">AI Disclosure & Affiliation</h6>
                                <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl font-medium">
                                    RentClock is an independent service built on top of advanced AI models to simplify lease management and critical date tracking. The platform offers a user-friendly interface to enhance usability and provide specialized portfolio protection features. RentClock is an independent product and is not affiliated with, endorsed by, or sponsored by Google, OpenAI, or any other model providers.
                                </p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    © 2026 MARTIN VASKO • TRNAVA, SLOVAKIA • IČO: 56440553
                                </div>
                                <div className="flex items-center gap-4 opacity-40 grayscale">
                                    <div className="flex items-center gap-1">
                                        <Lock className="h-2.5 w-2.5" />
                                        <span className="text-[8px] font-bold uppercase tracking-widest">Bank-Grade Encryption</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <ShieldCheck className="h-2.5 w-2.5" />
                                        <span className="text-[8px] font-bold uppercase tracking-widest">Secure Data Custody</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-start md:justify-end">
                            <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-1 transition-all hover:border-slate-300">
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Need help?</span>
                                <a href="mailto:support@rentclock.online" className="text-sm font-black text-[#1e3a5f] flex items-center gap-2 group">
                                    support@rentclock.online
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:animate-pulse"></span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer >
        </div >
    );
}
