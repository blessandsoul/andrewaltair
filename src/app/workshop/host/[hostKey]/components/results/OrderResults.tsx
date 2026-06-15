'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { RoundResults, StudentRound } from '@/types/workshop.types'
import { springPop } from '@/components/workshop/motion'
import { cn } from '@/lib/utils'
import { STR } from '@/data/workshop-strings'

type OrderR = Extract<RoundResults, { type: 'order' }>

const cleanLabel = (s: string) => s.replace(/^[A-Z0-9]\s*·\s*/, '').trim()

/** Projector results for a drag-drop order round — correct sequence (with frames) + tally. */
export default function OrderResults({
    results,
    options,
    revealed,
}: {
    results: OrderR
    options: StudentRound['options']
    revealed: boolean
}) {
    const srcOf = (id: string) => options.find((o) => o.id === id)?.src
    const pct = results.total ? Math.round((results.correctCount / results.total) * 100) : 0

    return (
        <div className="space-y-6">
            {revealed && results.correctOrder.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={springPop}
                    className="glow-primary mx-auto max-w-3xl rounded-3xl border border-success/30 bg-card p-6 ring-2 ring-success/40"
                >
                    <div className="mb-4 flex items-center justify-center gap-2 text-success">
                        <Check size={20} strokeWidth={3} />
                        <span className="font-bold uppercase tracking-widest">{STR.orderResults.correct}</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {results.correctOrder.map((id, i) => {
                            const src = srcOf(id)
                            return (
                                <span key={id} className="flex items-center gap-3">
                                    {i > 0 && <span className="text-2xl text-muted-foreground">→</span>}
                                    <span className="flex flex-col items-center gap-1.5">
                                        {src && (
                                            <span className="relative aspect-square w-24 overflow-hidden rounded-2xl border border-border bg-foreground shadow-md">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
                                            </span>
                                        )}
                                        <span className="text-sm font-semibold text-card-foreground">
                                            {cleanLabel(results.correctLabels[i] ?? '')}
                                        </span>
                                    </span>
                                </span>
                            )
                        })}
                    </div>
                    <p className="mt-4 text-center text-lg tabular-nums text-muted-foreground">
                        {STR.orderResults.pct(pct, results.total)}
                    </p>
                </motion.div>
            )}

            {results.sequences.length > 0 && (
                <div className="mx-auto max-w-3xl space-y-2.5">
                    {results.sequences.slice(0, 5).map((s, i) => (
                        <div
                            key={i}
                            className={cn(
                                'flex items-center justify-between gap-3 rounded-2xl border px-4 py-3',
                                s.correct ? 'border-success/40 bg-success/10' : 'border-border bg-card',
                            )}
                        >
                            <span className="flex flex-wrap items-center gap-1.5">
                                {s.labels.map((l, j) => (
                                    <span key={j} className="flex items-center gap-1.5">
                                        {j > 0 && <span className="text-sm text-muted-foreground">→</span>}
                                        <span className="text-sm font-medium text-card-foreground">{cleanLabel(l)}</span>
                                    </span>
                                ))}
                            </span>
                            <span className="shrink-0 tabular-nums text-muted-foreground">{s.count}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
