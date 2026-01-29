"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft,
    Mail,
    MessageSquare,
    Send,
    ShieldCheck,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-display relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 border-40 border-[#1e3a5f] rounded-full" />
                <div className="absolute top-1/2 -right-24 w-64 h-64 border-20 border-[#d4a853] rounded-full" />
            </div>

            <main className="max-w-[1200px] mx-auto px-6 py-20 relative z-10">
                <Link href="/">
                    <Button variant="ghost" className="mb-12 group text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Home
                    </Button>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    {/* Left Side: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div>
                            <div className="inline-flex items-center gap-2 bg-[#1e3a5f]/5 text-[#1e3a5f] border border-[#1e3a5f]/10 px-3 py-1.5 rounded-full mb-6 text-sm font-bold uppercase tracking-widest">
                                <MessageSquare className="h-4 w-4" />
                                Support & Inquiries
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                                We're here to protect your yield.
                            </h1>
                            <p className="text-xl text-slate-600 mt-6 leading-relaxed max-w-lg">
                                Whether you're a single-property owner or managing a strip mall, our team is ready to help you secure your revenue.
                            </p>
                        </div>

                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-4 group">
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 group-hover:border-[#1e3a5f]/20 transition-all">
                                    <Mail className="h-6 w-6 text-[#1e3a5f]" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Email us</p>
                                    <p className="text-lg font-bold text-slate-800">support@rentclock.online</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 py-2 px-4 bg-emerald-50 rounded-xl border border-emerald-100 w-fit">
                                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                                <span className="text-sm font-bold text-emerald-800 tracking-tight">Enterprise-grade support included for all users</span>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-slate-200">
                            <div className="flex items-center gap-4 text-slate-400 grayscale opacity-50">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Rapid Response</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Secure Data</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Private Support</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {isSubmitted ? (
                            <div className="bg-white p-12 rounded-[2.5rem] border-2 border-slate-100 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-500">
                                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="h-10 w-10" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Message Received</h2>
                                <p className="text-slate-500 text-lg leading-relaxed">
                                    Your request has been securely logged. Our support team will reach out to you within 24 business hours.
                                </p>
                                <Button
                                    onClick={() => setIsSubmitted(false)}
                                    className="bg-[#1e3a5f] hover:bg-[#2a4a73] text-white px-8 h-12 rounded-xl font-bold"
                                >
                                    Send Another Message
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-100 shadow-2xl space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold text-slate-600 uppercase tracking-widest">Your Name</Label>
                                        <Input
                                            required
                                            placeholder="Steve"
                                            className="h-14 rounded-2xl border-slate-200 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] bg-slate-50 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold text-slate-600 uppercase tracking-widest">Email Address</Label>
                                        <Input
                                            required
                                            type="email"
                                            placeholder="steve@realestate.com"
                                            className="h-14 rounded-2xl border-slate-200 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] bg-slate-50 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-sm font-bold text-slate-600 uppercase tracking-widest">How can we help?</Label>
                                    <Textarea
                                        required
                                        placeholder="I have a question about bulk lease uploads..."
                                        className="min-h-[160px] rounded-2xl border-slate-200 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] bg-slate-50 font-medium p-4 resize-none"
                                    />
                                </div>

                                <Button
                                    disabled={isSubmitting}
                                    className="w-full bg-[#1e3a5f] hover:bg-[#2a4a73] text-white h-16 rounded-2xl font-black text-xl transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                            Encrypting & Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-5 w-5" />
                                            Send Secure Message
                                        </>
                                    )}
                                </Button>
                                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    Fast 24-hour response time guaranteed
                                </p>
                            </form>
                        )}
                    </motion.div>
                </div>
            </main>

            <footer className="max-w-[1200px] mx-auto px-6 py-12 border-t border-slate-100 flex items-center justify-between opacity-50 relative z-10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2026 RentClock B2B SaaS</span>
                <div className="flex gap-8">
                    <Link href="/privacy" className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Privacy</Link>
                    <Link href="/terms" className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Terms</Link>
                </div>
            </footer>
        </div>
    );
}
