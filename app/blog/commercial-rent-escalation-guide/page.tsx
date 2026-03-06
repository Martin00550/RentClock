import { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import { SignUpTrigger } from "@/components/landing/signup-trigger";
import { CheckCircle2, AlertTriangle, TrendingUp, Calculator, FileText, Calendar } from "lucide-react";
import { Breadcrumbs } from "@/components/landing/breadcrumbs";

export const metadata: Metadata = {
    title: "Commercial Rent Escalation Clauses: The Complete Guide for Landlords | RentClock",
    description: "Master commercial rent escalation clauses including fixed step, CPI, and percentage increases. Learn how to structure leases that protect your revenue growth.",
    keywords: ["commercial rent escalation", "rent escalation clause", "CPI rent increase", "commercial lease rent step", "lease rent increase formula", "NNN lease escalation"],
};

export default function RentEscalationGuide() {
    return (
        <article className="bg-white">
            <header className="py-20 px-6 bg-slate-50 border-b border-slate-100 text-center">
                <div className="max-w-[800px] mx-auto">
                    <div className="flex justify-center mb-8">
                        <Breadcrumbs items={[
                            { label: "Resources", href: "/blog" },
                            { label: "Escalation Guide", href: "/blog/commercial-rent-escalation-guide" }
                        ]} />
                    </div>
                    <div className="text-sm font-bold text-[#d4a853] uppercase tracking-widest mb-4">Revenue Protection Guide</div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">
                        Commercial Rent Escalation Clauses
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        The complete landlord&apos;s guide to fixed steps, CPI adjustments, and percentage increases that protect your revenue.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-4 text-sm font-bold text-slate-400">
                        <span>Updated Feb 2026</span>
                        <span>•</span>
                        <span>10 Min Read</span>
                    </div>
                </div>
            </header>

            <div className="max-w-[800px] mx-auto px-6 py-16">
                <div className="prose prose-lg prose-slate max-w-none">
                    <p className="lead text-xl text-slate-600 font-medium mb-12">
                        A rent escalation clause isn&apos;t just boilerplate—it&apos;s one of the most powerful tools in your commercial lease. Get it right, and your revenue grows predictably. Get it wrong, and you could leave thousands on the table.
                    </p>

                    <h2 className="text-3xl font-black text-slate-900 mt-16 mb-6">Why Escalation Clauses Matter</h2>
                    <p>
                        Commercial leases span years, not months. Without escalation provisions, your $50/sqft rent in year one stays at $50/sqft in year five—even as property taxes, insurance, and maintenance costs climb. An escalation clause ensures your income keeps pace with your expenses.
                    </p>

                    <div className="my-8 p-6 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-xl">
                        <div className="flex items-start gap-4">
                            <TrendingUp className="h-8 w-8 text-[#1e3a5f] shrink-0" />
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg m-0">The Math Problem</h4>
                                <p className="m-0 mt-2 text-slate-700">A 5-year lease with no escalation at $60,000/year = $300,000 total. With a 3% annual escalation, that same lease generates <strong>$324,636</strong>—over $24,000 more.</p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mt-16 mb-6">Types of Rent Escalation</h2>
                    <p>There are three main escalation methods. Each has pros and cons.</p>

                    <div className="my-12 space-y-8">
                        <div className="p-8 border border-slate-200 rounded-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-emerald-100 p-3 rounded-lg"><FileText className="h-7 w-7 text-emerald-700" /></div>
                                <h3 className="text-2xl font-bold text-slate-900 m-0">Fixed Step Increases (Rent Steps)</h3>
                            </div>
                            <p className="text-slate-600 mb-6">The simplest method. Rent increases by a predetermined dollar amount or percentage at specific intervals—typically annually.</p>
                            
                            <div className="bg-slate-50 p-6 rounded-xl mb-6">
                                <h5 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-3">Example Lease Language</h5>
                                <p className="text-slate-700 italic m-0">&quot;Base rent shall increase by 3% on each anniversary of the commencement date.&quot;</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-2">Pros</h4>
                                    <ul className="text-sm space-y-2">
                                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Predictable revenue</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Easy to calculate</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Tenant knows future costs</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-2">Cons</h4>
                                    <ul className="text-sm space-y-2">
                                        <li className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" /> May lag behind inflation</li>
                                        <li className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" /> Negotiated upfront—can&apos;t adjust</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border border-slate-200 rounded-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-blue-100 p-3 rounded-lg"><TrendingUp className="h-7 w-7 text-blue-700" /></div>
                                <h3 className="text-2xl font-bold text-slate-900 m-0">CPI Adjustments</h3>
                            </div>
                            <p className="text-slate-600 mb-6">Rent adjusts based on the Consumer Price Index. When inflation rises, your rent follows.</p>
                            
                            <div className="bg-slate-50 p-6 rounded-xl mb-6">
                                <h5 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-3">Example Lease Language</h5>
                                <p className="text-slate-700 italic m-0">&quot;Base rent shall increase annually by the percentage change in the CPI-W for the prior 12-month period, capped at 5%.&quot;</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-2">Pros</h4>
                                    <ul className="text-sm space-y-2">
                                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Tracks with inflation</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Protects purchasing power</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-2">Cons</h4>
                                    <ul className="text-sm space-y-2">
                                        <li className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" /> Unpredictable for tenants</li>
                                        <li className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" /> Complex calculation</li>
                                        <li className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" /> May need caps/floors</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border border-slate-200 rounded-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-purple-100 p-3 rounded-lg"><Calculator className="h-7 w-7 text-purple-700" /></div>
                                <h3 className="text-2xl font-bold text-slate-900 m-0">Percentage Rent (Override)</h3>
                            </div>
                            <p className="text-slate-600 mb-6">Common in retail. Tenant pays base rent plus a percentage of gross sales above a break-point.</p>
                            
                            <div className="bg-slate-50 p-6 rounded-xl mb-6">
                                <h5 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-3">Example Lease Language</h5>
                                <p className="text-slate-700 italic m-0">&quot;In addition to base rent, tenant shall pay 7% of annual gross sales exceeding $1,000,000.&quot;</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-2">Pros</h4>
                                    <ul className="text-sm space-y-2">
                                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Participates in tenant success</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Upside in good years</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-2">Cons</h4>
                                    <ul className="text-sm space-y-2">
                                        <li className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" /> Requires sales reporting</li>
                                        <li className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" /> Harder to project income</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mt-16 mb-6">Critical Escalation Dates You Can&apos;t Miss</h2>
                    <p>Escalation clauses only work if you actually enforce them. Here&apos;s what landlords commonly miss:</p>

                    <ul className="space-y-4 my-8 list-none pl-0">
                        <li className="flex gap-4 p-6 bg-rose-50 rounded-xl border border-rose-100">
                            <AlertTriangle className="h-6 w-6 text-rose-600 shrink-0" />
                            <div>
                                <strong className="text-rose-900 block mb-1">CPI Notice Deadline</strong>
                                <span className="text-rose-800/80">Many leases require you to provide written notice of a CPI increase within 30-60 days. Miss it, and you may lose that year&apos;s increase.</span>
                            </div>
                        </li>
                        <li className="flex gap-4 p-6 bg-amber-50 rounded-xl border border-amber-100">
                            <Calendar className="h-6 w-6 text-amber-600 shrink-0" />
                            <div>
                                <strong className="text-amber-900 block mb-1">Escalation Effective Date</strong>
                                <span className="text-amber-800/80">CPI increases often take effect on the lease anniversary. Calendar reminders months in advance are essential.</span>
                            </div>
                        </li>
                    </ul>

                    <h2 className="text-3xl font-black text-slate-900 mt-16 mb-6">Best Practices for Landlords</h2>
                    <ol className="list-decimal pl-6 space-y-4 marker:text-[#1e3a5f] marker:font-bold">
                        <li><strong>Document every escalation date</strong> in dedicated lease tracking software with automated reminders.</li>
                        <li><strong>Include caps and floors</strong> in CPI clauses to prevent extreme swings (e.g., &quot;minimum 2%, maximum 5%&quot;).</li>
                        <li><strong>Calculate increases before they take effect</strong> so you can invoice correctly from day one.</li>
                        <li><strong>Review escalation language</strong> with an attorney—ambiguity here leads to disputes.</li>
                    </ol>

                    <div className="my-12 p-8 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-2xl">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Never Miss an Escalation Again</h3>
                        <p className="text-slate-700 mb-6">RentClock automatically tracks rent escalation dates and sends you alerts before each increase takes effect. Whether you use fixed steps or CPI adjustments, you can track your rent increases.</p>
                        <SignUpTrigger>
                            <Button className="bg-[#1e3a5f] hover:bg-[#2a4a73] text-white px-8 py-6 rounded-xl font-bold text-lg shadow-lg h-auto w-full md:w-auto">
                                Track Your Escalations Free
                            </Button>
                        </SignUpTrigger>
                    </div>

                    <hr className="my-16 border-slate-200" />

                    <div className="bg-slate-100 p-8 rounded-xl text-sm text-slate-500 leading-relaxed">
                        <h5 className="font-bold text-slate-700 uppercase tracking-widest mb-2 text-xs">Legal Disclaimer</h5>
                        <p>
                            This guide covers general aspects of commercial rent escalation. Every lease is different, and specific provisions vary by state and property type. 
                        </p>
                        <p className="mt-2">
                            RentClock provides this content for informational purposes only and does not constitute legal or financial advice. Always consult with a licensed real estate attorney to review your specific lease terms.
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
}
