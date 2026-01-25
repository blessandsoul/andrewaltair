export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { CommunicationService } from '@/services/communication.service';
import { getUserFromRequest } from '@/lib/server-auth';

// GET - List all comments
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const params = {
            postId: searchParams.get('postId'),
            status: searchParams.get('status'),
            limit: parseInt(searchParams.get('limit') || '50'),
            page: parseInt(searchParams.get('page') || '1'),
        };

        const result = await CommunicationService.getComments(params);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Get comments error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch comments' }, { status: 500 });
    }
}

// POST - Create a new comment
export async function POST(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'ავტორიზაცია აუცილებელია' }, { status: 401 });
        }

        const body = await request.json();
        const comment = await CommunicationService.createComment(body, user);

        return NextResponse.json({ success: true, comment });
    } catch (error: any) {
        console.error('Create comment error:', error);
        return NextResponse.json({ error: error.message || 'Failed to create comment' }, { status: 400 });
    }
}
