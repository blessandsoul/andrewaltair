"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Always-on floating widgets used to hydrate eagerly on EVERY page — the
// single biggest TBT/hydration cost in the app shell. They are pure
// enhancement (toasts, live counter, chat, heatmap, easter egg): nothing
// SEO-relevant, nothing the user needs in the first seconds. So they are
// code-split (ssr:false — they render nothing meaningful server-side anyway)
// and mounted only after the main thread goes idle.

const EasterEgg = dynamic(() => import("@/components/interactive/EasterEgg").then(m => m.EasterEgg), { ssr: false })
const SocialProofToast = dynamic(() => import("@/components/interactive/SocialProofToast").then(m => m.SocialProofToast), { ssr: false })
const LiveVisitorCounter = dynamic(() => import("@/components/interactive/LiveVisitorCounter").then(m => m.LiveVisitorCounter), { ssr: false })
const AIChatAssistant = dynamic(() => import("@/components/ai/AIChatAssistant").then(m => m.AIChatAssistant), { ssr: false })
const HeatmapOverlay = dynamic(() => import("@/components/analytics/HeatmapOverlay").then(m => m.HeatmapOverlay), { ssr: false })

export function FloatingWidgets({ chatOnly = false }: { chatOnly?: boolean }) {
    const [ready, setReady] = useState(false)

    useEffect(() => {
        const start = () => setReady(true)
        if ("requestIdleCallback" in window) {
            const id = window.requestIdleCallback(start, { timeout: 4000 })
            return () => window.cancelIdleCallback(id)
        }
        const t = setTimeout(start, 2500)
        return () => clearTimeout(t)
    }, [])

    if (!ready) return null

    if (chatOnly) {
        return <AIChatAssistant />
    }

    return (
        <>
            <EasterEgg />
            <SocialProofToast enabled={true} />
            <LiveVisitorCounter variant="floating" className="hidden lg:flex !bottom-auto !top-32 !right-4" />
            <AIChatAssistant />
            <HeatmapOverlay />
        </>
    )
}
