#!/usr/bin/env node
/**
 * Read-only SEO data audit. NO writes.
 * Surfaces: duplicate articles (same base slug / same title), truncated slugs,
 * external image hosts (for next.config remotePatterns allowlist), bot slug readiness.
 *
 * Usage: cd andrewaltair.ge_project && npx tsx scripts/seo-audit-readonly.ts
 */
import * as dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({ path: '.env.local' })
if (!process.env.MONGODB_URI) dotenv.config()

interface SlimDoc {
    _id: unknown
    slug: string
    title?: string
    sourceTitle?: string
    views?: number
    publishedAt?: Date
    status?: string
}

function baseSlug(slug: string): string {
    return slug.replace(/-\d+$/, '')
}

async function main(): Promise<void> {
    const uri = process.env.MONGODB_URI
    if (!uri) { console.error('MONGODB_URI not set'); process.exit(1) }
    await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 15000 })
    const db = mongoose.connection.db
    if (!db) { console.error('no db handle'); process.exit(1) }
    console.log(`DB: ${db.databaseName}\n`)

    for (const collName of ['posts', 'insights']) {
        const docs = await db.collection(collName)
            .find({}, { projection: { slug: 1, title: 1, sourceTitle: 1, views: 1, publishedAt: 1, status: 1 } })
            .toArray() as unknown as SlimDoc[]

        console.log(`=== ${collName}: ${docs.length} docs ===`)
        const byStatus: Record<string, number> = {}
        for (const d of docs) byStatus[d.status ?? '?'] = (byStatus[d.status ?? '?'] ?? 0) + 1
        console.log('by status:', JSON.stringify(byStatus))

        // 1) duplicate groups by base slug (strip trailing -N)
        const groups = new Map<string, SlimDoc[]>()
        for (const d of docs) {
            if (!d.slug) continue
            const key = baseSlug(d.slug)
            const arr = groups.get(key) ?? []
            arr.push(d)
            groups.set(key, arr)
        }
        const dupGroups = [...groups.entries()].filter(([, arr]) => arr.length > 1)
        console.log(`\n--- duplicate base-slug groups: ${dupGroups.length} ---`)
        for (const [key, arr] of dupGroups) {
            const sorted = [...arr].sort((a, b) => (b.views ?? 0) - (a.views ?? 0) ||
                new Date(a.publishedAt ?? 0).getTime() - new Date(b.publishedAt ?? 0).getTime())
            console.log(`# ${key}`)
            sorted.forEach((d, i) => {
                const mark = i === 0 ? 'KEEP ' : 'DROP '
                console.log(`  ${mark} slug=${d.slug} status=${d.status} views=${d.views ?? 0} published=${d.publishedAt ? new Date(d.publishedAt).toISOString().slice(0, 10) : '-'} title=${(d.title ?? d.sourceTitle ?? '').slice(0, 70)}`)
            })
        }

        // 2) duplicate titles with DIFFERENT base slugs (re-published same article under new slug)
        const byTitle = new Map<string, SlimDoc[]>()
        for (const d of docs) {
            const t = (d.title ?? d.sourceTitle ?? '').trim().toLowerCase()
            if (!t) continue
            const arr = byTitle.get(t) ?? []
            arr.push(d)
            byTitle.set(t, arr)
        }
        const titleDups = [...byTitle.entries()].filter(([, arr]) =>
            new Set(arr.map(d => baseSlug(d.slug))).size > 1)
        console.log(`\n--- same-title different-slug groups: ${titleDups.length} ---`)
        for (const [t, arr] of titleDups.slice(0, 30)) {
            console.log(`# "${t.slice(0, 70)}"`)
            for (const d of arr) console.log(`    slug=${d.slug} status=${d.status} views=${d.views ?? 0}`)
        }

        // 3) truncated slugs: trailing 1-2 char fragment (optionally before -N suffix)
        const truncated = docs.filter(d => d.slug && /-[a-z0-9]{1,2}(-\d+)?$/.test(d.slug) && !/-(ai|go|ge|us|uk|eu|tv|3d|2d|4k|8k|x2|v2|v3|q\d|r\d)$/.test(d.slug))
        console.log(`\n--- truncated-slug candidates: ${truncated.length} ---`)
        for (const d of truncated.slice(0, 40)) console.log(`  slug=${d.slug} status=${d.status} title=${(d.title ?? d.sourceTitle ?? '').slice(0, 60)}`)
        console.log('')
    }

    // 4) external image hosts (remotePatterns allowlist input)
    const hosts = new Map<string, number>()
    const collect = (val: unknown): void => {
        if (typeof val !== 'string' || !val.startsWith('http')) return
        try { const h = new URL(val).hostname; hosts.set(h, (hosts.get(h) ?? 0) + 1) } catch { /* skip */ }
    }
    const postImgs = await db.collection('posts').find({}, { projection: { coverImage: 1, 'author.avatar': 1, 'sections.imageUrl': 1, 'sections.url': 1 } }).toArray()
    for (const p of postImgs) {
        collect((p as Record<string, unknown>).coverImage)
        const author = (p as Record<string, { avatar?: string }>).author
        collect(author?.avatar)
        const sections = (p as Record<string, unknown>).sections as Array<Record<string, unknown>> | undefined
        for (const s of sections ?? []) { collect(s.imageUrl); collect(s.url) }
    }
    const insightImgs = await db.collection('insights').find({}, { projection: { sourceImage: 1 } }).toArray()
    for (const i of insightImgs) collect((i as Record<string, unknown>).sourceImage)
    const botImgs = await db.collection('bots').find({}, { projection: { avatar: 1, image: 1 } }).toArray()
    for (const b of botImgs) { collect((b as Record<string, unknown>).avatar); collect((b as Record<string, unknown>).image) }
    const videoImgs = await db.collection('videos').find({}, { projection: { thumbnail: 1 } }).toArray()
    for (const v of videoImgs) collect((v as Record<string, unknown>).thumbnail)
    console.log(`=== external image hosts (${hosts.size}) ===`)
    for (const [h, n] of [...hosts.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${h}: ${n}`)

    // 5) bots slug readiness
    const bots = await db.collection('bots').find({}, { projection: { name: 1, codename: 1, slug: 1, tier: 1, isActive: 1 } }).toArray()
    console.log(`\n=== bots: ${bots.length} ===`)
    for (const b of bots) {
        const r = b as Record<string, unknown>
        console.log(`  codename=${r.codename ?? '-'} slug=${r.slug ?? '-'} tier=${r.tier} active=${r.isActive} name=${String(r.name ?? '').slice(0, 40)}`)
    }

    // 6) videos count
    const vidCount = await db.collection('videos').countDocuments()
    console.log(`\n=== videos: ${vidCount} docs ===`)

    await mongoose.disconnect()
}

main().catch((e) => { console.error(e); process.exit(1) })
