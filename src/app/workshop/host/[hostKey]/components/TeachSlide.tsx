'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import type { TeachContent, TeachBlock } from '@/types/workshop.types'
import { cn } from '@/lib/utils'
import FitScale from './FitScale'

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
        <div className="flex h-full flex-col gap-4 py-2">
            <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-gradient mx-auto max-w-[1100px] shrink-0 text-center text-[clamp(26px,4vh,52px)] font-bold leading-tight tracking-tight"
            >
                {heading}
            </motion.h2>

            {/* FitScale shrinks the whole block stack to fit — projector never scrolls/clips */}
            <FitScale>
                <div className="flex w-full flex-col items-center gap-6">
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
            </FitScale>
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
                <div className="grid w-full max-w-[1100px] gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
                    {block.cards.map((c, i) => {
                        // titles authored as "N · Заголовок" → split the number into the card's number chip
                        const m = c.title.match(/^(\d+)\s*·\s*(.+)$/)
                        const num = m?.[1]
                        const rest = m?.[2]
                        if (num && rest) return <NumberedCard key={i} n={num} title={rest} text={c.text} />
                        return (
                            <div
                                key={i}
                                className="glass hover-lift relative overflow-hidden rounded-2xl border border-border bg-card p-4 text-left shadow-sm"
                            >
                                <p className="mb-1 text-[clamp(13px,1.7vh,18px)] font-bold text-primary">{c.title}</p>
                                <p className="text-[clamp(13px,1.6vh,18px)] leading-snug text-card-foreground">{c.text}</p>
                                <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-[image:var(--ws-cta)] opacity-50" />
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
                <div className="flex w-full max-w-[1280px] flex-wrap items-start justify-center gap-4">
                    {block.items.map((m, i) => (
                        <MediaCard key={i} item={m} />
                    ))}
                </div>
            )

        case 'table':
            return (
                <div className="w-full max-w-[1080px] overflow-hidden rounded-2xl border border-border shadow-sm">
                    <table className="w-full border-collapse text-[clamp(13px,1.8vh,19px)]">
                        <thead>
                            <tr className="bg-[image:var(--ws-cta)] text-primary-foreground">
                                {block.headers.map((h, i) => (
                                    <th key={i} className={cn('px-4 py-3 font-bold', i === 0 ? 'text-left' : 'text-center')}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {block.rows.map((row, r) => (
                                <tr key={r} className={cn('border-t border-border', r % 2 === 1 ? 'bg-card/40' : 'bg-card/70')}>
                                    {row.map((cell, c) => (
                                        <td
                                            key={c}
                                            className={cn(
                                                'px-4 py-2.5',
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

        case 'questions':
            return (
                <div className="grid w-full max-w-[1120px] gap-2.5 sm:grid-cols-2">
                    {block.items.map((q) => (
                        <div
                            key={q.n}
                            className={cn(
                                'glass flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-2 text-left shadow-sm',
                                q.toRoom && 'ring-1 ring-primary/40',
                            )}
                        >
                            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[image:var(--ws-cta)] text-sm font-extrabold text-primary-foreground">
                                {q.n}
                            </span>
                            <span className="min-w-0 flex-1 text-[clamp(12px,1.5vh,17px)] font-medium leading-snug text-card-foreground">
                                {q.text}
                            </span>
                            {q.toRoom && <Users size={16} className="shrink-0 text-primary" />}
                        </div>
                    ))}
                </div>
            )

        default:
            return null
    }
}

// Numbered card — gradient number tile on the LEFT + a soft corner glow. Body is NOT clamped:
// FitScale shrinks the whole slide so rich explanations stay fully visible without scroll.
function NumberedCard({ n, title, text }: { n: string; title?: string; text: string }) {
    return (
        <div className="group glass hover-lift relative flex gap-3.5 overflow-hidden rounded-2xl border border-border bg-card p-4 text-left shadow-sm">
            <span
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 size-20 rounded-full bg-[image:var(--ws-cta)] opacity-10 blur-2xl"
            />
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[image:var(--ws-cta)] text-lg font-extrabold text-primary-foreground shadow-md">
                {n}
            </span>
            <div className="min-w-0">
                {title && <p className="mb-1 text-[clamp(14px,1.9vh,20px)] font-bold text-foreground">{title}</p>}
                <p className="text-[clamp(13px,1.75vh,19px)] font-medium leading-snug text-card-foreground">{text}</p>
            </div>
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
    const videoRef = useRef<HTMLVideoElement>(null)
    const isVideo = item.mediaType === 'video'

    // Autoplay + loop, muted (browsers allow muted autoplay); the .play() nudge covers iOS/Safari.
    useEffect(() => {
        if (!isVideo) return
        const el = videoRef.current
        if (el) void el.play().catch(() => {})
    }, [isVideo, item.src])

    return (
        <div className="flex min-w-0 flex-col items-center gap-2">
            {item.letter && (
                <span className="text-gradient text-center text-[clamp(22px,3.4vh,40px)] font-bold leading-none">
                    {item.letter}
                </span>
            )}
            {item.title && (
                <span className="text-center text-[clamp(13px,1.8vh,20px)] font-bold text-foreground">{item.title}</span>
            )}
            {/* Height-driven 9:16 box → always true aspect, so 3 frames fit one row without distortion.
                Video sits whole on a blurred copy of itself — never any black bars on the 16:9 wall. */}
            <div className="relative aspect-[9/16] h-[clamp(280px,46vh,540px)] w-auto max-w-full overflow-hidden rounded-2xl border border-border bg-foreground shadow-xl">
                {failed ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-3 text-center font-mono text-xs text-primary-foreground/50">
                        <span className="size-11 rounded-full border-2 border-dashed border-primary-foreground/35" />
                        {item.src}
                    </div>
                ) : isVideo ? (
                    <>
                        {/* blurred bed — fills the box so a non-9:16 clip never shows black bars */}
                        <video
                            src={item.src}
                            autoPlay
                            loop
                            muted
                            playsInline
                            aria-hidden
                            className="absolute inset-0 size-full scale-110 object-cover blur-2xl brightness-[0.7]"
                        />
                        <video
                            ref={videoRef}
                            src={item.src}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            onError={() => setFailed(true)}
                            className="absolute inset-0 size-full object-contain"
                        />
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
