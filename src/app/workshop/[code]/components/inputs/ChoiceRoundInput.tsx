'use client'

import { useState } from 'react'
import type { StudentRound } from '@/types/workshop.types'

interface ChoiceRoundInputProps {
    round: StudentRound
    onSubmit: (payload: { optionId: string }) => Promise<boolean>
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
            {round.options.map((o) => (
                <button
                    key={o.id}
                    onClick={() => pick(o.id)}
                    disabled={busy !== null}
                    className="w-full rounded-2xl bg-white border-2 border-[#0E0F1F]/10 shadow-sm px-5 py-5 text-lg font-semibold text-left active:border-violet-500 active:bg-violet-50 disabled:opacity-50 transition-colors"
                >
                    {busy === o.id ? 'იგზავნება...' : o.label}
                </button>
            ))}
            {round.phase === 'revote' && (
                <p className="text-center text-[#6E7186] text-sm pt-1">
                    მეორე რაუნდი — შეგიძლიათ იგივე ან ახალი პასუხი
                </p>
            )}
        </div>
    )
}
