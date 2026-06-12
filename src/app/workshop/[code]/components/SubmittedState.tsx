'use client'

import { motion } from 'framer-motion'
import { STR } from '@/data/workshop-strings'

interface SubmittedStateProps {
    onEdit: () => void
}

export default function SubmittedState({ onEdit }: SubmittedStateProps) {
    return (
        <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="rounded-2xl bg-white border border-[#0E0F1F]/8 shadow-sm p-8 text-center space-y-4"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.05 }}
                className="mx-auto w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center"
            >
                {/* check draws itself */}
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                    <motion.path
                        d="M4 12.5 L9.5 18 L20 6.5"
                        stroke="#059669"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.45, delay: 0.18, ease: 'easeOut' }}
                    />
                </svg>
            </motion.div>
            <p className="text-xl font-bold">{STR.submitted.title}</p>
            <p className="text-[#6E7186] text-sm">{STR.submitted.sub}</p>
            <button
                onClick={onEdit}
                className="text-violet-600 underline underline-offset-4 text-sm active:text-violet-500"
            >
                {STR.submitted.edit}
            </button>
        </motion.div>
    )
}
