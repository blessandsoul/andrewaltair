'use client'

import { useState } from 'react'
import { STR } from '@/data/workshop-strings'

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
                setError(STR.nameGate.errNotFound)
            } else if (res.status === 410) {
                setError(STR.nameGate.errEnded)
            } else {
                setError(STR.nameGate.errGeneric)
            }
        } catch {
            setError(STR.nameGate.errNetwork)
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="space-y-5">
            <div className="text-center space-y-2">
                <p className="text-sm uppercase tracking-widest text-[#6E7186] font-semibold">{STR.nameGate.roomLabel(code)}</p>
                <h1 className="text-3xl font-bold">{STR.nameGate.title}</h1>
                <p className="text-[#6E7186]">{STR.nameGate.sub}</p>
            </div>
            <input
                type="text"
                value={value}
                maxLength={24}
                autoFocus
                placeholder={STR.nameGate.placeholder}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !busy && join()}
                className="w-full rounded-2xl bg-white border border-[#0E0F1F]/10 shadow-sm px-5 py-4 text-xl text-center outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
            />
            <button
                onClick={join}
                disabled={busy || !value.trim()}
                className="w-full rounded-2xl bg-linear-to-r from-violet-600 to-pink-600 active:opacity-90 disabled:opacity-40 py-4 text-xl font-bold text-white shadow-lg shadow-violet-600/30 transition-opacity"
            >
                {busy ? STR.nameGate.joining : STR.nameGate.join}
            </button>
            {error && <p className="text-center text-red-500">{error}</p>}
        </div>
    )
}
