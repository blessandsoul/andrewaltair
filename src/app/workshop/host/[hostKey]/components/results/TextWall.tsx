'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'
import type { TextResultItem } from '@/types/workshop.types'
import NameAvatar, { nameAccent } from '@/components/workshop/NameAvatar'
import { parseStructuredAnswer } from '@/components/workshop/parseAnswer'
import { Button } from '@/components/ui/button'
import { springPop } from '@/components/workshop/motion'
import { cn } from '@/lib/utils'
import { STR } from '@/data/workshop-strings'

interface TextWallProps {
    items: TextResultItem[]
    onPin: (action: string, responseId?: string) => void
    readonly?: boolean
}

/** Compact answer body. Multi-field answers drop the repeated field labels (same for everyone =
 *  noise on a 30-person wall) and show the values as 3 tight full-width lines (first one bold).
 *  Plain answers clamp to 3 lines. Either way the height is bounded by the card. */
function AnswerBody({ text }: { text: string }) {
    const rows = parseStructuredAnswer(text)
    if (!rows) {
        return (
            <p className="line-clamp-3 whitespace-pre-wrap text-[clamp(11px,1.5vh,15px)] font-medium leading-snug text-card-foreground">
                {text}
            </p>
        )
    }
    return (
        <div className="flex min-w-0 flex-col gap-px">
            {rows.slice(0, 3).map((r, i) => (
                <span
                    key={i}
                    className={cn(
                        'truncate leading-tight',
                        i === 0
                            ? 'text-[clamp(12px,1.55vh,15px)] font-bold text-card-foreground'
                            : 'text-[clamp(11px,1.4vh,13px)] font-medium text-card-foreground/75',
                    )}
                >
                    {r.value}
                </span>
            ))}
        </div>
    )
}

function AnswerCard({
    item,
    onPin,
    readonly,
}: {
    item: TextResultItem
    onPin: (action: string, responseId?: string) => void
    readonly: boolean
}) {
    const accent = nameAccent(item.name)
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={springPop}
            className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card py-1.5 pl-2.5 pr-2 shadow-sm"
        >
            {/* accent stripe in the participant's color */}
            <span className={cn('absolute inset-y-0 left-0 w-[3px]', accent.solid)} />

            <div className="mb-1 flex items-center gap-1.5">
                <NameAvatar name={item.name} size={16} />
                <span className={cn('min-w-0 flex-1 truncate text-[12px] font-extrabold', accent.text)}>{item.name}</span>
            </div>
            <AnswerBody text={item.textValue} />

            {!readonly && (
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onPin('pinResponse', item.id)}
                    title={STR.results.pinTitle}
                    aria-label={STR.results.pinTitle}
                    className="absolute right-1 top-1 size-5 text-muted-foreground opacity-0 transition-all hover:text-warning group-hover:opacity-100"
                >
                    <Star size={12} />
                </Button>
            )}
        </motion.div>
    )
}

const ROTATE_MS = 6000 // auto-advance the wall so every answer rotates into view
const GAP = 8 // px gap between cards

/**
 * Projector answer wall — compact fixed-height cards packed top-left (never stretched to fill),
 * with the columns/rows-per-page measured against the real screen so it fits 30+ people and
 * auto-rotates pages instead of ever scrolling.
 */
export default function TextWall({ items, onPin, readonly = false }: TextWallProps) {
    const isStructured = items.some((it) => !!parseStructuredAnswer(it.textValue))
    const cardH = isStructured ? 92 : 76 // compact, deterministic — few cards stay small, many paginate
    const minColW = isStructured ? 264 : 184

    // measure the available box so the grid fits the projector exactly (no scroll, no balloon)
    const boxRef = useRef<HTMLDivElement>(null)
    const [box, setBox] = useState({ w: 0, h: 0 })
    useEffect(() => {
        const el = boxRef.current
        if (!el) return
        const ro = new ResizeObserver(() => setBox({ w: el.clientWidth, h: el.clientHeight }))
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const cols = Math.max(1, Math.min(6, Math.floor((box.w + GAP) / (minColW + GAP)) || 1))
    const rows = Math.max(1, Math.floor((box.h + GAP) / (cardH + GAP)) || 1)
    const perPage = Math.max(1, cols * rows)
    const pageCount = Math.max(1, Math.ceil(items.length / perPage))

    const [page, setPage] = useState(0)
    const safePage = Math.min(page, pageCount - 1)

    // auto-rotate pages (only when there's more than one)
    useEffect(() => {
        if (pageCount <= 1) return
        const id = setInterval(() => setPage((p) => (p + 1) % pageCount), ROTATE_MS)
        return () => clearInterval(id)
    }, [pageCount])

    if (items.length === 0) {
        return <p className="text-center text-muted-foreground">{STR.results.noAnswersWaiting}</p>
    }

    const shown = items.slice(safePage * perPage, safePage * perPage + perPage)

    return (
        <div className="flex h-full flex-col gap-2">
            <div ref={boxRef} className="relative min-h-0 flex-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={safePage}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="grid h-full content-start"
                        style={{
                            gap: `${GAP}px`,
                            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                            gridAutoRows: `${cardH}px`,
                        }}
                    >
                        {shown.map((item) => (
                            <AnswerCard key={item.id} item={item} onPin={onPin} readonly={readonly} />
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {pageCount > 1 && (
                <div className="flex items-center justify-center gap-2 pt-0.5">
                    {Array.from({ length: pageCount }).map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setPage(i)}
                            aria-label={`${i + 1}`}
                            className={cn(
                                'h-2 rounded-full transition-all',
                                i === safePage ? 'w-6 bg-[image:var(--ws-cta)]' : 'w-2 bg-muted hover:bg-muted-foreground/40',
                            )}
                        />
                    ))}
                    <span className="ml-1.5 text-xs font-semibold tabular-nums text-muted-foreground">
                        {safePage + 1}/{pageCount} · {items.length}
                    </span>
                </div>
            )}
        </div>
    )
}
