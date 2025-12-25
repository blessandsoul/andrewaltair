"use client"

import { useEffect, useRef, useState } from "react"

interface Point {
    x: number
    y: number
    age: number
}

export function CursorTrail() {
    const [points, setPoints] = useState<Point[]>([])
    const [isVisible, setIsVisible] = useState(true)
    const animationRef = useRef<number | null>(null)

    useEffect(() => {
        // Check if device has fine pointer (mouse)
        const hasPointer = window.matchMedia("(pointer: fine)").matches
        if (!hasPointer) {
            setIsVisible(false)
            return
        }

        const handleMouseMove = (e: MouseEvent) => {
            setPoints((prev) => [
                ...prev.slice(-20), // Keep last 20 points
                { x: e.clientX, y: e.clientY, age: 0 },
            ])
        }

        const animate = () => {
            setPoints((prev) =>
                prev
                    .map((point) => ({ ...point, age: point.age + 1 }))
                    .filter((point) => point.age < 30) // Remove old points
            )
            animationRef.current = requestAnimationFrame(animate)
        }

        window.addEventListener("mousemove", handleMouseMove)
        animationRef.current = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    if (!isVisible) return null

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            <svg className="h-full w-full">
                <defs>
                    <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
                        <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.8" />
                    </linearGradient>
                </defs>
                {points.length > 1 && (
                    <path
                        d={`M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
                        fill="none"
                        stroke="url(#trailGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                            filter: "blur(1px)",
                        }}
                    />
                )}
                {points.slice(-5).map((point, index) => (
                    <circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r={4 - point.age * 0.1}
                        fill="var(--primary)"
                        opacity={1 - point.age / 30}
                        style={{
                            filter: "blur(2px)",
                        }}
                    />
                ))}
            </svg>
        </div>
    )
}
