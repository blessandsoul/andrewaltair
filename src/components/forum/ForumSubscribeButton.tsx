"use client"

import * as React from "react"
import Link from "next/link"
import { TbBell, TbBellRinging, TbLoader2 } from "react-icons/tb"

import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth"

/**
 * Follow the forum (scope:'forum') or a persona (scope:'persona'+personaId).
 * Auth-gated: logged-out users get a link to /login. Toggles via /api/forum/subscribe.
 */
export function ForumSubscribeButton({
    scope,
    personaId,
}: {
    scope: "forum" | "persona"
    personaId?: string
}) {
    const { user } = useAuth()
    const [following, setFollowing] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [ready, setReady] = React.useState(false)

    React.useEffect(() => {
        if (!user) {
            setReady(true)
            return
        }
        let on = true
        ;(async () => {
            try {
                const qs = new URLSearchParams({ scope, ...(personaId ? { personaId } : {}) })
                const res = await fetch(`/api/forum/subscribe?${qs.toString()}`)
                const j = await res.json()
                if (on) setFollowing(!!j.data?.following)
            } catch {
                /* ignore */
            } finally {
                if (on) setReady(true)
            }
        })()
        return () => {
            on = false
        }
    }, [user, scope, personaId])

    if (!user) {
        return (
            <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-on-surface-variant hover:bg-muted shrink-0"
            >
                <TbBell className="w-4 h-4" />
                გამოწერა
            </Link>
        )
    }

    const toggle = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/forum/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scope, personaId }),
            })
            const j = await res.json()
            setFollowing(!!j.data?.following)
        } catch {
            /* ignore */
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={toggle}
            disabled={loading || !ready}
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors shrink-0",
                following
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "border border-border text-on-surface-variant hover:bg-muted",
            )}
        >
            {loading ? (
                <TbLoader2 className="w-4 h-4 animate-spin" />
            ) : following ? (
                <TbBellRinging className="w-4 h-4" />
            ) : (
                <TbBell className="w-4 h-4" />
            )}
            {following ? "გამოწერილი" : "გამოწერა"}
        </button>
    )
}

export default ForumSubscribeButton
