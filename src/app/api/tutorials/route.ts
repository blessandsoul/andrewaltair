export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { TutorialService } from '@/services/tutorial.service';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status') || undefined;
        const limit = parseInt(searchParams.get('limit') || '10');

        const tutorials = await TutorialService.getAllTutorials({ status, limit });

        return NextResponse.json(tutorials);
    } catch (error) {
        console.error('Error fetching tutorials:', error);
        return NextResponse.json({ error: 'Failed to fetch tutorials' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    // 🛡️ ADMIN ONLY (Implicit - usually protected by middleware or layout check, but adding inline check is better)
    // Original code had commented out session check.
    // I'll add verifyAdmin import.
    const { verifyAdmin, unauthorizedResponse } = await import('@/lib/admin-auth');
    if (!verifyAdmin(req)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const body = await req.json();

        if (!body.title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const tutorial = await TutorialService.createTutorial(body);
        return NextResponse.json(tutorial, { status: 201 });
    } catch (error) {
        console.error('Error creating tutorial:', error);
        return NextResponse.json({ error: 'Failed to create tutorial' }, { status: 500 });
    }
}
