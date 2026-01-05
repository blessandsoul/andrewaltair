"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, VolumeX, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MysticAmbience() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const AMBIENCE_URL = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-impulse-3032.mp3" // Royalty free zen sound

    const togglePlay = async () => {
        if (!audioRef.current) {
            audioRef.current = new Audio(AMBIENCE_URL)
            audioRef.current.loop = true
            audioRef.current.volume = 0.4
        }

        if (isPlaying) {
            audioRef.current.pause()
            setIsPlaying(false)
        } else {
            setIsLoading(true)
            try {
                await audioRef.current.play()
                setIsPlaying(true)
            } catch (error) {
                console.error("Audio playback error:", error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    // Fade out on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                const fadeOut = setInterval(() => {
                    if (audioRef.current && audioRef.current.volume > 0.05) {
                        audioRef.current.volume -= 0.05
                    } else {
                        clearInterval(fadeOut)
                        audioRef.current?.pause()
                    }
                }, 100)
            }
        }
    }, [])

    return (
        <Button
            onClick={togglePlay}
            variant="outline"
            size="icon"
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border-white/10 hover:bg-white/10 text-white shadow-lg transition-all hover:scale-105"
            aria-label="Toggle Ambience"
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
            ) : isPlaying ? (
                <Volume2 className="w-5 h-5 text-purple-400" />
            ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
            )}

            {/* Pulse effect when playing */}
            {isPlaying && (
                <span className="absolute inset-0 rounded-full animate-ping bg-purple-500/20 duration-1000" />
            )}
        </Button>
    )
}
