'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { ChoiceCount } from '@/types/workshop.types'
import { ChoiceBar } from '@/components/workshop/ChoiceBar'
import { STR } from '@/data/workshop-strings'

interface MultiResultsProps {
    counts: ChoiceCount[]
    total: number
    revealed: boolean
    correctOptionIds?: string[]
}

/** Projector tally for a checkbox round — bars per option, every correct one flagged at reveal. */
export default function MultiResults({ counts, total, revealed, correctOptionIds }: MultiResultsProps) {
    const correct = new Set(correctOptionIds ?? [])
    return (
        <div className="mx-auto max-w-3xl space-y-4">
            {counts.map((c, i) => (
                <motion.div
                    key={c.optionId}
                    initial={revealed ? { opacity: 0, x: -24 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: revealed ? i * 0.1 : 0, duration: 0.4, ease: 'easeOut' }}
                >
                    <ChoiceBar size="lg" label={c.label} count={c.count} total={total} correct={revealed && correct.has(c.optionId)} />
                </motion.div>
            ))}
            {revealed && correct.size > 0 && (
                <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-sm font-semibold text-success">
                    <Check size={15} strokeWidth={3} /> {correct.size}
                </p>
            )}
            <p className="pt-1 text-center text-sm text-muted-foreground">{STR.results.totalVotes(total)}</p>
        </div>
    )
}
