import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { YoutubeService } from '@/services/youtube.service';

export const dynamic = 'force-dynamic';

// Channel handle is hardcoded — this is the admin's own channel
const CHANNEL_HANDLE = '@AndrewAltair';

export async function GET() {
    try {
        const result = await YoutubeService.getChannelVideos(CHANNEL_HANDLE);
        return apiSuccess(result, `Found ${result.videos.length} videos from channel`);
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        console.error('Channel videos fetch error:', error);
        return apiError(
            ERROR_CODES.YOUTUBE_FETCH_FAILED || 'YOUTUBE_FETCH_FAILED',
            msg || 'Failed to fetch channel videos',
            500
        );
    }
}
