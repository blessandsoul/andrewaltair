export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { EncyclopediaService } from '@/services/encyclopedia.service';

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

        return NextResponse.json({ articles });
    } catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
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
        return NextResponse.json({ article }, { status: 201 });
    } catch (error) {
        console.error('Error creating article:', error);
        return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
    }
}
