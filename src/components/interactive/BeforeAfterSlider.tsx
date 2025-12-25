"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface BeforeAfterSliderProps {
    beforeImage: string
    afterImage: string
    beforeLabel?: string
    afterLabel?: string
    className?: string
}

export function BeforeAfterSlider({
    beforeImage,
    afterImage,
    beforeLabel = "წინ",
    afterLabel = "შემდეგ",
    className,
}: BeforeAfterSliderProps) {
    const [position, setPosition] = useState(50)
    const [isDragging, setIsDragging] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const x = clientX - rect.left
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
        setPosition(percentage)
    }

    const handleMouseDown = () => setIsDragging(true)
    const handleMouseUp = () => setIsDragging(false)

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            handleMove(e.clientX)
        }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        handleMove(e.touches[0].clientX)
    }

    useEffect(() => {
        const handleGlobalMouseUp = () => setIsDragging(false)
        window.addEventListener("mouseup", handleGlobalMouseUp)
        return () => window.removeEventListener("mouseup", handleGlobalMouseUp)
    }, [])

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative overflow-hidden rounded-xl select-none cursor-ew-resize",
                className
            )}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            {/* After image (background) */}
            <img
                src={afterImage}
                alt={afterLabel}
                className="w-full h-auto block"
                draggable={false}
            />

            {/* Before image (clipped) */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${position}%` }}
            >
                <img
                    src={beforeImage}
                    alt={beforeLabel}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    style={{
                        width: containerRef.current?.offsetWidth || "100%",
                        maxWidth: "none"
                    }}
                    draggable={false}
                />
            </div>

            {/* Slider handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
                style={{ left: `${position}%`, transform: "translateX(-50%)" }}
            >
                {/* Handle circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <div className="flex gap-0.5">
                        <div className="w-0.5 h-4 bg-gray-400 rounded" />
                        <div className="w-0.5 h-4 bg-gray-400 rounded" />
                    </div>
                </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 text-white text-sm rounded-full">
                {beforeLabel}
            </div>
            <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 text-white text-sm rounded-full">
                {afterLabel}
            </div>
        </div>
    )
}

// Text comparison variant
export function TextCompare({
    beforeText,
    afterText,
    beforeLabel = "ორიგინალი",
    afterLabel = "გაუმჯობესებული",
    className,
}: {
    beforeText: string
    afterText: string
    beforeLabel?: string
    afterLabel?: string
    className?: string
}) {
    const [showAfter, setShowAfter] = useState(false)

    return (
        <div className={cn("rounded-xl border bg-card overflow-hidden", className)}>
            {/* Toggle */}
            <div className="flex border-b">
                <button
                    onClick={() => setShowAfter(false)}
                    className={cn(
                        "flex-1 py-3 px-4 text-sm font-medium transition-colors",
                        !showAfter
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-secondary"
                    )}
                >
                    {beforeLabel}
                </button>
                <button
                    onClick={() => setShowAfter(true)}
                    className={cn(
                        "flex-1 py-3 px-4 text-sm font-medium transition-colors",
                        showAfter
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-secondary"
                    )}
                >
                    {afterLabel}
                </button>
            </div>

            {/* Content */}
            <div className="p-4 min-h-[100px]">
                <p
                    className={cn(
                        "transition-all duration-300",
                        showAfter ? "opacity-100" : "opacity-100"
                    )}
                >
                    {showAfter ? afterText : beforeText}
                </p>
            </div>
        </div>
    )
}
