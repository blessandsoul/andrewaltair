'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { StudentRound } from '@/types/workshop.types'
import { STR } from '@/data/workshop-strings'

/**
 * F4 — Mazur discuss phase: pick a ready-made reason (chip) for WHY you voted,
 * or write your own. Stored in-tool (not the Meet chat) so we can compare
 * who changed their mind after re-vote.
 */
export default function ReasonInput({
    round,
    onSubmit,
}: {
    round: StudentRound
    onSubmit: (p: { textValue: string }) => Promise<boolean>
}) {
    const reasons = round.reasons ?? []
    const [busy, setBusy] = useState(false)
    const [custom, setCustom] = useState('')

    const send = async (text: string) => {
        if (busy || !text.trim()) return
        setBusy(true)
        try {
            await onSubmit({ textValue: text.trim() })
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="space-y-4">
            <p className="text-center text-[15px] font-semibold text-card-foreground">{STR.round.discussTitle}</p>
            <p className="text-center text-sm text-muted-foreground">{STR.round.discussBody}</p>

            <div className="space-y-2.5">
                {reasons.map((r) => (
                    <motion.button
                        key={r.id}
                        whileTap={{ scale: 0.98 }}
                        disabled={busy}
                        onClick={() => send(r.label)}
                        className="hover-lift w-full text-left rounded-2xl border border-border bg-card px-4 py-3.5 text-[15px] font-medium text-card-foreground
                                   hover:border-primary/40 hover:bg-primary/5 active:bg-primary/10 disabled:opacity-40"
                    >
                        {r.label}
                    </motion.button>
                ))}
            </div>

            <div className="rounded-2xl border border-dashed border-border bg-card p-3 space-y-2">
                <Textarea
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder={STR.round.reasonOwnPlaceholder}
                    maxLength={500}
                    rows={2}
                    className="min-h-0 resize-none border-0 bg-transparent px-0 py-0 text-[15px] text-card-foreground shadow-none focus-visible:ring-0"
                />
                <Button
                    onClick={() => send(custom)}
                    disabled={busy || !custom.trim()}
                    variant="gradient"
                    className="h-auto w-full rounded-xl py-2.5 font-semibold"
                >
                    <Send size={16} /> {busy ? STR.inputs.sending : STR.inputs.send}
                </Button>
            </div>
        </div>
    )
}
