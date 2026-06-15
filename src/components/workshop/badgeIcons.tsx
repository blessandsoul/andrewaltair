import { Clapperboard, Flame, Medal, RefreshCw, Star, Target, Trophy, Zap, type LucideIcon } from 'lucide-react'

/** Badge id → lucide icon + brand color (replaces the emoji on every badge surface). */
const BADGE_ICON: Record<string, { Icon: LucideIcon; color: string }> = {
    lightning: { Icon: Zap, color: '#fbbf24' },
    streak: { Icon: Flame, color: '#fb923c' },
    mindchange: { Icon: RefreshCw, color: '#a78bfa' },
    director: { Icon: Clapperboard, color: '#f472b6' },
    oracle: { Icon: Target, color: '#34d399' },
    onair: { Icon: Star, color: '#f0abfc' },
    champion: { Icon: Trophy, color: '#ffd700' },
}

export function BadgeIcon({ id, size = 18, className }: { id: string; size?: number; className?: string }) {
    const b = BADGE_ICON[id]
    if (!b) return null
    const { Icon, color } = b
    return <Icon size={size} className={className} style={{ color }} />
}

const MEDAL_COLOR = ['#ffd700', '#cbd5e1', '#d8a05a'] // gold / silver / bronze (top-3)

export function MedalIcon({ rank, size = 22, className }: { rank: number; size?: number; className?: string }) {
    const color = MEDAL_COLOR[rank - 1]
    if (!color) return null
    return <Medal size={size} className={className} style={{ color }} />
}
