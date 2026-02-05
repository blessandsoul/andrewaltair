import mongoose from 'mongoose';

import dbConnect from '@/lib/db';
import Backup from '@/models/Backup';
import ErrorLog from '@/models/ErrorLog';

export class SystemService {
    /**
     * --- BACKUPS ---
     */
    static async getAllBackups() {
        await dbConnect();
        const backups = await Backup.find({})
            .sort({ date: -1 })
            .limit(20)
            .lean();

        return backups.map((b) => ({
            ...b,
            id: (b._id as mongoose.Types.ObjectId).toString(),
            date: b.date?.toISOString?.() || b.date,
            _id: undefined,
        }));
    }

    static async createBackup(data: { size?: string; sizeBytes?: number; type?: 'auto' | 'manual' }) {
        await dbConnect();
        const backup = new Backup({
            ...data,
            date: new Date(),
            status: 'success', // Logic for actual backup would go here or be processed by separate worker
        });
        await backup.save();
        return { ...backup.toObject(), id: backup._id.toString() };
    }

    /**
     * --- ERROR LOGS ---
     */
    static async getErrorLogs(level?: string) {
        await dbConnect();
        const query: Record<string, string> = {};
        if (level && level !== 'all') query.level = level;

        const logs = await ErrorLog.find(query).sort({ createdAt: -1 }).limit(100).lean();
        return logs.map((l) => ({
            ...l,
            id: (l._id as mongoose.Types.ObjectId).toString(),
            time: l.createdAt,
            _id: undefined,
        }));
    }

    static async createErrorLog(data: { level?: 'error' | 'warning' | 'info'; message: string; source?: string }) {
        await dbConnect();
        const log = new ErrorLog(data);
        await log.save();
        return { ...log.toObject(), id: log._id.toString() };
    }

    static async clearErrorLogs() {
        await dbConnect();
        const result = await ErrorLog.deleteMany({});
        return { deletedCount: result.deletedCount };
    }
}
