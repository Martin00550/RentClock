import { DriveStep } from "driver.js";

export const HOME_STEPS: DriveStep[] = [
    {
        element: "#sidebar-home",
        popover: {
            title: "Welcome to RentClock",
            description: "Here is your command center. Get a bird’s-eye view of your entire portfolio at a glance.",
            side: "top",
            align: "start",
        }
    },
    {
        element: "#dashboard-profit-teaser",
        popover: {
            title: "Revenue at Risk",
            description: "We're already scanning your portfolio. This indicator shows you exactly where you're losing money to inflation.",
            side: "bottom",
        }
    },
    {
        element: "#dashboard-kpi-revenue",
        popover: {
            title: "Track Your Revenue",
            description: "See exactly how much revenue you're protecting. This updates as you secure your leases.",
            side: "bottom",
        }
    },
    {
        element: "#dashboard-critical-dates",
        popover: {
            title: "Safety Net",
            description: "Never miss a rent increase again. We front-load your most important deadlines right here.",
            side: "top",
        }
    },
    {
        element: "#sidebar-profit",
        popover: {
            title: "Profit Protection",
            description: "This is our 'Money Feature'. Click here later to audit your portfolio for inflation leakage.",
            side: "top",
        }
    }
];

export const LEASES_STEPS: DriveStep[] = [
    {
        element: "#leases-add-button",
        popover: {
            title: "Add a Lease",
            description: "You can type details manually OR use our AI Import to upload a PDF directly.",
            side: "bottom",
        }
    },
    {
        element: "#leases-export-button",
        popover: {
            title: "Export Your Data",
            description: "Need your data in Excel? Export your entire portfolio to CSV with a single click.",
            side: "bottom",
        }
    },
    {
        element: "#leases-search",
        popover: {
            title: "Find Leases Instantly",
            description: "Search by tenant name, address, or even lease expiry date.",
            side: "bottom",
        }
    }
];

export const PROFIT_STEPS: DriveStep[] = [
    {
        element: "#cpi-calculator-card",
        popover: {
            title: "CPI Calculator",
            description: "Stop guessing inflation rates. We pull live government data to tell you exactly how much to increase rent.",
            side: "bottom",
        }
    },
    {
        element: "#profit-revenue-risk",
        popover: {
            title: "Revenue Leakage",
            description: "This is the money you are losing *right now* by not adjusting rent to market. We'll help you capture it.",
            side: "bottom",
        }
    }
];

export const LEASE_DETAIL_STEPS: DriveStep[] = [
    {
        element: "#lease-timeline",
        popover: {
            title: "Lease Pulse-line",
            description: "A visual timeline of your lease's history and future. We track every critical event so you don't have to.",
            side: "top",
        }
    }
];

export const SETTINGS_STEPS: DriveStep[] = [
    {
        element: "#setting-calendar-sync",
        popover: {
            title: "Calendar Sync",
            description: "Sync your lease deadlines directly to your personal Google or Apple calendar. (Pro Feature)",
            side: "bottom",
        }
    }
];

export const BILLING_STEPS: DriveStep[] = [
    {
        element: "#billing-usage-gauge",
        popover: {
            title: "Usage Monitor",
            description: "Track your lease limits here. Upgrade to Pro for unlimited lease protection.",
            side: "bottom",
        }
    }
];

