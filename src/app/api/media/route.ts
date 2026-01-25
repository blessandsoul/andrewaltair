export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { MediaService } from '@/services/media.service';

// GET - List all media
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const folder = searchParams.get('folder');
        const type = searchParams.get('type');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};
        if (folder && folder !== 'all') query.folder = folder;
        if (type) query.type = type;

        const media = await MediaService.getAllMedia(query);
        return NextResponse.json({ media });
    } catch (error) {
        console.error('Get media error:', error);
        return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
    }
}

// POST - Create new media
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const media = await MediaService.createMedia(data);
        return NextResponse.json({ success: true, media });
    } catch (error) {
        console.error('Create media error:', error);
        return NextResponse.json({ error: 'Failed to create media' }, { status: 500 });
    }
}
