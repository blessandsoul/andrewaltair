/**
 * 301 redirect map for legacy /insights/* slugs that contained HTML-entity garbage
 * (`-039-` = encoded apostrophe, `-quot-` = encoded quotation mark).
 *
 * Populated by `scripts/backfill-insight-slugs.ts`. After Google has fully recrawled
 * and dropped the old URLs from its index (typically 3-6 months), this map can be
 * truncated.
 *
 * Consumed by `src/middleware.ts` at edge runtime — must stay JSON-serializable
 * and contain no DB / Node-only imports.
 */
export const INSIGHT_SLUG_REDIRECTS: Record<string, string> = {
    // Filled by migration script. Format: oldSlug → newSlug.
};
