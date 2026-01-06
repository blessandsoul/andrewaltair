import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Media from '@/models/Media';

// GET - List all media
export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const folder = searchParams.get('folder');
        const type = searchParams.get('type');

        // Build query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        if (folder && folder !== 'all') {
            query.folder = folder;
        }

        if (type) {
            query.type = type;
        }

        const media = await Media.find(query)
            .sort({ uploadedAt: -1 })
            .lean();

        const transformedMedia = media.map(m => ({
            ...m,
            id: m._id.toString(),
            uploadedAt: m.uploadedAt?.toISOString?.()?.split('T')[0] || m.uploadedAt,
            _id: undefined,
        }));

        return NextResponse.json({ media: transformedMedia });
    } catch (error) {
        console.error('Get media error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch media' },
            { status: 500 }
        );
    }
}

// POST - Create new media
export async function POST(request: Request) {
    try {
        await dbConnect();

        const data = await request.json();

        const media = new Media({
            ...data,
            uploadedAt: new Date(),
        });
        await media.save();

        return NextResponse.json({
            success: true,
            media: {
                ...media.toObject(),
                id: media._id.toString(),
            },
        });
    } catch (error) {
        console.error('Create media error:', error);
        return NextResponse.json(
            { error: 'Failed to create media' },
            { status: 500 }
        );
    }
}
