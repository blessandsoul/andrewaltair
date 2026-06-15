'use client'

import { motion } from 'framer-motion'

interface ProgressDotsProps {
    current: number // 0-based index
    total: number
}

/** Neuro-cue: «where am I in the workshop» — one glance, no reading. */
export default function ProgressDots({ current, total }: ProgressDotsProps) {
    // Long decks (e.g. the 28-round ADI workshop) overflow a phone as dots → compact bar.
    if (total > 16) {
        const pct = Math.min(100, Math.max(0, ((current + 1) / total) * 100))
        return (
            <div className="flex items-center justify-center gap-2">
                <div className="h-2 w-full max-w-[220px] overflow-hidden rounded-full bg-foreground/10">
                    <motion.div
                        className="h-full rounded-full bg-[image:var(--ws-cta)]"
                        animate={{ width: `${pct}%` }}
                        transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                    />
                </div>
                <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                    {Math.max(0, current + 1)}/{total}
                </span>
            </div>
        )
    }
    return (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
            {Array.from({ length: total }, (_, i) => {
                const done = i < current
                const active = i === current
                return (
                    <motion.span
                        key={i}
                        animate={{
                            width: active ? 22 : 7,
                            backgroundColor: active
                                ? 'var(--primary)'
                                : done
                                ? 'color-mix(in srgb, var(--primary) 45%, transparent)'
                                : 'color-mix(in srgb, var(--foreground) 12%, transparent)',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                        className="h-[7px] rounded-full"
                    />
                )
            })}
        </div>
    )
}
