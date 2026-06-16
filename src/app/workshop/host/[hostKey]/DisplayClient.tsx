'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clapperboard, Zap } from 'lucide-react'
import { useRoomPoll } from '@/hooks/useRoomPoll'
import type { HostState } from '@/types/workshop.types'
import { ReconnectBanner } from '@/components/workshop/ReconnectBanner'
import ResultsBoard from './components/ResultsBoard'
import TeachSlide from './components/TeachSlide'
import { DisplayHeader } from './DisplayHeader'
import { LobbyView } from './LobbyView'
import { EnableSoundOverlay } from './EnableSoundOverlay'
import { EndStats } from './EndStats'
import { PanelOverlay, ReactionsOverlay, WheelOverlay } from './GameOverlays'
import { Leaderboard } from './Leaderboard'
import { useDisplayAudio } from './useDisplayAudio'
import { STR } from '@/data/workshop-strings'

/**
 * PROJECTED display — the screen shared in Meet.
 * No controls here: the host drives rounds from /remote.
 */
export default function DisplayClient({ hostKey }: { hostKey: string }) {
    const { data: state, error, isLoading, connectionLost } = useRoomPoll<HostState>(`/api/workshop/host/${hostKey}`)
    const [qr, setQr] = useState<{ qrDataUrl: string; joinUrl: string } | null>(null)
    const { soundOn, audioPrompted, dismissPrompt, enableSound, toggleSound } = useDisplayAudio(state)
    const prevPhaseRef = useRef<string | null>(null)
    const [wheelDismissed, setWheelDismissed] = useState(0) // hide the wheel until the next spin (newer spotlightAt)
    const [panelDismissed, setPanelDismissed] = useState(0) // hide the winners/top-answers panel until the next trigger

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

    // Confetti on quiz / choice / revote reveal
    useEffect(() => {
        const phase = state?.round?.phase ?? null
        if (
            phase === 'revealed' &&
            prevPhaseRef.current !== 'revealed' &&
            state?.settings?.confetti !== false &&
            (state?.round?.type === 'quiz' || state?.round?.type === 'choice' || state?.round?.type === 'choice_revote')
        ) {
            import('canvas-confetti').then((m) => {
                m.default({ particleCount: 140, spread: 80, origin: { y: 0.6 } })
            })
        }
        prevPhaseRef.current = phase
    }, [state?.round?.phase, state?.round?.type, state?.settings?.confetti])

    if (error === 403) {
        return (
            <main className="flex min-h-dvh items-center justify-center">
                <p className="text-2xl">{STR.display.badLink}</p>
            </main>
        )
    }
    if (isLoading || !state) {
        return (
            <main className="flex min-h-dvh items-center justify-center">
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
    // F3: keep an image visible on photo-dependent rounds (lives OUTSIDE the keyed panel).
    // A round-pinned image (e.g. broken.jpg on the detective round) wins over the voted photo.
    const roundHeroSrc = !inLobby && state.status !== 'ended' ? state.round?.roundImage : undefined
    const showHero = !!(((state.selectedPhoto && state.round?.showsHeroPhoto) || roundHeroSrc) && !inLobby && state.status !== 'ended')
    const heroSrc = roundHeroSrc ?? state.selectedPhoto?.src
    const heroLabel = roundHeroSrc ? '' : state.selectedPhoto ? state.selectedPhoto.label.replace(/^[A-Z0-9]\s*·\s*/, '').trim() : ''

    return (
        <main className="relative flex h-dvh flex-col overflow-hidden">
            {connectionLost && <ReconnectBanner />}

            {/* Room answering progress — pinned to the very top edge of the screen, like a loading bar */}
            {answering && (
                <div className="absolute inset-x-0 top-0 z-50 h-1.5 bg-muted/70">
                    <motion.div
                        className="h-full bg-[image:var(--ws-cta)]"
                        animate={{
                            width: `${state.participantCount > 0 ? Math.min(100, Math.round((state.responsesCount / state.participantCount) * 100)) : 0}%`,
                        }}
                        transition={{ type: 'spring', stiffness: 90, damping: 22 }}
                    />
                </div>
            )}

            <DisplayHeader
                state={state}
                answering={!!answering}
                showRing={!!showRing}
                soundOn={soundOn}
                onToggleSound={toggleSound}
            />

            {/* "Video assembling" — overall workshop progress (gamified narrative) */}
            {state.settings?.gamification && !inLobby && state.status !== 'ended' && typeof state.progress === 'number' && (
                <div className="flex items-center gap-3 px-8 py-1.5">
                    <Clapperboard size={16} className="shrink-0 text-primary" />
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <motion.div
                            className="h-full rounded-full bg-[image:var(--ws-cta)]"
                            animate={{ width: `${Math.round((state.progress ?? 0) * 100)}%` }}
                            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                        />
                    </div>
                    <span className="text-xs font-bold tabular-nums text-muted-foreground">
                        {Math.round((state.progress ?? 0) * 100)}%
                    </span>
                </div>
            )}

            {/* Speed-spotlight — first to answer this round */}
            {answering && state.settings?.gamification && (state.fastest?.length ?? 0) > 0 && (
                <div className="flex items-center justify-center gap-2 py-1 text-sm font-semibold text-muted-foreground">
                    <Zap size={16} className="text-warning" />
                    <span className="uppercase tracking-wide text-primary">{STR.display.fastest}:</span>
                    {state.fastest!.map((n, i) => (
                        <motion.span
                            key={n + i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-full bg-primary/10 px-2.5 py-0.5 text-foreground"
                        >
                            {n}
                        </motion.span>
                    ))}
                </div>
            )}

            {/* Main area — phase transitions masked by enter/exit animation.
                The chosen photo (F3) sits OUTSIDE the keyed panel so it never blinks on round/phase change. */}
            <div className="flex flex-1 overflow-hidden">
                {showHero && heroSrc && (
                    <aside className="glass hidden w-[32%] max-w-md shrink-0 flex-col items-center justify-center gap-3 border-r border-border p-5 md:flex">
                        <div className="relative aspect-9/16 max-h-full w-full overflow-hidden rounded-2xl border border-border bg-foreground shadow-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={heroSrc} alt="" className="absolute inset-0 size-full object-cover" />
                        </div>
                        {heroLabel && <p className="text-center text-sm font-semibold text-muted-foreground">{heroLabel}</p>}
                    </aside>
                )}
                <div className="flex min-w-0 flex-1 flex-col overflow-hidden px-8 py-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={
                                state.status === 'ended'
                                    ? 'ended'
                                    : inLobby
                                    ? 'lobby'
                                    : `${state.round?.key}:${state.round?.phase}`
                            }
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -14 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="flex min-h-0 w-full flex-1 flex-col"
                        >
                            {state.status === 'ended' ? (
                                <EndStats hostKey={hostKey} photo={state.selectedPhoto} leaderboard={state.leaderboard} />
                            ) : inLobby ? (
                                <LobbyView qr={qr} code={state.code} roster={state.roster.map((r) => r.name)} />
                            ) : state.round?.type === 'teach' ? (
                                <TeachSlide
                                    heading={state.round.prompt}
                                    content={state.round.content}
                                    heroPhoto={state.selectedPhoto?.src}
                                />
                            ) : (
                                <ResultsBoard round={state.round} results={state.results} onPin={() => {}} readonly />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
                {state.settings?.gamification && !inLobby && state.status !== 'ended' && (state.leaderboard?.length ?? 0) > 0 && (
                    <Leaderboard entries={state.leaderboard!} teams={state.teams} />
                )}
            </div>

            {/* Gamification overlays — floating reactions + wheel-of-names spin */}
            {state.settings?.gamification && <ReactionsOverlay reactions={state.reactions} />}
            <AnimatePresence>
                {state.settings?.gamification && state.spotlightName && (state.spotlightAt ?? 0) > wheelDismissed && (
                    <WheelOverlay
                        key={state.spotlightAt ?? state.spotlightName}
                        name={state.spotlightName}
                        onClose={() => setWheelDismissed(state.spotlightAt ?? Date.now())}
                    />
                )}
            </AnimatePresence>

            {/* Winners / top-answers reveal — popped onto the projector from the remote */}
            <AnimatePresence>
                {state.settings?.gamification && state.spotlightPanel && state.spotlightPanel.at > panelDismissed && (
                    <PanelOverlay
                        key={state.spotlightPanel.at}
                        panel={state.spotlightPanel}
                        onClose={() => setPanelDismissed(state.spotlightPanel?.at ?? Date.now())}
                    />
                )}
            </AnimatePresence>

            {/* One-time enable-sound gate — the browser needs a click to unlock audio */}
            <AnimatePresence>
                {!soundOn && !audioPrompted && <EnableSoundOverlay onEnable={enableSound} onSkip={dismissPrompt} />}
            </AnimatePresence>
        </main>
    )
}
