"use client"

import * as React from "react"
import { TbChartPie, TbThumbUp, TbThumbDown, TbFlame } from "react-icons/tb"

import { ForumPersonaAvatar } from "@/components/forum/ForumPersonaAvatar"
import type { ForumPostView } from "@/components/forum/ForumThread"

/**
 * "Who's winning" + national-mood bar, computed live from the agree/disagree votes on
 * the top-level persona opinions. Shows nothing until there are votes.
 */
export function ForumCampSplit({ posts }: { posts: ForumPostView[] }) {
    const top = posts.filter((p) => !p.parentId && !p.isUser && !p.isPrediction)

    const ranked = top
        .map((p) => ({
            id: p.id,
            personaId: p.personaId,
            name: p.author?.name || "",
            agrees: p.agrees || 0,
            disagrees: p.disagrees || 0,
        }))
        .filter((p) => p.agrees > 0)
        .sort((a, b) => b.agrees - a.agrees)
        .slice(0, 6)

    const totalAgrees = ranked.reduce((s, p) => s + p.agrees, 0)
    const moodUp = top.reduce((s, p) => s + (p.agrees || 0), 0)
    const moodDown = top.reduce((s, p) => s + (p.disagrees || 0), 0)
    const moodTotal = moodUp + moodDown
    const polarization = moodTotal > 0 ? 1 - Math.abs(moodUp - moodDown) / moodTotal : 0
    const heat = Math.round((polarization * 0.7 + Math.min(moodTotal / 150, 1) * 0.3) * 100)
    const heatLabel = heat >= 66 ? "ცხელი" : heat >= 33 ? "თბილი" : "მშვიდი"

    if (totalAgrees === 0) return null

    return (
        <div className="rounded-2xl border border-border/40 bg-card p-4 mb-6">
            <div className="text-sm font-semibold text-on-surface flex items-center gap-2 mb-3">
                <TbChartPie className="w-4 h-4 text-primary" />
                ვინ ლიდერობს
            </div>

            <div className="space-y-2">
                {ranked.map((p) => {
                    const pct = Math.round((p.agrees / totalAgrees) * 100)
                    return (
                        <div key={p.id} className="flex items-center gap-2">
                            <ForumPersonaAvatar personaId={p.personaId} size="sm" />
                            <span className="text-sm text-on-surface w-24 sm:w-32 truncate">{p.name}</span>
                            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-on-surface-variant w-14 text-right">
                                {p.agrees} · {pct}%
                            </span>
                        </div>
                    )
                })}
            </div>

            {moodTotal > 0 && (
                <div className="mt-4">
                    <div className="text-xs text-on-surface-variant mb-1">ნაციის განწყობა</div>
                    <div className="flex h-2.5 rounded-full overflow-hidden bg-muted">
                        <div className="bg-green-500" style={{ width: `${Math.round((moodUp / moodTotal) * 100)}%` }} />
                        <div className="bg-red-400" style={{ width: `${Math.round((moodDown / moodTotal) * 100)}%` }} />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                        <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                            <TbThumbUp className="w-3 h-3" />
                            {moodUp}
                        </span>
                        <span className="inline-flex items-center gap-1 text-red-500">
                            {moodDown}
                            <TbThumbDown className="w-3 h-3" />
                        </span>
                    </div>
                </div>
            )}

            {moodTotal > 0 && (
                <div className="mt-4">
                    <div className="text-xs text-on-surface-variant mb-1 flex items-center justify-between">
                        <span>დებატის სიცხელე</span>
                        <span className="inline-flex items-center gap-1 font-medium text-on-surface">
                            <TbFlame className="w-3.5 h-3.5 text-orange-500" />
                            {heatLabel}
                        </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                        <div
                            className="h-full rounded-full bg-linear-to-r from-sky-400 via-orange-400 to-red-500"
                            style={{ width: `${Math.max(6, heat)}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ForumCampSplit
