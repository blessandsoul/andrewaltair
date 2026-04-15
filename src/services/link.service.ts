import crypto from 'crypto'
import mongoose from 'mongoose'
import { NextRequest } from 'next/server'
import * as QRCode from 'qrcode'
import { UAParser } from 'ua-parser-js'
import dbConnect from '@/lib/db'
import { getGeoFromIP } from '@/lib/geo'
import ShortLink from '@/models/ShortLink'
import LinkClick from '@/models/LinkClick'
import LinkGroup from '@/models/LinkGroup'
import type { IShortLink } from '@/models/ShortLink'
import type { ILinkGroup } from '@/models/LinkGroup'

interface CreateLinkInput {
    originalUrl: string
    slug?: string
    title?: string
    fallbackUrl?: string
    expiresAt?: Date | string
    maxClicks?: number
    groupId?: string
    tags?: string[]
    password?: string
    showRedirectPage?: boolean
    redirectPageDelay?: number
    redirectPageMessage?: string
    webhookUrl?: string
    webhookOnFirstClick?: boolean
    webhookOnClickCount?: number
}

interface UpdateLinkInput {
    originalUrl?: string
    slug?: string
    title?: string
    fallbackUrl?: string
    expiresAt?: Date | string | null
    maxClicks?: number | null
    isActive?: boolean
    groupId?: string | null
    tags?: string[]
    password?: string | null
    showRedirectPage?: boolean
    redirectPageDelay?: number
    redirectPageMessage?: string | null
    webhookUrl?: string | null
    webhookOnFirstClick?: boolean
    webhookOnClickCount?: number | null
}

interface GetLinksOptions {
    page?: number
    limit?: number
    search?: string
    isActive?: boolean | null
    groupId?: string | null
    tag?: string | null
}

interface ClicksByDay {
    date: string
    total: number
    unique: number
}

interface GroupCount {
    _id: string
    count: number
}

export interface LinkStats {
    clicksByDay: ClicksByDay[]
    geoBreakdown: GroupCount[]
    deviceBreakdown: GroupCount[]
    browserBreakdown: GroupCount[]
    osBreakdown: GroupCount[]
    referrerBreakdown: GroupCount[]
    utmSources: GroupCount[]
    utmMediums: GroupCount[]
    utmCampaigns: GroupCount[]
}

const SLUG_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'

export class LinkService {
    static generateSlug(length = 6): string {
        return Array.from({ length }, () =>
            SLUG_CHARS[Math.floor(Math.random() * SLUG_CHARS.length)]
        ).join('')
    }

    static async createLink(data: CreateLinkInput): Promise<IShortLink> {
        await dbConnect()

        let slug = data.slug?.trim().toLowerCase()
        if (!slug) {
            for (let i = 0; i < 5; i++) {
                slug = LinkService.generateSlug()
                const exists = await ShortLink.exists({ slug })
                if (!exists) break
                if (i === 4) throw new Error('Failed to generate unique slug')
            }
        } else {
            const exists = await ShortLink.exists({ slug })
            if (exists) throw new Error('Slug already taken')
        }

        return ShortLink.create({
            slug,
            originalUrl: data.originalUrl,
            title: data.title,
            fallbackUrl: data.fallbackUrl || '/',
            expiresAt: data.expiresAt || undefined,
            maxClicks: data.maxClicks || undefined,
            groupId: data.groupId || undefined,
            tags: data.tags || [],
            password: data.password || undefined,
            showRedirectPage: data.showRedirectPage || false,
            redirectPageDelay: data.redirectPageDelay ?? 3,
            redirectPageMessage: data.redirectPageMessage || undefined,
            webhookUrl: data.webhookUrl || undefined,
            webhookOnFirstClick: data.webhookOnFirstClick || false,
            webhookOnClickCount: data.webhookOnClickCount || undefined,
        })
    }

    static async getLinks(options: GetLinksOptions = {}): Promise<{ items: IShortLink[]; total: number }> {
        await dbConnect()
        const { page = 1, limit = 20, search, isActive, groupId, tag } = options

        const query: Record<string, unknown> = {}
        if (isActive !== null && isActive !== undefined) {
            query.isActive = isActive
        }
        if (groupId) {
            query.groupId = new mongoose.Types.ObjectId(groupId)
        }
        if (tag) {
            query.tags = tag
        }
        if (search) {
            const regex = new RegExp(search, 'i')
            query.$or = [{ slug: regex }, { title: regex }, { originalUrl: regex }, { tags: regex }]
        }

        const [items, total] = await Promise.all([
            ShortLink.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('groupId', 'name color')
                .lean(),
            ShortLink.countDocuments(query),
        ])

        return { items: items as IShortLink[], total }
    }

    static async getLinkById(id: string): Promise<IShortLink | null> {
        await dbConnect()
        return ShortLink.findById(id).populate('groupId', 'name color').lean() as Promise<IShortLink | null>
    }

    static async getLinkBySlug(slug: string): Promise<IShortLink | null> {
        await dbConnect()
        return ShortLink.findOne({ slug: slug.toLowerCase() }).lean() as Promise<IShortLink | null>
    }

    static async updateLink(id: string, data: UpdateLinkInput): Promise<IShortLink | null> {
        await dbConnect()

        if (data.slug) {
            data.slug = data.slug.trim().toLowerCase()
            const existing = await ShortLink.findOne({ slug: data.slug, _id: { $ne: id } })
            if (existing) throw new Error('Slug already taken')
        }

        const updateData: Record<string, unknown> = { ...data }
        const unsetFields: Record<string, 1> = {}

        const nullableFields = ['expiresAt', 'maxClicks', 'groupId', 'password', 'redirectPageMessage', 'webhookUrl', 'webhookOnClickCount'] as const
        for (const field of nullableFields) {
            if (data[field] === null) {
                delete updateData[field]
                unsetFields[field] = 1
            }
        }

        const update: Record<string, unknown> = { $set: updateData }
        if (Object.keys(unsetFields).length > 0) {
            update.$unset = unsetFields
        }

        return ShortLink.findByIdAndUpdate(id, update, { new: true })
            .populate('groupId', 'name color')
            .lean() as Promise<IShortLink | null>
    }

    static async deleteLink(id: string): Promise<boolean> {
        await dbConnect()
        const objectId = new mongoose.Types.ObjectId(id)
        const [result] = await Promise.all([
            ShortLink.findByIdAndDelete(id),
            LinkClick.deleteMany({ linkId: objectId }),
        ])
        return !!result
    }

    static validateLink(link: IShortLink): { valid: boolean; reason?: string } {
        if (!link.isActive) return { valid: false, reason: 'inactive' }
        if (link.expiresAt && new Date(link.expiresAt) < new Date()) return { valid: false, reason: 'expired' }
        if (link.maxClicks && link.totalClicks >= link.maxClicks) return { valid: false, reason: 'max_clicks' }
        return { valid: true }
    }

    static async verifyPassword(link: IShortLink, password: string): Promise<boolean> {
        return link.password === password
    }

    static async trackClick(link: IShortLink, request: NextRequest): Promise<void> {
        await dbConnect()

        const rawIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
        const hashedIp = crypto.createHash('sha256').update(rawIp).digest('hex')

        const [geo, isExisting] = await Promise.all([
            getGeoFromIP(rawIp),
            LinkClick.exists({ linkId: link._id, ip: hashedIp }),
        ])

        const isUnique = !isExisting

        const userAgent = request.headers.get('user-agent') || ''
        const parser = new UAParser(userAgent)
        const uaResult = parser.getResult()

        const deviceType = uaResult.device.type === 'mobile' ? 'mobile'
            : uaResult.device.type === 'tablet' ? 'tablet'
            : 'desktop'

        const searchParams = request.nextUrl.searchParams

        await Promise.all([
            LinkClick.create({
                linkId: link._id,
                ip: hashedIp,
                country: geo.country,
                city: geo.city,
                device: deviceType,
                browser: uaResult.browser.name || 'Unknown',
                os: uaResult.os.name || 'Unknown',
                referrer: request.headers.get('referer') || '',
                utmSource: searchParams.get('utm_source') || '',
                utmMedium: searchParams.get('utm_medium') || '',
                utmCampaign: searchParams.get('utm_campaign') || '',
                utmContent: searchParams.get('utm_content') || '',
                utmTerm: searchParams.get('utm_term') || '',
                isUnique,
            }),
            ShortLink.updateOne(
                { _id: link._id },
                {
                    $inc: { totalClicks: 1, ...(isUnique ? { uniqueClicks: 1 } : {}) },
                    $set: { lastClickedAt: new Date() },
                }
            ),
        ])

        // Webhook notifications
        const newTotalClicks = link.totalClicks + 1
        if (link.webhookUrl) {
            let shouldNotify = false
            if (link.webhookOnFirstClick && isUnique && newTotalClicks === 1) shouldNotify = true
            if (link.webhookOnClickCount && newTotalClicks === link.webhookOnClickCount) shouldNotify = true

            if (shouldNotify) {
                LinkService.sendWebhook(link, newTotalClicks, geo).catch(() => {})
            }
        }
    }

    static async sendWebhook(
        link: IShortLink,
        clickCount: number,
        geo: { country: string; city: string }
    ): Promise<void> {
        const url = link.webhookUrl
        if (!url) return

        const shortUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge'}/link/${link.slug}`
        const message = `🔗 Link Click Alert!\n\n📌 ${link.title || link.slug}\n🌐 ${shortUrl}\n📊 Click #${clickCount}\n📍 ${geo.city}, ${geo.country}\n🎯 Target: ${link.originalUrl}`

        // Detect Telegram bot API URL
        if (url.includes('api.telegram.org')) {
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: message, parse_mode: 'HTML' }),
                signal: AbortSignal.timeout(5000),
            }).catch(() => {})
        } else {
            // Generic webhook
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: 'link_click',
                    link: { slug: link.slug, title: link.title, originalUrl: link.originalUrl },
                    clickCount,
                    geo,
                }),
                signal: AbortSignal.timeout(5000),
            }).catch(() => {})
        }
    }

    static async getLinkStats(id: string, period: '7d' | '30d' | '90d' | 'all' = '30d'): Promise<LinkStats> {
        await dbConnect()

        const match: Record<string, unknown> = { linkId: new mongoose.Types.ObjectId(id) }
        if (period !== 'all') {
            const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
            match.clickedAt = { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
        }

        const [clicksByDay, geoBreakdown, deviceBreakdown, browserBreakdown, osBreakdown, referrerBreakdown, utmSources, utmMediums, utmCampaigns] = await Promise.all([
            LinkClick.aggregate([
                { $match: match },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$clickedAt' } },
                        total: { $sum: 1 },
                        unique: { $sum: { $cond: ['$isUnique', 1, 0] } },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
            LinkClick.aggregate([
                { $match: match },
                { $group: { _id: '$country', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 20 },
            ]),
            LinkClick.aggregate([
                { $match: match },
                { $group: { _id: '$device', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            LinkClick.aggregate([
                { $match: match },
                { $group: { _id: '$browser', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
            ]),
            LinkClick.aggregate([
                { $match: match },
                { $group: { _id: '$os', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
            ]),
            LinkClick.aggregate([
                { $match: { ...match, referrer: { $ne: '' } } },
                { $group: { _id: '$referrer', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 20 },
            ]),
            LinkClick.aggregate([
                { $match: { ...match, utmSource: { $ne: '' } } },
                { $group: { _id: '$utmSource', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            LinkClick.aggregate([
                { $match: { ...match, utmMedium: { $ne: '' } } },
                { $group: { _id: '$utmMedium', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            LinkClick.aggregate([
                { $match: { ...match, utmCampaign: { $ne: '' } } },
                { $group: { _id: '$utmCampaign', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
        ])

        return {
            clicksByDay: clicksByDay.map((d: { _id: string; total: number; unique: number }) => ({
                date: d._id,
                total: d.total,
                unique: d.unique,
            })),
            geoBreakdown,
            deviceBreakdown,
            browserBreakdown,
            osBreakdown,
            referrerBreakdown,
            utmSources,
            utmMediums,
            utmCampaigns,
        }
    }

    static async exportCSV(id: string): Promise<string> {
        await dbConnect()
        const clicks = await LinkClick.find({ linkId: new mongoose.Types.ObjectId(id) })
            .sort({ clickedAt: -1 })
            .lean()

        const headers = ['Date', 'Country', 'City', 'Device', 'Browser', 'OS', 'Referrer', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Unique']
        const rows = clicks.map((c: Record<string, unknown>) => [
            new Date(c.clickedAt as string).toISOString(),
            c.country, c.city, c.device, c.browser, c.os,
            c.referrer, c.utmSource, c.utmMedium, c.utmCampaign,
            c.isUnique ? 'Yes' : 'No',
        ].map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(','))

        return [headers.join(','), ...rows].join('\n')
    }

    static async getTopLinks(limit = 5): Promise<IShortLink[]> {
        await dbConnect()
        const links = await ShortLink.find({ isActive: true })
            .sort({ totalClicks: -1 })
            .limit(limit)
            .lean()
        return links as IShortLink[]
    }

    static async generateQR(url: string): Promise<string> {
        return QRCode.toDataURL(url, {
            width: 512,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        })
    }

    // Group CRUD
    static async createGroup(data: { name: string; description?: string; color?: string }): Promise<ILinkGroup> {
        await dbConnect()
        return LinkGroup.create(data)
    }

    static async getGroups(): Promise<ILinkGroup[]> {
        await dbConnect()
        return LinkGroup.find().sort({ name: 1 }).lean() as Promise<ILinkGroup[]>
    }

    static async updateGroup(id: string, data: { name?: string; description?: string; color?: string }): Promise<ILinkGroup | null> {
        await dbConnect()
        return LinkGroup.findByIdAndUpdate(id, { $set: data }, { new: true }).lean() as Promise<ILinkGroup | null>
    }

    static async deleteGroup(id: string): Promise<boolean> {
        await dbConnect()
        const objectId = new mongoose.Types.ObjectId(id)
        await ShortLink.updateMany({ groupId: objectId }, { $unset: { groupId: 1 } })
        const result = await LinkGroup.findByIdAndDelete(id)
        return !!result
    }

    static async getAllTags(): Promise<string[]> {
        await dbConnect()
        const result = await ShortLink.distinct('tags')
        return result.filter(Boolean).sort()
    }
}
