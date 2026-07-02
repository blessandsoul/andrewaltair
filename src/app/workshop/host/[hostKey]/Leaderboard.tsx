'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { springSoft } from '@/components/workshop/motion'
import NameAvatar, { nameAccent } from '@/components/workshop/NameAvatar'
import { BadgeIcon, MedalIcon } from '@/components/workshop/badgeIcons'
import type { LeaderboardEntry, TeamScore } from '@/types/workshop.types'
import { cn } from '@/lib/utils'
import { STR } from '@/data/workshop-strings'

const TEAM_TONE =['bg-primary/15 text-primary', 'bg-secondary/15 text-secondary', 'bg-success/15 text-success', 'bg-warning/15 text-warning', 'bg-info/15 text-info', 'bg-destructive/15 text-destructive']

const ROW_PX = 44 // one entry row incl. its gap — used to compute how many fit the rail
const ROTATE_MS = 5000

/** Projector right rail — team scoreboard (if any) + individuals. Fills the rail to its height;
 *  paginates (auto-cycling) ONLY when more people than fit; if all fit, no pager, no empty gap. */
export function Leaderboard({ entries, teams }: { entries: LeaderboardEntry[]; teams?: TeamScore[] }) {
    const reduceMotion = useReducedMotion()
    const listRef = useRef<HTMLDivElement>(null)
    const [perPage, setPerPage] = useState(8)
    const [page, setPage] = useState(0)

    // measure how many rows fit the rail's list region
    useEffect(() => {
        const el = listRef.current
        if (!el) return
        const measure = () => setPerPage(Math.max(1, Math.floor(el.clientHeight / ROW_PX)))
        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const pageCount = Math.max(1, Math.ceil(entries.length / perPage))
    const safePage = Math.min(page, pageCount - 1)

    useEffect(() => {
        if (pageCount <= 1) return
        const id = setInterval(() => setPage((p) => (p + 1) % pageCount), ROTATE_MS)
        return () => clearInterval(id)
    }, [pageCount])

    if (!entries.length) return null
    const shown = entries.slice(safePage * perPage, safePage * perPage + perPage)

    return (
        <aside className="glass hidden w-[240px] shrink-0 flex-col gap-3 overflow-hidden border-l border-border p-4 lg:flex">
            {teams && teams.length > 0 && (
                <div className="shrink-0 space-y-1.5">
                    <p className="text-center text-xs font-bold uppercase tracking-widest text-primary">{STR.display.teamboard}</p>
                    {teams.map((t) => (
                        <motion.div
                            key={t.team}
                            layout
                            className={cn('flex items-center justify-between rounded-xl px-3 py-2 font-bold', TEAM_TONE[(t.team - 1) % TEAM_TONE.length])}
                        >
                            <span>#{t.team}</span>
                            <span className="tabular-nums">{t.points}</span>
                        </motion.div>
                    ))}
                </div>
            )}
            <p className="shrink-0 text-center text-xs font-bold uppercase tracking-widest text-primary">
                {STR.display.leaderboard}
                {entries.length > perPage && (
                    <span className="ml-1 font-bold tabular-nums text-muted-foreground">· {entries.length}</span>
                )}
            </p>
            <div ref={listRef} className="min-h-0 flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={safePage}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-1.5"
                    >
                        {shown.map((e) => {
                            const accent = nameAccent(e.name)
                            return (
                                <motion.div
                                    key={e.clientId}
                                    layout={reduceMotion ? false : 'position'}
                                    transition={springSoft}
                                    className="flex items-center gap-2 rounded-xl border border-border bg-card/70 px-2 py-1.5"
                                >
                                    <span className="grid w-6 shrink-0 place-items-center text-sm font-bold tabular-nums text-muted-foreground">
                                        {e.rank <= 3 ? <MedalIcon rank={e.rank} size={18} /> : e.rank}
                                    </span>
                                    <NameAvatar name={e.name} size={24} />
                                    <span className={cn('min-w-0 flex-1 truncate text-sm font-semibold', accent.text)}>{e.name}</span>
                                    {e.badges[0] && <BadgeIcon id={e.badges[0].id} size={16} />}
                                    <span className="shrink-0 text-sm font-bold tabular-nums text-primary">{e.points}</span>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>
            {pageCount > 1 && (
                <div className="flex shrink-0 items-center justify-center gap-1.5">
                    {Array.from({ length: pageCount }).map((_, i) => (
                        <span
                            key={i}
                            className={cn(
                                'h-1.5 rounded-full transition-all',
                                i === safePage ? 'w-4 bg-[image:var(--ws-cta)]' : 'w-1.5 bg-muted',
                            )}
                        />
                    ))}
                </div>
            )}
        </aside>
    )
}
