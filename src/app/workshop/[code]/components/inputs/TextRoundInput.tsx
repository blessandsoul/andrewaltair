'use client'

import { useState } from 'react'
import type { StudentRound } from '@/types/workshop.types'

interface TextRoundInputProps {
    round: StudentRound
    onSubmit: (payload: { textValue: string }) => Promise<boolean>
}

export default function TextRoundInput({ round, onSubmit }: TextRoundInputProps) {
    const fields = round.config.fields ?? []
    const isMulti = fields.length > 1
    const [values, setValues] = useState<string[]>(() => new Array(Math.max(fields.length, 1)).fill(''))
    const [busy, setBusy] = useState(false)

    const setAt = (i: number, v: string) => {
        setValues((prev) => prev.map((x, n) => (n === i ? v : x)))
    }

    const canSend = values.some((v) => v.trim())

    const send = async () => {
        if (!canSend || busy) return
        setBusy(true)
        const textValue = isMulti
            ? fields.map((f, i) => `${f}: ${values[i].trim()}`).filter((_, i) => values[i].trim()).join('\n')
            : values[0].trim()
        await onSubmit({ textValue })
        setBusy(false)
    }

    return (
        <div className="space-y-4">
            {isMulti ? (
                fields.map((label, i) => (
                    <div key={label}>
                        <label className="block text-sm text-[#6E7186] mb-1.5">{label}</label>
                        <input
                            type="text"
                            value={values[i]}
                            maxLength={200}
                            onChange={(e) => setAt(i, e.target.value)}
                            className="w-full rounded-xl bg-white border border-[#0E0F1F]/10 shadow-sm px-4 py-3 text-base outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                        />
                    </div>
                ))
            ) : (
                <textarea
                    value={values[0]}
                    maxLength={2000}
                    rows={4}
                    autoFocus
                    placeholder="თქვენი პასუხი..."
                    onChange={(e) => setAt(0, e.target.value)}
                    className="w-full rounded-xl bg-white border border-[#0E0F1F]/10 shadow-sm px-4 py-3 text-base outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none"
                />
            )}
            <button
                onClick={send}
                disabled={!canSend || busy}
                className="w-full rounded-2xl bg-violet-600 active:bg-violet-700 disabled:opacity-40 py-4 text-lg font-bold text-white shadow-lg shadow-violet-600/25 transition-colors"
            >
                {busy ? 'იგზავნება...' : 'გაგზავნა'}
            </button>
        </div>
    )
}
