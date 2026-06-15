'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Disc3, ListOrdered, Trophy, X } from 'lucide-react'
import NameAvatar from '@/components/workshop/NameAvatar'
import { REACTION_BY_KIND } from '@/components/workshop/reactionIcons'
import type { Reaction, SpotlightPanel } from '@/types/workshop.types'
import { cn } from '@/lib/utils'
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

/** Wheel-of-names — a spin that settles on the picked participant(s). Opaque card, closable; re-fires on every spin. */
export function WheelOverlay({ name, onClose }: { name: string; onClose: () => void }) {
    const names = name.split('\n').map((s) => s.trim()).filter(Boolean)
    const multi = names.length > 1
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
                    aria-label="დახურვა"
                    className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
                >
                    <X size={22} />
                </button>
                <motion.div initial={{ rotate: 0 }} animate={{ rotate: 1440 }} transition={{ duration: 1.1, ease: 'easeOut' }}>
                    <Disc3 className="size-16 text-primary" />
                </motion.div>
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    {STR.display.wheelPicked}
                    {multi && <span className="ml-1.5 text-primary">· {names.length}</span>}
                </p>
                <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.9, type: 'spring', stiffness: 220, damping: 14 }}
                    className={cn(
                        'max-w-[72vw]',
                        multi ? 'grid grid-cols-2 gap-x-8 gap-y-3 md:grid-cols-3' : 'flex items-center gap-4',
                    )}
                >
                    {multi ? (
                        names.map((nm, i) => (
                            <div key={nm + i} className="flex items-center gap-3">
                                <NameAvatar name={nm} size={40} />
                                <span className="text-3xl font-extrabold text-foreground">{nm}</span>
                            </div>
                        ))
                    ) : (
                        <>
                            <NameAvatar name={names[0] ?? name} size={56} />
                            <span className="text-6xl font-extrabold text-foreground">{names[0] ?? name}</span>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

/** Winners / top-answers reveal — a ranked list the host pops onto the projector. Closable; re-fires per trigger. */
export function PanelOverlay({ panel, onClose }: { panel: SpotlightPanel; onClose: () => void }) {
    const isWinners = panel.kind === 'winners'
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-6 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.7, y: 24 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                onClick={(e) => e.stopPropagation()}
                className="relative flex max-h-[86vh] w-full max-w-2xl flex-col gap-4 rounded-3xl border-2 border-primary/40 bg-card px-10 py-9 shadow-2xl"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="დახურვა"
                    className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
                >
                    <X size={22} />
                </button>
                <div className="flex items-center justify-center gap-3">
                    {isWinners ? <Trophy className="size-8 text-warning" /> : <ListOrdered className="size-8 text-primary" />}
                    <p className="text-gradient text-3xl font-extrabold tracking-tight">
                        {isWinners ? STR.display.winnersTitle : STR.display.topAnswersTitle}
                    </p>
                </div>
                <div className="hide-scrollbar flex min-h-0 flex-col gap-2 overflow-y-auto">
                    {panel.rows.map((r, i) => (
                        <motion.div
                            key={r.name + i}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * i }}
                            className="flex items-center gap-3 rounded-2xl border border-border bg-card/70 px-4 py-2.5"
                        >
                            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[image:var(--ws-cta)] text-base font-extrabold text-primary-foreground">
                                {i + 1}
                            </span>
                            {isWinners && <NameAvatar name={r.name} size={36} />}
                            <span className="min-w-0 flex-1 truncate text-xl font-bold text-foreground">{r.name}</span>
                            {r.sub && (
                                <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-lg font-extrabold tabular-nums text-primary">
                                    {isWinners ? `✓ ${r.sub}` : r.sub}
                                </span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}
