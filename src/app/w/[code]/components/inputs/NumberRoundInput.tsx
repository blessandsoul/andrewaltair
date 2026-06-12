'use client'

import { useState } from 'react'
import type { StudentRound } from '@/types/workshop.types'

interface NumberRoundInputProps {
    round: StudentRound
    onSubmit: (payload: { numberValue: number }) => Promise<boolean>
}

export default function NumberRoundInput({ round, onSubmit }: NumberRoundInputProps) {
    const min = round.config.minNumber ?? 0
    const max = round.config.maxNumber ?? 100
    const [value, setValue] = useState<number>(Math.round((min + max) / 2))
    const [busy, setBusy] = useState(false)

    const send = async () => {
        if (busy) return
        setBusy(true)
        await onSubmit({ numberValue: value })
        setBusy(false)
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <span className="text-6xl font-bold tabular-nums">{value}</span>
                <span className="text-white/50 text-xl ml-2">წამი</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={1}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full h-3 accent-violet-500 cursor-pointer"
            />
            <div className="flex justify-between text-white/40 text-sm font-mono">
                <span>{min}</span>
                <span>{max}</span>
            </div>
            <button
                onClick={send}
                disabled={busy}
                className="w-full rounded-2xl bg-violet-600 active:bg-violet-700 disabled:opacity-40 py-4 text-lg font-bold transition-colors"
            >
                {busy ? 'იგზავნება...' : 'გაგზავნა'}
            </button>
        </div>
    )
}
