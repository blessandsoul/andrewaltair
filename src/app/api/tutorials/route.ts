export const dynamic = 'force-dynamic'
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { TutorialService } from '@/services/tutorial.service';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status') || undefined;
        const limit = parseInt(searchParams.get('limit') || '10');

        const tutorials = await TutorialService.getAllTutorials({ status, limit });

        return apiSuccess(tutorials, 'Tutorials fetched successfully');
    } catch (error) {
        console.error('Error fetching tutorials:', error);
        return apiError(ERROR_CODES.TUTORIAL_FETCH_FAILED, 'Failed to fetch tutorials', 500);
    }
}

export async function POST(req: Request) {
    // 🛡️ ADMIN ONLY (Implicit - usually protected by middleware or layout check, but adding inline check is better)
    // Original code had commented out session check.
    // I'll add verifyAdmin import.
    const { verifyAdmin, unauthorizedResponse } = await import('@/lib/admin-auth');
    if (!verifyAdmin(req)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const body = await req.json();

        if (!body.title) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Title is required', 400);
        }

        const tutorial = await TutorialService.createTutorial(body);
        return apiSuccess(tutorial, 'Tutorial created successfully', 201);
    } catch (error) {
        console.error('Error creating tutorial:', error);
        return apiError(ERROR_CODES.TUTORIAL_CREATE_FAILED, 'Failed to create tutorial', 500);
    }
}
