'use client'

import { motion } from 'framer-motion'
import { MessagesSquare, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import type { RevoteOptionResult, RevoteMove } from '@/types/workshop.types'
import NameAvatar, { nameAccent } from '@/components/workshop/NameAvatar'
import { cn } from '@/lib/utils'
import { STR } from '@/data/workshop-strings'

const cleanLabel = (s: string | null) => (s ? s.replace(/^[A-Z0-9]\s*·\s*/, '').trim() : '')

interface RevoteResultsProps {
    options: RevoteOptionResult[]
    totalOpen: number
    totalRevote: number
    movedCount: number
    moves: RevoteMove[]
    showRevote: boolean
    revealed: boolean
}

/**
 * Mazur peer-instruction shift view: phase-1 vs phase-2 paired bars per option
 * + the shift score line.
 */
export default function RevoteResults({
    options,
    totalOpen,
    totalRevote,
    movedCount,
    moves,
    showRevote,
    revealed,
}: RevoteResultsProps) {
    return (
        <div className="mx-auto max-w-3xl space-y-6">
            {revealed && showRevote && totalRevote > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="rounded-2xl border border-primary/30 bg-primary/10 px-6 py-4 text-center"
                >
                    <p className="inline-flex items-center justify-center gap-3 text-[clamp(18px,2.2vw,32px)] font-bold">
                        <MessagesSquare size={26} className="shrink-0 text-primary" />
                        <span>{STR.results.shiftMoved(movedCount)}</span>
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{STR.results.shiftSub}</p>
                </motion.div>
            )}

            {options.map((o, i) => {
                const pctOpen = totalOpen > 0 ? Math.round((o.open / totalOpen) * 100) : 0
                const pctRevote = totalRevote > 0 ? Math.round((o.revote / totalRevote) * 100) : 0
                const delta = pctRevote - pctOpen
                return (
                    <motion.div
                        key={o.optionId}
                        initial={revealed ? { opacity: 0, x: -24 } : false}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: revealed ? 0.2 + i * 0.12 : 0, duration: 0.4 }}
                    >
                        <div className="mb-2 flex items-baseline justify-between">
                            <span className="font-semibold text-[clamp(16px,1.8vw,26px)]">{o.label}</span>
                            {showRevote && totalRevote > 0 && (
                                <span
                                    className={cn(
                                        'inline-flex items-center gap-1 text-sm tabular-nums',
                                        delta > 0 ? 'text-success' : delta < 0 ? 'text-destructive' : 'text-muted-foreground',
                                    )}
                                >
                                    {delta > 0 && <TrendingUp size={14} />}
                                    {delta < 0 && <TrendingDown size={14} />}
                                    {delta > 0 ? `+${delta}%` : delta < 0 ? `${delta}%` : '—'}
                                </span>
                            )}
                        </div>
                        {/* Phase 1 */}
                        <div className="mb-1.5 flex items-center gap-3">
                            <span className="w-16 shrink-0 text-xs font-semibold uppercase text-muted-foreground">{STR.results.vote1}</span>
                            <div className="h-6 flex-1 overflow-hidden rounded-md border border-border bg-muted">
                                <motion.div
                                    className="h-full bg-foreground/30"
                                    animate={{ width: `${pctOpen}%` }}
                                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                                />
                            </div>
                            <span className="w-20 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
                                {o.open} · {pctOpen}%
                            </span>
                        </div>
                        {/* Phase 2 */}
                        <div className="flex items-center gap-3">
                            <span className="w-16 shrink-0 text-xs font-semibold uppercase text-primary">{STR.results.vote2}</span>
                            <div className="h-6 flex-1 overflow-hidden rounded-md border border-border bg-muted">
                                <motion.div
                                    className="h-full bg-[image:var(--ws-cta)]"
                                    animate={{ width: `${showRevote ? pctRevote : 0}%` }}
                                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                                />
                            </div>
                            <span className="w-20 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
                                {showRevote ? `${o.revote} · ${pctRevote}%` : '...'}
                            </span>
                        </div>
                    </motion.div>
                )
            })}
            <p className="text-center text-sm text-muted-foreground">
                {STR.results.vote1}: {totalOpen} {showRevote && `· ${STR.results.vote2}: ${totalRevote}`}
            </p>

            {/* F4: who changed their mind + their reason — systematic before/after */}
            {revealed && moves.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="space-y-2.5"
                >
                    <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">{STR.results.movesTitle}</p>
                    {moves.map((m, i) => {
                        const accent = nameAccent(m.name)
                        return (
                            <div
                                key={i}
                                className={cn(
                                    'rounded-xl border px-3.5 py-2.5',
                                    m.changed ? 'border-primary/30 bg-primary/10' : 'border-border bg-card',
                                )}
                            >
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <NameAvatar name={m.name} size={28} />
                                    <span className={cn('text-sm font-bold', accent.text)}>{m.name}</span>
                                    <span className="inline-flex items-center gap-1.5 text-sm text-card-foreground">
                                        {m.changed ? (
                                            <>
                                                <span className="text-muted-foreground line-through">{cleanLabel(m.fromLabel)}</span>
                                                <ArrowRight size={14} className="text-primary" />
                                                <span className="font-semibold text-primary">{cleanLabel(m.toLabel)}</span>
                                            </>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                {STR.results.moveKept} · {cleanLabel(m.toLabel || m.fromLabel)}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                {m.reason && <p className="mt-1.5 pl-9.5 text-[15px] text-card-foreground">«{m.reason}»</p>}
                            </div>
                        )
                    })}
                </motion.div>
            )}
        </div>
    )
}
