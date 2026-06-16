'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Send } from 'lucide-react'
import type { StudentRound } from '@/types/workshop.types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { STR } from '@/data/workshop-strings'
import { cn } from '@/lib/utils'

interface MultiChoiceInputProps {
    round: StudentRound
    onSubmit: (payload: { optionIds: string[]; textValue?: string }) => Promise<boolean>
}

/** Strip a leading «A · » style prefix — the checkbox already carries the state. */
function cleanLabel(label: string): string {
    return label.replace(/^[A-Za-z0-9]{1,3}\s*·\s*/, '')
}

/** Checkbox round — tick several options (several may be correct), then confirm. */
export default function MultiChoiceInput({ round, onSubmit }: MultiChoiceInputProps) {
    const [picked, setPicked] = useState<Set<string>>(new Set())
    const [custom, setCustom] = useState('')
    const [busy, setBusy] = useState(false)

    const toggle = (id: string) => {
        if (busy) return
        setPicked((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const send = async () => {
        const write = custom.trim()
        if (busy || (picked.size === 0 && !write)) return
        setBusy(true)
        const ok = await onSubmit({ optionIds: [...picked], ...(write ? { textValue: write } : {}) })
        if (ok) setCustom('')
        setBusy(false)
    }

    return (
        <div className="space-y-3">
            <p className="text-center text-sm font-medium text-muted-foreground">{STR.inputs.multiHint}</p>
            {round.options.map((o) => {
                const on = picked.has(o.id)
                return (
                    <motion.button
                        key={o.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggle(o.id)}
                        disabled={busy}
                        className={cn(
                            'hover-lift flex w-full items-center gap-3.5 rounded-2xl border-2 bg-card px-4 py-3.5 text-left shadow-sm disabled:opacity-60',
                            on ? 'border-primary bg-primary/5 ring-2 ring-primary/30' : 'border-border hover:border-primary/40',
                        )}
                    >
                        <span
                            className={cn(
                                'grid size-7 shrink-0 place-items-center rounded-lg border-2 transition-colors',
                                on ? 'border-primary bg-[image:var(--ws-cta)] text-primary-foreground' : 'border-border bg-background',
                            )}
                        >
                            {on && <Check size={16} strokeWidth={3} />}
                        </span>
                        <span className="text-lg font-semibold leading-snug text-foreground">{cleanLabel(o.label)}</span>
                    </motion.button>
                )
            })}
            <div className="rounded-2xl border border-dashed border-border bg-card p-3">
                <p className="mb-1.5 text-xs font-semibold text-muted-foreground">{STR.inputs.orWriteOwn}</p>
                <Textarea
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder={STR.inputs.ownPlaceholder}
                    maxLength={500}
                    rows={2}
                    disabled={busy}
                    className="min-h-0 resize-none border-0 bg-transparent px-0 py-0 text-[15px] text-card-foreground shadow-none focus-visible:ring-0"
                />
            </div>
            <Button
                onClick={send}
                disabled={busy || (picked.size === 0 && !custom.trim())}
                variant="gradient"
                size="lg"
                className="h-auto w-full py-3.5 text-base font-bold disabled:opacity-50"
            >
                {busy ? (
                    STR.inputs.sending
                ) : (
                    <>
                        <Send size={16} /> {STR.inputs.send}
                        {picked.size > 0 ? ` · ${picked.size}` : ''}
                    </>
                )}
            </Button>
        </div>
    )
}
