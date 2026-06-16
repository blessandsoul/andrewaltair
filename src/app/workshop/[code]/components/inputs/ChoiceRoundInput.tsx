'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { PlatformIcon, isPlatform } from '@/components/workshop/PlatformIcon'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { StudentRound } from '@/types/workshop.types'
import { STR } from '@/data/workshop-strings'
import { cn } from '@/lib/utils'

interface ChoiceRoundInputProps {
    round: StudentRound
    onSubmit: (payload: { optionId?: string; textValue?: string }) => Promise<boolean>
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const

/** Strip a leading «A · » / «B ·» style prefix — the badge already carries the letter. */
function cleanLabel(label: string): string {
    return label.replace(/^[A-Za-z0-9]{1,3}\s*·\s*/, '')
}

export default function ChoiceRoundInput({ round, onSubmit }: ChoiceRoundInputProps) {
    const [busy, setBusy] = useState<string | null>(null)
    const [custom, setCustom] = useState('')
    // opinion single-select rounds let students add their own answer (quiz/revote stay strict)
    const allowWrite = round.type === 'choice'

    const pick = async (optionId: string) => {
        if (busy) return
        setBusy(optionId)
        await onSubmit({ optionId })
        setBusy(null)
    }

    const sendCustom = async () => {
        const write = custom.trim()
        if (busy || !write) return
        setBusy('__custom__')
        const ok = await onSubmit({ textValue: write })
        if (ok) setCustom('')
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
                    className={cn(
                        'hover-lift w-full flex items-center gap-4 rounded-2xl bg-card border-2 px-4 py-4 text-left shadow-sm disabled:opacity-60',
                        busy === o.id
                            ? 'border-primary ring-2 ring-primary/40 bg-primary/5'
                            : 'border-border hover:border-primary/40 hover:shadow-md',
                    )}
                >
                    <span
                        className={cn(
                            'flex items-center justify-center w-11 h-11 rounded-xl text-lg font-bold shrink-0 transition-colors',
                            busy === o.id
                                ? 'bg-[image:var(--ws-cta)] text-primary-foreground'
                                : 'bg-primary/10 text-primary border border-primary/30',
                        )}
                    >
                        {isPlatform(o.label) ? <PlatformIcon label={o.label} size={24} /> : (LETTERS[i] ?? '•')}
                    </span>
                    <span className="text-lg font-semibold leading-snug text-foreground">
                        {busy === o.id ? STR.inputs.sending : cleanLabel(o.label)}
                    </span>
                </motion.button>
            ))}
            {allowWrite && (
                <div className="rounded-2xl border border-dashed border-border bg-card p-3">
                    <p className="mb-1.5 text-xs font-semibold text-muted-foreground">{STR.inputs.orWriteOwn}</p>
                    <div className="flex items-end gap-2">
                        <Textarea
                            value={custom}
                            onChange={(e) => setCustom(e.target.value)}
                            placeholder={STR.inputs.ownPlaceholder}
                            maxLength={500}
                            rows={2}
                            disabled={busy !== null}
                            className="min-h-0 flex-1 resize-none border-0 bg-transparent px-0 py-0 text-[15px] text-card-foreground shadow-none focus-visible:ring-0"
                        />
                        <Button
                            onClick={sendCustom}
                            disabled={busy !== null || !custom.trim()}
                            variant="gradient"
                            size="icon"
                            className="shrink-0 rounded-xl"
                            aria-label={STR.inputs.send}
                        >
                            <Send size={16} />
                        </Button>
                    </div>
                </div>
            )}
            {round.phase === 'revote' && (
                <p className="text-center text-muted-foreground text-sm pt-1">
                    {STR.inputs.revoteHint}
                </p>
            )}
        </div>
    )
}
