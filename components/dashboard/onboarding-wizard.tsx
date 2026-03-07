"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { COUNTRY_CODES } from "@/lib/countries";
import { Loader2, Smartphone, Calendar, ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { useTutorial } from "@/components/tutorial/tutorial-provider";
import { completeOnboardingAction } from "@/actions/tutorial-actions";
import { STATE_NOTICE_REQUIREMENTS } from "@/lib/state-notices";

export function OnboardingWizard() {
    const { user, isLoaded } = useUser();
    const { startTour, setHasOnboarded } = useTutorial();
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1); // 1 = Phone, 2 = Calendar, 3 = State
    const [loading, setLoading] = useState(true);
    const [isPro, setIsPro] = useState(false);

    // Phone State
    const [phone, setPhone] = useState("");
    const [countryCode, setCountryCode] = useState("+1");
    const [savingPhone, setSavingPhone] = useState(false);

    // Calendar State
    const [baseUrl, setBaseUrl] = useState("");

    const [calendarToken, setCalendarToken] = useState("");

    // State Selection
    const [selectedState, setSelectedState] = useState("");

    useEffect(() => {
        if (!isLoaded || !user) return;
        setBaseUrl(window.location.origin);

        // Check localStorage first as backup
        const localOnboarded = localStorage.getItem("rentclock_onboarded");
        if (localOnboarded === "true") {
            setLoading(false);
            return;
        }

        const checkOnboardingStatus = async () => {
            if (!user) return;
            try {
                const res = await fetch("/api/user/profile");
                if (!res.ok) throw new Error("Failed to fetch profile");
                const data = await res.json();

                if (data.is_pro) setIsPro(data.is_pro);
                if (data.calendar_token) setCalendarToken(data.calendar_token);

                // If has_onboarded is false and user is PRO, show wizard
                // NOTE: TutorialProvider is also checking this and BLOCKING tutorials
                if (!data.has_onboarded && data.is_pro) {
                    setOpen(true);
                } else if (data.has_onboarded) {
                    localStorage.setItem("rentclock_onboarded", "true");
                }
            } catch (error) {
                console.error("Error checking onboarding status:", error);
            } finally {
                setLoading(false);
            }
        };

        checkOnboardingStatus();
    }, [isLoaded, user]);

    const completeOnboarding = async () => {
        setOpen(false);
        if (!user) return;

        // 1. Tell Backend via Server Action
        try {
            await completeOnboardingAction();
            
            // 2. Also call the profile API to ensure it's saved
            await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ has_onboarded: true })
            });
        } catch (error) {
            console.error("Error completing onboarding:", error);
        }

        // 3. Tell Frontend (TutorialProvider) to unblock status
        setHasOnboarded(true);
        
        // 4. Also save to localStorage as backup
        localStorage.setItem("rentclock_onboarded", "true");

        // 5. Explicitly start the Home Tour immediately
        // Small delay for dialog close animation
        setTimeout(() => {
            startTour("home");
        }, 500);
    };

    const handleSavePhone = async () => {
        if (!user) return;
        if (!phone) {
            setStep(2); // Skip if empty
            return;
        }

        setSavingPhone(true);
        try {
            const fullPhone = `${countryCode}${phone.replace(/\D/g, '')}`;
            await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: fullPhone,
                    email: user.primaryEmailAddress?.emailAddress
                })
            });
            setStep(2);
        } catch (error) {
            console.error("Error saving phone", error);
        } finally {
            setSavingPhone(false);
        }
    };

    const calendarUrl = (user && calendarToken) ? `${baseUrl}/api/calendar/feed?token=${calendarToken}` : "";
    const googleCalendarUrl = `https://www.google.com/calendar/render?cid=${encodeURIComponent(calendarUrl.replace("https://", "http://"))}`;
    const appleCalendarUrl = calendarUrl.replace("https://", "webcal://");

    if (!isLoaded || loading) return null;

    return (
        <Dialog open={open} onOpenChange={(val) => !val && completeOnboarding()}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-3xl">

                {/* Header Gradient */}
                <div className="bg-[#1e3a5f] p-8 pb-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#d4a853]/10 rounded-full -ml-12 -mb-12 blur-xl" />

                    {step === 1 ? (
                        <div className="mx-auto bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner border border-white/20">
                            <Smartphone className="h-8 w-8 text-white" />
                        </div>
                    ) : step === 2 ? (
                        <div className="mx-auto bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner border border-white/20">
                            <Calendar className="h-8 w-8 text-white" />
                        </div>
                    ) : (
                        <div className="mx-auto bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner border border-white/20">
                            <MapPin className="h-8 w-8 text-white" />
                        </div>
                    )}

                    <DialogTitle className="text-2xl font-black text-white tracking-tight">
                        {step === 1 ? "Get SMS Alerts" : step === 2 ? "Sync Your Calendar" : "Set Your State"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-300 font-medium mt-2">
                        {step === 1
                            ? "Get notified about critical lease deadlines. RentClock will text you when it's time to act."
                            : step === 2
                                ? "See upcoming renewals and rent increases directly in your personal calendar."
                                : "Know your state's notice requirements for commercial leases."
                        }
                    </DialogDescription>
                </div>

                <div className="p-8 -mt-6 bg-white relative">
                    {!isPro ? (
                        <div className="space-y-6 text-center py-4">
                            <div className="mx-auto w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                                <ShieldCheck className="h-8 w-8 text-amber-600" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Pro Features Locked</h3>
                            <p className="text-slate-500 font-medium">
                                SMS Alerts and Calendar Sync are part of RentClock Pro. Upgrade now to get SMS alerts and calendar sync.
                            </p>
                            <Link href="/settings">
                                <Button className="h-14 w-full bg-[#1e3a5f] hover:bg-[#2a4a73] text-white rounded-xl font-black text-lg shadow-xl shadow-[#1e3a5f]/20">
                                    Upgrade to Pro
                                </Button>
                            </Link>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setStep(3)}
                                        className="w-full text-slate-400 font-bold"
                                    >
                                        Continue with Free Plan
                                    </Button>
                                </div>
                            ) : (
                        <>
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Mobile Number (Optional)</Label>
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
                                        <p className="text-slate-600 mb-8">RentClock is verifying your setup... Only critical alarms.</p>
                                    </div>

                                    <div className="flex flex-col gap-3 pt-2">
                                        <Button
                                            onClick={handleSavePhone}
                                            disabled={savingPhone}
                                            className="h-14 w-full bg-[#1e3a5f] hover:bg-[#2a4a73] text-white rounded-xl font-black text-lg shadow-xl shadow-[#1e3a5f]/20"
                                        >
                                            {savingPhone ? <Loader2 className="animate-spin" /> : "Save & Continue"}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => setStep(2)}
                                            className="h-12 w-full text-slate-400 hover:text-slate-600 font-bold"
                                        >
                                            I want only email notifications
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Quick Add</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer">
                                                <Button variant="outline" className="w-full h-12 rounded-xl font-bold text-sm text-slate-700 bg-white border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-1.5">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google" className="w-5 h-5" />
                                                    Google
                                                </Button>
                                            </a>
                                            <a href={appleCalendarUrl}>
                                                <Button variant="outline" className="w-full h-12 rounded-xl font-bold text-sm text-slate-700 bg-white border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-1.5">
                                                    <Calendar className="w-5 h-5 text-[#ff3b30]" />
                                                    Apple / Outlook
                                                </Button>
                                            </a>
                                        </div>

                                        <p className="text-xs text-slate-400 text-center pt-2">
                                            Doesn&apos;t work? <a href="/settings?tab=integrations" className="text-[#1e3a5f] font-bold hover:underline">Go to Settings</a> for manual setup.
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-3 pt-2">
                                        <Button
                                            onClick={() => setStep(3)}
                                            className="h-14 w-full bg-[#d4a853] hover:bg-[#c49a45] text-[#1e3a5f] rounded-xl font-black text-lg shadow-xl shadow-[#d4a853]/20 flex items-center justify-center gap-2"
                                        >
                                            Continue <ArrowRight className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => setStep(3)}
                                            className="h-12 w-full text-slate-400 hover:text-slate-600 font-bold"
                                        >
                                            Skip for now
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Your State (Optional)</Label>
                                        <select
                                            value={selectedState}
                                            onChange={(e) => setSelectedState(e.target.value)}
                                            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-bold text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                                        >
                                            <option value="">Select your state...</option>
                                            {STATE_NOTICE_REQUIREMENTS.map((s) => (
                                                <option key={s.stateCode} value={s.stateCode}>
                                                    {s.state}
                                                </option>
                                            ))}
                                        </select>

                                        {selectedState && (
                                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                                <p className="text-sm font-bold text-amber-900">
                                                    {(() => {
                                                        const req = STATE_NOTICE_REQUIREMENTS.find(r => r.stateCode === selectedState);
                                                        return req ? `${req.state} Notice Requirements` : '';
                                                    })()}
                                                </p>
                                                <p className="text-xs text-amber-700 mt-1">
                                                    {(() => {
                                                        const req = STATE_NOTICE_REQUIREMENTS.find(r => r.stateCode === selectedState);
                                                        return req ? `${req.commercialNoticeDays} days minimum notice required for commercial leases.${req.specialRequirements ? ' ' + req.specialRequirements : ''}` : '';
                                                    })()}
                                                </p>
                                            </div>
                                        )}

                                        <p className="text-xs text-slate-400">
                                            This helps us show you state-specific notice requirements. You can change this later in Settings.
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-3 pt-2">
                                        <Button
                                            onClick={completeOnboarding}
                                            className="h-14 w-full bg-[#1e3a5f] hover:bg-[#2a4a73] text-white rounded-xl font-black text-lg shadow-xl shadow-[#1e3a5f]/20 flex items-center justify-center gap-2"
                                        >
                                            Finish Setup <ArrowRight className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={completeOnboarding}
                                            className="h-12 w-full text-slate-400 hover:text-slate-600 font-bold"
                                        >
                                            Skip for now
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
