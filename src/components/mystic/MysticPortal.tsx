"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

interface PortalProps {
    isActive: boolean
    targetUrl: string
    color: string
    onComplete?: () => void
}

export function MysticPortal({ isActive, targetUrl, color, onComplete }: PortalProps) {
    const router = useRouter()
    const [phase, setPhase] = useState<"idle" | "opening" | "traveling" | "complete">("idle")
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()

    useEffect(() => {
        if (isActive && phase === "idle") {
            setPhase("opening")

            // Phase timings
            setTimeout(() => setPhase("traveling"), 800)
            setTimeout(() => {
                setPhase("complete")
                router.push(targetUrl)
                onComplete?.()
            }, 1600)
        }
    }, [isActive, phase, targetUrl, router, onComplete])

    useEffect(() => {
        if (phase === "idle") return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        let progress = 0
        let rotation = 0

        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 168, g: 85, b: 247 }
        }

        const rgb = hexToRgb(color)

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            if (phase === "traveling" || phase === "complete") {
                progress = Math.min(progress + 0.03, 1)
            } else if (phase === "opening") {
                progress = Math.min(progress + 0.02, 0.5)
            }

            rotation += 0.05

            // Draw vortex layers
            const maxRadius = Math.max(canvas.width, canvas.height)
            const numRings = 30
            const portalRadius = maxRadius * progress

            for (let i = numRings; i >= 0; i--) {
                const ringProgress = i / numRings
                const radius = portalRadius * ringProgress
                const alpha = (1 - ringProgress) * 0.8

                // Spiral distortion
                const spiralOffset = rotation + ringProgress * Math.PI * 4

                ctx.beginPath()
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)

                const gradient = ctx.createRadialGradient(
                    centerX, centerY, radius * 0.8,
                    centerX, centerY, radius
                )

                gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.5})`)
                gradient.addColorStop(0.5, `rgba(${Math.min(255, rgb.r + 50)}, ${Math.min(255, rgb.g + 50)}, ${Math.min(255, rgb.b + 50)}, ${alpha})`)
                gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`)

                ctx.fillStyle = gradient
                ctx.fill()

                // Draw spiral arms
                if (radius > 10) {
                    for (let arm = 0; arm < 6; arm++) {
                        const armAngle = spiralOffset + (arm * Math.PI * 2) / 6
                        const armX = centerX + Math.cos(armAngle) * radius * 0.9
                        const armY = centerY + Math.sin(armAngle) * radius * 0.9

                        ctx.beginPath()
                        ctx.arc(armX, armY, radius * 0.1, 0, Math.PI * 2)
                        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.3})`
                        ctx.fill()
                    }
                }
            }

            // Center bright spot
            const centerRadius = 50 * progress
            const centerGradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, centerRadius
            )
            centerGradient.addColorStop(0, "rgba(255, 255, 255, 1)")
            centerGradient.addColorStop(0.3, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`)
            centerGradient.addColorStop(1, "transparent")

            ctx.beginPath()
            ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2)
            ctx.fillStyle = centerGradient
            ctx.fill()

            // Particle streams
            const numParticles = 100
            for (let i = 0; i < numParticles; i++) {
                const particleProgress = ((progress * 5 + i / numParticles) % 1)
                const angle = (i / numParticles) * Math.PI * 2 + rotation * 2
                const dist = portalRadius * particleProgress

                const px = centerX + Math.cos(angle) * dist
                const py = centerY + Math.sin(angle) * dist
                const size = 2 + (1 - particleProgress) * 3

                ctx.beginPath()
                ctx.arc(px, py, size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${(1 - particleProgress) * 0.8})`
                ctx.fill()
            }

            // Dark overlay that intensifies
            if (phase === "traveling" || phase === "complete") {
                ctx.fillStyle = `rgba(0, 0, 0, ${progress * 0.7})`
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            }

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(draw)
            }
        }

        draw()

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [phase, color])

    if (phase === "idle") return null

    return (
        <div className="fixed inset-0 z-[1000]">
            <canvas ref={canvasRef} className="w-full h-full" />

            {/* Text overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`text-white text-2xl font-bold tracking-wider transition-all duration-500
                        ${phase === "traveling" ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
                    <span className="animate-pulse">შედიხარ მისტიკურ სამყაროში...</span>
                </div>
            </div>
        </div>
    )
}

// Hook to use the portal
export function usePortal() {
    const [portalState, setPortalState] = useState<{
        isActive: boolean
        targetUrl: string
        color: string
    }>({
        isActive: false,
        targetUrl: "",
        color: "#a855f7",
    })

    const openPortal = (url: string, color: string = "#a855f7") => {
        setPortalState({
            isActive: true,
            targetUrl: url,
            color,
        })
    }

    const closePortal = () => {
        setPortalState({
            isActive: false,
            targetUrl: "",
            color: "#a855f7",
        })
    }

    return { portalState, openPortal, closePortal }
}
