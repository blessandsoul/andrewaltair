import type { IconType } from "react-icons"
import { TbTrendingUp, TbCheck, TbX, TbClock } from "react-icons/tb"

import { cn } from "@/lib/utils"
import { getForumPersona } from "@/lib/georgian-forum-personas"
import { ForumPersonaAvatar } from "@/components/forum/ForumPersonaAvatar"
import type { ForumPostView } from "@/components/forum/ForumThread"

const VERDICT: Record<string, { label: string; cls: string; Icon: IconType }> = {
    right: { label: "გამართლდა", cls: "bg-green-500/15 text-green-600 dark:text-green-400", Icon: TbCheck },
    wrong: { label: "ვერ გამართლდა", cls: "bg-red-500/15 text-red-500", Icon: TbX },
    pending: { label: "შედეგი ელოდება", cls: "bg-muted text-on-surface-variant", Icon: TbClock },
}

/**
 * "What happens next" — the personas' forecasts on a topic. Each carries a verdict badge
 * (pending / came true / failed) that the admin resolves later; accuracy feeds the
 * prophet leaderboard. Renders nothing when a topic has no predictions.
 */
export function ForumPredictions({ posts }: { posts: ForumPostView[] }) {
    const predictions = posts.filter((p) => p.isPrediction)
    if (predictions.length === 0) return null

    return (
        <section className="mb-8">
            <h2 className="text-lg font-semibold text-on-surface flex items-center gap-2 mb-3">
                <TbTrendingUp className="w-5 h-5 text-primary" />
                პროგნოზები
                <span className="text-xs font-normal text-on-surface-variant">— რა მოხდება შემდეგ</span>
            </h2>

            <div className="space-y-2">
                {predictions.map((p) => {
                    const persona = getForumPersona(p.personaId)
                    const v = VERDICT[p.predictionVerdict || "pending"] || VERDICT.pending
                    return (
                        <div key={p.id} className="flex gap-3 rounded-xl border border-border/40 bg-card p-3">
                            <ForumPersonaAvatar personaId={p.personaId} size="md" />
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                    <span className="font-semibold text-on-surface">{p.author?.name || persona?.name}</span>
                                    {persona && <span className="text-xs text-on-surface-variant">{persona.era}</span>}
                                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", v.cls)}>
                                        <v.Icon className="w-3.5 h-3.5" />
                                        {v.label}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm sm:text-base leading-relaxed text-on-surface-variant whitespace-pre-line">
                                    {p.content}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default ForumPredictions
