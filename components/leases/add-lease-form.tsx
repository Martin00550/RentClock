"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Upload,
    Calendar as CalendarIcon,
    DollarSign,
    MapPin,
    User,
    Bell,
    ArrowLeft,
    Loader2,
    Clock,
    FileText,
    MessageSquare,
    Mail,
    ShieldCheck,
    ArrowRight,
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parse, parseISO, isValid, startOfDay } from "date-fns";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useCallback } from "react";
import { addYears } from "date-fns";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { useTutorial } from "@/components/tutorial/tutorial-provider";
import { ConnectPhoneDialog } from "@/components/settings/connect-phone-dialog";

interface AddLeaseFormProps {
    leaseCount?: number;
    isPro?: boolean;
    bonusLeases?: number;
}

export function AddLeaseForm({ leaseCount = 0, isPro = false, bonusLeases = 0 }: AddLeaseFormProps) {
    const { user } = useUser();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [tenantName, setTenantName] = useState("");
    const [monthlyRent, setMonthlyRent] = useState("");
    const [propertyAddress, setPropertyAddress] = useState("");
    const [rentIncreaseAmount, setRentIncreaseAmount] = useState("");
    const [leaseStartDate, setLeaseStartDate] = useState<Date>();
    const [startDateInput, setStartDateInput] = useState("");
    const [expiryDate, setExpiryDate] = useState<Date>();
    const [increaseDate, setIncreaseDate] = useState<Date>();
    const [expiryInput, setExpiryInput] = useState("");
    const [increaseInput, setIncreaseInput] = useState("");
    const [pdfUrl, setPdfUrl] = useState("");
    const [rentSchedule, setRentSchedule] = useState<{ date: string, amount: number }[]>([]);
    const [extractedFields, setExtractedFields] = useState<string[]>([]);

    useEffect(() => {
        // Only auto-generate if we modified the core numbers manually
        // and we have enough data to project (Rent + Increase Date)
        if (!monthlyRent || !rentIncreaseAmount || !increaseDate) return;

        // If the AI found a specific schedule, we respect it until the user changes core fields
        if (extractedFields.includes("rent_schedule")) return;

        const base = parseFloat(monthlyRent.replace(/,/g, ""));
        const step = parseFloat(rentIncreaseAmount.replace(/,/g, ""));

        if (isNaN(base) || isNaN(step)) return;

        // Project 5 years of annual increases for visualization
        const projected = [];
        for (let i = 0; i < 5; i++) {
            const date = addYears(increaseDate, i);
            projected.push({
                date: format(date, "MM/dd/yyyy"),
                amount: base + (step * (i + 1))
            });
        }
        setRentSchedule(projected);
    }, [monthlyRent, rentIncreaseAmount, increaseDate, extractedFields]);

    const Sparkle = ({ field }: { field: string }) => {
        if (!extractedFields.includes(field)) return null;
        return (
            <div className="absolute right-3 top-3 animate-bounce">
                <div className="bg-indigo-500/10 text-indigo-600 p-0.5 rounded-md flex items-center gap-1">
                    <span className="text-[8px] font-black uppercase tracking-tighter">AI</span>
                </div>
            </div>
        );
    };

    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);

    // Alert State
    const [reminder90DaysEmail, setReminder90DaysEmail] = useState(true);
    const [reminder60DaysEmail, setReminder60DaysEmail] = useState(true);
    const [reminder30DaysEmail, setReminder30DaysEmail] = useState(true);
    const [reminder7DaysEmail, setReminder7DaysEmail] = useState(true);
    const [reminder90DaysSMS, setReminder90DaysSMS] = useState(false);
    const [reminder60DaysSMS, setReminder60DaysSMS] = useState(false);
    const [reminder30DaysSMS, setReminder30DaysSMS] = useState(false);
    const [reminder7DaysSMS, setReminder7DaysSMS] = useState(false);

    const { hasPhone } = useTutorial();
    const [connectPhoneOpen, setConnectPhoneOpen] = useState(false);
    const [pendingSmsToggle, setPendingSmsToggle] = useState<{ days: number, val: boolean } | null>(null);

    const handleSmsToggle = (days: number, val: boolean) => {
        if (!isPro) return;

        // If turning ON and no phone, show dialog
        if (val && !hasPhone) {
            setPendingSmsToggle({ days, val });
            setConnectPhoneOpen(true);
            return;
        }

        if (days === 90) setReminder90DaysSMS(val);
        else if (days === 60) setReminder60DaysSMS(val);
        else if (days === 30) setReminder30DaysSMS(val);
        else if (days === 7) setReminder7DaysSMS(val);
    };

    const handlePhoneConnected = () => {
        if (pendingSmsToggle) {
            if (pendingSmsToggle.days === 90) setReminder90DaysSMS(pendingSmsToggle.val);
            else if (pendingSmsToggle.days === 60) setReminder60DaysSMS(pendingSmsToggle.val);
            else if (pendingSmsToggle.days === 30) setReminder30DaysSMS(pendingSmsToggle.val);
            else if (pendingSmsToggle.days === 7) setReminder7DaysSMS(pendingSmsToggle.val);
            setPendingSmsToggle(null);
        }
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Manual trigger of existing logic
        const fakeEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleFileUpload(fakeEvent);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        maxFiles: 1,
        disabled: isScanning
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("📂 handleFileUpload triggered");
        const file = e.target.files?.[0];
        if (!file) {
            console.log("❌ No file selected");
            return;
        }
        console.log(`✅ File selected: ${file.name} (${file.size} bytes)`);

        setIsScanning(true);
        setScanError(null);
        console.log("🔄 isScanning set to true, scanError cleared");

        const formData = new FormData();
        formData.append("file", file);
        console.log("📤 Sending request to /api/scan-lease...");

        try {
            const res = await fetch("/api/scan-lease", {
                method: "POST",
                body: formData,
            });
            console.log(`📥 Response status: ${res.status}`);
            const json = await res.json();
            console.log("📥 Response JSON:", json);
            const { success, data, error } = json;

            if (!success) throw new Error(error || "Scan was not successful");

            console.log("✅ Scan successful, populating form...");
            // Populate form with AI data
            if (data.tenant_name) setTenantName(data.tenant_name);
            if (data.property_address) setPropertyAddress(data.property_address);
            if (data.monthly_rent) setMonthlyRent(data.monthly_rent.toString());
            if (data.rent_increase_amount) setRentIncreaseAmount(data.rent_increase_amount.toString());
            if (data.rent_schedule) setRentSchedule(data.rent_schedule);

            // Track which fields were auto-filled for UI highlights
            const filled = Object.keys(data).filter(k => !!(data as Record<string, unknown>)[k]);
            setExtractedFields(filled);

            if (data.lease_start_date) {
                const d = parseISO(data.lease_start_date);
                if (isValid(d)) {
                    setLeaseStartDate(d);
                    setStartDateInput(format(d, "MM/dd/yyyy"));
                }
            }
            if (data.lease_end_date) {
                const d = parseISO(data.lease_end_date);
                if (isValid(d)) {
                    setExpiryDate(d);
                    setExpiryInput(format(d, "MM/dd/yyyy"));
                }
            }
            if (data.rent_increase_date) {
                const d = parseISO(data.rent_increase_date);
                if (isValid(d)) {
                    setIncreaseDate(d);
                    setIncreaseInput(format(d, "MM/dd/yyyy"));
                }
            }
            if (json.pdf_url) setPdfUrl(json.pdf_url);
            console.log("✅ Form populated successfully");

        } catch (err: unknown) {
            console.error("❌ Scan failed:", err);
            const errorMessage = err instanceof Error ? err.message : "Unknown error occurred during scan";
            setScanError(errorMessage);
        } finally {
            console.log("🔄 Scan complete, resetting isScanning");
            setIsScanning(false);
        }
    };

    const handleSubmit = async () => {
        if (!user) return;
        setIsSaving(true);

        try {
            // Prepare FormData for the Server Action
            const formData = new FormData();
            formData.append("tenant_name", tenantName);
            formData.append("property_address", propertyAddress);
            if (monthlyRent) formData.append("monthly_rent", monthlyRent.replace(/,/g, ""));
            if (rentIncreaseAmount) formData.append("rent_increase_amount", rentIncreaseAmount.replace(/,/g, ""));

            if (leaseStartDate) formData.append("lease_start_date", startOfDay(leaseStartDate).toISOString().split('T')[0]);
            if (expiryDate) formData.append("lease_end_date", startOfDay(expiryDate).toISOString().split('T')[0]);
            if (increaseDate) formData.append("rent_increase_date", startOfDay(increaseDate).toISOString().split('T')[0]);

            formData.append("reminder_90_days_email", String(reminder90DaysEmail));
            formData.append("reminder_60_days_email", String(reminder60DaysEmail));
            formData.append("reminder_30_days_email", String(reminder30DaysEmail));
            formData.append("reminder_7_days_email", String(reminder7DaysEmail));
            formData.append("reminder_90_days_sms", String(reminder90DaysSMS));
            formData.append("reminder_60_days_sms", String(reminder60DaysSMS));
            formData.append("reminder_30_days_sms", String(reminder30DaysSMS));
            formData.append("reminder_7_days_sms", String(reminder7DaysSMS));

            if (pdfUrl) formData.append("pdf_url", pdfUrl);

            // Import the action dynamically to avoid build issues if mixed
            const { createLease } = await import("@/actions/create-lease");

            const result = await createLease({}, formData);

            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success("Lease secured successfully!");
            router.push("/dashboard");
            router.refresh();
        } catch (err: unknown) {
            console.error("Error saving lease:", err);
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            toast.error(`Failed to save lease: ${errorMessage}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDateInput = (
        val: string,
        setDate: (d: Date | undefined) => void,
        setInput: (s: string) => void
    ) => {
        setInput(val);
        // Try parsing different formats
        const formats = ["MM/dd/yyyy", "MM-dd-yyyy", "yyyy-MM-dd"];
        for (const fmt of formats) {
            const parsed = parse(val, fmt, new Date());
            if (isValid(parsed) && (val.length === 10 || val.length === 8)) {
                setDate(parsed);
                return;
            }
        }
    };

    const limit = 3 + bonusLeases;
    const limitReached = !isPro && leaseCount >= limit;

    if (limitReached) {
        return (
            <div className="bg-white border-2 border-slate-200 shadow-xl space-y-6 max-w-2xl mx-auto my-12" style={{ borderRadius: 'var(--fluid-radius)', padding: 'var(--fluid-p)' }}>
                <div className="mx-auto w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mb-6">
                    <ShieldCheck className="h-10 w-10 text-amber-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Lease Limit Reached</h2>
                <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
                    You&apos;ve reached the <span className="font-bold text-slate-900">{limit}-lease limit</span> of your expanded Free plan.
                    {bonusLeases > 0 && <span className="block text-emerald-600 font-bold text-sm mt-1">(Includes +{bonusLeases} Bonus Slots)</span>}
                    Upgrade to Pro for unlimited properties, SMS alerts, and calendar sync.
                </p>
                <div className="flex flex-col gap-3 pt-4">
                    <Link href="/settings">
                        <Button className="bg-[#1e3a5f] hover:bg-[#2a4a73] text-white px-10 h-16 rounded-2xl font-black text-lg shadow-xl shadow-slate-900/10 flex items-center gap-3 mx-auto transition-transform hover:scale-[1.02]">
                            Upgrade to Pro Today
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="ghost" className="text-slate-500 font-bold">Return to Dashboard</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100">
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Secure Your Revenue</h1>
                    <p className="text-slate-500 mb-6">Enter the lease details manually. RentClock will still calculate the escalations.</p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* LEFT SIDE: PDF UPLOAD */}
                <div className="flex flex-col gap-6 pt-6 pb-32 md:pb-0">

                    <div>
                        <div {...getRootProps()} className={cn(
                            "cursor-pointer border-2 border-dashed flex flex-col items-center justify-center text-center transition-all",
                            isDragActive
                                ? "border-[#1e3a5f] bg-[#1e3a5f]/10 scale-[1.02]"
                                : "border-[#1e3a5f]/20 bg-[#1e3a5f]/5 hover:bg-[#1e3a5f]/10"
                        )} style={{ borderRadius: 'var(--fluid-radius)', padding: 'var(--fluid-p)' }}>
                            <input {...getInputProps()} disabled={isScanning} />
                            <div className={cn(
                                "p-6 rounded-3xl shadow-xl shadow-slate-900/10 transition-transform",
                                isDragActive ? "bg-[#1e3a5f] scale-110" : "bg-[#1e3a5f]"
                            )}>
                                <Upload className="h-10 w-10 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mt-6 tracking-tight">
                                {isDragActive ? "Drop to analyze" : "Drop Lease Agreement here"}
                            </h3>
                            <p className="text-slate-500 mt-2 max-w-[240px]">Accepts PDF or high-quality photos. AI will scan for rent increases and renewal windows.</p>
                            <span className="mt-8 bg-[#1e3a5f] hover:bg-[#2a4a73] text-white px-8 h-12 rounded-xl font-bold inline-flex items-center justify-center">
                                Select File
                            </span>
                        </div>
                    </div>

                    {isScanning && (
                        <div className="bg-white border border-[#1e3a5f]/20 rounded-2xl p-6 shadow-sm flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Loader2 className="h-5 w-5 text-[#1e3a5f] animate-spin" />
                                    <span className="font-bold text-slate-700">Validating Lease Terms...</span>
                                </div>
                                <span className="text-[#1e3a5f] font-extrabold">AI</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#1e3a5f] w-full animate-pulse transition-all duration-500"></div>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium italic">RentClock is finding the dates for your final approval. This prevents revenue leakage.</p>
                        </div>
                    )}

                    {scanError && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm flex flex-col gap-2">
                            <div className="flex items-center gap-3 text-red-600">
                                <AlertCircle className="h-5 w-5" />
                                <span className="font-bold">Scan Error</span>
                            </div>
                            <p className="text-sm text-red-500">{scanError}</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setScanError(null)}
                                className="mt-2 w-fit border-red-200 text-red-600 hover:bg-red-100"
                            >
                                Dismiss
                            </Button>
                        </div>
                    )}
                </div>

                {/* RIGHT SIDE: FORM DETAILS */}
                <Card className="border-slate-200 shadow-sm overflow-hidden" style={{ borderRadius: 'var(--fluid-radius)' }}>
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6">
                        <CardTitle className="flex items-center gap-2 text-slate-800">
                            <FileText className="h-5 w-5 text-[#1e3a5f]" />
                            Lease Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8" style={{ padding: 'var(--fluid-p)' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Tenant Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Sarah Jenkins"
                                        className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-[#1e3a5f]"
                                        value={tenantName}
                                        onChange={(e) => {
                                            setTenantName(e.target.value);
                                            setExtractedFields(prev => prev.filter(f => f !== "tenant_name"));
                                        }}
                                    />
                                    <Sparkle field="tenant_name" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Current Monthly Rent</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="2,450.00"
                                        className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-[#1e3a5f]"
                                        value={monthlyRent}
                                        onChange={(e) => {
                                            setMonthlyRent(e.target.value);
                                            setExtractedFields(prev => prev.filter(f => f !== "monthly_rent"));
                                        }}
                                    />
                                    <Sparkle field="monthly_rent" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Property Address</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="1242 Magnolia Dr, Austin, TX 78701"
                                        className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-[#1e3a5f]"
                                        value={propertyAddress}
                                        onChange={(e) => {
                                            setPropertyAddress(e.target.value);
                                            setExtractedFields(prev => prev.filter(f => f !== "property_address"));
                                        }}
                                    />
                                    <Sparkle field="property_address" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Expected Rent Increase ($)</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="150.00"
                                        className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-[#1e3a5f]"
                                        value={rentIncreaseAmount}
                                        onChange={(e) => {
                                            setRentIncreaseAmount(e.target.value);
                                            setExtractedFields(prev => prev.filter(f => f !== "rent_increase_amount"));
                                        }}
                                    />
                                    <Sparkle field="rent_increase_amount" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Lease Start Date (Optional)</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="MM/DD/YYYY"
                                        value={startDateInput}
                                        onChange={(e) => handleDateInput(e.target.value, setLeaseStartDate, setStartDateInput)}
                                        className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#1e3a5f] pr-12"
                                    />
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-[#1e3a5f]"
                                            >
                                                <CalendarIcon className="h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 rounded-2xl border-slate-200" align="end">
                                            <Calendar
                                                mode="single"
                                                selected={leaseStartDate}
                                                onSelect={(d) => {
                                                    setLeaseStartDate(d);
                                                    if (d) setStartDateInput(format(d, "MM/dd/yyyy"));
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Lease Expiry Date</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="MM/DD/YYYY"
                                        value={expiryInput}
                                        onChange={(e) => handleDateInput(e.target.value, setExpiryDate, setExpiryInput)}
                                        className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#1e3a5f] pr-12"
                                    />
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-[#1e3a5f]"
                                            >
                                                <CalendarIcon className="h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 rounded-2xl border-slate-200" align="end">
                                            <Calendar
                                                mode="single"
                                                selected={expiryDate}
                                                onSelect={(d) => {
                                                    setExpiryDate(d);
                                                    if (d) setExpiryInput(format(d, "MM/dd/yyyy"));
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Rent Increase Date</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="MM/DD/YYYY"
                                        value={increaseInput}
                                        onChange={(e) => handleDateInput(e.target.value, setIncreaseDate, setIncreaseInput)}
                                        className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#1e3a5f] pr-12"
                                    />
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-[#1e3a5f]"
                                            >
                                                <CalendarIcon className="h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 rounded-2xl border-slate-200" align="end">
                                            <Calendar
                                                mode="single"
                                                selected={increaseDate}
                                                onSelect={(d) => {
                                                    setIncreaseDate(d);
                                                    if (d) setIncreaseInput(format(d, "MM/dd/yyyy"));
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1e3a5f]/10 rounded-2xl p-6 border border-[#1e3a5f]/20 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#1e3a5f] p-2 rounded-xl shadow-lg shadow-slate-900/10">
                                        <Bell className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 leading-none">Critical Date Reminders</h4>
                                        <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">Never miss a renewal window again</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* 90-Day Alerts */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between bg-white/50 p-4 rounded-xl border border-[#1e3a5f]/10">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[#1e3a5f]/10 p-1.5 rounded-lg">
                                                <Mail className="h-4 w-4 text-[#1e3a5f]" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">90-day Email</span>
                                        </div>
                                        <Switch
                                            checked={reminder90DaysEmail}
                                            onCheckedChange={setReminder90DaysEmail}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between bg-white/50 p-4 rounded-xl border border-[#1e3a5f]/10 relative group">
                                        {!isPro && (
                                            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href="/settings">
                                                    <Badge className="bg-[#d4a853] text-[#1e3a5f] font-black text-[8px] cursor-pointer hover:scale-105 transition-transform">PRO FEATURE</Badge>
                                                </Link>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[#1e3a5f]/10 p-1.5 rounded-lg">
                                                <MessageSquare className="h-4 w-4 text-[#1e3a5f]" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">90-day SMS</span>
                                        </div>
                                        <Switch
                                            checked={reminder90DaysSMS}
                                            onCheckedChange={(val) => handleSmsToggle(90, val)}
                                            disabled={!isPro}
                                        />
                                    </div>
                                </div>

                                {/* 60-Day Alerts */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between bg-white/50 p-4 rounded-xl border border-[#1e3a5f]/10">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[#1e3a5f]/10 p-1.5 rounded-lg">
                                                <Mail className="h-4 w-4 text-[#1e3a5f]" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">60-day Email</span>
                                        </div>
                                        <Switch
                                            checked={reminder60DaysEmail}
                                            onCheckedChange={setReminder60DaysEmail}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between bg-white/50 p-4 rounded-xl border border-[#1e3a5f]/10 relative group">
                                        {!isPro && (
                                            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href="/settings">
                                                    <Badge className="bg-[#d4a853] text-[#1e3a5f] font-black text-[8px] cursor-pointer hover:scale-105 transition-transform">PRO FEATURE</Badge>
                                                </Link>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[#1e3a5f]/10 p-1.5 rounded-lg">
                                                <MessageSquare className="h-4 w-4 text-[#1e3a5f]" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">60-day SMS</span>
                                        </div>
                                        <Switch
                                            checked={reminder60DaysSMS}
                                            onCheckedChange={(val) => handleSmsToggle(60, val)}
                                            disabled={!isPro}
                                        />
                                    </div>
                                </div>

                                {/* 30-Day Alerts */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between bg-white/50 p-4 rounded-xl border border-[#1e3a5f]/10">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[#1e3a5f]/10 p-1.5 rounded-lg">
                                                <Mail className="h-4 w-4 text-[#1e3a5f]" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">30-day Email</span>
                                        </div>
                                        <Switch
                                            checked={reminder30DaysEmail}
                                            onCheckedChange={setReminder30DaysEmail}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between bg-white/50 p-4 rounded-xl border border-[#1e3a5f]/10 relative group">
                                        {!isPro && (
                                            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href="/settings">
                                                    <Badge className="bg-[#d4a853] text-[#1e3a5f] font-black text-[8px] cursor-pointer hover:scale-105 transition-transform">PRO FEATURE</Badge>
                                                </Link>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[#1e3a5f]/10 p-1.5 rounded-lg">
                                                <MessageSquare className="h-4 w-4 text-[#1e3a5f]" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">30-day SMS</span>
                                        </div>
                                        <Switch
                                            checked={reminder30DaysSMS}
                                            onCheckedChange={(val) => handleSmsToggle(30, val)}
                                            disabled={!isPro}
                                        />
                                    </div>
                                </div>

                                {/* 7-Day Alerts */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between bg-white/50 p-4 rounded-xl border border-[#1e3a5f]/10">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[#1e3a5f]/10 p-1.5 rounded-lg">
                                                <Mail className="h-4 w-4 text-[#1e3a5f]" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700 leading-none">7-day</span>
                                                <span className="text-sm font-bold text-slate-700 leading-none">Email</span>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={reminder7DaysEmail}
                                            onCheckedChange={setReminder7DaysEmail}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between bg-white/50 p-4 rounded-xl border border-[#1e3a5f]/10 relative group">
                                        {!isPro && (
                                            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href="/settings">
                                                    <Badge className="bg-[#d4a853] text-[#1e3a5f] font-black text-[8px] cursor-pointer hover:scale-105 transition-transform">PRO FEATURE</Badge>
                                                </Link>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[#1e3a5f]/10 p-1.5 rounded-lg">
                                                <MessageSquare className="h-4 w-4 text-[#1e3a5f]" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700 leading-none">7-day</span>
                                                <span className="text-sm font-bold text-slate-700 leading-none">SMS</span>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={reminder7DaysSMS}
                                            onCheckedChange={(val) => handleSmsToggle(7, val)}
                                            disabled={!isPro}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RENT SCHEDULE PREVIEW */}
                        {rentSchedule.length > 0 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Detected Rent Steps</Label>
                                    <div className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">AI Lifecycle View</div>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-inner">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="bg-slate-100/50 border-b border-slate-200">
                                                <th className="px-4 py-3 font-black text-slate-400 uppercase tracking-widest">Effective Date</th>
                                                <th className="px-4 py-3 font-black text-slate-400 uppercase tracking-widest">New Monthly Rent</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {rentSchedule.map((step, idx) => (
                                                <tr key={idx} className="group hover:bg-white transition-colors">
                                                    <td className="px-4 py-3 font-bold text-slate-600">{step.date}</td>
                                                    <td className="px-4 py-3 font-black text-[#1e3a5f]">${step.amount.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <Button
                            className="w-full bg-[#1e3a5f] hover:bg-[#2a4a73] text-white h-16 rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] disabled:opacity-50"
                            onClick={handleSubmit}
                            disabled={isSaving || !tenantName || !propertyAddress}
                        >
                            {isSaving ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <Clock className="h-6 w-6" />
                            )}
                            {isSaving ? "Securing Lease..." : "Save & Activate Alarm"}
                        </Button>
                        <p className="text-center text-[10px] text-slate-400 font-medium italic">By saving, you agree to our lease storage and reminder terms.</p>
                    </CardContent>
                </Card>
            </div>


            <ConnectPhoneDialog
                open={connectPhoneOpen}
                onOpenChange={setConnectPhoneOpen}
                onSuccess={handlePhoneConnected}
            />
        </div >
    );
}

