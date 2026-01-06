import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Folder from '@/models/Folder';

// GET - List all folders
export async function GET() {
    try {
        await dbConnect();
        const folders = await Folder.find({}).sort({ name: 1 }).lean();
        const transformed = folders.map(f => ({
            ...f,
            id: f._id.toString(),
            _id: undefined,
        }));
        return NextResponse.json({ folders: transformed });
    } catch (error) {
        console.error('Get folders error:', error);
        return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
    }
}

// POST - Create new folder
export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();
        const folder = new Folder(data);
        await folder.save();
        return NextResponse.json({
            success: true,
            folder: { ...folder.toObject(), id: folder._id.toString() },
        });
    } catch (error) {
        console.error('Create folder error:', error);
        return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
    }
}
