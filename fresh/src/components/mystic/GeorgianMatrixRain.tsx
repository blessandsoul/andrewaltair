"use client"

import { useEffect, useState, useRef } from "react"

interface MatrixChar {
    char: string
    x: number
    y: number
    speed: number
    opacity: number
    size: number
}

const GEORGIAN_CHARS = "აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ0123456789✦✧★☆⚝☽☾♈♉♊♋♌♍♎♏♐♑♒♓"

export function GeorgianMatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isEnabled, setIsEnabled] = useState(true)
    const charsRef = useRef<MatrixChar[]>([])

    useEffect(() => {
        if (!isEnabled) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initChars()
        }

        const initChars = () => {
            const columns = Math.floor(canvas.width / 25)
            charsRef.current = []

            for (let i = 0; i < columns; i++) {
                // Multiple characters per column at different heights
                const numInColumn = Math.floor(Math.random() * 3) + 1
                for (let j = 0; j < numInColumn; j++) {
                    charsRef.current.push({
                        char: GEORGIAN_CHARS[Math.floor(Math.random() * GEORGIAN_CHARS.length)],
                        x: i * 25,
                        y: Math.random() * canvas.height - canvas.height,
                        speed: 1 + Math.random() * 3,
                        opacity: Math.random() * 0.5 + 0.1,
                        size: 12 + Math.random() * 8,
                    })
                }
            }
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        let animationFrame: number

        const draw = () => {
            // Semi-transparent black to create trail effect
            ctx.fillStyle = "rgba(10, 10, 15, 0.05)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            charsRef.current.forEach((char, index) => {
                // Draw character
                ctx.font = `${char.size}px 'Noto Sans Georgian', monospace`

                // Gradient color based on position
                const hue = (char.y / canvas.height) * 60 + 270 // Purple to pink
                ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${char.opacity})`
                ctx.fillText(char.char, char.x, char.y)

                // Occasional bright flash
                if (Math.random() > 0.99) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${char.opacity * 2})`
                    ctx.fillText(char.char, char.x, char.y)
                }

                // Move character
                char.y += char.speed

                // Random character change
                if (Math.random() > 0.95) {
                    char.char = GEORGIAN_CHARS[Math.floor(Math.random() * GEORGIAN_CHARS.length)]
                }

                // Reset when off screen
                if (char.y > canvas.height + 50) {
                    charsRef.current[index] = {
                        ...char,
                        y: -50,
                        char: GEORGIAN_CHARS[Math.floor(Math.random() * GEORGIAN_CHARS.length)],
                        opacity: Math.random() * 0.5 + 0.1,
                    }
                }
            })

            animationFrame = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            window.removeEventListener("resize", resizeCanvas)
            cancelAnimationFrame(animationFrame)
        }
    }, [isEnabled])

    if (!isEnabled) return null

    return (
        <>
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none z-[1]"
                style={{ opacity: 0.15 }}
            />

            {/* Toggle button */}
            <button
                onClick={() => setIsEnabled(!isEnabled)}
                className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-slate-900/80 border border-slate-700/50
                   text-xs text-slate-400 hover:text-white transition-colors"
                title={isEnabled ? "გამორთვა" : "ჩართვა"}
            >
                {isEnabled ? "ᚢ" : "ᛒ"}
            </button>
        </>
    )
}
