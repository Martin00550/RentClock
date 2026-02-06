"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit3, Loader2, DollarSign, MapPin, User, Save, Bell, Mail, MessageSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Lease } from "@/lib/types";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useTutorial } from "@/components/tutorial/tutorial-provider";
import { ConnectPhoneDialog } from "@/components/settings/connect-phone-dialog";

interface EditTenantDialogProps {
    lease: Lease;
    isPro?: boolean;
}

export function EditTenantDialog({ lease, isPro = false }: EditTenantDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const { hasPhone } = useTutorial();
    const [connectPhoneOpen, setConnectPhoneOpen] = useState(false);
    const [pendingSmsToggle, setPendingSmsToggle] = useState<{ days: number, val: boolean } | null>(null);

    const [tenantName, setTenantName] = useState(lease.tenant_name);
    const [propertyAddress, setPropertyAddress] = useState(lease.property_address || "");
    const [monthlyRent, setMonthlyRent] = useState(lease.monthly_rent?.toString() || "");
    const [rentIncreaseAmount, setRentIncreaseAmount] = useState(lease.rent_increase_amount?.toString() || "");

    // Alert State
    const [reminder90DaysEmail, setReminder90DaysEmail] = useState(lease.reminder_90_days_email ?? true);
    const [reminder60DaysEmail, setReminder60DaysEmail] = useState(lease.reminder_60_days_email ?? true);
    const [reminder30DaysEmail, setReminder30DaysEmail] = useState(lease.reminder_30_days_email ?? true);
    const [reminder7DaysEmail, setReminder7DaysEmail] = useState(lease.reminder_7_days_email ?? true);
    const [reminder90DaysSMS, setReminder90DaysSMS] = useState(lease.reminder_90_days_sms ?? false);
    const [reminder60DaysSMS, setReminder60DaysSMS] = useState(lease.reminder_60_days_sms ?? false);
    const [reminder30DaysSMS, setReminder30DaysSMS] = useState(lease.reminder_30_days_sms ?? false);
    const [reminder7DaysSMS, setReminder7DaysSMS] = useState(lease.reminder_7_days_sms ?? false);

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

    const handleSave = async () => {
        setIsLoading(true);

        try {
            const rentValue = monthlyRent ? parseFloat(monthlyRent.replace(/,/g, "")) : null;
            const increaseValue = rentIncreaseAmount ? parseFloat(rentIncreaseAmount.replace(/,/g, "")) : null;

            const { error } = await supabase
                .from("leases")
                .update({
                    tenant_name: tenantName,
                    property_address: propertyAddress,
                    monthly_rent: isNaN(rentValue as number) ? null : rentValue,
                    rent_increase_amount: isNaN(increaseValue as number) ? null : increaseValue,
                    reminder_90_days_email: reminder90DaysEmail,
                    reminder_60_days_email: reminder60DaysEmail,
                    reminder_30_days_email: reminder30DaysEmail,
                    reminder_7_days_email: reminder7DaysEmail,
                    reminder_90_days_sms: reminder90DaysSMS,
                    reminder_60_days_sms: reminder60DaysSMS,
                    reminder_30_days_sms: reminder30DaysSMS,
                    reminder_7_days_sms: reminder7DaysSMS,
                })
                .eq("id", lease.id);

            if (error) throw error;

            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Error updating lease:", error);
            alert("Failed to update tenant profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-white border-2 border-slate-100 text-slate-700 h-11 px-6 rounded-2xl font-bold flex items-center gap-2 hover:border-[#1e3a5f]/20 hover:text-[#1e3a5f] hover:bg-slate-50 transition-all shadow-sm">
                    <Edit3 className="h-4 w-4" />
                    Edit Tenant Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl border-slate-200 sm:max-w-md">
                <DialogHeader className="border-b border-slate-100 pb-4">
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
                        <Edit3 className="h-5 w-5 text-[#1e3a5f]" />
                        Edit Tenant Profile
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tenant Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    value={tenantName}
                                    onChange={(e) => setTenantName(e.target.value)}
                                    className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-[#1e3a5f]"
                                    placeholder="Tenant Name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Property Address</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    value={propertyAddress}
                                    onChange={(e) => setPropertyAddress(e.target.value)}
                                    className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-[#1e3a5f]"
                                    placeholder="Full Address"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Rent</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        value={monthlyRent}
                                        onChange={(e) => setMonthlyRent(e.target.value)}
                                        className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-[#1e3a5f]"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Exp. Increase</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        value={rentIncreaseAmount}
                                        onChange={(e) => setRentIncreaseAmount(e.target.value)}
                                        className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-[#1e3a5f]"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex flex-col gap-4">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Bell className="h-3 w-3" />
                                Alarms (Email / SMS)
                            </Label>

                            <div className="max-h-48 overflow-y-auto pr-2 space-y-3">
                                {[90, 60, 30, 7].map((days) => (
                                    <div key={days} className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{days} Day Notification</span>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 opacity-60">
                                                    <Mail className="h-3 w-3" />
                                                    <span className="text-[10px] font-bold">Email</span>
                                                    <Switch
                                                        checked={days === 90 ? reminder90DaysEmail : days === 60 ? reminder60DaysEmail : days === 30 ? reminder30DaysEmail : reminder7DaysEmail}
                                                        onCheckedChange={days === 90 ? setReminder90DaysEmail : days === 60 ? setReminder60DaysEmail : days === 30 ? setReminder30DaysEmail : setReminder7DaysEmail}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-1.5 relative group">
                                                    {!isPro && (
                                                        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Link href="/settings">
                                                                <Badge className="bg-[#d4a853] text-[#1e3a5f] font-black text-[8px] cursor-pointer hover:scale-105 transition-transform">PRO</Badge>
                                                            </Link>
                                                        </div>
                                                    )}
                                                    <MessageSquare className="h-3 w-3" />
                                                    <span className="text-[10px] font-bold">SMS</span>
                                                    <Switch
                                                        checked={days === 90 ? reminder90DaysSMS : days === 60 ? reminder60DaysSMS : days === 30 ? reminder30DaysSMS : reminder7DaysSMS}
                                                        onCheckedChange={(val) => handleSmsToggle(days, val)}
                                                        disabled={!isPro}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 rounded-xl font-bold bg-[#1e3a5f] hover:bg-[#2a4a73] text-white shadow-lg shadow-slate-900/10"
                            onClick={handleSave}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            Save Changes
                        </Button>
                    </div>
                </div>
                <ConnectPhoneDialog
                    open={connectPhoneOpen}
                    onOpenChange={setConnectPhoneOpen}
                    onSuccess={handlePhoneConnected}
                />
            </DialogContent>
        </Dialog>
    );
}
