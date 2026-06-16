'use client'

import { useCallback, useEffect, useState } from 'react'
import {
    PenLine,
    Users,
    ScrollText,
    ChevronDown,
    ChevronRight,
    OctagonX,
    MonitorPlay,
    History as HistoryIcon,
} from 'lucide-react'
import { useRoomPoll } from '@/hooks/useRoomPoll'
import type { HostState } from '@/types/workshop.types'
import CountdownRing from '@/components/workshop/CountdownRing'
import PhaseStepper from '@/components/workshop/PhaseStepper'
import { ReconnectBanner } from '@/components/workshop/ReconnectBanner'
import { Button } from '@/components/ui/button'
import HostControls, { primaryActionFor } from '../components/HostControls'
import QuestionPanel from './QuestionPanel'
import { ScriptBody } from './ScriptBody'
import { Roster } from './Roster'
import { PinList } from './PinList'
import { StatusPill } from './StatusPill'
import { HistoryDrawer } from './HistoryDrawer'
import { STR } from '@/data/workshop-strings'

/**
 * HOST REMOTE — control surface (laptop second window or the host's phone).
 * The projected display lives at /workshop/host/[hostKey] and has no controls.
 */
export default function RemoteClient({ hostKey }: { hostKey: string }) {
    const { data: state, error, isLoading, connectionLost, refresh } = useRoomPoll<HostState>(`/api/workshop/host/${hostKey}`)
    const [actionBusy, setActionBusy] = useState(false)
    const [notesOpen, setNotesOpen] = useState(true)
    const [stopConfirm, setStopConfirm] = useState(false)
    const [historyOpen, setHistoryOpen] = useState(false)

    const act = useCallback(
        async (action: string, responseId?: string, targetClientId?: string, count?: number) => {
            if (actionBusy) return
            setActionBusy(true)
            try {
                await fetch(`/api/workshop/host/${hostKey}/control`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action,
                        ...(responseId ? { responseId } : {}),
                        ...(targetClientId ? { targetClientId } : {}),
                        ...(count ? { count } : {}),
                    }),
                })
                refresh() // reflect the change immediately instead of waiting for the next ~2s poll
            } finally {
                setActionBusy(false)
            }
        },
        [hostKey, actionBusy, refresh]
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
            } else if (e.key === 'ArrowLeft') {
                if (state.currentRoundIndex > 0) act('prevRound')
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
                <p className="text-2xl">{STR.display.badLink}</p>
            </main>
        )
    }
    if (isLoading || !state) {
        return (
            <main className="min-h-dvh flex items-center justify-center">
                <p className="text-2xl text-muted-foreground">{STR.common.loading}</p>
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
            {connectionLost && <ReconnectBanner />}
            {historyOpen && <HistoryDrawer hostKey={hostKey} onClose={() => setHistoryOpen(false)} />}

            {/* Status row */}
            <header className="px-5 pt-5 pb-3 space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{STR.remote.title}</p>
                        <h1 className="text-lg font-bold leading-tight">{state.title}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setHistoryOpen(true)}
                            title={STR.remote.history}
                            aria-label={STR.remote.history}
                            className="min-h-11 min-w-11 shrink-0 text-muted-foreground hover:text-primary"
                        >
                            <HistoryIcon size={18} />
                        </Button>
                        <span className="rounded-xl border border-border bg-card px-3 py-1 text-xl font-bold tracking-[0.2em] shadow-sm">
                            {state.code}
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <StatusPill status={state.status} />
                    <span className="text-muted-foreground">
                        {state.currentRoundIndex >= 0
                            ? STR.display.roundOf(state.currentRoundIndex + 1, state.roundsTotal)
                            : STR.display.lobby}
                    </span>
                    {answering && (
                        <span className="inline-flex items-center gap-1.5 tabular-nums">
                            <PenLine size={15} className="text-primary" />
                            <b className="text-primary">{state.responsesCount}</b>
                            <span className="text-muted-foreground">/{state.participantCount}</span>
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
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
                        <p className="text-sm text-card-foreground bg-card border border-border rounded-xl px-4 py-2.5 shadow-sm">
                            {state.round.prompt}
                        </p>
                    </div>
                )}
            </header>

            {/* Speaker script — what you SAY at this step (host-only) */}
            {state.status !== 'ended' && (state.round?.script || state.round?.hostNotes) && (
                <div className="mx-5 mb-3 rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
                    <button
                        onClick={() => setNotesOpen((v) => !v)}
                        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-primary/5 border-b border-primary/15"
                    >
                        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-bold">
                            <ScrollText size={15} /> {STR.remote.scriptTitle}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-primary">
                            {notesOpen ? STR.remote.scriptCollapse : STR.remote.scriptExpand}
                            {notesOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                        </span>
                    </button>
                    {notesOpen && (
                        <div className="px-4 py-3">
                            {state.round?.script ? (
                                <ScriptBody script={state.round.script} />
                            ) : (
                                <p className="text-[15px] text-card-foreground leading-relaxed">{state.round?.hostNotes}</p>
                            )}
                        </div>
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
                        canGoBack={state.currentRoundIndex > 0}
                        gamified={state.settings?.gamification ?? false}
                        responsesCount={state.responsesCount}
                        participantCount={state.participantCount}
                        gateRatio={state.settings?.gateRatio}
                        onAction={act}
                    />

                    {/* Round 28 — clickable Q&A list (host pops a question; «answered» greys it) */}
                    {state.round?.key === 't_close' && (
                        <QuestionPanel
                            questions={state.questions ?? []}
                            usedQuestions={state.usedQuestions ?? []}
                            activeQuestion={state.activeQuestion ?? null}
                            busy={actionBusy}
                            onPick={(n) => act('pickQuestion', undefined, undefined, n)}
                            onClose={(n) => act('closeQuestion', undefined, undefined, n)}
                        />
                    )}

                    {/* Roster + kick (private to the host; gated by allowKick) */}
                    {state.settings?.allowKick && state.roster.length > 0 && (
                        <Roster
                            roster={state.roster}
                            busy={actionBusy}
                            onKick={(clientId) => act('kickParticipant', undefined, clientId)}
                        />
                    )}

                    {/* Quick pin list for text rounds — multi-select spotlight */}
                    {textItems.length > 0 && (
                        <PinList
                            items={textItems}
                            pinnedIds={(state.round?.pinned ?? []).map((p) => p.id)}
                            onToggle={(id) => act('pinResponse', id)}
                            onClearAll={() => act('unpin')}
                        />
                    )}

                    {/* STOP */}
                    <div className="mt-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 space-y-3">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="min-h-11 w-fit text-muted-foreground hover:text-primary"
                        >
                            <a href={`/workshop/host/${hostKey}`} target="_blank">
                                <MonitorPlay size={15} /> {STR.remote.openDisplay}
                            </a>
                        </Button>
                        {stopConfirm ? (
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => {
                                        act('endRoom')
                                        setStopConfirm(false)
                                    }}
                                    disabled={actionBusy}
                                    variant="destructive"
                                    className="flex-1 h-auto rounded-2xl py-4 text-lg font-bold"
                                >
                                    <OctagonX size={20} /> {STR.remote.stopConfirm}
                                </Button>
                                <Button
                                    onClick={() => setStopConfirm(false)}
                                    variant="outline"
                                    className="h-auto rounded-2xl px-6 font-semibold text-muted-foreground"
                                >
                                    {STR.remote.stopCancel}
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={() => setStopConfirm(true)}
                                disabled={actionBusy}
                                variant="outline"
                                className="w-full h-auto rounded-2xl border-2 border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 py-4 text-lg font-bold"
                            >
                                <OctagonX size={20} /> {STR.remote.stop}
                            </Button>
                        )}
                    </div>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-2xl text-muted-foreground">{STR.common.ended}</p>
                </div>
            )}
        </main>
    )
}
