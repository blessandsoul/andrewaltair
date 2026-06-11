/**
 * SEO data migrations — run automatically on every container boot via
 * src/instrumentation.ts (register()). Replaces the manual `npx tsx scripts/*`
 * runbook: redeploy = migrations apply themselves.
 *
 * Each step is one-shot and versioned: the `seo_migrations` collection stores
 * applied keys. A failed step does NOT record its key, so it retries on the
 * next boot; a succeeded step is skipped forever. All steps are idempotent
 * anyway (safe to re-run if the bookkeeping collection is ever dropped).
 *
 * Origin: SEO audit + GSC Coverage/Performance/Drilldown analysis 2026-06-12.
 * Manual fallbacks with the same logic live in scripts/seo-*.ts.
 */
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { titleToSlug } from '@/lib/slug';
import grokPillarPost from '@/data/seo/grok-pillar-post.json';

const SITE_URL = 'https://andrewaltair.ge';

function db() {
    const handle = mongoose.connection.db;
    if (!handle) throw new Error('no db handle');
    return handle;
}

/** Upsert a Redirect doc (model collection: 'redirects') — consumed by the
 *  dynamic redirect lookup in blog/insights/prompts [slug] pages. */
async function upsertRedirect(from: string, to: string): Promise<void> {
    await db().collection('redirects').updateOne(
        { from },
        {
            $set: { to, type: 301 },
            $setOnInsert: { hits: 0, createdAt: new Date() },
            $currentDate: { updatedAt: true },
        },
        { upsert: true }
    );
}

/** Re-slug docs matched by `filter` using `makeBase`, writing 301 Redirect docs. */
async function reslug(
    collName: 'posts' | 'insights',
    urlPrefix: '/blog' | '/insights',
    filter: Record<string, unknown>,
    makeBase: (doc: Record<string, unknown>) => string
): Promise<number> {
    const coll = db().collection(collName);
    const docs = await coll
        .find(filter, { projection: { slug: 1, title: 1, sourceTitle: 1, excerpt: 1 } })
        .toArray();

    let changed = 0;
    for (const doc of docs) {
        const base = makeBase(doc as Record<string, unknown>);
        if (!base || base === doc.slug) continue;

        let candidate = base;
        let counter = 2;
        while (await coll.findOne({ slug: candidate, _id: { $ne: doc._id } }, { projection: { _id: 1 } })) {
            candidate = `${base}-${counter}`;
            counter++;
            if (counter > 20) break;
        }

        await coll.updateOne(
            { _id: doc._id },
            { $set: { slug: candidate, 'seo.canonicalUrl': `${SITE_URL}${urlPrefix}/${candidate}` } }
        );
        await upsertRedirect(`${urlPrefix}/${doc.slug}`, `${urlPrefix}/${candidate}`);
        console.log(`[seo-migrations]   reslug ${collName}/${doc.slug} -> ${candidate}`);
        changed++;
    }
    return changed;
}

/** Archive duplicate-publication losers, but only when the winner is live. */
async function archiveDupes(collName: 'posts' | 'insights', dupes: Record<string, string>): Promise<number> {
    const coll = db().collection(collName);
    let archived = 0;
    for (const [loser, winner] of Object.entries(dupes)) {
        const winnerDoc = await coll.findOne({ slug: winner }, { projection: { status: 1 } });
        const loserDoc = await coll.findOne({ slug: loser }, { projection: { status: 1 } });
        if (!loserDoc || loserDoc.status === 'archived') continue;
        if (!winnerDoc || winnerDoc.status !== 'published') {
            console.log(`[seo-migrations]   SKIP ${collName}/${loser} — winner "${winner}" not live`);
            continue;
        }
        await coll.updateOne({ slug: loser }, { $set: { status: 'archived' } });
        console.log(`[seo-migrations]   archived dupe ${collName}/${loser} (301 -> ${winner} via static map)`);
        archived++;
    }
    return archived;
}

const MIGRATIONS: { key: string; run: () => Promise<string> }[] = [
    {
        // Same article published twice with a "-2" slug — loser leaves the
        // sitemap; the 301 ships in src/data/*SlugRedirects.ts (edge middleware).
        key: '2026-06-12-dedupe-archive',
        run: async () => {
            const posts = await archiveDupes('posts', {
                'ai-laws-business-regulation-2026-2': 'ai-laws-business-regulation-2026',
            });
            const insights = await archiveDupes('insights', {
                'anthropic-customers-creeped-out-by-its-newest-models-2': 'anthropic-customers-creeped-out-by-its-newest-models',
                'less-work-equal-pay-openai-lays-out-its-vision-for-a-world-r-2': 'less-work-equal-pay-openai-lays-out-its-vision-for-a-world-r',
            });
            return `archived ${posts} posts + ${insights} insights`;
        },
    },
    {
        // Georgian titles used to slugify to '' -> "insight-<timestamp>" garbage
        // slugs (live in SERPs). New slug from the title, 301 via Redirect docs.
        key: '2026-06-12-timestamp-reslug',
        run: async () => {
            const n = await reslug(
                'insights',
                '/insights',
                { slug: { $regex: '^insight-\\d{13}$' }, status: 'published' },
                (doc) => titleToSlug(String(doc.sourceTitle || doc.excerpt || ''), 60)
            );
            return `reslugged ${n} timestamp insights`;
        },
    },
    {
        // "/blog/-generali-groki-..." — leading-hyphen artifacts from
        // emoji-prefixed titles; ~15 live in SERPs, so each gets a 301.
        key: '2026-06-12-hyphen-reslug',
        run: async () => {
            const posts = await reslug(
                'posts', '/blog',
                { slug: { $regex: '^-' }, status: 'published' },
                (doc) => String(doc.slug).replace(/^-+/, '')
            );
            const insights = await reslug(
                'insights', '/insights',
                { slug: { $regex: '^-' }, status: 'published' },
                (doc) => String(doc.slug).replace(/^-+/, '')
            );
            return `reslugged ${posts} posts + ${insights} insights`;
        },
    },
    {
        // Human-readable bot URLs: /bots/<slug> (Georgian-aware) instead of ObjectId.
        key: '2026-06-12-bot-slugs',
        run: async () => {
            const coll = db().collection('bots');
            const bots = await coll.find({ slug: { $exists: false } }, { projection: { name: 1, codename: 1 } }).toArray();
            let n = 0;
            for (const bot of bots) {
                const base = titleToSlug(String(bot.name || bot.codename || ''), 60);
                if (!base) continue;
                let candidate = base;
                let counter = 2;
                while (await coll.findOne({ slug: candidate, _id: { $ne: bot._id } }, { projection: { _id: 1 } })) {
                    candidate = `${base}-${counter}`;
                    counter++;
                    if (counter > 20) break;
                }
                await coll.updateOne({ _id: bot._id }, { $set: { slug: candidate } });
                n++;
            }
            return `slugged ${n} bots`;
        },
    },
    {
        // GSC shows the site surfacing for porn-intent queries via deepfake/nude
        // scandal articles — SafeSearch demotion risk. User decision 2026-06-12:
        // archive the whole class. Archived pages 404 (honest purge, no 301 —
        // redirect-to-home is itself classified as a soft-404).
        key: '2026-06-12-nsfw-archive',
        run: async () => {
            const NSFW_RE = /(nude|nudif|nudebi|porn|incest|ნუდ|პორნ|სექს|ინცესტ)/i;
            let archived = 0;
            for (const collName of ['posts', 'insights'] as const) {
                const coll = db().collection(collName);
                const docs = await coll
                    .find({ status: 'published' }, { projection: { slug: 1, title: 1, sourceTitle: 1, 'seo.metaTitle': 1 } })
                    .toArray();
                for (const d of docs) {
                    const hay = [d.slug, d.title, d.sourceTitle, d.seo?.metaTitle].filter(Boolean).join(' ');
                    if (!NSFW_RE.test(hay)) continue;
                    await coll.updateOne({ _id: d._id }, { $set: { status: 'archived' } });
                    console.log(`[seo-migrations]   NSFW-archived ${collName}/${d.slug}`);
                    archived++;
                }
            }
            return `archived ${archived} NSFW-magnet docs`;
        },
    },
    {
        // CTR rescue: pages with impressions and ~0% CTR get intent-matched
        // Georgian titles (GSC Performance 2026-06-12). Slugs listed in both
        // pre- and post-hyphen-reslug form.
        key: '2026-06-12-meta-rescue',
        run: async () => {
            const FIXES: { slugs: string[]; metaTitle: string; metaDescription: string }[] = [
                {
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
            ];
            const coll = db().collection('posts');
            let n = 0;
            for (const fix of FIXES) {
                const res = await coll.updateOne(
                    { slug: { $in: fix.slugs } },
                    {
                        $set: {
                            'seo.metaTitle': fix.metaTitle,
                            'seo.metaDescription': fix.metaDescription,
                            updatedAt: new Date(),
                        },
                    }
                );
                if (res.modifiedCount > 0) n++;
            }
            return `rewrote meta on ${n}/${FIXES.length} pages`;
        },
    },
    {
        // Evergreen pillar targeting «გროკი» (545 impressions, pos. 8, CTR 0.18%)
        // + «გროკის აპლიკაცია» (78 impressions). createPost is idempotent by
        // title, so a retry returns the existing doc instead of duplicating.
        key: '2026-06-12-grok-pillar-post',
        run: async () => {
            const { PostService } = await import('@/services/post.service');
            const data = grokPillarPost as Record<string, unknown>;
            const post = await PostService.createPost({
                meta: data.meta,
                content: data.content,
                seo: data.seo,
                sources: data.sources,
            } as never);
            return `grok pillar live at /blog/${(post as { slug?: string }).slug}`;
        },
    },
];

let started = false;

export async function runSeoMigrations(): Promise<void> {
    // single-flight per process (register() can fire once per worker)
    if (started) return;
    started = true;

    // The container can come up before Mongo accepts connections — retry.
    for (let attempt = 1; ; attempt++) {
        try {
            await dbConnect();
            break;
        } catch (error) {
            if (attempt >= 3) {
                console.error('[seo-migrations] Mongo unreachable after 3 attempts — skipping this boot', error);
                return;
            }
            await new Promise((r) => setTimeout(r, 10_000 * attempt));
        }
    }

    const applied = db().collection('seo_migrations');

    for (const migration of MIGRATIONS) {
        try {
            const done = await applied.findOne({ key: migration.key });
            if (done) {
                console.log(`[seo-migrations] skipped ${migration.key} (applied ${done.appliedAt?.toISOString?.() ?? ''})`);
                continue;
            }
            const summary = await migration.run();
            await applied.insertOne({ key: migration.key, appliedAt: new Date(), summary });
            console.log(`[seo-migrations] applied ${migration.key}: ${summary}`);
        } catch (error) {
            // key not recorded -> retries on next boot; one bad step never blocks the rest
            console.error(`[seo-migrations] FAILED ${migration.key} (will retry next boot):`, error);
        }
    }
}
