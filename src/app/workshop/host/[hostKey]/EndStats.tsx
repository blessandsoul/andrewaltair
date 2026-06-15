'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Clock, CheckCircle2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { RoomHistory, LeaderboardEntry } from '@/types/workshop.types'
import NameAvatar from '@/components/workshop/NameAvatar'
import { springPop } from '@/components/workshop/motion'
import { STR } from '@/data/workshop-strings'

/** Pull the «видео-мечта» line out of an r1 multi-field answer (falls back to last line). */
function dreamOf(text: string): string {
    const lines = text.split('\n').filter(Boolean)
    const dreamLine = lines.find((l) => /меч|ოცნ/i.test(l)) ?? lines[lines.length - 1] ?? text
    const colon = dreamLine.indexOf(':')
    return (colon >= 0 ? dreamLine.slice(colon + 1) : dreamLine).trim()
}

/**
 * Projector end screen — a summary built from the full answer history: participants,
 * the chosen photo, the average swipe-second (proves the 1-3-7 rule), quiz accuracy,
 * and a wall of everyone's video-dreams (the callback payoff).
 */
export function EndStats({
    hostKey,
    photo,
    leaderboard,
}: {
    hostKey: string
    photo?: { src: string; label: string } | null
    leaderboard?: LeaderboardEntry[]
}) {
    const [data, setData] = useState<RoomHistory | null>(null)
    const podium = (leaderboard ?? []).slice(0, 3)

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

    const swipe = data?.rounds.find((r) => r.results?.type === 'number')?.results
    const avgSecond = swipe?.type === 'number' ? swipe.avg : null
    const quiz = data?.rounds.find((r) => r.type === 'quiz')?.results
    const quizPct =
        quiz?.type === 'choice' && quiz.total
            ? Math.round(((quiz.counts.find((c) => c.optionId === quiz.correctOptionId)?.count ?? 0) / quiz.total) * 100)
            : null
    const dreamsRound = data?.rounds.find((r) => r.key === 'r1') ?? data?.rounds.find((r) => r.type === 'text')
    const dreams = dreamsRound?.results?.type === 'text' ? dreamsRound.results.items : []

    type Stat = { icon?: LucideIcon; image?: string; value: string; label: string }
    const stats: Stat[] = [
        { icon: Users, value: data ? String(data.participantCount) : '—', label: STR.stats.participants },
        ...(photo ? [{ image: photo.src, value: '', label: STR.stats.chosenPhoto }] : []),
        ...(avgSecond != null ? [{ icon: Clock, value: STR.stats.avgSecondUnit(avgSecond), label: STR.stats.avgSecond }] : []),
        ...(quizPct != null ? [{ icon: CheckCircle2, value: `${quizPct}%`, label: STR.stats.quizCorrect }] : []),
    ]

    return (
        <div className="flex h-full flex-col items-center justify-center gap-8 px-8 py-4">
            <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-gradient text-center text-[clamp(32px,5vh,60px)] font-bold tracking-tight"
            >
                {STR.stats.title}
            </motion.h2>

            <div className="flex flex-wrap items-stretch justify-center gap-5">
                {stats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...springPop, delay: 0.06 * i }}
                        className="glass hover-lift flex w-[200px] flex-col items-center gap-3 rounded-3xl border border-border bg-card p-6 text-center shadow-sm"
                    >
                        {s.image ? (
                            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-foreground">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={s.image} alt="" className="absolute inset-0 size-full object-cover" />
                            </div>
                        ) : (
                            <>
                                {s.icon && (
                                    <span className="glow-primary flex size-14 items-center justify-center rounded-2xl bg-[image:var(--ws-cta)] text-primary-foreground shadow-lg">
                                        <s.icon size={26} />
                                    </span>
                                )}
                                <span className="text-gradient text-5xl font-extrabold tabular-nums leading-none">{s.value}</span>
                            </>
                        )}
                        <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</span>
                    </motion.div>
                ))}
            </div>

            {podium.length > 0 && (
                <div className="flex items-end justify-center gap-4">
                    {[1, 0, 2].map((slot) => {
                        const e = podium[slot]
                        if (!e) return null
                        const medal = ['🥇', '🥈', '🥉'][slot]
                        const h = slot === 0 ? 'pt-2' : 'pt-6'
                        return (
                            <motion.div
                                key={e.clientId}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ ...springPop, delay: 0.1 * slot }}
                                className={`flex w-[150px] flex-col items-center gap-2 ${h}`}
                            >
                                <span className="text-4xl">{medal}</span>
                                <NameAvatar name={e.name} size={48} />
                                <span className="text-center text-lg font-bold text-foreground">{e.name}</span>
                                <span className="text-gradient text-2xl font-extrabold tabular-nums">{e.points}</span>
                                <span className="flex gap-0.5">{e.badges.slice(0, 4).map((b) => <span key={b.id}>{b.emoji}</span>)}</span>
                            </motion.div>
                        )
                    })}
                </div>
            )}

            {dreams.length > 0 && (
                <div className="flex w-full max-w-[1100px] flex-col items-center gap-3">
                    <p className="text-sm font-bold uppercase tracking-widest text-primary">{STR.stats.dreams}</p>
                    <div className="flex flex-wrap justify-center gap-2.5">
                        {dreams.map((d) => (
                            <motion.span
                                key={d.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-full border border-border bg-card px-4 py-2 text-[clamp(14px,1.8vh,20px)] text-card-foreground shadow-sm"
                            >
                                {dreamOf(d.textValue)}
                            </motion.span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
