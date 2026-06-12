'use client'

import { useEffect, useState } from 'react'
import { MessagesSquare, Monitor } from 'lucide-react'
import type { StudentRound, StudentState } from '@/types/workshop.types'
import CountdownRing from '@/components/workshop/CountdownRing'
import TextRoundInput from './inputs/TextRoundInput'
import ChoiceRoundInput from './inputs/ChoiceRoundInput'
import NumberRoundInput from './inputs/NumberRoundInput'
import SubmittedState from './SubmittedState'

interface CurrentRoundProps {
    code: string
    clientId: string
    round: StudentRound
    myAnswer: StudentState['myAnswer']
    serverNow: string
}

const PHASE_LABELS: Record<string, string> = {
    open: 'უპასუხეთ',
    discuss: 'დისკუსია',
    revote: 'ხელახალი ხმა',
    revealed: 'შედეგები',
    closed: 'მოემზადეთ',
}

export default function CurrentRound({ code, clientId, round, myAnswer, serverNow }: CurrentRoundProps) {
    const [editing, setEditing] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    // optimistic: show SubmittedState the instant POST succeeds, before the next poll confirms
    const [justSubmitted, setJustSubmitted] = useState<string | null>(null)

    // new round/phase → clear optimistic + editing state, haptic «new round» tap
    useEffect(() => {
        setJustSubmitted(null)
        setEditing(false)
        if (round.phase === 'open' && typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([40, 30, 40])
        }
    }, [round.key, round.phase])

    const submit = async (payload: { optionId?: string; textValue?: string; numberValue?: number }) => {
        setSubmitError(null)
        try {
            const res = await fetch(`/api/workshop/rooms/${code}/respond`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientId, roundKey: round.key, ...payload }),
            })
            if (res.ok) {
                setEditing(false)
                setJustSubmitted(`${round.key}:${round.phase}`)
                if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15)
                return true
            }
            if (res.status === 409) setSubmitError('რაუნდი დაიხურა')
            else setSubmitError('ვერ გაიგზავნა — სცადეთ თავიდან')
            return false
        } catch {
            setSubmitError('კავშირის შეცდომა')
            return false
        }
    }

    const showRing =
        (round.phase === 'open' || round.phase === 'revote') &&
        !!round.durationSec &&
        !!round.phaseStartedAt

    const header = (
        <div className="text-center space-y-2 mb-6">
            <p className="text-xs font-mono uppercase tracking-widest text-violet-400">
                რაუნდი {round.index + 1} / {round.total} · {PHASE_LABELS[round.phase]}
            </p>
            <h2 className="text-2xl font-bold leading-snug">{round.prompt}</h2>
            {showRing && (
                <div className="flex justify-center pt-2">
                    <CountdownRing
                        phaseStartedAt={round.phaseStartedAt!}
                        durationSec={round.durationSec!}
                        serverNow={serverNow}
                        size={52}
                    />
                </div>
            )}
        </div>
    )

    if (round.phase === 'closed') {
        return (
            <div>
                {header}
                <p className="text-center text-white/50">დაელოდეთ წამყვანს...</p>
            </div>
        )
    }

    if (round.phase === 'discuss') {
        return (
            <div>
                {header}
                <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6 text-center space-y-3">
                    <MessagesSquare size={44} className="text-violet-400 mx-auto" />
                    <p className="text-lg font-semibold">განიხილეთ!</p>
                    <p className="text-white/60">დაწერეთ Meet-ის ჩატში: რატომ აირჩიეთ თქვენი პასუხი? წაიკითხეთ სხვების არგუმენტები.</p>
                </div>
            </div>
        )
    }

    if (round.phase === 'revealed') {
        return (
            <div>
                {header}
                <p className="inline-flex items-center justify-center gap-2 w-full text-white/60">
                    <Monitor size={16} /> შედეგები წამყვანის ეკრანზეა
                </p>
            </div>
        )
    }

    // open / revote — show input (or submitted state; optimistic before poll confirms)
    const optimisticHit = justSubmitted === `${round.key}:${round.phase}`
    if ((myAnswer || optimisticHit) && !editing) {
        return (
            <div>
                {header}
                <SubmittedState onEdit={() => setEditing(true)} />
            </div>
        )
    }

    return (
        <div>
            {header}
            {round.type === 'text' && <TextRoundInput round={round} onSubmit={submit} />}
            {(round.type === 'choice' || round.type === 'choice_revote' || round.type === 'quiz') && (
                <ChoiceRoundInput round={round} onSubmit={submit} />
            )}
            {round.type === 'number' && <NumberRoundInput round={round} onSubmit={submit} />}
            {submitError && <p className="mt-4 text-center text-red-400">{submitError}</p>}
        </div>
    )
}
