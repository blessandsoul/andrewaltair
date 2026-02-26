export const dynamic = 'force-dynamic'
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { CommunicationService } from '@/services/communication.service';
import { getUserFromRequest } from '@/lib/server-auth';

// GET - List all comments
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const params = {
            postId: searchParams.get('postId') ?? undefined,
            status: searchParams.get('status') ?? undefined,
            limit: parseInt(searchParams.get('limit') || '50'),
            page: parseInt(searchParams.get('page') || '1'),
        };

        const result = await CommunicationService.getComments(params as Parameters<typeof CommunicationService.getComments>[0]);
        return apiSuccess(result, 'Comments fetched successfully');
    } catch (error: unknown) {
        console.error('Get comments error:', error);
        return apiError(ERROR_CODES.COMMENT_FETCH_FAILED, error instanceof Error ? error.message : 'Failed to fetch comments', 500);
    }
}

// POST - Create a new comment
export async function POST(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'ავტორიზაცია აუცილებელია', 401);
        }

        const body = await request.json();
        const comment = await CommunicationService.createComment(body, user);

        return apiSuccess(comment, 'Comment created successfully', 201);
    } catch (error: unknown) {
        console.error('Create comment error:', error);
        return apiError(ERROR_CODES.COMMENT_CREATE_FAILED, error instanceof Error ? error.message : 'Failed to create comment', 400);
    }
}
