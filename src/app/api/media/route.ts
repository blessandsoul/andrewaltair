export const dynamic = 'force-dynamic'
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { MediaService } from '@/services/media.service';

// GET - List all media
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const folder = searchParams.get('folder');
        const type = searchParams.get('type');

        const query: Record<string, string> = {};
        if (folder && folder !== 'all') query.folder = folder;
        if (type) query.type = type;

        const media = await MediaService.getAllMedia(query);
        return apiSuccess({ media }, 'Media fetched successfully');
    } catch (error) {
        console.error('Get media error:', error);
        return apiError(ERROR_CODES.MEDIA_FETCH_FAILED, 'Failed to fetch media', 500);
    }
}

// POST - Create new media
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const media = await MediaService.createMedia(data);
        return apiSuccess({ media }, 'Media created successfully');
    } catch (error) {
        console.error('Create media error:', error);
        return apiError(ERROR_CODES.MEDIA_UPLOAD_FAILED, 'Failed to create media', 500);
    }
}
