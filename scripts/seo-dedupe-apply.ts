#!/usr/bin/env node
/**
 * Applies the SEO dedupe decisions from the 2026-06-12 audit.
 * MUST run where MongoDB is reachable (VPS / Coolify terminal), NOT locally.
 *
 *   npx tsx scripts/seo-dedupe-apply.ts            # dry-run (default, no writes)
 *   npx tsx scripts/seo-dedupe-apply.ts --apply    # perform writes
 *
 * Actions:
 *   1. Archive duplicate-publication losers (slug "-2" copies) so they leave
 *      the sitemap. The 301 loser→winner already ships in src/data/*SlugRedirects.ts.
 *      Safety: loser is archived ONLY if the winner exists and is published.
 *   2. Re-slug garbage "insight-<timestamp>" slugs (Georgian titles used to
 *      slugify to '' before the lib/slug.ts fix). Prints ready-to-paste
 *      INSIGHT_SLUG_REDIRECTS lines for each rename — add them to
 *      src/data/insightSlugRedirects.ts and redeploy.
 */
import * as dotenv from 'dotenv'
import mongoose from 'mongoose'
import { titleToSlug } from '../src/lib/slug'

dotenv.config({ path: '.env.local' })
if (!process.env.MONGODB_URI) dotenv.config()

const APPLY = process.argv.includes('--apply')

// loser slug → winner slug (must mirror src/data/*SlugRedirects.ts)
const POST_DUPES: Record<string, string> = {
    'ai-laws-business-regulation-2026-2': 'ai-laws-business-regulation-2026',
}
const INSIGHT_DUPES: Record<string, string> = {
    'anthropic-customers-creeped-out-by-its-newest-models-2': 'anthropic-customers-creeped-out-by-its-newest-models',
    'less-work-equal-pay-openai-lays-out-its-vision-for-a-world-r-2': 'less-work-equal-pay-openai-lays-out-its-vision-for-a-world-r',
}

async function archiveDupes(collName: 'posts' | 'insights', dupes: Record<string, string>): Promise<void> {
    const db = mongoose.connection.db
    if (!db) throw new Error('no db handle')
    const coll = db.collection(collName)

    for (const [loser, winner] of Object.entries(dupes)) {
        const winnerDoc = await coll.findOne({ slug: winner }, { projection: { status: 1 } })
        const loserDoc = await coll.findOne({ slug: loser }, { projection: { status: 1, views: 1 } })

        if (!loserDoc) { console.log(`  SKIP ${collName}/${loser} — loser not found (already cleaned?)`); continue }
        if (!winnerDoc) { console.log(`  ABORT ${collName}/${loser} — winner "${winner}" NOT FOUND, refusing to archive`); continue }
        if (winnerDoc.status !== 'published') { console.log(`  ABORT ${collName}/${loser} — winner not published (${winnerDoc.status})`); continue }
        if (loserDoc.status === 'archived') { console.log(`  OK ${collName}/${loser} — already archived`); continue }

        if (APPLY) {
            await coll.updateOne({ slug: loser }, { $set: { status: 'archived' } })
            console.log(`  ARCHIVED ${collName}/${loser} → 301 to ${winner} (views on loser: ${loserDoc.views ?? 0})`)
        } else {
            console.log(`  WOULD ARCHIVE ${collName}/${loser} → 301 to ${winner} (views on loser: ${loserDoc.views ?? 0})`)
        }
    }
}

async function reslugTimestampInsights(): Promise<void> {
    const db = mongoose.connection.db
    if (!db) throw new Error('no db handle')
    const coll = db.collection('insights')

    const garbage = await coll
        .find({ slug: { $regex: '^insight-\\d{13}$' } }, { projection: { slug: 1, sourceTitle: 1, excerpt: 1, status: 1 } })
        .toArray()

    if (garbage.length === 0) { console.log('  no insight-<timestamp> slugs found'); return }

    const redirectLines: string[] = []
    for (const doc of garbage) {
        const base = titleToSlug(String(doc.sourceTitle || doc.excerpt || ''), 60)
        if (!base) { console.log(`  SKIP ${doc.slug} — no title material to slugify`); continue }

        let candidate = base
        let counter = 2
        while (await coll.findOne({ slug: candidate, _id: { $ne: doc._id } }, { projection: { _id: 1 } })) {
            candidate = `${base}-${counter}`
            counter++
            if (counter > 20) break
        }

        if (APPLY) {
            await coll.updateOne({ _id: doc._id }, { $set: { slug: candidate, 'seo.canonicalUrl': `https://andrewaltair.ge/insights/${candidate}` } })
            console.log(`  RESLUGGED ${doc.slug} → ${candidate}`)
        } else {
            console.log(`  WOULD RESLUG ${doc.slug} → ${candidate}`)
        }
        redirectLines.push(`    '${doc.slug}': '${candidate}',`)
    }

    if (redirectLines.length) {
        console.log('\n  Paste into INSIGHT_SLUG_REDIRECTS (src/data/insightSlugRedirects.ts), then redeploy:')
        for (const line of redirectLines) console.log(line)
    }
}

async function reslugLeadingHyphen(collName: 'posts' | 'insights'): Promise<string[]> {
    const db = mongoose.connection.db
    if (!db) throw new Error('no db handle')
    const coll = db.collection(collName)

    // Slugs like "/blog/-generali-groki-..." — a leading hyphen artifact from
    // emoji/symbol-prefixed titles. ~15 such pages are LIVE IN SERPs (GSC
    // 2026-06-12), so each rename needs a 301 map entry (printed below).
    const docs = await coll
        .find({ slug: { $regex: '^-' }, status: 'published' }, { projection: { slug: 1 } })
        .toArray()

    if (docs.length === 0) { console.log(`  no leading-hyphen slugs in ${collName}`); return [] }

    const redirectLines: string[] = []
    for (const doc of docs) {
        const base = String(doc.slug).replace(/^-+/, '')
        if (!base) { console.log(`  SKIP ${doc.slug} — nothing left after trim`); continue }

        let candidate = base
        let counter = 2
        while (await coll.findOne({ slug: candidate, _id: { $ne: doc._id } }, { projection: { _id: 1 } })) {
            candidate = `${base}-${counter}`
            counter++
            if (counter > 20) break
        }

        if (APPLY) {
            await coll.updateOne({ _id: doc._id }, { $set: { slug: candidate } })
            console.log(`  RESLUGGED ${collName}/${doc.slug} → ${candidate}`)
        } else {
            console.log(`  WOULD RESLUG ${collName}/${doc.slug} → ${candidate}`)
        }
        redirectLines.push(`    '${doc.slug}': '${candidate}',`)
    }
    return redirectLines
}

async function backfillBotSlugs(): Promise<void> {
    const db = mongoose.connection.db
    if (!db) throw new Error('no db handle')
    const coll = db.collection('bots')

    const bots = await coll.find({ slug: { $exists: false } }, { projection: { name: 1, codename: 1 } }).toArray()
    if (bots.length === 0) { console.log('  all bots already have slugs'); return }

    for (const bot of bots) {
        // Georgian names → Georgian slugs (titleToSlug falls back to tagToSlug)
        const base = titleToSlug(String(bot.name || bot.codename || ''), 60)
        if (!base) { console.log(`  SKIP bot ${bot._id} — no slug material`); continue }

        let candidate = base
        let counter = 2
        while (await coll.findOne({ slug: candidate, _id: { $ne: bot._id } }, { projection: { _id: 1 } })) {
            candidate = `${base}-${counter}`
            counter++
            if (counter > 20) break
        }

        if (APPLY) {
            await coll.updateOne({ _id: bot._id }, { $set: { slug: candidate } })
            console.log(`  SLUGGED ${bot.codename ?? bot._id} → ${candidate}`)
        } else {
            console.log(`  WOULD SLUG ${bot.codename ?? bot._id} → ${candidate}`)
        }
    }
}

async function main(): Promise<void> {
    const uri = process.env.MONGODB_URI
    if (!uri) { console.error('MONGODB_URI not set'); process.exit(1) }
    await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 15000 })

    console.log(`mode: ${APPLY ? 'APPLY (writing)' : 'DRY-RUN (no writes — pass --apply to execute)'}\n`)
    console.log('== 1. archive duplicate posts ==')
    await archiveDupes('posts', POST_DUPES)
    console.log('\n== 2. archive duplicate insights ==')
    await archiveDupes('insights', INSIGHT_DUPES)
    console.log('\n== 3. re-slug insight-<timestamp> garbage ==')
    await reslugTimestampInsights()
    console.log('\n== 4. backfill bot SEO slugs ==')
    await backfillBotSlugs()
    console.log('\n== 5. re-slug leading-hyphen slugs (live in SERPs — need 301s) ==')
    const blogLines = await reslugLeadingHyphen('posts')
    const insightLines = await reslugLeadingHyphen('insights')
    if (blogLines.length) {
        console.log('\n  Paste into BLOG_SLUG_REDIRECTS (src/data/blogSlugRedirects.ts), then redeploy:')
        for (const line of blogLines) console.log(line)
    }
    if (insightLines.length) {
        console.log('\n  Paste into INSIGHT_SLUG_REDIRECTS (src/data/insightSlugRedirects.ts), then redeploy:')
        for (const line of insightLines) console.log(line)
    }

    await mongoose.disconnect()
    console.log('\ndone')
}

main().catch((e) => { console.error(e); process.exit(1) })
