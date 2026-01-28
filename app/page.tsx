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
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  XCircle,
  Upload,
  ShieldCheck,
  Lock,
  CreditCard
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
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#1e3a5f] p-1.5 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-black tracking-tighter text-slate-900 leading-none">RentClock</h2>
              <span className="text-[8px] font-bold text-[#d4a853] uppercase tracking-[0.2em] mt-1">Portfolio Safety Net</span>
            </div>
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
        <section className="relative py-20 px-6 bg-slate-50">
          <motion.div
            className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col gap-8">
              <div className="inline-flex items-center gap-2 bg-[#d4a853]/10 text-[#1e3a5f] border border-[#d4a853]/30 px-3 py-1.5 rounded-full w-fit">
                <CheckCircle2 className="h-4 w-4 text-[#d4a853]" />
                <span className="text-xs font-bold uppercase tracking-wider">3 Leases Free Forever • No Credit Card</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-900">
                Stop missing your commercial rent increases
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
                Move away from chaotic spreadsheets. Precise, automated alerts designed to help you catch every increase before you lose revenue. RentClock turns your PDFs into calendar events.
              </p>
              <div className="flex flex-col sm:row gap-4">
                <SignUpTrigger>
                  <Button className="bg-[#1e3a5f] hover:bg-[#2a4a73] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 w-fit h-auto">
                    <span>Start Free Tracking</span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </SignUpTrigger>
              </div>

              {/* HERO TRUST SIGNALS */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-slate-500 whitespace-nowrap">
                  <ShieldCheck className="h-4 w-4 text-[#2d6a4f]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Bank-Grade Security</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 whitespace-nowrap">
                  <CreditCard className="h-4 w-4 text-[#2d6a4f]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">No Credit Card</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 whitespace-nowrap">
                  <Lock className="h-4 w-4 text-[#2d6a4f]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">100% Private Data</span>
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
              <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">One forgotten date can cost you real money</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Commercial real estate is complex. Your tracking shouldn&apos;t be. Every month you delay a scheduled increase is revenue you are legally entitled to, but may be losing.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center mb-6">
                  <TrendingDown className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">The 3% Leak</h4>
                <p className="text-slate-600 leading-relaxed">
                  Small missed increases compound into real losses. Example: A 3% annual increase on $10,000/month rent is $300/month—or $3,600/year—you&apos;ll never recover.
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
                  Excel doesn&apos;t send emails. One corrupted file or a missed glance at your tracker can cause you to lose track of your revenue schedule.
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
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Setup in under 60 seconds. No training required.</h2>
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
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">1. Upload PDF</h4>
                    <p className="text-lg text-slate-600">Drag and drop your lease agreement. RentClock suggests dates based on your PDF, but **you always have the final say.** No date is saved without your explicit review.</p>
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
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">2. Choose Alarms</h4>
                    <p className="text-lg text-slate-600">Select your warning time. Get notified 30, 60, or 90 days before a critical date by email.</p>
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
                      <span className="text-[8px] font-bold text-slate-600 uppercase text-center">Sync Active</span>
                    </div>
                  </div>
                  <div className="pt-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm grow">
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">3. Connect Calendar</h4>
                    <p className="text-lg text-slate-600">Sync directly with Outlook, Google Calendar, or Apple Calendar. Move your critical dates out of messy spreadsheets—the alerts come to you.</p>
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
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Simple, Honest Pricing</h2>
              <p className="text-slate-600">Start free. Upgrade when you need more.</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 max-w-[800px] mx-auto mb-8 text-center">
              <strong>State-Specific Notice:</strong> Lease notification requirements vary by state (e.g., California has specific notice periods). Please consult with legal counsel before relying solely on RentClock for compliance.
            </div>
            <div className="max-w-[900px] mx-auto grid md:grid-cols-2 gap-8">
              {/* FREE TIER */}
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Free Forever</h3>
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
                    <span>Full AI Document Extraction</span>
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
                    <span>Google & Outlook Calendar Sync (Pro)</span>
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
              Start tracking your first 3 leases in the next 60 seconds. Stop the revenue leakage today.
            </p>
            <SignUpTrigger>
              <Button className="bg-[#d4a853] hover:bg-[#c49843] text-[#1e3a5f] px-12 py-6 rounded-2xl font-black text-xl transition-all shadow-2xl flex items-center justify-center gap-3 mx-auto h-auto group">
                <span>Start Free Tracking</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </SignUpTrigger>
            <p className="text-slate-400 text-xs mt-6 font-bold uppercase tracking-widest leading-relaxed">
              No Credit Card Required • Pro-grade security • Cancel anytime<br />
              A professional tool for professional landlords.
            </p>
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
              <li><Link className="hover:text-[#1e3a5f] transition-colors" href="mailto:support@rentclock.app">Contact RentClock</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 mt-16 pt-8 border-t border-slate-100 flex flex-col md:row items-center justify-between gap-6">
          <div className="text-slate-400 text-xs font-medium">
            © 2026 RentClock B2B SaaS. All rights reserved.
          </div>
          <div className="flex items-center gap-6 opacity-30">
            <div className="flex items-center gap-1.5">
              <Lock className="h-3 w-3" />
              <span className="text-[8px] font-bold uppercase tracking-widest">Encrypted Vault</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3" />
              <span className="text-[8px] font-bold uppercase tracking-widest">GDPR Compliant</span>
            </div>
          </div>
        </div>
      </footer >
    </div >
  );
}
