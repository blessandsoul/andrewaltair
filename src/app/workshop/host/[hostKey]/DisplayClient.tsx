'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PenLine, Users, Volume2, VolumeX } from 'lucide-react'
import { useRoomPoll } from '@/hooks/useRoomPoll'
import type { HostState } from '@/types/workshop.types'
import CountdownRing from '@/components/workshop/CountdownRing'
import NameAvatar from '@/components/workshop/NameAvatar'
import ProgressDots from '@/components/workshop/ProgressDots'
import ResultsBoard from './components/ResultsBoard'
import { STR } from '@/data/workshop-strings'

/**
 * PROJECTED display — the screen shared in Meet.
 * No controls here: the host drives rounds from /remote.
 */
export default function DisplayClient({ hostKey }: { hostKey: string }) {
    const { data: state, error, isLoading, connectionLost } = useRoomPoll<HostState>(`/api/workshop/host/${hostKey}`)
    const [qr, setQr] = useState<{ qrDataUrl: string; joinUrl: string } | null>(null)
    const [soundOn, setSoundOn] = useState(false)
    const audioRef = useRef<AudioContext | null>(null)
    const prevPhaseRef = useRef<string | null>(null)
    const prevResponsesRef = useRef(0)
    const prevParticipantsRef = useRef(0)

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

    // Web Audio blip — short two-tone pop, no audio assets needed
    const blip = (freqA: number, freqB: number, gainPeak = 0.08) => {
        const ctx = audioRef.current
        if (!ctx || ctx.state !== 'running') return
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freqA, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(freqB, ctx.currentTime + 0.09)
        gain.gain.setValueAtTime(gainPeak, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
        osc.connect(gain).connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.13)
    }

    const toggleSound = async () => {
        if (!audioRef.current) {
            audioRef.current = new AudioContext()
        }
        if (audioRef.current.state === 'suspended') await audioRef.current.resume()
        setSoundOn((v) => {
            const next = !v
            if (next) blip(660, 880, 0.06) // confirmation chirp
            return next
        })
    }

    // Answer arrived → blip (only while a round is accepting answers)
    useEffect(() => {
        const count = state?.responsesCount ?? 0
        const phase = state?.round?.phase
        if (soundOn && count > prevResponsesRef.current && (phase === 'open' || phase === 'revote')) {
            blip(880, 1320)
        }
        prevResponsesRef.current = count
    }, [state?.responsesCount, state?.round?.phase, soundOn])

    // Someone joined the lobby → softer pop
    useEffect(() => {
        const count = state?.participantCount ?? 0
        if (soundOn && count > prevParticipantsRef.current && state?.status === 'lobby') {
            blip(440, 660, 0.05)
        }
        prevParticipantsRef.current = count
    }, [state?.participantCount, state?.status, soundOn])

    // Confetti on quiz / revote reveal
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
                <p className="text-2xl text-[#6E7186]">{STR.common.loading}</p>
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
    const shortUrl = qr ? qr.joinUrl.replace(/^https?:\/\//, '') : `andrewaltair.ge/workshop/${state.code}`

    return (
        <main className="min-h-dvh flex flex-col">
            {connectionLost && (
                <div className="fixed top-0 inset-x-0 z-50 bg-amber-400 text-[#0E0F1F] text-center text-sm font-semibold py-2">
                    {STR.common.reconnecting}
                </div>
            )}

            {/* Header */}
            <header className="flex items-center justify-between px-8 py-4 border-b border-[#0E0F1F]/8 bg-white/60 backdrop-blur-sm">
                <div className="flex items-baseline gap-4">
                    <h1 className="text-xl font-bold">{state.title}</h1>
                    <span className="text-[#6E7186] text-sm">
                        {state.currentRoundIndex >= 0
                            ? STR.display.roundOf(state.currentRoundIndex + 1, state.roundsTotal)
                            : STR.display.lobby}
                    </span>
                </div>
                <div className="flex items-center gap-5">
                    {state.currentRoundIndex >= 0 && state.status !== 'ended' && (
                        <ProgressDots current={state.currentRoundIndex} total={state.roundsTotal} />
                    )}
                    {answering && (
                        <span className="inline-flex items-center gap-2 text-lg tabular-nums">
                            <PenLine size={18} className="text-violet-600" />
                            <motion.b
                                key={state.responsesCount}
                                initial={{ scale: 1.45, color: '#db2777' }}
                                animate={{ scale: 1, color: '#7c3aed' }}
                                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                                className="inline-block"
                            >
                                {state.responsesCount}
                            </motion.b>
                            <span className="text-[#6E7186]">/{state.participantCount}</span>
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
                    <span className="inline-flex items-center gap-1.5 text-[#6E7186]">
                        <Users size={18} /> {state.participantCount}
                    </span>
                    <span className="hidden md:inline-flex items-center rounded-full bg-violet-50 border border-violet-200 px-4 py-1.5 text-sm text-violet-700 font-semibold">
                        {shortUrl}
                    </span>
                    <span className="text-2xl font-bold tracking-[0.2em] bg-white border border-[#0E0F1F]/10 shadow-sm rounded-xl px-4 py-1.5">
                        {state.code}
                    </span>
                    <button
                        onClick={toggleSound}
                        title={soundOn ? STR.display.soundOff : STR.display.soundOn}
                        className={`rounded-full p-2.5 border transition-colors ${
                            soundOn
                                ? 'bg-violet-600 border-violet-600 text-white'
                                : 'bg-white border-[#0E0F1F]/10 text-[#6E7186] hover:text-[#0E0F1F]'
                        }`}
                    >
                        {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </button>
                </div>
            </header>

            {/* Room answering progress — thin bar, the whole room sees momentum */}
            {answering && (
                <div className="h-1.5 bg-[#0E0F1F]/5">
                    <motion.div
                        className="h-full bg-linear-to-r from-violet-600 to-pink-600"
                        animate={{
                            width: `${state.participantCount > 0 ? Math.min(100, Math.round((state.responsesCount / state.participantCount) * 100)) : 0}%`,
                        }}
                        transition={{ type: 'spring', stiffness: 90, damping: 22 }}
                    />
                </div>
            )}

            {/* Main area — phase transitions masked by enter/exit animation */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={
                            state.status === 'ended'
                                ? 'ended'
                                : inLobby
                                ? 'lobby'
                                : `${state.round?.key}:${state.round?.phase}:${state.round?.pinned ? 'pin' : ''}`
                        }
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -14 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="h-full"
                    >
                        {state.status === 'ended' ? (
                            <div className="h-full flex flex-col items-center justify-center gap-4">
                                <motion.p
                                    initial={{ scale: 0.85 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 16 }}
                                    className="text-4xl font-bold"
                                >
                                    {STR.common.ended}
                                </motion.p>
                                <p className="text-[#6E7186] text-lg">{STR.common.endedThanks}</p>
                            </div>
                        ) : inLobby ? (
                            <LobbyView qr={qr} code={state.code} roster={state.roster.map((r) => r.name)} />
                        ) : (
                            <ResultsBoard round={state.round} results={state.results} onPin={() => {}} readonly />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
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
        <div className="h-full flex flex-col lg:flex-row items-center justify-center gap-14">
            {/* QR card — gentle float so the lobby screen feels alive */}
            <div className="text-center">
                <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="inline-block rounded-[28px] bg-white p-7 shadow-2xl shadow-violet-600/15 border border-[#0E0F1F]/6"
                >
                    {qr ? (
                        <img
                            src={qr.qrDataUrl}
                            alt={`QR · ${code}`}
                            className="w-80 h-80 rounded-2xl"
                        />
                    ) : (
                        <div className="w-80 h-80 rounded-2xl bg-[#F7F5EE]" />
                    )}
                    <p className="mt-5 text-5xl font-bold tracking-[0.25em] text-violet-700">{code}</p>
                    {qr && (
                        <p className="mt-2 text-[#6E7186] text-lg">
                            {qr.joinUrl.replace(/^https?:\/\//, '')}
                        </p>
                    )}
                </motion.div>
                <p className="mt-5 text-[#6E7186] text-xl">{STR.display.scanQr}</p>
            </div>

            {/* Roster — each newcomer pops in with a spring */}
            <div className="max-w-md w-full">
                <p className="text-sm uppercase tracking-widest text-[#6E7186] font-semibold mb-3">
                    {STR.display.joined} ·{' '}
                    <motion.span
                        key={roster.length}
                        initial={{ scale: 1.4 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                        className="inline-block text-violet-600"
                    >
                        {roster.length}
                    </motion.span>
                </p>
                <div className="flex flex-wrap gap-2">
                    <AnimatePresence initial={false}>
                        {roster.map((name, i) => (
                            <motion.span
                                key={`${name}-${i}`}
                                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="inline-flex items-center gap-2 rounded-full bg-white border border-[#0E0F1F]/10 shadow-sm pl-1.5 pr-4 py-1.5 text-sm font-medium"
                            >
                                <NameAvatar name={name} size={24} />
                                {name}
                            </motion.span>
                        ))}
                    </AnimatePresence>
                    {roster.length === 0 && <p className="text-[#6E7186]/60">{STR.display.waiting}</p>}
                </div>
            </div>
        </div>
    )
}
