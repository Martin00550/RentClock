import { Lease } from "./types";
import { format, addDays } from "date-fns";
import { formatCurrency } from "./lease-utils";

export function generateRentIncreaseNotice(lease: Lease): string {
    const today = new Date();
    const effectiveDate = lease.rent_increase_date
        ? format(new Date(lease.rent_increase_date), "MMMM d, yyyy")
        : "[DATE]";

    const currentRent = formatCurrency(lease.monthly_rent);
    const increaseAmount = lease.rent_increase_amount
        ? formatCurrency(lease.rent_increase_amount)
        : "[AMOUNT]";
    const newRent = lease.rent_increase_amount
        ? formatCurrency(lease.monthly_rent + lease.rent_increase_amount)
        : "[NEW TOTAL]";

    return `
DATE: ${format(today, "MMMM d, yyyy")}

VIA CERTIFIED MAIL & EMAIL

TO: ${lease.tenant_name}
RE: Notice of Rent Increase - ${lease.property_address}

Dear ${lease.tenant_name},

This letter serves as formal notice regarding your lease agreement for the property located at ${lease.property_address}.

Per the terms of your lease agreement, your monthly rent will be adjusted as follows:

Current Monthly Rent: ${currentRent}
Rent Increase Amount: ${increaseAmount}
-----------------------------------
New Monthly Rent: ${newRent}

This change will take effect on ${effectiveDate}. All other terms and conditions of your original lease agreement remain in full force and effect.

Please update your records and payment settings accordingly. We appreciate your continued tenancy.

Sincerely,

[Your Name/Property Management]
RentClock Protected Portfolio
`.trim();
}

export function generateRenewalReminder(lease: Lease): string {
    const expiryDate = lease.lease_end_date
        ? format(new Date(lease.lease_end_date), "MMMM d, yyyy")
        : "[EXPIRY DATE]";

    return `
DATE: ${format(new Date(), "MMMM d, yyyy")}

TO: ${lease.tenant_name}
RE: Upcoming Lease Expiration - ${lease.property_address}

Dear ${lease.tenant_name},

We are writing to remind you that your lease for the property at ${lease.property_address} is scheduled to expire on ${expiryDate}.

We value you as a tenant and would like to discuss renewal options for the upcoming term. Please contact our office by [RESPONSE DATE] to confirm your intent to renew or to discuss new terms.

If we do not hear from you by this date, we will begin the process of listing the property for the next term.

We look forward to hearing from you.

Sincerely,

[Your Name/Property Management]
RentClock Protected Portfolio
`.trim();
}
