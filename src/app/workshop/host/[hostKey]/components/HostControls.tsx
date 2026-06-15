'use client'

import { useEffect, useState } from 'react'
import { Play, MessagesSquare, BarChart3, RotateCcw, SkipForward, Dices, ChevronLeft, Disc3, Trophy, ListOrdered } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { StudentRound } from '@/types/workshop.types'
import { STR } from '@/data/workshop-strings'
import { cn } from '@/lib/utils'

interface HostControlsProps {
    round: StudentRound | null
    inLobby: boolean
    busy: boolean
    isLastRound: boolean
    canGoBack: boolean
    gamified: boolean
    responsesCount: number
    participantCount: number
    gateRatio?: number // elicit-before-reveal soft gate (per-room; default 0.6)
    onAction: (action: string, responseId?: string, targetClientId?: string, count?: number) => void
}

interface ControlButton {
    action: string
    label: string
    icon: LucideIcon
    primary?: boolean
}

export function primaryActionFor(round: StudentRound | null, inLobby: boolean, isLastRound: boolean): string | null {
    if (inLobby || !round) return 'openRound'
    switch (round.phase) {
        case 'closed':
            return 'openRound'
        case 'open':
            return round.type === 'choice_revote' ? 'advancePhase' : 'reveal'
        case 'discuss':
            return 'advancePhase'
        case 'revote':
            return 'reveal'
        case 'revealed':
            return isLastRound ? null : 'nextRound'
        default:
            return null
    }
}

function buttonsFor(round: StudentRound | null, inLobby: boolean, isLastRound: boolean): ControlButton[] {
    if (inLobby || !round) {
        return [{ action: 'openRound', label: STR.controls.firstRound, icon: Play, primary: true }]
    }
    const next: ControlButton[] = isLastRound
        ? []
        : [{ action: 'nextRound', label: STR.controls.nextRound, icon: SkipForward }]
    switch (round.phase) {
        case 'closed':
            return [{ action: 'openRound', label: STR.controls.openRound, icon: Play, primary: true }, ...next]
        case 'open':
            if (round.type === 'choice_revote') {
                return [
                    { action: 'advancePhase', label: STR.controls.discuss, icon: MessagesSquare, primary: true },
                    { action: 'reveal', label: STR.controls.reveal, icon: BarChart3 },
                ]
            }
            return [{ action: 'reveal', label: STR.controls.reveal, icon: BarChart3, primary: true }, ...next]
        case 'discuss':
            return [{ action: 'advancePhase', label: STR.controls.revote, icon: RotateCcw, primary: true }]
        case 'revote':
            return [{ action: 'reveal', label: STR.controls.revealCompare, icon: BarChart3, primary: true }]
        case 'revealed': {
            const primaryNext: ControlButton[] = next.length ? [{ ...next[0], primary: true }] : []
            // After reveal, let the host re-open voting (someone mis-answered). Not for teach slides.
            if (round.type === 'teach') return primaryNext
            return [...primaryNext, { action: 'reopenRound', label: STR.controls.reopen, icon: RotateCcw }]
        }
        default:
            return next
    }
}

export default function HostControls({
    round,
    inLobby,
    busy,
    isLastRound,
    canGoBack,
    gamified,
    responsesCount,
    participantCount,
    gateRatio = 0.6,
    onAction,
}: HostControlsProps) {
    const buttons = buttonsFor(round, inLobby, isLastRound)
    const [gateConfirm, setGateConfirm] = useState(false)

    // reset gate confirmation when phase changes
    useEffect(() => {
        setGateConfirm(false)
    }, [round?.key, round?.phase])

    // response-rate gate applies to reveal/discuss while answering is live
    const answering = round && (round.phase === 'open' || round.phase === 'revote')
    const gateActive =
        !!answering &&
        participantCount > 0 &&
        responsesCount < Math.ceil(participantCount * gateRatio)

    const click = (b: ControlButton) => {
        const isAdvanceOut = b.action === 'reveal' || b.action === 'advancePhase'
        if (gateActive && isAdvanceOut && !gateConfirm) {
            setGateConfirm(true)
            return
        }
        setGateConfirm(false)
        onAction(b.action)
    }

    return (
        <section className="px-5 py-3">
            {gateConfirm && (
                <div className="mb-2 rounded-xl bg-warning/15 border border-warning/40 px-4 py-2.5 text-warning text-sm font-semibold">
                    {STR.controls.gateWarn(responsesCount, participantCount)}
                </div>
            )}
            <div className="flex flex-wrap gap-2.5 items-center">
                {canGoBack && !inLobby && (
                    <Button
                        onClick={() => onAction('prevRound')}
                        disabled={busy}
                        variant="outline"
                        size="lg"
                        title={STR.controls.back}
                        className="h-auto px-3.5 py-3.5 text-muted-foreground hover:text-primary"
                    >
                        <ChevronLeft size={18} />
                    </Button>
                )}
                {buttons.map((b) => {
                    const gated = gateActive && (b.action === 'reveal' || b.action === 'advancePhase')
                    const Icon = b.icon
                    return (
                        <Button
                            key={b.action + b.label}
                            onClick={() => click(b)}
                            disabled={busy}
                            variant={b.primary ? 'gradient' : 'outline'}
                            size="lg"
                            className={cn(
                                'h-auto px-5 py-3.5 text-base font-semibold',
                                b.primary && gated && 'bg-none bg-warning text-primary-foreground shadow-md shadow-warning/25 hover:bg-warning/90'
                            )}
                        >
                            <Icon size={18} />
                            {b.label}
                            {gated && b.primary && (
                                <span className="ml-1 text-sm opacity-90 tabular-nums">
                                    {responsesCount}/{participantCount}
                                </span>
                            )}
                        </Button>
                    )
                })}
                {answering && (
                    <Button
                        onClick={() => onAction('seedFake')}
                        disabled={busy}
                        title={STR.controls.seedTitle}
                        variant="outline"
                        size="icon-lg"
                        className="h-auto px-3.5 py-3.5 text-muted-foreground/60 hover:text-muted-foreground"
                    >
                        <Dices size={18} />
                    </Button>
                )}
                {gamified && !inLobby && round && (round.type !== 'teach' || round.key === 't_close') && (
                    <div
                        className="flex items-center gap-0.5 rounded-xl border border-border px-1.5 py-1"
                        title={STR.controls.wheel}
                    >
                        <Disc3 size={18} className="mx-1 shrink-0 text-primary" />
                        {[1, 3, 5, 15].map((n) => (
                            <Button
                                key={n}
                                onClick={() => onAction('spinWheel', undefined, undefined, n)}
                                disabled={busy}
                                title={`${STR.controls.wheel} ×${n}`}
                                variant="ghost"
                                size="sm"
                                className="h-9 min-w-9 px-2 text-base font-bold tabular-nums text-primary hover:bg-primary/10"
                            >
                                {n}
                            </Button>
                        ))}
                    </div>
                )}
                {gamified && !inLobby && (
                    <div
                        className="flex items-center gap-0.5 rounded-xl border border-border px-1.5 py-1"
                        title={STR.controls.winners}
                    >
                        <Trophy size={18} className="mx-1 shrink-0 text-warning" />
                        {[1, 5].map((n) => (
                            <Button
                                key={n}
                                onClick={() => onAction('showWinners', undefined, undefined, n)}
                                disabled={busy}
                                title={`${STR.controls.winners} ×${n}`}
                                variant="ghost"
                                size="sm"
                                className="h-9 min-w-9 px-2 text-base font-bold tabular-nums text-warning hover:bg-warning/10"
                            >
                                {n}
                            </Button>
                        ))}
                    </div>
                )}
                {gamified && !inLobby && round && round.type !== 'teach' && (
                    <div
                        className="flex items-center gap-0.5 rounded-xl border border-border px-1.5 py-1"
                        title={STR.controls.topAnswers}
                    >
                        <ListOrdered size={18} className="mx-1 shrink-0 text-primary" />
                        {[3, 5, 10].map((n) => (
                            <Button
                                key={n}
                                onClick={() => onAction('showTopAnswers', undefined, undefined, n)}
                                disabled={busy}
                                title={`${STR.controls.topAnswers} ×${n}`}
                                variant="ghost"
                                size="sm"
                                className="h-9 min-w-9 px-2 text-base font-bold tabular-nums text-primary hover:bg-primary/10"
                            >
                                {n}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
            <p className="hidden lg:block mt-2 text-[11px] text-muted-foreground/60">
                {STR.controls.hotkeys}
            </p>
        </section>
    )
}
