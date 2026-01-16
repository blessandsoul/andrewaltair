export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Redirect from '@/models/Redirect';

// GET - List all redirects
export async function GET() {
    try {
        await dbConnect();

        const redirects = await Redirect.find({})
            .sort({ hits: -1 })
            .lean();

        const transformedRedirects = redirects.map(r => ({
            ...r,
            id: r._id.toString(),
            _id: undefined,
        }));

        return NextResponse.json({ redirects: transformedRedirects });
    } catch (error) {
        console.error('Get redirects error:', error);
        return NextResponse.json({ error: 'Failed to fetch redirects' }, { status: 500 });
    }
}

// POST - Create new redirect
export async function POST(request: Request) {
    try {
        await dbConnect();

        const data = await request.json();

        const redirect = new Redirect(data);
        await redirect.save();

        return NextResponse.json({
            success: true,
            redirect: {
                ...redirect.toObject(),
                id: redirect._id.toString(),
            },
        });
    } catch (error) {
        console.error('Create redirect error:', error);
        return NextResponse.json({ error: 'Failed to create redirect' }, { status: 500 });
    }
}

