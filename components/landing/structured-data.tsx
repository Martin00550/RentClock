export function StructuredData() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "RentClock",
        "operatingSystem": "Web",
        "applicationCategory": "BusinessApplication",
        "description": "Professional-grade commercial lease tracking and portfolio protection software.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "description": "3 leases free forever",
        },
        "featureList": [
            "Automated Rent Increase Alerts",
            "CPI Index Tracking",
            "Portfolio Safety Net",
            "SMS Reminders"
        ],
        "author": {
            "@type": "Organization",
            "name": "RentClock"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
