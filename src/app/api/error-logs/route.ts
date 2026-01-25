export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { SystemService } from '@/services/system.service';

// GET - List error logs
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const level = searchParams.get('level') || undefined;

        const logs = await SystemService.getErrorLogs(level);
        return NextResponse.json({ logs });
    } catch (error) {
        console.error('Get error logs error:', error);
        return NextResponse.json({ error: 'Failed to fetch error logs' }, { status: 500 });
    }
}

// POST - Create error log
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const log = await SystemService.createErrorLog(data);
        return NextResponse.json({ success: true, log });
    } catch (error) {
        console.error('Create error log error:', error);
        return NextResponse.json({ error: 'Failed to create error log' }, { status: 500 });
    }
}

// DELETE - Clear all logs
export async function DELETE() {
    try {
        await SystemService.clearErrorLogs();
        return NextResponse.json({ success: true, message: 'All logs cleared' });
    } catch (error) {
        console.error('Clear logs error:', error);
        return NextResponse.json({ error: 'Failed to clear logs' }, { status: 500 });
    }
}
