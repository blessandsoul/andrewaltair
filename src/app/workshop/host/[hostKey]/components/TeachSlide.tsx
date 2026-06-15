'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import type { TeachContent, TeachBlock } from '@/types/workshop.types'
import { cn } from '@/lib/utils'

/**
 * Non-interactive teaching slide rendered on the projected DISPLAY.
 * Carries the deck's theory/media content so the host never leaves the tool.
 * Blocks: lead / cards / keypoints / media / table.
 */
export default function TeachSlide({
    heading,
    content,
    heroPhoto,
}: {
    heading: string
    content?: TeachContent
    heroPhoto?: string
}) {
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
                    <BlockView block={block} heroPhoto={heroPhoto} />
                </motion.div>
            ))}
        </div>
    )
}

function BlockView({ block, heroPhoto }: { block: TeachBlock; heroPhoto?: string }) {
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
                    {block.cards.map((c, i) => {
                        // titles authored as "N · Заголовок" → split the number into a top-right badge
                        const m = c.title.match(/^(\d+)\s*·\s*(.+)$/)
                        const num = m?.[1]
                        const rest = m?.[2]
                        if (num && rest) return <NumberedCard key={i} n={num} title={rest} text={c.text} />
                        return (
                            <div key={i} className="glass hover-lift rounded-2xl border border-border bg-card p-5 text-left shadow-sm">
                                <p className="mb-2 text-[clamp(13px,1.7vh,19px)] font-bold uppercase tracking-wide text-primary">
                                    {c.title}
                                </p>
                                <p className="text-[clamp(13px,1.6vh,18px)] leading-snug text-card-foreground">{c.text}</p>
                            </div>
                        )
                    })}
                </div>
            )

        case 'keypoints':
            return (
                <div className="grid w-full max-w-[1100px] gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
                    {block.items.map((kp, i) => (
                        <NumberedCard key={i} n={kp.n ?? String(i + 1)} text={kp.text} />
                    ))}
                </div>
            )

        case 'annotated':
            return <AnnotatedPhoto src={block.src ?? heroPhoto} pins={block.pins} />

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

// Numbered card — number badge top-RIGHT corner, text top-LEFT (used by keypoints + numbered cards).
function NumberedCard({ n, title, text }: { n: string; title?: string; text: string }) {
    return (
        <div className="glass hover-lift relative rounded-3xl border border-border bg-card p-6 pr-16 text-left shadow-sm">
            <span className="glow-primary absolute right-4 top-4 flex size-12 items-center justify-center rounded-2xl bg-[image:var(--ws-cta)] text-xl font-extrabold text-primary-foreground shadow-lg">
                {n}
            </span>
            {title && (
                <p className="mb-1.5 text-[clamp(13px,1.7vh,19px)] font-bold uppercase tracking-wide text-primary">{title}</p>
            )}
            <p className="text-[clamp(14px,1.9vh,21px)] font-medium leading-snug text-card-foreground">{text}</p>
        </div>
    )
}

// Annotated photo — numbered pins (x/y are % of the frame) map concepts onto the real image.
function AnnotatedPhoto({
    src,
    pins,
}: {
    src?: string
    pins: { n: string; label: string; text?: string; x: number; y: number }[]
}) {
    if (!src) return null
    return (
        <div className="relative mx-auto aspect-[9/16] w-[42vh] max-w-[88vw] overflow-hidden rounded-3xl border border-border bg-foreground shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-foreground/15" />
            {pins.map((p) => (
                <div
                    key={p.n}
                    className="absolute flex -translate-y-1/2 items-center gap-2"
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                    <span className="glow-primary flex size-9 shrink-0 items-center justify-center rounded-full bg-[image:var(--ws-cta)] text-base font-extrabold text-primary-foreground shadow-lg ring-2 ring-white/70">
                        {p.n}
                    </span>
                    <span className="glass-strong whitespace-nowrap rounded-full px-3 py-1 text-sm font-bold text-foreground shadow-md">
                        {p.label}
                    </span>
                </div>
            ))}
        </div>
    )
}

function MediaCard({
    item,
}: {
    item: { letter?: string; title?: string; src: string; mediaType: 'image' | 'video'; caption?: string }
}) {
    const [failed, setFailed] = useState(false)
    const [started, setStarted] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const isVideo = item.mediaType === 'video'

    // Click-to-play, then loop non-stop (no hover dependency).
    const play = (): void => {
        const el = videoRef.current
        if (!el) return
        el.loop = true
        void el.play().catch(() => {})
        setStarted(true)
    }

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
            {/* 9:16 portrait box — images cover, videos contain (fills when portrait, safe-letterbox otherwise) */}
            <div className="relative aspect-[9/16] max-h-[52vh] w-full overflow-hidden rounded-2xl border border-border bg-foreground shadow-xl">
                {failed ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-3 text-center font-mono text-xs text-primary-foreground/50">
                        <span className="size-11 rounded-full border-2 border-dashed border-primary-foreground/35" />
                        {item.src}
                    </div>
                ) : isVideo ? (
                    <>
                        <video
                            ref={videoRef}
                            src={item.src}
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            controls={started}
                            onError={() => setFailed(true)}
                            className="absolute inset-0 size-full object-contain"
                        />
                        {!started && (
                            <button
                                type="button"
                                onClick={play}
                                aria-label="Play"
                                className="absolute inset-0 flex items-center justify-center bg-foreground/30 transition hover:bg-foreground/20"
                            >
                                <span className="glow-primary flex size-16 items-center justify-center rounded-full bg-[image:var(--ws-cta)] shadow-xl">
                                    <Play className="size-7 text-primary-foreground" fill="currentColor" />
                                </span>
                            </button>
                        )}
                    </>
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
