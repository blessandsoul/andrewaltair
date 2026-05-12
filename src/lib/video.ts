/** Video helpers shared between the video page and the video sitemap route. */

/**
 * Convert a human-readable duration like "12:34" or "1:02:03" to ISO 8601
 * (e.g. "PT12M34S"). Already-ISO inputs pass through. Empty input → "".
 */
export function toISO8601Duration(humanDuration: string | undefined | null): string {
    if (!humanDuration) return '';
    if (humanDuration.startsWith('PT')) return humanDuration;

    const parts = humanDuration.split(':').map(Number);
    if (parts.length === 2) {
        const [m, s] = parts;
        return `PT${m}M${s}S`;
    }
    if (parts.length === 3) {
        const [h, m, s] = parts;
        return `PT${h}H${m}M${s}S`;
    }
    return humanDuration;
}

/**
 * Convert a duration string to seconds (for Google Video sitemap `<video:duration>`,
 * which expects integer seconds, NOT ISO 8601). Returns 0 if unparseable.
 * Accepts "12:34", "1:02:03", or "PT12M34S" forms.
 */
export function toDurationSeconds(humanDuration: string | undefined | null): number {
    if (!humanDuration) return 0;
    if (humanDuration.startsWith('PT')) {
        const m = humanDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!m) return 0;
        const h = parseInt(m[1] || '0', 10);
        const min = parseInt(m[2] || '0', 10);
        const s = parseInt(m[3] || '0', 10);
        return h * 3600 + min * 60 + s;
    }
    const parts = humanDuration.split(':').map((p) => parseInt(p, 10));
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
}

/** Best-quality YouTube thumbnail URL by YouTube video ID. */
export function youtubeThumbnail(youtubeId: string): string {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
}

/** Escape characters that are illegal in XML element bodies/attributes. */
export function xmlEscape(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
