"use client"

import { useEffect, useRef } from "react"

export function InteractiveConstellation() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationId: number
        let width = 0
        let height = 0

        // Configuration
        const STAR_COUNT = 40 // Reduced for deeper "void" feel
        const CONNECTION_DISTANCE = 150

        interface Star {
            x: number
            y: number
            baseX: number
            baseY: number
            size: number
            opacity: number
            speed: number
            phase: number
        }

        let stars: Star[] = []

        const init = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height

            stars = Array.from({ length: STAR_COUNT }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                baseX: Math.random() * width,
                baseY: Math.random() * height,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                speed: 0.2 + Math.random() * 0.3, // Slow speed for calm
                phase: Math.random() * Math.PI * 2
            }))
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height)

            const time = Date.now() * 0.001

            // Update and draw stars
            stars.forEach((star, i) => {
                // Autonomous Figure-8 movement
                // x = sin(t), y = sin(2t)
                const offsetX = Math.sin(time * star.speed + star.phase) * 50
                const offsetY = Math.sin(time * star.speed * 2 + star.phase) * 30

                star.x = (star.baseX + offsetX + width) % width
                star.y = (star.baseY + offsetY + height) % height

                // Twinkle effect
                const alpha = star.opacity * (0.7 + Math.sin(time * 3 + star.phase) * 0.3)

                ctx.beginPath()
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
                ctx.fill()

                // Draw connections
                for (let j = i + 1; j < stars.length; j++) {
                    const star2 = stars[j]
                    const dx = star.x - star2.x
                    const dy = star.y - star2.y
                    const dist = Math.sqrt(dx * dx + dy * dy)

                    if (dist < CONNECTION_DISTANCE) {
                        const lineAlpha = (1 - dist / CONNECTION_DISTANCE) * 0.15
                        ctx.beginPath()
                        ctx.moveTo(star.x, star.y)
                        ctx.lineTo(star2.x, star2.y)
                        ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                }
            })

            animationId = requestAnimationFrame(animate)
        }

        init()
        window.addEventListener("resize", init)
        animate()

        return () => {
            window.removeEventListener("resize", init)
            cancelAnimationFrame(animationId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0"
            style={{ opacity: 0.6 }}
        />
    )
}
