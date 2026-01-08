import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EncyclopediaArticle from '@/models/EncyclopediaArticle';

// GET global search across all articles
export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const limit = parseInt(searchParams.get('limit') || '20');

        if (!query || query.length < 2) {
            return NextResponse.json({ articles: [] });
        }

        // Use text search for better relevance
        const articles = await EncyclopediaArticle.find(
            {
                $text: { $search: query },
                isPublished: true,
            },
            {
                score: { $meta: 'textScore' },
            }
        )
            .sort({ score: { $meta: 'textScore' } })
            .limit(limit)
            .populate('sectionId', 'title slug gradientFrom gradientTo')
            .populate('categoryId', 'title slug icon')
            .select('slug title excerpt sectionId categoryId difficulty estimatedMinutes isFree')
            .lean();

        return NextResponse.json({ articles, query });
    } catch (error) {
        // Fallback to regex search if text index not available
        try {
            const { searchParams } = new URL(request.url);
            const query = searchParams.get('q') || '';
            const limit = parseInt(searchParams.get('limit') || '20');

            const articles = await EncyclopediaArticle.find({
                isPublished: true,
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { content: { $regex: query, $options: 'i' } },
                    { excerpt: { $regex: query, $options: 'i' } },
                ],
            })
                .limit(limit)
                .populate('sectionId', 'title slug gradientFrom gradientTo')
                .populate('categoryId', 'title slug icon')
                .select('slug title excerpt sectionId categoryId difficulty estimatedMinutes isFree')
                .lean();

            return NextResponse.json({ articles, query });
        } catch (fallbackError) {
            console.error('Search error:', fallbackError);
            return NextResponse.json({ error: 'Search failed' }, { status: 500 });
        }
    }
}
