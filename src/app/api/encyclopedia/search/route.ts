export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { EncyclopediaService } from '@/services/encyclopedia.service';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// GET global search
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const limit = parseInt(searchParams.get('limit') || '20');

        if (!query || query.length < 2) {
            return apiSuccess([], 'Query too short');
        }

        const articles = await EncyclopediaService.searchArticles(query, limit);

        return apiSuccess({ articles, query }, 'Search completed successfully');
    } catch (error) {
        console.error('Search error:', error);
        return apiError(ERROR_CODES.ENCYCLOPEDIA_FETCH_FAILED, 'Search failed', 500);
    }
}
