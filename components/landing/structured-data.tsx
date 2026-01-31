export function StructuredData() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "RentClock",
        "operatingSystem": "Web",
        "applicationCategory": "BusinessApplication",
        "description": "The simple commercial lease tracker and management software for landlords. Track rent increases, lease expirations, and critical dates.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "description": "Start free (3 leases included)"
        },
        "featureList": [
            "Commercial Lease Tracker",
            "Lease Management Software",
            "Automated Rent Increase Alerts",
            "Critical Date Reminders"
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
