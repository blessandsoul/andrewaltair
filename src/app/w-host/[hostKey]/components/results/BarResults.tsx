'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { ChoiceCount } from '@/types/workshop.types'

interface BarResultsProps {
    counts: ChoiceCount[]
    total: number
    revealed: boolean
    correctOptionId?: string
}

/** rAF count-up: animates a number old→new on every change. */
function useCountUp(target: number, ms = 600): number {
    const [value, setValue] = useState(target)
    const fromRef = useRef(target)
    useEffect(() => {
        const from = fromRef.current
        if (from === target) return
        const start = performance.now()
        let raf = 0
        const step = (t: number) => {
            const p = Math.min(1, (t - start) / ms)
            const eased = 1 - Math.pow(1 - p, 3)
            setValue(Math.round(from + (target - from) * eased))
            if (p < 1) raf = requestAnimationFrame(step)
            else fromRef.current = target
        }
        raf = requestAnimationFrame(step)
        return () => cancelAnimationFrame(raf)
    }, [target, ms])
    return value
}

function Bar({ c, total, isCorrect, index, revealed }: {
    c: ChoiceCount
    total: number
    isCorrect: boolean
    index: number
    revealed: boolean
}) {
    const count = useCountUp(c.count)
    const pct = total > 0 ? Math.round((c.count / total) * 100) : 0
    const shownPct = useCountUp(pct)
    return (
        <motion.div
            initial={revealed ? { opacity: 0, x: -24 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: revealed ? index * 0.12 : 0, duration: 0.4, ease: 'easeOut' }}
        >
            <div className="flex justify-between items-baseline mb-1.5">
                <span
                    className={`inline-flex items-center gap-2 font-semibold text-[clamp(16px,1.8vw,26px)] ${
                        isCorrect ? 'text-emerald-400' : ''
                    }`}
                >
                    {c.label} {isCorrect && <Check size={20} strokeWidth={2.5} />}
                </span>
                <span className="text-white/60 font-mono text-[clamp(13px,1.4vw,20px)] tabular-nums">
                    {count} · {shownPct}%
                </span>
            </div>
            <div className="h-9 rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                <motion.div
                    className={`h-full ${isCorrect ? 'bg-emerald-500' : 'bg-violet-600'}`}
                    animate={{ width: `${pct}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
            </div>
        </motion.div>
    )
}

export default function BarResults({ counts, total, revealed, correctOptionId }: BarResultsProps) {
    return (
        <div className="space-y-4 max-w-3xl mx-auto">
            {counts.map((c, i) => (
                <Bar
                    key={c.optionId}
                    c={c}
                    total={total}
                    isCorrect={correctOptionId === c.optionId}
                    index={i}
                    revealed={revealed}
                />
            ))}
            <p className="text-center text-white/40 text-sm pt-1">სულ ხმა: {total}</p>
        </div>
    )
}
