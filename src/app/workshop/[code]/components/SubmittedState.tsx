'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { popIn, springPop } from '@/components/workshop/motion'
import { STR } from '@/data/workshop-strings'

interface SubmittedStateProps {
    onEdit: () => void
}

export default function SubmittedState({ onEdit }: SubmittedStateProps) {
    return (
        <motion.div
            variants={popIn}
            initial="initial"
            animate="animate"
            transition={springPop}
            className="rounded-2xl bg-card border border-border shadow-sm p-8 text-center space-y-4"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...springPop, delay: 0.05 }}
                className="mx-auto w-16 h-16 rounded-full bg-success/15 border border-success/30 flex items-center justify-center"
            >
                {/* check draws itself */}
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                    <motion.path
                        d="M4 12.5 L9.5 18 L20 6.5"
                        stroke="var(--success)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.45, delay: 0.18, ease: 'easeOut' }}
                    />
                </svg>
            </motion.div>
            <p className="text-xl font-bold text-foreground">{STR.submitted.title}</p>
            <p className="text-muted-foreground text-sm">{STR.submitted.sub}</p>
            <Button onClick={onEdit} variant="link" className="text-sm">
                {STR.submitted.edit}
            </Button>
        </motion.div>
    )
}
