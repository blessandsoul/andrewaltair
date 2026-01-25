export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { SeoService } from '@/services/seo.service';

// GET - Fetch SEO settings
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const key = searchParams.get('key');

        const settings = await SeoService.getSeoSettings({ type, key });

        return NextResponse.json({ settings });
    } catch (error) {
        console.error('Get SEO settings error:', error);
        return NextResponse.json({ error: 'Failed to fetch SEO settings' }, { status: 500 });
    }
}

// POST - Create or update SEO setting (upsert)
export async function POST(request: Request) {
    try {
        const data = await request.json();

        const setting = await SeoService.updateSeoSetting(data);

        return NextResponse.json({
            success: true,
            setting,
        });
    } catch (error) {
        console.error('Save SEO setting error:', error);
        return NextResponse.json({ error: 'Failed to save SEO setting' }, { status: 500 });
    }
}
