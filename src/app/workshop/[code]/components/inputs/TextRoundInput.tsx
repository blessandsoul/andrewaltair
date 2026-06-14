'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { StudentRound } from '@/types/workshop.types'
import { STR } from '@/data/workshop-strings'

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
                        <label className="block text-sm text-muted-foreground mb-1.5">{label}</label>
                        <Input
                            type="text"
                            value={values[i]}
                            maxLength={200}
                            onChange={(e) => setAt(i, e.target.value)}
                            className="h-auto rounded-xl bg-card px-4 py-3 shadow-sm focus-visible:ring-ring/40"
                        />
                    </div>
                ))
            ) : (
                <Textarea
                    value={values[0]}
                    maxLength={2000}
                    rows={4}
                    autoFocus
                    placeholder={STR.inputs.textPlaceholder}
                    onChange={(e) => setAt(0, e.target.value)}
                    className="rounded-xl bg-card px-4 py-3 shadow-sm resize-none focus-visible:ring-ring/40"
                />
            )}
            <Button
                onClick={send}
                disabled={!canSend || busy}
                variant="gradient"
                className="glow-primary h-auto w-full rounded-2xl py-4 text-lg font-bold"
            >
                {busy ? STR.inputs.sending : STR.inputs.send}
            </Button>
        </div>
    )
}
