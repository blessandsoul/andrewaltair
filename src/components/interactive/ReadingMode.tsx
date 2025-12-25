"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { BookOpen, X, Sun, Moon, Type, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReadingModeProps {
    children: React.ReactNode
    className?: string
}

export function ReadingModeProvider({ children, className }: ReadingModeProps) {
    const [isActive, setIsActive] = useState(false)
    const [fontSize, setFontSize] = useState(18)
    const [isSepia, setIsSepia] = useState(false)
    const [lineHeight, setLineHeight] = useState(1.8)

    useEffect(() => {
        // Keyboard shortcut: Ctrl+Shift+R to toggle
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === "R") {
                e.preventDefault()
                setIsActive((prev) => !prev)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    if (!isActive) {
        return (
            <div className={className}>
                {children}
                <ReadingModeToggle onActivate={() => setIsActive(true)} />
            </div>
        )
    }

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 overflow-auto",
                isSepia ? "bg-[#f4ecd8]" : "bg-background"
            )}
        >
            {/* Control bar */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card/80 backdrop-blur-lg px-4 py-3">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsActive(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                    <span className="font-medium">რიდინგ მოდი</span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Font size */}
                    <div className="flex items-center gap-1 bg-secondary rounded-lg px-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setFontSize((s) => Math.max(14, s - 2))}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <Type className="h-4 w-4" />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setFontSize((s) => Math.min(28, s + 2))}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>

                    {/* Sepia toggle */}
                    <Button
                        variant={isSepia ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setIsSepia(!isSepia)}
                    >
                        {isSepia ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    </Button>

                    {/* Line height */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            setLineHeight((h) => (h === 1.8 ? 2.2 : h === 2.2 ? 1.6 : 1.8))
                        }
                    >
                        {lineHeight}x
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div
                className={cn(
                    "mx-auto max-w-2xl px-8 py-12",
                    isSepia ? "text-[#5c4b37]" : "text-foreground"
                )}
                style={{
                    fontSize: `${fontSize}px`,
                    lineHeight,
                }}
            >
                {children}
            </div>
        </div>
    )
}

// Toggle button
export function ReadingModeToggle({
    onActivate,
    className,
}: {
    onActivate: () => void
    className?: string
}) {
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={onActivate}
            className={cn("gap-2", className)}
        >
            <BookOpen className="h-4 w-4" />
            რიდინგ მოდი
        </Button>
    )
}

// Floating action button for reading mode
export function ReadingModeFAB({ onActivate }: { onActivate: () => void }) {
    return (
        <button
            onClick={onActivate}
            className="fixed bottom-20 right-4 z-40 h-12 w-12 rounded-full bg-card border shadow-lg flex items-center justify-center hover:bg-secondary transition-colors"
            title="რიდინგ მოდი (Ctrl+Shift+R)"
        >
            <BookOpen className="h-5 w-5" />
        </button>
    )
}
