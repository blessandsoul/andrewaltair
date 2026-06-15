import { Instagram, Youtube } from 'lucide-react'

/** TikTok has no lucide brand icon — a compact custom glyph. */
function TikTokGlyph({ size = 20, className }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M16.6 3c.27 2.05 1.62 3.66 3.65 3.93v2.2c-1.43 0-2.77-.43-3.9-1.17v6.43a5.74 5.74 0 1 1-5.74-5.74c.32 0 .63.03.94.08v2.44a3.32 3.32 0 1 0 2.32 3.16V3h2.73z" />
        </svg>
    )
}

/** True when an option label names a social platform → render its brand icon instead of the letter. */
export function isPlatform(label: string): boolean {
    return /reels|instagram|tiktok|shorts|youtube/i.test(label)
}

/** Brand icon for a platform-labelled option (Reels / TikTok / Shorts). Returns null for non-platform labels. */
export function PlatformIcon({ label, size = 20, className }: { label: string; size?: number; className?: string }) {
    if (/reels|instagram/i.test(label)) return <Instagram size={size} className={className} />
    if (/tiktok/i.test(label)) return <TikTokGlyph size={size} className={className} />
    if (/shorts|youtube/i.test(label)) return <Youtube size={size} className={className} />
    return null
}
