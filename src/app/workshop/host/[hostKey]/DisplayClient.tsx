'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRoomPoll } from '@/hooks/useRoomPoll'
import type { HostState } from '@/types/workshop.types'
import { ReconnectBanner } from '@/components/workshop/ReconnectBanner'
import { springPop } from '@/components/workshop/motion'
import ResultsBoard from './components/ResultsBoard'
import TeachSlide from './components/TeachSlide'
import { DisplayHeader } from './DisplayHeader'
import { LobbyView } from './LobbyView'
import { EnableSoundOverlay } from './EnableSoundOverlay'
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
    // F3: keep the chosen photo visible on photo-dependent rounds (lives OUTSIDE the keyed panel)
    const showHero = !!(state.selectedPhoto && state.round?.showsHeroPhoto && !inLobby && state.status !== 'ended')
    const heroLabel = state.selectedPhoto ? state.selectedPhoto.label.replace(/^[A-Z0-9]\s*·\s*/, '').trim() : ''

    return (
        <main className="flex min-h-dvh flex-col">
            {connectionLost && <ReconnectBanner />}

            <DisplayHeader
                state={state}
                answering={!!answering}
                showRing={!!showRing}
                soundOn={soundOn}
                onToggleSound={toggleSound}
            />

            {/* Room answering progress — thin bar, the whole room sees momentum */}
            {answering && (
                <div className="h-1.5 bg-muted">
                    <motion.div
                        className="h-full bg-[image:var(--ws-cta)]"
                        animate={{
                            width: `${state.participantCount > 0 ? Math.min(100, Math.round((state.responsesCount / state.participantCount) * 100)) : 0}%`,
                        }}
                        transition={{ type: 'spring', stiffness: 90, damping: 22 }}
                    />
                </div>
            )}

            {/* Main area — phase transitions masked by enter/exit animation.
                The chosen photo (F3) sits OUTSIDE the keyed panel so it never blinks on round/phase change. */}
            <div className="flex flex-1 overflow-hidden">
                {showHero && state.selectedPhoto && (
                    <aside className="glass hidden w-[32%] max-w-md shrink-0 flex-col items-center justify-center gap-3 border-r border-border p-5 md:flex">
                        <div className="relative aspect-9/16 max-h-full w-full overflow-hidden rounded-2xl border border-border bg-foreground shadow-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={state.selectedPhoto.src} alt="" className="absolute inset-0 size-full object-cover" />
                        </div>
                        {heroLabel && <p className="text-center text-sm font-semibold text-muted-foreground">{heroLabel}</p>}
                    </aside>
                )}
                <div className="flex-1 overflow-y-auto px-8 py-6">
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
                            className="h-full"
                        >
                            {state.status === 'ended' ? (
                                <div className="flex h-full flex-col items-center justify-center gap-4">
                                    <motion.p
                                        initial={{ scale: 0.85 }}
                                        animate={{ scale: 1 }}
                                        transition={springPop}
                                        className="text-gradient text-5xl font-bold"
                                    >
                                        {STR.common.ended}
                                    </motion.p>
                                    <p className="text-lg text-muted-foreground">{STR.common.endedThanks}</p>
                                </div>
                            ) : inLobby ? (
                                <LobbyView qr={qr} code={state.code} roster={state.roster.map((r) => r.name)} />
                            ) : state.round?.type === 'teach' ? (
                                <TeachSlide heading={state.round.prompt} content={state.round.content} />
                            ) : (
                                <ResultsBoard round={state.round} results={state.results} onPin={() => {}} readonly />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* One-time enable-sound gate — the browser needs a click to unlock audio */}
            <AnimatePresence>
                {!soundOn && !audioPrompted && <EnableSoundOverlay onEnable={enableSound} onSkip={dismissPrompt} />}
            </AnimatePresence>
        </main>
    )
}
