"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useVisitorTracking } from "@/hooks/useVisitorTracking"
import {
    TbFlame,
    TbHeart,
    TbMoodCrazyHappy,
    TbHandStop,
    TbBulb,
    TbRocket,
    TbThumbUp,
    TbStar,
    TbMoodSmile,
    TbCrown
} from "react-icons/tb"

// Extended reactions with icons
const REACTIONS = [
    { key: "fire", label: "ცეცხლი", icon: TbFlame, color: "from-orange-500 to-red-500", glow: "rgba(251,146,60,0.6)" },
    { key: "love", label: "სიყვარული", icon: TbHeart, color: "from-rose-500 to-pink-500", glow: "rgba(244,63,94,0.6)" },
    { key: "mindblown", label: "გასაოცარი", icon: TbMoodCrazyHappy, color: "from-purple-500 to-violet-500", glow: "rgba(168,85,247,0.6)" },
    { key: "applause", label: "ტაში", icon: TbHandStop, color: "from-cyan-500 to-blue-500", glow: "rgba(34,211,238,0.6)" },
    { key: "insightful", label: "საინტერესო", icon: TbBulb, color: "from-yellow-500 to-amber-500", glow: "rgba(250,204,21,0.6)" },
    { key: "rocket", label: "რაკეტა", icon: TbRocket, color: "from-indigo-500 to-blue-600", glow: "rgba(99,102,241,0.6)" },
    { key: "like", label: "მომწონს", icon: TbThumbUp, color: "from-emerald-500 to-green-500", glow: "rgba(16,185,129,0.6)" },
    { key: "star", label: "ვარსკვლავი", icon: TbStar, color: "from-amber-400 to-orange-400", glow: "rgba(251,191,36,0.6)" },
    { key: "smile", label: "ღიმილი", icon: TbMoodSmile, color: "from-teal-500 to-cyan-500", glow: "rgba(20,184,166,0.6)" },
    { key: "crown", label: "გვირგვინი", icon: TbCrown, color: "from-yellow-400 to-amber-500", glow: "rgba(250,204,21,0.6)" },
]

interface AuroraReactionBarProps {
    reactions: Record<string, number>
    postId?: string
    postTitle?: string
    onReact?: (key: string) => void
    className?: string
}

// Floating particle for confetti effect
function FloatingParticle({ Icon, color, onComplete }: { Icon: React.ElementType; color: string; onComplete: () => void }) {
    React.useEffect(() => {
        const timer = setTimeout(onComplete, 800)
        return () => clearTimeout(timer)
    }, [onComplete])

    const randomX = Math.random() * 80 - 40
    const randomScale = 0.6 + Math.random() * 0.8

    return (
        <span
            className={cn("absolute pointer-events-none z-50", `text-${color.split(' ')[0].replace('from-', '')}`)}
            style={{
                animation: 'floatUp 0.8s ease-out forwards',
                '--tx': `${randomX}px`,
                '--scale': randomScale,
            } as React.CSSProperties}
        >
            <Icon className="w-5 h-5" />
        </span>
    )
}

export function AuroraReactionBar({ reactions, postId, postTitle, onReact, className }: AuroraReactionBarProps) {
    const [userReactions, setUserReactions] = React.useState<Set<string>>(new Set())
    const [localReactions, setLocalReactions] = React.useState<Record<string, number>>(() => {
        // Initialize with all reaction keys
        const initial: Record<string, number> = {}
        REACTIONS.forEach(r => {
            initial[r.key] = reactions[r.key] || 0
        })
        return initial
    })
    const [particles, setParticles] = React.useState<{ id: number; key: string }[]>([])
    const [pulsingKey, setPulsingKey] = React.useState<string | null>(null)
    const { recordActivity } = useVisitorTracking()
    const particleId = React.useRef(0)

    const handleReact = (key: string) => {
        const newUserReactions = new Set(userReactions)
        const newLocalReactions = { ...localReactions }

        if (userReactions.has(key)) {
            newUserReactions.delete(key)
            newLocalReactions[key] = Math.max(0, (newLocalReactions[key] || 0) - 1)
        } else {
            newUserReactions.add(key)
            newLocalReactions[key] = (newLocalReactions[key] || 0) + 1

            // Spawn particles
            const newParticles = Array.from({ length: 5 }, () => ({
                id: particleId.current++,
                key
            }))
            setParticles(prev => [...prev, ...newParticles])

            // Pulse animation
            setPulsingKey(key)
            setTimeout(() => setPulsingKey(null), 400)

            // Track activity
            if (postId) {
                recordActivity('reaction', {
                    targetType: 'post',
                    targetId: postId,
                    targetTitle: postTitle,
                    metadata: { reactionType: key },
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

    const totalReactions = Object.values(localReactions).reduce((a, b) => a + b, 0)

    return (
        <div className={cn("relative", className)}>
            {/* Main reaction grid */}
            <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-gradient-to-br from-background/80 to-secondary/30 backdrop-blur-xl border border-border/50 shadow-2xl">
                {REACTIONS.map((reaction) => {
                    const count = localReactions[reaction.key] || 0
                    const isActive = userReactions.has(reaction.key)
                    const isPulsing = pulsingKey === reaction.key
                    const Icon = reaction.icon

                    return (
                        <div key={reaction.key} className="relative group">
                            {/* Tooltip */}
                            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 scale-90 group-hover:scale-100">
                                {reaction.label}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                            </div>

                            {/* Particles */}
                            <div className="absolute inset-0 flex items-center justify-center overflow-visible">
                                {particles.filter(p => p.key === reaction.key).map(p => (
                                    <FloatingParticle
                                        key={p.id}
                                        Icon={Icon}
                                        color={reaction.color}
                                        onComplete={() => removeParticle(p.id)}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => handleReact(reaction.key)}
                                className={cn(
                                    "relative flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 transition-all duration-300",
                                    "hover:scale-110 hover:-translate-y-0.5 active:scale-95",
                                    isActive
                                        ? cn(
                                            `bg-gradient-to-br ${reaction.color}`,
                                            "border-white/20 text-white",
                                            "shadow-lg"
                                        )
                                        : "bg-secondary/40 border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                                    isPulsing && "animate-pulse scale-110"
                                )}
                                style={isActive ? {
                                    boxShadow: `0 4px 20px ${reaction.glow}, 0 0 40px ${reaction.glow}`
                                } : undefined}
                            >
                                {/* Icon */}
                                <Icon className={cn(
                                    "w-5 h-5 transition-transform duration-200",
                                    isActive && "drop-shadow-lg",
                                    "group-hover:scale-110"
                                )} />

                                {/* Count */}
                                {count > 0 && (
                                    <span className={cn(
                                        "text-sm font-bold tabular-nums min-w-[1rem] text-center",
                                        isActive ? "text-white" : "text-muted-foreground"
                                    )}>
                                        {count > 999 ? `${(count / 1000).toFixed(1)}k` : count}
                                    </span>
                                )}
                            </button>
                        </div>
                    )
                })}
            </div>

            {/* Total summary - stacked icons */}
            <div className="mt-4 flex items-center gap-3">
                <div className="flex -space-x-2">
                    {Object.entries(localReactions)
                        .filter(([, count]) => count > 0)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 4)
                        .map(([key]) => {
                            const reaction = REACTIONS.find(r => r.key === key)
                            if (!reaction) return null
                            const Icon = reaction.icon
                            return (
                                <span
                                    key={key}
                                    className={cn(
                                        "flex items-center justify-center w-7 h-7 rounded-full border-2 border-background shadow-md",
                                        `bg-gradient-to-br ${reaction.color} text-white`
                                    )}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                </span>
                            )
                        })}
                </div>
                {totalReactions > 0 && (
                    <span className="text-sm text-muted-foreground font-medium">
                        {totalReactions.toLocaleString()} რეაქცია
                    </span>
                )}
            </div>

            {/* Animation styles */}
            <style jsx>{`
                @keyframes floatUp {
                    0% {
                        opacity: 1;
                        transform: translateY(0) translateX(0) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-50px) translateX(var(--tx)) scale(var(--scale));
                    }
                }
            `}</style>
        </div>
    )
}

export default AuroraReactionBar
