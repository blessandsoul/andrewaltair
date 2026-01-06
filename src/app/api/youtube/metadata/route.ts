import { NextRequest, NextResponse } from 'next/server'

// YouTube oEmbed API for fetching video metadata
const YOUTUBE_OEMBED_URL = 'https://www.youtube.com/oembed'

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
        /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/,
        /^[a-zA-Z0-9_-]{11}$/  // Direct video ID
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
    if (!match) return '00:00'

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

        // Fetch oEmbed data
        const oembedUrl = `${YOUTUBE_OEMBED_URL}?url=https://www.youtube.com/watch?v=${videoId}&format=json`
        const oembedResponse = await fetch(oembedUrl)

        if (!oembedResponse.ok) {
            return NextResponse.json(
                { error: 'Video not found or unavailable' },
                { status: 404 }
            )
        }

        const oembedData: YouTubeMetadata = await oembedResponse.json()

        // Get high-quality thumbnail
        const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

        // Try to get more data via noembed (provides more info)
        let duration = ''
        let description = ''
        let viewCount = 0
        let publishedAt = new Date().toISOString()

        try {
            // Use noembed for additional metadata
            const noembedRes = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`)
            if (noembedRes.ok) {
                const noembedData = await noembedRes.json()
                // noembed doesn't provide duration/views, but provides consistent title
            }
        } catch {
            // Ignore noembed errors
        }

        // Determine video type based on embed dimensions or title
        const isShort = oembedData.title?.toLowerCase().includes('#short') ||
            oembedData.title?.toLowerCase().includes('shorts') ||
            (oembedData.width < oembedData.height)

        return NextResponse.json({
            success: true,
            videoId,
            data: {
                title: oembedData.title || '',
                description: description || `ვიდეო ${oembedData.author_name}-სგან`,
                author: oembedData.author_name || '',
                authorUrl: oembedData.author_url || '',
                thumbnail,
                thumbnails: {
                    default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
                    medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                    high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                },
                duration,
                viewCount,
                publishedAt,
                type: isShort ? 'short' : 'long',
                embedHtml: oembedData.html,
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
