"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { brand } from "@/lib/brand"

interface ReactionBarProps {
    reactions: {
        fire: number
        love: number
        mindblown: number
        applause: number
        insightful: number
    }
    onReact?: (key: string) => void
    className?: string
    size?: "sm" | "md" | "lg"
}

export function ReactionBar({ reactions, onReact, className, size = "md" }: ReactionBarProps) {
    const [userReactions, setUserReactions] = React.useState<Set<string>>(new Set())
    const [localReactions, setLocalReactions] = React.useState(reactions)

    const handleReact = (key: string) => {
        const newUserReactions = new Set(userReactions)
        const newLocalReactions = { ...localReactions }

        if (userReactions.has(key)) {
            newUserReactions.delete(key)
            newLocalReactions[key as keyof typeof reactions] -= 1
        } else {
            newUserReactions.add(key)
            newLocalReactions[key as keyof typeof reactions] += 1
        }

        setUserReactions(newUserReactions)
        setLocalReactions(newLocalReactions)
        onReact?.(key)
    }

    const sizeClasses = {
        sm: "text-sm gap-1 px-2 py-1",
        md: "text-base gap-2 px-3 py-2",
        lg: "text-lg gap-3 px-4 py-3",
    }

    const emojiSizes = {
        sm: "text-lg",
        md: "text-2xl",
        lg: "text-3xl",
    }

    return (
        <div className={cn("flex flex-wrap gap-2", className)}>
            {brand.reactions.map((reaction) => {
                const count = localReactions[reaction.key as keyof typeof reactions]
                const isActive = userReactions.has(reaction.key)

                return (
                    <button
                        key={reaction.key}
                        onClick={() => handleReact(reaction.key)}
                        className={cn(
                            "flex items-center rounded-full border transition-all duration-200",
                            sizeClasses[size],
                            isActive
                                ? "bg-primary/10 border-primary/30 scale-105"
                                : "bg-card border-border hover:bg-secondary hover:scale-105"
                        )}
                        title={reaction.label}
                    >
                        <span className={cn("transition-transform", emojiSizes[size], isActive && "animate-bounce")}>
                            {reaction.emoji}
                        </span>
                        <span className={cn(
                            "font-medium tabular-nums",
                            isActive ? "text-primary" : "text-muted-foreground"
                        )}>
                            {count > 0 ? count : ""}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

// Compact version for cards
export function ReactionBarCompact({ reactions, className }: { reactions: ReactionBarProps["reactions"], className?: string }) {
    const total = Object.values(reactions).reduce((a, b) => a + b, 0)

    // Get top 3 reactions
    const topReactions = Object.entries(reactions)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([key]) => brand.reactions.find(r => r.key === key)?.emoji)
        .filter(Boolean)

    return (
        <div className={cn("flex items-center gap-1 text-sm text-muted-foreground", className)}>
            <span className="flex -space-x-1">
                {topReactions.map((emoji, i) => (
                    <span key={i} className="text-base">{emoji}</span>
                ))}
            </span>
            <span className="ml-1 font-medium">{total}</span>
        </div>
    )
}
