"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { brand } from "@/lib/brand"
import { useVisitorTracking } from "@/hooks/useVisitorTracking"

interface AuroraReactionBarProps {
    reactions: {
        fire: number
        love: number
        mindblown: number
        applause: number
        insightful: number
    }
    postId?: string
    postTitle?: string
    onReact?: (key: string) => void
    className?: string
}

// Particle component for confetti effect
function Particle({ emoji, onComplete }: { emoji: string; onComplete: () => void }) {
    React.useEffect(() => {
        const timer = setTimeout(onComplete, 1000)
        return () => clearTimeout(timer)
    }, [onComplete])

    const randomX = Math.random() * 60 - 30
    const randomRotate = Math.random() * 360

    return (
        <span
            className="absolute pointer-events-none text-2xl animate-particle z-50"
            style={{
                '--tx': `${randomX}px`,
                '--rotate': `${randomRotate}deg`,
            } as React.CSSProperties}
        >
            {emoji}
        </span>
    )
}

// Reaction colors for glow effects
const reactionColors: Record<string, { glow: string; bg: string; border: string }> = {
    fire: {
        glow: "shadow-[0_0_20px_rgba(251,146,60,0.5)]",
        bg: "bg-gradient-to-br from-orange-500/20 to-red-500/10",
        border: "border-orange-500/30"
    },
    love: {
        glow: "shadow-[0_0_20px_rgba(244,63,94,0.5)]",
        bg: "bg-gradient-to-br from-rose-500/20 to-pink-500/10",
        border: "border-rose-500/30"
    },
    mindblown: {
        glow: "shadow-[0_0_20px_rgba(168,85,247,0.5)]",
        bg: "bg-gradient-to-br from-purple-500/20 to-violet-500/10",
        border: "border-purple-500/30"
    },
    applause: {
        glow: "shadow-[0_0_20px_rgba(34,211,238,0.5)]",
        bg: "bg-gradient-to-br from-cyan-500/20 to-blue-500/10",
        border: "border-cyan-500/30"
    },
    insightful: {
        glow: "shadow-[0_0_20px_rgba(250,204,21,0.5)]",
        bg: "bg-gradient-to-br from-yellow-500/20 to-amber-500/10",
        border: "border-yellow-500/30"
    },
}

export function AuroraReactionBar({ reactions, postId, postTitle, onReact, className }: AuroraReactionBarProps) {
    const [userReactions, setUserReactions] = React.useState<Set<string>>(new Set())
    const [localReactions, setLocalReactions] = React.useState(reactions)
    const [particles, setParticles] = React.useState<{ id: number; emoji: string; key: string }[]>([])
    const [animatingKeys, setAnimatingKeys] = React.useState<Set<string>>(new Set())
    const { recordActivity } = useVisitorTracking()
    const particleId = React.useRef(0)

    const handleReact = (key: string, emoji: string) => {
        const newUserReactions = new Set(userReactions)
        const newLocalReactions = { ...localReactions }

        if (userReactions.has(key)) {
            newUserReactions.delete(key)
            newLocalReactions[key as keyof typeof reactions] -= 1
        } else {
            newUserReactions.add(key)
            newLocalReactions[key as keyof typeof reactions] += 1

            // Spawn particles
            const newParticles = Array.from({ length: 6 }, () => ({
                id: particleId.current++,
                emoji,
                key
            }))
            setParticles(prev => [...prev, ...newParticles])

            // Trigger pulse animation
            setAnimatingKeys(prev => new Set(prev).add(key))
            setTimeout(() => {
                setAnimatingKeys(prev => {
                    const next = new Set(prev)
                    next.delete(key)
                    return next
                })
            }, 500)

            // Track activity
            if (postId) {
                recordActivity('reaction', {
                    targetType: 'post',
                    targetId: postId,
                    targetTitle: postTitle,
                    metadata: { reactionType: key, emoji },
                    isPublic: true
                })
            }
        }

        setUserReactions(newUserReactions)
        setLocalReactions(newLocalReactions)
        onReact?.(key)
    }

    const removeParticle = React.useCallback((id: number) => {
        setParticles(prev => prev.filter(p => p.id !== id))
    }, [])

    return (
        <div className={cn("relative", className)}>
            {/* Floating label that appears on hover */}
            <div className="flex items-center gap-3 p-2 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-xl">
                {brand.reactions.map((reaction) => {
                    const count = localReactions[reaction.key as keyof typeof reactions]
                    const isActive = userReactions.has(reaction.key)
                    const isAnimating = animatingKeys.has(reaction.key)
                    const colors = reactionColors[reaction.key]

                    return (
                        <div key={reaction.key} className="relative group">
                            {/* Tooltip */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                {reaction.label}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                            </div>

                            {/* Particles container */}
                            <div className="absolute inset-0 flex items-center justify-center overflow-visible">
                                {particles.filter(p => p.key === reaction.key).map(p => (
                                    <Particle key={p.id} emoji={p.emoji} onComplete={() => removeParticle(p.id)} />
                                ))}
                            </div>

                            <button
                                onClick={() => handleReact(reaction.key, reaction.emoji)}
                                className={cn(
                                    "relative flex flex-col items-center justify-center gap-0.5 px-4 py-2.5 rounded-xl border-2 transition-all duration-300 overflow-hidden group/btn",
                                    "hover:scale-110 active:scale-95",
                                    isActive
                                        ? cn(colors.bg, colors.border, colors.glow)
                                        : "bg-secondary/30 border-transparent hover:bg-secondary/50",
                                    isAnimating && "animate-pulse scale-110"
                                )}
                            >
                                {/* Glow ring effect */}
                                {isActive && (
                                    <div className={cn(
                                        "absolute inset-0 rounded-xl opacity-50 animate-ping",
                                        colors.bg
                                    )} />
                                )}

                                {/* Emoji with bounce */}
                                <span className={cn(
                                    "text-3xl transition-transform duration-300 relative z-10",
                                    "group-hover/btn:scale-110 group-hover/btn:-translate-y-0.5",
                                    isActive && "drop-shadow-lg"
                                )}>
                                    {reaction.emoji}
                                </span>

                                {/* Count with slide-up animation */}
                                <span className={cn(
                                    "text-xs font-bold tabular-nums transition-all duration-300 relative z-10 min-w-[1.5rem]",
                                    isActive
                                        ? "text-foreground"
                                        : "text-muted-foreground group-hover/btn:text-foreground"
                                )}>
                                    {count > 0 ? count.toLocaleString() : ""}
                                </span>
                            </button>
                        </div>
                    )
                })}
            </div>

            {/* Total reactions count - LinkedIn style stacked */}
            <div className="mt-4 flex items-center gap-2">
                <div className="flex -space-x-1">
                    {Object.entries(localReactions)
                        .filter(([, count]) => count > 0)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 3)
                        .map(([key]) => {
                            const emoji = brand.reactions.find(r => r.key === key)?.emoji
                            return (
                                <span
                                    key={key}
                                    className="text-lg p-1 bg-card rounded-full border-2 border-background shadow-sm"
                                >
                                    {emoji}
                                </span>
                            )
                        })}
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                    {Object.values(localReactions).reduce((a, b) => a + b, 0).toLocaleString()} რეაქცია
                </span>
            </div>

            {/* CSS for particle animation */}
            <style jsx>{`
                @keyframes particle {
                    0% {
                        opacity: 1;
                        transform: translateY(0) translateX(0) rotate(0deg) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-60px) translateX(var(--tx)) rotate(var(--rotate)) scale(0.5);
                    }
                }
                .animate-particle {
                    animation: particle 1s ease-out forwards;
                }
            `}</style>
        </div>
    )
}

export default AuroraReactionBar
