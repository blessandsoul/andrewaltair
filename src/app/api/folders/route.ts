export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { TaxonomyService } from '@/services/taxonomy.service';

// GET - List all folders
export async function GET() {
    try {
        const folders = await TaxonomyService.getAllFolders();
        return NextResponse.json({ folders });
    } catch (error) {
        console.error('Get folders error:', error);
        return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
    }
}

// POST - Create new folder
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const folder = await TaxonomyService.createFolder(data);
        return NextResponse.json({ success: true, folder });
    } catch (error) {
        console.error('Create folder error:', error);
        return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
    }
}
