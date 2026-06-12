'use client'

import { useEffect, useState } from 'react'
import { Play, MessagesSquare, BarChart3, RotateCcw, SkipForward, Dices } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { StudentRound } from '@/types/workshop.types'

interface HostControlsProps {
    round: StudentRound | null
    inLobby: boolean
    busy: boolean
    isLastRound: boolean
    responsesCount: number
    participantCount: number
    onAction: (action: string) => void
}

interface ControlButton {
    action: string
    label: string
    icon: LucideIcon
    primary?: boolean
}

const GATE_RATIO = 0.6 // elicit-before-reveal: soft-block reveal until 60% answered

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
        return [{ action: 'openRound', label: 'პირველი რაუნდი', icon: Play, primary: true }]
    }
    const next: ControlButton[] = isLastRound
        ? []
        : [{ action: 'nextRound', label: 'შემდეგი რაუნდი', icon: SkipForward }]
    switch (round.phase) {
        case 'closed':
            return [{ action: 'openRound', label: 'რაუნდის გახსნა', icon: Play, primary: true }, ...next]
        case 'open':
            if (round.type === 'choice_revote') {
                return [
                    { action: 'advancePhase', label: 'დისკუსია', icon: MessagesSquare, primary: true },
                    { action: 'reveal', label: 'შედეგები', icon: BarChart3 },
                ]
            }
            return [{ action: 'reveal', label: 'შედეგები', icon: BarChart3, primary: true }, ...next]
        case 'discuss':
            return [{ action: 'advancePhase', label: 'ხელახალი ხმა', icon: RotateCcw, primary: true }]
        case 'revote':
            return [{ action: 'reveal', label: 'შედეგები (შედარება)', icon: BarChart3, primary: true }]
        case 'revealed':
            return next.length ? [{ ...next[0], primary: true }] : []
        default:
            return next
    }
}

export default function HostControls({
    round,
    inLobby,
    busy,
    isLastRound,
    responsesCount,
    participantCount,
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
        responsesCount < Math.ceil(participantCount * GATE_RATIO)

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
        <footer className="border-t border-white/10 bg-white/2">
            {gateConfirm && (
                <div className="px-8 pt-3 text-amber-400 text-sm font-semibold">
                    ჯერ მხოლოდ {responsesCount}/{participantCount}-მა უპასუხა — დააჭირეთ კიდევ ერთხელ, თუ მაინც გადახვალთ
                </div>
            )}
            <div className="flex items-center justify-between gap-3 px-8 py-4">
                <div className="flex gap-3 items-center">
                    {buttons.map((b) => {
                        const gated = gateActive && (b.action === 'reveal' || b.action === 'advancePhase')
                        const Icon = b.icon
                        return (
                            <button
                                key={b.action + b.label}
                                onClick={() => click(b)}
                                disabled={busy}
                                className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-colors disabled:opacity-40 ${
                                    b.primary
                                        ? gated
                                            ? 'bg-amber-600/80 hover:bg-amber-500 text-white'
                                            : 'bg-violet-600 hover:bg-violet-500 text-white'
                                        : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white/80'
                                }`}
                            >
                                <Icon size={18} />
                                {b.label}
                                {gated && b.primary && (
                                    <span className="ml-1 font-mono text-sm opacity-90">
                                        {responsesCount}/{participantCount}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                    {answering && (
                        <button
                            onClick={() => onAction('seedFake')}
                            disabled={busy}
                            title="Demo: фейковые ответы для репетиции"
                            className="rounded-xl px-4 py-3 text-white/30 hover:text-white/70 border border-white/5 hover:border-white/15 transition-colors disabled:opacity-40"
                        >
                            <Dices size={18} />
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <span className="hidden lg:block text-[11px] font-mono text-white/25">
                        Space=შემდეგი · R=შედეგები · →=რაუნდი · E=დასრულება
                    </span>
                    <button
                        onClick={() => onAction('endRoom')}
                        disabled={busy}
                        className="rounded-xl px-5 py-3 text-sm text-white/40 hover:text-red-400 border border-white/10 hover:border-red-500/40 transition-colors disabled:opacity-40"
                    >
                        დასრულება
                    </button>
                </div>
            </div>
        </footer>
    )
}
