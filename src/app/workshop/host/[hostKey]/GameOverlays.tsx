'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Disc3, X } from 'lucide-react'
import NameAvatar from '@/components/workshop/NameAvatar'
import { REACTION_BY_KIND } from '@/components/workshop/reactionIcons'
import type { Reaction } from '@/types/workshop.types'
import { STR } from '@/data/workshop-strings'

type Floater = { id: number; kind: string; name: string; x: number; dur: number; drift: number; delay: number }
const MAX_FLOATERS = 16

/** Floating reactions — lucide icons drift up the projector with the sender's name. Smooth under a storm:
 *  unique ids (no same-ms collisions), a staggered batch, a concurrency cap, and no per-node CSS filter. */
export function ReactionsOverlay({ reactions }: { reactions?: Reaction[] }) {
    const seen = useRef<Set<number>>(new Set())
    const [floaters, setFloaters] = useState<Floater[]>([])

    useEffect(() => {
        if (!reactions?.length) return
        const fresh = reactions.filter((r) => !seen.current.has(r.id))
        if (!fresh.length) return
        const add: Floater[] = fresh.map((r, i) => {
            seen.current.add(r.id)
            return {
                id: r.id,
                kind: r.kind,
                name: r.name,
                x: 6 + Math.random() * 84,
                dur: 3 + Math.random() * 1.2,
                drift: (Math.random() - 0.5) * 70,
                delay: Math.min(i * 0.09, 1.2), // spread a burst over ~1s so it flows, not freezes
            }
        })
        setFloaters((f) => [...f, ...add].slice(-MAX_FLOATERS))
        if (seen.current.size > 400) seen.current = new Set([...seen.current].slice(-200))
    }, [reactions])

    return (
        <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
            <AnimatePresence>
                {floaters.map((f) => {
                    const r = REACTION_BY_KIND[f.kind]
                    if (!r) return null
                    const { Icon, color } = r
                    return (
                        <motion.div
                            key={f.id}
                            initial={{ opacity: 0, y: 0, scale: 0.6 }}
                            animate={{ opacity: [0, 1, 1, 0], y: '-84vh', x: f.drift, scale: 1 }}
                            transition={{ duration: f.dur, delay: f.delay, ease: 'easeOut' }}
                            onAnimationComplete={() => setFloaters((arr) => arr.filter((x) => x.id !== f.id))}
                            style={{ left: `${f.x}%`, bottom: '8%' }}
                            className="absolute flex flex-col items-center gap-1"
                        >
                            <span className="grid size-14 place-items-center rounded-full bg-card/90 shadow-lg ring-1 ring-border">
                                <Icon size={30} style={{ color }} />
                            </span>
                            {f.name && (
                                <span className="rounded-full bg-foreground/80 px-2 py-0.5 text-xs font-semibold text-background">
                                    {f.name}
                                </span>
                            )}
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </div>
    )
}

/** Wheel-of-names — a spin that settles on the picked participant. Opaque card, closable; re-fires on every spin. */
export function WheelOverlay({ name, onClose }: { name: string; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.6, y: 24 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 16 }}
                onClick={(e) => e.stopPropagation()}
                className="relative flex flex-col items-center gap-5 rounded-3xl border-2 border-primary/40 bg-card px-16 py-12 shadow-2xl"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Закрыть"
                    className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
                >
                    <X size={22} />
                </button>
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
                    <span className="text-6xl font-extrabold text-foreground">{name}</span>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
