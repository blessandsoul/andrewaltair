'use client'

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

/** Multi-field answers («label: value» lines) render as structured rows, not a text blob. */
function AnswerBody({ text }: { text: string }) {
    const rows = parseStructuredAnswer(text)
    if (!rows) {
        return (
            <p className="whitespace-pre-wrap text-[clamp(15px,1.45vw,21px)] leading-relaxed text-card-foreground">{text}</p>
        )
    }
    return (
        <div className="divide-y divide-border">
            {rows.map((r, i) => (
                <div key={i} className="py-2 first:pt-0 last:pb-0">
                    <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{r.label}</p>
                    <p className="text-[clamp(15px,1.4vw,20px)] font-semibold leading-snug text-card-foreground">{r.value}</p>
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
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={springPop}
            className="group glass relative mb-5 overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/15"
        >
            {/* accent stripe in the participant's color */}
            <span className={cn('absolute inset-y-0 left-0 w-1.5', accent.solid)} />

            {/* oversized decorative quote glyph */}
            <span aria-hidden className="absolute -top-3 right-3 select-none text-[72px] font-bold leading-none text-foreground/5">
                „
            </span>

            <div className="py-4 pl-5 pr-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="inline-flex min-w-0 items-center gap-2.5">
                        <NameAvatar name={item.name} size={32} />
                        <span className={cn('truncate rounded-full px-3 py-1 text-[13px] font-bold', accent.soft, accent.text)}>
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
                            className="shrink-0 text-muted-foreground opacity-0 transition-all hover:text-warning group-hover:opacity-100"
                        >
                            <Star size={17} />
                        </Button>
                    )}
                </div>
                <AnswerBody text={item.textValue} />
            </div>
        </motion.div>
    )
}

export default function TextWall({ items, onPin, readonly = false }: TextWallProps) {
    if (items.length === 0) {
        return <p className="text-center text-muted-foreground">{STR.results.noAnswersWaiting}</p>
    }
    return (
        <div className="columns-1 gap-5 *:break-inside-avoid md:columns-2 lg:columns-3">
            <AnimatePresence initial={false}>
                {items.map((item) => (
                    <AnswerCard key={item.id} item={item} onPin={onPin} readonly={readonly} />
                ))}
            </AnimatePresence>
        </div>
    )
}
