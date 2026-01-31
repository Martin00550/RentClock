"use client";

import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";

export function LandingFooter() {
    return (
        <footer className="bg-white border-t border-slate-200 py-16">
            <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-12">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-black tracking-tighter text-slate-900">RentClock</h2>
                    </div>
                    <p className="text-slate-500 max-w-sm">
                        RentClock helps you protect your investment income with modern technology and extreme simplicity.
                    </p>
                </div>
                <div>
                    <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-400">Product</h5>
                    <ul className="space-y-4 text-slate-500">
                        <li><Link className="hover:text-[#1e3a5f] transition-colors" href="/#pricing">Pricing</Link></li>
                        <li><Link className="hover:text-[#1e3a5f] transition-colors" href="/#how-it-works">How it works</Link></li>
                        <li><Link className="hover:text-[#1e3a5f] transition-colors" href="/lease-tracking-software">Lease Tracking Software</Link></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-400">Resources</h5>
                    <ul className="space-y-4 text-slate-500">
                        <li><Link className="hover:text-[#1e3a5f] transition-colors" href="/blog">Blog</Link></li>
                        <li><Link className="hover:text-[#1e3a5f] transition-colors" href="/blog/ultimate-guide-commercial-lease-tracking">Lease Tracking Guide</Link></li>
                        <li><Link className="hover:text-[#1e3a5f] transition-colors" href="/contact">Contact Support</Link></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-400">Legal</h5>
                    <ul className="space-y-4 text-slate-500">
                        <li><Link className="hover:text-[#1e3a5f] transition-colors" href="/privacy">Privacy Policy</Link></li>
                        <li><Link className="hover:text-[#1e3a5f] transition-colors" href="/terms">Terms of Service</Link></li>
                        <li><Link className="hover:text-[#1e3a5f] transition-colors" href="/refund-policy">Refund Policy</Link></li>
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
                                    <span className="text-[8px] font-bold uppercase tracking-widest">Secure Encryption (TLS/SSL)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <ShieldCheck className="h-2.5 w-2.5" />
                                    <span className="text-[8px] font-bold uppercase tracking-widest">Private Data Handling</span>
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
        </footer>
    );
}
