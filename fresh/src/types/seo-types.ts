// SEO Types for Admin Panel

export interface MetaTags {
    id: string
    postId: string
    title: string
    description: string
    keywords: string[]
    ogTitle: string
    ogDescription: string
    ogImage: string
    twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player'
    twitterTitle: string
    twitterDescription: string
    twitterImage: string
    canonical: string
    robots: string
    updatedAt: string
}

export interface SitemapEntry {
    id: string
    url: string
    lastmod: string
    changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
    priority: number
    enabled: boolean
}

export interface RobotsRule {
    id: string
    userAgent: string
    type: 'allow' | 'disallow'
    path: string
    enabled: boolean
}

export interface RobotsTxt {
    rules: RobotsRule[]
    sitemap: string
    crawlDelay?: number
}

export interface KeywordTracking {
    id: string
    keyword: string
    currentPosition: number | null
    previousPosition: number | null
    searchVolume: number
    difficulty: 'easy' | 'medium' | 'hard'
    trend: 'up' | 'down' | 'stable'
    lastChecked: string
    history: { date: string; position: number }[]
}

export interface CanonicalUrl {
    id: string
    pageUrl: string
    canonicalUrl: string
    hasDuplicate: boolean
    duplicateUrls?: string[]
    status: 'ok' | 'warning' | 'error'
}

export interface SchemaTemplate {
    id: string
    name: string
    type: 'Article' | 'FAQ' | 'Product' | 'Organization' | 'BreadcrumbList' | 'WebPage'
    schema: object
    enabled: boolean
}

export interface BrokenLink {
    id: string
    sourceUrl: string
    targetUrl: string
    anchorText: string
    statusCode: number
    lastChecked: string
    status: 'broken' | 'warning' | 'ignored' | 'fixed'
}

export interface ImageAltIssue {
    id: string
    imageUrl: string
    imageName: string
    pageUrl: string
    currentAlt: string
    suggestedAlt: string
    status: 'missing' | 'poor' | 'good' | 'fixed'
}

export interface SeoHistoryEntry {
    id: string
    type: 'meta' | 'sitemap' | 'robots' | 'canonical' | 'schema' | 'keyword' | 'image'
    action: 'create' | 'update' | 'delete'
    target: string
    changes: {
        field: string
        oldValue: string
        newValue: string
    }[]
    user: string
    timestamp: string
}
