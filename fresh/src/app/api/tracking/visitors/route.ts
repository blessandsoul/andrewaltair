import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Visitor from '@/models/Visitor'

// Helper to parse user agent
function parseUserAgent(ua: string) {
    const isMobile = /Mobile|Android|iPhone|iPad/.test(ua)
    const isTablet = /iPad|Tablet/.test(ua)
    const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop'

    let browser = 'Unknown'
    if (ua.includes('Chrome')) browser = 'Chrome'
    else if (ua.includes('Firefox')) browser = 'Firefox'
    else if (ua.includes('Safari')) browser = 'Safari'
    else if (ua.includes('Edge')) browser = 'Edge'

    let os = 'Unknown'
    if (ua.includes('Windows')) os = 'Windows'
    else if (ua.includes('Mac')) os = 'macOS'
    else if (ua.includes('Linux')) os = 'Linux'
    else if (ua.includes('Android')) os = 'Android'
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'

    return { deviceType, browser, os }
}

// Social media domains for traffic source classification
const socialDomains = [
    'facebook.com', 'fb.com', 'instagram.com', 'twitter.com', 'x.com',
    'linkedin.com', 'youtube.com', 'tiktok.com', 'pinterest.com',
    'reddit.com', 'tumblr.com', 'snapchat.com', 'telegram.org', 't.me',
    'vk.com', 'ok.ru', 'threads.net'
]

// Search engine domains for organic traffic
const searchEngines = [
    'google.com', 'google.ge', 'bing.com', 'yahoo.com', 'duckduckgo.com',
    'yandex.com', 'yandex.ru', 'baidu.com', 'ask.com', 'aol.com'
]

// Email domains for email traffic
const emailDomains = [
    'mail.google.com', 'outlook.live.com', 'mail.yahoo.com',
    'webmail', 'email', 'newsletter'
]

// Parse referrer to determine traffic source
function parseReferrerSource(referrer: string | undefined, currentUrl: string): {
    source: 'direct' | 'organic' | 'social' | 'referral' | 'email' | 'paid'
    domain: string | null
} {
    // Check for UTM parameters first (paid/email campaigns)
    try {
        const url = new URL(currentUrl)
        const utmMedium = url.searchParams.get('utm_medium')?.toLowerCase()
        if (utmMedium) {
            if (utmMedium === 'cpc' || utmMedium === 'ppc' || utmMedium === 'paid') {
                return { source: 'paid', domain: null }
            }
            if (utmMedium === 'email' || utmMedium === 'newsletter') {
                return { source: 'email', domain: null }
            }
        }
    } catch { }

    // No referrer = direct traffic
    if (!referrer || referrer === '' || referrer === 'null') {
        return { source: 'direct', domain: null }
    }

    try {
        const refUrl = new URL(referrer)
        const refDomain = refUrl.hostname.replace('www.', '')

        // Check social media
        if (socialDomains.some(d => refDomain.includes(d))) {
            return { source: 'social', domain: refDomain }
        }

        // Check search engines
        if (searchEngines.some(d => refDomain.includes(d))) {
            return { source: 'organic', domain: refDomain }
        }

        // Check email
        if (emailDomains.some(d => refDomain.includes(d) || referrer.toLowerCase().includes(d))) {
            return { source: 'email', domain: refDomain }
        }

        // Everything else is referral
        return { source: 'referral', domain: refDomain }
    } catch {
        return { source: 'direct', domain: null }
    }
}

// Extract UTM parameters from URL
function parseUTMParams(url: string): {
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    utmContent?: string
    utmTerm?: string
} {
    try {
        const urlObj = new URL(url)
        return {
            utmSource: urlObj.searchParams.get('utm_source') || undefined,
            utmMedium: urlObj.searchParams.get('utm_medium') || undefined,
            utmCampaign: urlObj.searchParams.get('utm_campaign') || undefined,
            utmContent: urlObj.searchParams.get('utm_content') || undefined,
            utmTerm: urlObj.searchParams.get('utm_term') || undefined,
        }
    } catch {
        return {}
    }
}

// Simple in-memory cache for GeoIP (to avoid rate limiting)
const geoCache = new Map<string, { city: string; country: string; countryCode: string; expires: number }>()

// Georgian cities for local development
const georgianCities = [
    'Tbilisi', 'Batumi', 'Kutaisi', 'Rustavi', 'Zugdidi',
    'Gori', 'Poti', 'Samtredia', 'Khashuri', 'Senaki',
    'Zestaponi', 'Marneuli', 'Telavi', 'Akhaltsikhe', 'Kobuleti'
]

function getRandomGeorgianCity(): string {
    return georgianCities[Math.floor(Math.random() * georgianCities.length)]
}

// Get geolocation from IP using ip-api.com (free, 45 requests/minute)
async function getGeoFromIP(ip: string): Promise<{ city: string; country: string; countryCode: string }> {
    // For local development, return random Georgian city
    if (!ip || ip === 'unknown' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.') || ip === '::1') {
        return {
            city: getRandomGeorgianCity(),
            country: 'Georgia',
            countryCode: 'GE'
        }
    }

    // Check cache first
    const cached = geoCache.get(ip)
    if (cached && cached.expires > Date.now()) {
        return { city: cached.city, country: cached.country, countryCode: cached.countryCode }
    }

    try {
        // ip-api.com free tier (no API key needed)
        const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`, {
            signal: AbortSignal.timeout(3000) // 3 second timeout
        })

        if (res.ok) {
            const data = await res.json()
            if (data.status === 'success') {
                const geo = {
                    city: data.city || 'Unknown',
                    country: data.country || 'Unknown',
                    countryCode: data.countryCode || 'XX'
                }

                // Cache for 1 hour
                geoCache.set(ip, { ...geo, expires: Date.now() + 60 * 60 * 1000 })

                return geo
            }
        }
    } catch (error) {
        // Silently fail
    }

    // Default fallback
    return { city: 'Unknown', country: 'Unknown', countryCode: 'XX' }
}

// Bot detection
function isBot(userAgent: string): boolean {
    const bots = [
        'googlebot', 'bingbot', 'yandexbot', 'duckduckbot', 'slurp',
        'baiduspider', 'facebookexternalhit', 'twitterbot', 'rogerbot',
        'linkedinbot', 'embedly', 'quora link preview', 'showyoubot',
        'outbrain', 'pinterest/0.', 'developers.google.com/+/web/snippet',
        'slackbot', 'vkshare', 'w3c_validator', 'redditbot', 'applebot',
        'whatsapp', 'flipboard', 'tumblr', 'bitlybot', 'skypeuripreview',
        'nuzzel', 'discordbot', 'google page speed', 'qwantify',
        'pinterest', 'wordpress', 'xnu', 'isomorphic-git'
    ]
    const ua = userAgent.toLowerCase()
    return bots.some(bot => ua.includes(bot))
}

// POST - Register/update visitor heartbeat
export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const body = await request.json()
        const { visitorId, currentPage, referrer, type = 'pageview' } = body
        const isHeartbeat = type === 'heartbeat'
        const pageViewInc = isHeartbeat ? 0 : 1

        if (!visitorId) {
            return NextResponse.json({ error: 'visitorId required' }, { status: 400 })
        }

        const userAgent = request.headers.get('user-agent') || ''

        // Filter bots
        if (isBot(userAgent)) {
            return NextResponse.json({ success: true, ignored: true })
        }

        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
            'unknown'

        const { deviceType, browser, os } = parseUserAgent(userAgent)

        // Get real geolocation from IP
        const geo = await getGeoFromIP(ip)

        // Parse traffic source and UTM params
        const { source, domain } = parseReferrerSource(referrer, currentPage)
        const utmParams = parseUTMParams(currentPage)

        // Check if this is an internal navigation (referrer is our own domain)
        // We only want to update traffic source if it's an external referrer
        let isExternalReferrer = false
        try {
            if (referrer && !referrer.includes(request.nextUrl.host) && !referrer.includes('localhost')) {
                isExternalReferrer = true
            }
        } catch { }

        // Prepare update data
        const updateData: any = {
            ip,
            userAgent,
            city: geo.city,
            country: geo.countryCode,
            currentPage,
            deviceType,
            browser,
            os,
            lastSeen: new Date(),
            isOnline: true,
            // Always update session duration based on lastSeen - sessionStart (approx)
            // But we need the existing doc to know sessionStart. 
            // For now, simpler approach: we'll rely on the client or just aggregation.
            // Let's iterate: we can't easily calc duration here without a read first or complex pipeline.
            // We'll trust the client to send a 'heartbeat' for duration or just accept rough server-side calc later.
            // Actually, let's keep it simple: duration is calc'd by aggregation of firstSeen vs lastSeen for the session.
            // But we added a field sessionDuration. Let's leave it 0 for now or update it if we had sessionStart.
        }

        // Handling Traffic Sources:
        // We only leverage $setOnInsert for initial source to avoid overwriting with 'direct' on internal clicks
        // BUT if it's a new external referrer, we might want to update.
        // For simplicity in this phase: Only set on first insert.

        // Logic for 'bounced':
        // We can't use $set for bounced=false based on condition in a simple findOneAndUpdate without pipeline.
        // We'll use a pipeline update.

        const now = new Date()

        const visitor = await Visitor.findOneAndUpdate(
            { visitorId },
            [
                {
                    $set: {
                        ip,
                        userAgent,
                        city: geo.city,
                        country: geo.countryCode,
                        currentPage,
                        referrer: referrer || '$referrer', // Keep old if null
                        deviceType,
                        browser,
                        os,
                        lastSeen: now,
                        isOnline: true,

                        // Increment pageViews only if not heartbeat
                        pageViews: { $add: [{ $ifNull: ['$pageViews', 0] }, pageViewInc] },

                        // Bounced logic: if pageViews becomes > 1, bounced = false
                        bounced: {
                            $cond: {
                                if: { $gt: [{ $add: [{ $ifNull: ['$pageViews', 0] }, pageViewInc] }, 1] },
                                then: false,
                                else: true
                            }
                        },

                        // Session Duration (approximate: now - sessionStart)
                        sessionDuration: {
                            $divide: [
                                { $subtract: [now, { $ifNull: ['$sessionStart', now] }] },
                                1000
                            ]
                        },

                        // Traffic Source (only set if not exists, or if we decide to overwrite - let's stick to first touch for now)
                        referrerSource: { $ifNull: ['$referrerSource', source] },
                        referrerDomain: { $ifNull: ['$referrerDomain', domain] },
                        utmSource: { $ifNull: ['$utmSource', utmParams.utmSource] },
                        utmMedium: { $ifNull: ['$utmMedium', utmParams.utmMedium] },
                        utmCampaign: { $ifNull: ['$utmCampaign', utmParams.utmCampaign] },

                        // On insert fields
                        firstSeen: { $ifNull: ['$firstSeen', now] },
                        sessionStart: { $ifNull: ['$sessionStart', now] },
                    }
                }
            ],
            { upsert: true, new: true, updatePipeline: true }
        )

        return NextResponse.json({
            success: true,
            visitor: {
                id: visitor._id,
                city: visitor.city,
                country: visitor.country,
                deviceType: visitor.deviceType,
            }
        })
    } catch (error) {
        console.error('Visitor tracking error:', error)
        return NextResponse.json({ error: 'Tracking failed' }, { status: 500 })
    }
}

// GET - Get online visitor count
export async function GET() {
    try {
        await dbConnect()

        // Consider visitors online if seen in last 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

        const onlineCount = await Visitor.countDocuments({
            lastSeen: { $gte: fiveMinutesAgo }
        })

        // Get breakdown by device type
        const breakdown = await Visitor.aggregate([
            { $match: { lastSeen: { $gte: fiveMinutesAgo } } },
            { $group: { _id: '$deviceType', count: { $sum: 1 } } }
        ])

        const byDevice = Object.fromEntries(
            breakdown.map(b => [b._id, b.count])
        )

        return NextResponse.json({
            online: onlineCount,
            desktop: byDevice.desktop || 0,
            mobile: byDevice.mobile || 0,
            tablet: byDevice.tablet || 0,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        console.error('Online count error:', error)
        return NextResponse.json({ online: 0, error: 'Failed to get count' }, { status: 500 })
    }
}
