import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createEvents, EventAttributes } from "ics";
import { parseISO, subDays } from "date-fns";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
        return new NextResponse("Token is required", { status: 400 });
    }

    // 1. Verify Token & Get User
    if (!supabaseAdmin) {
        return new NextResponse("Database connection not available", { status: 500 });
    }

    const { data: user, error: userError } = await supabaseAdmin
        .from("users")
        .select("id, is_pro")
        .eq("calendar_token", token)
        .single();

    if (userError || !user) {
        return new NextResponse("Calendar feed not found", { status: 404 });
    }

    if (!user.is_pro) {
        const upgradeCal = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//RentClock//NONSGML v1.0//EN\nX-WR-CALNAME:RentClock (UPGRADE REQUIRED)\nBEGIN:VEVENT\nSUMMARY:Upgrade to RentClock Pro\nDESCRIPTION:Your calendar sync has been paused. Upgrade to Pro at rentclock.com/settings to resume sync.\nDTSTART:20240101T120000Z\nDURATION:PT1H\nEND:VEVENT\nEND:VCALENDAR";
        return new NextResponse(upgradeCal, {
            headers: {
                "Content-Type": "text/calendar",
                "Content-Disposition": 'attachment; filename="upgrade-pro.ics"',
            },
        });
    }

    // 2. Fetch leases for this user
    const { data: leases, error } = await supabaseAdmin
        .from("leases")
        .select("*")
        .eq("user_id", user.id);

    if (error) {
        console.error("Calendar feed error:", error);
        return new NextResponse("Error fetching leases", { status: 500 });
    }

    const events: EventAttributes[] = [];

    leases.forEach((lease) => {
        const tenantName = lease.tenant_name || "Unknown Tenant";
        const address = lease.property_address || "";

        // 1. Lease Expiration Event
        if (lease.lease_end_date) {
            const end = parseISO(lease.lease_end_date);
            events.push({
                start: [end.getFullYear(), end.getMonth() + 1, end.getDate()],
                duration: { days: 1 },
                title: `EXPIRATION: ${tenantName}`,
                description: `Lease expires for ${tenantName} at ${address}`,
                location: address,
                categories: ['Lease Expiration'],
                status: 'CONFIRMED',
                busyStatus: 'FREE'
            });

            // 2. Renewal Notice Deadline (End Date - Notice Period)
            const noticeDays = lease.notice_period_days || 90;
            const noticeDate = subDays(end, noticeDays);
            events.push({
                start: [noticeDate.getFullYear(), noticeDate.getMonth() + 1, noticeDate.getDate()],
                duration: { days: 1 },
                title: `NOTICE DEADLINE: ${tenantName}`,
                description: `${noticeDays} day notice period ends today for ${tenantName}. Must notify if renewing or vacating.`,
                location: address,
                categories: ['Deadline'],
                status: 'CONFIRMED',
                busyStatus: 'BUSY'
            });
        }

        // 3. Rent Increase Event
        if (lease.rent_increase_date) {
            const incDate = parseISO(lease.rent_increase_date);
            const incAmount = lease.rent_increase_amount ? `$${lease.rent_increase_amount}` : "scheduled amount";
            events.push({
                start: [incDate.getFullYear(), incDate.getMonth() + 1, incDate.getDate()],
                duration: { days: 1 },
                title: `RENT INCREASE: ${tenantName}`,
                description: `Rent increases by ${incAmount} today for ${tenantName}.`,
                location: address,
                categories: ['Rent Increase'],
                status: 'CONFIRMED',
                busyStatus: 'FREE'
            });
        }
    });

    if (events.length === 0) {
        // Return an empty but valid calendar if no events
        const emptyCal = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//RentClock//NONSGML v1.0//EN\nX-WR-CALNAME:RentClock Leases\nEND:VCALENDAR";
        return new NextResponse(emptyCal, {
            headers: {
                "Content-Type": "text/calendar",
                "Content-Disposition": 'attachment; filename="rentclock.ics"',
            },
        });
    }

    const { error: icsError, value } = createEvents(events);

    if (icsError) {
        console.error("ICS Generation Error:", icsError);
        return new NextResponse("Error generating calendar", { status: 500 });
    }

    return new NextResponse(value, {
        headers: {
            "Content-Type": "text/calendar",
            "Content-Disposition": 'attachment; filename="rentclock.ics"',
        },
    });
}
