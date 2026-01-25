export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { VibeCodeService } from '@/services/vibecode.service';

// POST /api/vibe-codes - Admin generate
export async function POST(request: NextRequest) {
    const { verifyAdmin, unauthorizedResponse } = await import('@/lib/admin-auth');
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const data = await request.json();
        const result = VibeCodeService.createCode(data);
        return NextResponse.json({ success: true, ...result });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to generate code' }, { status: 500 });
    }
}

// GET /api/vibe-codes?code=XXX - Validate
export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code');

    if (!code) {
        return NextResponse.json({ success: false, error: 'Code is required' }, { status: 400 });
    }

    try {
        const result = VibeCodeService.validateCode(code);
        return NextResponse.json({ success: true, ...result });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}

// DELETE /api/vibe-codes?code=XXX - Admin delete
export async function DELETE(request: NextRequest) {
    const { verifyAdmin, unauthorizedResponse } = await import('@/lib/admin-auth');
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    const code = request.nextUrl.searchParams.get('code');
    if (!code) {
        return NextResponse.json({ success: false, error: 'Code is required' }, { status: 400 });
    }

    const deleted = VibeCodeService.deleteCode(code);
    return NextResponse.json({ success: deleted, message: deleted ? 'Code deleted' : 'Code not found' });
}

// PATCH - List all
export async function PATCH(request: NextRequest) {
    const { verifyAdmin, unauthorizedResponse } = await import('@/lib/admin-auth');
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    const codes = VibeCodeService.getAllCodes();
    return NextResponse.json({ success: true, totalCodes: codes.length, codes });
}
