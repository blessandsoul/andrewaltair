'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
            } else if (res.status === 409) {
                setError(STR.nameGate.errFull)
            } else if (res.status === 400) {
                setError(STR.nameGate.errName)
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
                <p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">{STR.nameGate.roomLabel(code)}</p>
                <h1 className="text-3xl font-bold text-foreground">{STR.nameGate.title}</h1>
                <p className="text-muted-foreground">{STR.nameGate.sub}</p>
            </div>
            <Input
                type="text"
                value={value}
                maxLength={24}
                autoFocus
                placeholder={STR.nameGate.placeholder}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !busy && join()}
                className="h-auto rounded-2xl bg-card px-5 py-4 text-center text-xl shadow-sm focus-visible:ring-ring/40"
            />
            <Button
                onClick={join}
                disabled={busy || !value.trim()}
                variant="gradient"
                className="glow-primary h-auto w-full rounded-2xl py-4 text-xl font-bold"
            >
                {busy ? STR.nameGate.joining : STR.nameGate.join}
            </Button>
            {error && <p className="text-center text-destructive">{error}</p>}
        </div>
    )
}
