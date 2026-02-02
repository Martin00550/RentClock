export interface Lease {
    id: string;
    user_id: string;
    tenant_name: string;
    property_address: string;
    monthly_rent: number;
    lease_end_date: string;
    rent_increase_date: string;
    rent_increase_amount: number | null;
    notice_period_days: number;
    lease_start_date: string | null;
    pdf_url: string | null;
    created_at: string;
    reminder_60_days_email?: boolean;
    reminder_30_days_email?: boolean;
    reminder_7_days_email?: boolean;
    reminder_90_days_email?: boolean;
    reminder_60_days_sms?: boolean;
    reminder_30_days_sms?: boolean;
    reminder_7_days_sms?: boolean;
    reminder_90_days_sms?: boolean;
    status: "active" | "warning" | "urgent"; // Calculated field, not in DB ideally but useful for UI
}

export type LeaseInsert = Omit<Lease, "id" | "created_at" | "status">;
export type LeaseUpdate = Partial<LeaseInsert>;

export interface UserProfile {
    id: string;
    email: string;
    phone?: string;
    is_pro: boolean;
    has_onboarded: boolean;
    calendar_token?: string;
    created_at: string;
    bonus_leases?: number;
    referral_code?: string;
    referred_by?: string;
}

export interface ScanLog {
    id: string;
    user_id: string;
    file_name: string;
    status: 'success' | 'failed';
    duration_ms: number;
    error_message?: string;
    created_at: string;
}

export interface SystemSetting {
    key: string;
    value: string;
    is_active: boolean;
}

export interface ReferralLog {
    id: string;
    email: string;
    referred_by: string;
    created_at: string;
}
