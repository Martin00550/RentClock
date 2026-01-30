"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function FaqSection() {
    return (
        <section className="py-24 px-6 bg-slate-50">
            <div className="max-w-[800px] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-slate-600">Common questions about automated lease tracking.</p>
                </div>

                <div className="space-y-4">
                    <FaqItem
                        question="Where is my data stored and who can see it?"
                        answer="All lease documents are held in a private, encrypted vault. RentClock uses industry-standard 256-bit encryption for every file. Your data is isolated at the database level, meaning it is never used for training AI models or shared with third parties. You maintain 100% ownership."
                    />
                    <FaqItem
                        question="Can it handle non-standard or hand-annotated leases?"
                        answer="Yes. Our extraction engine is designed for the messy reality of commercial real estate. It can process high-resolution scans, hand-annotated PDFs, and complex addendums to find the 'True Date' for your increases."
                    />
                    <FaqItem
                        question="What triggers a critical date alert?"
                        answer="RentClock monitors three core events: scheduled rent increases (CPI or fixed %), lease expirations, and notice periods for renewals. Alerts are delivered via Email and SMS, ensuring you have enough lead time to prepare legal notices."
                    />
                    <FaqItem
                        question="Is there a setup fee or long-term contract?"
                        answer="No. RentClock is built on a 'Utility First' model. You can track your first 3 leases for free forever, with no credit card required. Upgrade to Pro only when your portfolio grows. No implementation fees, no homework."
                    />
                </div>
            </div>
        </section>
    );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-sm hover:border-slate-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-6 flex items-center justify-between group"
            >
                <h4 className="font-bold text-slate-900 text-lg">{question}</h4>
                <div className="bg-slate-50 p-1 rounded-lg group-hover:bg-slate-100 transition-colors">
                    {isOpen ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
                </div>
            </button>
            {isOpen && (
                <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2">
                    <p className="text-slate-600 leading-relaxed font-medium">{answer}</p>
                </div>
            )}
        </div>
    );
}
