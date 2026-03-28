"use client"

import { useEffect, useRef } from "react"

interface Star {
    x: number
    y: number
    size: number
    brightness: number
}

interface ShootingStar {
    x: number
    y: number
    angle: number
    speed: number
    length: number
    opacity: number
}

const MAX_STARS = 200
const CONNECTION_RADIUS_SQ = 150 * 150
const MOUSE_RADIUS = 200
const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS

export function InteractiveConstellation() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mousePosRef = useRef({ x: 0, y: 0 })
    const starsRef = useRef<Star[]>([])
    const shootingStarsRef = useRef<ShootingStar[]>([])
    const animationRef = useRef<number>()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let resizeTimer: ReturnType<typeof setTimeout> | null = null

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            generateStars()
        }

        const handleResize = () => {
            if (resizeTimer) clearTimeout(resizeTimer)
            resizeTimer = setTimeout(resizeCanvas, 200)
        }

        const generateStars = () => {
            const numStars = Math.min(MAX_STARS, Math.floor((canvas.width * canvas.height) / 15000))
            starsRef.current = Array.from({ length: numStars }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                brightness: Math.random() * 0.5 + 0.5,
            }))
        }

        const addShootingStar = () => {
            if (shootingStarsRef.current.length > 3) return
            shootingStarsRef.current.push({
                x: Math.random() * canvas.width * 0.8,
                y: Math.random() * canvas.height * 0.3,
                angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
                speed: 8 + Math.random() * 6,
                length: 80 + Math.random() * 60,
                opacity: 1,
            })
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const stars = starsRef.current
            const mouse = mousePosRef.current

            // Draw stars
            for (let i = 0; i < stars.length; i++) {
                const star = stars[i]
                const dx = star.x - mouse.x
                const dy = star.y - mouse.y
                const distSq = dx * dx + dy * dy

                const isNearMouse = distSq < MOUSE_RADIUS_SQ
                const dist = isNearMouse ? Math.sqrt(distSq) : 0
                const glow = isNearMouse ? 1 + (1 - dist / MOUSE_RADIUS) * 2 : 1
                const size = star.size * glow

                ctx.beginPath()
                ctx.arc(star.x, star.y, size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255,255,255,${star.brightness * glow})`
                ctx.fill()

                if (isNearMouse) {
                    ctx.beginPath()
                    ctx.arc(star.x, star.y, size * 3, 0, Math.PI * 2)
                    const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, size * 3)
                    gradient.addColorStop(0, `rgba(168,85,247,${0.4 * (1 - dist / MOUSE_RADIUS)})`)
                    gradient.addColorStop(1, "transparent")
                    ctx.fillStyle = gradient
                    ctx.fill()

                    // Only check connections for stars near mouse
                    for (let j = i + 1; j < stars.length; j++) {
                        const star2 = stars[j]
                        const dx2 = star2.x - star.x
                        const dy2 = star2.y - star.y
                        const dist2Sq = dx2 * dx2 + dy2 * dy2

                        if (dist2Sq < CONNECTION_RADIUS_SQ) {
                            const dist2 = Math.sqrt(dist2Sq)
                            const opacity = (1 - dist2 / 150) * (1 - dist / MOUSE_RADIUS) * 0.5

                            ctx.beginPath()
                            ctx.moveTo(star.x, star.y)
                            ctx.lineTo(star2.x, star2.y)

                            const gradient = ctx.createLinearGradient(star.x, star.y, star2.x, star2.y)
                            gradient.addColorStop(0, `rgba(168,85,247,${opacity})`)
                            gradient.addColorStop(0.5, `rgba(236,72,153,${opacity})`)
                            gradient.addColorStop(1, `rgba(59,130,246,${opacity})`)

                            ctx.strokeStyle = gradient
                            ctx.lineWidth = 1
                            ctx.stroke()
                        }
                    }
                }
            }

            // Draw shooting stars
            shootingStarsRef.current = shootingStarsRef.current.filter((ss) => {
                ss.x += Math.cos(ss.angle) * ss.speed
                ss.y += Math.sin(ss.angle) * ss.speed
                ss.opacity -= 0.015

                if (ss.opacity <= 0 || ss.x > canvas.width || ss.y > canvas.height) {
                    return false
                }

                const tailX = ss.x - Math.cos(ss.angle) * ss.length
                const tailY = ss.y - Math.sin(ss.angle) * ss.length

                const gradient = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y)
                gradient.addColorStop(0, "transparent")
                gradient.addColorStop(0.7, `rgba(255,255,255,${ss.opacity * 0.3})`)
                gradient.addColorStop(1, `rgba(255,255,255,${ss.opacity})`)

                ctx.beginPath()
                ctx.moveTo(tailX, tailY)
                ctx.lineTo(ss.x, ss.y)
                ctx.strokeStyle = gradient
                ctx.lineWidth = 2
                ctx.stroke()

                ctx.beginPath()
                ctx.arc(ss.x, ss.y, 3, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255,255,255,${ss.opacity})`
                ctx.fill()

                return true
            })

            animationRef.current = requestAnimationFrame(draw)
        }

        const handleMouseMove = (e: MouseEvent) => {
            mousePosRef.current = { x: e.clientX, y: e.clientY }
        }

        resizeCanvas()
        window.addEventListener("resize", handleResize)
        window.addEventListener("mousemove", handleMouseMove)

        draw()

        const shootingInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                addShootingStar()
            }
        }, 2000)

        return () => {
            window.removeEventListener("resize", handleResize)
            window.removeEventListener("mousemove", handleMouseMove)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            if (resizeTimer) clearTimeout(resizeTimer)
            clearInterval(shootingInterval)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[2]"
            style={{ opacity: 0.8 }}
        />
    )
}
