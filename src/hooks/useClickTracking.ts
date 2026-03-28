"use client"

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface ClickData {
    x: number
    y: number
    element: string
    page: string
    resolution: string
}

const BATCH_INTERVAL = 5000

export function useClickTracking() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const isHeatmapMode = searchParams.get('heatmap') === 'true'
    const batchRef = useRef<ClickData[]>([])
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const pathnameRef = useRef(pathname)
    const isHeatmapRef = useRef(isHeatmapMode)

    // Keep refs in sync
    pathnameRef.current = pathname
    isHeatmapRef.current = isHeatmapMode

    useEffect(() => {
        if (typeof window === 'undefined') return

        const flush = () => {
            const batch = batchRef.current
            if (batch.length === 0) return
            batchRef.current = []

            const visitorId = localStorage.getItem('visitor_id')
            if (!visitorId) return

            const body = JSON.stringify({ visitorId, clicks: batch })
            // Use sendBeacon for reliability (won't block UI)
            if (navigator.sendBeacon) {
                navigator.sendBeacon('/api/tracking/clicks', new Blob([body], { type: 'application/json' }))
            } else {
                fetch('/api/tracking/clicks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body,
                }).catch(() => {})
            }
        }

        const handleClick = (e: MouseEvent) => {
            if (isHeatmapRef.current) return

            const x = (e.pageX / document.documentElement.scrollWidth) * 100
            const y = (e.pageY / document.documentElement.scrollHeight) * 100

            let element = (e.target as HTMLElement).tagName
            if ((e.target as HTMLElement).id) element += `#${(e.target as HTMLElement).id}`

            batchRef.current.push({
                x,
                y,
                element,
                page: pathnameRef.current,
                resolution: `${window.innerWidth}x${window.innerHeight}`,
            })
        }

        window.addEventListener('click', handleClick)
        timerRef.current = setInterval(flush, BATCH_INTERVAL)

        return () => {
            window.removeEventListener('click', handleClick)
            if (timerRef.current) clearInterval(timerRef.current)
            flush() // Send remaining clicks
        }
    }, [])
}
