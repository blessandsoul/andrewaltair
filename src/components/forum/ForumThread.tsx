"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TbUser, TbCrown, TbSwords, TbLoader2, TbSend } from "react-icons/tb"

import { cn } from "@/lib/utils"
import { getForumPersona } from "@/lib/georgian-forum-personas"
import { ForumPersonaAvatar } from "@/components/forum/ForumPersonaAvatar"
import { ForumLikeStack, type ForumLiker } from "@/components/forum/ForumLikeStack"
import { ForumReactions } from "@/components/forum/ForumReactions"

export interface ForumPostView {
    id: string
    personaId: string
    author: { name: string; avatar?: string }
    content: string
    parentId: string | null
    likedBy?: ForumLiker[]
    agrees?: number
    disagrees?: number
    isUser?: boolean
    userName?: string
}

interface Node extends ForumPostView {
    children: Node[]
}

function buildTree(posts: ForumPostView[]): Node[] {
    const byId = new Map<string, Node>()
    posts.forEach((p) => byId.set(p.id, { ...p, children: [] }))
    const roots: Node[] = []
    byId.forEach((node) => {
        const parent = node.parentId ? byId.get(node.parentId) : null
        if (parent) parent.children.push(node)
        else roots.push(node)
    })
    return roots
}

/** Inline "challenge this persona" box → reader comment + persona reply. */
function ChallengeBox({ topicId, parentId }: { topicId: string; parentId: string }) {
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const [content, setContent] = React.useState("")
    const [name, setName] = React.useState("")
    const [busy, setBusy] = React.useState(false)
    const [err, setErr] = React.useState("")

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (content.trim().length < 3) return
        setBusy(true)
        setErr("")
        try {
            const res = await fetch(`/api/forum/topics/${topicId}/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ parentId, content: content.trim(), name: name.trim() }),
            })
            const j = await res.json().catch(() => null)
            if (res.ok && j?.data?.ok) {
                setContent("")
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
                className="inline-flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary"
            >
                <TbSwords className="w-3.5 h-3.5" />
                გამოწვევა
            </button>
        )
    }

    return (
        <form onSubmit={submit} className="mt-2 space-y-2 rounded-lg border border-border/60 p-2">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={300}
                rows={2}
                placeholder="შენი კონტრარგუმენტი..."
                className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary resize-none"
            />
            <div className="flex items-center gap-2">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={40}
                    placeholder="სახელი"
                    className="flex-1 rounded-md border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
                />
                <button
                    type="submit"
                    disabled={busy || content.trim().length < 3}
                    className="inline-flex items-center gap-1 rounded-md bg-primary text-white px-3 py-1.5 text-xs font-medium hover:opacity-90 disabled:opacity-50"
                >
                    {busy ? <TbLoader2 className="w-3.5 h-3.5 animate-spin" /> : <TbSend className="w-3.5 h-3.5" />}
                    {busy ? "პასუხობს…" : "გაგზავნა"}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="text-xs text-muted-foreground">
                    გაუქმება
                </button>
            </div>
            {err && <p className="text-xs text-destructive">{err}</p>}
        </form>
    )
}

function PostCard({
    node,
    depth,
    leaderId,
    topicId,
}: {
    node: Node
    depth: number
    leaderId: string | null
    topicId: string
}) {
    const persona = node.isUser ? undefined : getForumPersona(node.personaId)
    const isLeader = depth === 0 && !node.isUser && node.id === leaderId

    return (
        <div className={cn(depth > 0 && "ml-5 sm:ml-10 mt-3 pl-4 border-l-2 border-border/50")}>
            <div className="flex gap-3">
                {node.isUser ? (
                    <span className="inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0 w-10 h-10">
                        <TbUser className="w-5 h-5" />
                    </span>
                ) : (
                    <ForumPersonaAvatar personaId={node.personaId} size={depth > 0 ? "md" : "lg"} />
                )}

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        {node.isUser ? (
                            <span className="font-semibold text-on-surface">
                                {node.userName || "მკითხველი"}
                                <span className="ml-1.5 text-xs font-normal text-on-surface-variant">· მკითხველი</span>
                            </span>
                        ) : (
                            <Link
                                href={`/forum/persona/${node.personaId}`}
                                className="font-semibold text-on-surface hover:text-primary transition-colors"
                            >
                                {node.author.name}
                            </Link>
                        )}
                        {persona && (
                            <span className="text-xs text-on-surface-variant">
                                {persona.era} · {persona.role}
                            </span>
                        )}
                        {isLeader && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 text-xs font-medium">
                                <TbCrown className="w-3.5 h-3.5" />
                                ყველაზე დამაჯერებელი
                            </span>
                        )}
                    </div>

                    <p className="mt-1 text-sm sm:text-base leading-relaxed text-on-surface-variant whitespace-pre-line">
                        {node.content}
                    </p>

                    {!node.isUser && (
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                            <ForumReactions postId={node.id} agrees={node.agrees || 0} disagrees={node.disagrees || 0} />
                            {node.likedBy && node.likedBy.length > 0 && (
                                <ForumLikeStack likedBy={node.likedBy} size="xs" max={5} showCount={false} />
                            )}
                            {depth === 0 && <ChallengeBox topicId={topicId} parentId={node.id} />}
                        </div>
                    )}
                </div>
            </div>

            {node.children.length > 0 && (
                <div>
                    {node.children.map((c) => (
                        <PostCard key={c.id} node={c} depth={depth + 1} leaderId={leaderId} topicId={topicId} />
                    ))}
                </div>
            )}
        </div>
    )
}

/** Renders the full persona debate for a topic, with the most-agreed opinion crowned. */
export function ForumThread({ posts, topicId }: { posts: ForumPostView[]; topicId: string }) {
    const roots = React.useMemo(() => buildTree(posts), [posts])

    const leaderId = React.useMemo(() => {
        let best: { id: string; agrees: number } | null = null
        for (const r of roots) {
            if (r.isUser) continue
            const ag = r.agrees || 0
            if (ag > 0 && (!best || ag > best.agrees)) best = { id: r.id, agrees: ag }
        }
        return best?.id ?? null
    }, [roots])

    if (!posts.length) {
        return (
            <p className="text-sm text-on-surface-variant py-8 text-center">
                მსჯელობა ჯერ არ დაწყებულა.
            </p>
        )
    }

    return (
        <div className="space-y-6">
            {roots.map((node) => (
                <div key={node.id} className="bg-card rounded-xl border border-border/40 p-4">
                    <PostCard node={node} depth={0} leaderId={leaderId} topicId={topicId} />
                </div>
            ))}
        </div>
    )
}

export default ForumThread
