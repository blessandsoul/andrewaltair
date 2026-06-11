/**
 * SEO title helpers.
 *
 * stripBrand() — removes a trailing "| Andrew Altair" (or dash variants) from a title.
 * The root layout template (`%s | Andrew Altair` in src/config/metadata.ts) appends
 * the brand exactly once; any brand already baked into a stored seo.metaTitle or a
 * manual append in generateMetadata produced "… | Andrew Altair | Andrew Altair"
 * in every SERP snippet. Loops so legacy double-branded DB values collapse too.
 */
const BRAND_SUFFIX = /\s*[|\-–—]\s*Andrew Altair\s*$/i;

export function stripBrand(title: string): string {
    if (!title) return '';
    let t = title.trim();
    while (BRAND_SUFFIX.test(t)) {
        t = t.replace(BRAND_SUFFIX, '').trim();
    }
    return t;
}
