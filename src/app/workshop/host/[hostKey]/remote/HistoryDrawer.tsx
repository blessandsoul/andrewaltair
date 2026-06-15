'use client'

import { useEffect, useState } from 'react'
import { X, ListOrdered, Users } from 'lucide-react'
import NameAvatar from '@/components/workshop/NameAvatar'
import { Button } from '@/components/ui/button'
import type { RoomHistory } from '@/types/workshop.types'
import { cn } from '@/lib/utils'
import { STR } from '@/data/workshop-strings'

/**
 * Private host panel — full answer history across ALL rounds, so the host can
 * recall earlier answers by name mid-flow (e.g. on round 19 quote r1 dreams)
 * WITHOUT moving the projector. Fetched once on open.
 */
export function HistoryDrawer({ hostKey, onClose }: { hostKey: string; onClose: () => void }) {
    const [data, setData] = useState<RoomHistory | null>(null)
    const [tab, setTab] = useState<'names' | 'rounds'>('names')
    const [err, setErr] = useState(false)

    useEffect(() => {
        let alive = true
        fetch(`/api/workshop/host/${hostKey}/history`)
            .then((r) => r.json())
            .then((j) => {
                if (!alive) return
                if (j?.success) setData(j.data as RoomHistory)
                else setErr(true)
            })
            .catch(() => alive && setErr(true))
        return () => {
            alive = false
        }
    }, [hostKey])

    const tabBtn = (id: 'names' | 'rounds', icon: React.ReactNode, label: string) => (
        <button
            type="button"
            onClick={() => setTab(id)}
            className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition',
                tab === id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground',
            )}
        >
            {icon} {label}
        </button>
    )

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
            <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                <div className="flex gap-1 rounded-xl bg-muted p-1">
                    {tabBtn('names', <Users size={15} />, STR.remote.historyByName)}
                    {tabBtn('rounds', <ListOrdered size={15} />, STR.remote.historyByRound)}
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} aria-label={STR.remote.historyClose}>
                    <X size={20} />
                </Button>
            </header>
            <div className="hide-scrollbar flex-1 overflow-y-auto px-4 py-4">
                {err && <p className="py-10 text-center text-destructive">{STR.remote.historyError}</p>}
                {!data && !err && <p className="py-10 text-center text-muted-foreground">{STR.remote.historyLoading}</p>}
                {data && tab === 'names' && <NamesView data={data} />}
                {data && tab === 'rounds' && <RoundsView data={data} />}
            </div>
        </div>
    )
}

function NamesView({ data }: { data: RoomHistory }) {
    if (!data.participants.length) return <Empty />
    return (
        <div className="mx-auto max-w-2xl space-y-3">
            {data.participants.map((p) => (
                <div key={p.clientId} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                        <NameAvatar name={p.name} size={28} />
                        <span className="font-bold text-foreground">{p.name}</span>
                        <span className="text-xs text-muted-foreground">· {p.answers.length}</span>
                    </div>
                    <div className="space-y-1.5">
                        {p.answers.map((a, i) => (
                            <div key={i} className="text-sm leading-snug">
                                <span className="text-muted-foreground">{a.prompt}: </span>
                                <span className="font-medium text-card-foreground">{a.value || '—'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

function RoundsView({ data }: { data: RoomHistory }) {
    if (!data.rounds.length) return <Empty />
    return (
        <div className="mx-auto max-w-2xl space-y-3">
            {data.rounds.map((r) => {
                const answers = data.participants.flatMap((p) =>
                    p.answers.filter((a) => a.roundKey === r.key).map((a) => ({ name: p.name, value: a.value })),
                )
                return (
                    <div key={r.key} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <p className="mb-2 font-bold text-foreground">
                            {r.prompt} <span className="text-xs font-normal text-muted-foreground">· {answers.length}</span>
                        </p>
                        <div className="space-y-1">
                            {answers.map((a, i) => (
                                <div key={i} className="text-sm leading-snug">
                                    <span className="text-muted-foreground">{a.name}: </span>
                                    <span className="text-card-foreground">{a.value || '—'}</span>
                                </div>
                            ))}
                            {!answers.length && <p className="text-sm text-muted-foreground">{STR.remote.historyEmpty}</p>}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function Empty() {
    return <p className="py-10 text-center text-muted-foreground">{STR.remote.historyEmpty}</p>
}
