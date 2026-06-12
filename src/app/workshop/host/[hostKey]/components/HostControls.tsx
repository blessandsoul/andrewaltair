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
        <section className="px-5 py-3">
            {gateConfirm && (
                <div className="mb-2 rounded-xl bg-amber-50 border border-amber-300 px-4 py-2.5 text-amber-700 text-sm font-semibold">
                    ჯერ მხოლოდ {responsesCount}/{participantCount}-მა უპასუხა — დააჭირეთ კიდევ ერთხელ, თუ მაინც გადახვალთ
                </div>
            )}
            <div className="flex flex-wrap gap-2.5 items-center">
                {buttons.map((b) => {
                    const gated = gateActive && (b.action === 'reveal' || b.action === 'advancePhase')
                    const Icon = b.icon
                    return (
                        <button
                            key={b.action + b.label}
                            onClick={() => click(b)}
                            disabled={busy}
                            className={`inline-flex items-center gap-2 rounded-xl px-5 py-3.5 font-semibold transition-colors disabled:opacity-40 ${
                                b.primary
                                    ? gated
                                        ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-md shadow-amber-500/25'
                                        : 'bg-linear-to-r from-violet-600 to-pink-600 hover:opacity-90 text-white shadow-md shadow-violet-600/30'
                                    : 'bg-white border border-[#0E0F1F]/10 hover:bg-[#0E0F1F]/3 text-[#262738] shadow-sm'
                            }`}
                        >
                            <Icon size={18} />
                            {b.label}
                            {gated && b.primary && (
                                <span className="ml-1 text-sm opacity-90 tabular-nums">
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
                        className="rounded-xl px-3.5 py-3.5 text-[#6E7186]/50 hover:text-[#6E7186] border border-[#0E0F1F]/8 hover:border-[#0E0F1F]/15 bg-white transition-colors disabled:opacity-40"
                    >
                        <Dices size={18} />
                    </button>
                )}
            </div>
            <p className="hidden lg:block mt-2 text-[11px] text-[#6E7186]/60">
                Space=შემდეგი · R=შედეგები · →=რაუნდი · E=დასრულება
            </p>
        </section>
    )
}
