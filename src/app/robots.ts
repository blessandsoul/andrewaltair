import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://andrewaltair.ge'
    const commonDisallow = [
        '/admin/', '/api/', '/private/', '/_next/',
        '/login', '/register', '/forgot-password', '/verify-email',
        '/profile', '/demo-features', '/bots/add', '/link/',
        '/encyclopedia/progress',
        '/*?_rsc=',
    ]

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: commonDisallow,
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: commonDisallow,
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
                userAgent: 'ClaudeBot',
                allow: '/',
                disallow: ['/admin/', '/api/', '/private/'],
            },
            {
                userAgent: 'CCBot',
                allow: '/',
                disallow: ['/admin/', '/api/', '/private/'],
            },
            {
                userAgent: 'cohere-ai',
                allow: '/',
                disallow: ['/admin/', '/api/', '/private/'],
            },
            {
                userAgent: 'Applebot-Extended',
                allow: '/',
                disallow: ['/admin/', '/api/', '/private/'],
            },
            {
                userAgent: 'Bytespider',
                allow: '/',
                disallow: ['/admin/', '/api/', '/private/'],
            },
            {
                userAgent: 'Meta-ExternalAgent',
                allow: '/',
                disallow: ['/admin/', '/api/', '/private/'],
            },
            {
                userAgent: 'YouBot',
                allow: '/',
                disallow: ['/admin/', '/api/', '/private/'],
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
                disallow: ['/admin/', '/api/', '/private/'],
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
                disallow: commonDisallow,
            },
            {
                userAgent: 'Bingbot',
                allow: '/',
                disallow: commonDisallow,
            },
        ],
        sitemap: [
            `${baseUrl}/sitemap.xml`,
            `${baseUrl}/sitemap-videos.xml`,
        ],
    }
}
