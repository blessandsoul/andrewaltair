'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Disc3 } from 'lucide-react'
import NameAvatar from '@/components/workshop/NameAvatar'
import type { Reaction } from '@/types/workshop.types'
import { STR } from '@/data/workshop-strings'

type Floater = { id: number; emoji: string; x: number; dur: number; drift: number }
let _id = 0

/** Floating emoji-reactions overlay — each new reaction drifts up the projector and fades. */
export function ReactionsOverlay({ reactions }: { reactions?: Reaction[] }) {
    const seen = useRef<Set<number>>(new Set())
    const [floaters, setFloaters] = useState<Floater[]>([])

    useEffect(() => {
        if (!reactions?.length) return
        const fresh = reactions.filter((r) => !seen.current.has(r.at))
        if (!fresh.length) return
        const add = fresh.map((r) => {
            seen.current.add(r.at)
            return {
                id: ++_id,
                emoji: r.emoji,
                x: 4 + Math.random() * 90,
                dur: 2.6 + Math.random() * 1.4,
                drift: (Math.random() - 0.5) * 80,
            }
        })
        setFloaters((f) => [...f, ...add])
        if (seen.current.size > 400) seen.current = new Set([...seen.current].slice(-200))
    }, [reactions])

    return (
        <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
            <AnimatePresence>
                {floaters.map((f) => (
                    <motion.div
                        key={f.id}
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 1, 1, 0], y: '-86vh', x: f.drift, scale: 1.1 }}
                        transition={{ duration: f.dur, ease: 'easeOut' }}
                        onAnimationComplete={() => setFloaters((arr) => arr.filter((x) => x.id !== f.id))}
                        style={{ left: `${f.x}%`, bottom: '7%' }}
                        className="absolute text-5xl drop-shadow"
                    >
                        {f.emoji}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}

/** Wheel-of-names — a spin that settles on the picked participant. Shown while spotlightName is set. */
export function WheelOverlay({ name }: { name: string }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.6, y: 24 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 16 }}
                className="glass-strong flex flex-col items-center gap-5 rounded-3xl border border-border bg-card px-16 py-10 shadow-2xl"
            >
                <motion.div initial={{ rotate: 0 }} animate={{ rotate: 1440 }} transition={{ duration: 1.1, ease: 'easeOut' }}>
                    <Disc3 className="size-16 text-primary" />
                </motion.div>
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{STR.display.wheelPicked}</p>
                <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.9, type: 'spring', stiffness: 220, damping: 14 }}
                    className="flex items-center gap-4"
                >
                    <NameAvatar name={name} size={56} />
                    <span className="text-gradient text-6xl font-extrabold">{name}</span>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
