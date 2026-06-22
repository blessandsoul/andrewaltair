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
    Radio,
    Video,
    VideoOff,
    Mic,
    Hand,
    Circle,
} from 'lucide-react'
import dynamic from 'next/dynamic'
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
import { MultiResponders } from './MultiResponders'
import { PromptVault } from './PromptVault'
import { MessageModeration } from './MessageModeration'
import { StatusPill } from './StatusPill'
import { HistoryDrawer } from './HistoryDrawer'
import { STR } from '@/data/workshop-strings'

// Heavy LiveKit bundle loads only when the host actually goes live, not on every remote mount.
const BroadcastPublisher = dynamic(() => import('@/app/workshop/_video/BroadcastPublisher'), { ssr: false })

/**
 * HOST REMOTE, control surface (laptop second window or the host's phone).
 * The projected display lives at /workshop/host/[hostKey] and has no controls.
 */
export default function RemoteClient({ hostKey }: { hostKey: string }) {
    const { data: state, error, isLoading, connectionLost, refresh } = useRoomPoll<HostState>(`/api/workshop/host/${hostKey}`)
    const [actionBusy, setActionBusy] = useState(false)
    const [notesOpen, setNotesOpen] = useState(true)
    const [stopConfirm, setStopConfirm] = useState(false)
    const [historyOpen, setHistoryOpen] = useState(false)
    const [broadcasting, setBroadcasting] = useState(false)
    const [cameraMode, setCameraMode] = useState<'desktop' | 'iphone'>('desktop')
    const [phoneQr, setPhoneQr] = useState<string | null>(null)

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

    // Go live / stop the host camera + mic. Flips the room flag viewers gate on, then
    // mounts/unmounts the publisher (which acquires/releases the camera).
    const toggleBroadcast = useCallback(async () => {
        const next = !broadcasting
        setBroadcasting(next)
        try {
            await fetch(`/api/workshop/host/${hostKey}/control`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'setBroadcast', enabled: next }),
            })
            refresh()
        } catch {
            setBroadcasting(!next) // revert the toggle if the flag did not save
        }
    }, [broadcasting, hostKey, refresh])

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

    // Fetch the phone-camera QR once, when the host switches to iPhone mode.
    useEffect(() => {
        if (cameraMode !== 'iphone' || phoneQr) return
        fetch(`/api/workshop/host/${hostKey}?phoneQr=1`, { cache: 'no-store' })
            .then((r) => r.json())
            .then((j) => {
                if (j.success && j.data.phoneQrDataUrl) setPhoneQr(j.data.phoneQrDataUrl)
            })
            .catch(() => {})
    }, [cameraMode, phoneQr, hostKey])

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
    const multiResponders = state.results?.type === 'multi' ? state.results.responders ?? [] : []

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
                        <PromptVault />
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

                    {/* Host camera + mic broadcast (LiveKit). Go live puts the host on every viewer screen. */}
                    <div className="mx-5 mb-3 space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                <Radio size={15} className={broadcasting ? 'text-destructive' : ''} /> {STR.broadcast.title}
                            </span>
                            <Button
                                onClick={toggleBroadcast}
                                variant={broadcasting ? 'destructive' : 'default'}
                                size="sm"
                                className="min-h-10 gap-2"
                            >
                                {broadcasting ? (
                                    <>
                                        <VideoOff size={16} /> {STR.broadcast.stopLive}
                                    </>
                                ) : (
                                    <>
                                        <Video size={16} /> {STR.broadcast.goLive}
                                    </>
                                )}
                            </Button>
                        </div>
                        {/* camera source: this device's webcam, or the phone via QR */}
                        <div className="flex gap-1.5">
                            {([['desktop', STR.broadcast.cameraModeDesktop], ['iphone', STR.broadcast.cameraModeIphone]] as const).map(([m, label]) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setCameraMode(m)}
                                    className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
                                        cameraMode === m
                                            ? 'border-transparent bg-[image:var(--ws-cta)] text-white'
                                            : 'border-border bg-background text-foreground hover:bg-accent'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        {!broadcasting && state.settings?.broadcastEnabled && (
                            <p className="text-xs font-medium text-warning">{STR.broadcast.stillLive}</p>
                        )}
                        {broadcasting && cameraMode === 'desktop' && (
                            <div className="mx-auto w-full max-w-xs">
                                <BroadcastPublisher hostKey={hostKey} code={state.code} lang={state.settings?.language ?? 'ka'} />
                            </div>
                        )}
                        {broadcasting && cameraMode === 'iphone' && (
                            <div className="flex flex-col items-center gap-2 py-2">
                                {phoneQr ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={phoneQr} alt="iPhone QR" className="size-44 rounded-xl border border-border" />
                                ) : (
                                    <div className="size-44 rounded-xl bg-background" />
                                )}
                                <p className="text-center text-xs font-medium text-muted-foreground">{STR.broadcast.phoneScanHint}</p>
                            </div>
                        )}
                        {broadcasting && (
                            <div className="flex items-center justify-between gap-3">
                                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    <Circle size={13} className={state.recording ? 'fill-destructive text-destructive' : ''} /> {STR.broadcast.record}
                                </span>
                                <Button
                                    onClick={() => act(state.recording ? 'stopRecording' : 'startRecording')}
                                    variant={state.recording ? 'destructive' : 'default'}
                                    size="sm"
                                    className="min-h-10 gap-2"
                                >
                                    {state.recording ? STR.broadcast.recordStop : STR.broadcast.record}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Talkback: raised hands to grant, active speakers to revoke */}
                    {state.settings?.broadcastEnabled &&
                        ((state.raisedHands?.length ?? 0) > 0 || (state.speakers?.length ?? 0) > 0) && (
                            <div className="mx-5 mb-3 space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
                                {(state.speakers?.length ?? 0) > 0 && (
                                    <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                            {STR.broadcast.speakersTitle}
                                        </p>
                                        {state.speakers!.map((s) => (
                                            <div
                                                key={s.clientId}
                                                className="flex items-center justify-between gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2"
                                            >
                                                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                                                    <Mic size={14} className="text-primary" /> {s.name}
                                                </span>
                                                <Button
                                                    onClick={() => act('revokeSpeak', undefined, s.clientId)}
                                                    disabled={actionBusy}
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 text-destructive"
                                                >
                                                    {STR.broadcast.revoke}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {(state.raisedHands?.length ?? 0) > 0 && (
                                    <div className="space-y-1.5">
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                            {STR.broadcast.raisedHandsTitle}
                                        </p>
                                        {state.raisedHands!.map((h) => (
                                            <div
                                                key={h.clientId}
                                                className="flex items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2"
                                            >
                                                <span className="inline-flex items-center gap-2 text-sm">
                                                    <Hand size={14} className="text-secondary" /> {h.name}
                                                </span>
                                                <Button
                                                    onClick={() => act('grantSpeak', undefined, h.clientId)}
                                                    disabled={actionBusy}
                                                    size="sm"
                                                    className="h-8"
                                                >
                                                    {STR.broadcast.grant}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    {/* Round 28: clickable Q&A list (host pops a question; «answered» greys it) */}
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

                    {/* Quick pin list for text rounds, multi-select spotlight */}
                    {textItems.length > 0 && (
                        <PinList
                            items={textItems}
                            pinnedIds={(state.round?.pinned ?? []).map((p) => p.id)}
                            onToggle={(id) => act('pinResponse', id)}
                            onClearAll={() => act('unpin')}
                        />
                    )}

                    {/* Live per-name picks for find-the-mistake (multi) rounds, host reads finders aloud */}
                    {multiResponders.length > 0 && <MultiResponders responders={multiResponders} />}

                    {/* Live chat + audience questions, host moderation (own poll) */}
                    <MessageModeration hostKey={hostKey} />

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
