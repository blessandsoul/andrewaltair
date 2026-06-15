import { Flame, Heart, Laugh, PartyPopper, Sparkles, ThumbsUp, type LucideIcon } from 'lucide-react'
import type { ReactionKind } from '@/types/workshop.types'

/** The reaction set — lucide icons (not emoji), each with a brand color. Shared by the
 *  student ReactionBar and the projector ReactionsOverlay so they never drift. */
export const REACTIONS: { kind: ReactionKind; Icon: LucideIcon; color: string }[] = [
    { kind: 'clap', Icon: ThumbsUp, color: '#fbbf24' },
    { kind: 'fire', Icon: Flame, color: '#fb923c' },
    { kind: 'love', Icon: Heart, color: '#fb7185' },
    { kind: 'haha', Icon: Laugh, color: '#facc15' },
    { kind: 'wow', Icon: Sparkles, color: '#a78bfa' },
    { kind: 'party', Icon: PartyPopper, color: '#f472b6' },
]

export const REACTION_BY_KIND: Record<string, { Icon: LucideIcon; color: string }> = Object.fromEntries(
    REACTIONS.map((r) => [r.kind, { Icon: r.Icon, color: r.color }]),
)
