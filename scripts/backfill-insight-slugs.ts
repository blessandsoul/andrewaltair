/**
 * Backfill legacy /insights slugs that contained HTML-entity junk.
 *
 * Background: an earlier slugifier did `.replace(/[^a-z0-9]+/g, '-')` on a title
 * that still carried `&#039;` / `&quot;` entity fragments. Result was URLs like
 *   /insights/sam-altman-039-s-coworkers-say-...
 *   /insights/anthropic-warns-that-quot-reckless-quot-claude-mythos-...
 * Audit on 2026-05-27 found 27 docs with `-039-` and 11 with `-quot-`.
 *
 * Strategy:
 *   1. Find every Insight whose slug matches /-039-|-quot-/.
 *   2. Decode HTML entities in sourceTitle, rebuild slug via titleToSlug().
 *   3. Collision-check against existing clean slugs; append `-2` if needed.
 *   4. In --commit mode: update doc.slug + canonicalUrl, write old→new pair into
 *      src/data/insightSlugRedirects.ts so middleware can 301 the old URL.
 *   5. In default (dry-run) mode: print the plan, change nothing.
 *
 * Usage:
 *   npx tsx scripts/backfill-insight-slugs.ts            # dry-run, no writes
 *   npx tsx scripts/backfill-insight-slugs.ts --commit   # apply
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Re-implemented here so the script does not pull the Next.js path alias `@/lib/slug`
// (tsx CLI doesn't resolve `@/*` without extra config).
const HTML_ENTITIES: Record<string, string> = {
    '&amp;': '&', '&lt;': '<', '&gt;': '>',
    '&quot;': '"', '&apos;': "'",
    '&nbsp;': ' ', '&ndash;': '-', '&mdash;': '-',
    '&hellip;': '...', '&laquo;': '"', '&raquo;': '"',
    '&lsquo;': "'", '&rsquo;': "'", '&ldquo;': '"', '&rdquo;': '"',
};

function decodeHtmlEntities(s: string): string {
    if (!s) return '';
    return s
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
        .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
        .replace(/&[a-zA-Z]+;/g, (m) => HTML_ENTITIES[m] ?? '');
}

function titleToSlug(raw: string, maxLength = 60): string {
    if (!raw) return '';
    return decodeHtmlEntities(raw)
        .toLowerCase()
        .replace(/['"`’‘”“]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, maxLength)
        .replace(/-+$/g, '');
}

interface InsightDoc {
    _id: mongoose.Types.ObjectId;
    slug: string;
    sourceTitle: string;
    seo?: { canonicalUrl?: string };
}

const REDIRECT_MAP_PATH = path.resolve(
    process.cwd(),
    'src/data/insightSlugRedirects.ts'
);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge';
const COMMIT = process.argv.includes('--commit');

async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MONGODB_URI missing in env');
        process.exit(1);
    }

    console.log(`\n🔍 backfill-insight-slugs — mode: ${COMMIT ? '🟢 COMMIT' : '⚪ DRY-RUN'}\n`);

    await mongoose.connect(uri);
    console.log('✅ connected to MongoDB');

    const Insight = mongoose.connection.collection('insights');

    const broken = (await Insight.find({
        slug: { $regex: /(-039-|-quot-|-039$|-quot$|^039-|^quot-)/ },
    }).toArray()) as unknown as InsightDoc[];

    console.log(`📋 found ${broken.length} insights with broken slugs\n`);

    if (broken.length === 0) {
        console.log('✨ nothing to do');
        await mongoose.disconnect();
        return;
    }

    // Pre-load existing clean slugs for collision-detection
    const existingSlugs = new Set<string>();
    const allClean = await Insight.find(
        { slug: { $not: /(-039-|-quot-|-039$|-quot$|^039-|^quot-)/ } },
        { projection: { slug: 1 } }
    ).toArray();
    for (const d of allClean) existingSlugs.add((d as { slug: string }).slug);

    const redirects: Record<string, string> = {};
    const plan: Array<{ old: string; next: string; collision: boolean }> = [];

    for (const doc of broken) {
        const base = titleToSlug(doc.sourceTitle, 60);
        if (!base) {
            console.warn(`⚠ skip ${doc._id} — no sourceTitle to rebuild slug from`);
            continue;
        }

        let next = base;
        let counter = 2;
        let collision = false;
        while (existingSlugs.has(next) || Object.values(redirects).includes(next)) {
            collision = true;
            next = `${base}-${counter++}`;
            if (counter > 100) break;
        }

        plan.push({ old: doc.slug, next, collision });
        redirects[doc.slug] = next;
        existingSlugs.add(next);
    }

    // Print plan
    console.log('PLAN:');
    for (const p of plan) {
        const flag = p.collision ? ' ⚠ collision' : '';
        console.log(`  /insights/${p.old}`);
        console.log(`  → /insights/${p.next}${flag}\n`);
    }

    if (!COMMIT) {
        console.log(`\n💡 dry-run complete. ${plan.length} slugs would be rewritten.`);
        console.log('   re-run with --commit to apply.\n');
        await mongoose.disconnect();
        return;
    }

    // Apply DB updates
    let updated = 0;
    for (const p of plan) {
        const canonical = `${SITE_URL}/insights/${p.next}`;
        const res = await Insight.updateOne(
            { slug: p.old },
            { $set: { slug: p.next, 'seo.canonicalUrl': canonical } }
        );
        if (res.modifiedCount === 1) updated++;
        else console.warn(`⚠ no-op on ${p.old}`);
    }
    console.log(`\n✅ updated ${updated}/${plan.length} insight docs`);

    // Write redirect map (merge with any existing entries)
    const existing = readExistingRedirects();
    const merged = { ...existing, ...redirects };
    writeRedirectMap(merged);
    console.log(`✅ wrote ${Object.keys(merged).length} redirects to ${path.relative(process.cwd(), REDIRECT_MAP_PATH)}`);

    await mongoose.disconnect();
    console.log('\n🎯 done. deploy + middleware will 301 old URLs to new.\n');
}

function readExistingRedirects(): Record<string, string> {
    try {
        const src = fs.readFileSync(REDIRECT_MAP_PATH, 'utf8');
        const m = src.match(/INSIGHT_SLUG_REDIRECTS\s*:\s*Record<string,\s*string>\s*=\s*\{([\s\S]*?)\};/);
        if (!m) return {};
        const body = m[1];
        const entries: Record<string, string> = {};
        const re = /['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g;
        let match: RegExpExecArray | null;
        while ((match = re.exec(body)) !== null) {
            entries[match[1]] = match[2];
        }
        return entries;
    } catch {
        return {};
    }
}

function writeRedirectMap(map: Record<string, string>) {
    const entries = Object.entries(map)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `    '${k}': '${v}',`)
        .join('\n');
    const out = `/**
 * 301 redirect map for legacy /insights/* slugs that contained HTML-entity garbage
 * (\`-039-\` = encoded apostrophe, \`-quot-\` = encoded quotation mark).
 *
 * Populated by \`scripts/backfill-insight-slugs.ts\`. After Google has fully recrawled
 * and dropped the old URLs from its index (typically 3-6 months), this map can be
 * truncated.
 *
 * Consumed by \`src/middleware.ts\` at edge runtime — must stay JSON-serializable
 * and contain no DB / Node-only imports.
 */
export const INSIGHT_SLUG_REDIRECTS: Record<string, string> = {
${entries}
};
`;
    fs.writeFileSync(REDIRECT_MAP_PATH, out, 'utf8');
}

main().catch((err) => {
    console.error('💥 migration failed:', err);
    process.exit(1);
});
