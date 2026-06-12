'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { RoundPhase, RoundType } from '@/types/workshop.types'

interface PhaseStepperProps {
    type: RoundType
    phase: RoundPhase
}

const REVOTE_STEPS = [
    { key: 'open', label: 'ხმა 1' },
    { key: 'discuss', label: 'დისკუსია' },
    { key: 'revote', label: 'ხმა 2' },
    { key: 'revealed', label: 'შედეგი' },
] as const

const SIMPLE_STEPS = [
    { key: 'open', label: 'პასუხები' },
    { key: 'revealed', label: 'შედეგი' },
] as const

/** Host neuro-cue: where the round is in its lifecycle (Mazur cycle made visible). */
export default function PhaseStepper({ type, phase }: PhaseStepperProps) {
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
                                className={`w-5 h-0.5 rounded-full transition-colors duration-500 ${
                                    i <= currentIdx ? 'bg-violet-400' : 'bg-[#0E0F1F]/10'
                                }`}
                            />
                        )}
                        <motion.span
                            animate={active ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                            transition={active ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : {}}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-300 ${
                                active
                                    ? 'bg-violet-600 text-white'
                                    : done
                                    ? 'bg-violet-100 text-violet-700'
                                    : 'bg-[#0E0F1F]/5 text-[#6E7186]'
                            }`}
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
