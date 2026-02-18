"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Info,
    Copy,
    Check,
    Loader2,
    Calendar,
    Smartphone,
    XCircle,
    ChevronDown,
    Search,
    Lock,
    Mail
} from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UserProfile, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";


import { COUNTRY_CODES } from "@/lib/countries";

export function SettingsContent() {
    const { user } = useUser();
    const [copied, setCopied] = useState(false);
    const [baseUrl, setBaseUrl] = useState("");
    const [phone, setPhone] = useState("");
    const [countryCode, setCountryCode] = useState("+1");
    const [savingPhone, setSavingPhone] = useState(false);
    const [openCountryField, setOpenCountryField] = useState(false);
    const [searchCountry, setSearchCountry] = useState("");
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [savingEmailSettings, setSavingEmailSettings] = useState(false);

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

                if (typeof data.email_notifications_enabled === 'boolean') {
                    setEmailNotifications(data.email_notifications_enabled);
                }


            } catch (error) {
                console.error("Error loading profile:", error);
            }
        }
        loadProfile();
    }, [user]);

    const removePhone = async () => {
        if (!user) return;
        if (!confirm("Are you sure you want to remove your phone number? You will no longer receive SMS alerts.")) return;

        setSavingPhone(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: null,
                    email: user.primaryEmailAddress?.emailAddress
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to remove phone");
            }

            setPhone("");
            alert("Phone number removed successfully.");
        } catch (error: unknown) {
            console.error("Error removing phone:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            alert(`Failed to remove phone number: ${errorMessage}`);
        } finally {
            setSavingPhone(false);
        }
    };

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

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to save phone");
            }

            if (isPro) {
                alert("Phone number saved! You can now receive SMS alerts.");
            } else {
                alert("Phone number saved! Upgrade to Pro to activate SMS alerts.");
            }
        } catch (error: unknown) {
            console.error("Error saving phone:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            alert(`Failed to save phone number: ${errorMessage}`);
        } finally {
            setSavingPhone(false);
        }
    };

    const toggleEmailNotifications = async (checked: boolean) => {
        if (!user) return;

        setEmailNotifications(checked);
        setSavingEmailSettings(true);

        try {
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email_notifications_enabled: checked,
                    email: user.primaryEmailAddress?.emailAddress
                })
            });

            if (!res.ok) {
                setEmailNotifications(!checked); // Revert on failure
                alert("Failed to update email settings. Please try again.");
            }
        } catch (error) {
            console.error("Error updating email settings:", error);
            setEmailNotifications(!checked); // Revert on error
        } finally {
            setSavingEmailSettings(false);
        }
    };

    // Use secure calendar token from API, not user.id
    const calendarUrl = calendarToken ? `${baseUrl}/api/calendar/feed?token=${calendarToken}` : "";
    const googleCalendarUrl = calendarUrl ? `https://www.google.com/calendar/render?cid=${encodeURIComponent(calendarUrl.replace("https://", "http://"))}` : "";

    const handleCopy = () => {
        if (!isPro) return;
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
                <TabsList className="bg-transparent border-b border-slate-200 w-full justify-center md:justify-start rounded-none h-auto p-0 gap-8 md:gap-10">
                    <TabsTrigger value="integrations" className="data-[state=active]:border-[#1e3a5f] data-[state=active]:text-[#1e3a5f] rounded-none border-b-2 border-transparent px-4 pb-4 h-auto text-sm font-bold transition-all">Integrations</TabsTrigger>
                    <TabsTrigger value="account" className="data-[state=active]:border-[#1e3a5f] data-[state=active]:text-[#1e3a5f] rounded-none border-b-2 border-transparent px-4 pb-4 h-auto text-sm font-bold transition-all">Account</TabsTrigger>
                </TabsList>

                <TabsContent value="integrations" className="mt-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="max-w-4xl space-y-8">
                        <div className="text-center md:text-left">
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Connected Integrations</h3>
                            <p className="text-slate-500 mt-1 text-sm md:text-base">Manage your external connections and automated alarms.</p>
                        </div>

                        <div className="grid gap-8">
                            {/* CALENDAR */}
                            <Card id="setting-calendar-sync" className="rounded-3xl border-slate-200 bg-white shadow-xl overflow-hidden relative group">

                                <div className="absolute top-0 right-0 bg-[#d4a853] text-[#1e3a5f] text-[10px] font-black px-4 py-2 rounded-bl-xl uppercase tracking-widest">
                                    Active
                                </div>
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 md:gap-8">
                                        <div className="bg-[#1e3a5f] p-5 rounded-[2rem] shadow-2xl shadow-slate-900/20 group-hover:scale-105 transition-transform duration-500 shrink-0">
                                            <Calendar className="h-10 w-10 text-white" />
                                        </div>
                                        <div className="flex-1 w-full space-y-6">
                                            <div>
                                                <h4 className="text-xl md:text-2xl font-black text-slate-900 leading-tight tracking-tighter">Calendar Import</h4>
                                                <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Download lease deadlines to your personal calendar.</p>
                                            </div>

                                            <div className="space-y-6 bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-100 relative overflow-hidden">
                                                {!isPro && (
                                                    <div className="absolute inset-0 bg-white/40 backdrop-blur-xs z-10 flex flex-col items-center justify-center p-4 md:p-6 text-center">
                                                        <div className="bg-[#1e3a5f] p-2 rounded-xl mb-3 shadow-xl">
                                                            <Lock className="h-5 w-5 text-white" />
                                                        </div>
                                                        <h5 className="text-[12px] md:text-sm font-black text-[#1e3a5f] uppercase tracking-wider mb-1">Premium Benefit</h5>
                                                        <p className="text-[10px] text-[#1e3a5f] font-bold max-w-[200px] leading-tight mb-4">
                                                            Unlock automatic calendar syncing for your leases.
                                                        </p>
                                                        <Link href="/billing">
                                                            <Button size="sm" className="h-9 px-6 bg-[#1e3a5f] hover:bg-[#2a4a73] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/20 active:scale-95 transition-all">
                                                                Unlock Sync
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                )}

                                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quick Add</Label>
                                                    <div className="flex gap-2">
                                                        <a href={isPro ? googleCalendarUrl : "/billing"} target={isPro ? "_blank" : "_self"} rel="noopener noreferrer">
                                                            <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg font-bold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 flex items-center gap-1.5">
                                                                <Image src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google" width={16} height={16} className="w-4 h-4" />
                                                                Google
                                                            </Button>
                                                        </a>
                                                        <a href={isPro ? (calendarUrl + "&download=true") : "/billing"}>
                                                            <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg font-bold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 flex items-center gap-1.5">
                                                                <Calendar className="w-4 h-4 text-[#ff3b30]" />
                                                                Apple / Outlook
                                                            </Button>
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="pt-2 text-left w-full">
                                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Your Unique Sync Feed</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            readOnly
                                                            value={isPro ? calendarUrl : "••••••••••••••••••••••••••••••••"}
                                                            className="h-10 md:h-12 flex-1 rounded-xl bg-white border-slate-200 font-mono text-[10px] md:text-xs text-slate-500 shadow-sm"
                                                        />
                                                        <Button
                                                            onClick={isPro ? handleCopy : () => { }}
                                                            className="h-10 md:h-12 px-4 md:px-6 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold font-display shadow-sm"
                                                        >
                                                            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                                    <h5 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                                        <Info className="h-4 w-4 text-[#d4a853]" />
                                                        Manual Setup
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
                                                                    <p className="pt-0.5"><span className="font-bold text-blue-600">Automatic:</span> Click the Google button above to add to your Google account.</p>
                                                                </div>
                                                                <div className="flex items-start gap-3 text-xs text-slate-600">
                                                                    <span className="shrink-0 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-900 shadow-sm">2</span>
                                                                    <p className="pt-0.5"><span className="font-bold text-slate-900">Manual:</span> Copy the <span className="italic">Unique Sync Feed</span> link above.</p>
                                                                </div>
                                                                <div className="flex items-start gap-3 text-xs text-slate-600">
                                                                    <span className="shrink-0 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-900 shadow-sm">3</span>
                                                                    <p className="pt-0.5">In Settings &rarr; <span className="font-bold text-blue-600">Add calendar (+)</span> &rarr; <span className="font-bold text-slate-900">From URL</span> and paste the link.</p>
                                                                </div>
                                                            </TabsContent>

                                                            <TabsContent value="apple" className="space-y-3 mt-0">
                                                                <div className="flex items-start gap-3 text-xs text-slate-600">
                                                                    <span className="shrink-0 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-900 shadow-sm">1</span>
                                                                    <p className="pt-0.5">Click the <span className="font-bold text-slate-900">Apple / Outlook</span> button to download the <span className="font-bold">.ics</span> file.</p>
                                                                </div>
                                                                <div className="flex items-start gap-3 text-xs text-slate-600">
                                                                    <span className="shrink-0 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-900 shadow-sm">2</span>
                                                                    <p className="pt-0.5">Open your calendar app and select <span className="font-bold text-slate-900">File &rarr; Import</span>.</p>
                                                                </div>
                                                                <div className="flex items-start gap-3 text-xs text-slate-600">
                                                                    <span className="shrink-0 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-900 shadow-sm">3</span>
                                                                    <p className="pt-0.5">Choose the downloaded file to add all lease events.</p>
                                                                </div>
                                                            </TabsContent>
                                                        </Tabs>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* EMAIL & SMS ALERTS */}
                            <div className="flex flex-col gap-6">
                                <Card className="rounded-3xl border-slate-200 bg-white shadow-xl overflow-hidden relative group">

                                    <div className="absolute top-0 right-0 bg-slate-100 text-slate-400 text-[10px] font-black px-4 py-2 rounded-bl-xl uppercase tracking-widest">
                                        {emailNotifications ? "Subscribed" : "Unsubscribed"}
                                    </div>
                                    <CardContent className="p-6 md:p-8">
                                        <div className="flex flex-col items-start gap-6">
                                            <div className="bg-[#1e3a5f] p-4 rounded-2xl shadow-xl shadow-slate-900/20 group-hover:scale-105 transition-transform duration-500">
                                                <Mail className="h-8 w-8 text-white" />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-xl font-black text-slate-900 leading-tight">Email Alerts</h4>
                                                <p className="text-xs text-slate-500 font-medium">Receive detailed lease expiration reports.</p>
                                            </div>
                                            <div className="w-full pt-4 border-t border-slate-100 flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                                                <div className="flex items-center gap-3">
                                                    {savingEmailSettings && <Loader2 className="h-3 w-3 animate-spin text-slate-400" />}
                                                    <Switch
                                                        checked={emailNotifications}
                                                        onCheckedChange={toggleEmailNotifications}
                                                        className="data-[state=checked]:bg-[#1e3a5f]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-3xl border-slate-200 bg-white shadow-xl overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 bg-slate-100 text-slate-400 text-[10px] font-black px-4 py-2 rounded-bl-xl uppercase tracking-widest">
                                        {phone ? (isPro ? "Enabled" : "Pro Required") : "Not Setup"}
                                    </div>
                                    <CardContent className="p-6 md:p-8">
                                        <div className="flex flex-col items-start gap-6">
                                            <div className="bg-[#1e3a5f] p-4 rounded-2xl shadow-xl shadow-slate-900/20 group-hover:scale-105 transition-transform duration-500">
                                                <Smartphone className="h-8 w-8 text-white" />
                                            </div>

                                            <div className="space-y-1">
                                                <h4 className="text-xl font-black text-slate-900 leading-tight">SMS Alerts</h4>
                                                <p className="text-xs text-slate-500 font-medium">Profit protection alerts via text.</p>
                                            </div>
                                            <div className="w-full pt-4 border-t border-slate-100">
                                                {!phone ? (
                                                    <Button onClick={() => document.getElementById('sms-settings')?.scrollIntoView({ behavior: 'smooth' })} className="w-full h-10 bg-[#1e3a5f] text-white text-[10px] font-black uppercase tracking-widest rounded-xl">
                                                        Configure
                                                    </Button>
                                                ) : (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-slate-700">{countryCode} {phone}</span>
                                                        <Badge className="bg-[#2d6a4f]/10 text-[#2d6a4f] text-[9px] font-bold">VERIFIED</Badge>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* SMS CONFIGURATION */}
                            <Card id="sms-settings" className="rounded-3xl border-slate-200 bg-white shadow-xl overflow-hidden group">
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 md:gap-8">
                                        <div className="bg-[#1e3a5f] p-5 rounded-[2rem] shadow-2xl shadow-slate-900/20 group-hover:scale-105 transition-transform duration-500 shrink-0">
                                            <Smartphone className="h-10 w-10 text-white" />
                                        </div>
                                        <div className="flex-1 w-full space-y-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <Image src="/icon-192.png" alt="RentClock" width={24} height={24} className="rounded-lg shadow-sm" />
                                                    <span className="text-[12px] font-black text-[#1e3a5f] uppercase tracking-widest">RentClock</span>
                                                </div>
                                                <h4 className="text-xl md:text-2xl font-black text-slate-900 leading-tight tracking-tighter">SMS Configuration</h4>
                                                <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Manage the phone number used for profit protection alerts.</p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex flex-col gap-2 w-full text-center md:text-left">
                                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</Label>
                                                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto md:mx-0">
                                                        <div className="flex gap-2">
                                                            <Popover open={openCountryField} onOpenChange={setOpenCountryField}>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        className="w-[100px] h-12 justify-between bg-white border-slate-200 rounded-xl px-4 transition-all hover:border-slate-300"
                                                                    >
                                                                        <span className="font-bold text-slate-700 text-sm">{countryCode}</span>
                                                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-[300px] p-0 rounded-2xl shadow-2xl border-slate-200" align="start">
                                                                    <div className="p-3 border-b border-slate-100">
                                                                        <div className="relative">
                                                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                                                            <Input
                                                                                placeholder="Search country..."
                                                                                className="pl-9 h-9 text-xs rounded-lg border-slate-200"
                                                                                value={searchCountry}
                                                                                onChange={(e) => setSearchCountry(e.target.value)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="max-h-[300px] overflow-y-auto p-1">
                                                                        {COUNTRY_CODES.filter(c =>
                                                                            c.code.toLowerCase().includes(searchCountry.toLowerCase()) ||
                                                                            c.dial_code.includes(searchCountry)
                                                                        ).map((c) => (
                                                                            <button
                                                                                key={c.code}
                                                                                onClick={() => {
                                                                                    setCountryCode(c.dial_code);
                                                                                    setOpenCountryField(false);
                                                                                }}
                                                                                className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold hover:bg-slate-50 rounded-lg transition-colors group"
                                                                            >
                                                                                <span className="text-slate-600 group-hover:text-[#1e3a5f] flex items-center gap-2">
                                                                                    <span className="text-base">{c.flag}</span>
                                                                                    {c.code}
                                                                                </span>
                                                                                <span className="text-slate-400 font-mono tracking-tighter">{c.dial_code}</span>
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </PopoverContent>
                                                            </Popover>
                                                            <Input
                                                                placeholder="555-0123"
                                                                value={phone}
                                                                onChange={(e) => setPhone(e.target.value)}
                                                                className="h-12 flex-1 bg-white border-slate-200 rounded-xl px-4 font-bold text-slate-700 shadow-sm transition-all focus-visible:ring-[#1e3a5f]"
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={savePhone}
                                                                disabled={savingPhone}
                                                                className="h-12 flex-1 bg-[#1e3a5f] hover:bg-[#2a4a73] text-white rounded-xl font-black shadow-lg shadow-slate-900/10 transition-all active:scale-95 px-6"
                                                            >
                                                                {savingPhone ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                                                            </Button>
                                                            {phone && (
                                                                <Button
                                                                    onClick={removePhone}
                                                                    disabled={savingPhone}
                                                                    variant="outline"
                                                                    className="h-12 w-12 p-0 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-xl shadow-sm transition-all shrink-0"
                                                                    title="Remove phone number"
                                                                >
                                                                    <XCircle className="h-5 w-5" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 max-w-md mx-auto md:mx-0">
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                                                        {isPro ? "Your SMS alerts are active." : "Upgrade to Pro to activate SMS alerts."}
                                                    </p>
                                                </div>
                                                <p className="text-slate-400 text-[10px] mt-4 leading-relaxed max-w-md">
                                                    By providing your phone number, you agree to receive automated transactional text messages (alerts and reminders) from RentClock. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply STOP to cancel or HELP for more information. View our <Link href="/privacy" className="underline">Privacy Policy</Link> and <Link href="/terms" className="underline">Terms of Service</Link>.
                                                </p>

                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="account" className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-center w-full">
                        <UserProfile
                            routing="hash"
                            appearance={{
                                elements: {
                                    rootBox: "w-full shadow-none",
                                    card: "w-full shadow-none border border-slate-200 rounded-3xl",
                                    navbar: "hidden",
                                    pageScrollBox: "p-4 md:p-8",
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
