"use client"

import { useVisitorTracking } from "@/hooks/useVisitorTracking"
import { useClickTracking } from "@/hooks/useClickTracking"
import { useEngagementTracking } from "@/hooks/useEngagementTracking"

/**
 * Client component that initializes visitor tracking.
 * Place this in the root layout to track all page views.
 */
export function VisitorTracker() {
    // Core visitor tracking
    useVisitorTracking()
    // Click heatmap tracking
    useClickTracking()
    // Engagement metrics (scroll, time on page)
    useEngagementTracking()

    // This component doesn't render anything
    return null
}
