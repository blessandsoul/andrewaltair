import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { YoutubeService } from '@/services/youtube.service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const urlOrId = searchParams.get('url') || searchParams.get('id')

        if (!urlOrId) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'YouTube URL or ID is required', 400)
        }

        const result = await YoutubeService.getMetadata(urlOrId);

        return apiSuccess(result, 'YouTube metadata fetched successfully')

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        const status = msg === 'Invalid YouTube URL or ID' ? 400 :
            msg === 'Video not found or unavailable' ? 404 : 500;

        console.error('YouTube metadata fetch error:', error)

        return apiError(ERROR_CODES.YOUTUBE_FETCH_FAILED, msg || 'Failed to fetch YouTube metadata', status)
    }
}
