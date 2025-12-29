import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tag from '@/models/Tag';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get a single tag
export async function GET(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        const tag = await Tag.findById(id).lean();

        if (!tag) {
            return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
        }

        return NextResponse.json({
            tag: { ...tag, id: tag._id.toString() },
        });
    } catch (error) {
        console.error('Get tag error:', error);
        return NextResponse.json({ error: 'Failed to fetch tag' }, { status: 500 });
    }
}

// PUT - Update a tag
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        const data = await request.json();
        delete data.id;
        delete data._id;

        const tag = await Tag.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        ).lean();

        if (!tag) {
            return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            tag: { ...tag, id: tag._id.toString() },
        });
    } catch (error) {
        console.error('Update tag error:', error);
        return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });
    }
}

// DELETE - Delete a tag
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        const tag = await Tag.findByIdAndDelete(id);

        if (!tag) {
            return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Tag deleted successfully' });
    } catch (error) {
        console.error('Delete tag error:', error);
        return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
    }
}
