"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import posthog from "posthog-js";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if consent has already been given/declined
        const consent = localStorage.getItem("rentclock_cookie_consent");
        if (!consent) {
            // Show banner after a short delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleConsent = (choice: "accepted" | "declined") => {
        localStorage.setItem("rentclock_cookie_consent", choice);
        setIsVisible(false);

        if (choice === "accepted") {
            posthog.opt_in_capturing();
        } else {
            posthog.opt_out_capturing();
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-100"
                >
                    <div className="bg-[#1e3a5f] text-white p-6 rounded-[2rem] shadow-2xl shadow-indigo-900/40 border border-white/10 relative overflow-hidden group">
                        {/* Decorative Background Glows */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4a853]/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[#d4a853]/20 transition-colors"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 blur-2xl"></div>

                        <div className="relative z-10 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
                                    <Cookie className="h-5 w-5 text-[#d4a853]" />
                                </div>
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="text-white/40 hover:text-white transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                                    Cookie Policy
                                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                </h3>
                                <p className="text-sm text-white/80 font-medium leading-relaxed">
                                    We use cookies to protect your data and improve your experience. By clicking &quot;Accept&quot;, you agree to our use of essential and analytical cookies.
                                </p>
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={() => handleConsent("accepted")}
                                    className="flex-1 bg-[#d4a853] text-[#1e3a5f] font-black rounded-xl hover:bg-white hover:text-[#1e3a5f] transition-all shadow-lg shadow-black/20"
                                >
                                    Accept All
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleConsent("declined")}
                                    className="flex-1 text-white/60 hover:text-white hover:bg-white/10 font-bold rounded-xl"
                                >
                                    Decline
                                </Button>
                            </div>

                            <div className="text-[10px] text-white/40 text-center font-medium">
                                View our <Link href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</Link> for more details.
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
