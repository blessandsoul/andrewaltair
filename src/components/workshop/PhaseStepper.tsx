'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { PHASE_THEME } from '@/components/workshop/phaseTheme'
import type { RoundPhase, RoundType } from '@/types/workshop.types'
import { STR } from '@/data/workshop-strings'
import { cn } from '@/lib/utils'

interface PhaseStepperProps {
    type: RoundType
    phase: RoundPhase
}

const REVOTE_STEPS = [
    { key: 'open', label: STR.stepper.vote1 },
    { key: 'discuss', label: STR.stepper.discuss },
    { key: 'revote', label: STR.stepper.vote2 },
    { key: 'revealed', label: STR.stepper.result },
] as const

const SIMPLE_STEPS = [
    { key: 'open', label: STR.stepper.answers },
    { key: 'revealed', label: STR.stepper.result },
] as const

/** Host neuro-cue: where the round is in its lifecycle (Mazur cycle made visible). */
export default function PhaseStepper({ type, phase }: PhaseStepperProps) {
    if (type === 'teach') return null // teach slides have no answer/reveal lifecycle
    const steps = type === 'choice_revote' ? REVOTE_STEPS : SIMPLE_STEPS
    const currentIdx = Math.max(0, steps.findIndex((s) => s.key === phase))
    if (phase === 'closed') return null

    return (
        <div className="flex items-center gap-1">
            {steps.map((s, i) => {
                const done = i < currentIdx
                const active = i === currentIdx
                return (
                    <div key={s.key} className="flex items-center gap-1">
                        {i > 0 && (
                            <div
                                className={cn(
                                    'w-5 h-0.5 rounded-full transition-colors duration-500',
                                    i <= currentIdx ? 'bg-primary/40' : 'bg-border'
                                )}
                            />
                        )}
                        <motion.span
                            animate={active ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                            transition={active ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : {}}
                            className={cn(
                                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-300',
                                active
                                    ? PHASE_THEME[phase].banner
                                    : done
                                    ? PHASE_THEME[phase].badge
                                    : 'bg-muted text-muted-foreground'
                            )}
                        >
                            {done && <Check size={11} strokeWidth={3} />}
                            {s.label}
                        </motion.span>
                    </div>
                )
            })}
        </div>
    )
}
