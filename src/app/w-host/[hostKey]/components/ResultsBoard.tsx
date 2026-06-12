'use client'

import { MessagesSquare, RotateCcw, BarChart3, Lock, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { StudentRound, RoundResults } from '@/types/workshop.types'
import TextWall from './results/TextWall'
import BarResults from './results/BarResults'
import RevoteResults from './results/RevoteResults'
import Histogram from './results/Histogram'

interface ResultsBoardProps {
    round: StudentRound | null
    results: RoundResults | null
    onPin: (action: string, responseId?: string) => void
}

const PHASE_BADGES: Record<string, { icon: LucideIcon | null; label: string; live?: boolean }> = {
    closed: { icon: Lock, label: 'დახურულია' },
    open: { icon: null, label: 'ღიაა — პასუხები მოდის', live: true },
    discuss: { icon: MessagesSquare, label: 'დისკუსიის ფაზა' },
    revote: { icon: RotateCcw, label: 'ხელახალი ხმის მიცემა' },
    revealed: { icon: BarChart3, label: 'შედეგები' },
}

function PhaseBadge({ phase }: { phase: string }) {
    const badge = PHASE_BADGES[phase]
    if (!badge) return null
    const Icon = badge.icon
    return (
        <p className="inline-flex items-center justify-center gap-2 text-[clamp(12px,1.2vw,18px)] font-mono uppercase tracking-widest text-violet-400">
            {badge.live && <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />}
            {Icon && <Icon size={15} />}
            {badge.label}
        </p>
    )
}

export default function ResultsBoard({ round, results, onPin }: ResultsBoardProps) {
    if (!round) return null

    // Pinned quote takes over the projected area (spotlight a student's thinking)
    if (round.pinned) {
        return (
            <div className="max-w-5xl mx-auto h-full flex flex-col items-center justify-center text-center space-y-8">
                <p className="text-[clamp(28px,4.5vw,64px)] font-bold leading-snug">
                    «{round.pinned.textValue}»
                </p>
                <p className="text-[clamp(16px,2vw,28px)] font-mono uppercase tracking-widest text-violet-400">
                    — {round.pinned.name}
                </p>
                <button
                    onClick={() => onPin('unpin')}
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm text-white/40 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
                >
                    <X size={16} /> მოხსნა
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <PhaseBadge phase={round.phase} />
                {/* projected typography: scales with viewport so the back of the room reads it */}
                <h2 className="text-[clamp(26px,3.2vw,52px)] font-bold leading-snug">{round.prompt}</h2>
            </div>

            {!results && <p className="text-center text-white/40">პასუხები ჯერ არ არის</p>}

            {results?.type === 'text' && <TextWall items={results.items} onPin={onPin} />}
            {results?.type === 'choice' && (
                <BarResults
                    counts={results.counts}
                    total={results.total}
                    revealed={round.phase === 'revealed'}
                    correctOptionId={round.phase === 'revealed' ? results.correctOptionId : undefined}
                />
            )}
            {results?.type === 'choice_revote' && (
                <RevoteResults
                    options={results.options}
                    totalOpen={results.totalOpen}
                    totalRevote={results.totalRevote}
                    movedCount={results.movedCount}
                    showRevote={round.phase === 'revote' || round.phase === 'revealed'}
                    revealed={round.phase === 'revealed'}
                />
            )}
            {results?.type === 'number' && (
                <Histogram buckets={results.buckets} total={results.total} avg={results.avg} />
            )}
        </div>
    )
}
