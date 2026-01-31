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
import { StepVisual1, StepVisual2, StepVisual3 } from "@/components/landing/step-visuals";

import { LandingHeader } from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";

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
            <LandingHeader />

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
                                A safety net your commercial portfolio is missing
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
                                Spreadsheets don&apos;t send reminders. RentClock is the simple <strong>commercial lease tracker</strong> that helps you stay ahead of rent increases and renewal options.
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
                                    Excel is great for math, but terrible for alerts. It relies on constant manual checking. RentClock doesn&apos;t.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                <section className="py-32 bg-slate-50 relative overflow-hidden" id="how-it-works">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[#1e3a5f]/5 rounded-full blur-3xl z-0 opacity-40 pointer-events-none" />

                    <motion.div
                        className="max-w-[1200px] mx-auto px-6 relative z-10"
                        {...revealProps}
                    >
                        <div className="text-center max-w-[700px] mx-auto mb-24">
                            <h2 className="text-[#d4a853] font-black uppercase tracking-[0.2em] text-sm mb-4">The Process</h2>
                            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Start tracking today.<br />Simple by design.</h3>
                            <p className="text-lg text-slate-600 font-medium">If you can use email, you can use RentClock. Built for growing portfolios.</p>
                        </div>

                        <div className="relative max-w-5xl mx-auto">
                            {/* Vertical Connection Line */}
                            <div className="absolute left-16 top-16 bottom-48 w-[2px] bg-slate-200 hidden md:block rounded-full overflow-hidden">
                                {/* Gold Progress Line */}
                                <motion.div
                                    className="w-full bg-[#d4a853] shadow-[0_0_15px_rgba(212,168,83,0.6)]"
                                    animate={{ height: ["0%", "0%", "50%", "50%", "100%", "100%", "0%"] }}
                                    transition={{
                                        duration: 9,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        times: [0, 0.27, 0.38, 0.66, 0.77, 0.98, 1]
                                    }}
                                />
                            </div>

                            <div className="space-y-16">
                                {/* Step 1 */}
                                <div className="relative flex flex-col md:flex-row items-center md:items-center gap-12 md:gap-16 group">
                                    <div className="shrink-0 flex items-center justify-center relative w-32">
                                        <StepVisual1 />
                                    </div>
                                    <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-100/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-4px_rgba(0,0,0,0.1)] transition-all grow group-hover:-translate-y-1 duration-300 relative overflow-hidden">
                                        <div className="absolute -top-10 -right-4 p-6 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity select-none pointer-events-none">
                                            <span className="text-9xl font-black text-[#1e3a5f] tracking-tighter">01</span>
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight relative z-10">Securely Upload Lease</h4>
                                        <p className="text-lg text-slate-600 leading-relaxed font-medium relative z-10">
                                            Simply drag and drop your PDF. RentClock&apos;s AI extracts key dates, rent steps, and expiration windows for you to review.
                                            <strong className="text-[#1e3a5f] ml-1">You check and approve every detail.</strong> Fast, private, and automated.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="relative flex flex-col md:flex-row items-center md:items-center gap-12 md:gap-16 group">
                                    <div className="shrink-0 flex items-center justify-center relative w-32">
                                        <StepVisual2 />
                                    </div>
                                    <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-100/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-4px_rgba(0,0,0,0.1)] transition-all grow group-hover:-translate-y-1 duration-300 relative overflow-hidden">
                                        <div className="absolute -top-10 -right-4 p-6 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity select-none pointer-events-none">
                                            <span className="text-9xl font-black text-[#1e3a5f] tracking-tighter">02</span>
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight relative z-10">Verify Key Dates</h4>
                                        <p className="text-lg text-slate-600 leading-relaxed font-medium relative z-10">
                                            Review the high-precision suggestions. Correct dates if needed and set your preferred lead times.
                                            <strong className="text-[#1e3a5f] ml-1">Nothing is active until you confirm.</strong> You stay in complete control of your data.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="relative flex flex-col md:flex-row items-center md:items-center gap-12 md:gap-16 group">
                                    <div className="shrink-0 flex items-center justify-center relative w-32">
                                        <StepVisual3 />
                                    </div>
                                    <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-100/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-4px_rgba(0,0,0,0.1)] transition-all grow group-hover:-translate-y-1 duration-300 relative overflow-hidden">
                                        <div className="absolute -top-10 -right-4 p-6 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity select-none pointer-events-none">
                                            <span className="text-9xl font-black text-[#1e3a5f] tracking-tighter">03</span>
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight relative z-10">Stay Informed</h4>
                                        <p className="text-lg text-slate-600 leading-relaxed font-medium relative z-10">
                                            Get <strong className="text-[#1e3a5f]">email, SMS, and calendar</strong> alerts 90, 60, and 30 days out. Your critical dates sync directly to Outlook or Google Calendar.
                                            <strong className="text-[#1e3a5f] ml-1">Whether you&apos;re at the office or on the golf course</strong>, we help prevent missed revenue opportunities.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                <section className="py-24 bg-white border-t border-slate-100">
                    <div className="max-w-[1000px] mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-[#d4a853] font-black uppercase tracking-[0.2em] text-sm mb-4">The Smart Choice</h2>
                            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Why RentClock wins</h3>
                            <p className="text-lg text-slate-600 font-medium">Stop paying for overpriced hours or relying on fragile spreadsheets.</p>
                        </div>

                        <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/5">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="py-6 px-6 md:px-10 text-xs font-black uppercase tracking-widest text-slate-500 w-1/4">Aspect</th>
                                        <th className="py-6 px-6 md:px-10 text-sm font-black uppercase tracking-widest text-[#1e3a5f] w-1/4 bg-[#1e3a5f]/5 border-x border-[#1e3a5f]/10">RentClock</th>
                                        <th className="py-6 px-6 md:px-10 text-xs font-black uppercase tracking-widest text-slate-500 w-1/4">Property Lawyer</th>
                                        <th className="py-6 px-6 md:px-10 text-xs font-black uppercase tracking-widest text-slate-500 w-1/4">Excel Sheet</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                                        <td className="py-6 px-6 md:px-10 font-bold text-slate-700">Annual Cost</td>
                                        <td className="py-6 px-6 md:px-10 font-black text-[#2d6a4f] bg-[#1e3a5f]/5 border-x border-[#1e3a5f]/10 text-lg">$468/yr</td>
                                        <td className="py-6 px-6 md:px-10 text-slate-600 font-medium">~$4,800/yr (Est.)</td>
                                        <td className="py-6 px-6 md:px-10 text-slate-600 font-medium">$0 (Financial)</td>
                                    </tr>
                                    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                                        <td className="py-6 px-6 md:px-10 font-bold text-slate-700">Setup Effort</td>
                                        <td className="py-6 px-6 md:px-10 font-black text-[#1e3a5f] bg-[#1e3a5f]/5 border-x border-[#1e3a5f]/10">Automated</td>
                                        <td className="py-6 px-6 md:px-10 text-slate-600 font-medium">Days / Weeks</td>
                                        <td className="py-6 px-6 md:px-10 text-slate-600 font-medium">Manual Entry</td>
                                    </tr>
                                    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                                        <td className="py-6 px-6 md:px-10 font-bold text-slate-700">Missed Date Risk</td>
                                        <td className="py-6 px-6 md:px-10 font-black text-[#1e3a5f] bg-[#1e3a5f]/5 border-x border-[#1e3a5f]/10">Automated Alerts</td>
                                        <td className="py-6 px-6 md:px-10 text-slate-600 font-medium">Low</td>
                                        <td className="py-6 px-6 md:px-10 text-rose-600 font-bold">High (Human Error)</td>
                                    </tr>
                                    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                                        <td className="py-6 px-6 md:px-10 font-bold text-slate-700">Revenue Focus</td>
                                        <td className="py-6 px-6 md:px-10 font-black text-[#1e3a5f] bg-[#1e3a5f]/5 border-x border-[#1e3a5f]/10">Profit Protection</td>
                                        <td className="py-6 px-6 md:px-10 text-slate-600 font-medium">Billing / Compliance</td>
                                        <td className="py-6 px-6 md:px-10 text-slate-600 font-medium">None</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
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
                                        <span>Auto-Generates PDF Notices</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-600">
                                        <CheckCircle2 className="h-5 w-5 text-[#2d6a4f] shrink-0" />
                                        <span>Automated Lease Entry</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-600">
                                        <CheckCircle2 className="h-5 w-5 text-[#2d6a4f] shrink-0" />
                                        <span>Lease & Rent Increase Alerts (Email)</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-400">
                                        <CheckCircle2 className="h-5 w-5 text-slate-400 shrink-0" />
                                        <span>Lease & Rent Increase Alerts (SMS) (Pro)</span>
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
                            Move beyond static spreadsheets.
                        </h2>
                        <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto">
                            Start tracking your first 3 leases today. Help stop revenue leakage.
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
            <LandingFooter />
        </div >
    );
}
