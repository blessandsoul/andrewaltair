'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PenLine, MessagesSquare, RotateCcw, Monitor, Hourglass, Check, Pencil, Flame, Target } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { RoundPhase, StudentRound, StudentState, RoundResults, MyGame } from '@/types/workshop.types'
import { Button } from '@/components/ui/button'
import CountdownRing from '@/components/workshop/CountdownRing'
import ProgressDots from '@/components/workshop/ProgressDots'
import { BadgeIcon } from '@/components/workshop/badgeIcons'
import { PHASE_THEME } from '@/components/workshop/phaseTheme'
import { popIn, springPop } from '@/components/workshop/motion'
import { ReactionBar } from './ReactionBar'
import { useRealtimePublish } from '@/app/workshop/_realtime/RealtimeProvider'
import { PredictionInput } from './inputs/PredictionInput'
import TextRoundInput from './inputs/TextRoundInput'
import ChoiceRoundInput from './inputs/ChoiceRoundInput'
import MultiChoiceInput from './inputs/MultiChoiceInput'
import NumberRoundInput from './inputs/NumberRoundInput'
import OrderRoundInput from './inputs/OrderRoundInput'
import ReasonInput from './inputs/ReasonInput'
import SubmittedState from './SubmittedState'
import StudentResults from './StudentResults'
import { STR } from '@/data/workshop-strings'
import { cn } from '@/lib/utils'

interface CurrentRoundProps {
    code: string
    clientId: string
    round: StudentRound
    myAnswer: StudentState['myAnswer']
    results: RoundResults | null
    serverNow: string
    gamified: boolean
    me: MyGame | null
    name?: string
    myPrediction?: string | null
}

// Neuro-cue: one colored banner = the ONE thing to do right now.
// Color comes from the shared PHASE_THEME token map; here we only own icon + label.
const PHASE_META: Record<RoundPhase, { icon: LucideIcon; label: string }> = {
    open: { icon: PenLine, label: STR.phaseBanner.open },
    revote: { icon: RotateCcw, label: STR.phaseBanner.revote },
    discuss: { icon: MessagesSquare, label: STR.phaseBanner.discuss },
    revealed: { icon: Monitor, label: STR.phaseBanner.revealed },
    closed: { icon: Hourglass, label: STR.phaseBanner.closed },
}

export default function CurrentRound({
    code,
    clientId,
    round,
    myAnswer,
    results,
    serverNow,
    gamified,
    me,
    name,
    myPrediction,
}: CurrentRoundProps) {
    const [editing, setEditing] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    // optimistic: show SubmittedState the instant POST succeeds, before the next poll confirms
    const [justSubmitted, setJustSubmitted] = useState<string | null>(null)
    const publish = useRealtimePublish()

    // new round/phase → clear optimistic + editing state, haptic «new round» tap
    useEffect(() => {
        setJustSubmitted(null)
        setEditing(false)
        if (round.phase === 'open' && typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([40, 30, 40])
        }
    }, [round.key, round.phase])

    const submit = async (payload: {
        optionId?: string
        optionIds?: string[]
        textValue?: string
        numberValue?: number
        orderValue?: string[]
        predictedOptionId?: string
    }) => {
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
                publish({ t: 'answered' })
                return true
            }
            if (res.status === 409) setSubmitError(STR.round.errClosed)
            else setSubmitError(STR.round.errSend)
            return false
        } catch {
            setSubmitError(STR.round.errNetwork)
            return false
        }
    }

    const showRing =
        (round.phase === 'open' || round.phase === 'revote') &&
        !!round.durationSec &&
        !!round.phaseStartedAt

    const banner = PHASE_META[round.phase]
    const BannerIcon = banner.icon

    const header = (
        <div className="space-y-4 mb-6">
            <ProgressDots current={round.index} total={round.total} />
            {gamified && me && (
                <div className="flex flex-wrap items-center justify-center gap-1 text-sm">
                    <span className="rounded-full bg-[image:var(--ws-cta)] px-2.5 py-1 font-bold text-primary-foreground">
                        #{me.rank}
                    </span>
                    <span className="rounded-full border border-border bg-card px-2.5 py-1 font-semibold tabular-nums text-foreground">
                        {me.points}
                    </span>
                    {me.streak >= 2 && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-warning/15 px-2 py-1 font-bold text-warning">
                            <Flame size={14} />
                            {me.streak}
                        </span>
                    )}
                    {me.badges.slice(0, 4).map((b) => (
                        <span key={b.id} title={b.label} className="inline-flex items-center leading-none">
                            <BadgeIcon id={b.id} size={18} />
                        </span>
                    ))}
                </div>
            )}
            <motion.div
                key={round.phase}
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={springPop}
                className={cn(
                    'flex items-center justify-center gap-2.5 rounded-2xl px-4 py-3 font-bold text-[15px] shadow-md',
                    PHASE_THEME[round.phase].banner,
                )}
            >
                <BannerIcon size={19} />
                {banner.label}
            </motion.div>
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold leading-snug text-foreground">{round.prompt}</h2>
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
        body = <p className="text-center text-muted-foreground">{STR.round.waitHost}</p>
    } else if (round.phase === 'discuss') {
        // F4: pick a ready-made reason (or write your own) — in the tool, not the chat.
        const reasonHit = justSubmitted === `${round.key}:${round.phase}`
        body = (myAnswer?.phase === 'discuss' || reasonHit) && !editing ? (
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-xl bg-success/10 border border-success/30 px-4 py-2.5">
                    <span className="inline-flex items-center gap-2 text-success font-semibold text-sm">
                        <Check size={17} strokeWidth={3} /> {STR.round.reasonSubmitted}
                    </span>
                    <Button
                        onClick={() => setEditing(true)}
                        variant="ghost"
                        size="sm"
                        className="h-auto px-2 py-1 text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                        <Pencil size={14} /> {STR.submitted.edit}
                    </Button>
                </div>
                {myAnswer?.textValue && (
                    <p className="rounded-xl bg-card border border-border px-4 py-3 text-[15px] text-card-foreground">{myAnswer.textValue}</p>
                )}
            </div>
        ) : (
            <>
                <ReasonInput round={round} onSubmit={submit} />
                {submitError && <p className="mt-4 text-center text-destructive">{submitError}</p>}
            </>
        )
    } else if (round.phase === 'revealed') {
        // host locked the round → everyone sees the final tally on their phone too.
        // 🎯 if this student placed a bet, show whether it hit the crowd-winner (+15).
        const betWon =
            gamified && myPrediction && results?.type === 'choice'
                ? results.counts.reduce<{ id: string; n: number }>(
                      (best, c) => (c.count > best.n ? { id: c.optionId, n: c.count } : best),
                      { id: '', n: -1 },
                  ).id === myPrediction
                : null
        body = (
            <div className="space-y-4">
                {betWon !== null && (
                    <div
                        className={cn(
                            'flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-bold',
                            betWon
                                ? 'border-success/40 bg-success/10 text-success'
                                : 'border-border bg-muted/40 text-muted-foreground',
                        )}
                    >
                        <Target size={16} />
                        {betWon ? STR.predict.win : STR.predict.miss}
                    </div>
                )}
                <StudentResults results={results} myOptionId={myAnswer?.optionId} myOptionIds={myAnswer?.optionIds} />
            </div>
        )
    } else {
        const optimisticHit = justSubmitted === `${round.key}:${round.phase}`
        if ((myAnswer || optimisticHit) && !editing) {
            // answered → slim confirmation + LIVE results (no need to wait for reveal).
            // When results are withheld (Mazur vote-1) fall back to the "wait" state.
            body = results ? (
                <motion.div
                    variants={popIn}
                    initial="initial"
                    animate="animate"
                    transition={springPop}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-success/10 border border-success/30 px-4 py-2.5">
                        <span className="inline-flex items-center gap-2 text-success font-semibold text-sm">
                            <Check size={17} strokeWidth={3} /> {STR.submitted.title}
                        </span>
                        <Button
                            onClick={() => setEditing(true)}
                            variant="ghost"
                            size="sm"
                            className="h-auto px-2 py-1 text-sm font-medium text-muted-foreground hover:text-primary"
                        >
                            <Pencil size={14} /> {STR.submitted.edit}
                        </Button>
                    </div>
                    <StudentResults results={results} myOptionId={myAnswer?.optionId} myOptionIds={myAnswer?.optionIds} />
                    {gamified && (round.type === 'choice' || round.type === 'quiz') && round.phase === 'open' && (
                        <PredictionInput round={round} onSubmit={submit} />
                    )}
                </motion.div>
            ) : (
                <SubmittedState onEdit={() => setEditing(true)} />
            )
        } else {
            body = (
                <>
                    {round.type === 'text' &&
                        (round.reasons?.length ? (
                            // text round carrying preset chips → pick a reason or write your own
                            <ReasonInput round={round} onSubmit={submit} />
                        ) : (
                            <TextRoundInput round={round} onSubmit={submit} />
                        ))}
                    {(round.type === 'choice' || round.type === 'choice_revote' || round.type === 'quiz') && (
                        <ChoiceRoundInput round={round} onSubmit={submit} />
                    )}
                    {round.type === 'multi' && <MultiChoiceInput round={round} onSubmit={submit} />}
                    {round.type === 'number' && <NumberRoundInput round={round} onSubmit={submit} />}
                    {round.type === 'order' && <OrderRoundInput round={round} onSubmit={submit} />}
                    {submitError && <p className="mt-4 text-center text-destructive">{submitError}</p>}
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
            {gamified && <ReactionBar code={code} clientId={clientId} name={name} />}
        </div>
    )
}
