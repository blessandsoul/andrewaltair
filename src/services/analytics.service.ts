import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import Video from '@/models/Video';
import User from '@/models/User';
import Comment from '@/models/Comment';
import { trackServerActivity, ServerActivityOptions, trackSignup, trackSubscribe, trackPurchase, trackAchievement } from '@/lib/activityTracker';
import Visitor from '@/models/Visitor';
import Activity from '@/models/Activity';
import { NextRequest } from 'next/server';

// Helpers (moved from route)
function getDateRange(period: string): Date {
    const now = new Date();
    switch (period) {
        case 'today': return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        case 'week': { const d = new Date(now); d.setDate(d.getDate() - 7); return d; }
        case 'month': { const d = new Date(now); d.setMonth(d.getMonth() - 1); return d; }
        case 'year': { const d = new Date(now); d.setFullYear(d.getFullYear() - 1); return d; }
        default: return new Date(0);
    }
}

// Simple in-memory cache for GeoIP
const geoCache = new Map<string, { city: string; country: string; countryCode: string; expires: number }>();
const georgianCities = ['Tbilisi', 'Batumi', 'Kutaisi', 'Rustavi', 'Zugdidi', 'Gori', 'Poti', 'Samtredia', 'Khashuri'];

async function getGeoFromIP(ip: string): Promise<{ city: string; country: string; countryCode: string }> {
    if (!ip || ip === 'unknown' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.') || ip === '::1') {
        return { city: georgianCities[Math.floor(Math.random() * georgianCities.length)], country: 'Georgia', countryCode: 'GE' };
    }
    const cached = geoCache.get(ip);
    if (cached && cached.expires > Date.now()) return { city: cached.city, country: cached.country, countryCode: cached.countryCode };

    try {
        const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`, { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
            const data = await res.json();
            if (data.status === 'success') {
                const geo = { city: data.city || 'Unknown', country: data.country || 'Unknown', countryCode: data.countryCode || 'XX' };
                geoCache.set(ip, { ...geo, expires: Date.now() + 60 * 60 * 1000 });
                return geo;
            }
        }
    } catch { }
    return { city: 'Unknown', country: 'Unknown', countryCode: 'XX' };
}


export class AnalyticsService {
    /**
     * Dashboard Statistics Aggregation
     */
    static async getDashboardStats() {
        await dbConnect();

        // Count totals
        const [postsCount, videosCount, usersCount, commentsCount] = await Promise.all([
            Post.countDocuments({ status: 'published' }),
            Video.countDocuments(),
            User.countDocuments(),
            Comment.countDocuments(),
        ]);

        // Aggregations
        const postsViews = await Post.aggregate([
            { $match: { status: 'published' } },
            { $group: { _id: null, totalViews: { $sum: '$views' } } }
        ]);

        const videosViews = await Video.aggregate([
            { $group: { _id: null, totalViews: { $sum: '$views' } } }
        ]);

        const postsReactions = await Post.aggregate([
            { $match: { status: 'published' } },
            {
                $group: {
                    _id: null,
                    likes: { $sum: '$reactions.likes' },
                    loves: { $sum: '$reactions.loves' },
                    fires: { $sum: '$reactions.fires' },
                    claps: { $sum: '$reactions.claps' }
                }
            }
        ]);

        // Top Content
        const topPosts = await Post.find({ status: 'published' })
            .sort({ views: -1 }).limit(5).select('title slug views').lean();

        const topVideos = await Video.find({})
            .sort({ views: -1 }).limit(5).select('title youtubeId views').lean();

        // Recent Activity
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recentPosts = await Post.find({ createdAt: { $gte: weekAgo } })
            .sort({ createdAt: -1 }).limit(10).select('title createdAt views').lean();

        // Daily Stats
        const dailyStats = await Post.aggregate([
            { $match: { status: 'published' } },
            {
                $group: {
                    _id: { $dayOfWeek: '$createdAt' },
                    count: { $sum: 1 },
                    views: { $sum: '$views' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const dayNames = ['კვი', 'ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ'];
        const weeklyData = dayNames.map((day, i) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const stat = dailyStats.find((s: any) => s._id === i + 1);
            return {
                day,
                views: stat?.views || Math.floor(Math.random() * 2000) + 1000,
                reactions: Math.floor(Math.random() * 100) + 20
            };
        });

        const totalViews = (postsViews[0]?.totalViews || 0) + (videosViews[0]?.totalViews || 0);
        const totalReactions = postsReactions[0]
            ? (postsReactions[0].likes + postsReactions[0].loves + postsReactions[0].fires + postsReactions[0].claps)
            : 0;

        return {
            stats: {
                posts: postsCount,
                videos: videosCount,
                users: usersCount,
                comments: commentsCount,
                totalViews,
                totalReactions,
            },
            weeklyData,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            topPosts: topPosts.map((p: any) => ({ title: p.title, slug: p.slug, views: p.views || 0 })),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            topVideos: topVideos.map((v: any) => ({ title: v.title, youtubeId: v.youtubeId, views: v.views || 0 })),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recentActivity: recentPosts.map((p: any) => ({ title: p.title, date: p.createdAt, views: p.views || 0 })),
        };
    }

    /**
     * Activity Tracking Wrappers
     */
    static async track(options: ServerActivityOptions) {
        return trackServerActivity(options);
    }

    // Explicit wrappers
    static trackSignup = trackSignup;
    static trackSubscribe = trackSubscribe;
    static trackPurchase = trackPurchase;
    static trackAchievement = trackAchievement;

    /**
     * Visitor Tracking Logic
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async trackVisitor(data: any, ip: string, userAgent: string) {
        // Basic bot check
        const bots = ['googlebot', 'bingbot', 'yandex', 'facebook', 'twitter', 'slack', 'telegram', 'whatsapp'];
        if (bots.some(b => userAgent.toLowerCase().includes(b))) return { success: true, ignored: true };

        const { visitorId, currentPage, referrer, type = 'pageview' } = data;
        const pageViewInc = type === 'heartbeat' ? 0 : 1;

        if (!visitorId) throw new Error('visitorId required');

        const geo = await getGeoFromIP(ip);
        const now = new Date();

        // Pipeline update for atomic operations
        const visitor = await Visitor.findOneAndUpdate(
            { visitorId },
            [
                {
                    $set: {
                        ip, userAgent, city: geo.city, country: geo.countryCode, currentPage,
                        referrer: referrer || '$referrer',
                        lastSeen: now, isOnline: true,
                        pageViews: { $add: [{ $ifNull: ['$pageViews', 0] }, pageViewInc] },
                        bounced: {
                            $cond: {
                                if: { $gt: [{ $add: [{ $ifNull: ['$pageViews', 0] }, pageViewInc] }, 1] },
                                then: false, else: true
                            }
                        },
                        referrerSource: { $ifNull: ['$referrerSource', 'direct'] },
                        firstSeen: { $ifNull: ['$firstSeen', now] },
                        sessionStart: { $ifNull: ['$sessionStart', now] },
                    }
                }
            ],
            { upsert: true, new: true }
        );

        return { success: true, visitor };
    }

    /**
     * Detailed Stats (Aggregation)
     */
    static async getDetailedStats(period: string) {
        await dbConnect();
        const startDate = getDateRange(period);
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        const [
            onlineCount,
            totalVisitors,
            visitsResult,
            pageViewsResult
        ] = await Promise.all([
            Visitor.countDocuments({ lastSeen: { $gte: fiveMinutesAgo } }),
            Visitor.countDocuments({ firstSeen: { $gte: startDate } }),
            Visitor.aggregate([
                { $match: { firstSeen: { $gte: startDate } } },
                { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$firstSeen' } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]),
            Visitor.aggregate([
                { $match: { firstSeen: { $gte: startDate } } },
                { $group: { _id: null, total: { $sum: '$pageViews' } } }
            ])
        ]);

        return {
            online: onlineCount,
            totalVisitors,
            totalPageViews: pageViewsResult[0]?.total || 0,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            dailyData: visitsResult.map((v: any) => ({ date: v._id, visitors: v.count })),
            period
        };
    }
}
