'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { StudentRound } from '@/types/workshop.types'
import { STR } from '@/data/workshop-strings'

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
            <div className="flex items-baseline justify-center gap-2 whitespace-nowrap">
                <span className="text-5xl sm:text-6xl font-bold tabular-nums text-foreground">{value}</span>
                <span className="text-muted-foreground text-xl">{STR.inputs.seconds}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={1}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full h-3 accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-muted-foreground text-sm tabular-nums">
                <span>{min}</span>
                <span>{max}</span>
            </div>
            <Button
                onClick={send}
                disabled={busy}
                variant="gradient"
                className="glow-primary h-auto w-full rounded-2xl py-4 text-lg font-bold"
            >
                {busy ? STR.inputs.sending : STR.inputs.send}
            </Button>
        </div>
    )
}
