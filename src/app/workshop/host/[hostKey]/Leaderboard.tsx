'use client'

import { motion } from 'framer-motion'
import NameAvatar, { nameAccent } from '@/components/workshop/NameAvatar'
import { BadgeIcon, MedalIcon } from '@/components/workshop/badgeIcons'
import type { LeaderboardEntry, TeamScore } from '@/types/workshop.types'
import { cn } from '@/lib/utils'
import { STR } from '@/data/workshop-strings'

const TEAM_TONE =['bg-primary/15 text-primary', 'bg-secondary/15 text-secondary', 'bg-success/15 text-success', 'bg-warning/15 text-warning', 'bg-info/15 text-info', 'bg-destructive/15 text-destructive']

/** Projector right rail — team scoreboard (if any) + top individuals. Reorders live. */
export function Leaderboard({ entries, teams }: { entries: LeaderboardEntry[]; teams?: TeamScore[] }) {
    if (!entries.length) return null
    return (
        <aside className="glass hide-scrollbar hidden w-[240px] shrink-0 flex-col gap-3 overflow-y-auto border-l border-border p-4 lg:flex">
            {teams && teams.length > 0 && (
                <div className="space-y-1.5">
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
            <div className="space-y-1.5">
                <p className="text-center text-xs font-bold uppercase tracking-widest text-primary">{STR.display.leaderboard}</p>
                {entries.slice(0, 6).map((e, i) => {
                    const accent = nameAccent(e.name)
                    return (
                        <motion.div
                            key={e.clientId}
                            layout
                            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                            className="flex items-center gap-2 rounded-xl border border-border bg-card/70 px-2 py-1.5"
                        >
                            <span className="grid w-6 shrink-0 place-items-center text-sm font-bold tabular-nums text-muted-foreground">
                                {i < 3 ? <MedalIcon rank={i + 1} size={18} /> : e.rank}
                            </span>
                            <NameAvatar name={e.name} size={24} />
                            <span className={cn('min-w-0 flex-1 truncate text-sm font-semibold', accent.text)}>{e.name}</span>
                            {e.badges[0] && <BadgeIcon id={e.badges[0].id} size={16} />}
                            <span className="shrink-0 text-sm font-bold tabular-nums text-primary">{e.points}</span>
                        </motion.div>
                    )
                })}
            </div>
        </aside>
    )
}
