import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Contact RentClock | Get Support for Lease Tracking",
    description: "Contact the RentClock support team for help with commercial lease tracking, rent increase alerts, and portfolio management. We respond within 24 hours.",
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
