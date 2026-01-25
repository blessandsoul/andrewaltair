export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { SystemService } from '@/services/system.service';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';

// GET - List all backups
export async function GET(request: Request) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const backups = await SystemService.getAllBackups();
        return NextResponse.json({ backups });
    } catch (error) {
        console.error('Get backups error:', error);
        return NextResponse.json({ error: 'Failed to fetch backups' }, { status: 500 });
    }
}

// POST - Create new backup
export async function POST(request: Request) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const data = await request.json();
        const backup = await SystemService.createBackup(data);
        return NextResponse.json({ success: true, backup });
    } catch (error) {
        console.error('Create backup error:', error);
        return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
    }
}
