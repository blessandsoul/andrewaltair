import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Redirect from '@/models/Redirect';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// DELETE - Delete a redirect
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;
        const redirect = await Redirect.findByIdAndDelete(id);

        if (!redirect) {
            return NextResponse.json({ error: 'Redirect not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Redirect deleted successfully' });
    } catch (error) {
        console.error('Delete redirect error:', error);
        return NextResponse.json({ error: 'Failed to delete redirect' }, { status: 500 });
    }
}

// PUT - Increment hit count
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();
        const { id } = await params;

        const redirect = await Redirect.findByIdAndUpdate(
            id,
            { $inc: { hits: 1 } },
            { new: true }
        ).lean();

        if (!redirect) {
            return NextResponse.json({ error: 'Redirect not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            redirect: { ...redirect, id: redirect._id.toString() },
        });
    } catch (error) {
        console.error('Update redirect error:', error);
        return NextResponse.json({ error: 'Failed to update redirect' }, { status: 500 });
    }
}
