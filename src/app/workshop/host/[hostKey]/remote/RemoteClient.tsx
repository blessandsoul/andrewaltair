'use client'

import { useCallback, useEffect, useState } from 'react'
import { PenLine, Users, StickyNote, ChevronDown, ChevronRight, Star, OctagonX, MonitorPlay } from 'lucide-react'
import { useRoomPoll } from '@/hooks/useRoomPoll'
import type { HostState } from '@/types/workshop.types'
import CountdownRing from '@/components/workshop/CountdownRing'
import NameAvatar from '@/components/workshop/NameAvatar'
import PhaseStepper from '@/components/workshop/PhaseStepper'
import HostControls, { primaryActionFor } from '../components/HostControls'

/**
 * HOST REMOTE — control surface (laptop second window or the host's phone).
 * The projected display lives at /workshop/host/[hostKey] and has no controls.
 */
export default function RemoteClient({ hostKey }: { hostKey: string }) {
    const { data: state, error, isLoading, connectionLost } = useRoomPoll<HostState>(`/api/workshop/host/${hostKey}`)
    const [actionBusy, setActionBusy] = useState(false)
    const [notesOpen, setNotesOpen] = useState(true)
    const [stopConfirm, setStopConfirm] = useState(false)

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

    // Hotkeys: Space=primary, R=reveal, ArrowRight=next, E=end
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
            <main className="min-h-dvh flex items-center justify-center">
                <p className="text-2xl">არასწორი ბმული</p>
            </main>
        )
    }
    if (isLoading || !state) {
        return (
            <main className="min-h-dvh flex items-center justify-center">
                <p className="text-2xl text-[#6E7186]">იტვირთება...</p>
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
    const textItems = state.results?.type === 'text' ? state.results.items.slice(0, 8) : []

    return (
        <main className="min-h-dvh flex flex-col max-w-3xl mx-auto">
            {connectionLost && (
                <div className="fixed top-0 inset-x-0 z-50 bg-amber-400 text-[#0E0F1F] text-center text-sm font-semibold py-2">
                    კავშირი წყდება...
                </div>
            )}

            {/* Status row */}
            <header className="px-5 pt-5 pb-3 space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-[#6E7186] font-semibold">პულტი</p>
                        <h1 className="text-lg font-bold leading-tight">{state.title}</h1>
                    </div>
                    <span className="text-xl font-bold tracking-[0.2em] bg-white border border-[#0E0F1F]/10 shadow-sm rounded-xl px-3 py-1">
                        {state.code}
                    </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${
                            state.status === 'live'
                                ? 'border-red-300 bg-red-50 text-red-600'
                                : state.status === 'ended'
                                ? 'border-[#0E0F1F]/15 text-[#6E7186]'
                                : 'border-emerald-300 bg-emerald-50 text-emerald-600'
                        }`}
                    >
                        {state.status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                        {state.status === 'live' ? 'LIVE' : state.status === 'ended' ? 'ENDED' : 'LOBBY'}
                    </span>
                    <span className="text-[#6E7186]">
                        {state.currentRoundIndex >= 0
                            ? `რაუნდი ${state.currentRoundIndex + 1}/${state.roundsTotal}`
                            : 'ლობი'}
                    </span>
                    {answering && (
                        <span className="inline-flex items-center gap-1.5 tabular-nums">
                            <PenLine size={15} className="text-violet-600" />
                            <b className="text-violet-600">{state.responsesCount}</b>
                            <span className="text-[#6E7186]">/{state.participantCount}</span>
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-[#6E7186]">
                        <Users size={15} /> {state.participantCount}
                    </span>
                    {showRing && (
                        <CountdownRing
                            phaseStartedAt={state.round!.phaseStartedAt!}
                            durationSec={state.round!.durationSec!}
                            serverNow={state.serverNow}
                            size={40}
                        />
                    )}
                </div>
                {state.round && (
                    <div className="space-y-2">
                        <PhaseStepper type={state.round.type} phase={state.round.phase} />
                        <p className="text-sm text-[#262738] bg-white border border-[#0E0F1F]/8 rounded-xl px-4 py-2.5 shadow-sm">
                            {state.round.prompt}
                        </p>
                    </div>
                )}
            </header>

            {/* Host notes */}
            {state.round?.hostNotes && state.status !== 'ended' && (
                <div className="mx-5 mb-3 rounded-xl bg-violet-50 border border-violet-200 px-4 py-2.5">
                    <button
                        onClick={() => setNotesOpen((v) => !v)}
                        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-violet-700 font-semibold"
                    >
                        <StickyNote size={13} /> ჩემი ნოუთები{' '}
                        {notesOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    </button>
                    {notesOpen && (
                        <p className="text-sm text-[#262738] mt-1.5 leading-relaxed">{state.round.hostNotes}</p>
                    )}
                </div>
            )}

            {/* Controls */}
            {state.status !== 'ended' ? (
                <>
                    <HostControls
                        round={state.round}
                        inLobby={inLobby}
                        busy={actionBusy}
                        isLastRound={state.currentRoundIndex >= state.roundsTotal - 1}
                        responsesCount={state.responsesCount}
                        participantCount={state.participantCount}
                        onAction={act}
                    />

                    {/* Quick pin list for text rounds */}
                    {textItems.length > 0 && (
                        <div className="px-5 pb-3 space-y-2">
                            <p className="text-xs uppercase tracking-widest text-[#6E7186] font-semibold">
                                პასუხები — დააჭირეთ ვარსკვლავს ეკრანზე გასატანად
                            </p>
                            {textItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-3 rounded-xl bg-white border border-[#0E0F1F]/8 shadow-sm px-3.5 py-2.5"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <NameAvatar name={item.name} size={30} />
                                        <div className="min-w-0">
                                            <p className="text-xs text-[#6E7186] font-semibold">{item.name}</p>
                                            <p className="text-sm text-[#262738] truncate">{item.textValue}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => act('pinResponse', item.id)}
                                        className="shrink-0 text-[#6E7186] hover:text-amber-500 transition-colors p-1.5 rounded-lg hover:bg-amber-50"
                                        title="ეკრანზე გატანა"
                                    >
                                        <Star size={18} />
                                    </button>
                                </div>
                            ))}
                            {state.round?.pinned && (
                                <button
                                    onClick={() => act('unpin')}
                                    className="text-sm text-violet-600 underline underline-offset-4"
                                >
                                    დამაგრების მოხსნა
                                </button>
                            )}
                        </div>
                    )}

                    {/* STOP */}
                    <div className="mt-auto px-5 pb-6 pt-3 space-y-3">
                        <a
                            href={`/workshop/host/${hostKey}`}
                            target="_blank"
                            className="inline-flex items-center gap-2 text-sm text-[#6E7186] hover:text-violet-600 transition-colors"
                        >
                            <MonitorPlay size={15} /> ეკრანის გახსნა (გასაშეარებლად)
                        </a>
                        {stopConfirm ? (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        act('endRoom')
                                        setStopConfirm(false)
                                    }}
                                    disabled={actionBusy}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 hover:bg-red-500 text-white py-4 text-lg font-bold transition-colors disabled:opacity-40"
                                >
                                    <OctagonX size={20} /> დიახ, დასრულება
                                </button>
                                <button
                                    onClick={() => setStopConfirm(false)}
                                    className="rounded-2xl border border-[#0E0F1F]/15 px-6 font-semibold text-[#6E7186]"
                                >
                                    არა
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setStopConfirm(true)}
                                disabled={actionBusy}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-red-300 bg-red-50 text-red-600 hover:bg-red-100 py-4 text-lg font-bold transition-colors disabled:opacity-40"
                            >
                                <OctagonX size={20} /> სემინარის დასრულება
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-2xl text-[#6E7186]">სემინარი დასრულდა</p>
                </div>
            )}
        </main>
    )
}
