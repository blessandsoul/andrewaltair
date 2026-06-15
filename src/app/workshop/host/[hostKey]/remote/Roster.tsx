'use client'

import { motion } from 'framer-motion'
import { Users, OctagonX } from 'lucide-react'
import NameAvatar from '@/components/workshop/NameAvatar'
import { staggerParent, staggerChild } from '@/components/workshop/motion'
import type { HostState } from '@/types/workshop.types'
import { cn } from '@/lib/utils'

interface RosterProps {
    roster: HostState['roster']
    busy: boolean
    onKick: (clientId: string) => void
}

/** Private host roster with per-participant kick (gated by allowKick upstream). */
export function Roster({ roster, busy, onKick }: RosterProps) {
    return (
        <div className="px-5 pb-3">
            <p className="mb-2 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                <Users size={12} /> {roster.length}
            </p>
            <motion.div
                variants={staggerParent}
                initial="initial"
                animate="animate"
                className="flex flex-wrap gap-1.5"
            >
                {roster.map((p) => (
                    <motion.span
                        key={p.clientId}
                        variants={staggerChild}
                        className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border shadow-sm pl-1 pr-1 py-1 text-sm"
                    >
                        <NameAvatar name={p.name} size={20} />
                        <span className={p.online ? '' : 'opacity-40'}>{p.name}</span>
                        <button
                            onClick={() => onKick(p.clientId)}
                            disabled={busy}
                            title={`Удалить ${p.name}`}
                            aria-label={`Удалить ${p.name}`}
                            className={cn(
                                'ml-0.5 inline-flex items-center justify-center rounded-full p-0.5 text-muted-foreground/40 transition-colors',
                                'hover:text-destructive disabled:opacity-40'
                            )}
                        >
                            <OctagonX size={14} />
                        </button>
                    </motion.span>
                ))}
            </motion.div>
        </div>
    )
}
