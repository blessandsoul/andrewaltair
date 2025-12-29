import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ErrorLog from '@/models/ErrorLog';

// GET - List error logs
export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const level = searchParams.get('level');

        const query: Record<string, string> = {};
        if (level && level !== 'all') query.level = level;

        const logs = await ErrorLog.find(query).sort({ createdAt: -1 }).limit(100).lean();
        const transformed = logs.map(l => ({
            ...l,
            id: l._id.toString(),
            time: l.createdAt,
            _id: undefined,
        }));
        return NextResponse.json({ logs: transformed });
    } catch (error) {
        console.error('Get error logs error:', error);
        return NextResponse.json({ error: 'Failed to fetch error logs' }, { status: 500 });
    }
}

// POST - Create error log
export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();
        const log = new ErrorLog(data);
        await log.save();
        return NextResponse.json({
            success: true,
            log: { ...log.toObject(), id: log._id.toString() },
        });
    } catch (error) {
        console.error('Create error log error:', error);
        return NextResponse.json({ error: 'Failed to create error log' }, { status: 500 });
    }
}

// DELETE - Clear all logs
export async function DELETE() {
    try {
        await dbConnect();
        await ErrorLog.deleteMany({});
        return NextResponse.json({ success: true, message: 'All logs cleared' });
    } catch (error) {
        console.error('Clear logs error:', error);
        return NextResponse.json({ error: 'Failed to clear logs' }, { status: 500 });
    }
}
