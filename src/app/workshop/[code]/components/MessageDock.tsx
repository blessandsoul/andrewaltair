'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Send, Check, MessageCircle, HelpCircle, Heart, ArrowBigUp } from 'lucide-react'
import NameAvatar from '@/components/workshop/NameAvatar'
import type { ChatMessage } from '@/types/workshop.types'
import { cn } from '@/lib/utils'
import { STR } from '@/data/workshop-strings'

const MAX = 280

/**
 * Phone chat: a read-only feed of what is on the projector (with one-tap like/upvote),
 * plus a composer (chat / question, optional anonymous). The host curates what reaches
 * the screen. Tabs reflect the per-room enabled flags.
 */
export function MessageDock({
    code,
    clientId,
    liveMessages = [],
    chatEnabled = true,
    questionsEnabled = true,
}: {
    code: string
    clientId: string
    liveMessages?: ChatMessage[]
    chatEnabled?: boolean
    questionsEnabled?: boolean
}) {
    const [kind, setKind] = useState<'chat' | 'question'>(chatEnabled ? 'chat' : 'question')
    const [text, setText] = useState('')
    const [busy, setBusy] = useState(false)
    const [justSent, setJustSent] = useState(false)
    const [cooling, setCooling] = useState(false)
    const [anon, setAnon] = useState(false)
    const [voted, setVoted] = useState<Set<string>>(new Set())

    useEffect(() => {
        if (kind === 'chat' && !chatEnabled && questionsEnabled) setKind('question')
        if (kind === 'question' && !questionsEnabled && chatEnabled) setKind('chat')
    }, [kind, chatEnabled, questionsEnabled])

    if (!chatEnabled && !questionsEnabled) return null

    const send = async (): Promise<void> => {
        const t = text.trim()
        if (!t || busy) return
        setBusy(true)
        try {
            const res = await fetch(`/api/workshop/rooms/${code}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientId, kind, text: t.slice(0, MAX), anon }),
            })
            if (res.status === 429) {
                setCooling(true)
                window.setTimeout(() => setCooling(false), 2500)
            } else if (res.ok) {
                if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(12)
                setText('')
                setJustSent(true)
                window.setTimeout(() => setJustSent(false), 1300)
            }
        } catch {
            // network hiccup, keep the text so they can retry
        } finally {
            setBusy(false)
        }
    }

    const vote = (id: string): void => {
        if (voted.has(id)) return
        setVoted((p) => new Set(p).add(id))
        fetch(`/api/workshop/rooms/${code}/messages/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId, messageId: id }),
        }).catch(() => {})
    }

    const remaining = MAX - text.length
    const canSend = !!text.trim() && !busy
    const feed = liveMessages.slice(-4)

    return (
        <div className="mt-6 w-full">
            {feed.length > 0 && (
                <div className="mb-3">
                    <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                        <span className="size-1.5 rounded-full bg-secondary" /> {STR.chat.onScreenNow}
                    </p>
                    <div className="space-y-1.5">
                        {feed.map((m) => {
                            const isQ = m.kind === 'question'
                            const hasVoted = voted.has(m.id)
                            return (
                                <div key={m.id} className="flex items-start gap-2 rounded-xl bg-muted/60 px-3 py-2">
                                    <NameAvatar name={m.name || '?'} size={20} />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] font-bold text-muted-foreground">{m.name || STR.chat.anon}</p>
                                        <p className="text-sm leading-snug text-card-foreground">{m.text}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => vote(m.id)}
                                        disabled={hasVoted}
                                        className={cn(
                                            'inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-1 text-xs font-bold transition',
                                            hasVoted ? 'text-secondary' : 'text-muted-foreground active:scale-110',
                                        )}
                                    >
                                        {isQ ? (
                                            <ArrowBigUp size={15} className={cn(hasVoted && 'fill-secondary')} />
                                        ) : (
                                            <Heart size={14} className={cn(hasVoted && 'fill-secondary')} />
                                        )}
                                        {m.votes > 0 ? m.votes : ''}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
            <div className="mb-2 flex items-center gap-2">
                <div className="inline-flex rounded-full bg-muted p-0.5">
                    {chatEnabled && <Seg active={kind === 'chat'} onClick={() => setKind('chat')} icon={<MessageCircle size={14} />} label={STR.chat.chatTab} />}
                    {questionsEnabled && <Seg active={kind === 'question'} onClick={() => setKind('question')} icon={<HelpCircle size={14} />} label={STR.chat.questionTab} />}
                </div>
                <button
                    type="button"
                    onClick={() => setAnon((a) => !a)}
                    aria-pressed={anon}
                    className={cn(
                        'ml-auto rounded-full px-3 py-1.5 text-xs font-semibold transition',
                        anon ? 'bg-primary/15 text-primary' : 'text-muted-foreground',
                    )}
                >
                    {STR.chat.askAnon}
                </button>
            </div>
            <div className="flex items-end gap-2">
                <div className="relative flex-1">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                void send()
                            }
                        }}
                        rows={1}
                        maxLength={MAX}
                        placeholder={kind === 'chat' ? STR.chat.placeholderChat : STR.chat.placeholderQuestion}
                        className="min-h-11 w-full resize-none rounded-2xl border border-border bg-card px-4 py-2.5 pr-9 text-[15px] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    />
                    {remaining <= 40 && (
                        <span
                            className={cn(
                                'pointer-events-none absolute bottom-2 right-3 text-[11px] tabular-nums',
                                remaining <= 0 ? 'text-destructive' : 'text-muted-foreground',
                            )}
                        >
                            {remaining}
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => void send()}
                    disabled={!canSend}
                    aria-label={STR.inputs.send}
                    className={cn(
                        'grid size-11 shrink-0 place-items-center rounded-2xl text-white shadow-sm transition-colors duration-200',
                        justSent ? 'bg-success' : 'bg-[image:var(--ws-cta)] disabled:opacity-40',
                    )}
                >
                    {justSent ? <Check size={18} /> : <Send size={18} />}
                </button>
            </div>
            {cooling && <p className="mt-1.5 text-center text-xs font-medium text-warning">{STR.chat.slowDown}</p>}
        </div>
    )
}

function Seg({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all',
                active ? 'bg-[image:var(--ws-cta)] text-white shadow-sm' : 'text-muted-foreground',
            )}
        >
            {icon} {label}
        </button>
    )
}
