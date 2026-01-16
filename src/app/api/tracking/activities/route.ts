export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Activity, { ActivityType } from '@/models/Activity'

// Georgian names for anonymous visitors
const GEORGIAN_NAMES = [
    'გიორგი', 'თამარ', 'ნიკოლოზ', 'მარიამ', 'ალექსანდრე',
    'ნინო', 'დავით', 'ანა', 'ლუკა', 'სოფია',
    'ბექა', 'ელენე', 'გურამ', 'ნატა', 'ზურაბ',
    'ეკა', 'ვახტანგ', 'თეა', 'ირაკლი', 'ქეთი'
]

const GEORGIAN_CITIES = [
    'თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'გორი',
    'ზუგდიდი', 'ფოთი', 'თელავი', 'მცხეთა', 'ახალციხე'
]

// Generate avatar URL
function getRandomAvatar() {
    const gender = Math.random() > 0.5 ? 'men' : 'women'
    const id = Math.floor(Math.random() * 70) + 1
    return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`
}

// POST - Record a new activity
export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const body = await request.json()
        const {
            type,
            visitorId,
            userId,
            displayName,
            avatarUrl,
            city,
            targetType,
            targetId,
            targetTitle,
            targetSlug,
            metadata,
            isPublic = true
        } = body

        if (!type) {
            return NextResponse.json({ error: 'type required' }, { status: 400 })
        }

        // Create activity
        const activity = await Activity.create({
            type,
            visitorId,
            userId,
            displayName: displayName || GEORGIAN_NAMES[Math.floor(Math.random() * GEORGIAN_NAMES.length)],
            avatarUrl: avatarUrl || getRandomAvatar(),
            city: city || GEORGIAN_CITIES[Math.floor(Math.random() * GEORGIAN_CITIES.length)],
            country: 'GE',
            targetType,
            targetId,
            targetTitle,
            targetSlug,
            metadata,
            isPublic,
        })

        return NextResponse.json({
            success: true,
            activity: {
                id: activity._id,
                type: activity.type,
                displayName: activity.displayName,
            }
        })
    } catch (error) {
        console.error('Activity recording error:', error)
        return NextResponse.json({ error: 'Recording failed' }, { status: 500 })
    }
}

// GET - Get recent activities for social proof
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)
        const types = searchParams.get('types')?.split(',') as ActivityType[] | undefined
        const since = searchParams.get('since') // ISO timestamp

        const query: Record<string, any> = { isPublic: true }

        if (types && types.length > 0) {
            query.type = { $in: types }
        }

        if (since) {
            query.createdAt = { $gte: new Date(since) }
        }

        const activities = await Activity.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean()

        // Format for frontend
        const formatted = activities.map(a => ({
            id: a._id.toString(),
            type: a.type,
            displayName: a.displayName,
            avatarUrl: a.avatarUrl,
            city: a.city,
            targetType: a.targetType,
            targetTitle: a.targetTitle,
            targetSlug: a.targetSlug,
            metadata: a.metadata,
            createdAt: a.createdAt,
            timeAgo: getTimeAgo(a.createdAt),
        }))

        return NextResponse.json({
            activities: formatted,
            count: formatted.length,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        console.error('Activity fetch error:', error)
        return NextResponse.json({ activities: [], error: 'Failed to fetch' }, { status: 500 })
    }
}

// Helper to format time ago
function getTimeAgo(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)

    if (diffSeconds < 60) return 'ახლახანს'
    if (diffMinutes < 2) return '1 წუთის წინ'
    if (diffMinutes < 60) return `${diffMinutes} წუთის წინ`
    if (diffHours < 2) return '1 საათის წინ'
    if (diffHours < 24) return `${diffHours} საათის წინ`
    return '1 დღის წინ'
}

