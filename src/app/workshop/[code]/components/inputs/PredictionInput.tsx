'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { StudentRound } from '@/types/workshop.types'
import { STR } from '@/data/workshop-strings'

const cleanLabel = (s: string) => s.replace(/^[A-Z0-9]\s*·\s*/, '').trim()

/** Gamified bet — predict the FINAL winner before everyone's answered. Scored on reveal. */
export function PredictionInput({
    round,
    onSubmit,
}: {
    round: StudentRound
    onSubmit: (p: { predictedOptionId: string }) => Promise<boolean>
}) {
    const [picked, setPicked] = useState<string | null>(null)

    const pick = async (id: string): Promise<void> => {
        if (picked) return
        setPicked(id)
        const ok = await onSubmit({ predictedOptionId: id })
        if (!ok) setPicked(null)
    }

    return (
        <div className="mt-4 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-3">
            <p className="mb-2 text-center text-sm font-bold text-primary">{STR.predict.title}</p>
            {picked ? (
                <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-success">
                    <Check size={15} strokeWidth={3} /> {STR.predict.done}
                </p>
            ) : (
                <div className="flex flex-wrap justify-center gap-2">
                    {round.options.map((o) => (
                        <motion.button
                            key={o.id}
                            type="button"
                            whileTap={{ scale: 0.96 }}
                            onClick={() => pick(o.id)}
                            className="rounded-xl border border-border bg-card px-3 py-1.5 text-sm font-medium text-card-foreground transition hover:border-primary/50"
                        >
                            {cleanLabel(o.label)}
                        </motion.button>
                    ))}
                </div>
            )}
        </div>
    )
}
