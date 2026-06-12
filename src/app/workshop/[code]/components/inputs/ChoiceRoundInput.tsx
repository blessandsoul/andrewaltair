'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { StudentRound } from '@/types/workshop.types'

interface ChoiceRoundInputProps {
    round: StudentRound
    onSubmit: (payload: { optionId: string }) => Promise<boolean>
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const

/** Strip a leading «A · » / «B ·» style prefix — the badge already carries the letter. */
function cleanLabel(label: string): string {
    return label.replace(/^[A-Za-z0-9]{1,3}\s*·\s*/, '')
}

export default function ChoiceRoundInput({ round, onSubmit }: ChoiceRoundInputProps) {
    const [busy, setBusy] = useState<string | null>(null)

    const pick = async (optionId: string) => {
        if (busy) return
        setBusy(optionId)
        await onSubmit({ optionId })
        setBusy(null)
    }

    return (
        <div className="space-y-3">
            {round.options.map((o, i) => (
                <motion.button
                    key={o.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => pick(o.id)}
                    disabled={busy !== null}
                    className={`w-full flex items-center gap-4 rounded-2xl bg-white border-2 px-4 py-4 text-left shadow-sm transition-all disabled:opacity-60 ${
                        busy === o.id
                            ? 'border-violet-500 ring-4 ring-violet-500/15'
                            : 'border-[#0E0F1F]/8 active:border-violet-400 hover:border-violet-300 hover:shadow-md'
                    }`}
                >
                    <span
                        className={`flex items-center justify-center w-11 h-11 rounded-xl text-lg font-bold shrink-0 transition-colors ${
                            busy === o.id
                                ? 'bg-linear-to-br from-violet-600 to-pink-600 text-white'
                                : 'bg-violet-50 text-violet-700 border border-violet-200'
                        }`}
                    >
                        {LETTERS[i] ?? '•'}
                    </span>
                    <span className="text-lg font-semibold leading-snug">
                        {busy === o.id ? 'იგზავნება...' : cleanLabel(o.label)}
                    </span>
                </motion.button>
            ))}
            {round.phase === 'revote' && (
                <p className="text-center text-[#6E7186] text-sm pt-1">
                    მეორე რაუნდი — შეგიძლიათ იგივე ან ახალი პასუხი
                </p>
            )}
        </div>
    )
}
