

import { Button } from "@/components/ui/button";
import { SignUpTrigger } from "@/components/landing/signup-trigger";
import { CheckCircle2, TrendingDown, Clock, FileText } from "lucide-react";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";
import { type Metadata } from "next";
import { Breadcrumbs } from "@/components/landing/breadcrumbs";

export const metadata: Metadata = {
    title: "Commercial Lease Tracking Software | RentClock",
    description: "The simplest lease tracking software for commercial landlords. Stop missing critical dates and CPI rent increases. Start for free.",
    keywords: ["lease tracking software", "commercial lease tracker", "lease management system", "lease reminder app"],
    openGraph: {
        title: "Commercial Lease Tracking Software | RentClock",
        description: "The simplest lease tracking software for commercial landlords. Track expirations and rent bumps.",
    }
};

export default function LeaseTrackingSoftwarePage() {
    return (
        <div className="bg-slate-50 text-slate-900 antialiased font-display">
            <LandingHeader />

            <main>
                {/* HERO */}
                <section className="relative pt-24 pb-20 px-6 bg-slate-50">
                    <div className="max-w-[1000px] mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <Breadcrumbs items={[
                                { label: "Product", href: "/#how-it-works" },
                                { label: "Lease Tracking Software", href: "/lease-tracking-software" }
                            ]} />
                        </div>
                        <div className="inline-flex items-center gap-2 bg-[#1e3a5f]/5 text-[#1e3a5f] border border-[#1e3a5f]/10 px-4 py-1.5 rounded-full w-fit mb-8">
                            <span className="text-xs font-bold uppercase tracking-wider">New for 2026</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-slate-900 mb-8">
                            Simple <span className="text-[#1e3a5f]">Lease Tracking Software</span> for Growing Portfolios
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10">
                            Stop using spreadsheets to manage millions in assets. RentClock is the specialized <strong>lease management software</strong> that sends you alerts before you miss a rent increase.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <SignUpTrigger>
                                <Button className="bg-[#1e3a5f] hover:bg-[#2a4a73] text-white px-10 py-6 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-slate-900/10 h-auto">
                                    Start Tracking Free
                                </Button>
                            </SignUpTrigger>
                            <span className="text-sm font-semibold text-slate-500">No credit card required • First 3 leases free</span>
                        </div>
                    </div>
                </section>

                {/* FEATURES GRID */}
                <section className="py-20 bg-white border-y border-slate-100">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900">Why landlords switch from Excel to RentClock</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Automated Date Tracking</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Never calculate a notice window manually again. Our <strong>lease tracker</strong> automatically calculates 90/60/30 day alerts for every renewal and expiration.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                    <TrendingDown className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Rent Escalation Alerts</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Missed CPI adjustments cost landlords thousands. RentClock is the only <strong>commercial lease software</strong> built specifically to protect your revenue steps.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Document Abstraction</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Upload a PDF and let our system find the dates for you. It&apos;s the fastest way to get your portfolio out of filing cabinets and into a secure digital system.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* COMPARISON */}
                <section className="py-24 bg-slate-50">
                    <div className="max-w-[800px] mx-auto px-6 text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Enterprise power, Small Business price</h2>
                        <p className="text-lg text-slate-600 mb-12">
                            Traditional <strong>lease administration software</strong> like Yardi or MRI is designed for corporations with dedicated staff. RentClock is designed for <em>you</em>.
                        </p>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50/50">
                                <div className="p-4 text-sm font-bold text-slate-500">Feature</div>
                                <div className="p-4 text-sm font-black text-[#1e3a5f]">RentClock</div>
                                <div className="p-4 text-sm font-bold text-slate-500">Spreadsheets</div>
                            </div>
                            <div className="grid grid-cols-3 border-b border-slate-100 items-center">
                                <div className="p-4 text-sm font-medium text-slate-600">Automated Alerts</div>
                                <div className="p-4 text-emerald-600"><CheckCircle2 className="h-5 w-5 mx-auto" /></div>
                                <div className="p-4 text-slate-400 text-sm">No</div>
                            </div>
                            <div className="grid grid-cols-3 border-b border-slate-100 items-center">
                                <div className="p-4 text-sm font-medium text-slate-600">Document Storage</div>
                                <div className="p-4 text-emerald-600"><CheckCircle2 className="h-5 w-5 mx-auto" /></div>
                                <div className="p-4 text-slate-400 text-sm">No</div>
                            </div>
                            <div className="grid grid-cols-3 items-center">
                                <div className="p-4 text-sm font-medium text-slate-600">Portfolio Cost</div>
                                <div className="p-4 text-sm font-bold text-[#1e3a5f]">Free (First 3)</div>
                                <div className="p-4 text-sm font-medium text-slate-600">$0 (but risky)</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FINAL CTA */}
                <section className="py-24 px-6 bg-[#1e3a5f] text-center">
                    <div className="max-w-[800px] mx-auto">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                            Start tracking your leases today
                        </h2>
                        <p className="text-lg text-slate-300 mb-10">
                            Sleep better knowing your <strong>lease tracking</strong> is automated.
                        </p>
                        <SignUpTrigger>
                            <Button className="bg-[#d4a853] hover:bg-[#c49843] text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-xl h-auto">
                                Create Free Account
                            </Button>
                        </SignUpTrigger>
                    </div>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
}
