'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'
import type { TextResultItem } from '@/types/workshop.types'
import NameAvatar, { nameAccent } from '@/components/workshop/NameAvatar'
import { STR } from '@/data/workshop-strings'

interface TextWallProps {
    items: TextResultItem[]
    onPin: (action: string, responseId?: string) => void
    readonly?: boolean
}

export default function TextWall({ items, onPin, readonly = false }: TextWallProps) {
    if (items.length === 0) {
        return <p className="text-center text-[#6E7186]">{STR.results.noAnswersWaiting}</p>
    }
    return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 *:break-inside-avoid">
            <AnimatePresence initial={false}>
                {items.map((item) => {
                    const accent = nameAccent(item.name)
                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 18, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                            className="group relative mb-5 rounded-2xl bg-white overflow-hidden
                                       border border-[#0E0F1F]/6
                                       shadow-[0_1px_2px_rgba(14,15,31,0.04),0_8px_24px_rgba(14,15,31,0.07)]
                                       hover:shadow-[0_2px_4px_rgba(14,15,31,0.05),0_16px_40px_rgba(124,58,237,0.16)]
                                       hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* accent stripe in the participant's color */}
                            <span className={`absolute left-0 top-0 bottom-0 w-1.5 ${accent.solid}`} />

                            {/* oversized decorative quote glyph */}
                            <span
                                aria-hidden
                                className="absolute -top-3 right-3 text-[72px] leading-none font-bold text-[#0E0F1F]/4.5 select-none"
                            >
                                „
                            </span>

                            <div className="pl-5 pr-4 py-4">
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <span className="inline-flex items-center gap-2.5 min-w-0">
                                        <NameAvatar name={item.name} size={32} />
                                        <span
                                            className={`rounded-full px-3 py-1 text-[13px] font-bold truncate ${accent.soft} ${accent.text}`}
                                        >
                                            {item.name}
                                        </span>
                                    </span>
                                    {!readonly && (
                                        <button
                                            onClick={() => onPin('pinResponse', item.id)}
                                            title={STR.results.pinTitle}
                                            className="opacity-0 group-hover:opacity-100 text-[#6E7186] hover:text-amber-500
                                                       hover:bg-amber-50 rounded-lg p-1.5 transition-all shrink-0"
                                        >
                                            <Star size={17} />
                                        </button>
                                    )}
                                </div>
                                <p className="text-[clamp(15px,1.45vw,21px)] leading-relaxed whitespace-pre-wrap text-[#1c1d2e]">
                                    {item.textValue}
                                </p>
                            </div>
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </div>
    )
}
