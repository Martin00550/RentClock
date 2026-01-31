import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Metadata } from 'next';
import { Breadcrumbs } from "@/components/landing/breadcrumbs";

export const metadata: Metadata = {
    title: "RentClock Blog | Commercial Lease Management Tips",
    description: "Expert advice for commercial landlords on lease tracking, rent escalations, and portfolio management.",
};

export default function BlogIndexPage() {
    return (
        <div className="py-24 px-6 max-w-[1200px] mx-auto">
            <Breadcrumbs items={[
                { label: "Resources", href: "/blog" }
            ]} />
            <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 bg-[#1e3a5f]/5 text-[#1e3a5f] border border-[#1e3a5f]/10 px-4 py-1.5 rounded-full w-fit mb-6">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">RentClock Resources</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                    The Commercial Landlord&apos;s Playbook
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Strategies to protect your revenue, manage lease critical dates, and avoid costly administration errors.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* ARTICLE CARD 1 */}
                <Link href="/blog/ultimate-guide-commercial-lease-tracking" className="group">
                    <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 duration-300 h-full flex flex-col">
                        <div className="h-48 bg-slate-100 flex items-center justify-center p-8">
                            <div className="text-center">
                                <span className="text-lg font-black text-slate-300 uppercase tracking-widest">Guide</span>
                            </div>
                        </div>
                        <div className="p-8 flex flex-col grow">
                            <div className="text-xs font-bold text-[#d4a853] uppercase tracking-wider mb-3">Lease Management</div>
                            <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-[#1e3a5f] transition-colors">
                                The Ultimate Guide to Commercial Lease Tracking
                            </h2>
                            <p className="text-slate-600 mb-6 leading-relaxed grow">
                                Why spreadsheets fail, how to set up a failsafe system, and the 3 dates you simply cannot miss.
                            </p>
                            <div className="flex items-center gap-2 text-[#1e3a5f] font-bold text-sm">
                                Read Article <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </article>
                </Link>

                {/* PLACEHOLDER FOR FUTURE ARTICLES */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 border-dashed flex items-center justify-center p-12 text-center opacity-60">
                    <div>
                        <p className="text-slate-400 font-medium italic">More guides coming soon...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
