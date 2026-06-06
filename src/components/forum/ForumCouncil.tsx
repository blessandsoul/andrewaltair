import Link from "next/link"
import { TbUsers } from "react-icons/tb"

import { getForumPersona } from "@/lib/georgian-forum-personas"
import { ForumPersonaAvatar } from "@/components/forum/ForumPersonaAvatar"
import type { ForumPostView } from "@/components/forum/ForumThread"

/**
 * "The council" — a portrait strip of the historical figures taking part in this debate.
 * Built from the top-level opinions (one chip per unique persona). Hidden if <2 took part.
 */
export function ForumCouncil({ posts }: { posts: ForumPostView[] }) {
    const seen = new Set<string>()
    const members = posts
        .filter((p) => !p.parentId && !p.isUser && !p.isPrediction)
        .filter((p) => (seen.has(p.personaId) ? false : (seen.add(p.personaId), true)))

    if (members.length < 2) return null

    return (
        <div className="mb-6 rounded-2xl border border-border/40 bg-card/50 p-4">
            <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <TbUsers className="w-3.5 h-3.5" />
                საბჭო · {members.length} მონაწილე
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
                {members.map((p) => {
                    const persona = getForumPersona(p.personaId)
                    return (
                        <Link
                            key={p.personaId}
                            href={`/forum/persona/${p.personaId}`}
                            className="group flex w-16 shrink-0 flex-col items-center gap-1"
                            title={persona ? `${persona.name} · ${persona.era}` : undefined}
                        >
                            <ForumPersonaAvatar
                                personaId={p.personaId}
                                size="lg"
                                className="ring-0 group-hover:ring-2 ring-primary transition"
                            />
                            <span className="w-full truncate text-center text-[10px] leading-tight text-on-surface-variant">
                                {persona?.name?.split(" ")[0] || ""}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default ForumCouncil
