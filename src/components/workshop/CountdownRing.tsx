'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

interface CountdownRingProps {
    phaseStartedAt: string
    durationSec: number
    serverNow: string
    size?: number
    onExpire?: () => void
}

/**
 * SVG countdown ring synced to server clock (offset computed from serverNow).
 * Shared by student phone + host projector.
 */
export default function CountdownRing({
    phaseStartedAt,
    durationSec,
    serverNow,
    size = 56,
    onExpire,
}: CountdownRingProps) {
    const [remaining, setRemaining] = useState<number>(durationSec)

    useEffect(() => {
        const offset = new Date(serverNow).getTime() - Date.now()
        const endAt = new Date(phaseStartedAt).getTime() + durationSec * 1000

        const tick = () => {
            const left = Math.max(0, Math.round((endAt - (Date.now() + offset)) / 1000))
            setRemaining(left)
            if (left === 0) onExpire?.()
        }
        tick()
        const id = setInterval(tick, 500)
        return () => clearInterval(id)
        // serverNow changes every poll — re-syncing each time is intended
    }, [phaseStartedAt, durationSec, serverNow, onExpire])

    const r = (size - 8) / 2
    const circumference = 2 * Math.PI * r
    const frac = durationSec > 0 ? remaining / durationSec : 0
    const urgent = remaining <= 10

    return (
        <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2} cy={size / 2} r={r}
                    fill="none" stroke="color-mix(in srgb, var(--foreground) 10%, transparent)" strokeWidth="4"
                />
                <circle
                    cx={size / 2} cy={size / 2} r={r}
                    fill="none"
                    stroke={urgent ? 'var(--destructive)' : 'var(--primary)'}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - frac)}
                    className="transition-[stroke-dashoffset] duration-500 ease-linear"
                />
            </svg>
            <span
                className={cn(
                    'absolute font-bold tabular-nums',
                    urgent ? 'text-destructive animate-pulse' : 'text-foreground'
                )}
                style={{ fontSize: size * 0.3 }}
            >
                {remaining}
            </span>
        </div>
    )
}
