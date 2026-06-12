'use client'

import { motion } from 'framer-motion'
import { MessagesSquare, TrendingUp, TrendingDown } from 'lucide-react'
import type { RevoteOptionResult } from '@/types/workshop.types'

interface RevoteResultsProps {
    options: RevoteOptionResult[]
    totalOpen: number
    totalRevote: number
    movedCount: number
    showRevote: boolean
    revealed: boolean
}

/**
 * Mazur peer-instruction shift view: phase-1 vs phase-2 paired bars per option
 * + the shift score line («дискуссия передвинула N участников»).
 */
export default function RevoteResults({
    options,
    totalOpen,
    totalRevote,
    movedCount,
    showRevote,
    revealed,
}: RevoteResultsProps) {
    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {revealed && showRevote && totalRevote > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="text-center rounded-2xl bg-violet-600/15 border border-violet-500/30 py-4 px-6"
                >
                    <p className="inline-flex items-center justify-center gap-3 text-[clamp(18px,2.2vw,32px)] font-bold">
                        <MessagesSquare size={26} className="text-violet-400 shrink-0" />
                        <span>
                            დისკუსიამ გადააადგილა <span className="text-violet-400">{movedCount}</span> მონაწილე
                        </span>
                    </p>
                    <p className="text-white/50 text-sm mt-1">Peer Instruction მუშაობს — აზრის შეცვლა სწავლის ნიშანია</p>
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
                        <div className="flex justify-between items-baseline mb-2">
                            <span className="font-semibold text-[clamp(16px,1.8vw,26px)]">{o.label}</span>
                            {showRevote && totalRevote > 0 && (
                                <span
                                    className={`inline-flex items-center gap-1 font-mono text-sm ${
                                        delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-red-400' : 'text-white/40'
                                    }`}
                                >
                                    {delta > 0 && <TrendingUp size={14} />}
                                    {delta < 0 && <TrendingDown size={14} />}
                                    {delta > 0 ? `+${delta}%` : delta < 0 ? `${delta}%` : '—'}
                                </span>
                            )}
                        </div>
                        {/* Phase 1 */}
                        <div className="flex items-center gap-3 mb-1.5">
                            <span className="w-16 text-xs font-mono uppercase text-white/40 shrink-0">ხმა 1</span>
                            <div className="flex-1 h-6 rounded-md bg-white/5 border border-white/10 overflow-hidden">
                                <motion.div
                                    className="h-full bg-white/30"
                                    animate={{ width: `${pctOpen}%` }}
                                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                                />
                            </div>
                            <span className="w-20 text-right font-mono text-white/60 text-sm shrink-0">
                                {o.open} · {pctOpen}%
                            </span>
                        </div>
                        {/* Phase 2 */}
                        <div className="flex items-center gap-3">
                            <span className="w-16 text-xs font-mono uppercase text-violet-400 shrink-0">ხმა 2</span>
                            <div className="flex-1 h-6 rounded-md bg-white/5 border border-white/10 overflow-hidden">
                                <motion.div
                                    className="h-full bg-violet-500"
                                    animate={{ width: `${showRevote ? pctRevote : 0}%` }}
                                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                                />
                            </div>
                            <span className="w-20 text-right font-mono text-white/60 text-sm shrink-0">
                                {showRevote ? `${o.revote} · ${pctRevote}%` : '...'}
                            </span>
                        </div>
                    </motion.div>
                )
            })}
            <p className="text-center text-white/40 text-sm">
                ხმა 1: {totalOpen} {showRevote && `· ხმა 2: ${totalRevote}`}
            </p>
        </div>
    )
}
