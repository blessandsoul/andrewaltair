"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Volume2, VolumeX, Pause, Play, SkipBack, SkipForward, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ArticleNarratorProps {
    content: string
    title?: string
    className?: string
}

export function ArticleNarrator({
    content,
    title,
    className,
}: ArticleNarratorProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [progress, setProgress] = useState(0)
    const [speed, setSpeed] = useState(1)
    const [isSupported, setIsSupported] = useState(true)
    const [showSettings, setShowSettings] = useState(false)
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
    const textChunksRef = useRef<string[]>([])
    const currentChunkRef = useRef(0)

    useEffect(() => {
        if (!window.speechSynthesis) {
            setIsSupported(false)
            return
        }

        // Split content into chunks for tracking progress
        textChunksRef.current = content
            .replace(/<[^>]*>/g, "") // Remove HTML tags
            .split(/(?<=[.!?])\s+/)
            .filter((s) => s.trim().length > 0)

        return () => {
            window.speechSynthesis.cancel()
        }
    }, [content])

    const speak = (startFromChunk = 0) => {
        if (!window.speechSynthesis) return

        window.speechSynthesis.cancel()
        currentChunkRef.current = startFromChunk

        const speakChunk = () => {
            if (currentChunkRef.current >= textChunksRef.current.length) {
                setIsPlaying(false)
                setProgress(100)
                return
            }

            const text = textChunksRef.current[currentChunkRef.current]
            const utterance = new SpeechSynthesisUtterance(text)

            // Try to use Georgian voice, fallback to default
            const voices = window.speechSynthesis.getVoices()
            const georgianVoice = voices.find((v) => v.lang.startsWith("ka"))
            if (georgianVoice) {
                utterance.voice = georgianVoice
            }

            utterance.rate = speed
            utterance.pitch = 1

            utterance.onend = () => {
                currentChunkRef.current++
                setProgress((currentChunkRef.current / textChunksRef.current.length) * 100)
                speakChunk()
            }

            utterance.onerror = () => {
                setIsPlaying(false)
            }

            utteranceRef.current = utterance
            window.speechSynthesis.speak(utterance)
        }

        setIsPlaying(true)
        setIsPaused(false)

        // Start with title if provided
        if (title && startFromChunk === 0) {
            const titleUtterance = new SpeechSynthesisUtterance(title)
            titleUtterance.rate = speed
            titleUtterance.onend = () => speakChunk()
            window.speechSynthesis.speak(titleUtterance)
        } else {
            speakChunk()
        }
    }

    const togglePlayPause = () => {
        if (!window.speechSynthesis) return

        if (isPlaying && !isPaused) {
            window.speechSynthesis.pause()
            setIsPaused(true)
        } else if (isPaused) {
            window.speechSynthesis.resume()
            setIsPaused(false)
        } else {
            speak(0)
        }
    }

    const stop = () => {
        window.speechSynthesis.cancel()
        setIsPlaying(false)
        setIsPaused(false)
        setProgress(0)
        currentChunkRef.current = 0
    }

    const skipBack = () => {
        const newChunk = Math.max(0, currentChunkRef.current - 3)
        speak(newChunk)
    }

    const skipForward = () => {
        const newChunk = Math.min(textChunksRef.current.length - 1, currentChunkRef.current + 3)
        speak(newChunk)
    }

    const changeSpeed = (newSpeed: number) => {
        setSpeed(newSpeed)
        if (isPlaying) {
            // Restart with new speed from current position
            speak(currentChunkRef.current)
        }
    }

    if (!isSupported) return null

    return (
        <div className={cn("rounded-xl border bg-card p-4", className)}>
            <div className="flex items-center gap-4">
                {/* Play/Pause button */}
                <Button
                    size="icon"
                    variant={isPlaying ? "default" : "outline"}
                    onClick={togglePlayPause}
                    className="h-12 w-12 rounded-full"
                >
                    {isPlaying && !isPaused ? (
                        <Pause className="h-5 w-5" />
                    ) : (
                        <Play className="h-5 w-5 ml-0.5" />
                    )}
                </Button>

                {/* Progress and controls */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">მოსმენა</span>
                        {isPlaying && (
                            <span className="text-xs text-muted-foreground">
                                {Math.round(progress)}%
                            </span>
                        )}
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Skip controls (visible when playing) */}
                {isPlaying && (
                    <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={skipBack}>
                            <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={skipForward}>
                            <SkipForward className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {/* Stop button (visible when playing) */}
                {isPlaying && (
                    <Button size="icon" variant="ghost" onClick={stop}>
                        <VolumeX className="h-4 w-4" />
                    </Button>
                )}

                {/* Settings */}
                <div className="relative">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowSettings(!showSettings)}
                    >
                        <Settings className="h-4 w-4" />
                    </Button>

                    {showSettings && (
                        <div className="absolute right-0 top-full mt-2 bg-card border rounded-lg shadow-lg p-3 z-10 min-w-[120px]">
                            <p className="text-xs text-muted-foreground mb-2">სიჩქარე</p>
                            <div className="flex gap-1">
                                {[0.75, 1, 1.25, 1.5].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => changeSpeed(s)}
                                        className={cn(
                                            "px-2 py-1 text-xs rounded",
                                            speed === s
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-secondary hover:bg-secondary/80"
                                        )}
                                    >
                                        {s}x
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Floating mini narrator
export function MiniNarrator({
    content,
    className,
}: {
    content: string
    className?: string
}) {
    const [isPlaying, setIsPlaying] = useState(false)

    const togglePlay = () => {
        if (!window.speechSynthesis) return

        if (isPlaying) {
            window.speechSynthesis.cancel()
            setIsPlaying(false)
        } else {
            const text = content.replace(/<[^>]*>/g, "").slice(0, 5000) // Limit length
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.onend = () => setIsPlaying(false)
            window.speechSynthesis.speak(utterance)
            setIsPlaying(true)
        }
    }

    return (
        <button
            onClick={togglePlay}
            className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors",
                isPlaying
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground",
                className
            )}
        >
            {isPlaying ? (
                <>
                    <VolumeX className="h-4 w-4" />
                    <span className="text-sm">გაჩერება</span>
                </>
            ) : (
                <>
                    <Volume2 className="h-4 w-4" />
                    <span className="text-sm">მოსმენა</span>
                </>
            )}
        </button>
    )
}
