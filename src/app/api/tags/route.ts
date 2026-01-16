export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tag from '@/models/Tag';

// GET - List all tags
export async function GET() {
    try {
        await dbConnect();

        const tags = await Tag.find()
            .sort({ count: -1, name: 1 })
            .lean();

        const transformedTags = tags.map(tag => ({
            ...tag,
            id: tag._id.toString(),
            _id: undefined,
        }));

        return NextResponse.json({ tags: transformedTags });
    } catch (error) {
        console.error('Get tags error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tags' },
            { status: 500 }
        );
    }
}

// POST - Create a new tag
export async function POST(request: Request) {
    try {
        await dbConnect();

        const data = await request.json();

        // Generate slug if not provided
        if (!data.slug) {
            data.slug = data.name
                .toLowerCase()
                .replace(/[^a-z0-9\u10A0-\u10FF]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        const tag = new Tag(data);
        await tag.save();

        return NextResponse.json({
            success: true,
            tag: {
                ...tag.toObject(),
                id: tag._id.toString(),
            },
        });
    } catch (error) {
        console.error('Create tag error:', error);
        return NextResponse.json(
            { error: 'Failed to create tag' },
            { status: 500 }
        );
    }
}

