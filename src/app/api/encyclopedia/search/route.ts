export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { EncyclopediaService } from '@/services/encyclopedia.service';

// GET global search
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const limit = parseInt(searchParams.get('limit') || '20');

        if (!query || query.length < 2) {
            return NextResponse.json({ articles: [] });
        }

        const articles = await EncyclopediaService.searchArticles(query, limit);

        return NextResponse.json({ articles, query });
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}
