import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/api/'], // Keep private areas private
        },
        sitemap: 'https://rentclock.online/sitemap.xml',
    }
}
