import { z } from "zod";

export const LeaseSchema = z.object({
    tenant_name: z.string().min(1, "Tenant name is required"),
    tenant_email: z.string().email("Invalid email address").optional().or(z.literal("")),
    tenant_phone: z.string().optional().or(z.literal("")),
    property_name: z.string().optional().or(z.literal("")),
    property_address: z.string().min(5, "Property address is required"),
    state: z.string().length(2, "State code must be 2 letters").optional().or(z.literal("")),
    monthly_rent: z.preprocess((val) => {
        if (typeof val === "string") {
            const parsed = parseFloat(val.replace(/,/g, "").replace(/\$/g, ""));
            return isNaN(parsed) ? null : parsed;
        }
        return val;
    }, z.number({ message: "Please enter a valid amount" }).min(0, "Rent must be a positive number")),
    rent_increase_amount: z.preprocess((val) => {
        if (typeof val === "string") {
            const parsed = parseFloat(val.replace(/,/g, "").replace(/\$/g, ""));
            return isNaN(parsed) ? null : parsed;
        }
        return val;
    }, z.number({ message: "Please enter a valid amount" }).nullable().optional()),
    lease_start_date: z.string().nullable().optional(), // We'll sanitize dates further if needed
    lease_end_date: z.string().nullable().optional(),
    rent_increase_date: z.string().nullable().optional(),
    notice_period_days: z.number().int().default(60),
    reminder_90_days_email: z.boolean().default(true),
    reminder_60_days_email: z.boolean().default(true),
    reminder_30_days_email: z.boolean().default(true),
    reminder_7_days_email: z.boolean().default(true),
    reminder_90_days_sms: z.boolean().default(false),
    reminder_60_days_sms: z.boolean().default(false),
    reminder_30_days_sms: z.boolean().default(false),
    reminder_7_days_sms: z.boolean().default(false),
    last_expiry_alert_sent: z.number().int().default(1000),
    last_increase_alert_sent: z.number().int().default(1000),
    pdf_url: z.string().nullable().optional(),
});

export type LeaseInput = z.infer<typeof LeaseSchema>;
