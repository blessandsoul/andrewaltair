'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, Heart, ArrowBigUp } from 'lucide-react'
import NameAvatar, { nameAccent } from '@/components/workshop/NameAvatar'
import type { ChatMessage, ChatLiveQuestion } from '@/types/workshop.types'
import { cn } from '@/lib/utils'
import { STR } from '@/data/workshop-strings'

/** Right-rail live chat wall on the projector: host-approved messages, newest at the bottom. */
export function ChatWall({ messages }: { messages: ChatMessage[] }) {
    const newestId = messages.length ? messages[messages.length - 1].id : null
    return (
        <aside className="hidden w-[360px] shrink-0 flex-col border-l border-border bg-card/75 p-5 backdrop-blur lg:flex">
            <div className="mb-4 flex items-center gap-2">
                <span className="relative flex size-2.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-secondary opacity-70" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-secondary" />
                </span>
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    {STR.chat.live} {STR.chat.tabChat}
                </span>
                <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-bold tabular-nums text-muted-foreground">
                    {messages.length}
                </span>
            </div>
            <div className="hide-scrollbar flex flex-1 flex-col justify-end gap-3 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_14%)]">
                <AnimatePresence initial={false}>
                    {messages.map((m) => {
                        const accent = nameAccent(m.name || '?')
                        return (
                            <motion.div
                                key={m.id}
                                layout
                                initial={{ opacity: 0, scale: 0.92, y: 14 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                                className={cn(
                                    'relative overflow-hidden rounded-2xl border bg-card px-4 py-3 shadow-sm',
                                    m.id === newestId ? 'border-primary/40 ring-2 ring-primary/15' : 'border-border',
                                )}
                            >
                                <span className={cn('absolute inset-y-0 left-0 w-1', accent.solid)} />
                                <div className="mb-1 flex items-center gap-2 pl-1.5">
                                    <NameAvatar name={m.name || '?'} size={26} />
                                    <span className={cn('text-sm font-bold', accent.text)}>{m.name || STR.chat.anon}</span>
                                    {m.votes > 0 && (
                                        <span className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-secondary">
                                            <Heart size={13} className="fill-secondary" /> {m.votes}
                                        </span>
                                    )}
                                </div>
                                <p className="pl-1.5 text-lg leading-snug text-card-foreground">{m.text}</p>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
        </aside>
    )
}

/** A pinned audience question as a centered takeover (dims the slide). One at a time.
 *  Shows the up-vote count and, once the host answers, the on-screen answer. */
export function ChatQuestionMoment({ question }: { question: ChatLiveQuestion }) {
    const len = question.text.length
    const size = len < 24 ? 'text-6xl' : len < 80 ? 'text-5xl' : 'text-4xl'
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-foreground/40 px-10 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.94, y: 16 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, y: 8 }}
                transition={{ type: 'spring', stiffness: 240, damping: 24 }}
                className="relative w-full max-w-5xl rounded-[36px] border border-primary/20 bg-card px-16 py-14 text-center shadow-2xl"
            >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[image:var(--ws-cta)] px-5 py-2 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-sm">
                    <HelpCircle size={18} /> {STR.chat.audienceQuestion}
                    {(question.votes ?? 0) > 0 && (
                        <span className="ml-1 inline-flex items-center gap-0.5">
                            <ArrowBigUp size={16} className="fill-white" /> {question.votes}
                        </span>
                    )}
                </div>
                <p className={cn('mx-auto max-w-4xl font-bold leading-[1.12] text-foreground', size)}>{question.text}</p>
                {question.answer && (
                    <p className="mx-auto mt-7 max-w-3xl rounded-3xl bg-success/10 px-8 py-4 text-2xl font-semibold leading-snug text-success">
                        {question.answer}
                    </p>
                )}
                {question.name && (
                    <div className="mt-8 flex items-center justify-center gap-3">
                        <NameAvatar name={question.name} size={40} />
                        <span className="text-xl font-semibold text-muted-foreground">{question.name}</span>
                    </div>
                )}
            </motion.div>
        </motion.div>
    )
}
