import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// YouTube oEmbed API for fetching video metadata
const YOUTUBE_OEMBED_URL = 'https://www.youtube.com/oembed'
const YOUTUBE_DATA_API_URL = 'https://www.googleapis.com/youtube/v3/videos'

interface YouTubeMetadata {
    title: string
    description: string
    author_name: string
    author_url: string
    thumbnail_url: string
    html: string
    width: number
    height: number
    tags?: string[]
}

// Extract video ID from various YouTube URL formats
function extractYouTubeId(url: string): string | null {
    const patterns = [
        // Shorts URL: youtube.com/shorts/B8dXf9gbQKY
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
        // Standard URLs: youtube.com/watch?v=..., youtu.be/..., embed, etc.
        /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/,
        // Direct video ID (11 characters)
        /^[a-zA-Z0-9_-]{11}$/
    ]

    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1] || match[0]
    }
    return null
}

// Parse ISO 8601 duration to human readable format
function parseISO8601Duration(duration: string): string {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return ''

    const hours = match[1] ? parseInt(match[1]) : 0
    const minutes = match[2] ? parseInt(match[2]) : 0
    const seconds = match[3] ? parseInt(match[3]) : 0

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const urlOrId = searchParams.get('url') || searchParams.get('id')

        if (!urlOrId) {
            return NextResponse.json(
                { error: 'YouTube URL or ID is required' },
                { status: 400 }
            )
        }

        const videoId = extractYouTubeId(urlOrId)

        if (!videoId) {
            return NextResponse.json(
                { error: 'Invalid YouTube URL or ID' },
                { status: 400 }
            )
        }

        let title = ''
        let description = ''
        let duration = ''
        let authorName = ''
        let authorUrl = ''
        let publishedAt = new Date().toISOString()
        let isShort = false
        let tags: string[] = []

        // Try YouTube Data API v3 first (if API key is configured)
        const apiKey = process.env.YOUTUBE_API_KEY
        if (apiKey) {
            try {
                const apiUrl = `${YOUTUBE_DATA_API_URL}?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`
                const apiRes = await fetch(apiUrl)
                if (apiRes.ok) {
                    const data = await apiRes.json()
                    if (data.items && data.items.length > 0) {
                        const item = data.items[0]
                        title = item.snippet?.title || ''
                        description = item.snippet?.description || ''
                        authorName = item.snippet?.channelTitle || ''
                        publishedAt = item.snippet?.publishedAt || new Date().toISOString()
                        duration = parseISO8601Duration(item.contentDetails?.duration || '')
                        tags = item.snippet?.tags || []

                        // Check if it's a Short (duration <= 60 seconds)
                        const durationMatch = item.contentDetails?.duration?.match(/PT(?:(\d+)M)?(?:(\d+)S)?/)
                        if (durationMatch) {
                            const mins = parseInt(durationMatch[1] || '0')
                            const secs = parseInt(durationMatch[2] || '0')
                            isShort = (mins === 0 && secs <= 60) || (mins === 1 && secs === 0)
                        }
                    }
                }
            } catch (e) {
                console.error('YouTube Data API error:', e)
            }
        }

        // 2. Try Scraping (Good fallback for no key)
        if (!title) {
            try {
                const scrapeRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                        'Accept-Language': 'en-US,en;q=0.9', // Default to English to avoid localized generic descriptions
                    }
                })

                if (scrapeRes.ok) {
                    const html = await scrapeRes.text()

                    // Helper to decode HTML entities
                    const decodeHtml = (txt: string) => txt.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')

                    // 1. Try ytInitialPlayerResponse (Standard Video Player Data)
                    const playerResponseMatch = html.match(/var\s+ytInitialPlayerResponse\s*=\s*({.+?});/)
                    if (playerResponseMatch) {
                        try {
                            const playerResponse = JSON.parse(playerResponseMatch[1])
                            const videoDetails = playerResponse.videoDetails

                            if (videoDetails) {
                                title = videoDetails.title || title
                                description = videoDetails.shortDescription || description
                                authorName = videoDetails.author || authorName
                                if (videoDetails.lengthSeconds) {
                                    const totalSeconds = parseInt(videoDetails.lengthSeconds)
                                    const mins = Math.floor(totalSeconds / 60)
                                    const secs = totalSeconds % 60
                                    duration = `${mins}:${secs.toString().padStart(2, '0')}`
                                    isShort = totalSeconds <= 60
                                }
                                tags = videoDetails.keywords || []
                            }
                        } catch (e) {
                            console.error('Error parsing ytInitialPlayerResponse:', e)
                        }
                    }

                    // 2. Try ytInitialData (Common for Shorts / New UI)
                    if (!description || tags.length === 0) {
                        const initialDataMatch = html.match(/var\s+ytInitialData\s*=\s*({.+?});/)
                        if (initialDataMatch) {
                            try {
                                const initialData = JSON.parse(initialDataMatch[1])

                                // Navigate deep JSON structure for Description
                                // Structure varies, try multiple paths
                                const panels = initialData?.engagementPanels || []
                                for (const panel of panels) {
                                    const desc = panel?.engagementPanelSectionListRenderer?.content?.structuredDescriptionContentRenderer?.items?.[0]?.expandableVideoDescriptionBodyRenderer?.attributedDescriptionBodyText?.content
                                    if (desc) {
                                        description = desc
                                        break
                                    }
                                }

                                // Alternative path for Shorts overlay
                                if (!description) {
                                    const overlay = initialData?.overlay?.reelPlayerOverlayRenderer?.reelPlayerHeaderSupportedRenderers?.reelPlayerHeaderRenderer?.accessibility?.accessibilityData?.label
                                    // This is usually just the title + author, not full description.
                                    // Shorts description is often hidden in "engagementPanels"
                                }

                                // Try to find Keywords/Tags in Microformat
                                const microformat = initialData?.microformat?.playerMicroformatRenderer
                                if (microformat) {
                                    if (!description) description = microformat.description?.simpleText || ''
                                    if (!title) title = microformat.title?.simpleText || ''
                                    if (!duration && microformat.lengthSeconds) {
                                        const totalSeconds = parseInt(microformat.lengthSeconds)
                                        const mins = Math.floor(totalSeconds / 60)
                                        const secs = totalSeconds % 60
                                        duration = `${mins}:${secs.toString().padStart(2, '0')}`
                                        isShort = totalSeconds <= 60
                                    }
                                }
                            } catch (e) {
                                console.error('Error parsing ytInitialData:', e)
                            }
                        }
                    }

                    // 3. Fallback to Regex Parsing
                    if (!title) {
                        const titleMatch = html.match(/<meta name="title" content="([^"]+)">/)
                        if (titleMatch) title = decodeHtml(titleMatch[1])
                    }

                    if (!description) {
                        const descMatch = html.match(/<meta name="description" content="([^"]+)">/)
                        if (descMatch) {
                            const candidate = decodeHtml(descMatch[1])
                            // Filter out generic YouTube descriptions (both EN and Ka)
                            const isGeneric =
                                candidate.includes("ისიამოვნეთ თქვენი საყვარელი ვიდეოებითა და მუსიკით") ||
                                candidate.includes("Enjoy the videos and music you love") ||
                                candidate.startsWith("YouTube") // often just "YouTube"

                            if (!isGeneric) {
                                description = candidate
                            }
                        }
                    }

                    // Extract Date
                    const dateMatch = html.match(/itemprop="datePublished" content="([^"]+)"/)
                    if (dateMatch) publishedAt = dateMatch[1]

                    // Extract Duration if still missing
                    if (!duration) {
                        const durMatch = html.match(/itemprop="duration" content="([^"]+)"/)
                        const durRaw = durMatch ? durMatch[1] : (html.match(/"duration":"(PT[^"]+)"/)?.[1])

                        if (durRaw) {
                            duration = parseISO8601Duration(durRaw)
                            const durationMatch = durRaw.match(/PT(?:(\d+)M)?(?:(\d+)S)?/)
                            if (durationMatch) {
                                const mins = parseInt(durationMatch[1] || '0')
                                const secs = parseInt(durationMatch[2] || '0')
                                isShort = (mins === 0 && secs <= 60) || (mins === 1 && secs === 0)
                            }
                        }
                    }

                    // Extract Author
                    if (!authorName) {
                        const authorMatch = html.match(/"author":"([^"]+)"/) || html.match(/<link itemprop="name" content="([^"]+)">/)
                        if (authorMatch) authorName = decodeHtml(authorMatch[1])
                    }

                    // Extract Keywords from meta tag if JSON failed
                    if (tags.length === 0) {
                        const keywordsMatch = html.match(/<meta name="keywords" content="([^"]+)">/)
                        if (keywordsMatch) {
                            tags = decodeHtml(keywordsMatch[1]).split(',').map(t => t.trim()).filter(t => t)
                        }
                    }
                }
            } catch (e) {
                console.error('Scraping error:', e)
            }
        }

        // 3. Fallback to oEmbed if no API key or API failed
        if (!title) {
            const oembedUrl = `${YOUTUBE_OEMBED_URL}?url=https://www.youtube.com/watch?v=${videoId}&format=json`
            const oembedResponse = await fetch(oembedUrl)

            if (!oembedResponse.ok) {
                return NextResponse.json(
                    { error: 'Video not found or unavailable' },
                    { status: 404 }
                )
            }

            const oembedData: YouTubeMetadata = await oembedResponse.json()
            title = oembedData.title || ''
            authorName = oembedData.author_name || ''
            authorUrl = oembedData.author_url || ''

            // oEmbed doesn't reliably provide description or tags

            // Determine video type from oEmbed dimensions or title
            isShort = oembedData.title?.toLowerCase().includes('#short') ||
                oembedData.title?.toLowerCase().includes('shorts') ||
                (oembedData.width < oembedData.height)
        }

        // Get high-quality thumbnail
        const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

        return NextResponse.json({
            success: true,
            videoId,
            data: {
                title,
                description,
                author: authorName,
                authorUrl,
                thumbnail,
                thumbnails: {
                    default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
                    medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                    high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                },
                duration,
                viewCount: 0,
                publishedAt,
                type: isShort ? 'short' : 'long',
                tags
            }
        })

    } catch (error) {
        console.error('YouTube metadata fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch YouTube metadata' },
            { status: 500 }
        )
    }
}
