'use client'

import { useEffect, useRef, useState } from 'react'

interface UseRoomPollResult<T> {
    data: T | null
    error: number | null
    isLoading: boolean
    /** true after 2+ consecutive failed ticks — show a reconnect banner */
    connectionLost: boolean
}

/**
 * Generic interval poller for Workshop Room state.
 * Follows the site polling convention (setInterval fetch, cleared on unmount).
 */
export function useRoomPoll<T>(url: string | null, intervalMs = 2000): UseRoomPollResult<T> {
    const [data, setData] = useState<T | null>(null)
    const [error, setError] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [connectionLost, setConnectionLost] = useState(false)
    const busyRef = useRef(false)
    const failsRef = useRef(0)

    useEffect(() => {
        if (!url) return
        let alive = true

        const tick = async () => {
            if (busyRef.current) return
            busyRef.current = true
            try {
                const res = await fetch(url, { cache: 'no-store' })
                if (!alive) return
                if (!res.ok) {
                    setError(res.status)
                    failsRef.current = 0
                    setConnectionLost(false)
                    return
                }
                const json = await res.json()
                if (json.success) {
                    setData(json.data as T)
                    setError(null)
                }
                failsRef.current = 0
                setConnectionLost(false)
            } catch {
                // transient network error — keep last state, surface banner after 2 fails
                failsRef.current += 1
                if (alive && failsRef.current >= 2) setConnectionLost(true)
            } finally {
                busyRef.current = false
                if (alive) setIsLoading(false)
            }
        }

        // self-scheduling with ±15% jitter so N phones don't align into synchronized
        // request bursts (smoother server load at 30 concurrent clients)
        let timer: ReturnType<typeof setTimeout>
        const schedule = () => {
            const delay = intervalMs * (0.85 + Math.random() * 0.3)
            timer = setTimeout(async () => {
                await tick()
                if (alive) schedule()
            }, delay)
        }
        tick()
        schedule()
        return () => {
            alive = false
            clearTimeout(timer)
        }
    }, [url, intervalMs])

    return { data, error, isLoading, connectionLost }
}
