export const dynamic = 'force-dynamic'
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { MediaService } from '@/services/media.service';
import { verifyAdmin } from '@/lib/admin-auth';

// GET - List all videos with filtering
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '20');

        const query: Record<string, string> = {};
        if (type) query.type = type;
        if (category) query.category = category;

        const videos = await MediaService.getAllVideos(query, limit);
        return apiSuccess(videos, 'Videos fetched successfully');
    } catch (error) {
        console.error('Get videos error:', error);
        return apiError(ERROR_CODES.VIDEO_FETCH_FAILED, 'Failed to fetch videos', 500);
    }
}

// POST - Create a new video
export async function POST(request: Request) {
    if (!verifyAdmin(request)) {
        return apiError(ERROR_CODES.ADMIN_UNAUTHORIZED, 'Admin access required', 401);
    }
    try {
        const data = await request.json();
        const video = await MediaService.createVideo(data);
        return apiSuccess(video, 'Video created successfully', 201);
    } catch (error) {
        console.error('Create video error:', error);
        return apiError(ERROR_CODES.VIDEO_CREATE_FAILED, 'Failed to create video', 500);
    }
}
