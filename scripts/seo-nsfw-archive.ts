#!/usr/bin/env node
/**
 * Archives NSFW-magnet articles (GSC audit 2026-06-12, user decision: archive).
 * MUST run where MongoDB is reachable (VPS / Coolify terminal), NOT locally.
 *
 *   npx tsx scripts/seo-nsfw-archive.ts            # dry-run (default, no writes)
 *   npx tsx scripts/seo-nsfw-archive.ts --apply    # perform writes
 *
 * WHY: GSC Performance shows the site surfacing for porn-intent queries
 * («ნუდები», «პორნო», «სექსი», «deepfake nude ai», «ინცესტი telegram») via
 * deepfake/nude-scandal articles. That pollutes the topical profile and risks
 * a SafeSearch demotion of the whole domain.
 *
 * Archived pages return a real 404 (Wave-1 fix) — intentionally NO 301:
 * redirecting removed toxic pages to the blog root would itself be classified
 * as a soft-404 by Google; an honest 404 drops them from the index fastest.
 */
import * as dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({ path: '.env.local' })
if (!process.env.MONGODB_URI) dotenv.config()

const APPLY = process.argv.includes('--apply')

// Latin + Georgian NSFW triggers. Checked against slug + title fields.
// ნუდ = ნუდ, პორნ = პორნ, სექს = სექს, ინცესტ = ინცესტ
const NSFW_RE = /(nude|nudif|nudebi|porn|incest|ნუდ|პორნ|სექს|ინცესტ)/i

async function scanCollection(collName: 'posts' | 'insights'): Promise<void> {
    const db = mongoose.connection.db
    if (!db) throw new Error('no db handle')
    const coll = db.collection(collName)

    const docs = await coll
        .find(
            { status: 'published' },
            { projection: { slug: 1, title: 1, sourceTitle: 1, 'seo.metaTitle': 1, views: 1 } }
        )
        .toArray()

    const candidates = docs.filter((d) => {
        const hay = [d.slug, d.title, d.sourceTitle, d.seo?.metaTitle].filter(Boolean).join(' ')
        return NSFW_RE.test(hay)
    })

    console.log(`\n== ${collName}: ${candidates.length} NSFW candidates (of ${docs.length} published) ==`)
    for (const d of candidates) {
        const label = (d.title || d.sourceTitle || '').slice(0, 70)
        if (APPLY) {
            await coll.updateOne({ _id: d._id }, { $set: { status: 'archived' } })
            console.log(`  ARCHIVED ${collName}/${d.slug} (views=${d.views ?? 0}) :: ${label}`)
        } else {
            console.log(`  WOULD ARCHIVE ${collName}/${d.slug} (views=${d.views ?? 0}) :: ${label}`)
        }
    }
    if (candidates.length === 0) console.log('  none found')
}

async function main(): Promise<void> {
    const uri = process.env.MONGODB_URI
    if (!uri) { console.error('MONGODB_URI not set'); process.exit(1) }
    await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 15000 })

    console.log(`mode: ${APPLY ? 'APPLY (writing)' : 'DRY-RUN (no writes — pass --apply to execute)'}`)
    console.log('review the dry-run list FIRST — borderline titles (e.g. teen-deepfake court cases) may be keepers')

    await scanCollection('posts')
    await scanCollection('insights')

    await mongoose.disconnect()
    console.log('\ndone — archived pages now 404 (honest purge; Google drops them fastest this way)')
}

main().catch((e) => { console.error(e); process.exit(1) })
