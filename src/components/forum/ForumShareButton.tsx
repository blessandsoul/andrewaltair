"use client"

import * as React from "react"
import { TbShare3, TbCheck } from "react-icons/tb"

/**
 * Real share: native share sheet on mobile (FB/IG/Telegram), and on desktop it copies the
 * topic link AND opens the quote-card image so the user can save + post it.
 */
export function ForumShareButton({ personaId, name, content }: { personaId: string; name?: string; content: string }) {
    const [copied, setCopied] = React.useState(false)

    const onShare = async () => {
        const quoteImg = `/api/forum/quote?persona=${personaId}&text=${encodeURIComponent(content)}`
        const shareUrl = typeof window !== "undefined" ? window.location.href : ""
        const data: ShareData = {
            title: name ? `${name} · დიდებულთა საბჭო` : "დიდებულთა საბჭო",
            text: content.slice(0, 180),
            url: shareUrl,
        }
        if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
            try {
                await navigator.share(data)
                return
            } catch {
                return // user dismissed the sheet
            }
        }
        // Desktop fallback: copy the link + open the card image to save & post.
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 1600)
        } catch {
            /* ignore */
        }
        if (typeof window !== "undefined") window.open(quoteImg, "_blank")
    }

    return (
        <button
            onClick={onShare}
            className="inline-flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary"
            title="გააზიარე"
        >
            {copied ? <TbCheck className="w-3.5 h-3.5" /> : <TbShare3 className="w-3.5 h-3.5" />}
            {copied ? "ბმული დაკოპირდა" : "გააზიარე"}
        </button>
    )
}

export default ForumShareButton
