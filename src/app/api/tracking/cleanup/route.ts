import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Visitor from '@/models/Visitor'
import Activity from '@/models/Activity'
import Click from '@/models/Click'
import Alert from '@/models/Alert'
import Setting from '@/models/Setting'

// POST - Run data cleanup based on retention settings
// This endpoint should be called by a cron job (e.g., daily)
export async function POST() {
    try {
        await dbConnect()

        // Get retention setting (default 30 days)
        const retentionSetting = await Setting.findOne({ key: 'data_retention_days' })
        const retentionDays = parseInt(retentionSetting?.value || '30')

        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

        // Delete old data
        const [visitorsDeleted, activitiesDeleted, clicksDeleted, alertsDeleted] = await Promise.all([
            Visitor.deleteMany({ lastSeen: { $lt: cutoffDate } }),
            Activity.deleteMany({ createdAt: { $lt: cutoffDate } }),
            Click.deleteMany({ createdAt: { $lt: cutoffDate } }),
            Alert.deleteMany({ createdAt: { $lt: cutoffDate }, isRead: true })
        ])

        const result = {
            success: true,
            retentionDays,
            cutoffDate: cutoffDate.toISOString(),
            deleted: {
                visitors: visitorsDeleted.deletedCount,
                activities: activitiesDeleted.deletedCount,
                clicks: clicksDeleted.deletedCount,
                alerts: alertsDeleted.deletedCount
            }
        }

        console.log('Data cleanup completed:', result)

        return NextResponse.json(result)
    } catch (error) {
        console.error('Cleanup error:', error)
        return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })
    }
}

// GET - Get cleanup status and stats
export async function GET() {
    try {
        await dbConnect()

        const retentionSetting = await Setting.findOne({ key: 'data_retention_days' })
        const retentionDays = parseInt(retentionSetting?.value || '30')

        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

        // Count records that would be deleted
        const [visitorsToDelete, activitiesToDelete, clicksToDelete] = await Promise.all([
            Visitor.countDocuments({ lastSeen: { $lt: cutoffDate } }),
            Activity.countDocuments({ createdAt: { $lt: cutoffDate } }),
            Click.countDocuments({ createdAt: { $lt: cutoffDate } })
        ])

        // Get total counts
        const [totalVisitors, totalActivities, totalClicks] = await Promise.all([
            Visitor.countDocuments(),
            Activity.countDocuments(),
            Click.countDocuments()
        ])

        return NextResponse.json({
            success: true,
            retentionDays,
            cutoffDate: cutoffDate.toISOString(),
            current: {
                visitors: totalVisitors,
                activities: totalActivities,
                clicks: totalClicks
            },
            pendingCleanup: {
                visitors: visitorsToDelete,
                activities: activitiesToDelete,
                clicks: clicksToDelete
            }
        })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to get cleanup status' }, { status: 500 })
    }
}
