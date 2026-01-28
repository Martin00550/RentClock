"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Info,
    Copy,
    Check,
    Loader2,
    Calendar,
    Smartphone
} from "lucide-react";
import { UserProfile, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { COUNTRY_CODES } from "@/lib/countries";

export function SettingsContent() {
    const { user } = useUser();
    const [copied, setCopied] = useState(false);
    const [baseUrl, setBaseUrl] = useState("");
    const [phone, setPhone] = useState("");
    const [countryCode, setCountryCode] = useState("+1");
    const [savingPhone, setSavingPhone] = useState(false);

    // Dynamic billing state
    const [isPro, setIsPro] = useState(false);
    const [calendarToken, setCalendarToken] = useState("");

    useEffect(() => {
        setBaseUrl(window.location.origin);

        async function loadProfile() {
            if (!user) return;
            try {
                // Fetch user profile
                const res = await fetch("/api/user/profile");
                if (!res.ok) return;
                const data = await res.json();

                // Set Pro status and calendar token
                setIsPro(data.is_pro || false);
                if (data.calendar_token) {
                    setCalendarToken(data.calendar_token);
                }

                if (data.phone) {
                    let foundPrefix = false;
                    for (const c of COUNTRY_CODES) {
                        if (data.phone.startsWith(c.dial_code)) {
                            setCountryCode(c.dial_code);
                            setPhone(data.phone.substring(c.dial_code.length));
                            foundPrefix = true;
                            break;
                        }
                    }
                    if (!foundPrefix) {
                        setPhone(data.phone);
                    }
                }


            } catch (error) {
                console.error("Error loading profile:", error);
            }
        }
        loadProfile();
    }, [user]);

    const savePhone = async () => {
        if (!user) return;
        setSavingPhone(true);
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
            alert("Phone number saved! You will now receive SMS alerts.");
        } catch (error: unknown) {
            console.error("Error saving phone:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            alert(`Failed to save phone number: ${errorMessage}`);
        } finally {
            setSavingPhone(false);
        }
    };

    // Use secure calendar token from API, not user.id
    const calendarUrl = calendarToken ? `${baseUrl}/api/calendar/feed?token=${calendarToken}` : "";
    const googleCalendarUrl = calendarUrl ? `https://www.google.com/calendar/render?cid=${encodeURIComponent(calendarUrl.replace("https://", "http://"))}` : "";
    const appleCalendarUrl = calendarUrl ? calendarUrl.replace("https://", "webcal://") : "";

    const handleCopy = () => {
        navigator.clipboard.writeText(calendarUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
                <p className="text-slate-500 mt-2 text-lg">Manage your calendar integrations and subscription plan.</p>
            </div>

            <Tabs defaultValue="integrations" className="w-full">
                <TabsList className="bg-transparent border-b border-slate-200 w-full justify-start rounded-none h-auto p-0 gap-10">
                    <TabsTrigger value="integrations" className="data-[state=active]:border-[#1e3a5f] data-[state=active]:text-[#1e3a5f] rounded-none border-b-2 border-transparent px-0 pb-4 h-auto text-sm font-bold transition-all">Integrations</TabsTrigger>

                    <TabsTrigger value="account" className="data-[state=active]:border-[#1e3a5f] data-[state=active]:text-[#1e3a5f] rounded-none border-b-2 border-transparent px-0 pb-4 h-auto text-sm font-bold transition-all">Account</TabsTrigger>
                </TabsList>

                <TabsContent value="integrations" className="mt-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="max-w-4xl space-y-8">
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Connected Integrations</h3>
                            <p className="text-slate-500 mt-1">Manage your external connections and automated alarms.</p>
                        </div>

                        <div className="grid gap-8">
                            {/* CALENDAR */}
                            <Card className="rounded-3xl border-slate-200 bg-white shadow-xl overflow-hidden relative group">
                                <div className="absolute top-0 right-0 bg-[#d4a853] text-[#1e3a5f] text-[10px] font-black px-4 py-2 rounded-bl-xl uppercase tracking-widest">
                                    Active
                                </div>
                                <CardContent className="p-8">
                                    <div className="flex items-start gap-8">
                                        <div className="bg-[#1e3a5f] p-5 rounded-[2rem] shadow-2xl shadow-slate-900/20 group-hover:scale-105 transition-transform duration-500 shrink-0">
                                            <Calendar className="h-10 w-10 text-white" />
                                        </div>
                                        <div className="flex-1 space-y-6">
                                            <div>
                                                <h4 className="text-2xl font-black text-slate-900 leading-tight tracking-tighter">Calendar Magic Link</h4>
                                                <p className="text-slate-500 font-medium mt-1">Sync your lease deadlines directly to your personal calendar.</p>
                                            </div>

                                            <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quick Add</Label>
                                                    <div className="flex gap-2">
                                                        <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer">
                                                            <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg font-bold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 flex items-center gap-1.5">
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google" className="w-4 h-4" />
                                                                Google
                                                            </Button>
                                                        </a>
                                                        <a href={appleCalendarUrl}>
                                                            <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg font-bold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 flex items-center gap-1.5">
                                                                <Calendar className="w-4 h-4 text-[#ff3b30]" />
                                                                Apple / Outlook
                                                            </Button>
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="pt-2">
                                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Your Unique Sync Feed</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            readOnly
                                                            value={calendarUrl}
                                                            className="h-12 flex-1 rounded-xl bg-white border-slate-200 font-mono text-xs text-slate-500 shadow-sm"
                                                        />
                                                        <Button
                                                            onClick={handleCopy}
                                                            className="h-12 px-6 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold font-display shadow-sm"
                                                        >
                                                            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                                <h5 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                                    <Info className="h-4 w-4 text-[#d4a853]" />
                                                    Setup Instructions
                                                </h5>
                                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                    <Tabs defaultValue="google" className="w-full">
                                                        <TabsList className="w-full grid grid-cols-2 h-9 mb-4">
                                                            <TabsTrigger value="google" className="text-xs font-bold">Google Cal</TabsTrigger>
                                                            <TabsTrigger value="apple" className="text-xs font-bold">Apple / Outlook</TabsTrigger>
                                                        </TabsList>

                                                        <TabsContent value="google" className="space-y-3 mt-0">
                                                            <div className="flex items-start gap-3 text-xs text-slate-600">
                                                                <span className="shrink-0 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-900 shadow-sm">1</span>
                                                                <p className="pt-0.5">Go to <span className="font-bold text-slate-900">Settings</span> on your Google Calendar.</p>
                                                            </div>
                                                            <div className="flex items-start gap-3 text-xs text-slate-600">
                                                                <span className="shrink-0 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-900 shadow-sm">2</span>
                                                                <p className="pt-0.5">Find <span className="font-bold text-slate-900">Add calendar</span> in sidebar &rarr; <span className="font-bold text-slate-900">From URL</span>.</p>
                                                            </div>
                                                            <div className="flex items-start gap-3 text-xs text-slate-600">
                                                                <span className="shrink-0 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-900 shadow-sm">3</span>
                                                                <p className="pt-0.5">Paste the link above and click <span className="font-bold text-slate-900">Add calendar</span>.</p>
                                                            </div>
                                                        </TabsContent>

                                                        <TabsContent value="apple" className="space-y-3 mt-0">
                                                            <div className="flex items-start gap-3 text-xs text-slate-600">
                                                                <span className="shrink-0 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-900 shadow-sm">1</span>
                                                                <p className="pt-0.5">Open Calendar on your Mac or Outlook.</p>
                                                            </div>
                                                            <div className="flex items-start gap-3 text-xs text-slate-600">
                                                                <span className="shrink-0 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-900 shadow-sm">2</span>
                                                                <p className="pt-0.5"><span className="font-bold text-slate-900">File</span> &rarr; <span className="font-bold text-slate-900">New Calendar Subscription</span>.</p>
                                                            </div>
                                                            <div className="flex items-start gap-3 text-xs text-slate-600">
                                                                <span className="shrink-0 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-900 shadow-sm">3</span>
                                                                <p className="pt-0.5">Paste the link and click <span className="font-bold text-slate-900">Subscribe</span>.</p>
                                                            </div>
                                                        </TabsContent>
                                                    </Tabs>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* SMS */}
                            <Card className="rounded-3xl border-slate-200 bg-white shadow-xl overflow-hidden relative group">
                                <div className="absolute top-0 right-0 bg-slate-100 text-slate-400 text-[10px] font-black px-4 py-2 rounded-bl-xl uppercase tracking-widest">
                                    {phone ? "Enabled" : "Not Setup"}
                                </div>
                                <CardContent className="p-8">
                                    <div className="flex items-start gap-8">
                                        <div className="bg-[#1e3a5f] p-5 rounded-[2rem] shadow-2xl shadow-slate-900/20 group-hover:scale-105 transition-transform duration-500 shrink-0">
                                            <Smartphone className="h-10 w-10 text-white" />
                                        </div>
                                        <div className="flex-1 space-y-6">
                                            <div>
                                                <h4 className="text-2xl font-black text-slate-900 leading-tight tracking-tighter">SMS Alerts</h4>
                                                <p className="text-slate-500 font-medium mt-1">Receive critical profit protection SMS alerts</p>
                                            </div>

                                            <div className="grid gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 max-w-md">
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mobile Number</Label>
                                                    <div className="flex gap-2">
                                                        <select
                                                            value={countryCode}
                                                            onChange={(e) => setCountryCode(e.target.value)}
                                                            className="h-12 w-[110px] rounded-xl border border-slate-200 bg-white px-3 font-bold text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent shadow-sm"
                                                        >
                                                            {COUNTRY_CODES.map((c) => (
                                                                <option key={c.code} value={c.dial_code}>{c.flag} {c.dial_code}</option>
                                                            ))}
                                                        </select>
                                                        <Input
                                                            placeholder="555-0123"
                                                            value={phone}
                                                            onChange={(e) => setPhone(e.target.value)}
                                                            className="h-12 flex-1 rounded-xl bg-white border-slate-200 text-slate-900 font-bold shadow-sm focus-visible:ring-[#1e3a5f]"
                                                        />
                                                        <Button
                                                            onClick={savePhone}
                                                            disabled={savingPhone}
                                                            className="h-12 px-6 bg-[#1e3a5f] hover:bg-[#2a4a73] text-white rounded-xl font-black shadow-lg shadow-slate-900/10 transition-all hover:scale-[1.02]"
                                                        >
                                                            {savingPhone ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                                                        </Button>
                                                    </div>
                                                </div>
                                                {phone && isPro && (
                                                    <Button
                                                        variant="outline"
                                                        onClick={async () => {
                                                            try {
                                                                const res = await fetch("/api/sms/test", { method: "POST" });
                                                                const data = await res.json();
                                                                if (res.ok) {
                                                                    alert("✓ Test SMS sent! Check your phone.");
                                                                } else {
                                                                    alert("Error: " + (data.error || "Failed to send"));
                                                                }
                                                            } catch (err) {
                                                                console.error("Failed to send test SMS:", err);
                                                                alert("Network error. Please try again.");
                                                            }
                                                        }}
                                                        className="h-10 w-full border-[#1e3a5f]/20 text-[#1e3a5f] font-bold text-sm hover:bg-[#1e3a5f]/5 rounded-xl"
                                                    >
                                                        📱 Send Test SMS
                                                    </Button>
                                                )}
                                                {!isPro && phone && (
                                                    <p className="text-xs text-slate-400 font-medium">
                                                        Upgrade to Pro to send test & receive SMS alerts
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>



                <TabsContent value="account" className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-center w-full">
                        <UserProfile
                            routing="hash"
                            appearance={{
                                elements: {
                                    rootBox: "w-full shadow-none",
                                    card: "w-full shadow-none border border-slate-200 rounded-3xl",
                                    navbar: "hidden",
                                    pageScrollBox: "p-8",
                                    headerTitle: "hidden",
                                    headerSubtitle: "hidden"
                                }
                            }}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}


