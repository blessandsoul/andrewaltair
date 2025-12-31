"use client"

import { useEffect, useRef, useState } from "react"

interface Star {
    id: number
    x: number
    y: number
    size: number
    brightness: number
    connections: number[]
}

interface ShootingStar {
    id: number
    x: number
    y: number
    angle: number
    speed: number
    length: number
    opacity: number
}

export function InteractiveConstellation() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const starsRef = useRef<Star[]>([])
    const shootingStarsRef = useRef<ShootingStar[]>([])
    const animationRef = useRef<number>()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            generateStars()
        }

        // Generate random stars
        const generateStars = () => {
            const numStars = Math.floor((canvas.width * canvas.height) / 15000)
            starsRef.current = Array.from({ length: numStars }, (_, i) => ({
                id: i,
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                brightness: Math.random() * 0.5 + 0.5,
                connections: [],
            }))
        }

        // Add shooting star
        const addShootingStar = () => {
            if (shootingStarsRef.current.length > 3) return

            const shootingStar: ShootingStar = {
                id: Date.now(),
                x: Math.random() * canvas.width * 0.8,
                y: Math.random() * canvas.height * 0.3,
                angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
                speed: 8 + Math.random() * 6,
                length: 80 + Math.random() * 60,
                opacity: 1,
            }
            shootingStarsRef.current.push(shootingStar)
        }

        // Draw function
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const stars = starsRef.current
            const mouse = mousePos
            const connectionRadius = 150
            const mouseRadius = 200

            // Draw stars
            stars.forEach((star) => {
                // Calculate distance from mouse
                const dx = star.x - mouse.x
                const dy = star.y - mouse.y
                const dist = Math.sqrt(dx * dx + dy * dy)

                // Stars glow more when mouse is near
                const glow = dist < mouseRadius ? 1 + (1 - dist / mouseRadius) * 2 : 1
                const size = star.size * glow

                // Draw star
                ctx.beginPath()
                ctx.arc(star.x, star.y, size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * glow})`
                ctx.fill()

                // Add glow effect for stars near mouse
                if (dist < mouseRadius) {
                    ctx.beginPath()
                    ctx.arc(star.x, star.y, size * 3, 0, Math.PI * 2)
                    const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, size * 3)
                    gradient.addColorStop(0, `rgba(168, 85, 247, ${0.4 * (1 - dist / mouseRadius)})`)
                    gradient.addColorStop(1, "transparent")
                    ctx.fillStyle = gradient
                    ctx.fill()
                }
            })

            // Draw connections between nearby stars when mouse is near
            stars.forEach((star1, i) => {
                const dx1 = star1.x - mouse.x
                const dy1 = star1.y - mouse.y
                const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1)

                if (dist1 < mouseRadius) {
                    stars.slice(i + 1).forEach((star2) => {
                        const dx2 = star2.x - star1.x
                        const dy2 = star2.y - star1.y
                        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)

                        if (dist2 < connectionRadius) {
                            const opacity = (1 - dist2 / connectionRadius) * (1 - dist1 / mouseRadius) * 0.5

                            ctx.beginPath()
                            ctx.moveTo(star1.x, star1.y)
                            ctx.lineTo(star2.x, star2.y)

                            const gradient = ctx.createLinearGradient(star1.x, star1.y, star2.x, star2.y)
                            gradient.addColorStop(0, `rgba(168, 85, 247, ${opacity})`)
                            gradient.addColorStop(0.5, `rgba(236, 72, 153, ${opacity})`)
                            gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity})`)

                            ctx.strokeStyle = gradient
                            ctx.lineWidth = 1
                            ctx.stroke()
                        }
                    })
                }
            })

            // Draw shooting stars
            shootingStarsRef.current = shootingStarsRef.current.filter((ss) => {
                // Update position
                ss.x += Math.cos(ss.angle) * ss.speed
                ss.y += Math.sin(ss.angle) * ss.speed
                ss.opacity -= 0.015

                if (ss.opacity <= 0 || ss.x > canvas.width || ss.y > canvas.height) {
                    return false
                }

                // Draw shooting star trail
                const tailX = ss.x - Math.cos(ss.angle) * ss.length
                const tailY = ss.y - Math.sin(ss.angle) * ss.length

                const gradient = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y)
                gradient.addColorStop(0, "transparent")
                gradient.addColorStop(0.7, `rgba(255, 255, 255, ${ss.opacity * 0.3})`)
                gradient.addColorStop(1, `rgba(255, 255, 255, ${ss.opacity})`)

                ctx.beginPath()
                ctx.moveTo(tailX, tailY)
                ctx.lineTo(ss.x, ss.y)
                ctx.strokeStyle = gradient
                ctx.lineWidth = 2
                ctx.stroke()

                // Head glow
                ctx.beginPath()
                ctx.arc(ss.x, ss.y, 3, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${ss.opacity})`
                ctx.fill()

                return true
            })

            animationRef.current = requestAnimationFrame(draw)
        }

        // Mouse move handler
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY })
        }

        // Initialize
        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)
        window.addEventListener("mousemove", handleMouseMove)

        // Start animation
        draw()

        // Shooting stars interval
        const shootingInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                addShootingStar()
            }
        }, 2000)

        return () => {
            window.removeEventListener("resize", resizeCanvas)
            window.removeEventListener("mousemove", handleMouseMove)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            clearInterval(shootingInterval)
        }
    }, [mousePos])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[2]"
            style={{ opacity: 0.8 }}
        />
    )
}
