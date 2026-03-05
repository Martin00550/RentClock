// State-specific notice requirements for commercial leases
// These are minimum requirements - landlords should always verify with local counsel

export interface StateNoticeRequirement {
    state: string;
    stateCode: string;
    commercialNoticeDays: number;
    residentialNoticeDays: number | null; // null if not applicable or same as commercial
    specialRequirements?: string;
    source: string;
}

export const STATE_NOTICE_REQUIREMENTS: StateNoticeRequirement[] = [
    {
        state: "Alabama",
        stateCode: "AL",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Alabama Code § 35-9A-441"
    },
    {
        state: "Alaska",
        stateCode: "AK",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Alaska Stat. § 34.03.290"
    },
    {
        state: "Arizona",
        stateCode: "AZ",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Ariz. Rev. Stat. Ann. § 33-1375"
    },
    {
        state: "Arkansas",
        stateCode: "AR",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Ark. Code Ann. § 18-16-905"
    },
    {
        state: "California",
        stateCode: "CA",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        specialRequirements: "60 days required for tenants occupying premises for more than 1 year",
        source: "Cal. Civ. Code § 1946"
    },
    {
        state: "Colorado",
        stateCode: "CO",
        commercialNoticeDays: 21,
        residentialNoticeDays: 21,
        source: "Colo. Rev. Stat. § 13-40-107"
    },
    {
        state: "Connecticut",
        stateCode: "CT",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Conn. Gen. Stat. Ann. § 47a-23"
    },
    {
        state: "Delaware",
        stateCode: "DE",
        commercialNoticeDays: 60,
        residentialNoticeDays: 60,
        source: "Del. Code Ann. tit. 25, § 5106"
    },
    {
        state: "Florida",
        stateCode: "FL",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Fla. Stat. Ann. § 83.57"
    },
    {
        state: "Georgia",
        stateCode: "GA",
        commercialNoticeDays: 60,
        residentialNoticeDays: 60,
        source: "Ga. Code Ann. § 44-7-7"
    },
    {
        state: "Hawaii",
        stateCode: "HI",
        commercialNoticeDays: 45,
        residentialNoticeDays: 45,
        source: "Haw. Rev. Stat. § 521-71"
    },
    {
        state: "Idaho",
        stateCode: "ID",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Idaho Code § 55-208"
    },
    {
        state: "Illinois",
        stateCode: "IL",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "735 Ill. Comp. Stat. 5/9-207"
    },
    {
        state: "Indiana",
        stateCode: "IN",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Ind. Code Ann. § 32-31-1-1"
    },
    {
        state: "Iowa",
        stateCode: "IA",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Iowa Code Ann. § 562A.34"
    },
    {
        state: "Kansas",
        stateCode: "KS",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Kan. Stat. Ann. § 58-2570"
    },
    {
        state: "Kentucky",
        stateCode: "KY",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Ky. Rev. Stat. Ann. § 383.695"
    },
    {
        state: "Louisiana",
        stateCode: "LA",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "La. Civ. Code Ann. art. 2728"
    },
    {
        state: "Maine",
        stateCode: "ME",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Me. Rev. Stat. Ann. tit. 14, § 6002"
    },
    {
        state: "Maryland",
        stateCode: "MD",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Md. Code Ann., Real Prop. § 8-402"
    },
    {
        state: "Massachusetts",
        stateCode: "MA",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Mass. Ann. Laws ch. 186, § 12"
    },
    {
        state: "Michigan",
        stateCode: "MI",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Mich. Comp. Laws § 554.134"
    },
    {
        state: "Minnesota",
        stateCode: "MN",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Minn. Stat. Ann. § 504B.135"
    },
    {
        state: "Mississippi",
        stateCode: "MS",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Miss. Code Ann. § 89-8-19"
    },
    {
        state: "Missouri",
        stateCode: "MO",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Mo. Rev. Stat. § 441.060"
    },
    {
        state: "Montana",
        stateCode: "MT",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Mont. Code Ann. § 70-24-441"
    },
    {
        state: "Nebraska",
        stateCode: "NE",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Neb. Rev. Stat. Ann. § 76-1437"
    },
    {
        state: "Nevada",
        stateCode: "NV",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Nev. Rev. Stat. Ann. § 40.251"
    },
    {
        state: "New Hampshire",
        stateCode: "NH",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "N.H. Rev. Stat. Ann. § 540:2"
    },
    {
        state: "New Jersey",
        stateCode: "NJ",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "N.J. Stat. Ann. § 2A:18-56"
    },
    {
        state: "New Mexico",
        stateCode: "NM",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "N.M. Stat. Ann. § 47-8-37"
    },
    {
        state: "New York",
        stateCode: "NY",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        specialRequirements: "Commercial tenancies may have different requirements based on lease terms",
        source: "N.Y. Real Prop. Law § 228-c"
    },
    {
        state: "North Carolina",
        stateCode: "NC",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "N.C. Gen. Stat. § 42-14"
    },
    {
        state: "North Dakota",
        stateCode: "ND",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "N.D. Cent. Code § 47-16-15"
    },
    {
        state: "Ohio",
        stateCode: "OH",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Ohio Rev. Code Ann. § 5321.17"
    },
    {
        state: "Oklahoma",
        stateCode: "OK",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Okla. Stat. Ann. tit. 41, § 111"
    },
    {
        state: "Oregon",
        stateCode: "OR",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Or. Rev. Stat. Ann. § 91.070"
    },
    {
        state: "Pennsylvania",
        stateCode: "PA",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "68 Pa. Cons. Stat. Ann. § 250.501"
    },
    {
        state: "Rhode Island",
        stateCode: "RI",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "R.I. Gen. Laws § 34-18-37"
    },
    {
        state: "South Carolina",
        stateCode: "SC",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "S.C. Code Ann. § 27-40-770"
    },
    {
        state: "South Dakota",
        stateCode: "SD",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "S.D. Codified Laws § 43-32-12"
    },
    {
        state: "Tennessee",
        stateCode: "TN",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Tenn. Code Ann. § 66-28-512"
    },
    {
        state: "Texas",
        stateCode: "TX",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Tex. Prop. Code Ann. § 91.001"
    },
    {
        state: "Utah",
        stateCode: "UT",
        commercialNoticeDays: 15,
        residentialNoticeDays: 15,
        source: "Utah Code Ann. § 78B-6-802"
    },
    {
        state: "Vermont",
        stateCode: "VT",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Vt. Stat. Ann. tit. 9, § 4467"
    },
    {
        state: "Virginia",
        stateCode: "VA",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Va. Code Ann. § 55.1-1253"
    },
    {
        state: "Washington",
        stateCode: "WA",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Wash. Rev. Code Ann. § 59.18.200"
    },
    {
        state: "West Virginia",
        stateCode: "WV",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "W. Va. Code § 37-6-5"
    },
    {
        state: "Wisconsin",
        stateCode: "WI",
        commercialNoticeDays: 28,
        residentialNoticeDays: 28,
        source: "Wis. Stat. Ann. § 704.19"
    },
    {
        state: "Wyoming",
        stateCode: "WY",
        commercialNoticeDays: 30,
        residentialNoticeDays: 30,
        source: "Wyo. Stat. Ann. § 1-21-1202"
    }
];

export function getStateNoticeRequirement(stateCode: string): StateNoticeRequirement | undefined {
    return STATE_NOTICE_REQUIREMENTS.find(s => s.stateCode === stateCode.toUpperCase());
}

export function getMinimumNoticePeriod(stateCode: string): number {
    const req = getStateNoticeRequirement(stateCode);
    return req?.commercialNoticeDays || 30; // Default to 30 if not found
}

export function validateNoticePeriod(stateCode: string, noticePeriodDays: number): {
    isValid: boolean;
    minimumDays: number;
    warning?: string;
} {
    const minimumDays = getMinimumNoticePeriod(stateCode);
    
    if (noticePeriodDays >= minimumDays) {
        return { isValid: true, minimumDays };
    }
    
    const req = getStateNoticeRequirement(stateCode);
    const warning = req?.specialRequirements 
        ? `${req.state} requires ${minimumDays} days minimum. ${req.specialRequirements}`
        : `${req?.state || stateCode} requires ${minimumDays} days minimum notice for commercial leases.`;
    
    return {
        isValid: false,
        minimumDays,
        warning
    };
}

// Helper to extract state code from address
export function extractStateFromAddress(address: string): string | null {
    if (!address) return null;
    
    // Match 2-letter state codes
    const stateMatch = address.match(/,\s*([A-Za-z]{2})\s+\d{5}/);
    if (stateMatch) {
        return stateMatch[1].toUpperCase();
    }
    
    return null;
}
