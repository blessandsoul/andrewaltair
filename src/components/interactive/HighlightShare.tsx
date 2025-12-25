"use client"

import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Twitter, Facebook, Linkedin, Link2, Check } from "lucide-react"

export function HighlightShare() {
    const [selection, setSelection] = useState<{
        text: string
        x: number
        y: number
    } | null>(null)
    const [copied, setCopied] = useState(false)

    const handleSelection = useCallback(() => {
        const selectedText = window.getSelection()?.toString().trim()

        if (selectedText && selectedText.length > 10) {
            const range = window.getSelection()?.getRangeAt(0)
            if (range) {
                const rect = range.getBoundingClientRect()
                setSelection({
                    text: selectedText,
                    x: rect.left + rect.width / 2,
                    y: rect.top - 10,
                })
            }
        } else {
            setSelection(null)
        }
    }, [])

    useEffect(() => {
        document.addEventListener("mouseup", handleSelection)
        document.addEventListener("keyup", handleSelection)

        return () => {
            document.removeEventListener("mouseup", handleSelection)
            document.removeEventListener("keyup", handleSelection)
        }
    }, [handleSelection])

    const handleShare = (platform: string) => {
        if (!selection) return

        const url = window.location.href
        const text = `"${selection.text}"`

        let shareUrl = ""

        switch (platform) {
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    text
                )}&url=${encodeURIComponent(url)}`
                break
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    url
                )}&quote=${encodeURIComponent(text)}`
                break
            case "linkedin":
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    url
                )}`
                break
            case "copy":
                navigator.clipboard.writeText(`${text}\n\n${url}`)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
                return
        }

        if (shareUrl) {
            window.open(shareUrl, "_blank", "width=600,height=400")
        }

        setSelection(null)
    }

    if (!selection) return null

    return (
        <div
            className={cn(
                "fixed z-50 flex items-center gap-1 rounded-full bg-card/95 backdrop-blur-lg px-2 py-1.5 shadow-xl border animate-in fade-in zoom-in-95 duration-200"
            )}
            style={{
                left: `${Math.max(100, Math.min(selection.x, window.innerWidth - 100))}px`,
                top: `${selection.y + window.scrollY}px`,
                transform: "translate(-50%, -100%)",
            }}
        >
            {/* Arrow pointing down */}
            <div
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-r border-b rotate-45"
                style={{ zIndex: -1 }}
            />

            <button
                onClick={() => handleShare("twitter")}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                title="Share on Twitter"
            >
                <Twitter className="h-4 w-4 text-[#1DA1F2]" />
            </button>

            <button
                onClick={() => handleShare("facebook")}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                title="Share on Facebook"
            >
                <Facebook className="h-4 w-4 text-[#1877F2]" />
            </button>

            <button
                onClick={() => handleShare("linkedin")}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                title="Share on LinkedIn"
            >
                <Linkedin className="h-4 w-4 text-[#0A66C2]" />
            </button>

            <div className="w-px h-5 bg-border" />

            <button
                onClick={() => handleShare("copy")}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                title="Copy to clipboard"
            >
                {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                ) : (
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                )}
            </button>
        </div>
    )
}
