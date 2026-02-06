"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { COUNTRY_CODES } from "@/lib/countries";
import { Loader2, Smartphone } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useTutorial } from "@/components/tutorial/tutorial-provider";
import { toast } from "sonner";

interface ConnectPhoneDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ConnectPhoneDialog({ open, onOpenChange, onSuccess }: ConnectPhoneDialogProps) {
    const { user } = useUser();
    const { setHasPhone } = useTutorial();
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState("");
    const [countryCode, setCountryCode] = useState("+1");

    const handleSavePhone = async () => {
        if (!user) return;
        if (!phone) {
            toast.error("Please enter a valid phone number");
            return;
        }

        setLoading(true);
        try {
            const fullPhone = `${countryCode}${phone.replace(/\D/g, '')}`;
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: fullPhone,
                    email: user.primaryEmailAddress?.emailAddress
                })
            });

            if (!res.ok) throw new Error("Failed to save phone");

            setHasPhone(true);
            toast.success("Phone connected successfully!");
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Error saving phone", error);
            toast.error("Failed to save phone number");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl rounded-3xl overflow-hidden p-0">
                <div className="bg-[#1e3a5f] p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#d4a853]/10 rounded-full -ml-12 -mb-12 blur-xl" />

                    <div className="mx-auto bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner border border-white/20">
                        <Smartphone className="h-8 w-8 text-white" />
                    </div>

                    <DialogTitle className="text-2xl font-black text-white tracking-tight">
                        Enable SMS Alerts
                    </DialogTitle>
                    <DialogDescription className="text-slate-300 font-medium mt-2">
                        Connect your phone number to receive critical lease expiration and rent increase alerts.
                    </DialogDescription>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Mobile Number</Label>
                        <div className="flex gap-2">
                            <select
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                                className="h-12 w-[100px] rounded-xl border border-slate-200 bg-white px-3 font-bold text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                            >
                                {COUNTRY_CODES.map((c) => (
                                    <option key={c.code} value={c.dial_code}>{c.flag} {c.dial_code}</option>
                                ))}
                            </select>
                            <Input
                                placeholder="555-0123"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="h-12 rounded-xl text-lg font-bold"
                            />
                        </div>
                        <p className="text-slate-600 text-sm">RentClock is verifying your setup... Only critical alarms.</p>
                        <p className="text-slate-400 text-[10px] mt-2 leading-relaxed">
                            By providing your phone number, you agree to receive automated transactional text messages (alerts and reminders) from RentClock. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply STOP to cancel.
                        </p>

                    </div>

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={handleSavePhone}
                            disabled={loading}
                            className="h-14 w-full bg-[#1e3a5f] hover:bg-[#2a4a73] text-white rounded-xl font-black text-lg shadow-xl shadow-[#1e3a5f]/20"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Save & Activate"}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="h-12 w-full text-slate-400 hover:text-slate-600 font-bold"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
