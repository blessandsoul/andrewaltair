'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { REACTIONS } from '@/components/workshop/reactionIcons'
import { useRealtimePublish } from '@/app/workshop/_realtime/RealtimeProvider'

type Floater = { id: number; Icon: LucideIcon; color: string; dx: number }

/** Always-on reactions: lucide icons, fire to the projector overlay plus an instant local burst. */
export function ReactionBar({ code, clientId, name }: { code: string; clientId: string; name?: string }) {
    const reduceMotion = useReducedMotion()
    const publish = useRealtimePublish()
    const [floaters, setFloaters] = useState<Floater[]>([])

    const send = (kind: string, Icon: LucideIcon, color: string): void => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(12)
        const id = Math.floor(Math.random() * 2_000_000_000)
        // Instant local echo so the sender sees their tap land before the network round-trip.
        if (!reduceMotion) {
            const dx = Math.round((Math.random() - 0.5) * 44)
            setFloaters((f) => [...f, { id, Icon, color, dx }])
            window.setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== id)), 900)
        }
        // Instant fan-out over the data channel, carrying the SAME id as the HTTP write
        // so the projector shows each reaction once (data copy first, poll copy deduped).
        publish({ t: 'reaction', kind, id, name })
        fetch(`/api/workshop/rooms/${code}/react`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId, kind, name, id }),
        }).catch(() => {})
    }

    return (
        <div className="relative mt-6 flex flex-wrap items-center justify-center gap-2">
            <div className="pointer-events-none absolute inset-x-0 -top-2 flex justify-center">
                <AnimatePresence>
                    {floaters.map(({ id, Icon, color, dx }) => (
                        <motion.span
                            key={id}
                            initial={{ opacity: 0, y: 0, scale: 0.6 }}
                            animate={{ opacity: 1, y: -62, scale: 1.2, x: dx }}
                            exit={{ opacity: 0, y: -92, scale: 0.9 }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                            className="absolute"
                        >
                            <Icon size={26} style={{ color }} />
                        </motion.span>
                    ))}
                </AnimatePresence>
            </div>
            {REACTIONS.map(({ kind, Icon, color }) => (
                <motion.button
                    key={kind}
                    type="button"
                    whileTap={{ scale: 1.45 }}
                    onClick={() => send(kind, Icon, color)}
                    aria-label={kind}
                    className="flex size-11 items-center justify-center rounded-full border border-border bg-card shadow-sm transition active:bg-accent"
                >
                    <Icon size={22} style={{ color }} />
                </motion.button>
            ))}
        </div>
    )
}
