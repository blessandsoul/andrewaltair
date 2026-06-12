'use client'

import { useState } from 'react'

interface NameGateProps {
    code: string
    clientId: string
    onJoined: (name: string) => void
}

export default function NameGate({ code, clientId, onJoined }: NameGateProps) {
    const [value, setValue] = useState('')
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const join = async () => {
        const name = value.trim()
        if (!name) return
        setBusy(true)
        setError(null)
        try {
            const res = await fetch(`/api/workshop/rooms/${code}/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, clientId }),
            })
            if (res.ok) {
                onJoined(name)
            } else if (res.status === 404) {
                setError('ოთახი ვერ მოიძებნა')
            } else if (res.status === 410) {
                setError('სემინარი უკვე დასრულდა')
            } else {
                setError('ვერ მოხერხდა — სცადეთ თავიდან')
            }
        } catch {
            setError('კავშირის შეცდომა — სცადეთ თავიდან')
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="space-y-5">
            <div className="text-center space-y-2">
                <p className="text-sm font-mono uppercase tracking-widest text-white/40">ოთახი {code}</p>
                <h1 className="text-3xl font-bold">მოგესალმებით!</h1>
                <p className="text-white/60">დაწერეთ თქვენი სახელი და შემოგვიერთდით</p>
            </div>
            <input
                type="text"
                value={value}
                maxLength={24}
                autoFocus
                placeholder="თქვენი სახელი"
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !busy && join()}
                className="w-full rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md px-5 py-4 text-xl text-center outline-none focus:border-violet-500 transition-colors"
            />
            <button
                onClick={join}
                disabled={busy || !value.trim()}
                className="w-full rounded-2xl bg-violet-600 active:bg-violet-700 disabled:opacity-40 py-4 text-xl font-bold transition-colors"
            >
                {busy ? 'შესვლა...' : 'შესვლა'}
            </button>
            {error && <p className="text-center text-red-400">{error}</p>}
        </div>
    )
}
