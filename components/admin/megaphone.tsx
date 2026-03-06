"use client";

import { useEffect, useState } from "react";
import { getBroadcastMessage, updateBroadcastMessage } from "@/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Megaphone, Save, Power, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function AdminMegaphone() {
    const [message, setMessage] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        getBroadcastMessage().then(res => {
            if (res.message !== undefined) {
                setMessage(res.message);
                setIsActive(res.isActive);
            }
        }).catch(err => {
            console.error("Failed to load broadcast message:", err);
        });
    }, []);

    const handleSave = async () => {
        setLoading(true);
        setSaved(false);
        const res = await updateBroadcastMessage(message, isActive);
        setLoading(false);
        if (res.success) {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    return (
        <Card className="shadow-md border-indigo-100 bg-linear-to-b from-indigo-50 to-white">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2 text-indigo-900">
                    <Megaphone className="h-5 w-5" /> The Megaphone
                </CardTitle>
                <CardDescription>Broadcast a global system alert to all users.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">Validation Message</Label>
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g. System maintenance at 2am..."
                        className="bg-white"
                    />
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-indigo-100">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isActive ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                            <Power className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-slate-900">Broadcast Status</p>
                            <p className="text-xs text-slate-500">{isActive ? "Live on Dashboard" : "Disabled"}</p>
                        </div>
                    </div>
                    <Switch checked={isActive} onCheckedChange={setIsActive} />
                </div>

                <Button onClick={handleSave} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold">
                    {loading ? "Syncing..." : saved ? <><Check className="h-4 w-4 mr-2" /> Pubslished</> : <><Save className="h-4 w-4 mr-2" /> Update Broadcast</>}
                </Button>
            </CardContent>
        </Card>
    );
}
