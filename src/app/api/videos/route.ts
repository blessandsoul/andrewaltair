export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { MediaService } from '@/services/media.service';

// GET - List all videos with filtering
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '20');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};
        if (type) query.type = type;
        if (category) query.category = category;

        const videos = await MediaService.getAllVideos(query, limit);
        return NextResponse.json({ videos });
    } catch (error) {
        console.error('Get videos error:', error);
        return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
    }
}

// POST - Create a new video
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const video = await MediaService.createVideo(data);
        return NextResponse.json({ success: true, video });
    } catch (error) {
        console.error('Create video error:', error);
        return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
    }
}
