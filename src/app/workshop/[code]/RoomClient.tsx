'use client'

import { useEffect, useRef, useState } from 'react'
import { useRoomPoll } from '@/hooks/useRoomPoll'
import { useStudentSound } from '@/hooks/useStudentSound'
import type { StudentState } from '@/types/workshop.types'
import { Button } from '@/components/ui/button'
import { ReconnectBanner } from '@/components/workshop/ReconnectBanner'
import NameGate from './components/NameGate'
import CurrentRound from './components/CurrentRound'
import { STR } from '@/data/workshop-strings'

const CLIENT_ID_KEY = 'w_client_id'
const NAME_KEY = 'w_name'

function ScreenShell({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-dvh flex flex-col items-center justify-center px-5 py-8">
            <div className="w-full max-w-md">{children}</div>
        </main>
    )
}

function CenterNote({ title, sub }: { title: string; sub?: string }) {
    return (
        <div className="text-center space-y-3">
            <p className="text-2xl font-bold">{title}</p>
            {sub && <p className="text-muted-foreground">{sub}</p>}
        </div>
    )
}

export default function RoomClient({ code }: { code: string }) {
    const [clientId, setClientId] = useState<string | null>(null)
    const [name, setName] = useState<string | null>(null)
    const [pollMs, setPollMs] = useState(3000)
    const [soundDismissed, setSoundDismissed] = useState(false)

    useEffect(() => {
        let id = localStorage.getItem(CLIENT_ID_KEY)
        if (!id) {
            id = crypto.randomUUID()
            localStorage.setItem(CLIENT_ID_KEY, id)
        }
        setClientId(id)
        setName(localStorage.getItem(NAME_KEY))
    }, [])

    const pollUrl =
        clientId && name
            ? `/api/workshop/rooms/${code}?clientId=${encodeURIComponent(clientId)}`
            : null
    // students poll a touch slower than the host (default 3s, per-room configurable);
    // 30 phones at 3s + jitter cut server load ~33% vs the 2s host display.
    const { data: state, error, isLoading, connectionLost } = useRoomPoll<StudentState>(pollUrl, pollMs)

    // adopt the room's configured student poll interval once it arrives (one re-subscribe)
    useEffect(() => {
        const ms = state?.settings?.studentPollMs
        if (ms && ms !== pollMs) setPollMs(ms)
    }, [state?.settings?.studentPollMs, pollMs])

    // Online mode only: sound on the student's own phone.
    const soundOn = state?.settings?.audience === 'online' && !!state?.settings?.studentSound
    const { unlocked, enable, chime, confirm, reveal } = useStudentSound(state?.settings?.studentVolume ?? 70)
    const cueRef = useRef<{ key: string | null; phase: string | null; answered: boolean }>({
        key: null,
        phase: null,
        answered: false,
    })

    useEffect(() => {
        const key = state?.round?.key ?? null
        const phase = state?.round?.phase ?? null
        const answered = !!state?.myAnswer
        const prev = cueRef.current
        cueRef.current = { key, phase, answered }
        // keep prev synced while muted so enabling sound mid-round doesn't fire a burst
        if (!soundOn || !unlocked) return
        if (key && (phase === 'open' || phase === 'revote') && (key !== prev.key || (prev.phase !== 'open' && prev.phase !== 'revote'))) {
            chime()
        }
        if (answered && !prev.answered) confirm()
        if (phase === 'revealed' && prev.phase !== 'revealed') reveal()
    }, [state?.round?.key, state?.round?.phase, state?.myAnswer, soundOn, unlocked, chime, confirm, reveal])

    const soundGate =
        soundOn && !unlocked && !soundDismissed ? (
            <div className="fixed inset-0 z-60 flex flex-col items-center justify-center gap-4 bg-background/95 px-6 text-center backdrop-blur">
                <Button
                    type="button"
                    onClick={() => void enable()}
                    variant="gradient"
                    className="glow-primary h-auto rounded-2xl px-8 py-5 text-xl font-bold"
                >
                    {STR.studentSound.enable}
                </Button>
                <p className="max-w-xs text-sm text-muted-foreground">{STR.studentSound.hint}</p>
                <Button
                    type="button"
                    onClick={() => setSoundDismissed(true)}
                    variant="link"
                    className="text-sm text-muted-foreground"
                >
                    {STR.studentSound.skip}
                </Button>
            </div>
        ) : null

    if (!clientId) return <ScreenShell><CenterNote title={STR.common.loading} /></ScreenShell>

    if (!name) {
        return (
            <ScreenShell>
                <NameGate
                    code={code}
                    clientId={clientId}
                    onJoined={(n) => {
                        localStorage.setItem(NAME_KEY, n)
                        setName(n)
                    }}
                />
            </ScreenShell>
        )
    }

    if (error === 404) {
        return <ScreenShell><CenterNote title={STR.student.roomNotFound} sub={STR.student.codeLabel(code)} /></ScreenShell>
    }
    if (isLoading || !state) {
        return <ScreenShell><CenterNote title={STR.common.loading} /></ScreenShell>
    }
    if (state.status === 'ended') {
        return <ScreenShell><CenterNote title={STR.common.ended} sub={STR.common.endedThanks} /></ScreenShell>
    }
    if (state.status === 'lobby' || !state.round) {
        return (
            <ScreenShell>
                {soundGate}
                <CenterNote title={state.title} sub={STR.student.lobbySub(state.participantCount)} />
                <p className="mt-6 text-center text-muted-foreground/70 text-sm">{STR.student.lobbyHello(name)}</p>
            </ScreenShell>
        )
    }

    return (
        <ScreenShell>
            {soundGate}
            {connectionLost && <ReconnectBanner />}
            <CurrentRound
                code={code}
                clientId={clientId}
                round={state.round}
                myAnswer={state.myAnswer}
                results={state.results}
                serverNow={state.serverNow}
            />
        </ScreenShell>
    )
}
