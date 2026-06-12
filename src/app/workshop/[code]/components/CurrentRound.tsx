'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PenLine, MessagesSquare, RotateCcw, Monitor, Hourglass } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { StudentRound, StudentState } from '@/types/workshop.types'
import CountdownRing from '@/components/workshop/CountdownRing'
import ProgressDots from '@/components/workshop/ProgressDots'
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

// Neuro-cue: one colored banner = the ONE thing to do right now
const PHASE_BANNERS: Record<string, { icon: LucideIcon; label: string; cls: string }> = {
    open: { icon: PenLine, label: 'ახლა თქვენი ჯერია — უპასუხეთ', cls: 'bg-violet-600 text-white shadow-lg shadow-violet-600/30' },
    revote: { icon: RotateCcw, label: 'ხელახლა მიეცით ხმა', cls: 'bg-pink-600 text-white shadow-lg shadow-pink-600/30' },
    discuss: { icon: MessagesSquare, label: 'განიხილეთ Meet-ის ჩატში', cls: 'bg-sky-600 text-white shadow-lg shadow-sky-600/30' },
    revealed: { icon: Monitor, label: 'შეხედეთ წამყვანის ეკრანს', cls: 'bg-white text-[#262738] border border-[#0E0F1F]/10 shadow-sm' },
    closed: { icon: Hourglass, label: 'მოემზადეთ...', cls: 'bg-white text-[#262738] border border-[#0E0F1F]/10 shadow-sm' },
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

    const banner = PHASE_BANNERS[round.phase]
    const BannerIcon = banner.icon

    const header = (
        <div className="space-y-4 mb-6">
            <ProgressDots current={round.index} total={round.total} />
            <motion.div
                key={round.phase}
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className={`flex items-center justify-center gap-2.5 rounded-2xl px-4 py-3 font-bold text-[15px] ${banner.cls}`}
            >
                <BannerIcon size={19} />
                {banner.label}
            </motion.div>
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold leading-snug">{round.prompt}</h2>
                {showRing && (
                    <div className="flex justify-center pt-1">
                        <CountdownRing
                            phaseStartedAt={round.phaseStartedAt!}
                            durationSec={round.durationSec!}
                            serverNow={serverNow}
                            size={52}
                        />
                    </div>
                )}
            </div>
        </div>
    )

    // body per phase — wrapped in AnimatePresence for smooth phase transitions
    let body: React.ReactNode
    if (round.phase === 'closed') {
        body = <p className="text-center text-[#6E7186]">დაელოდეთ წამყვანს...</p>
    } else if (round.phase === 'discuss') {
        body = (
            <div className="rounded-2xl bg-white border border-[#0E0F1F]/8 shadow-sm p-6 text-center space-y-3">
                <motion.div
                    animate={{ rotate: [0, -6, 6, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    className="inline-block"
                >
                    <MessagesSquare size={44} className="text-sky-600" />
                </motion.div>
                <p className="text-lg font-semibold">რატომ აირჩიეთ თქვენი პასუხი?</p>
                <p className="text-[#6E7186]">დაწერეთ არგუმენტი ჩატში და წაიკითხეთ სხვების მოსაზრებები — შემდეგ ხელახლა მისცემთ ხმას.</p>
            </div>
        )
    } else if (round.phase === 'revealed') {
        body = null
    } else {
        const optimisticHit = justSubmitted === `${round.key}:${round.phase}`
        if ((myAnswer || optimisticHit) && !editing) {
            body = <SubmittedState onEdit={() => setEditing(true)} />
        } else {
            body = (
                <>
                    {round.type === 'text' && <TextRoundInput round={round} onSubmit={submit} />}
                    {(round.type === 'choice' || round.type === 'choice_revote' || round.type === 'quiz') && (
                        <ChoiceRoundInput round={round} onSubmit={submit} />
                    )}
                    {round.type === 'number' && <NumberRoundInput round={round} onSubmit={submit} />}
                    {submitError && <p className="mt-4 text-center text-red-500">{submitError}</p>}
                </>
            )
        }
    }

    return (
        <div>
            {header}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${round.key}:${round.phase}:${editing}:${justSubmitted}`}
                    initial={{ opacity: 0, x: 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -28 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                >
                    {body}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
