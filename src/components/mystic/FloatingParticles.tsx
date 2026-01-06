"use client"

import { useEffect, useState } from "react"

interface Particle {
    id: number
    x: number
    y: number
    size: number
    color: string
    type: "star" | "sparkle" | "orb"
    animationDelay: number
    animationDuration: number
}

const PARTICLE_COLORS = [
    "rgba(168, 85, 247, 0.6)",   // Purple
    "rgba(236, 72, 153, 0.5)",   // Pink
    "rgba(59, 130, 246, 0.5)",   // Blue
    "rgba(245, 158, 11, 0.4)",   // Amber
    "rgba(255, 255, 255, 0.7)",  // White
]

const PARTICLE_TYPES: ("star" | "sparkle" | "orb")[] = ["star", "sparkle", "orb"]

function generateParticles(count: number): Particle[] {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        type: PARTICLE_TYPES[Math.floor(Math.random() * PARTICLE_TYPES.length)],
        animationDelay: Math.random() * 10,
        animationDuration: Math.random() * 15 + 15,
    }))
}

function ParticleShape({ type, color, size }: { type: string; color: string; size: number }) {
    switch (type) {
        case "star":
            return (
                <svg
                    width={size * 2}
                    height={size * 2}
                    viewBox="0 0 24 24"
                    fill={color}
                    className="drop-shadow-[0_0_4px_currentColor]"
                    style={{ color }}
                >
                    <path d="M12 2L14.09 8.26L20.18 9.27L15.54 13.14L16.82 19.02L12 16.35L7.18 19.02L8.46 13.14L3.82 9.27L9.91 8.26L12 2Z" />
                </svg>
            )
        case "sparkle":
            return (
                <div
                    className="rotate-45"
                    style={{
                        width: size,
                        height: size,
                        backgroundColor: color,
                        boxShadow: `0 0 ${size * 2}px ${color}`,
                    }}
                />
            )
        case "orb":
        default:
            return (
                <div
                    className="rounded-full"
                    style={{
                        width: size,
                        height: size,
                        backgroundColor: color,
                        boxShadow: `0 0 ${size * 3}px ${color}`,
                    }}
                />
            )
    }
}

export function FloatingParticles({ count = 30 }: { count?: number }) {
    const [particles, setParticles] = useState<Particle[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setParticles(generateParticles(count))
        setMounted(true)
    }, [count])

    if (!mounted) return null

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute animate-float-particle opacity-0"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        animationDelay: `${particle.animationDelay}s`,
                        animationDuration: `${particle.animationDuration}s`,
                    }}
                >
                    <ParticleShape
                        type={particle.type}
                        color={particle.color}
                        size={particle.size}
                    />
                </div>
            ))}
        </div>
    )
}
