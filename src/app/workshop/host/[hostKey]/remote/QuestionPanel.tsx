'use client'

import { Check, Users } from 'lucide-react'
import type { WorkshopQuestion, ActiveQuestion } from '@/types/workshop.types'
import { Button } from '@/components/ui/button'
import { STR } from '@/data/workshop-strings'
import { cn } from '@/lib/utils'

/**
 * Round 28 host control — the Q&A list on the pult. Tap a question to pop it on the
 * projector; tap «answered» to grey it so it can't be re-picked. Greyed = already asked.
 */
export default function QuestionPanel({
    questions,
    usedQuestions,
    activeQuestion,
    busy,
    onPick,
    onClose,
}: {
    questions: WorkshopQuestion[]
    usedQuestions: number[]
    activeQuestion: ActiveQuestion | null
    busy: boolean
    onPick: (n: number) => void
    onClose: (n: number) => void
}) {
    if (!questions.length) return null
    const usedSet = new Set(usedQuestions)
    return (
        <div className="mx-5 mb-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
            <p className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-primary">{STR.remote.questionsTitle}</p>
            <div className="grid gap-2 sm:grid-cols-2">
                {questions.map((q) => {
                    const used = usedSet.has(q.n)
                    const active = activeQuestion?.n === q.n
                    return (
                        <div
                            key={q.n}
                            className={cn(
                                'flex items-stretch gap-2 rounded-xl border bg-card text-left transition-all',
                                active ? 'border-primary ring-2 ring-primary/50' : 'border-border',
                                used && 'opacity-50',
                            )}
                        >
                            <button
                                type="button"
                                onClick={() => !used && !busy && onPick(q.n)}
                                disabled={used || busy}
                                className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2.5 text-left disabled:cursor-not-allowed"
                            >
                                <span
                                    className={cn(
                                        'grid size-7 shrink-0 place-items-center rounded-lg text-sm font-extrabold text-primary-foreground',
                                        used ? 'bg-muted-foreground' : 'bg-[image:var(--ws-cta)]',
                                    )}
                                >
                                    {used ? <Check size={15} strokeWidth={3} /> : q.n}
                                </span>
                                <span className={cn('min-w-0 flex-1 text-[14px] font-medium leading-snug text-card-foreground', used && 'line-through')}>
                                    {q.text}
                                </span>
                                {q.toRoom && !used && <Users size={15} className="shrink-0 text-primary" />}
                            </button>
                            {active && (
                                <Button
                                    onClick={() => onClose(q.n)}
                                    disabled={busy}
                                    variant="ghost"
                                    size="sm"
                                    className="shrink-0 self-center rounded-lg px-2 text-xs font-bold text-success hover:bg-success/10"
                                >
                                    <Check size={15} /> {STR.remote.questionDone}
                                </Button>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
