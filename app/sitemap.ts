import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://rentclock.online'

    // Use a fixed date to prevent "discovered - currently not indexed" issues
    // caused by the date changing on every build.
    const lastModified = new Date('2026-02-01')

    return [
        {
            url: baseUrl,
            lastModified: lastModified,
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/lease-tracking-software`,
            lastModified: lastModified,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: lastModified,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog/ultimate-guide-commercial-lease-tracking`,
            lastModified: new Date('2026-01-15'),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog/commercial-rent-escalation-guide`,
            lastModified: new Date('2026-02-05'),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog/cpi-rent-increase-explained`,
            lastModified: new Date('2026-02-18'),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        // Legal pages
        {
            url: `${baseUrl}/privacy`,
            lastModified: lastModified,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: lastModified,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]
}
