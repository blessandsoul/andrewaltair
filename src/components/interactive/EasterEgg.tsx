"use client"

import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Sparkles, X } from "lucide-react"

// Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI_CODE = [
    "ArrowUp", "ArrowUp",
    "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight",
    "ArrowLeft", "ArrowRight",
    "KeyB", "KeyA"
]

interface EasterEggProps {
    onActivate?: () => void
    children?: React.ReactNode
}

export function EasterEgg({ onActivate, children }: EasterEggProps) {
    const [sequence, setSequence] = useState<string[]>([])
    const [isActivated, setIsActivated] = useState(false)
    const [showReward, setShowReward] = useState(false)

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const newSequence = [...sequence, e.code].slice(-KONAMI_CODE.length)
        setSequence(newSequence)

        // Check if the sequence matches Konami code
        if (newSequence.join(",") === KONAMI_CODE.join(",")) {
            setIsActivated(true)
            setShowReward(true)
            onActivate?.()

            // Reset after animation
            setTimeout(() => {
                setSequence([])
            }, 100)
        }
    }, [sequence, onActivate])

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [handleKeyDown])

    const closeReward = () => {
        setShowReward(false)
    }

    if (!showReward) return null

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Confetti effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 50 }).map((_, i) => (
                    <div
                        key={i}
                        className="confetti-piece absolute w-3 h-3"
                        style={{
                            left: `${Math.random() * 100}%`,
                            backgroundColor: [
                                "#6366f1", "#22d3ee", "#ec4899", "#f59e0b", "#10b981"
                            ][Math.floor(Math.random() * 5)],
                            animationDelay: `${Math.random() * 2}s`,
                            transform: `rotate(${Math.random() * 360}deg)`,
                        }}
                    />
                ))}
            </div>

            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={closeReward}
            />

            {/* Reward card */}
            <div className="relative animate-in zoom-in-95 fade-in duration-500">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary via-accent to-primary rounded-3xl blur-xl opacity-50 animate-pulse" />
                <div className="relative rounded-2xl bg-card p-8 shadow-2xl border max-w-md text-center">
                    <button
                        onClick={closeReward}
                        className="absolute right-4 top-4 p-1 rounded-full hover:bg-secondary transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Icon */}
                    <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Sparkles className="h-10 w-10 text-white" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold mb-2">
                        🎉 კონამი კოდი გააქტიურებულია!
                    </h2>

                    {/* Message */}
                    <p className="text-muted-foreground mb-6">
                        შენ აღმოაჩინე საიდუმლო! მადლობა რომ დროს უთმობ ჩემს საიტს.
                        ეს პატარა საჩუქარია შენთვის!
                    </p>

                    {/* Custom content or default badge */}
                    {children || (
                        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 px-4 py-2 border border-primary/30">
                            <span className="text-2xl">🏆</span>
                            <span className="font-medium">კოდის მაძიებელი</span>
                        </div>
                    )}

                    {/* Secret message */}
                    <p className="mt-6 text-xs text-muted-foreground/60">
                        ↑ ↑ ↓ ↓ ← → ← → B A
                    </p>
                </div>
            </div>

            {/* Add styles for confetti */}
            <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti-piece {
          animation: confetti-fall 3s ease-out forwards;
        }
      `}</style>
        </div>
    )
}

// Secret click pattern detector (click 5 times on logo)
export function SecretClickPattern({
    clicks = 5,
    timeout = 2000,
    onActivate,
}: {
    clicks?: number
    timeout?: number
    onActivate?: () => void
}) {
    const [clickCount, setClickCount] = useState(0)
    const [lastClickTime, setLastClickTime] = useState(0)

    const handleClick = () => {
        const now = Date.now()

        if (now - lastClickTime > timeout) {
            setClickCount(1)
        } else {
            const newCount = clickCount + 1
            setClickCount(newCount)

            if (newCount >= clicks) {
                onActivate?.()
                setClickCount(0)
            }
        }

        setLastClickTime(now)
    }

    return { handleClick, clickCount }
}

// Hidden icon treasure (for treasure hunt)
export function HiddenTreasure({
    id,
    className,
    onFind,
}: {
    id: string
    className?: string
    onFind?: (id: string) => void
}) {
    const [found, setFound] = useState(false)
    const [hovered, setHovered] = useState(false)

    useEffect(() => {
        const foundItems = JSON.parse(localStorage.getItem("treasures-found") || "[]")
        if (foundItems.includes(id)) {
            setFound(true)
        }
    }, [id])

    const handleClick = () => {
        if (found) return

        setFound(true)
        const foundItems = JSON.parse(localStorage.getItem("treasures-found") || "[]")
        localStorage.setItem("treasures-found", JSON.stringify([...foundItems, id]))
        onFind?.(id)
    }

    return (
        <button
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={cn(
                "absolute opacity-5 hover:opacity-100 transition-all duration-500 cursor-pointer",
                found && "opacity-100",
                className
            )}
        >
            {found ? (
                <span className="text-xl animate-bounce">💎</span>
            ) : (
                <span className={cn("text-lg", hovered && "animate-pulse")}>
                    {hovered ? "👀" : "·"}
                </span>
            )}
        </button>
    )
}
