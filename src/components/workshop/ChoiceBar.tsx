'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { springSoft } from './motion'

interface ChoiceBarProps {
    label: string
    count: number
    total: number
    correct?: boolean // the correct answer → success highlight
    mine?: boolean // the viewer's own pick → primary marker
    size?: 'sm' | 'lg' // phone (sm) vs projector (lg)
    note?: string // optional inline note (e.g. "your answer")
}

/**
 * One choice-result row, shared by the projector (BarResults, size="lg") and the
 * phone (StudentResults, size="sm") so the two renderers can't drift. Fully
 * token-based: correct → success, otherwise the deck gradient fill.
 */
export function ChoiceBar({ label, count, total, correct, mine, size = 'lg', note }: ChoiceBarProps) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0
    return (
        <div className={cn('space-y-1.5', size === 'lg' ? 'text-lg' : 'text-sm')}>
            <div className="flex items-center justify-between gap-3">
                <span className={cn('flex items-center gap-2 font-medium', correct ? 'text-success' : 'text-foreground')}>
                    {mine && <span className="size-2 shrink-0 rounded-full bg-primary" aria-hidden />}
                    <span className="truncate">{label}</span>
                    {note && <span className="text-xs font-normal text-muted-foreground">{note}</span>}
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                    {count} · {pct}%
                </span>
            </div>
            <div className={cn('overflow-hidden rounded-full bg-muted', size === 'lg' ? 'h-4' : 'h-2.5')}>
                <motion.div
                    className={cn('h-full rounded-full', correct ? 'bg-success' : 'bg-[image:var(--ws-cta)]')}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={springSoft}
                />
            </div>
        </div>
    )
}
