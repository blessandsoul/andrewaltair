import { apiSuccess, apiError } from '@/lib/api-response';
import dbConnect from '@/lib/db';
import Video from '@/models/Video';
import { YoutubeService } from '@/services/youtube.service';

export const dynamic = 'force-dynamic';

// POST - Fetch duration from YouTube API and update all videos missing duration
export async function POST() {
    try {
        await dbConnect();

        // Find videos with empty or missing duration
        const videosWithoutDuration = await Video.find({
            $or: [
                { duration: { $exists: false } },
                { duration: '' },
                { duration: null },
            ]
        }).lean();

        if (videosWithoutDuration.length === 0) {
            return apiSuccess({ updated: 0 }, 'All videos already have duration');
        }

        const apiKey = process.env.YOUTUBE_API_KEY;
        if (!apiKey) {
            return apiError('NO_API_KEY', 'YOUTUBE_API_KEY not configured', 500);
        }

        let updatedCount = 0;

        // Process in batches of 50 (YouTube API limit)
        for (let i = 0; i < videosWithoutDuration.length; i += 50) {
            const batch = videosWithoutDuration.slice(i, i + 50);
            const youtubeIds = batch.map(v => v.youtubeId).join(',');

            const res = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${youtubeIds}&key=${apiKey}`
            );

            if (!res.ok) continue;

            const data = await res.json();

            for (const item of data.items || []) {
                const duration = YoutubeService.parseISO8601Duration(item.contentDetails?.duration || '');
                if (duration) {
                    await Video.findOneAndUpdate(
                        { youtubeId: item.id },
                        { $set: { duration } }
                    );
                    updatedCount++;
                }
            }
        }

        return apiSuccess({ updated: updatedCount, total: videosWithoutDuration.length }, `Updated duration for ${updatedCount} videos`);
    } catch (error) {
        console.error('Sync duration error:', error);
        return apiError('SYNC_DURATION_FAILED', 'Failed to sync video durations', 500);
    }
}
