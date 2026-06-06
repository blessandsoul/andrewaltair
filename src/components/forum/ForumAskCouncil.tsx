"use client"

import * as React from "react"
import { TbUsers, TbSend, TbLoader2, TbMoodSmile, TbBulb, TbCheck } from "react-icons/tb"

import { cn } from "@/lib/utils"
import { ForumPersonaAvatar } from "@/components/forum/ForumPersonaAvatar"
import { getForumPersona } from "@/lib/georgian-forum-personas"

type Answer = { personaId: string; name: string; answer: string }

/**
 * "Ask the council" — a visitor types a question (no topic needed) and a few personas
 * answer instantly (a mini-debate, ephemeral). Below the answers, a button lets them
 * submit it as a FULL topic, which lands in the admin queue for review.
 */
export function ForumAskCouncil() {
    const [question, setQuestion] = React.useState("")
    const [mode, setMode] = React.useState<"serious" | "absurd">("serious")
    const [name, setName] = React.useState("")
    const [busy, setBusy] = React.useState(false)
    const [answers, setAnswers] = React.useState<Answer[]>([])
    const [err, setErr] = React.useState("")
    const [suggested, setSuggested] = React.useState(false)
    const [suggesting, setSuggesting] = React.useState(false)

    const ask = async (e: React.FormEvent) => {
        e.preventDefault()
        if (question.trim().length < 3) return
        setBusy(true); setErr(""); setAnswers([]); setSuggested(false)
        try {
            const res = await fetch("/api/forum/ask-council", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: question.trim(), mode }),
            })
            const j = await res.json().catch(() => null)
            if (res.ok && j?.data?.answers?.length) setAnswers(j.data.answers as Answer[])
            else setErr(j?.error?.message || "ვერ მოხერხდა")
        } catch {
            setErr("ვერ მოხერხდა")
        } finally {
            setBusy(false)
        }
    }

    const suggest = async () => {
        if (question.trim().length < 5) { setErr("კითხვა ძალიან მოკლეა სრული თემისთვის"); return }
        setSuggesting(true); setErr("")
        try {
            const res = await fetch("/api/forum/suggest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: question.trim(), name: name.trim() }),
            })
            const j = await res.json().catch(() => null)
            if (res.ok && j?.data?.ok) setSuggested(true)
            else setErr(j?.error?.message || "ვერ მოხერხდა")
        } catch {
            setErr("ვერ მოხერხდა")
        } finally {
            setSuggesting(false)
        }
    }

    return (
        <div className="rounded-2xl border border-primary/30 bg-card p-4 sm:p-5">
            <div className="flex items-center gap-2 text-on-surface font-semibold">
                <TbUsers className="w-5 h-5 text-primary" />
                ჰკითხე საბჭოს
            </div>
            <p className="mt-1 mb-3 text-sm text-on-surface-variant">
                დასვი კითხვა — საქართველოს დიდებული ადამიანები მაშინვე გიპასუხებენ.
            </p>

            <form onSubmit={ask} className="space-y-3">
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    maxLength={200}
                    rows={2}
                    placeholder="შენი კითხვა საბჭოს..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary resize-none"
                />
                <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex rounded-lg border border-border p-0.5 text-sm">
                        <button
                            type="button"
                            onClick={() => setMode("serious")}
                            className={cn("rounded-md px-3 py-1.5", mode === "serious" ? "bg-primary text-white" : "text-on-surface-variant")}
                        >
                            სერიოზული
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("absurd")}
                            className={cn("inline-flex items-center gap-1 rounded-md px-3 py-1.5", mode === "absurd" ? "bg-primary text-white" : "text-on-surface-variant")}
                        >
                            <TbMoodSmile className="w-4 h-4" />
                            აბსურდი
                        </button>
                    </div>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={40}
                        placeholder="სახელი (არასავალდებულო)"
                        className="flex-1 min-w-40 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    <button
                        type="submit"
                        disabled={busy || question.trim().length < 3}
                        className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
                    >
                        {busy ? <TbLoader2 className="w-4 h-4 animate-spin" /> : <TbSend className="w-4 h-4" />}
                        {busy ? "საბჭო პასუხობს…" : "კითხვა"}
                    </button>
                </div>
                {err && <p className="text-xs text-destructive">{err}</p>}
            </form>

            {answers.length > 0 && (
                <div className="mt-4 space-y-3 border-t border-border/40 pt-4">
                    {answers.map((a) => {
                        const p = getForumPersona(a.personaId)
                        return (
                            <div key={a.personaId} className="flex gap-3">
                                <ForumPersonaAvatar personaId={a.personaId} size="md" />
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-2">
                                        <span className="font-semibold text-on-surface">{a.name}</span>
                                        {p && <span className="text-xs text-on-surface-variant">{p.era}</span>}
                                    </div>
                                    <p className="mt-0.5 text-sm leading-relaxed text-on-surface-variant whitespace-pre-line">
                                        {a.answer}
                                    </p>
                                </div>
                            </div>
                        )
                    })}

                    {suggested ? (
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <TbCheck className="w-4 h-4" />
                            შენი თემა გაიგზავნა — მალე სრულად განიხილავენ.
                        </div>
                    ) : (
                        <button
                            onClick={suggest}
                            disabled={suggesting}
                            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline disabled:opacity-50"
                        >
                            {suggesting ? <TbLoader2 className="w-4 h-4 animate-spin" /> : <TbBulb className="w-4 h-4" />}
                            ეს თემა სრულად განიხილონ (20 პერსონა)
                        </button>
                    )}
                    <p className="text-[11px] text-on-surface-variant">AI-წარმოსახული პასუხებია — არა რეალური ციტატები.</p>
                </div>
            )}
        </div>
    )
}

export default ForumAskCouncil
