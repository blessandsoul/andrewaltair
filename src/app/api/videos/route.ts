export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Video from '@/models/Video';

// GET - List all videos with filtering
export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '20');

        // Build query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        if (type) {
            query.type = type;
        }

        if (category) {
            query.category = category;
        }

        const videos = await Video.find(query)
            .sort({ publishedAt: -1 })
            .limit(limit)
            .lean();

        const transformedVideos = videos.map(video => ({
            ...video,
            id: video._id.toString(),
            _id: undefined,
        }));

        return NextResponse.json({ videos: transformedVideos });
    } catch (error) {
        console.error('Get videos error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch videos' },
            { status: 500 }
        );
    }
}

// POST - Create a new video
export async function POST(request: Request) {
    try {
        await dbConnect();

        const data = await request.json();

        const video = new Video(data);
        await video.save();

        return NextResponse.json({
            success: true,
            video: {
                ...video.toObject(),
                id: video._id.toString(),
            },
        });
    } catch (error) {
        console.error('Create video error:', error);
        return NextResponse.json(
            { error: 'Failed to create video' },
            { status: 500 }
        );
    }
}

