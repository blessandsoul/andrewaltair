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

    // --- SEO audit 2026-06-12 ---
    // duplicate publications — canonical is the suffix-less original;
    // the -2 doc is archived by scripts/seo-dedupe-apply.ts
    'anthropic-customers-creeped-out-by-its-newest-models-2': 'anthropic-customers-creeped-out-by-its-newest-models',
    'less-work-equal-pay-openai-lays-out-its-vision-for-a-world-r-2': 'less-work-equal-pay-openai-lays-out-its-vision-for-a-world-r',
    // dead base slugs — the only live doc carries the suffix
    'spatial-reframing-will-fix-your-bad-iphone-photos-with-ios': 'spatial-reframing-will-fix-your-bad-iphone-photos-with-ios-2',
    'from-gpt-2-to-claude-mythos-the-return-of-ai-models-deemed': 'from-gpt-2-to-claude-mythos-the-return-of-ai-models-deemed-0',
};
