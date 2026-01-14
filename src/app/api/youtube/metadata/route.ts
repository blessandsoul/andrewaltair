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

        // Fallback to oEmbed if no API key or API failed
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
