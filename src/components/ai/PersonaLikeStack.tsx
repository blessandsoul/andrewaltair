"use client"

import * as React from "react"
import { TbHeart } from "react-icons/tb"

import { cn } from "@/lib/utils"
import { PersonaAvatar, type PersonaAvatarSize } from "@/components/ai/PersonaAvatar"

export interface Liker {
    personaId: string
    name: string
}

/**
 * Overlapping stack of persona "liker" icons (social proof), mirroring the
 * flex -space-x-2 pattern used in AuroraReactionBar / bots page.
 */
export function PersonaLikeStack({
    likedBy,
    max = 5,
    size = "sm",
    showCount = true,
    className,
}: {
    likedBy?: Liker[]
    max?: number
    size?: PersonaAvatarSize
    showCount?: boolean
    className?: string
}) {
    if (!likedBy || likedBy.length === 0) return null
    const shown = likedBy.slice(0, max)
    const extra = likedBy.length - shown.length

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <TbHeart className="w-4 h-4 text-red-500 fill-current shrink-0" />
            <div className="flex -space-x-2">
                {shown.map((l) => (
                    <PersonaAvatar
                        key={l.personaId}
                        personaId={l.personaId}
                        size={size}
                        title={l.name}
                        className="ring-2 ring-background"
                    />
                ))}
                {extra > 0 && (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted text-[10px] font-medium text-muted-foreground ring-2 ring-background shrink-0">
                        +{extra}
                    </span>
                )}
            </div>
            {showCount && (
                <span className="text-xs text-muted-foreground">
                    {likedBy.length}-მა მოიწონა
                </span>
            )}
        </div>
    )
}

export default PersonaLikeStack
