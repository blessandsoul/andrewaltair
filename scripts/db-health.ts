#!/usr/bin/env node
/**
 * Read-only DB health scan. Surfaces the bloat-class problems (base64 data-URIs inline,
 * oversized documents, fat collections) across ALL collections — not just users.
 *
 * Usage: cd andrewaltair.ge_project && npx tsx scripts/db-health.ts
 * Reads MONGODB_URI from .env.local (fallback .env). Makes NO writes.
 */
import * as dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({ path: '.env.local' })
if (!process.env.MONGODB_URI) dotenv.config()

const BIG_DOC = 100 * 1024 // flag docs over 100KB
const BIG_FIELD = 10 * 1024 // show fields over 10KB

async function main(): Promise<void> {
    const uri = process.env.MONGODB_URI
    if (!uri) { console.error('❌ MONGODB_URI not set'); process.exit(1) }
    await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 15000 })
    const db = mongoose.connection.db
    if (!db) { console.error('no db handle'); process.exit(1) }

    const colls = (await db.listCollections().toArray()).sort((a, b) => a.name.localeCompare(b.name))
    console.log(`DB: ${db.databaseName} — ${colls.length} collections\n`)

    const overview: Record<string, unknown>[] = []
    for (const c of colls) {
        let s: Record<string, number> = {}
        try { s = (await db.command({ collStats: c.name })) as unknown as Record<string, number> } catch { /* view */ }
        overview.push({
            collection: c.name,
            docs: s.count ?? 0,
            dataMB: +(((s.size ?? 0) / 1048576).toFixed(2)),
            avgKB: +(((s.avgObjSize ?? 0) / 1024).toFixed(1)),
            idxMB: +(((s.totalIndexSize ?? 0) / 1048576).toFixed(2)),
            idx: s.nindexes ?? 0,
        })
    }
    console.table(overview)

    console.log('\n=== Biggest documents / base64 / huge fields (>100KB docs) ===')
    let foundAny = false
    for (const c of colls) {
        const coll = db.collection(c.name)
        let big: { _id: unknown; size: number }[] = []
        try {
            big = await coll.aggregate([
                { $project: { size: { $bsonSize: '$$ROOT' } } },
                { $sort: { size: -1 } },
                { $limit: 3 },
            ], { maxTimeMS: 25000 }).toArray() as { _id: unknown; size: number }[]
        } catch { /* skip */ }

        for (const b of big) {
            if (!b.size || b.size < BIG_DOC) continue
            foundAny = true
            const doc = await coll.findOne({ _id: b._id as never })
            const fields = Object.entries(doc ?? {})
                .map(([k, v]) => {
                    const str = typeof v === 'string' ? v : JSON.stringify(v ?? '')
                    return { k, bytes: str.length, dataUri: typeof v === 'string' && v.startsWith('data:') }
                })
                .filter((f) => f.bytes > BIG_FIELD)
                .sort((a, b2) => b2.bytes - a.bytes)
                .slice(0, 5)
            console.log(`\n[${c.name}] _id=${String(b._id)}  docSize=${(b.size / 1024).toFixed(1)}KB`)
            for (const f of fields) {
                console.log(`   ${f.k}: ${(f.bytes / 1024).toFixed(1)}KB${f.dataUri ? '   ⚠️ BASE64 data: URI' : ''}`)
            }
        }
    }
    if (!foundAny) console.log('None — no document over 100KB. 👍')

    await mongoose.disconnect()
    console.log('\n✅ scan done')
}

main().catch((e) => { console.error(e); process.exit(1) })
