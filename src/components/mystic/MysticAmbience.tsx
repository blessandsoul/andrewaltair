"use client"

import { useState, useEffect, useRef } from "react"
import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react"

// Ambient sound URLs (using free sound effects or generate our own)
const AMBIENT_SOUNDS = {
    cosmic: "https://assets.mixkit.co/music/preview/mixkit-forest-ambience-1213.mp3",
    wind: "https://assets.mixkit.co/music/preview/mixkit-forest-wind-with-birds-1214.mp3",
}

export function MysticAmbience() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [volume, setVolume] = useState(0.3)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        // Check localStorage for saved preference
        const savedPref = localStorage.getItem("mystic_ambience")
        if (savedPref === "on") {
            // Don't auto-play due to browser restrictions, but show the UI
            setIsVisible(true)
        }
        setIsVisible(true) // Always show after mount
    }, [])

    useEffect(() => {
        if (isPlaying && !audioRef.current) {
            // Create audio element
            const audio = new Audio(AMBIENT_SOUNDS.cosmic)
            audio.loop = true
            audio.volume = volume
            audioRef.current = audio

            audio.play().catch(() => {
                // Browser blocked autoplay
                setIsPlaying(false)
            })
        } else if (!isPlaying && audioRef.current) {
            audioRef.current.pause()
            audioRef.current = null
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
        }
    }, [isPlaying, volume])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume])

    const toggleSound = () => {
        const newState = !isPlaying
        setIsPlaying(newState)
        localStorage.setItem("mystic_ambience", newState ? "on" : "off")
    }

    if (!isVisible) return null

    return (
        <div className="fixed top-4 left-4 z-50">
            <div className="flex items-center gap-2">
                {/* Sound toggle button */}
                <button
                    onClick={toggleSound}
                    className={`group relative p-3 rounded-xl transition-all duration-300
                     ${isPlaying
                            ? 'bg-purple-500/20 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                            : 'bg-slate-900/80 border-slate-700/50 hover:bg-slate-800/80'
                        } border backdrop-blur-sm`}
                    title={isPlaying ? "გამორთე ხმა" : "ჩართე ატმოსფერული ხმა"}
                >
                    {isPlaying ? (
                        <SpeakerHigh size={20} className="text-purple-400" weight="duotone" />
                    ) : (
                        <SpeakerSlash size={20} className="text-slate-400 group-hover:text-white" />
                    )}

                    {/* Sound waves animation when playing */}
                    {isPlaying && (
                        <div className="absolute inset-0 rounded-xl overflow-hidden">
                            <div className="absolute inset-0 animate-ping opacity-20 bg-purple-500 rounded-xl"
                                style={{ animationDuration: '2s' }} />
                        </div>
                    )}
                </button>

                {/* Volume slider - visible when playing */}
                {isPlaying && (
                    <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/50 
                          rounded-xl px-3 py-2 backdrop-blur-sm animate-in slide-in-from-left-2">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-3
                        [&::-webkit-slider-thumb]:h-3
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-purple-400"
                        />
                        <span className="text-xs text-slate-400 w-8">{Math.round(volume * 100)}%</span>
                    </div>
                )}
            </div>

            {/* First-time hint */}
            {!isPlaying && (
                <div className="absolute top-full left-0 mt-2 opacity-0 group-hover:opacity-100
                        transition-opacity duration-200 pointer-events-none">
                    <div className="bg-slate-900/95 border border-slate-700 rounded-lg px-3 py-2 
                          text-xs text-slate-300 whitespace-nowrap">
                        🎵 ატმოსფერული მუსიკა
                    </div>
                </div>
            )}
        </div>
    )
}
