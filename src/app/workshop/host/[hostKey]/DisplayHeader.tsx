'use client'

import { motion } from 'framer-motion'
import { PenLine, Users, Volume2, VolumeX, Clapperboard } from 'lucide-react'
import type { HostState } from '@/types/workshop.types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import CountdownRing from '@/components/workshop/CountdownRing'
import ProgressDots from '@/components/workshop/ProgressDots'
import { springPop } from '@/components/workshop/motion'
import { STR } from '@/data/workshop-strings'

interface DisplayHeaderProps {
    state: HostState
    answering: boolean
    showRing: boolean
    soundOn: boolean
    onToggleSound: () => void
}

/** Projector top bar — round label, live answer counter, countdown, sound toggle. */
export function DisplayHeader({ state, answering, showRing, soundOn, onToggleSound }: DisplayHeaderProps) {
    return (
        <header className="glass flex items-center justify-between border-b border-border px-8 py-4">
            <div className="flex items-center gap-3">
                <span
                    className="inline-flex size-10 items-center justify-center rounded-xl bg-[image:var(--ws-cta)] text-primary-foreground shadow-sm"
                    title={state.title}
                >
                    <Clapperboard size={22} />
                </span>
                <span className="text-sm text-muted-foreground">
                    {state.currentRoundIndex >= 0
                        ? STR.display.roundOf(state.currentRoundIndex + 1, state.roundsTotal)
                        : STR.display.lobby}
                </span>
            </div>
            <div className="flex items-center gap-5">
                {state.currentRoundIndex >= 0 && state.status !== 'ended' && (
                    <ProgressDots current={state.currentRoundIndex} total={state.roundsTotal} />
                )}
                {answering && (
                    <span className="inline-flex items-center gap-2 text-lg tabular-nums">
                        <PenLine size={18} className="text-primary" />
                        <motion.b
                            key={state.responsesCount}
                            initial={{ scale: 1.45, color: 'var(--secondary)' }}
                            animate={{ scale: 1, color: 'var(--primary)' }}
                            transition={springPop}
                            className="inline-block"
                        >
                            {state.responsesCount}
                        </motion.b>
                        <span className="text-muted-foreground">/{state.participantCount}</span>
                    </span>
                )}
                {showRing && (
                    <CountdownRing
                        phaseStartedAt={state.round!.phaseStartedAt!}
                        durationSec={state.round!.durationSec!}
                        serverNow={state.serverNow}
                        size={48}
                    />
                )}
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Users size={18} /> {state.participantCount}
                </span>
                <Button
                    variant={soundOn ? 'gradient' : 'outline'}
                    size="icon"
                    onClick={onToggleSound}
                    title={soundOn ? STR.display.soundOff : STR.display.soundOn}
                    aria-label={soundOn ? STR.display.soundOff : STR.display.soundOn}
                    className={cn('rounded-full', !soundOn && 'text-muted-foreground')}
                >
                    {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </Button>
            </div>
        </header>
    )
}
