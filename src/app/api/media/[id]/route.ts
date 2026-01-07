import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Media from '@/models/Media';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get a single media item (serves image binary if data exists)
export async function GET(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;

        // Try to find by ID first, then by name
        let media = await Media.findById(id).lean();
        if (!media) {
            media = await Media.findOne({ name: id }).lean();
        }

        if (!media) {
            return NextResponse.json({ error: 'Media not found' }, { status: 404 });
        }

        // If media has base64 data, serve as binary image
        if (media.data) {
            const buffer = Buffer.from(media.data, 'base64');
            return new NextResponse(buffer, {
                status: 200,
                headers: {
                    'Content-Type': media.mimeType || 'image/jpeg',
                    'Cache-Control': 'public, max-age=31536000, immutable',
                    'Content-Length': buffer.length.toString(),
                },
            });
        }

        // Fallback: return JSON metadata (for API clients)
        return NextResponse.json({
            media: { ...media, id: media._id.toString() },
        });
    } catch (error) {
        console.error('Get media error:', error);
        return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
    }
}

// PUT - Update a media item
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        const data = await request.json();
        delete data.id;
        delete data._id;

        const media = await Media.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        ).lean();

        if (!media) {
            return NextResponse.json({ error: 'Media not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            media: { ...media, id: media._id.toString() },
        });
    } catch (error) {
        console.error('Update media error:', error);
        return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
    }
}

// DELETE - Delete a media item
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        const media = await Media.findByIdAndDelete(id);

        if (!media) {
            return NextResponse.json({ error: 'Media not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Media deleted successfully' });
    } catch (error) {
        console.error('Delete media error:', error);
        return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
    }
}
