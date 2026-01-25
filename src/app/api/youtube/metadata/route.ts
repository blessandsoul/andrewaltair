import { NextRequest, NextResponse } from 'next/server'
import { YoutubeService } from '@/services/youtube.service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const urlOrId = searchParams.get('url') || searchParams.get('id')

        if (!urlOrId) {
            return NextResponse.json({ error: 'YouTube URL or ID is required' }, { status: 400 })
        }

        const result = await YoutubeService.getMetadata(urlOrId);

        return NextResponse.json({
            success: true,
            ...result
        })

    } catch (error: any) {
        const msg = error.message;
        const status = msg === 'Invalid YouTube URL or ID' ? 400 :
            msg === 'Video not found or unavailable' ? 404 : 500;

        console.error('YouTube metadata fetch error:', error)

        return NextResponse.json(
            {
                error: 'Failed to fetch YouTube metadata',
                details: msg,
            },
            { status }
        )
    }
}
