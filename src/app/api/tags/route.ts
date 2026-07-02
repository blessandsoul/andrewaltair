export const dynamic = 'force-dynamic'
import { TaxonomyService } from '@/services/taxonomy.service';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { verifyAdmin } from '@/lib/admin-auth';

// GET - List all tags
export async function GET() {
    try {
        const tags = await TaxonomyService.getAllTags();
        return apiSuccess(tags, 'Tags retrieved');
    } catch (error) {
        console.error('Get tags error:', error);
        return apiError(ERROR_CODES.TAG_FETCH_FAILED, 'Failed to fetch tags', 500);
    }
}

// POST - Create a new tag
export async function POST(request: Request) {
    if (!verifyAdmin(request)) {
        return apiError(ERROR_CODES.ADMIN_UNAUTHORIZED, 'Admin access required', 401);
    }
    try {
        const data = await request.json();
        const tag = await TaxonomyService.createTag(data);
        return apiSuccess(tag, 'Tag created', 201);
    } catch (error) {
        console.error('Create tag error:', error);
        return apiError(ERROR_CODES.TAG_CREATE_FAILED, 'Failed to create tag', 500);
    }
}
