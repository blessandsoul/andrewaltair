'use client'

import { useEffect, useState } from 'react'
import { useRoomPoll } from '@/hooks/useRoomPoll'
import type { StudentState } from '@/types/workshop.types'
import NameGate from './components/NameGate'
import CurrentRound from './components/CurrentRound'

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
            {sub && <p className="text-[#6E7186]">{sub}</p>}
        </div>
    )
}

export default function RoomClient({ code }: { code: string }) {
    const [clientId, setClientId] = useState<string | null>(null)
    const [name, setName] = useState<string | null>(null)

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
    const { data: state, error, isLoading, connectionLost } = useRoomPoll<StudentState>(pollUrl)

    if (!clientId) return <ScreenShell><CenterNote title="იტვირთება..." /></ScreenShell>

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
        return <ScreenShell><CenterNote title="ოთახი ვერ მოიძებნა" sub={`კოდი: ${code}`} /></ScreenShell>
    }
    if (isLoading || !state) {
        return <ScreenShell><CenterNote title="იტვირთება..." /></ScreenShell>
    }
    if (state.status === 'ended') {
        return <ScreenShell><CenterNote title="სემინარი დასრულდა" sub="დიდი მადლობა მონაწილეობისთვის!" /></ScreenShell>
    }
    if (state.status === 'lobby' || !state.round) {
        return (
            <ScreenShell>
                <CenterNote
                    title={state.title}
                    sub={`მალე დავიწყებთ · შემოვიდა ${state.participantCount}`}
                />
                <p className="mt-6 text-center text-[#6E7186]/70 text-sm">
                    გამარჯობა, {name}! დაელოდეთ წამყვანს.
                </p>
            </ScreenShell>
        )
    }

    return (
        <ScreenShell>
            {connectionLost && (
                <div className="fixed top-0 inset-x-0 z-50 bg-amber-400 text-[#0E0F1F] text-center text-sm font-semibold py-2">
                    კავშირი წყდება — ვცდილობთ აღდგენას...
                </div>
            )}
            <CurrentRound
                code={code}
                clientId={clientId}
                round={state.round}
                myAnswer={state.myAnswer}
                serverNow={state.serverNow}
            />
        </ScreenShell>
    )
}
