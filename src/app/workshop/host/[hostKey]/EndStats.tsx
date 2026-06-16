'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { RoomHistory, LeaderboardEntry } from '@/types/workshop.types'
import NameAvatar from '@/components/workshop/NameAvatar'
import { BadgeIcon, MedalIcon } from '@/components/workshop/badgeIcons'
import { springPop } from '@/components/workshop/motion'
import { STR } from '@/data/workshop-strings'

/**
 * Projector end screen — the leaderboard, and only the leaderboard: a top-3 podium plus a
 * ranked list of everyone else, under one warm headline. No shame-y stat tiles, no dream wall.
 */
export function EndStats({
    hostKey,
    leaderboard,
}: {
    hostKey: string
    photo?: { src: string; label: string } | null
    leaderboard?: LeaderboardEntry[]
}) {
    const [data, setData] = useState<RoomHistory | null>(null)
    const board = leaderboard ?? []
    const podium = board.slice(0, 3)
    const rest = board.slice(3)

    useEffect(() => {
        let alive = true
        fetch(`/api/workshop/host/${hostKey}/history`)
            .then((r) => r.json())
            .then((j) => alive && j?.success && setData(j.data as RoomHistory))
            .catch(() => {})
        return () => {
            alive = false
        }
    }, [hostKey])

    // warm headline: how many video-ideas the room created today (everyone who showed up has one)
    const created = data?.participantCount ?? board.length

    return (
        <div className="flex min-h-full flex-col items-center justify-start gap-7 px-8 py-6">
            <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-gradient text-center text-[clamp(32px,5vh,60px)] font-bold tracking-tight"
            >
                {STR.stats.title}
            </motion.h2>

            {created > 0 && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center text-[clamp(18px,2.6vh,30px)] font-semibold text-card-foreground"
                >
                    {STR.stats.created(created)}
                </motion.p>
            )}

            {podium.length > 0 && (
                <div className="flex items-end justify-center gap-4">
                    {[1, 0, 2].map((slot) => {
                        const e = podium[slot]
                        if (!e) return null
                        const h = slot === 0 ? 'pt-2' : 'pt-6'
                        return (
                            <motion.div
                                key={e.clientId}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ ...springPop, delay: 0.1 * slot }}
                                className={`flex w-[150px] flex-col items-center gap-2 ${h}`}
                            >
                                <MedalIcon rank={slot + 1} size={44} />
                                <NameAvatar name={e.name} size={48} />
                                <span className="text-center text-lg font-bold text-foreground">{e.name}</span>
                                <span className="text-gradient text-2xl font-extrabold tabular-nums">{e.points}</span>
                                <span className="flex gap-1">{e.badges.slice(0, 4).map((b) => <BadgeIcon key={b.id} id={b.id} size={20} />)}</span>
                            </motion.div>
                        )
                    })}
                </div>
            )}

            {rest.length > 0 && (
                <div className="flex w-full max-w-160 flex-col gap-2">
                    {rest.map((e, i) => (
                        <motion.div
                            key={e.clientId}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.04 * i }}
                            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2 shadow-sm"
                        >
                            <span className="w-7 shrink-0 text-center text-base font-bold tabular-nums text-muted-foreground">{e.rank}</span>
                            <NameAvatar name={e.name} size={30} />
                            <span className="min-w-0 flex-1 truncate text-base font-semibold text-foreground">{e.name}</span>
                            <span className="flex gap-1">{e.badges.slice(0, 4).map((b) => <BadgeIcon key={b.id} id={b.id} size={16} />)}</span>
                            <span className="text-gradient w-12 shrink-0 text-right text-lg font-extrabold tabular-nums">{e.points}</span>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
