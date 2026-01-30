"use client";

import { motion } from "framer-motion";
import { Upload, CheckCircle2, Bell, Calendar, MousePointer2, ShieldCheck, MessageSquare, Mail, Phone } from "lucide-react";

export const StepVisual1 = () => (
    <div className="relative group">
        <motion.div
            className="w-32 h-32 bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(30,58,95,0.12)] border border-slate-100 flex flex-col items-center justify-center gap-2 overflow-hidden relative"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div className="absolute inset-0 bg-linear-to-b from-[#1e3a5f]/2 to-transparent" />

            {/* Scanning Eye/Line */}
            <motion.div
                className="absolute left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-[#d4a853] to-transparent z-20 shadow-[0_0_15px_1px_rgba(212,168,83,0.4)]"
                animate={{ top: ["10%", "90%"] }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 7, // 9s active loop
                    ease: "easeInOut"
                }}
            />

            {/* Icon Container with Success Pop */}
            <div className="relative">
                <div className="bg-slate-50 p-3 rounded-2xl relative z-10 border border-slate-100 shadow-sm text-[#1e3a5f]">
                    <Upload className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <motion.div
                    className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white shadow-sm z-20"
                    animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
                    transition={{ duration: 0.5, times: [0, 0.8, 1], repeat: Infinity, repeatDelay: 8.5, delay: 2 }}
                >
                    <CheckCircle2 className="h-2 w-2 text-white" strokeWidth={3} />
                </motion.div>
            </div>

            <div className="flex flex-col items-center relative z-10 gap-1.5 mt-1">
                <motion.div
                    className="bg-white px-3 py-1 rounded-full text-[9px] font-black text-[#1e3a5f] uppercase tracking-widest border border-slate-100 shadow-sm z-30"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    LEASE.PDF
                </motion.div>
                <div className="flex gap-1">
                    <motion.div
                        className="w-1 h-1 bg-[#d4a853] rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                    <motion.div
                        className="w-1 h-1 bg-[#d4a853] rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                        className="w-1 h-1 bg-[#d4a853] rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                </div>
            </div>
        </motion.div>
        <div className="absolute -top-3 -right-3 w-16 h-16 bg-[#d4a853]/10 rounded-full blur-2xl pointer-events-none" />
    </div>
);

export const StepVisual2 = () => (
    <div className="relative group">
        <motion.div
            className="w-32 h-32 bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(30,58,95,0.12)] border border-slate-100 p-5 flex flex-col justify-between overflow-hidden relative"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div className="absolute inset-0 bg-linear-to-tr from-[#2d6a4f]/3 to-transparent" />

            {/* Header Content */}
            <div className="flex justify-between items-start relative z-10 w-full mb-1">
                <div className="bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm">
                    <Bell className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <motion.div
                    className="bg-[#2d6a4f]/10 text-[#2d6a4f] text-[8px] font-black px-2 py-1 rounded-full border border-[#2d6a4f]/10 tracking-wider"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 7, delay: 5.5 }} // Peaks at 6s aligned with click
                >
                    VERIFIED
                </motion.div>
            </div>

            {/* Date verification rows */}
            <div className="space-y-3 relative z-10 w-full mt-1">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tight">90 Day</span>
                    {/* The Toggle Box */}
                    <motion.div
                        className="w-7 h-4 rounded-full flex items-center p-0.5 shadow-inner transition-colors"
                        animate={{ backgroundColor: ["#e2e8f0", "#2d6a4f", "#2d6a4f", "#e2e8f0"] }}
                        transition={{ duration: 9, repeat: Infinity, times: [0, 0.55, 0.8, 0.95] }} // Green from 5s-7.2s approx
                    >
                        <motion.div
                            className="w-3 h-3 bg-white rounded-full shadow-sm"
                            animate={{ x: [0, 12, 12, 0] }}
                            transition={{ duration: 9, repeat: Infinity, times: [0, 0.55, 0.8, 0.95] }}
                        />
                    </motion.div>
                </div>
                <div className="flex items-center justify-between opacity-40">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">60 Day</span>
                    <div className="w-7 h-4 bg-slate-200 rounded-full flex items-center justify-start p-0.5 shadow-inner">
                        <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                    </div>
                </div>
            </div>
        </motion.div>


    </div>
);

export const StepVisual3 = () => (
    <div className="relative group">
        <motion.div
            className="w-32 h-32 bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(30,58,95,0.12)] border border-slate-100 p-4 flex flex-col items-center justify-center overflow-hidden relative"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div className="absolute inset-0 bg-linear-to-bl from-[#d4a853]/5 to-transparent" />

            {/* Content: Unified High-Visibility Hub */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full">
                {/* Central Pulse Hub */}
                <div className="relative">
                    <motion.div
                        className="absolute inset-0 bg-[#d4a853]/15 blur-2xl rounded-full"
                        animate={{
                            scale: [1, 1.6, 1],
                            opacity: [0, 0.8, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 7,
                            delay: 7
                        }}
                    />
                    <motion.div
                        className="relative w-16 h-16 bg-white rounded-full border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.05)] flex items-center justify-center"
                        animate={{
                            rotate: [0, -10, 10, -10, 10, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            repeatDelay: 8,
                            delay: 7
                        }}
                    >
                        <Bell className="h-9 w-9 text-[#1e3a5f]" strokeWidth={2} />

                        {/* Status Check */}
                        <motion.div
                            className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
                            animate={{ scale: [0, 1, 1, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 6.5, delay: 7 }}
                        >
                            <CheckCircle2 className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute -top-3 -right-3 w-16 h-16 bg-[#d4a853]/5 rounded-full blur-2xl pointer-events-none" />
    </div>
);
