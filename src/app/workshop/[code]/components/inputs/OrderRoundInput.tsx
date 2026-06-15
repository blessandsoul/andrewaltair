'use client'

import { useState } from 'react'
import { Reorder } from 'framer-motion'
import { GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { StudentRound } from '@/types/workshop.types'
import { STR } from '@/data/workshop-strings'

const cleanLabel = (s: string) => s.replace(/^[A-Z0-9]\s*·\s*/, '').trim()

function shuffle<T>(input: T[]): T[] {
    const a = [...input]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const tmp = a[i]!
        a[i] = a[j]!
        a[j] = tmp
    }
    return a
}

/**
 * Drag-and-drop ordering — students physically reorder the option frames into the
 * right sequence (touch-friendly via framer-motion Reorder). Submits the ordered ids.
 */
export default function OrderRoundInput({
    round,
    onSubmit,
}: {
    round: StudentRound
    onSubmit: (p: { orderValue: string[] }) => Promise<boolean>
}) {
    const [items, setItems] = useState<string[]>(() => shuffle(round.options.map((o) => o.id)))
    const [busy, setBusy] = useState(false)
    const byId = new Map(round.options.map((o) => [o.id, o]))

    const send = async (): Promise<void> => {
        if (busy) return
        setBusy(true)
        await onSubmit({ orderValue: items })
        setBusy(false)
    }

    return (
        <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">{STR.inputs.orderHint}</p>
            <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
                {items.map((id, i) => {
                    const o = byId.get(id)
                    return (
                        <Reorder.Item
                            key={id}
                            value={id}
                            whileDrag={{ scale: 1.03 }}
                            className="flex cursor-grab touch-none items-center gap-3 rounded-2xl border border-border bg-card p-2.5 shadow-sm active:cursor-grabbing"
                        >
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[image:var(--ws-cta)] text-sm font-bold text-primary-foreground">
                                {i + 1}
                            </span>
                            {o?.src && (
                                <div className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl bg-foreground">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={o.src} alt="" className="absolute inset-0 size-full object-cover" />
                                </div>
                            )}
                            <span className="min-w-0 flex-1 text-sm font-medium text-card-foreground">
                                {cleanLabel(o?.label ?? '')}
                            </span>
                            <GripVertical size={20} className="shrink-0 text-muted-foreground" />
                        </Reorder.Item>
                    )
                })}
            </Reorder.Group>
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
