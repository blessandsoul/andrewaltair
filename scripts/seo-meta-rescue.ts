#!/usr/bin/env node
/**
 * CTR rescue: rewrites seo.metaTitle / seo.metaDescription for pages that GSC
 * (2026-06-12) shows getting impressions with ~0% CTR — the titles don't match
 * the query intent (e.g. «გროკი» 545 impressions, pos. 8, CTR 0.18%).
 * MUST run where MongoDB is reachable (VPS / Coolify terminal).
 *
 *   npx tsx scripts/seo-meta-rescue.ts            # dry-run (default)
 *   npx tsx scripts/seo-meta-rescue.ts --apply    # perform writes
 *
 * Run AFTER seo-dedupe-apply.ts (it reslugs leading-hyphen slugs; this map
 * matches both old and new variants just in case).
 */
import * as dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({ path: '.env.local' })
if (!process.env.MONGODB_URI) dotenv.config()

const APPLY = process.argv.includes('--apply')

interface MetaFix {
    slugs: string[] // pre- and post-reslug variants
    metaTitle: string // ≤60 chars, no emoji, query-intent Georgian
    metaDescription: string // ~150-160 chars
}

const FIXES: MetaFix[] = [
    {
        // 545 impressions for «გროკი», CTR 0.18% — title must answer "what is Grok"
        slugs: ['-generali-groki-pentagonis-akhali-tvini', 'generali-groki-pentagonis-akhali-tvini'],
        metaTitle: 'გროკი (Grok) პენტაგონში — მასკის AI ამერიკის არმიაში',
        metaDescription: 'რა არის Grok და როგორ იყენებს პენტაგონი მასკის ხელოვნურ ინტელექტს. სრული ანალიზი ქართულად — ფაქტები, რისკები და რას ნიშნავს ეს მსოფლიოსთვის.',
    },
    {
        slugs: ['deepfake-growth-2025-identity-fraud'],
        metaTitle: 'დიპფეიკი 2026 — როგორ ამოვიცნოთ ყალბი ვიდეო',
        metaDescription: 'დიპფეიკების ზრდა და იდენტობის თაღლითობა: რეალური ციფრები, ამოცნობის ხერხები და დაცვის წესები ქართულად.',
    },
    {
        slugs: ['ai-depression-suicide-case-study'],
        metaTitle: 'AI ჩატბოტები და ფსიქიკა — რას ამბობს კვლევა',
        metaDescription: 'შემთხვევის ანალიზი: როგორ მოქმედებს AI ჩატბოტებთან ურთიერთობა ფსიქიკურ ჯანმრთელობაზე და რა რისკები არსებობს მომხმარებლებისთვის.',
    },
    {
        slugs: ['bexorg-human-brain-drug-testing-2026'],
        metaTitle: 'Bexorg — წამლების ტესტირება ადამიანის ტვინზე AI-ით',
        metaDescription: 'როგორ ტესტავს Bexorg წამლებს ადამიანის ტვინის ქსოვილზე ხელოვნური ინტელექტით — ტექნოლოგია, ეთიკური კითხვები და სამედიცინო პერსპექტივები.',
    },
    {
        slugs: ['grammarly-dead-professors-ai-expert-review-2026'],
        metaTitle: 'Grammarly 2026 — ღირს თუ არა? ექსპერტის შეფასება',
        metaDescription: 'Grammarly-ის AI ფუნქციების სრული მიმოხილვა: რა შეუძლია, რა ღირს და ჯობია თუ არა ChatGPT-ს ტექსტების შესწორებაში. პრაქტიკული დასკვნები.',
    },
    {
        slugs: ['claude-ai-vending-cartel-deception-2026'],
        metaTitle: 'Claude AI ექსპერიმენტი — AI-მ მაღაზია წააგო',
        metaDescription: 'Anthropic-ის ექსპერიმენტი: Claude AI-მ სავაჭრო ავტომატი მართა და მოლაპარაკებებში კარტელშიც გაერთიანდა. რა ისწავლეს მკვლევრებმა.',
    },
    {
        slugs: ['wef-2026-ai-gap-great-decoupling'],
        metaTitle: 'WEF 2026 — AI-უფსკრული: ვინ მოიგებს, ვინ წააგებს',
        metaDescription: 'დავოსის ფორუმის დასკვნები AI-ეკონომიკაზე: დიდი გათიშვა, სამუშაო ადგილების ცვლილება და რას ნიშნავს ეს საქართველოსთვის.',
    },
    {
        slugs: ['ai-laws-business-regulation-2026'],
        metaTitle: 'AI კანონები 2026 — რა უნდა იცოდეს ბიზნესმა',
        metaDescription: 'ახალი AI რეგულაციები ევროპასა და მსოფლიოში: ჯარიმები, ვალდებულებები და როგორ მოემზადოს ქართული ბიზნესი ცვლილებებისთვის.',
    },
]

async function main(): Promise<void> {
    const uri = process.env.MONGODB_URI
    if (!uri) { console.error('MONGODB_URI not set'); process.exit(1) }
    await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 15000 })
    const db = mongoose.connection.db
    if (!db) { console.error('no db handle'); process.exit(1) }
    const coll = db.collection('posts')

    console.log(`mode: ${APPLY ? 'APPLY (writing)' : 'DRY-RUN (no writes — pass --apply to execute)'}\n`)

    for (const fix of FIXES) {
        if (fix.metaTitle.length > 60) {
            console.log(`  WARN title >60 chars (${fix.metaTitle.length}): ${fix.metaTitle}`)
        }
        const doc = await coll.findOne(
            { slug: { $in: fix.slugs } },
            { projection: { slug: 1, 'seo.metaTitle': 1, status: 1 } }
        )
        if (!doc) { console.log(`  MISS ${fix.slugs[0]} — not found (archived or reslugged differently?)`); continue }

        console.log(`# ${doc.slug} [${doc.status}]`)
        console.log(`  old: ${doc.seo?.metaTitle ?? '(none)'}`)
        console.log(`  new: ${fix.metaTitle}`)

        if (APPLY) {
            await coll.updateOne(
                { _id: doc._id },
                {
                    $set: {
                        'seo.metaTitle': fix.metaTitle,
                        'seo.metaDescription': fix.metaDescription,
                        updatedAt: new Date(), // freshness signal → dateModified in JSON-LD
                    },
                }
            )
            console.log('  APPLIED')
        }
        console.log('')
    }

    await mongoose.disconnect()
    console.log('done — after deploy+apply, Request Indexing these URLs in GSC')
}

main().catch((e) => { console.error(e); process.exit(1) })
