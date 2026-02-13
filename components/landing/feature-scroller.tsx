"use client";

import { motion } from "framer-motion";

const features = [
    "AI Lease Extraction",
    "SMS & Email Alerts",
    "Calendar Sync",
    "Profit Protection Analytics",
    "PDF Notice Generator",
    "Rental Escalation Tracking",
    "Secure Document Vault",
    "Critical Date Safeguards",
];

export function FeatureScroller() {
    // Duplicate the features to create a seamless infinite loop
    const doubledFeatures = [...features, ...features];

    return (
        <div className="relative w-full bg-[#1e3a5f] py-6 overflow-hidden border-y border-[#d4a853]/20 shadow-2xl">
            {/* Gradient Mask for Fade Effect */}
            <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-[#1e3a5f] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-[#1e3a5f] to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex whitespace-nowrap gap-12 items-center"
                animate={{
                    x: ["0%", "-50%"],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {doubledFeatures.map((feature, idx) => (
                    <div
                        key={idx}
                        className="flex items-center gap-4 text-[#d4a853] font-black uppercase tracking-[0.25em] text-xs md:text-sm"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4a853] shadow-[0_0_8px_rgba(212,168,83,0.6)]" />
                        <span className="drop-shadow-[0_0_10px_rgba(212,168,83,0.3)]">{feature}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
