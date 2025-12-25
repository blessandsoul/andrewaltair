"use client"

import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Download, Twitter, Facebook, Copy, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuoteCardProps {
    quote: string
    author?: string
    source?: string
    className?: string
}

// Gradient backgrounds for quote cards
const gradients = [
    "from-violet-600 via-purple-600 to-indigo-600",
    "from-rose-500 via-pink-500 to-fuchsia-500",
    "from-cyan-500 via-blue-500 to-indigo-500",
    "from-emerald-500 via-teal-500 to-cyan-500",
    "from-orange-500 via-amber-500 to-yellow-500",
    "from-slate-700 via-slate-800 to-slate-900",
]

export function QuoteCardGenerator({
    quote,
    author = "Andrew Altair",
    source,
    className,
}: QuoteCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [selectedGradient, setSelectedGradient] = useState(0)
    const [copied, setCopied] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)

    const handleDownload = useCallback(async () => {
        if (!cardRef.current) return

        setIsGenerating(true)

        try {
            const canvas = document.createElement("canvas")
            canvas.width = 800
            canvas.height = 450
            const ctx = canvas.getContext("2d")

            if (ctx) {
                // Create gradient background
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
                gradient.addColorStop(0, "#6366f1")
                gradient.addColorStop(0.5, "#8b5cf6")
                gradient.addColorStop(1, "#6366f1")
                ctx.fillStyle = gradient
                ctx.fillRect(0, 0, canvas.width, canvas.height)

                // Add quote marks
                ctx.font = "bold 80px Georgia"
                ctx.fillStyle = "rgba(255,255,255,0.2)"
                ctx.fillText("\u201C", 40, 100)
                ctx.fillText("\u201D", canvas.width - 80, canvas.height - 40)

                // Add quote text
                ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, sans-serif"
                ctx.fillStyle = "white"
                ctx.textAlign = "center"

                // Word wrap
                const words = quote.split(" ")
                const lines: string[] = []
                let currentLine = ""
                const maxWidth = canvas.width - 120

                words.forEach((word) => {
                    const testLine = currentLine + word + " "
                    const metrics = ctx.measureText(testLine)
                    if (metrics.width > maxWidth && currentLine) {
                        lines.push(currentLine.trim())
                        currentLine = word + " "
                    } else {
                        currentLine = testLine
                    }
                })
                if (currentLine) lines.push(currentLine.trim())

                const lineHeight = 40
                const startY = (canvas.height - lines.length * lineHeight) / 2

                lines.forEach((line, i) => {
                    ctx.fillText(line, canvas.width / 2, startY + i * lineHeight)
                })

                // Add author
                ctx.font = "20px -apple-system, BlinkMacSystemFont, sans-serif"
                ctx.fillStyle = "rgba(255,255,255,0.8)"
                ctx.fillText(`\u2014 ${author}`, canvas.width / 2, canvas.height - 60)

                if (source) {
                    ctx.font = "16px -apple-system, BlinkMacSystemFont, sans-serif"
                    ctx.fillStyle = "rgba(255,255,255,0.6)"
                    ctx.fillText(source, canvas.width / 2, canvas.height - 35)
                }

                // Watermark
                ctx.font = "14px -apple-system, BlinkMacSystemFont, sans-serif"
                ctx.fillStyle = "rgba(255,255,255,0.5)"
                ctx.fillText("andrewaltair.ge", canvas.width / 2, canvas.height - 15)

                // Download
                const link = document.createElement("a")
                link.download = `quote-${Date.now()}.png`
                link.href = canvas.toDataURL("image/png")
                link.click()
            }
        } catch (error) {
            console.error("Error generating image:", error)
        }

        setIsGenerating(false)
    }, [quote, author, source])

    const handleCopy = () => {
        navigator.clipboard.writeText(`"${quote}" \u2014 ${author}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleShare = (platform: string) => {
        const text = encodeURIComponent(`"${quote}" \u2014 ${author}`)
        const url = encodeURIComponent(window.location.href)

        let shareUrl = ""
        switch (platform) {
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
                break
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?quote=${text}&u=${url}`
                break
        }

        if (shareUrl) {
            window.open(shareUrl, "_blank", "width=600,height=400")
        }
    }

    return (
        <div className={cn("space-y-4", className)}>
            {/* Preview Card */}
            <div
                ref={cardRef}
                className={cn(
                    "relative aspect-video rounded-xl p-8 flex flex-col justify-center items-center text-center text-white bg-gradient-to-br overflow-hidden",
                    gradients[selectedGradient]
                )}
            >
                {/* Quote marks */}
                <span className="absolute top-4 left-6 text-6xl opacity-20 font-serif">&ldquo;</span>
                <span className="absolute bottom-4 right-6 text-6xl opacity-20 font-serif">&rdquo;</span>

                {/* Quote */}
                <blockquote className="text-xl md:text-2xl font-bold leading-relaxed max-w-2xl relative z-10">
                    {quote}
                </blockquote>

                {/* Author */}
                <div className="mt-4 text-white/80">
                    <span className="font-medium">&mdash; {author}</span>
                    {source && <span className="text-white/60 ml-2">({source})</span>}
                </div>

                {/* Watermark */}
                <div className="absolute bottom-2 text-xs text-white/40">
                    andrewaltair.ge
                </div>
            </div>

            {/* Gradient selector */}
            <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground mr-2">ფონი:</span>
                {gradients.map((gradient, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedGradient(i)}
                        className={cn(
                            "w-8 h-8 rounded-full bg-gradient-to-br transition-all",
                            gradient,
                            selectedGradient === i && "ring-2 ring-offset-2 ring-primary scale-110"
                        )}
                    />
                ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
                <Button onClick={handleDownload} disabled={isGenerating} className="gap-2">
                    <Download className="h-4 w-4" />
                    {isGenerating ? "იქმნება..." : "ჩამოტვირთვა"}
                </Button>
                <Button variant="outline" onClick={handleCopy} className="gap-2">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "კოპირებულია!" : "კოპირება"}
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleShare("twitter")}>
                    <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleShare("facebook")}>
                    <Facebook className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

// Simple quote display with share option
export function QuoteBlock({
    quote,
    author,
    onGenerateCard,
}: {
    quote: string
    author?: string
    onGenerateCard?: () => void
}) {
    return (
        <blockquote className="relative border-l-4 border-primary pl-6 py-4 my-6 bg-secondary/30 rounded-r-lg">
            <p className="text-lg italic text-foreground/90">&ldquo;{quote}&rdquo;</p>
            {author && (
                <footer className="mt-2 text-sm text-muted-foreground">&mdash; {author}</footer>
            )}
            {onGenerateCard && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 gap-1"
                    onClick={onGenerateCard}
                >
                    <Sparkles className="h-3 w-3" />
                    შექმენი კარტი
                </Button>
            )}
        </blockquote>
    )
}
