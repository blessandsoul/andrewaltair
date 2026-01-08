import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EncyclopediaArticle from '@/models/EncyclopediaArticle';
import EncyclopediaVersion from '@/models/EncyclopediaVersion';

// GET single article
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        // Support both ObjectId and slug lookup
        const isObjectId = /^[a-f\d]{24}$/i.test(params.id);
        const query = isObjectId ? { _id: params.id } : { slug: params.id };

        const article = await EncyclopediaArticle.findOne(query)
            .populate('sectionId', 'title slug gradientFrom gradientTo')
            .populate('categoryId', 'title slug icon')
            .lean();

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        // Increment views
        await EncyclopediaArticle.findByIdAndUpdate(article._id, { $inc: { views: 1 } });

        return NextResponse.json({ article });
    } catch (error) {
        console.error('Error fetching article:', error);
        return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
    }
}

// PUT update article
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const body = await request.json();

        const existingArticle = await EncyclopediaArticle.findById(params.id);
        if (!existingArticle) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        // Check if content changed -> create new version
        const contentChanged = body.content && body.content !== existingArticle.content;

        // Auto-calculate fields if content changed
        if (contentChanged) {
            body.excerpt = body.excerpt || body.content.substring(0, 200).replace(/[#*`]/g, '') + '...';
            body.estimatedMinutes = Math.ceil(body.content.split(/\s+/).length / 200);
            body.version = existingArticle.version + 1;
        }

        // Extract YouTube video ID if URL provided
        if (body.videoUrl && !body.videoId) {
            const match = body.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
            body.videoId = match ? match[1] : undefined;
        }

        // Update publishedAt if publishing for first time
        if (body.isPublished && !existingArticle.isPublished) {
            body.publishedAt = new Date();
        }

        const article = await EncyclopediaArticle.findByIdAndUpdate(
            params.id,
            { $set: body },
            { new: true, runValidators: true }
        );

        // Create version history if content changed
        if (contentChanged) {
            await EncyclopediaVersion.create({
                articleId: article!._id,
                version: article!.version,
                title: article!.title,
                content: article!.content,
                changedBy: body.changedBy || 'Admin',
                changeNote: body.changeNote || 'Content updated',
            });
        }

        return NextResponse.json({ article });
    } catch (error) {
        console.error('Error updating article:', error);
        return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
    }
}

// DELETE article
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const article = await EncyclopediaArticle.findByIdAndDelete(params.id);
        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        // Also delete version history
        await EncyclopediaVersion.deleteMany({ articleId: params.id });

        return NextResponse.json({ message: 'Article deleted' });
    } catch (error) {
        console.error('Error deleting article:', error);
        return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
    }
}
