'use client'

import { useEffect } from 'react'

/**
 * Fire-and-forget view counter beacon.
 *
 * View counting used to be a Mongo $inc INSIDE the server render of every
 * blog/insight page — which made the highest-value pages uncacheable (every
 * crawler hit = a DB write) and inflated counts with bot traffic. This island
 * pings POST /api/views once per mount from a real browser instead; the page
 * itself can be ISR-cached.
 */
export default function ViewBeacon({ type, id }: { type: 'post' | 'insight'; id: string }) {
    useEffect(() => {
        if (!id) return
        const payload = JSON.stringify({ type, id })
        try {
            if (navigator.sendBeacon) {
                navigator.sendBeacon('/api/views', new Blob([payload], { type: 'application/json' }))
            } else {
                fetch('/api/views', { method: 'POST', body: payload, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => { })
            }
        } catch { /* counting must never break the page */ }
    }, [type, id])

    return null
}
