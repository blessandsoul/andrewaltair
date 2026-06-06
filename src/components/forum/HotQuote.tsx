import Link from "next/link"
import { TbQuote } from "react-icons/tb"

import { ForumPersonaAvatar } from "@/components/forum/ForumPersonaAvatar"
import { getForumPersona } from "@/lib/georgian-forum-personas"

export interface HotQuoteData {
    id: string
    content: string
    agrees?: number
    personaId: string
    topicSlug: string
    topicTitleKa: string
}

/** "Hot quote of the day" — the most-agreed persona opinion, as a featured card. */
export function HotQuote({ quote }: { quote: HotQuoteData | null }) {
    if (!quote || !quote.content || !quote.topicSlug) return null
    const persona = getForumPersona(quote.personaId)
    return (
        <Link
            href={`/forum/${quote.topicSlug}`}
            className="group block rounded-2xl border border-primary/30 bg-card p-5 hover:shadow-lg transition-shadow"
        >
            <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                <TbQuote className="w-4 h-4" />
                დღის ციტატა
            </div>
            <div className="flex gap-4">
                <ForumPersonaAvatar personaId={quote.personaId} size="lg" />
                <div className="min-w-0 flex-1">
                    <p className="text-base sm:text-lg italic leading-relaxed text-on-surface">„{quote.content}"</p>
                    <div className="mt-2 text-sm text-on-surface-variant">
                        — {persona?.name || ""}{persona?.era ? ` · ${persona.era}` : ""}
                    </div>
                    <div className="mt-1 line-clamp-1 text-xs text-on-surface-variant">{quote.topicTitleKa}</div>
                </div>
            </div>
        </Link>
    )
}

export default HotQuote
