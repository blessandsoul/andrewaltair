'use client'

import { motion } from 'framer-motion'
import { REACTIONS } from '@/components/workshop/reactionIcons'

/** Always-on reactions — lucide icons (not emoji), fire-and-forget to the projector's live overlay. */
export function ReactionBar({ code, clientId, name }: { code: string; clientId: string; name?: string }) {
    const send = (kind: string): void => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(12)
        fetch(`/api/workshop/rooms/${code}/react`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId, kind, name }),
        }).catch(() => {})
    }
    return (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {REACTIONS.map(({ kind, Icon, color }) => (
                <motion.button
                    key={kind}
                    type="button"
                    whileTap={{ scale: 1.45 }}
                    onClick={() => send(kind)}
                    aria-label={kind}
                    className="flex size-11 items-center justify-center rounded-full border border-border bg-card shadow-sm transition active:bg-accent"
                >
                    <Icon size={22} style={{ color }} />
                </motion.button>
            ))}
        </div>
    )
}
