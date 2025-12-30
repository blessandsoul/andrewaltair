"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Share2, Instagram, Copy, Check, Sparkles } from "lucide-react"

interface ShareCardProps {
    toolName: string
    prediction: string
    userName?: string
    date?: string
    gradient?: string
}

export function ShareCard({ toolName, prediction, userName, date, gradient = "from-purple-600 via-pink-600 to-indigo-600" }: ShareCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [isCopied, setIsCopied] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)

    const handleCopy = async () => {
        const text = `🔮 ${toolName}\n\n${prediction}\n\n— ${userName || 'ანონიმი'}\n📅 ${date || new Date().toLocaleDateString('ka-GE')}\n\n✨ andrewaltair.ge/mystic`
        await navigator.clipboard.writeText(text)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    const handleShare = async () => {
        const text = `🔮 ${toolName}\n\n${prediction}\n\n✨ andrewaltair.ge/mystic`
        if (navigator.share) {
            await navigator.share({
                text,
                url: window.location.href
            })
        } else {
            handleCopy()
        }
    }

    const handleDownload = async () => {
        if (!cardRef.current) return
        setIsDownloading(true)

        try {
            // Use html2canvas dynamically - optional dependency
            // @ts-expect-error html2canvas may not be installed
            const html2canvas = (await import('html2canvas')).default
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2,
            })

            const link = document.createElement('a')
            link.download = `mystic-${toolName.toLowerCase()}-${Date.now()}.png`
            link.href = canvas.toDataURL('image/png')
            link.click()
        } catch (error) {
            console.error('Download failed:', error)
            // Fallback: copy text
            handleCopy()
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* Preview card */}
            <div
                ref={cardRef}
                className={`p-6 rounded-2xl bg-gradient-to-br ${gradient} relative overflow-hidden`}
            >
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-white/10 blur-xl" />
                </div>

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-white/90" />
                        <span className="text-white/90 font-semibold">{toolName}</span>
                    </div>

                    {/* Prediction text */}
                    <p className="text-white text-lg leading-relaxed mb-6 font-medium">
                        "{prediction}"
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                        <div>
                            <p className="text-white/80 text-sm">— {userName || 'ანონიმი'}</p>
                            <p className="text-white/60 text-xs">{date || new Date().toLocaleDateString('ka-GE')}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-white/80 text-xs font-medium">andrewaltair.ge</p>
                            <p className="text-white/60 text-[10px]">მისტიკური AI</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-3 gap-2">
                <Button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    variant="outline"
                    className="h-10 rounded-xl border-white/10 text-white hover:bg-white/5 bg-transparent text-xs"
                >
                    {isDownloading ? (
                        <span className="animate-pulse">...</span>
                    ) : (
                        <>
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            ჩამოტვირთვა
                        </>
                    )}
                </Button>
                <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="h-10 rounded-xl border-white/10 text-white hover:bg-white/5 bg-transparent text-xs"
                >
                    {isCopied ? (
                        <>
                            <Check className="w-3.5 h-3.5 mr-1.5 text-green-400" />
                            დაკოპირდა
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5 mr-1.5" />
                            კოპირება
                        </>
                    )}
                </Button>
                <Button
                    onClick={handleShare}
                    className="h-10 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white border-0 text-xs"
                >
                    <Share2 className="w-3.5 h-3.5 mr-1.5" />
                    გაზიარება
                </Button>
            </div>

            {/* Instagram tip */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                <Instagram className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <p className="text-xs text-gray-400">
                    ჩამოტვირთე და გააზიარე Instagram Story-ზე!
                </p>
            </div>
        </div>
    )
}
