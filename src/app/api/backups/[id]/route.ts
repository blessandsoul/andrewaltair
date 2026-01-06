import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Backup from '@/models/Backup';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// DELETE - Delete a backup
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        const backup = await Backup.findByIdAndDelete(id);

        if (!backup) {
            return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Backup deleted successfully' });
    } catch (error) {
        console.error('Delete backup error:', error);
        return NextResponse.json({ error: 'Failed to delete backup' }, { status: 500 });
    }
}
