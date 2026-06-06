"use client"

import * as React from "react"
import { TbThumbUp, TbThumbDown } from "react-icons/tb"

import { cn } from "@/lib/utils"

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

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => react("agree")}
                disabled={!!voted}
                className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors",
                    voted === "agree"
                        ? "border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400"
                        : "border-border hover:bg-muted text-on-surface-variant",
                    voted && voted !== "agree" && "opacity-60",
                )}
            >
                <TbThumbUp className="w-3.5 h-3.5" />
                ვეთანხმები
                {a > 0 && <span className="font-medium">{a}</span>}
            </button>
            <button
                onClick={() => react("disagree")}
                disabled={!!voted}
                className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors",
                    voted === "disagree"
                        ? "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400"
                        : "border-border hover:bg-muted text-on-surface-variant",
                    voted && voted !== "disagree" && "opacity-60",
                )}
            >
                <TbThumbDown className="w-3.5 h-3.5" />
                არ ვეთანხმები
                {d > 0 && <span className="font-medium">{d}</span>}
            </button>
        </div>
    )
}

export default ForumReactions
