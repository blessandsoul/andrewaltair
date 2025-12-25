"use client"

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Gift, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Prize {
    id: string
    name: string
    emoji: string
    color: string
    probability: number
}

const PRIZES: Prize[] = [
    { id: "ebook", name: "უფასო E-Book", emoji: "📚", color: "#6366f1", probability: 15 },
    { id: "discount10", name: "10% ფასდაკლება", emoji: "💰", color: "#22d3ee", probability: 20 },
    { id: "discount25", name: "25% ფასდაკლება", emoji: "🎁", color: "#10b981", probability: 10 },
    { id: "prompts", name: "50 პრომპტი", emoji: "🤖", color: "#f59e0b", probability: 15 },
    { id: "course", name: "უფასო კურსი", emoji: "🎓", color: "#ec4899", probability: 5 },
    { id: "tryagain", name: "ცადე ხელახლა", emoji: "🔄", color: "#71717a", probability: 20 },
    { id: "bonus", name: "ბონუს ქულები", emoji: "⭐", color: "#8b5cf6", probability: 15 },
]

interface SpinWheelProps {
    isOpen: boolean
    onClose: () => void
    onWin?: (prize: Prize) => void
}

export function SpinWheel({ isOpen, onClose, onWin }: SpinWheelProps) {
    const [isSpinning, setIsSpinning] = useState(false)
    const [rotation, setRotation] = useState(0)
    const [winner, setWinner] = useState<Prize | null>(null)
    const [spinCount, setSpinCount] = useState(0)
    const wheelRef = useRef<HTMLDivElement>(null)

    const spin = () => {
        if (isSpinning) return

        setIsSpinning(true)
        setWinner(null)

        // Select winner based on probability
        const random = Math.random() * 100
        let cumulative = 0
        let selectedPrize = PRIZES[0]

        for (const prize of PRIZES) {
            cumulative += prize.probability
            if (random <= cumulative) {
                selectedPrize = prize
                break
            }
        }

        // Calculate rotation
        const prizeIndex = PRIZES.findIndex((p) => p.id === selectedPrize.id)
        const degreesPerSlice = 360 / PRIZES.length
        const prizeAngle = prizeIndex * degreesPerSlice
        const baseRotations = 5 // Number of full rotations
        const targetRotation = baseRotations * 360 + (360 - prizeAngle - degreesPerSlice / 2)

        setRotation((prev) => prev + targetRotation)
        setSpinCount((prev) => prev + 1)

        // Show winner after animation
        setTimeout(() => {
            setIsSpinning(false)
            setWinner(selectedPrize)
            onWin?.(selectedPrize)
        }, 5000)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={!isSpinning ? onClose : undefined}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg rounded-2xl bg-card shadow-2xl overflow-hidden">
                {/* Close button */}
                {!isSpinning && (
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 z-10 p-2 rounded-full bg-secondary/80 hover:bg-secondary transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}

                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-accent p-6 text-center text-white">
                    <Gift className="mx-auto h-10 w-10 mb-2" />
                    <h2 className="text-2xl font-bold">დატრიალე ბორბალი! 🎰</h2>
                    <p className="text-white/80">მოიგე საჩუქარი</p>
                </div>

                {/* Wheel container */}
                <div className="relative p-8 flex flex-col items-center">
                    {/* Pointer */}
                    <div className="absolute top-8 z-10 w-4 h-8">
                        <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-primary drop-shadow-lg" />
                    </div>

                    {/* Wheel */}
                    <div
                        ref={wheelRef}
                        className="relative w-64 h-64 rounded-full border-4 border-primary shadow-2xl overflow-hidden"
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            transition: isSpinning ? "transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
                        }}
                    >
                        {PRIZES.map((prize, index) => {
                            const degreesPerSlice = 360 / PRIZES.length
                            const skewDegrees = 90 - degreesPerSlice

                            return (
                                <div
                                    key={prize.id}
                                    className="absolute w-1/2 h-1/2 origin-bottom-right"
                                    style={{
                                        transform: `rotate(${index * degreesPerSlice}deg) skewY(${skewDegrees}deg)`,
                                        backgroundColor: prize.color,
                                    }}
                                >
                                    <span
                                        className="absolute text-2xl"
                                        style={{
                                            transform: `skewY(-${skewDegrees}deg) rotate(${degreesPerSlice / 2}deg)`,
                                            left: "40%",
                                            top: "20%",
                                        }}
                                    >
                                        {prize.emoji}
                                    </span>
                                </div>
                            )
                        })}
                        {/* Center circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-card border-4 border-primary shadow-lg flex items-center justify-center">
                            <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                    </div>

                    {/* Spin button or result */}
                    <div className="mt-8 text-center">
                        {winner ? (
                            <div className="animate-in zoom-in fade-in duration-500">
                                <div className="text-4xl mb-2">{winner.emoji}</div>
                                <p className="text-lg font-bold">{winner.name}</p>
                                {winner.id !== "tryagain" && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                        გილოცავ! კოდი გამოგიგზავნეთ ელ-ფოსტაზე
                                    </p>
                                )}
                                <Button onClick={onClose} className="mt-4">
                                    დახურვა
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={spin}
                                disabled={isSpinning}
                                size="lg"
                                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white px-8"
                            >
                                {isSpinning ? (
                                    <span className="animate-pulse">ტრიალებს...</span>
                                ) : (
                                    <>
                                        <Gift className="mr-2 h-5 w-5" />
                                        დატრიალე!
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                    {!winner && !isSpinning && spinCount === 0 && (
                        <p className="text-xs text-muted-foreground mt-4 text-center">
                            გამოიწერე ნიუსლეთერი რომ ითამაშო
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

// Hook to control spin wheel
export function useSpinWheel() {
    const [isOpen, setIsOpen] = useState(false)
    const [hasPlayed, setHasPlayed] = useState(false)

    const checkEligibility = () => {
        const played = localStorage.getItem("spinwheel-played")
        setHasPlayed(!!played)
        return !played
    }

    const markPlayed = () => {
        localStorage.setItem("spinwheel-played", Date.now().toString())
        setHasPlayed(true)
    }

    return {
        isOpen,
        hasPlayed,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        checkEligibility,
        markPlayed,
    }
}
