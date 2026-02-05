export const dynamic = 'force-dynamic'
import { TaxonomyService } from '@/services/taxonomy.service';
import { verifyAdmin } from '@/lib/admin-auth';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// GET - List all categories
export async function GET() {
    try {
        const categories = await TaxonomyService.getAllCategories();
        return apiSuccess(categories, 'Categories retrieved');
    } catch (error) {
        console.error('Get categories error:', error);
        return apiError(ERROR_CODES.CATEGORY_FETCH_FAILED, 'Failed to fetch categories', 500);
    }
}

// POST - Create a new category
export async function POST(request: Request) {
    if (!verifyAdmin(request)) {
        return apiError(ERROR_CODES.ADMIN_UNAUTHORIZED, 'Admin access required', 401);
    }

    try {
        const data = await request.json();
        const category = await TaxonomyService.createCategory(data);
        return apiSuccess(category, 'Category created', 201);
    } catch (error) {
        console.error('Create category error:', error);
        return apiError(ERROR_CODES.CATEGORY_CREATE_FAILED, 'Failed to create category', 500);
    }
}
