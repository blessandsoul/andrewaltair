export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EncyclopediaArticle from '@/models/EncyclopediaArticle';
import EncyclopediaVersion from '@/models/EncyclopediaVersion';

// GET all articles (with filters)
export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const sectionId = searchParams.get('sectionId');
        const categoryId = searchParams.get('categoryId');
        const published = searchParams.get('published');
        const limit = parseInt(searchParams.get('limit') || '100');

        const query: Record<string, unknown> = {};
        if (sectionId) query.sectionId = sectionId;
        if (categoryId) query.categoryId = categoryId;
        if (published === 'true') query.isPublished = true;

        const articles = await EncyclopediaArticle.find(query)
            .sort({ order: 1 })
            .limit(limit)
            .populate('sectionId', 'title slug')
            .populate('categoryId', 'title slug icon')
            .lean();

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
        await dbConnect();
        const body = await request.json();

        // Auto-generate excerpt if not provided
        const excerpt = body.excerpt || body.content?.substring(0, 200).replace(/[#*`]/g, '') + '...';

        // Calculate reading time
        const wordCount = (body.content || '').split(/\s+/).length;
        const estimatedMinutes = Math.ceil(wordCount / 200);

        // Extract YouTube video ID if URL provided
        let videoId = body.videoId;
        if (body.videoUrl && !videoId) {
            const match = body.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
            videoId = match ? match[1] : undefined;
        }

        const article = await EncyclopediaArticle.create({
            slug: body.slug,
            title: body.title,
            content: body.content,
            excerpt,
            sectionId: body.sectionId,
            categoryId: body.categoryId,
            author: body.author || { name: 'Andrew Altair', avatar: '/images/andrew-avatar.jpg', role: 'AI Expert' },
            isFree: body.isFree ?? false,
            isPublished: body.isPublished ?? false,
            order: body.order || 0,
            difficulty: body.difficulty || 'beginner',
            estimatedMinutes,
            videoUrl: body.videoUrl,
            videoId,
            tags: body.tags || [],
            publishedAt: body.isPublished ? new Date() : undefined,
        });

        // Create initial version
        await EncyclopediaVersion.create({
            articleId: article._id,
            version: 1,
            title: article.title,
            content: article.content,
            changedBy: 'Admin',
            changeNote: 'Initial version',
        });

        return NextResponse.json({ article }, { status: 201 });
    } catch (error) {
        console.error('Error creating article:', error);
        return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
    }
}

