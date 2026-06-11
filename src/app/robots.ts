import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://andrewaltair.ge'
    // NOTE: `/*?_rsc=` is deliberately NOT disallowed. Blocking it in robots
    // prevented Google from fetching those URLs at all — so it never saw the
    // `X-Robots-Tag: noindex` header (next.config.mjs) and ~116 ?_rsc= payload
    // URLs sat stuck in the index (GSC drilldown 2026-06-12). Letting the
    // crawler in lets noindex actually deindex them.
    const commonDisallow = [
        '/admin/', '/api/', '/private/', '/_next/',
        '/login', '/register', '/forgot-password', '/verify-email',
        '/profile', '/demo-features', '/bots/add', '/link/',
        '/encyclopedia/progress',
        '/quiz', '/mystic', '/mystic/', '/bots/affiliate',
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
                // Perplexity's on-demand user-request fetcher (distinct from PerplexityBot)
                userAgent: 'Perplexity-User',
                allow: '/',
                disallow: ['/admin/', '/api/', '/private/'],
            },
            {
                // OpenAI search crawler (distinct from GPTBot training crawler)
                userAgent: 'OAI-SearchBot',
                allow: '/',
                disallow: ['/admin/', '/api/', '/private/'],
            },
            {
                userAgent: 'Amazonbot',
                allow: '/',
                disallow: ['/admin/', '/api/', '/private/'],
            },
            {
                // xAI / Grok
                userAgent: 'GrokBot',
                allow: '/',
                disallow: ['/admin/', '/api/', '/private/'],
            },
            {
                userAgent: 'MistralAI-User',
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
            `${baseUrl}/news-sitemap.xml`,
        ],
    }
}
