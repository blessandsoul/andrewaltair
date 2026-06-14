'use client'

import { motion } from 'framer-motion'
import type { ChoiceCount } from '@/types/workshop.types'
import { ChoiceBar } from '@/components/workshop/ChoiceBar'
import { STR } from '@/data/workshop-strings'

interface BarResultsProps {
    counts: ChoiceCount[]
    total: number
    revealed: boolean
    correctOptionId?: string
}

export default function BarResults({ counts, total, revealed, correctOptionId }: BarResultsProps) {
    return (
        <div className="mx-auto max-w-3xl space-y-4">
            {counts.map((c, i) => (
                <motion.div
                    key={c.optionId}
                    initial={revealed ? { opacity: 0, x: -24 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: revealed ? i * 0.12 : 0, duration: 0.4, ease: 'easeOut' }}
                >
                    <ChoiceBar
                        size="lg"
                        label={c.label}
                        count={c.count}
                        total={total}
                        correct={correctOptionId === c.optionId}
                    />
                </motion.div>
            ))}
            <p className="pt-1 text-center text-sm text-muted-foreground">{STR.results.totalVotes(total)}</p>
        </div>
    )
}
