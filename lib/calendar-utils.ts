import { format } from "date-fns";

interface CalendarEvent {
    title: string;
    description?: string;
    location?: string;
    startDate: Date;
    endDate?: Date; // Defaults to 1 hour after start if not provided
}

export function generateGoogleCalendarUrl(event: CalendarEvent): string {
    const start = format(event.startDate, "yyyyMMdd'T'HHmmss");
    const end = event.endDate
        ? format(event.endDate, "yyyyMMdd'T'HHmmss")
        : format(new Date(event.startDate.getTime() + 60 * 60 * 1000), "yyyyMMdd'T'HHmmss"); // Default 1 hour duration

    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: event.title,
        dates: `${start}/${end}`,
        details: event.description || "",
        location: event.location || "",
    });

    return `https://www.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile(event: CalendarEvent) {
    if (typeof window === "undefined" || typeof document === "undefined") {
        return;
    }

    const start = format(event.startDate, "yyyyMMdd'T'HHmmss");
    const end = event.endDate
        ? format(event.endDate, "yyyyMMdd'T'HHmmss")
        : format(new Date(event.startDate.getTime() + 60 * 60 * 1000), "yyyyMMdd'T'HHmmss");

    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//RentClock//Lease Reminder//EN",
        "BEGIN:VEVENT",
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description || ""}`,
        `LOCATION:${event.location || ""}`,
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${event.title.replace(/\s+/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
