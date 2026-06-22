'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Monitor, EyeOff, Check, MessageSquare, HelpCircle, ArrowBigUp, Ban, Send } from 'lucide-react'
import NameAvatar from '@/components/workshop/NameAvatar'
import { useRoomPoll } from '@/hooks/useRoomPoll'
import type { ChatMessage, MessageKind, MessageStatus } from '@/types/workshop.types'
import { cn } from '@/lib/utils'
import { STR } from '@/data/workshop-strings'

/**
 * Private host moderation panel with its OWN poll (kept off the heavy host-state object).
 * Approve to the projector, answer a question on screen, mute a spammer, hide. Questions
 * sort by up-votes. A risky body (profanity/PII) is flagged. Nothing reaches the screen
 * without a tap here.
 */
export function MessageModeration({ hostKey }: { hostKey: string }) {
    const { data, refresh } = useRoomPoll<{ messages: ChatMessage[] }>(
        `/api/workshop/host/${hostKey}/messages`,
        2500,
    )
    const [tab, setTab] = useState<MessageKind>('chat')
    const [busy, setBusy] = useState(false)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [flash, setFlash] = useState(false)

    const all = data?.messages ?? []
    const newCount = (k: MessageKind): number => all.filter((m) => m.kind === k && m.status === 'new').length
    const totalNew = newCount('chat') + newCount('question')

    // attention cue: a brief flash when the new-message count rises
    const prevNew = useRef(totalNew)
    useEffect(() => {
        if (totalNew > prevNew.current) {
            setFlash(true)
            const t = window.setTimeout(() => setFlash(false), 900)
            prevNew.current = totalNew
            return () => window.clearTimeout(t)
        }
        prevNew.current = totalNew
    }, [totalNew])

    const post = useCallback(
        async (body: object): Promise<void> => {
            if (busy) return
            setBusy(true)
            try {
                await fetch(`/api/workshop/host/${hostKey}/control`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                })
                refresh()
            } finally {
                setBusy(false)
            }
        },
        [hostKey, busy, refresh],
    )

    const setStatus = (messageId: string, status: MessageStatus, answer?: string): void => {
        void post({ action: 'setMessageStatus', messageId, status, ...(answer !== undefined ? { answer } : {}) })
    }
    const mute = (clientId?: string): void => {
        if (clientId) void post({ action: 'muteParticipant', targetClientId: clientId })
    }

    // questions sort by votes desc (chat keeps the newest-first queue order)
    const items = all.filter((m) => m.kind === tab).sort((a, b) => (tab === 'question' ? b.votes - a.votes : 0))

    return (
        <div className={cn('space-y-2 px-5 pb-3 transition-colors', flash && 'bg-secondary/10')}>
            <div className="flex gap-1.5">
                <ModTab active={tab === 'chat'} onClick={() => setTab('chat')} icon={<MessageSquare size={14} />} label={STR.chat.tabChat} badge={newCount('chat')} />
                <ModTab active={tab === 'question'} onClick={() => setTab('question')} icon={<HelpCircle size={14} />} label={STR.chat.tabQuestions} badge={newCount('question')} />
            </div>
            {items.length === 0 && <p className="py-3 text-center text-sm text-muted-foreground">{STR.chat.empty}</p>}
            {items.map((m) => {
                const live = m.status === 'live'
                const done = m.status === 'done'
                return (
                    <div
                        key={m.id}
                        className={cn(
                            'rounded-xl border px-3.5 py-2.5 shadow-sm transition',
                            live
                                ? 'border-primary/50 bg-primary/5'
                                : done
                                  ? 'border-border bg-muted/40 opacity-60'
                                  : m.risky
                                    ? 'border border-l-[3px] border-l-destructive bg-destructive/5'
                                    : 'border-l-[3px] border-l-secondary border-border bg-card',
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <NameAvatar name={m.name || '?'} size={26} />
                            <span className="text-xs font-semibold text-muted-foreground">{m.name || STR.chat.anon}</span>
                            {m.kind === 'question' && m.votes > 0 && (
                                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-primary">
                                    <ArrowBigUp size={13} /> {m.votes}
                                </span>
                            )}
                            {m.risky && <span className="text-[10px] font-bold uppercase tracking-wide text-destructive">{STR.chat.flagged}</span>}
                            {live && <span className="ml-auto text-[11px] font-bold uppercase tracking-wide text-primary">{STR.chat.onScreen}</span>}
                        </div>
                        <p className={cn('mt-1 text-sm leading-snug text-card-foreground', done && 'line-through')}>{m.text}</p>
                        {m.answer && <p className="mt-1 rounded-lg bg-success/10 px-2 py-1 text-xs text-success">{m.answer}</p>}
                        {live && m.kind === 'question' && (
                            <div className="mt-2 flex gap-1.5">
                                <input
                                    value={answers[m.id] ?? ''}
                                    onChange={(e) => setAnswers((p) => ({ ...p, [m.id]: e.target.value }))}
                                    placeholder={STR.chat.answerPlaceholder}
                                    maxLength={280}
                                    className="min-h-9 flex-1 rounded-lg border border-border bg-card px-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                                />
                                <button
                                    type="button"
                                    onClick={() => setStatus(m.id, 'live', answers[m.id] ?? '')}
                                    aria-label={STR.inputs.send}
                                    className="grid size-9 shrink-0 place-items-center rounded-lg bg-[image:var(--ws-cta)] text-white"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                            {!live && !done && <ActBtn onClick={() => setStatus(m.id, 'live')} icon={<Monitor size={14} />} label={STR.chat.toScreen} primary />}
                            {live && (
                                <ActBtn
                                    onClick={() => setStatus(m.id, m.kind === 'question' ? 'done' : 'new')}
                                    icon={<Check size={14} />}
                                    label={m.kind === 'question' ? STR.chat.answered : STR.chat.offScreen}
                                />
                            )}
                            <ActBtn onClick={() => setStatus(m.id, 'hidden')} icon={<EyeOff size={14} />} label={STR.chat.hide} />
                            {m.clientId && <ActBtn onClick={() => mute(m.clientId)} icon={<Ban size={14} />} label={STR.chat.mute} />}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function ModTab({ active, onClick, icon, label, badge }: { active: boolean; onClick: () => void; icon: ReactNode; label: string; badge: number }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition',
                active ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground',
            )}
        >
            {icon} {label}
            {badge > 0 && <span className="rounded-full bg-secondary px-1.5 text-[11px] font-bold text-white">{badge}</span>}
        </button>
    )
}

function ActBtn({ onClick, icon, label, primary }: { onClick: () => void; icon: ReactNode; label: string; primary?: boolean }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                primary
                    ? 'bg-[image:var(--ws-cta)] text-white shadow-sm'
                    : 'border border-border bg-card text-muted-foreground hover:text-foreground',
            )}
        >
            {icon} {label}
        </button>
    )
}
