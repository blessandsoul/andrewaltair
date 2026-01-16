export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Seo from '@/models/Seo';

// GET - Fetch SEO settings
export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const key = searchParams.get('key');

        const query: Record<string, string> = {};
        if (type) query.type = type;
        if (key) query.key = key;

        const settings = await Seo.find(query).lean();
        const transformed = settings.map(s => ({
            ...s,
            id: s._id.toString(),
            _id: undefined,
        }));

        return NextResponse.json({ settings: transformed });
    } catch (error) {
        console.error('Get SEO settings error:', error);
        return NextResponse.json({ error: 'Failed to fetch SEO settings' }, { status: 500 });
    }
}

// POST - Create or update SEO setting (upsert)
export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();

        const setting = await Seo.findOneAndUpdate(
            { key: data.key },
            { ...data },
            { new: true, upsert: true }
        ).lean();

        return NextResponse.json({
            success: true,
            setting: { ...setting, id: setting?._id?.toString() },
        });
    } catch (error) {
        console.error('Save SEO setting error:', error);
        return NextResponse.json({ error: 'Failed to save SEO setting' }, { status: 500 });
    }
}

