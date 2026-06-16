'use client'

import { motion } from 'framer-motion'
import { PenLine } from 'lucide-react'
import type { WriteIn } from '@/types/workshop.types'
import NameAvatar, { nameAccent } from '@/components/workshop/NameAvatar'
import { STR } from '@/data/workshop-strings'
import { cn } from '@/lib/utils'

/** Student write-in answers (their own text, not a preset option) shown under the option bars. */
export default function WriteInList({ items }: { items?: WriteIn[] }) {
    if (!items?.length) return null
    return (
        <div className="mx-auto w-full max-w-3xl">
            <p className="mb-2 flex items-center justify-center gap-1.5 text-sm font-bold uppercase tracking-wider text-primary">
                <PenLine size={15} /> {STR.results.writeIns}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
                {items.slice(0, 20).map((w, i) => {
                    const accent = nameAccent(w.name)
                    return (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm"
                        >
                            <NameAvatar name={w.name} size={18} />
                            <span className={cn('text-xs font-bold', accent.text)}>{w.name}</span>
                            <span className="text-[15px] font-medium text-card-foreground">{w.text}</span>
                        </motion.span>
                    )
                })}
            </div>
        </div>
    )
}
