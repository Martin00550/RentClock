import { DriveStep } from "driver.js";

export const HOME_STEPS: DriveStep[] = [
    {
        element: "#sidebar-home",
        popover: {
            title: "Welcome to RentClock",
            description: "Here is your command center. Get a bird’s-eye view of your entire portfolio at a glance.",
            side: "right",
            align: "start",
        }
    },
    {
        element: "#dashboard-kpi-revenue",
        popover: {
            title: "Track Your Revenue",
            description: "See exactly how much revenue you're protecting. This number updates automatically as you add valid leases.",
            side: "bottom",
        }
    },
    {
        element: "#dashboard-quick-add",
        popover: {
            title: "Quick Actions",
            description: "Ready to get started? Use this button to add your first lease in seconds.",
            side: "bottom",
        }
    },
    {
        element: "#sidebar-profit",
        popover: {
            title: "Profit Protection",
            description: "This is our 'Money Feature'. Click here later to audit your portfolio for inflation leakage.",
            side: "right",
        }
    }
];

export const LEASES_STEPS: DriveStep[] = [
    {
        element: "#leases-add-button",
        popover: {
            title: "Add a Lease",
            description: "You can type in details manually OR use our AI Import to upload a PDF directly.",
            side: "bottom",
        }
    },
    {
        element: "#leases-search",
        popover: {
            title: "Find Deals Instantly",
            description: "Search by tenant name, address, or even lease expiry date.",
            side: "bottom",
        }
    }
];

export const PROFIT_STEPS: DriveStep[] = [
    {
        element: "#profit-cpi-calculator",
        popover: {
            title: "CPI Calculator",
            description: "Stop guessing inflation rates. We pull live government data to tell you exactly how much to increase rent.",
            side: "left",
        }
    },
    {
        element: "#profit-revenue-risk",
        popover: {
            title: "Revenue at Risk",
            description: "This is the money you are losing *right now* by not adjusting rent to market. We'll help you capture it.",
            side: "bottom",
        }
    }
];
