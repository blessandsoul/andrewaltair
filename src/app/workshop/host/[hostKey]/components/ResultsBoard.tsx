'use client'

import { motion } from 'framer-motion'
import { MessagesSquare, RotateCcw, BarChart3, Lock, X, Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { StudentRound, RoundResults, ChoiceCount, RoundPhase } from '@/types/workshop.types'
import TextWall from './results/TextWall'
import BarResults from './results/BarResults'
import RevoteResults from './results/RevoteResults'
import Histogram from './results/Histogram'
import NameAvatar, { nameAccent } from '@/components/workshop/NameAvatar'
import { Button } from '@/components/ui/button'
import { PHASE_THEME } from '@/components/workshop/phaseTheme'
import { springPop, springSoft } from '@/components/workshop/motion'
import { cn } from '@/lib/utils'
import { STR } from '@/data/workshop-strings'

const cleanLabel = (s: string) => s.replace(/^[A-Z0-9]\s*·\s*/, '').trim()

/** F1: the chosen option as a big fullscreen card — «we picked what we'll do». */
function WinnerCard({ counts, options }: { counts: ChoiceCount[]; options: StudentRound['options'] }) {
    const top = counts.reduce<ChoiceCount | null>((best, c) => (!best || c.count > best.count ? c : best), null)
    if (!top) return null
    const src = options.find((o) => o.id === top.optionId)?.src
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={springSoft}
            className="glow-primary mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-primary/30 bg-card ring-2 ring-primary/40"
        >
            <div className="flex flex-col items-stretch sm:flex-row">
                {src && (
                    <div className="relative aspect-4/3 shrink-0 bg-foreground sm:aspect-auto sm:w-2/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
                    </div>
                )}
                <div className="flex flex-1 flex-col justify-center gap-3 p-7 text-center sm:text-left">
                    <span className="inline-flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest text-success sm:justify-start">
                        <Check size={18} strokeWidth={3} /> {STR.results.winner}
                    </span>
                    <p className="text-[clamp(24px,3vw,44px)] font-bold leading-tight text-foreground">{cleanLabel(top.label)}</p>
                    <p className="text-lg tabular-nums text-muted-foreground">{STR.results.winnerVotes(top.count)}</p>
                </div>
            </div>
        </motion.div>
    )
}

interface ResultsBoardProps {
    round: StudentRound | null
    results: RoundResults | null
    onPin: (action: string, responseId?: string) => void
    /** projected display: hide pin/unpin controls (managed from the remote) */
    readonly?: boolean
}

const PHASE_BADGES: Record<string, { icon: LucideIcon | null; label: string; live?: boolean }> = {
    closed: { icon: Lock, label: STR.phaseBadge.closed },
    open: { icon: null, label: STR.phaseBadge.open, live: true },
    discuss: { icon: MessagesSquare, label: STR.phaseBadge.discuss },
    revote: { icon: RotateCcw, label: STR.phaseBadge.revote },
    revealed: { icon: BarChart3, label: STR.phaseBadge.revealed },
}

function PhaseBadge({ phase }: { phase: string }) {
    const badge = PHASE_BADGES[phase]
    if (!badge) return null
    const Icon = badge.icon
    const theme = PHASE_THEME[phase as RoundPhase]?.badge ?? 'bg-primary/10 text-primary'
    return (
        <span
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-full px-3 py-1 text-[clamp(12px,1.2vw,18px)] font-semibold uppercase tracking-widest',
                theme,
            )}
        >
            {badge.live && <span className="size-2 animate-pulse rounded-full bg-current" />}
            {Icon && <Icon size={15} />}
            {badge.label}
        </span>
    )
}

export default function ResultsBoard({ round, results, onPin, readonly = false }: ResultsBoardProps) {
    if (!round) return null

    // Pinned answer → ONE compact spotlight card (same size as a normal answer card)
    if (round.pinned) {
        const accent = nameAccent(round.pinned.name)
        return (
            <div className="flex h-full items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={springPop}
                    className="glass-strong relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card ring-2 ring-primary/40 shadow-xl"
                >
                    <span className={cn('absolute inset-y-0 left-0 w-1.5', accent.solid)} />
                    <span aria-hidden className="absolute -top-3 right-4 select-none text-[72px] font-bold leading-none text-foreground/5">
                        „
                    </span>
                    <div className="py-5 pl-6 pr-5">
                        <div className="mb-3 flex items-center justify-between gap-2">
                            <span className="inline-flex min-w-0 items-center gap-2.5">
                                <NameAvatar name={round.pinned.name} size={34} />
                                <span className={cn('truncate rounded-full px-3 py-1 text-sm font-bold', accent.soft, accent.text)}>
                                    {round.pinned.name}
                                </span>
                            </span>
                            {!readonly && (
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => onPin('unpin')}
                                    title={STR.results.unpin}
                                    aria-label={STR.results.unpin}
                                    className="shrink-0 text-muted-foreground"
                                >
                                    <X size={18} />
                                </Button>
                            )}
                        </div>
                        <p className="whitespace-pre-wrap text-[clamp(16px,1.5vw,22px)] leading-relaxed text-card-foreground">
                            {round.pinned.textValue}
                        </p>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="space-y-2 text-center">
                <PhaseBadge phase={round.phase} />
                {/* projected typography: scales with viewport so the back of the room reads it */}
                <h2 className="text-gradient text-[clamp(26px,3.2vw,52px)] font-bold leading-snug">{round.prompt}</h2>
            </div>

            {!results && <p className="text-center text-muted-foreground">{STR.results.noAnswers}</p>}

            {results?.type === 'text' && <TextWall items={results.items} onPin={onPin} readonly={readonly} />}
            {results?.type === 'choice' && (
                <div className="space-y-6">
                    {round.phase === 'revealed' && <WinnerCard counts={results.counts} options={round.options} />}
                    <BarResults
                        counts={results.counts}
                        total={results.total}
                        revealed={round.phase === 'revealed'}
                        correctOptionId={round.phase === 'revealed' ? results.correctOptionId : undefined}
                    />
                </div>
            )}
            {results?.type === 'choice_revote' && (
                <RevoteResults
                    options={results.options}
                    totalOpen={results.totalOpen}
                    totalRevote={results.totalRevote}
                    movedCount={results.movedCount}
                    moves={results.moves}
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
