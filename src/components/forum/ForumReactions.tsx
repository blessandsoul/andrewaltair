"use client"

import * as React from "react"
import { TbThumbUp, TbThumbDown } from "react-icons/tb"

import { cn } from "@/lib/utils"
import { playPop } from "@/lib/forum-sound"

/**
 * Agree / disagree buttons for a forum opinion (the "who's right" signal).
 * One vote per visitor, deduped via localStorage. No AI, no auth.
 */
export function ForumReactions({
    postId,
    agrees,
    disagrees,
}: {
    postId: string
    agrees: number
    disagrees: number
}) {
    const [a, setA] = React.useState(agrees)
    const [d, setD] = React.useState(disagrees)
    const [voted, setVoted] = React.useState<null | "agree" | "disagree">(null)

    React.useEffect(() => {
        try {
            const v = localStorage.getItem(`forum_react_${postId}`)
            if (v === "agree" || v === "disagree") setVoted(v)
        } catch {
            /* ignore */
        }
    }, [postId])

    const react = async (type: "agree" | "disagree") => {
        if (voted) return
        playPop()
        setVoted(type)
        if (type === "agree") setA((x) => x + 1)
        else setD((x) => x + 1)
        try {
            localStorage.setItem(`forum_react_${postId}`, type)
        } catch {
            /* ignore */
        }
        try {
            await fetch(`/api/forum/posts/${postId}/react`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type }),
            })
        } catch {
            /* ignore — count already shown optimistically */
        }
    }

    const total = a + d
    const base = "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors"

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => react("agree")}
                    disabled={!!voted}
                    className={cn(
                        base,
                        "border-border text-on-surface-variant hover:bg-muted",
                        voted === "agree" && "border-green-500/40 text-green-600 dark:text-green-400",
                        voted && voted !== "agree" && "opacity-60",
                    )}
                >
                    <TbThumbUp className="w-3.5 h-3.5" />
                    ვეთანხმები
                    <span className="font-semibold">{a}</span>
                </button>
                <button
                    onClick={() => react("disagree")}
                    disabled={!!voted}
                    className={cn(
                        base,
                        "border-border text-on-surface-variant hover:bg-muted",
                        voted === "disagree" && "border-red-500/40 text-red-500 dark:text-red-400",
                        voted && voted !== "disagree" && "opacity-60",
                    )}
                >
                    <TbThumbDown className="w-3.5 h-3.5" />
                    არ ვეთანხმები
                    <span className="font-semibold">{d}</span>
                </button>
            </div>
            {total > 0 && (
                <div className="flex h-1.5 w-full max-w-60 overflow-hidden rounded-full bg-muted">
                    <div className="bg-green-500/70" style={{ width: `${Math.round((a / total) * 100)}%` }} />
                    <div className="bg-red-400/70" style={{ width: `${Math.round((d / total) * 100)}%` }} />
                </div>
            )}
        </div>
    )
}

export default ForumReactions
