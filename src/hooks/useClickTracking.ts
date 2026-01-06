"use client"

import { useEffect, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function useClickTracking() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const isHeatmapMode = searchParams.get('heatmap') === 'true'

    const trackClick = useCallback(async (e: MouseEvent) => {
        // Don't track if in heatmap mode or if visitorId is missing (metrics not initialized)
        if (isHeatmapMode) return

        const visitorId = localStorage.getItem('visitor_id')
        if (!visitorId) return

        // Calculate relative coordinates (percentage)
        const x = (e.pageX / document.documentElement.scrollWidth) * 100
        const y = (e.pageY / document.documentElement.scrollHeight) * 100

        // Get element selector (simplified)
        let element = (e.target as HTMLElement).tagName
        if ((e.target as HTMLElement).id) element += `#${(e.target as HTMLElement).id}`

        const resolution = `${window.innerWidth}x${window.innerHeight}`

        try {
            await fetch('/api/tracking/clicks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    visitorId,
                    page: pathname,
                    x,
                    y,
                    element,
                    resolution
                })
            })
        } catch {
            // content ignored
        }
    }, [pathname, isHeatmapMode])

    useEffect(() => {
        if (typeof window === 'undefined') return

        window.addEventListener('click', trackClick)
        return () => window.removeEventListener('click', trackClick)
    }, [trackClick])
}
