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
 * Overlapping stack of persona "liker" icons (social proof).
 * `overlay` = dark glass pill for placing ON TOP of a card photo.
 * Each avatar carries the persona name as a hover tooltip (title attr).
 */
export function PersonaLikeStack({
    likedBy,
    max = 5,
    size = "sm",
    showCount = true,
    overlay = false,
    className,
}: {
    likedBy?: Liker[]
    max?: number
    size?: PersonaAvatarSize
    showCount?: boolean
    overlay?: boolean
    className?: string
}) {
    if (!likedBy || likedBy.length === 0) return null
    const shown = likedBy.slice(0, max)
    const extra = likedBy.length - shown.length
    const ring = overlay ? "ring-black/30" : "ring-background"

    return (
        <div
            className={cn(
                "flex items-center gap-2",
                overlay && "bg-black/55 backdrop-blur-md rounded-full px-2.5 py-1 border border-white/10 shadow-lg",
                className,
            )}
        >
            <TbHeart className={cn("w-4 h-4 fill-current shrink-0", overlay ? "text-red-400" : "text-red-500")} />
            <div className="flex -space-x-2">
                {shown.map((l) => (
                    <PersonaAvatar
                        key={l.personaId}
                        personaId={l.personaId}
                        size={size}
                        title={l.name}
                        className={cn("ring-2", ring)}
                    />
                ))}
                {extra > 0 && (
                    <span className={cn(
                        "inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-medium ring-2 shrink-0",
                        ring,
                        overlay ? "bg-white/15 text-white" : "bg-muted text-muted-foreground",
                    )}>
                        +{extra}
                    </span>
                )}
            </div>
            {showCount && (
                <span className={cn("text-xs", overlay ? "text-white/90" : "text-muted-foreground")}>
                    {likedBy.length}-მა მოიწონა
                </span>
            )}
        </div>
    )
}

export default PersonaLikeStack
