'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { PenLine, Users, StickyNote, ChevronDown, ChevronRight, PartyPopper } from 'lucide-react'
import { useRoomPoll } from '@/hooks/useRoomPoll'
import type { HostState } from '@/types/workshop.types'
import CountdownRing from '@/components/workshop/CountdownRing'
import HostControls, { primaryActionFor } from './components/HostControls'
import ResultsBoard from './components/ResultsBoard'

export default function HostClient({ hostKey }: { hostKey: string }) {
    const { data: state, error, isLoading, connectionLost } = useRoomPoll<HostState>(`/api/workshop/host/${hostKey}`)
    const [qr, setQr] = useState<{ qrDataUrl: string; joinUrl: string } | null>(null)
    const [actionBusy, setActionBusy] = useState(false)
    const [notesOpen, setNotesOpen] = useState(true)
    const prevPhaseRef = useRef<string | null>(null)

    // QR fetched once on mount
    useEffect(() => {
        fetch(`/api/workshop/host/${hostKey}?qr=1`, { cache: 'no-store' })
            .then((r) => r.json())
            .then((j) => {
                if (j.success && j.data.qrDataUrl) {
                    setQr({ qrDataUrl: j.data.qrDataUrl, joinUrl: j.data.joinUrl })
                }
            })
            .catch(() => {})
    }, [hostKey])

    const act = useCallback(
        async (action: string, responseId?: string) => {
            if (actionBusy) return
            setActionBusy(true)
            try {
                await fetch(`/api/workshop/host/${hostKey}/control`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action, ...(responseId ? { responseId } : {}) }),
                })
            } finally {
                setActionBusy(false)
            }
        },
        [hostKey, actionBusy]
    )

    // Quiz confetti on reveal
    useEffect(() => {
        const phase = state?.round?.phase ?? null
        if (
            phase === 'revealed' &&
            prevPhaseRef.current !== 'revealed' &&
            (state?.round?.type === 'quiz' || state?.round?.type === 'choice_revote')
        ) {
            import('canvas-confetti').then((m) => {
                m.default({ particleCount: 140, spread: 80, origin: { y: 0.6 } })
            })
        }
        prevPhaseRef.current = phase
    }, [state?.round?.phase, state?.round?.type])

    // Host hotkeys: Space=primary, R=reveal, ArrowRight=next, E=end
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
            if (!state || state.status === 'ended') return
            const inLobby = state.status === 'lobby' || state.currentRoundIndex < 0
            if (e.code === 'Space') {
                e.preventDefault()
                const primary = primaryActionFor(state.round, inLobby, state.currentRoundIndex >= state.roundsTotal - 1)
                if (primary) act(primary)
            } else if (e.key === 'r' || e.key === 'R') {
                if (state.round && state.round.phase !== 'revealed') act('reveal')
            } else if (e.key === 'ArrowRight') {
                act('nextRound')
            } else if (e.key === 'e' || e.key === 'E') {
                act('endRoom')
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [state, act])

    if (error === 403) {
        return (
            <main className="min-h-dvh bg-[#0a0a12] text-white flex items-center justify-center">
                <p className="text-2xl">არასწორი ბმული</p>
            </main>
        )
    }
    if (isLoading || !state) {
        return (
            <main className="min-h-dvh bg-[#0a0a12] text-white flex items-center justify-center">
                <p className="text-2xl text-white/50">იტვირთება...</p>
            </main>
        )
    }

    const inLobby = state.status === 'lobby' || (state.currentRoundIndex < 0 && state.status !== 'ended')
    const showRing =
        state.round &&
        (state.round.phase === 'open' || state.round.phase === 'revote') &&
        !!state.round.durationSec &&
        !!state.round.phaseStartedAt
    const answering = state.round && (state.round.phase === 'open' || state.round.phase === 'revote')

    return (
        <main className="min-h-dvh bg-[#0a0a12] text-white flex flex-col">
            {connectionLost && (
                <div className="fixed top-0 inset-x-0 z-50 bg-amber-500/90 text-black text-center text-sm font-semibold py-2">
                    კავშირი წყდება — ვცდილობთ აღდგენას...
                </div>
            )}

            {/* Header */}
            <header className="flex items-center justify-between px-8 py-4 border-b border-white/10">
                <div className="flex items-baseline gap-4">
                    <h1 className="text-xl font-bold">{state.title}</h1>
                    <span className="text-white/40 text-sm">
                        {state.currentRoundIndex >= 0
                            ? `რაუნდი ${state.currentRoundIndex + 1} / ${state.roundsTotal}`
                            : 'ლობი'}
                    </span>
                </div>
                <div className="flex items-center gap-5">
                    {answering && (
                        <span className="inline-flex items-center gap-2 font-mono text-lg">
                            <PenLine size={18} className="text-violet-400" />
                            <b className="text-violet-400">{state.responsesCount}</b>
                            <span className="text-white/40">/{state.participantCount}</span>
                        </span>
                    )}
                    {showRing && (
                        <CountdownRing
                            phaseStartedAt={state.round!.phaseStartedAt!}
                            durationSec={state.round!.durationSec!}
                            serverNow={state.serverNow}
                            size={48}
                        />
                    )}
                    <span className="inline-flex items-center gap-1.5 text-white/60">
                        <Users size={18} /> {state.participantCount}
                    </span>
                    <span className="font-mono text-2xl font-bold tracking-[0.2em] bg-white/5 border border-white/10 rounded-xl px-4 py-1.5">
                        {state.code}
                    </span>
                    <span
                        className={`inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                            state.status === 'live'
                                ? 'border-red-500/50 text-red-400'
                                : state.status === 'ended'
                                ? 'border-white/20 text-white/40'
                                : 'border-emerald-500/50 text-emerald-400'
                        }`}
                    >
                        {state.status === 'live' && (
                            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                        )}
                        {state.status === 'live' ? 'LIVE' : state.status === 'ended' ? 'ENDED' : 'LOBBY'}
                    </span>
                </div>
            </header>

            {/* Host notes (host-only strip, never part of the projected content area) */}
            {state.round?.hostNotes && state.status !== 'ended' && (
                <div className="px-8 py-2 border-b border-white/5 bg-violet-950/20">
                    <button
                        onClick={() => setNotesOpen((v) => !v)}
                        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-violet-400/80"
                    >
                        <StickyNote size={14} /> ჩემი ნოუთები{' '}
                        {notesOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    {notesOpen && (
                        <p className="text-sm text-white/60 mt-1 leading-relaxed">{state.round.hostNotes}</p>
                    )}
                </div>
            )}

            {/* Main area */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
                {state.status === 'ended' ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                        <PartyPopper size={36} className="text-violet-400" />
                        <p className="text-3xl text-white/60">სემინარი დასრულდა</p>
                    </div>
                ) : inLobby ? (
                    <LobbyView qr={qr} code={state.code} roster={state.roster.map((r) => r.name)} />
                ) : (
                    <ResultsBoard round={state.round} results={state.results} onPin={act} />
                )}
            </div>

            {/* Controls */}
            {state.status !== 'ended' && (
                <HostControls
                    round={state.round}
                    inLobby={inLobby}
                    busy={actionBusy}
                    isLastRound={state.currentRoundIndex >= state.roundsTotal - 1}
                    responsesCount={state.responsesCount}
                    participantCount={state.participantCount}
                    onAction={act}
                />
            )}
        </main>
    )
}

function LobbyView({
    qr,
    code,
    roster,
}: {
    qr: { qrDataUrl: string; joinUrl: string } | null
    code: string
    roster: string[]
}) {
    return (
        <div className="h-full flex flex-col lg:flex-row items-center justify-center gap-12">
            <div className="text-center space-y-4">
                {qr ? (
                    <img
                        src={qr.qrDataUrl}
                        alt={`QR · ${code}`}
                        className="w-72 h-72 rounded-2xl bg-white p-3 mx-auto"
                    />
                ) : (
                    <div className="w-72 h-72 rounded-2xl bg-white/5 border border-white/10 mx-auto" />
                )}
                <p className="text-white/60 text-lg">დაასკანერეთ ტელეფონით</p>
                {qr && <p className="font-mono text-violet-400">{qr.joinUrl}</p>}
            </div>
            <div className="max-w-md w-full">
                <p className="text-sm font-mono uppercase tracking-widest text-white/40 mb-3">
                    შემოვიდა · {roster.length}
                </p>
                <div className="flex flex-wrap gap-2">
                    {roster.map((name, i) => (
                        <span
                            key={`${name}-${i}`}
                            className="rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-sm"
                        >
                            {name}
                        </span>
                    ))}
                    {roster.length === 0 && <p className="text-white/30">ველოდებით...</p>}
                </div>
            </div>
        </div>
    )
}
