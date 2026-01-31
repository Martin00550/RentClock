import Link from "next/link";
import { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import { SignUpTrigger } from "@/components/landing/signup-trigger";
import { CheckCircle2, AlertTriangle, XCircle, FileSpreadsheet, Calendar, Laptop } from "lucide-react";
import { Breadcrumbs } from "@/components/landing/breadcrumbs";

export const metadata: Metadata = {
    title: "The Ultimate Guide to Commercial Lease Tracking | RentClock",
    description: "Learn how to track commercial lease expirations and rent increases. Compare Excel templates vs. lease tracking software to stop revenue leakage.",
    keywords: ["lease tracker", "commercial lease tracking", "lease management software", "lease administration guide", "excel lease template"],
};

export default function UltimateGuidePost() {
    return (
        <article className="bg-white">
            {/* HERO HEADER */}
            <header className="py-20 px-6 bg-slate-50 border-b border-slate-100 text-center">
                <div className="max-w-[800px] mx-auto">
                    <div className="flex justify-center mb-8">
                        <Breadcrumbs items={[
                            { label: "Resources", href: "/blog" },
                            { label: "Ultimate Guide", href: "/blog/ultimate-guide-commercial-lease-tracking" }
                        ]} />
                    </div>
                    <div className="text-sm font-bold text-[#d4a853] uppercase tracking-widest mb-4">Lease Management Guide</div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">
                        The Ultimate Guide to Commercial Lease Tracking
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Why &quot;set it and forget it&quot; costs commercial landlords millions—and the systems you need to stop it.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-4 text-sm font-bold text-slate-400">
                        <span>Updated Jan 2026</span>
                        <span>•</span>
                        <span>12 Min Read</span>
                    </div>
                </div>
            </header>

            {/* CONTENT BODY */}
            <div className="max-w-[800px] mx-auto px-6 py-16">
                <div className="prose prose-lg prose-slate max-w-none">
                    <p className="lead text-xl text-slate-600 font-medium mb-12">
                        If you own a commercial property, your lease isn&apos;t just a document. It&apos;s a roadmap of future revenue. But if you bury that roadmap in a filing cabinet, you wil miss the turns.
                    </p>

                    <h2 className="text-3xl font-black text-slate-900 mt-16 mb-6">The &quot;Invisible Bleed&quot; in CRE</h2>
                    <p>
                        Most landlords focus on big vacancies. But the real killer of portfolio value is what we call the &quot;Invisible Bleed&quot;—small, missed dates that compound over time.
                    </p>
                    <ul className="space-y-4 my-8 list-none pl-0">
                        <li className="flex gap-4 p-6 bg-rose-50 rounded-xl border border-rose-100">
                            <AlertTriangle className="h-6 w-6 text-rose-600 shrink-0" />
                            <div>
                                <strong className="text-rose-900 block mb-1">Missed CPI Increases</strong>
                                <span className="text-rose-800/80">If your lease says rent goes up by CPI on Jan 1st, and you forget to invoice it until March, you likely can&apos;t retroactively collect. That revenue is gone forever.</span>
                            </div>
                        </li>
                        <li className="flex gap-4 p-6 bg-rose-50 rounded-xl border border-rose-100">
                            <XCircle className="h-6 w-6 text-rose-600 shrink-0" />
                            <div>
                                <strong className="text-rose-900 block mb-1">Accidental Renewals</strong>
                                <span className="text-rose-800/80">Failing to send a non-renewal notice in time can legally lock you into an auto-renewal at below-market rates for another 5 years.</span>
                            </div>
                        </li>
                    </ul>

                    <h2 className="text-3xl font-black text-slate-900 mt-16 mb-6">3 Ways to Track Your Leases</h2>
                    <p>There are three main methods landlords use. Let&apos;s be honest about the pros and cons of each.</p>

                    {/* METHOD 1: EXCEL */}
                    <div className="my-12 p-8 border border-slate-200 rounded-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-emerald-100 p-2 rounded-lg"><FileSpreadsheet className="h-6 w-6 text-emerald-700" /></div>
                            <h3 className="text-2xl font-bold text-slate-900 m-0">Method 1: The Spreadsheet</h3>
                        </div>
                        <p>The default choice. You create columns for &quot;Tenant&quot;, &quot;Expiration Date&quot;, and &quot;Current Rent&quot;.</p>
                        <div className="grid md:grid-cols-2 gap-8 mt-6">
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-2">Pros</h4>
                                <ul className="text-sm space-y-2">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Free to start</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> You know how to use it</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-2">Cons</h4>
                                <ul className="text-sm space-y-2">
                                    <li className="flex items-center gap-2"><XCircle className="h-4 w-4 text-rose-600" /> <strong>No Alerts:</strong> Excel won&apos;t email you.</li>
                                    <li className="flex items-center gap-2"><XCircle className="h-4 w-4 text-rose-600" /> <strong>Fragile:</strong> One bad sort ruins data.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* METHOD 2: CALENDAR */}
                    <div className="my-12 p-8 border border-slate-200 rounded-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-blue-100 p-2 rounded-lg"><Calendar className="h-6 w-6 text-blue-700" /></div>
                            <h3 className="text-2xl font-bold text-slate-900 m-0">Method 2: Outlook/Google Calendar</h3>
                        </div>
                        <p>Setting &quot;all day events&quot; for lease expirations.</p>
                        <div className="grid md:grid-cols-2 gap-8 mt-6">
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-2">Pros</h4>
                                <ul className="text-sm space-y-2">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Native on your phone</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Free</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-2">Cons</h4>
                                <ul className="text-sm space-y-2">
                                    <li className="flex items-center gap-2"><XCircle className="h-4 w-4 text-rose-600" /> <strong>Clutter:</strong> Mixes with personal life.</li>
                                    <li className="flex items-center gap-2"><XCircle className="h-4 w-4 text-rose-600" /> <strong>No Context:</strong> Doesn&apos;t link to the PDF.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* METHOD 3: SOFTWARE */}
                    <div className="my-12 p-8 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Laptop className="h-32 w-32 text-[#1e3a5f]" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-[#1e3a5f] p-2 rounded-lg"><Laptop className="h-6 w-6 text-white" /></div>
                                <h3 className="text-2xl font-bold text-slate-900 m-0">Method 3: Lease Tracking Software</h3>
                            </div>
                            <p className="text-slate-700 font-medium">Tools like <Link href="/" className="text-[#1e3a5f] underline decoration-2 underline-offset-2">RentClock</Link> combine the structure of Excel with the alerts of a Calendar.</p>
                            <div className="mt-6 space-y-3">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-1 shrink-0" />
                                    <span className="text-slate-700"><strong>Automated Emails & SMS:</strong> You get notified 90, 60, and 30 days before a date.</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-1 shrink-0" />
                                    <span className="text-slate-700"><strong>Document Vault:</strong> The original lease PDF is attached to the alert.</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-1 shrink-0" />
                                    <span className="text-slate-700"><strong>Revenue Safety Net:</strong> Specifically designed to catch Rent Steps and CPI increases.</span>
                                </div>
                            </div>
                            <div className="mt-8">
                                <SignUpTrigger>
                                    <Button className="bg-[#1e3a5f] hover:bg-[#2a4a73] text-white px-8 py-6 rounded-xl font-bold text-lg shadow-lg h-auto w-full md:w-auto">
                                        Try RentClock Free (First 3 Leases)
                                    </Button>
                                </SignUpTrigger>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mt-16 mb-6">The Essential Tracking Checklist</h2>
                    <p>Regardless of the method you choose, ensure you are tracking these 4 data points for every single tenant:</p>
                    <ol className="list-decimal pl-6 space-y-4 marker:text-[#1e3a5f] marker:font-bold">
                        <li><strong>Lease Expiration Date:</strong> The absolute end of the term.</li>
                        <li><strong>Renewal Option Notice Date:</strong> The window when a tenant <em>must</em> tell you if they are staying. This is often 3-6 months <em>before</em> expiration.</li>
                        <li><strong>Rent Escalation Date:</strong> The anniversary when rent increases (often fixed % or CPI).</li>
                        <li><strong>Insurance Expiration:</strong> When their liability policy expires (liability risk).</li>
                    </ol>

                    <hr className="my-16 border-slate-200" />

                    <div className="bg-slate-100 p-8 rounded-xl text-sm text-slate-500 leading-relaxed">
                        <h5 className="font-bold text-slate-700 uppercase tracking-widest mb-2 text-xs">Legal Disclaimer</h5>
                        <p>
                            This guide involves aspects of commercial lease law and financial management. RentClock provides this content for informational purposes only. It does <strong>not</strong> constitute legal or financial advice.
                        </p>
                        <p className="mt-2">
                            Lease laws vary significantly by state (e.g., California vs. Texas notice periods). Always verify specific dates and requirements against your original executed lease documents and consult with a licensed real estate attorney in your jurisdiction before issuing formal notices or declaring defaults.
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
}
