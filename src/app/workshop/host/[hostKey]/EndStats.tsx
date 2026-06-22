'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HelpCircle, Radio, FileText } from 'lucide-react'
import type { RoomHistory, LeaderboardEntry, ChatMessage } from '@/types/workshop.types'
import NameAvatar from '@/components/workshop/NameAvatar'
import { BadgeIcon, MedalIcon } from '@/components/workshop/badgeIcons'
import { springPop } from '@/components/workshop/motion'
import { STR } from '@/data/workshop-strings'

type BroadcastRecap = { seconds: number; transcript: { at: number; text: string }[] }

/** Air-time seconds rendered as M:SS, language-neutral for the projector. */
function fmtAir(total: number): string {
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Projector end screen: the leaderboard (top-3 podium plus a ranked list), the top questions,
 * and the broadcast record (air-time plus the live-caption transcript) when the host went live.
 * One warm headline, no shame-y stat tiles.
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
    const [msgs, setMsgs] = useState<ChatMessage[]>([])
    const [recap, setRecap] = useState<BroadcastRecap | null>(null)
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

    useEffect(() => {
        let alive = true
        fetch(`/api/workshop/host/${hostKey}/messages`)
            .then((r) => r.json())
            .then((j) => alive && j?.success && setMsgs(j.data.messages as ChatMessage[]))
            .catch(() => {})
        return () => {
            alive = false
        }
    }, [hostKey])

    useEffect(() => {
        let alive = true
        fetch(`/api/workshop/host/${hostKey}/broadcast-recap`)
            .then((r) => r.json())
            .then((j) => alive && j?.success && setRecap(j.data as BroadcastRecap))
            .catch(() => {})
        return () => {
            alive = false
        }
    }, [hostKey])

    const questions = msgs.filter((m) => m.kind === 'question').sort((a, b) => b.votes - a.votes).slice(0, 12)

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

            {questions.length > 0 && (
                <div className="w-full max-w-160">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">{STR.chat.questionsAsked}</p>
                    <div className="flex flex-col gap-1.5">
                        {questions.map((m) => (
                            <div key={m.id} className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm">
                                <HelpCircle size={14} className="shrink-0 text-primary" />
                                <span className="min-w-0 flex-1 text-card-foreground">{m.text}</span>
                                {m.votes > 0 && <span className="shrink-0 text-xs font-bold text-secondary">↑{m.votes}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {recap && recap.seconds > 0 && (
                <div className="flex w-full max-w-160 flex-col gap-3">
                    <div className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 shadow-sm">
                        <Radio size={20} className="text-primary" />
                        <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">{STR.broadcast.airTime}</span>
                        <span className="text-gradient text-2xl font-extrabold tabular-nums">{fmtAir(recap.seconds)}</span>
                    </div>

                    {recap.transcript.length > 0 && (
                        <div>
                            <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                                <FileText size={14} className="text-primary" />
                                {STR.broadcast.transcriptTitle}
                            </p>
                            <div className="flex max-h-[36vh] flex-col gap-1 overflow-y-auto rounded-xl border border-border bg-card px-4 py-3">
                                {recap.transcript.map((t, i) => (
                                    <p key={`${t.at}-${i}`} className="text-sm leading-relaxed text-card-foreground">{t.text}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
