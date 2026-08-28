/**
 * Publish /short content to the andrewaltair.ge insights surfaces.
 *
 *   KA long.md                       -> /insights      (language: 'ka')
 *   reddit/<day>/<item>/short_en.md  -> /en/insights   (language: 'en')
 *
 * Source content lives in the sibling AGENT repo:
 *   ../agents/short/content/<YYYYMMDD>_<day>_<slug>/{long.md,meta.md}
 *   ../agents/short/content/reddit/<YYYYMMDD>_<day>/<NN>_<slug>/short_en.md
 *
 * Mechanism: HTTP POST to /api/insights on a RUNNING server (local dev by
 * default) so ALL server-side logic is reused — slug/OG/tag extraction,
 * cross-linking, IndexNow, and the per-language idempotency guard (re-running
 * never duplicates). The script only reads files and builds payloads; it does
 * not touch Mongo directly (the service uses '@/' path aliases that tsx can't
 * resolve from a bare script).
 *
 * Auth: mints an admin JWT from ADMIN_SESSION_SECRET (.env.local) — matches the
 * local dev server's secret. Not needed in --dry mode.
 *
 * Usage:
 *   npx tsx scripts/publish-insights.ts --dry                 # today, preview only (no writes, no server)
 *   npx tsx scripts/publish-insights.ts --date 20260618 --dry
 *   npx tsx scripts/publish-insights.ts --date 20260618       # POST to http://localhost:3000 (dev server must be up)
 *   npx tsx scripts/publish-insights.ts --date 20260618 --ka  # KA only
 *   npx tsx scripts/publish-insights.ts --date 20260618 --en  # EN only
 *   npx tsx scripts/publish-insights.ts --date 20260618 --draft   # publish as draft for review
 *   npx tsx scripts/publish-insights.ts --date 20260618 --base https://andrewaltair.ge
 */
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// ---- args ----
const argv = process.argv.slice(2);
const has = (f: string) => argv.includes(f);
const valOf = (f: string): string | undefined => {
    const i = argv.indexOf(f);
    return i >= 0 ? argv[i + 1] : undefined;
};

function todayYmd(): string {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
}

const DATE = valOf('--date') || todayYmd();
const DRY = has('--dry');
const ONLY_KA = has('--ka');
const ONLY_EN = has('--en');
const DO_KA = !ONLY_EN;       // both by default; --en suppresses KA
const DO_EN = !ONLY_KA;       // both by default; --ka suppresses EN
const STATUS = has('--draft') ? 'draft' : 'published';
const BASE = (valOf('--base') || 'http://localhost:3000').replace(/\/$/, '');

const CONTENT_ROOT = path.resolve(process.cwd(), '..', 'agents', 'short', 'content');

// ---- helpers ----

/** Parse the small, well-formed /short meta.md frontmatter (no YAML dep).
 *  Handles scalars, `[inline, arrays]`, and `key:` + `  - block` lists. */
function parseFrontmatter(md: string): Record<string, any> {
    const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!m) return {};
    const out: Record<string, any> = {};
    let curKey: string | null = null;
    for (const raw of m[1].split(/\r?\n/)) {
        const listItem = raw.match(/^\s*-\s+(.*)$/);
        if (listItem && curKey) {
            const v = listItem[1].trim().replace(/^["']|["']$/g, '');
            (out[curKey] ||= []).push(v);
            continue;
        }
        const kv = raw.match(/^([a-zA-Z_]+):\s*(.*)$/);
        if (!kv) continue;
        const key = kv[1];
        const val = kv[2].trim();
        if (val === '') { curKey = key; out[key] ||= []; }
        else if (val.startsWith('[')) {
            out[key] = val.replace(/^\[|\]$/g, '').split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
            curKey = null;
        } else { out[key] = val.replace(/^["']|["']$/g, ''); curKey = null; }
    }
    return out;
}

function firstNonEmptyLine(text: string): string {
    for (const l of text.split(/\r?\n/)) {
        const t = l.trim();
        if (t) return t;
    }
    return '';
}

function stripLeadingEmoji(s: string): string {
    return s.replace(/^\s*\p{Extended_Pictographic}️?\s*/u, '').trim();
}

interface Payload {
    lane: 'KA' | 'EN';
    folder: string;
    body: {
        content: string;
        sourceUrl: string;
        slug?: string;
        headline?: string;
        imageUrl?: string;
        language: 'ka' | 'en';
        tags?: string[];
        status: 'draft' | 'published';
        publishedAt?: string;
    };
}

function collectKa(): Payload[] {
    const out: Payload[] = [];
    if (!fs.existsSync(CONTENT_ROOT)) return out;
    const dirs = fs.readdirSync(CONTENT_ROOT, { withFileTypes: true })
        .filter(d => d.isDirectory() && d.name.startsWith(`${DATE}_`) && d.name !== 'reddit')
        .map(d => d.name)
        .sort();
    for (const name of dirs) {
        const dir = path.join(CONTENT_ROOT, name);
        const longPath = path.join(dir, 'long.md');
        const metaPath = path.join(dir, 'meta.md');
        if (!fs.existsSync(longPath)) { console.warn(`  SKIP ${name}: no long.md`); continue; }
        const content = fs.readFileSync(longPath, 'utf8').trim();
        const meta = fs.existsSync(metaPath) ? parseFrontmatter(fs.readFileSync(metaPath, 'utf8')) : {};
        const rawSlug = meta.slug ? String(meta.slug) : name.split('_').slice(2).join('_');
        const sourceUrl = `https://andrewaltair.ge/insight/${rawSlug}`;
        const headline = (Array.isArray(meta.headline_alt) && meta.headline_alt[0])
            ? String(meta.headline_alt[0]).trim()
            : stripLeadingEmoji(firstNonEmptyLine(content));
        
        const dateMatch = name.match(/^(20\d{6})/);
        const publishedAt = dateMatch ? `${dateMatch[1].slice(0,4)}-${dateMatch[1].slice(4,6)}-${dateMatch[1].slice(6,8)}T12:00:00.000Z` : undefined;

        let imageUrl: string | undefined = undefined;
        const coverJpg = path.join(dir, 'cover.jpg');
        if (fs.existsSync(coverJpg)) {
            const publicCoversDir = path.join(__dirname, '../public/covers');
            if (!fs.existsSync(publicCoversDir)) fs.mkdirSync(publicCoversDir, { recursive: true });
            fs.copyFileSync(coverJpg, path.join(publicCoversDir, `${rawSlug}.jpg`));
            imageUrl = `https://andrewaltair.ge/uploads/${rawSlug}.jpg`;
        }

        out.push({
            lane: 'KA', folder: name,
            body: {
                content, sourceUrl,
                slug: meta.slug ? String(meta.slug) : undefined,
                headline,
                imageUrl,
                language: 'ka',
                tags: Array.isArray(meta.entity_tokens) ? meta.entity_tokens : undefined,
                status: STATUS,
                publishedAt,
            },
        });
    }
    return out;
}

function collectEn(): Payload[] {
    const out: Payload[] = [];
    const redditRoot = path.join(CONTENT_ROOT, 'reddit');
    if (!fs.existsSync(redditRoot)) return out;
    const dayDirs = fs.readdirSync(redditRoot, { withFileTypes: true })
        .filter(d => d.isDirectory() && d.name.startsWith(`${DATE}_`))
        .map(d => d.name);
    for (const day of dayDirs) {
        const dayPath = path.join(redditRoot, day);
        const itemDirs = fs.readdirSync(dayPath, { withFileTypes: true })
            .filter(d => d.isDirectory())
            .map(d => d.name)
            .sort();
        for (const item of itemDirs) {
            const f = path.join(dayPath, item, 'short_en.md');
            if (!fs.existsSync(f)) { console.warn(`  SKIP reddit/${day}/${item}: no short_en.md`); continue; }
            const content = fs.readFileSync(f, 'utf8').trim();
            const srcMatch = content.match(/^Source(?:\(s\))?:\s*(\S+)/im);
            const sourceUrl = srcMatch?.[1];
            if (!sourceUrl) { console.warn(`  SKIP reddit/${day}/${item}: no Source: URL in short_en.md`); continue; }
            const base = item.replace(/^\d+[_-]/, '');
            const headline = firstNonEmptyLine(content);
            
            const dateMatch = day.match(/^(20\d{6})/);
            const publishedAt = dateMatch ? `${dateMatch[1].slice(0,4)}-${dateMatch[1].slice(4,6)}-${dateMatch[1].slice(6,8)}T12:05:00.000Z` : undefined;

            out.push({
                lane: 'EN', folder: `reddit/${day}/${item}`,
                body: {
                    content, sourceUrl,
                    slug: `${base}-en`,
                    headline,
                    language: 'en',
                    status: STATUS,
                },
            });
        }
    }
    return out;
}

function mintToken(): string {
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!secret) throw new Error('ADMIN_SESSION_SECRET missing (.env.local) — cannot authenticate POST');
    return jwt.sign({ role: 'admin', iat: Date.now() }, secret, { expiresIn: '24h' });
}

async function post(p: Payload, token: string): Promise<string> {
    const res = await fetch(`${BASE}/api/insights`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        },
        body: JSON.stringify(p.body),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
    let slug = '?';
    try { slug = JSON.parse(text)?.data?.slug ?? '?'; } catch { /* keep ? */ }
    return slug;
}

async function main() {
    const payloads = [
        ...(DO_KA ? collectKa() : []),
        ...(DO_EN ? collectEn() : []),
    ];

    const kaN = payloads.filter(p => p.lane === 'KA').length;
    const enN = payloads.filter(p => p.lane === 'EN').length;
    console.log(`\npublish-insights — date=${DATE} status=${STATUS} ${DRY ? '(DRY RUN)' : `→ ${BASE}`}`);
    console.log(`found: ${kaN} KA + ${enN} EN = ${payloads.length} total\n`);

    if (payloads.length === 0) { console.log('Nothing to publish.'); return; }

    if (DRY) {
        for (const p of payloads) {
            console.log(`[${p.lane}] ${p.folder}`);
            console.log(`     slug:     ${p.body.slug}`);
            console.log(`     headline: ${(p.body.headline || '').slice(0, 80)}`);
            console.log(`     source:   ${p.body.sourceUrl}`);
            console.log(`     content:  ${p.body.content.length} chars\n`);
        }
        console.log('DRY RUN — nothing written. Drop --dry to publish (dev server must be running).');
        return;
    }

    const token = mintToken();
    let ok = 0, fail = 0;
    for (const p of payloads) {
        try {
            const slug = await post(p, token);
            console.log(`  OK   [${p.lane}] ${p.folder} → ${slug}`);
            ok++;
        } catch (e: any) {
            console.error(`  FAIL [${p.lane}] ${p.folder}: ${e.message}`);
            fail++;
        }
    }
    console.log(`\nDone: ${ok} ok, ${fail} failed. (re-runs are idempotent per sourceUrl+language)`);
    if (fail > 0) process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exit(1); });
