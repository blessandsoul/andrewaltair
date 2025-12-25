"use client"

import { useRef, useState, useEffect, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface TiltCardProps {
    children: ReactNode
    className?: string
    tiltAmount?: number
    glareEnabled?: boolean
    scale?: number
}

export function TiltCard({
    children,
    className,
    tiltAmount = 10,
    glareEnabled = true,
    scale = 1.02,
}: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [transform, setTransform] = useState("")
    const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 })
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return

        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = ((y - centerY) / centerY) * -tiltAmount
        const rotateY = ((x - centerX) / centerX) * tiltAmount

        setTransform(
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
        )

        // Update glare position
        const glareX = (x / rect.width) * 100
        const glareY = (y / rect.height) * 100
        setGlarePosition({ x: glareX, y: glareY })
    }

    const handleMouseLeave = () => {
        setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)")
        setIsHovered(false)
    }

    const handleMouseEnter = () => {
        setIsHovered(true)
    }

    return (
        <div
            ref={cardRef}
            className={cn(
                "relative transition-transform duration-200 ease-out",
                className
            )}
            style={{ transform, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
        >
            {children}
            {/* Glare effect */}
            {glareEnabled && (
                <div
                    className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
                    style={{
                        opacity: isHovered ? 0.15 : 0,
                        transition: "opacity 0.3s ease",
                    }}
                >
                    <div
                        className="absolute h-[200%] w-[200%]"
                        style={{
                            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, white 0%, transparent 50%)`,
                            transform: "translate(-50%, -50%)",
                            left: `${glarePosition.x}%`,
                            top: `${glarePosition.y}%`,
                        }}
                    />
                </div>
            )}
        </div>
    )
}

// Wrapper to add 3D tilt to existing cards
export function TiltWrapper({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <TiltCard className={className} tiltAmount={8} scale={1.01}>
            {children}
        </TiltCard>
    )
}
