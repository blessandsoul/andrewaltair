export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { EncyclopediaService } from '@/services/encyclopedia.service';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// GET all articles (with filters)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const sectionId = searchParams.get('sectionId');
        const categoryId = searchParams.get('categoryId');
        const published = searchParams.get('published') === 'true';
        const limit = parseInt(searchParams.get('limit') || '100');

        const articles = await EncyclopediaService.getAllArticles({
            sectionId,
            categoryId,
            published,
            limit
        });

        return apiSuccess(articles, 'Articles fetched successfully');
    } catch (error) {
        console.error('Error fetching articles:', error);
        return apiError(ERROR_CODES.ENCYCLOPEDIA_FETCH_FAILED, 'Failed to fetch articles', 500);
    }
}

// POST create new article
export async function POST(request: NextRequest) {
    // 🛡️ ADMIN ONLY
    const { verifyAdmin, unauthorizedResponse } = await import('@/lib/admin-auth');
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const body = await request.json();
        const article = await EncyclopediaService.createArticle(body);
        return apiSuccess(article, 'Article created successfully', 201);
    } catch (error) {
        console.error('Error creating article:', error);
        return apiError(ERROR_CODES.ENCYCLOPEDIA_CREATE_FAILED, 'Failed to create article', 500);
    }
}
