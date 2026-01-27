"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, Download, ExternalLink } from "lucide-react";
import { generateGoogleCalendarUrl, downloadIcsFile } from "@/lib/calendar-utils";

interface CalendarEvent {
    title: string;
    description?: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
}

interface AddToCalendarProps {
    event: CalendarEvent;
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
}

export function AddToCalendar({ event, variant = "outline", size = "sm", className }: AddToCalendarProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={variant} size={size} className={className}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Add to Calendar
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-2 rounded-xl flex flex-col gap-1">
                <Button
                    variant="ghost"
                    className="justify-start font-medium text-slate-700 h-10 hover:bg-[#1e3a5f]/5 hover:text-[#1e3a5f]"
                    onClick={() => {
                        window.open(generateGoogleCalendarUrl(event), "_blank");
                        setOpen(false);
                    }}
                >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Google Calendar
                </Button>
                <Button
                    variant="ghost"
                    className="justify-start font-medium text-slate-700 h-10 hover:bg-[#1e3a5f]/5 hover:text-[#1e3a5f]"
                    onClick={() => {
                        downloadIcsFile(event);
                        setOpen(false);
                    }}
                >
                    <Download className="h-4 w-4 mr-2" />
                    Outlook / iCal (.ics)
                </Button>
            </PopoverContent>
        </Popover>
    );
}
