/**
 * Parse raw Insight.content (bot output) into a clean, render-ready body.
 *
 * The bot ("News Gem v4.0", agents/short_gem.md) emits a Georgian wire-service
 * brief whose first line is the headline ("🧪 LIGO-მ 390 ...") and whose
 * trailing lines carry source attribution ("წყარო: https://..." / "დამატებითი: https://...").
 *
 * Both pieces are ALSO rendered elsewhere on the page:
 *   - headline → <h1> from seo.metaTitle
 *   - source → dedicated source-link block bound to insight.sourceUrl
 *
 * Without parsing, the same headline + source appear twice on the page. This
 * module strips both from the body so what reaches the renderer is purely the
 * article paragraphs.
 *
 * Also computes a Georgian-calibrated reading-time estimate
 * (~1300 chars/min for silent reading of Georgian Mkhedruli).
 */

export interface ParsedInsightBody {
    /** Body paragraphs, in order, headline + source lines removed. */
    paragraphs: string[];
    /** Reading-time estimate in whole minutes (min 1). */
    readingMinutes: number;
    /** Total character count of paragraphs joined (excludes whitespace gaps). */
    chars: number;
}

// "წყარო:" / "დამატებითი:" / "Source:" / "Source(s):" lines anywhere in body.
const SOURCE_LINE_RE = /^\s*(წყარო|დამატებითი|source|sources)\s*:/i;

// Markdown link wrapper [text](url) — bot sometimes wraps URLs even after the
// spec says raw. Convert to plain text or unwrap, depending on context.
const MARKDOWN_LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

// Georgian silent-reading rate. Calibrated against published Georgian
// long-form journalism (~200wpm equivalent for Mkhedruli script).
const GE_CHARS_PER_MINUTE = 1300;

function unwrapMarkdownLinks(s: string): string {
    return s.replace(MARKDOWN_LINK_RE, (_, text, url) => {
        // If the visible text === url (bot's own quirk: [URL](URL)), keep just the URL.
        if (text.trim() === url.trim()) return url.trim();
        return text;
    });
}

/**
 * Heuristic: first non-empty line is the headline if it
 *   (a) starts with an emoji (bot v4.0 always emits 1 thematic emoji), OR
 *   (b) is short (<120 chars) AND its alphanum content overlaps the seo title.
 *
 * Either condition is enough — the bot reliably satisfies (a), and (b) catches
 * older posts written before v4.0 locked the emoji rule.
 */
function looksLikeHeadline(line: string, seoTitle?: string): boolean {
    if (!line) return false;

    // (a) Emoji-prefixed (very reliable for v4.0+)
    if (/^\s*\p{Extended_Pictographic}/u.test(line)) return true;

    // (b) Short + title overlap
    if (seoTitle && line.length < 120) {
        const a = line.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
        const b = seoTitle.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
        if (b.length >= 20 && a.includes(b.slice(0, 20))) return true;
    }

    return false;
}

/**
 * Remove only the "წყარო:" / "დამატებითი:" / "Source(s):" attribution lines,
 * keeping the headline and body. The source is already rendered from
 * insight.sourceUrl as a dedicated block, so these lines are a visible
 * duplicate in the listing card (which shows raw content, unlike the detail
 * page that runs full parseInsightBody). User directive 2026-06-18.
 */
export function stripSourceLines(content: string): string {
    if (!content) return '';
    return content
        .split(/\r?\n/)
        .filter((line) => !SOURCE_LINE_RE.test(line.trim()))
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

// Georgian short month names. toLocaleDateString('ka-GE') is unreliable: when
// the runtime (server container, limited-ICU Node) lacks Georgian locale data
// it silently falls back to the host default — which rendered dates in RUSSIAN
// ("18 июн. 2026 г."). Manual mapping + UTC getters = deterministic, identical
// on server and client (no hydration drift). User directive 2026-06-18.
const KA_MONTHS_SHORT = ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ'];

/**
 * The full, untruncated headline = first non-empty content line (the bot emits
 * the headline there). Use this for the OG title-card: seo.metaTitle is capped
 * at 70 chars for the SEO <title>, so feeding it to /api/og cut the headline
 * mid-word ("not fully visible"). The content line carries the whole thing.
 */
export function getHeadline(content: string): string {
    if (!content) return '';
    for (const line of content.split(/\r?\n/)) {
        const t = line.trim();
        if (t && !SOURCE_LINE_RE.test(t)) return t;
    }
    return '';
}

export function formatInsightDate(value: string | Date, locale: 'ka' | 'en' = 'ka'): string {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    if (locale === 'en') {
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
    }
    return `${d.getUTCDate()} ${KA_MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function parseInsightBody(content: string, seoTitle?: string): ParsedInsightBody {
    if (!content) {
        return { paragraphs: [], readingMinutes: 0, chars: 0 };
    }

    const lines = content.split(/\r?\n/);
    const kept: string[] = [];
    let firstNonEmptySeen = false;

    for (const raw of lines) {
        const t = raw.trim();

        if (!t) {
            kept.push('');
            continue;
        }

        // Drop "წყარო: ..." / "დამატებითი: ..." lines wherever they appear.
        if (SOURCE_LINE_RE.test(t)) continue;

        // Drop the first non-empty line if it looks like the headline.
        if (!firstNonEmptySeen) {
            firstNonEmptySeen = true;
            if (looksLikeHeadline(t, seoTitle)) {
                continue;
            }
        }

        kept.push(raw);
    }

    // Re-collapse: trim, split on blank-line boundaries, drop empties, unwrap markdown.
    const joined = kept.join('\n').trim();
    const paragraphs = joined
        .split(/\n{2,}/)
        .map((p) => unwrapMarkdownLinks(p.trim()))
        .filter(Boolean);

    const chars = paragraphs.reduce((sum, p) => sum + p.length, 0);
    const readingMinutes = chars > 0 ? Math.max(1, Math.round(chars / GE_CHARS_PER_MINUTE)) : 0;

    return { paragraphs, readingMinutes, chars };
}
