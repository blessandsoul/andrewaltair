import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://andrewaltair.ge'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/private/',
                    '/_next/',
                    '/login',
                    '/register',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
            },
            {
                userAgent: 'Googlebot-Image',
                allow: '/images/',
            },
            // AI/LLM Crawlers - explicitly allow
            {
                userAgent: 'GPTBot',
                allow: '/',
                disallow: ['/admin/', '/api/', '/private/'],
            },
            {
                userAgent: 'ChatGPT-User',
                allow: '/',
                disallow: ['/admin/', '/api/', '/private/'],
            },
            {
                userAgent: 'Anthropic-ai',
                allow: '/',
                disallow: ['/admin/', '/api/', '/private/'],
            },
            {
                userAgent: 'Claude-Web',
                allow: '/',
                disallow: ['/admin/', '/api/', '/private/'],
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
            },
            {
                userAgent: 'Bingbot',
                allow: '/',
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    }
}
