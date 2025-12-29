"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Home, RotateCcw, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

// Simple Snake-like game for 404 page
export default function NotFound() {
    const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle")
    const [score, setScore] = useState(0)
    const [highScore, setHighScore] = useState(0)
    const [snake, setSnake] = useState([{ x: 10, y: 10 }])
    const [food, setFood] = useState({ x: 15, y: 10 })
    const [direction, setDirection] = useState({ x: 1, y: 0 })
    const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const GRID_SIZE = 20
    const CELL_SIZE = 15
    const GAME_SPEED = 150

    // Load high score
    useEffect(() => {
        const saved = localStorage.getItem("404-high-score")
        if (saved) setHighScore(parseInt(saved))
    }, [])

    // Handle keyboard - with scroll prevention
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent default for arrow keys to stop page scrolling
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault()
            }

            if (gameState !== "playing") return

            switch (e.key) {
                case "ArrowUp":
                    if (direction.y !== 1) setDirection({ x: 0, y: -1 })
                    break
                case "ArrowDown":
                    if (direction.y !== -1) setDirection({ x: 0, y: 1 })
                    break
                case "ArrowLeft":
                    if (direction.x !== 1) setDirection({ x: -1, y: 0 })
                    break
                case "ArrowRight":
                    if (direction.x !== -1) setDirection({ x: 1, y: 0 })
                    break
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [direction, gameState])

    // Game loop
    useEffect(() => {
        if (gameState !== "playing") return

        gameLoopRef.current = setInterval(() => {
            setSnake((prevSnake) => {
                const head = prevSnake[0]
                const newHead = {
                    x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
                    y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
                }

                // Check collision with self
                if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
                    setGameState("gameover")
                    if (score > highScore) {
                        setHighScore(score)
                        localStorage.setItem("404-high-score", score.toString())
                    }
                    return prevSnake
                }

                const newSnake = [newHead, ...prevSnake]

                // Check if food eaten
                if (newHead.x === food.x && newHead.y === food.y) {
                    setScore((s) => s + 10)
                    // Generate new food
                    let newFood: { x: number; y: number }
                    do {
                        newFood = {
                            x: Math.floor(Math.random() * GRID_SIZE),
                            y: Math.floor(Math.random() * GRID_SIZE),
                        }
                    } while (newSnake.some((s) => s.x === newFood.x && s.y === newFood.y))
                    setFood(newFood)
                } else {
                    newSnake.pop()
                }

                return newSnake
            })
        }, GAME_SPEED)

        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current)
        }
    }, [gameState, direction, food, score, highScore])

    // Draw game
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Clear
        ctx.fillStyle = "#1e1e2e"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw grid
        ctx.strokeStyle = "#2e2e3e"
        for (let i = 0; i <= GRID_SIZE; i++) {
            ctx.beginPath()
            ctx.moveTo(i * CELL_SIZE, 0)
            ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(0, i * CELL_SIZE)
            ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE)
            ctx.stroke()
        }

        // Draw snake
        snake.forEach((segment, index) => {
            const gradient = ctx.createLinearGradient(
                segment.x * CELL_SIZE,
                segment.y * CELL_SIZE,
                (segment.x + 1) * CELL_SIZE,
                (segment.y + 1) * CELL_SIZE
            )
            gradient.addColorStop(0, "#6366f1")
            gradient.addColorStop(1, "#22d3ee")

            ctx.fillStyle = index === 0 ? "#6366f1" : gradient
            ctx.fillRect(
                segment.x * CELL_SIZE + 1,
                segment.y * CELL_SIZE + 1,
                CELL_SIZE - 2,
                CELL_SIZE - 2
            )
        })

        // Draw food
        ctx.fillStyle = "#f43f5e"
        ctx.beginPath()
        ctx.arc(
            food.x * CELL_SIZE + CELL_SIZE / 2,
            food.y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 2 - 2,
            0,
            Math.PI * 2
        )
        ctx.fill()
    }, [snake, food])

    const startGame = () => {
        setSnake([{ x: 10, y: 10 }])
        setDirection({ x: 1, y: 0 })
        setScore(0)
        setFood({ x: 15, y: 10 })
        setGameState("playing")
    }

    return (
        <div className="h-screen overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/30">
            <div className="text-center max-w-md mx-auto">
                {/* 404 header */}
                <div className="mb-8">
                    <h1 className="text-8xl font-bold text-gradient mb-4">404</h1>
                    <p className="text-xl text-muted-foreground mb-2">
                        გვერდი ვერ მოიძებნა!
                    </p>
                    <p className="text-muted-foreground">
                        სანამ დაბრუნდები, ითამაშე სნეიკი 🐍
                    </p>
                </div>

                {/* Game area */}
                <div className="relative inline-block rounded-xl overflow-hidden border shadow-2xl mb-6">
                    <canvas
                        ref={canvasRef}
                        width={GRID_SIZE * CELL_SIZE}
                        height={GRID_SIZE * CELL_SIZE}
                        className="block"
                    />

                    {/* Overlay for idle/gameover */}
                    {gameState !== "playing" && (
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                            {gameState === "gameover" ? (
                                <>
                                    <p className="text-red-400 font-bold text-lg mb-2">გეიმ ოვერ!</p>
                                    <p className="text-white text-2xl font-bold mb-1">
                                        ქულა: {score}
                                    </p>
                                    {score === highScore && score > 0 && (
                                        <p className="text-yellow-400 text-sm mb-4 flex items-center gap-1">
                                            <Trophy className="h-4 w-4" />
                                            ახალი რეკორდი!
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="text-white mb-4">დააჭირე სათამაშოდ!</p>
                            )}
                            <Button onClick={startGame} className="gap-2">
                                <RotateCcw className="h-4 w-4" />
                                {gameState === "gameover" ? "თავიდან" : "დაწყება"}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Score */}
                {gameState === "playing" && (
                    <div className="mb-6 flex justify-center gap-6 text-sm">
                        <div>
                            <span className="text-muted-foreground">ქულა: </span>
                            <span className="font-bold text-primary">{score}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">რეკორდი: </span>
                            <span className="font-bold">{highScore}</span>
                        </div>
                    </div>
                )}

                {/* Controls hint */}
                {gameState === "playing" && (
                    <p className="text-xs text-muted-foreground mb-6">
                        ისრებით მართე გველი 🐍
                    </p>
                )}

                {/* Navigation */}
                <div className="flex justify-center gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/">
                            <Home className="h-4 w-4 mr-2" />
                            მთავარზე დაბრუნება
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
