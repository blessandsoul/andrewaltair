"use client"

import * as React from "react"
import Link from "next/link"
import { TbArrowLeft, TbSwords, TbLoader2 } from "react-icons/tb"

import { cn } from "@/lib/utils"
import { FORUM_PERSONAS } from "@/lib/georgian-forum-personas"
import { ForumPersonaAvatar } from "@/components/forum/ForumPersonaAvatar"
import { ForumDisclaimer } from "@/components/forum/ForumDisclaimer"

interface Turn {
    personaId: string
    name: string
    content: string
}

export default function ForumDuelPage() {
    const [a, setA] = React.useState(FORUM_PERSONAS[0]?.id || "")
    const [b, setB] = React.useState(FORUM_PERSONAS[1]?.id || "")
    const [theme, setTheme] = React.useState("")
    const [turns, setTurns] = React.useState<Turn[]>([])
    const [busy, setBusy] = React.useState(false)
    const [err, setErr] = React.useState("")

    const run = async (e: React.FormEvent) => {
        e.preventDefault()
        if (a === b) {
            setErr("აირჩიე ორი განსხვავებული პერსონა")
            return
        }
        if (theme.trim().length < 3) return
        setBusy(true)
        setErr("")
        setTurns([])
        try {
            const res = await fetch("/api/forum/duel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ personaAId: a, personaBId: b, theme: theme.trim() }),
            })
            const j = await res.json().catch(() => null)
            if (res.ok && j?.data?.turns) setTurns(j.data.turns)
            else setErr(j?.error?.message || "ვერ მოხერხდა")
        } catch {
            setErr("ვერ მოხერხდა")
        } finally {
            setBusy(false)
        }
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-10 max-w-3xl">
                <Link href="/forum" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    <TbArrowLeft className="w-4 h-4" />
                    ფორუმი
                </Link>

                <h1 className="mt-3 text-3xl font-bold text-on-surface flex items-center gap-2">
                    <TbSwords className="w-7 h-7 text-primary" />
                    დუელი
                </h1>
                <p className="mt-1 text-muted-foreground">აირჩიე ორი ისტორიული პირი და თემა — ისინი იკამათებენ</p>

                <div className="my-5">
                    <ForumDisclaimer />
                </div>

                <form onSubmit={run} className="space-y-3 rounded-2xl border border-border/40 bg-card p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-muted-foreground">პირველი</label>
                            <select
                                value={a}
                                onChange={(e) => setA(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                            >
                                {FORUM_PERSONAS.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground">მეორე</label>
                            <select
                                value={b}
                                onChange={(e) => setB(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                            >
                                {FORUM_PERSONAS.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <input
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        maxLength={200}
                        placeholder="თემა (მაგ: ხელოვნური ინტელექტი საფრთხეა?)"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    {err && <p className="text-xs text-destructive">{err}</p>}
                    <button
                        type="submit"
                        disabled={busy || theme.trim().length < 3 || a === b}
                        className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-5 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
                    >
                        {busy ? <TbLoader2 className="w-4 h-4 animate-spin" /> : <TbSwords className="w-4 h-4" />}
                        {busy ? "კამათობენ…" : "დაიწყე დუელი"}
                    </button>
                </form>

                {turns.length > 0 && (
                    <div className="mt-6 space-y-3">
                        {turns.map((t, i) => {
                            const left = t.personaId === a
                            return (
                                <div
                                    key={i}
                                    className={cn("flex gap-3 items-start", left ? "" : "flex-row-reverse")}
                                >
                                    <ForumPersonaAvatar personaId={t.personaId} size="md" />
                                    <div
                                        className={cn(
                                            "max-w-[80%] rounded-2xl border border-border/40 p-3",
                                            left ? "bg-card" : "bg-primary/5",
                                        )}
                                    >
                                        <div className="text-xs font-semibold text-on-surface mb-1">{t.name}</div>
                                        <p className="text-sm leading-relaxed text-on-surface-variant whitespace-pre-line">
                                            {t.content}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </main>
    )
}
