"use server";

import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { addDays, startOfDay } from "date-fns";

export async function seedTestLease() {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Not authenticated" };

    const today = new Date();
    const expiryDate = addDays(today, 7); // 7 days from now (Urgent trigger)

    if (!supabase) return { success: false, error: "Database not available" };

    const { data, error } = await supabase.from("leases").insert({
        user_id: userId,
        tenant_name: "Test Tenant (AI Scan Demo)",
        property_address: "123 Test St, Tech City, TC 90210",
        monthly_rent: 5000,
        lease_end_date: startOfDay(expiryDate).toISOString(),
        lease_start_date: startOfDay(today).toISOString(),
        notice_period_days: 60,
        reminder_60_days_email: true,
        reminder_30_days_email: true,
        reminder_60_days_sms: true, // Enable SMS for testing
        reminder_30_days_sms: true
    }).select().single();

    if (error) {
        console.error("Seed error:", error);
        return { success: false, error: error.message };
    }

    return { success: true, lease: data };
}
