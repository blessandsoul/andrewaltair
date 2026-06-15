'use client'

import { motion } from 'framer-motion'

const EMOJIS = ['👏', '🔥', '😮', '❤️', '😂', '🎉']

/** Always-on emoji reactions — fire-and-forget to the projector's live overlay. */
export function ReactionBar({ code, clientId }: { code: string; clientId: string }) {
    const send = (emoji: string): void => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(12)
        fetch(`/api/workshop/rooms/${code}/react`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId, emoji }),
        }).catch(() => {})
    }
    return (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {EMOJIS.map((e) => (
                <motion.button
                    key={e}
                    type="button"
                    whileTap={{ scale: 1.45 }}
                    onClick={() => send(e)}
                    aria-label={e}
                    className="flex size-11 items-center justify-center rounded-full border border-border bg-card text-xl shadow-sm transition active:bg-accent"
                >
                    {e}
                </motion.button>
            ))}
        </div>
    )
}
