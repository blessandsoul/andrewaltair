'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'
import type { TextResultItem } from '@/types/workshop.types'

interface TextWallProps {
    items: TextResultItem[]
    onPin: (action: string, responseId?: string) => void
    readonly?: boolean
}

export default function TextWall({ items, onPin, readonly = false }: TextWallProps) {
    if (items.length === 0) {
        return <p className="text-center text-[#6E7186]">პასუხები ჯერ არ არის — ველოდებით...</p>
    }
    return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 *:break-inside-avoid">
            <AnimatePresence initial={false}>
                {items.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 14, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="group mb-4 rounded-2xl bg-white border border-[#0E0F1F]/8 shadow-sm p-4 relative"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs uppercase tracking-widest text-violet-600 font-semibold">
                                {item.name}
                            </p>
                            {!readonly && (
                                <button
                                    onClick={() => onPin('pinResponse', item.id)}
                                    title="დაამაგრე ეკრანზე"
                                    className="opacity-0 group-hover:opacity-100 text-[#6E7186] hover:text-amber-500 transition-opacity"
                                >
                                    <Star size={16} />
                                </button>
                            )}
                        </div>
                        <p className="text-[clamp(14px,1.4vw,20px)] leading-relaxed whitespace-pre-wrap text-[#262738]">
                            {item.textValue}
                        </p>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
