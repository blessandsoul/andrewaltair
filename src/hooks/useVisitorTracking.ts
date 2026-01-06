"use client"

import { useEffect, useRef, useCallback, useState } from 'react'
import { usePathname } from 'next/navigation'

// Generate a unique visitor ID (stored in localStorage)
function getVisitorId(): string {
    if (typeof window === 'undefined') return ''

    try {
        let visitorId = localStorage.getItem('visitor_id')
        if (!visitorId) {
            visitorId = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
            localStorage.setItem('visitor_id', visitorId)
        }
        return visitorId
    } catch {
        // localStorage might be blocked
        return 'v_' + Math.random().toString(36).substring(2)
    }
}

export function useVisitorTracking() {
    const pathname = usePathname()
    const lastPathRef = useRef<string>('')
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const hasMounted = useRef(false)
    const [visitorId, setVisitorId] = useState<string>('')

    // Initialize visitor ID on mount
    useEffect(() => {
        const id = getVisitorId()
        setVisitorId(id)
        hasMounted.current = true
    }, [])

    // Send heartbeat to server
    const sendHeartbeat = useCallback(async (isPageView = false) => {
        // Don't send if no visitor ID yet
        if (!visitorId) return

        try {
            const res = await fetch('/api/tracking/visitors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    visitorId,
                    currentPage: pathname,
                    referrer: typeof document !== 'undefined' ? document.referrer : '',
                    type: isPageView ? 'pageview' : 'heartbeat'
                }),
            })

            // If it's a page view and path changed, record activity
            if (isPageView && pathname && pathname !== lastPathRef.current) {
                await fetch('/api/tracking/activities', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'page_view',
                        visitorId,
                        targetType: 'page',
                        targetSlug: pathname,
                        isPublic: false, // Page views are not shown in social proof
                    }),
                })
                lastPathRef.current = pathname
            }
        } catch (error) {
            // Silently fail - don't break user experience
        }
    }, [pathname, visitorId])

    // Record specific activity (for use in components)
    const recordActivity = useCallback(async (
        type: string,
        options: {
            targetType?: string
            targetId?: string
            targetTitle?: string
            targetSlug?: string
            metadata?: Record<string, any>
            isPublic?: boolean
        } = {}
    ) => {
        if (!visitorId) return

        try {
            await fetch('/api/tracking/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    visitorId,
                    ...options,
                    isPublic: options.isPublic ?? true,
                }),
            })
        } catch (error) {
            // Silently fail
        }
    }, [visitorId])

    // Initial heartbeat and interval setup
    useEffect(() => {
        if (!visitorId) return

        // Send initial heartbeat (page view)
        sendHeartbeat(true)

        // Send heartbeats every 30 seconds
        intervalRef.current = setInterval(() => {
            sendHeartbeat(false)
        }, 30000)

        // Cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [sendHeartbeat, visitorId])

    // Track page changes
    useEffect(() => {
        if (!visitorId) return

        if (pathname && pathname !== lastPathRef.current) {
            sendHeartbeat(true)
        }
    }, [pathname, sendHeartbeat, visitorId])

    return { recordActivity, visitorId }
}

// Hook to get online count with real API data
export function useOnlineCount(pollInterval = 30000) {
    const [data, setData] = useState<{
        online: number
        desktop: number
        mobile: number
        tablet: number
    } | null>(null)

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await fetch('/api/tracking/visitors')
                if (res.ok) {
                    const json = await res.json()
                    setData(json)
                }
            } catch (error) {
                // Silently fail
            }
        }

        // Initial fetch
        fetchCount()

        // Poll for updates
        const interval = setInterval(fetchCount, pollInterval)

        return () => clearInterval(interval)
    }, [pollInterval])

    return data
}
