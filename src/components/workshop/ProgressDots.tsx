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
                            backgroundColor: active ? '#7c3aed' : done ? '#c4b5fd' : 'rgba(14,15,31,0.12)',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                        className="h-[7px] rounded-full"
                    />
                )
            })}
        </div>
    )
}
