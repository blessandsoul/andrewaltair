import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Folder from '@/models/Folder';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PUT - Update folder
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        const data = await request.json();
        const folder = await Folder.findByIdAndUpdate(id, data, { new: true }).lean();
        if (!folder) {
            return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, folder: { ...folder, id: folder._id.toString() } });
    } catch (error) {
        console.error('Update folder error:', error);
        return NextResponse.json({ error: 'Failed to update folder' }, { status: 500 });
    }
}

// DELETE - Delete folder
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        await Folder.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete folder error:', error);
        return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
    }
}
