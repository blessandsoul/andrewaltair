'use client'

import { motion } from 'framer-motion'

interface ProgressDotsProps {
    current: number // 0-based index
    total: number
}

/** Neuro-cue: «where am I in the workshop» — one glance, no reading. */
export default function ProgressDots({ current, total }: ProgressDotsProps) {
    return (
        <div className="flex items-center justify-center gap-1.5">
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
