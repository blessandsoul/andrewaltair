"use client"

import { useEffect, useState, useCallback } from "react"

interface Trail {
    id: number
    x: number
    y: number
    opacity: number
}

export function MagicCursor() {
    const [trails, setTrails] = useState<Trail[]>([])
    const [isEnabled, setIsEnabled] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Disable on mobile/touch devices
        if ('ontouchstart' in window) {
            setIsEnabled(false)
        }
    }, [])

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isEnabled) return

        const newTrail: Trail = {
            id: Date.now() + Math.random(),
            x: e.clientX,
            y: e.clientY,
            opacity: 1,
        }

        setTrails(prev => [...prev.slice(-20), newTrail])
    }, [isEnabled])

    useEffect(() => {
        if (!mounted || !isEnabled) return

        window.addEventListener("mousemove", handleMouseMove)

        // Fade out trails
        const interval = setInterval(() => {
            setTrails(prev =>
                prev
                    .map(t => ({ ...t, opacity: t.opacity - 0.05 }))
                    .filter(t => t.opacity > 0)
            )
        }, 50)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            clearInterval(interval)
        }
    }, [mounted, isEnabled, handleMouseMove])

    if (!mounted || !isEnabled) return null

    return (
        <div className="fixed inset-0 pointer-events-none z-[100]">
            {trails.map((trail) => (
                <div
                    key={trail.id}
                    className="absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 transition-opacity"
                    style={{
                        left: trail.x,
                        top: trail.y,
                        opacity: trail.opacity * 0.6,
                        background: `radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(236,72,153,0.4) 50%, transparent 70%)`,
                        boxShadow: `0 0 12px rgba(168,85,247,${trail.opacity * 0.5})`,
                        transform: `translate(-50%, -50%) scale(${trail.opacity})`,
                    }}
                />
            ))}

            {/* Main cursor glow */}
            {trails.length > 0 && (
                <div
                    className="absolute w-6 h-6 rounded-full -translate-x-1/2 -translate-y-1/2"
                    style={{
                        left: trails[trails.length - 1]?.x ?? 0,
                        top: trails[trails.length - 1]?.y ?? 0,
                        background: `radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)`,
                        boxShadow: `0 0 20px rgba(168,85,247,0.4)`,
                    }}
                />
            )}
        </div>
    )
}
