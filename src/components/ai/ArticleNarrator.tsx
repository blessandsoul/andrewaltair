"use client"

import { TbVolume } from "react-icons/tb"
import { cn } from "@/lib/utils"

interface MiniNarratorProps {
    content: string
    className?: string
}

// Placeholder MiniNarrator component
// TODO: Implement text-to-speech functionality
export function MiniNarrator({ content, className }: MiniNarratorProps) {
    return (
        <button
            className={cn(
                "hover:bg-secondary transition-colors",
                className
            )}
            title="მოსმენა (მალე)"
            disabled
        >
            <TbVolume className="h-4 w-4 text-muted-foreground" />
        </button>
    )
}

export default MiniNarrator
