"use client"

import { useState, useRef, useEffect, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface FootnoteProps {
    id: string
    children: ReactNode
    note: string
}

// Footnote reference with hover popup
export function Footnote({ id, children, note }: FootnoteProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [position, setPosition] = useState<"above" | "below">("above")
    const triggerRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        if (isVisible && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect()
            const spaceAbove = rect.top
            const spaceBelow = window.innerHeight - rect.bottom

            setPosition(spaceAbove > 200 ? "above" : "below")
        }
    }, [isVisible])

    return (
        <span className="relative inline-block">
            <span
                ref={triggerRef}
                className="cursor-help"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onFocus={() => setIsVisible(true)}
                onBlur={() => setIsVisible(false)}
                tabIndex={0}
            >
                {children}
                <sup className="text-primary font-bold ml-0.5 cursor-pointer hover:underline">
                    [{id}]
                </sup>
            </span>

            {/* Popup */}
            {isVisible && (
                <div
                    className={cn(
                        "absolute left-1/2 -translate-x-1/2 z-50 w-72 max-w-sm",
                        "bg-card border rounded-lg shadow-xl p-4",
                        "animate-in fade-in-0 zoom-in-95 duration-200",
                        position === "above" ? "bottom-full mb-2" : "top-full mt-2"
                    )}
                >
                    {/* Arrow */}
                    <div
                        className={cn(
                            "absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-card border rotate-45",
                            position === "above"
                                ? "bottom-[-6px] border-t-0 border-l-0"
                                : "top-[-6px] border-b-0 border-r-0"
                        )}
                    />

                    {/* Content */}
                    <div className="relative">
                        <div className="text-xs font-bold text-primary mb-1">სქოლიო [{id}]</div>
                        <div className="text-sm text-muted-foreground leading-relaxed">
                            {note}
                        </div>
                    </div>
                </div>
            )}
        </span>
    )
}

// Footnote list at the bottom of article
export function FootnotesList({
    footnotes,
    className,
}: {
    footnotes: { id: string; note: string }[]
    className?: string
}) {
    if (footnotes.length === 0) return null

    return (
        <div className={cn("border-t pt-6 mt-10", className)}>
            <h4 className="font-bold text-lg mb-4">სქოლიოები</h4>
            <ol className="space-y-3 text-sm text-muted-foreground">
                {footnotes.map((fn) => (
                    <li key={fn.id} id={`fn-${fn.id}`} className="flex gap-2">
                        <span className="text-primary font-bold">[{fn.id}]</span>
                        <span>{fn.note}</span>
                    </li>
                ))}
            </ol>
        </div>
    )
}

// Tooltip that appears on hover
export function HoverTooltip({
    children,
    tooltip,
    className,
}: {
    children: ReactNode
    tooltip: string
    className?: string
}) {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <span
            className={cn("relative inline-block", className)}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            <span className="border-b border-dashed border-primary/50 cursor-help">
                {children}
            </span>

            {isVisible && (
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-foreground text-background text-xs rounded-lg whitespace-nowrap z-50 animate-in fade-in-0 zoom-in-95">
                    {tooltip}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                </span>
            )}
        </span>
    )
}

// Inline definition that expands on click
export function InlineDefinition({
    term,
    definition,
}: {
    term: string
    definition: string
}) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <span className="relative">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary font-medium hover:underline focus:outline-none"
            >
                {term}
                <span className="ml-0.5 text-xs opacity-60">ⓘ</span>
            </button>

            {isExpanded && (
                <span className="ml-2 inline-block bg-secondary rounded px-2 py-0.5 text-sm animate-in slide-in-from-left-2">
                    — {definition}
                </span>
            )}
        </span>
    )
}
