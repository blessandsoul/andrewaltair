"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { TbSend, TbLoader2, TbMessageQuestion, TbMoodSmile } from "react-icons/tb"

import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FORUM_PERSONAS } from "@/lib/georgian-forum-personas"

/** #5/#8 — ask a persona a question on this topic (serious or absurd mode). */
export function ForumAskBox({ topicId }: { topicId: string }) {
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const [personaId, setPersonaId] = React.useState(FORUM_PERSONAS[0]?.id || "")
    const [question, setQuestion] = React.useState("")
    const [name, setName] = React.useState("")
    const [mode, setMode] = React.useState<"serious" | "absurd">("serious")
    const [busy, setBusy] = React.useState(false)
    const [err, setErr] = React.useState("")

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (question.trim().length < 3) return
        setBusy(true)
        setErr("")
        try {
            const res = await fetch(`/api/forum/topics/${topicId}/ask`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ personaId, question: question.trim(), mode, name: name.trim() }),
            })
            const j = await res.json().catch(() => null)
            if (res.ok && j?.data?.ok) {
                setQuestion("")
                setOpen(false)
                router.refresh()
            } else {
                setErr(j?.error?.message || "ვერ მოხერხდა")
            }
        } catch {
            setErr("ვერ მოხერხდა")
        } finally {
            setBusy(false)
        }
    }

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-4 py-2 text-sm font-medium hover:opacity-90"
            >
                <TbMessageQuestion className="w-4 h-4" />
                ჰკითხე პერსონას
            </button>
        )
    }

    return (
        <form onSubmit={submit} className="rounded-2xl border border-primary/30 bg-card p-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
                <Select value={personaId} onValueChange={setPersonaId}>
                    <SelectTrigger className="w-full sm:w-56">
                        <SelectValue placeholder="აირჩიე პერსონა" />
                    </SelectTrigger>
                    <SelectContent>
                        {FORUM_PERSONAS.map((p) => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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
            </div>
            <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                maxLength={200}
                rows={2}
                placeholder="შენი კითხვა..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary resize-none"
            />
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                placeholder="შენი სახელი (არასავალდებულო)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            {err && <p className="text-xs text-destructive">{err}</p>}
            <div className="flex items-center gap-2">
                <button
                    type="submit"
                    disabled={busy || question.trim().length < 3}
                    className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                    {busy ? <TbLoader2 className="w-4 h-4 animate-spin" /> : <TbSend className="w-4 h-4" />}
                    {busy ? "პასუხობს…" : "კითხვა"}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">
                    გაუქმება
                </button>
            </div>
        </form>
    )
}

export default ForumAskBox
