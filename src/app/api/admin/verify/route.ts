export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
    try {
        const isValid = verifyAdmin(request);

        if (!isValid) {
            return NextResponse.json(
                { valid: false, error: 'Invalid or expired session' },
                { status: 401 }
            );
        }

        return NextResponse.json({ valid: true });
    } catch (error) {
        console.error('Admin verify error:', error);
        return NextResponse.json(
            { valid: false, error: 'Verification failed' },
            { status: 500 }
        );
    }
}

