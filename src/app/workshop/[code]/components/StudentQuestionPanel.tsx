'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Hand, MonitorPlay, Users } from 'lucide-react'
import type { WorkshopQuestion, ActiveQuestion } from '@/types/workshop.types'
import { STR } from '@/data/workshop-strings'
import { cn } from '@/lib/utils'

/**
 * Round 28 on the student phone. A student the host «spun up» (canPick) gets the live
 * question list to tap — their pick pops on the projector. Everyone else watches the screen.
 */
export default function StudentQuestionPanel({
    code,
    clientId,
    title,
    questions,
    usedQuestions,
    activeQuestion,
    canPick,
}: {
    code: string
    clientId: string
    title: string
    questions: WorkshopQuestion[]
    usedQuestions: number[]
    activeQuestion: ActiveQuestion | null
    canPick: boolean
}) {
    const [busy, setBusy] = useState(false)
    const usedSet = new Set(usedQuestions)
    const activeText = activeQuestion ? questions.find((q) => q.n === activeQuestion.n)?.text : null

    const pick = async (n: number) => {
        if (busy) return
        setBusy(true)
        try {
            await fetch(`/api/workshop/rooms/${code}/pick-question`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientId, n }),
            })
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="space-y-5">
            <h2 className="text-center text-2xl font-bold leading-snug text-foreground">{title}</h2>

            {canPick ? (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-[image:var(--ws-cta)] px-4 py-3 text-[15px] font-bold text-primary-foreground shadow-md"
                    >
                        <Hand size={19} /> {STR.student.questionPick}
                    </motion.div>
                    <div className="space-y-2.5">
                        {questions.map((q) => {
                            const used = usedSet.has(q.n)
                            return (
                                <motion.button
                                    key={q.n}
                                    whileTap={{ scale: used ? 1 : 0.98 }}
                                    onClick={() => !used && pick(q.n)}
                                    disabled={used || busy}
                                    className={cn(
                                        'flex w-full items-center gap-3 rounded-2xl border-2 bg-card px-4 py-3 text-left shadow-sm',
                                        used ? 'border-border opacity-40' : 'border-border hover:border-primary/40 active:bg-primary/5',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'grid size-8 shrink-0 place-items-center rounded-lg text-sm font-extrabold text-primary-foreground',
                                            used ? 'bg-muted-foreground' : 'bg-[image:var(--ws-cta)]',
                                        )}
                                    >
                                        {q.n}
                                    </span>
                                    <span className={cn('min-w-0 flex-1 text-[15px] font-semibold leading-snug text-foreground', used && 'line-through')}>
                                        {q.text}
                                    </span>
                                    {q.toRoom && !used && <Users size={16} className="shrink-0 text-primary" />}
                                </motion.button>
                            )
                        })}
                    </div>
                </>
            ) : activeText ? (
                <div className="space-y-3 rounded-2xl border-2 border-primary/30 bg-primary/5 px-5 py-6 text-center">
                    <p className="text-xl font-bold leading-snug text-foreground">{activeText}</p>
                    <p className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground">
                        <MonitorPlay size={15} /> {STR.student.questionWatch}
                    </p>
                </div>
            ) : (
                <p className="flex items-center justify-center gap-2 py-6 text-center text-muted-foreground">
                    <MonitorPlay size={18} /> {STR.student.questionWatch}
                </p>
            )}
        </div>
    )
}
