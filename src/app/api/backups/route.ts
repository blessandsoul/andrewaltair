export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Backup from '@/models/Backup';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';

// GET - List all backups
export async function GET(request: Request) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        await dbConnect();

        const backups = await Backup.find({})
            .sort({ date: -1 })
            .limit(20)
            .lean();

        const transformedBackups = backups.map(b => ({
            ...b,
            id: b._id.toString(),
            date: b.date?.toISOString?.() || b.date,
            _id: undefined,
        }));

        return NextResponse.json({ backups: transformedBackups });
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
        await dbConnect();

        const data = await request.json();

        const backup = new Backup({
            ...data,
            date: new Date(),
            status: 'success',
        });
        await backup.save();

        return NextResponse.json({
            success: true,
            backup: {
                ...backup.toObject(),
                id: backup._id.toString(),
            },
        });
    } catch (error) {
        console.error('Create backup error:', error);
        return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
    }
}

