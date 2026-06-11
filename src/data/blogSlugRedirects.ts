/**
 * 301 redirect map for legacy /blog/* slugs.
 *
 * Two failure classes feed this map (SEO audit 2026-06-12):
 *   1. Duplicate publications — the same article was minted twice and the loser
 *      got a `-2` suffix slug. Loser 301s to the canonical; the loser doc is
 *      archived in the DB by `scripts/seo-dedupe-apply.ts` so it leaves the sitemap.
 *   2. Dead base slugs — the suffixed variant is the only live doc, but the
 *      suffix-less URL leaked into the sitemap/index and soft-404'd. Base 301s
 *      to the live variant.
 *
 * Consumed by `src/middleware.ts` at edge runtime AND excluded from
 * `src/app/sitemap.ts` — must stay JSON-serializable, no DB / Node-only imports.
 */
export const BLOG_SLUG_REDIRECTS: Record<string, string> = {
    // duplicate publication — canonical is the suffix-less original
    'ai-laws-business-regulation-2026-2': 'ai-laws-business-regulation-2026',
    // dead base slug — the only live doc carries the -2 suffix
    'snapgen-plus-plus-mobile-ai-revolution': 'snapgen-plus-plus-mobile-ai-revolution-2',
};
