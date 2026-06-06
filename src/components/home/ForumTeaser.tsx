import Link from "next/link"
import { TbArrowRight, TbMessages } from "react-icons/tb"

import { ForumPersonaAvatar } from "@/components/forum/ForumPersonaAvatar"

export interface ForumTeaserData {
    slug: string
    titleKa: string
    summaryKa: string
    sourceImage?: string
    postCount?: number
}

/** Home-page teaser: latest forum topic + a row of the debating persona avatars. */
export function ForumTeaser({ topic, personaIds }: { topic: ForumTeaserData; personaIds: string[] }) {
    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-on-surface flex items-center gap-2">
                    <TbMessages className="w-6 h-6 text-primary" />
                    ფორუმი
                </h2>
                <Link
                    href="/forum"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                    ყველა თემა
                    <TbArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <Link
                href={`/forum/${topic.slug}`}
                className="group block rounded-2xl border border-border/40 bg-card p-5 hover:shadow-lg transition-shadow"
            >
                <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                    დღეს ფორუმში
                </div>
                <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                    {topic.titleKa}
                </h3>
                <p className="mt-1.5 text-sm text-on-surface-variant line-clamp-2">{topic.summaryKa}</p>
                <div className="mt-4 flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {personaIds.slice(0, 6).map((pid) => (
                            <ForumPersonaAvatar
                                key={pid}
                                personaId={pid}
                                size="sm"
                                className="ring-2 ring-background"
                            />
                        ))}
                    </div>
                    <span className="text-xs text-on-surface-variant">
                        {topic.postCount || 0} ისტორიული პირი მსჯელობს
                    </span>
                </div>
            </Link>
        </section>
    )
}

export default ForumTeaser
