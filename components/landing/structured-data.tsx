export function StructuredData() {
    const baseUrl = "https://rentclock.online";

    const softwareAppSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "RentClock",
        "operatingSystem": "Web",
        "applicationCategory": "BusinessApplication",
        "url": baseUrl,
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
            "Critical Date Reminders",
            "ROI Audit Reality Check"
        ],
        "author": {
            "@type": "Organization",
            "name": "RentClock",
            "url": baseUrl,
            "logo": `${baseUrl}/logo.png`
        }
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "RentClock",
        "url": baseUrl,
        "description": "The simple commercial lease tracker and management software.",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${baseUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": baseUrl
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Product",
                "item": `${baseUrl}/lease-tracking-software`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Blog",
                "item": `${baseUrl}/blog`
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
        </>
    );
}
