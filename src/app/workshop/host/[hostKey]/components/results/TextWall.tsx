'use client'

import { useEffect, useState } from 'react'
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

/** Multi-field answers («label: value» lines) render as compact stacked rows. */
function AnswerBody({ text }: { text: string }) {
    const rows = parseStructuredAnswer(text)
    if (!rows) {
        return (
            <p className="line-clamp-5 whitespace-pre-wrap text-[clamp(12px,1.45vh,17px)] leading-snug text-card-foreground">
                {text}
            </p>
        )
    }
    return (
        <div className="space-y-1.5">
            {rows.slice(0, 3).map((r, i) => (
                <div key={i}>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{r.label}</p>
                    <p className="line-clamp-2 text-[clamp(12px,1.4vh,16px)] font-semibold leading-snug text-card-foreground">
                        {r.value}
                    </p>
                </div>
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
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={springPop}
            className="group glass relative flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card pl-3 pr-2.5 py-2.5 shadow-sm"
        >
            {/* accent stripe in the participant's color */}
            <span className={cn('absolute inset-y-0 left-0 w-1', accent.solid)} />

            <div className="mb-1.5 flex items-center justify-between gap-1.5">
                <span className="inline-flex min-w-0 items-center gap-1.5">
                    <NameAvatar name={item.name} size={20} />
                    <span className={cn('truncate rounded-full px-2 py-0.5 text-[11px] font-bold', accent.soft, accent.text)}>
                        {item.name}
                    </span>
                </span>
                {!readonly && (
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onPin('pinResponse', item.id)}
                        title={STR.results.pinTitle}
                        aria-label={STR.results.pinTitle}
                        className="size-6 shrink-0 text-muted-foreground opacity-0 transition-all hover:text-warning group-hover:opacity-100"
                    >
                        <Star size={14} />
                    </Button>
                )}
            </div>
            <AnswerBody text={item.textValue} />
        </motion.div>
    )
}

const ROTATE_MS = 6000 // auto-advance the wall so every answer rotates into view

/**
 * Projector answer wall — a fit-to-screen 3-row grid that auto-cycles through pages,
 * so all answers (even 30+) rotate into view without ever scrolling. Cards are compact;
 * structured (multi-field) answers get fewer-but-wider columns.
 */
export default function TextWall({ items, onPin, readonly = false }: TextWallProps) {
    const isStructured = items.some((it) => !!parseStructuredAnswer(it.textValue))
    const cols = isStructured ? 3 : 5
    const perPage = cols * 3 // exactly 3 rows
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
        <div className="flex h-full flex-col gap-3">
            <AnimatePresence mode="wait">
                <motion.div
                    key={safePage}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="grid min-h-0 flex-1 gap-2.5"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                        gridTemplateRows: 'repeat(3, minmax(0, 1fr))',
                    }}
                >
                    {shown.map((item) => (
                        <AnswerCard key={item.id} item={item} onPin={onPin} readonly={readonly} />
                    ))}
                </motion.div>
            </AnimatePresence>

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
