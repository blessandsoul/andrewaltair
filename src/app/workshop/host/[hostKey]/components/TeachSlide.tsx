'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { TeachContent, TeachBlock } from '@/types/workshop.types'
import { cn } from '@/lib/utils'

/**
 * Non-interactive teaching slide rendered on the projected DISPLAY.
 * Carries the deck's theory/media content so the host never leaves the tool.
 * Blocks: lead / cards / keypoints / media / table.
 */
export default function TeachSlide({ heading, content }: { heading: string; content?: TeachContent }) {
    const blocks = content?.blocks ?? []
    return (
        <div className="flex h-full flex-col items-center justify-center gap-6 py-2">
            <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-gradient max-w-[1100px] text-center text-[clamp(28px,4.4vh,56px)] font-bold leading-tight tracking-tight"
            >
                {heading}
            </motion.h2>

            {blocks.map((block, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.06 * (i + 1) }}
                    className="flex w-full justify-center"
                >
                    <BlockView block={block} />
                </motion.div>
            ))}
        </div>
    )
}

function BlockView({ block }: { block: TeachBlock }) {
    switch (block.kind) {
        case 'lead':
            return (
                <p className="max-w-[1000px] text-center text-[clamp(16px,2.3vh,26px)] font-medium leading-relaxed text-card-foreground">
                    {block.text}
                </p>
            )

        case 'cards':
            return (
                <div className="grid w-full max-w-[1100px] gap-5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
                    {block.cards.map((c, i) => (
                        <div key={i} className="glass hover-lift rounded-2xl border border-border bg-card p-5 text-left shadow-sm">
                            <p className="mb-2 text-[clamp(13px,1.7vh,19px)] font-bold uppercase tracking-wide text-primary">
                                {c.title}
                            </p>
                            <p className="text-[clamp(13px,1.6vh,18px)] leading-snug text-card-foreground">{c.text}</p>
                        </div>
                    ))}
                </div>
            )

        case 'keypoints':
            return (
                <div className="flex w-full max-w-[880px] flex-col gap-3.5">
                    {block.items.map((kp, i) => (
                        <div key={i} className="glass flex items-start gap-4 rounded-2xl border border-border bg-card p-4 text-left">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[image:var(--ws-cta)] text-base font-bold text-primary-foreground">
                                {kp.n ?? i + 1}
                            </span>
                            <p className="pt-1 text-[clamp(14px,1.9vh,21px)] leading-snug text-card-foreground">{kp.text}</p>
                        </div>
                    ))}
                </div>
            )

        case 'media':
            return (
                <div className="flex w-full max-w-[1100px] flex-wrap items-stretch justify-center gap-6">
                    {block.items.map((m, i) => (
                        <MediaCard key={i} item={m} />
                    ))}
                </div>
            )

        case 'table':
            return (
                <div className="w-full max-w-[1080px] overflow-x-auto">
                    <table className="w-full border-collapse text-[clamp(13px,1.8vh,19px)]">
                        <thead>
                            <tr>
                                {block.headers.map((h, i) => (
                                    <th
                                        key={i}
                                        className={cn(
                                            'border-b-2 border-foreground px-3 py-3 font-bold',
                                            i === 0 ? 'text-left' : 'text-center text-primary',
                                        )}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {block.rows.map((row, r) => (
                                <tr key={r}>
                                    {row.map((cell, c) => (
                                        <td
                                            key={c}
                                            className={cn(
                                                'border-b border-border bg-card/40 px-3 py-2.5',
                                                c === 0 ? 'text-left font-semibold text-foreground' : 'text-center text-card-foreground',
                                            )}
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )

        default:
            return null
    }
}

function MediaCard({
    item,
}: {
    item: { letter?: string; title?: string; src: string; mediaType: 'image' | 'video'; caption?: string }
}) {
    const [failed, setFailed] = useState(false)
    return (
        <div className="flex w-full min-w-0 max-w-[320px] flex-col gap-2">
            {item.letter && (
                <span className="text-gradient text-center text-[clamp(22px,3.4vh,40px)] font-bold leading-none">
                    {item.letter}
                </span>
            )}
            {item.title && (
                <span className="text-center text-[clamp(13px,1.8vh,20px)] font-bold text-foreground">{item.title}</span>
            )}
            <div className="relative aspect-[9/16] max-h-[52vh] w-full overflow-hidden rounded-2xl border border-border bg-foreground shadow-xl">
                {failed ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-3 text-center font-mono text-xs text-primary-foreground/50">
                        <span className="size-11 rounded-full border-2 border-dashed border-primary-foreground/35" />
                        {item.src}
                    </div>
                ) : item.mediaType === 'video' ? (
                    <video
                        src={item.src}
                        controls
                        muted
                        playsInline
                        preload="metadata"
                        onError={() => setFailed(true)}
                        className="absolute inset-0 size-full object-cover"
                    />
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={item.src}
                        alt={item.title ?? ''}
                        onError={() => setFailed(true)}
                        className="absolute inset-0 size-full object-cover"
                    />
                )}
            </div>
            {item.caption && (
                <span className="text-center font-mono text-[10px] tracking-wide text-muted-foreground/60">{item.caption}</span>
            )}
        </div>
    )
}
