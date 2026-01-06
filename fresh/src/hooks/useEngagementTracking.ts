"use client"

import { useEffect, useRef } from 'react'

/**
 * Hook to track user engagement metrics:
 * - Scroll depth (max percentage scrolled)
 * - Time on page
 * - Page visibility changes
 */
export function useEngagementTracking() {
    const startTime = useRef(Date.now())
    const maxScrollDepth = useRef(0)
    const visitorId = useRef<string | null>(null)
    const isVisible = useRef(true)
    const hiddenTime = useRef(0)

    useEffect(() => {
        // Get visitor ID from localStorage
        visitorId.current = localStorage.getItem('visitorId')
        if (!visitorId.current) return

        // Track scroll depth
        const handleScroll = () => {
            const scrollTop = window.scrollY
            const docHeight = document.documentElement.scrollHeight - window.innerHeight
            if (docHeight <= 0) return

            const scrollPercent = Math.round((scrollTop / docHeight) * 100)
            if (scrollPercent > maxScrollDepth.current) {
                maxScrollDepth.current = scrollPercent
            }
        }

        // Track visibility changes
        const handleVisibilityChange = () => {
            if (document.hidden) {
                isVisible.current = false
                hiddenTime.current = Date.now()
            } else {
                isVisible.current = true
                // Add hidden duration to start time to exclude it
                if (hiddenTime.current > 0) {
                    startTime.current += (Date.now() - hiddenTime.current)
                }
            }
        }

        // Send engagement data on unload
        const sendEngagement = () => {
            if (!visitorId.current) return

            const timeOnPage = Math.round((Date.now() - startTime.current) / 1000)

            // Use sendBeacon for reliable unload tracking
            const data = JSON.stringify({
                visitorId: visitorId.current,
                scrollDepth: maxScrollDepth.current,
                timeOnPage,
                page: window.location.pathname
            })

            navigator.sendBeacon('/api/tracking/engagement', data)
        }

        // Add listeners
        window.addEventListener('scroll', handleScroll, { passive: true })
        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('pagehide', sendEngagement)
        window.addEventListener('beforeunload', sendEngagement)

        // Initial scroll check
        handleScroll()

        return () => {
            window.removeEventListener('scroll', handleScroll)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            window.removeEventListener('pagehide', sendEngagement)
            window.removeEventListener('beforeunload', sendEngagement)
            // Also send on unmount (navigation within SPA)
            sendEngagement()
        }
    }, [])

    return null
}
