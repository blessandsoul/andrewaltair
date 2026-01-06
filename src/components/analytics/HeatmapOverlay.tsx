"use client"

import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
// simple-heatmap is a lightweight lib, but since we can't install packages easily without permission, 
// we will implement a simple canvas drawer.

export function HeatmapOverlay() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const isHeatmapMode = searchParams.get('heatmap') === 'true'
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [clicks, setClicks] = useState<any[]>([])

    // Fetch clicks when in heatmap mode
    useEffect(() => {
        if (!isHeatmapMode) return

        async function fetchClicks() {
            try {
                const res = await fetch(`/api/tracking/clicks?page=${pathname}`)
                const data = await res.json()
                if (data.success) {
                    setClicks(data.clicks)
                }
            } catch (e) {
                console.error("Failed to load heatmap data", e)
            }
        }

        fetchClicks()
    }, [isHeatmapMode, pathname])

    // Draw heatmap
    useEffect(() => {
        if (!isHeatmapMode || !canvasRef.current || clicks.length === 0) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size to full document size
        canvas.width = document.documentElement.scrollWidth
        canvas.height = document.documentElement.scrollHeight

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw points
        clicks.forEach(click => {
            const x = (click.x / 100) * canvas.width
            const y = (click.y / 100) * canvas.height

            // Draw gradient circle
            const radius = 25
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)') // Center red
            gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.2)') // Mid yellow
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)') // Edge transparent

            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(x, y, radius, 0, 2 * Math.PI)
            ctx.fill()
        })

    }, [isHeatmapMode, clicks])

    if (!isHeatmapMode) return null

    return (
        <div className="absolute inset-0 pointer-events-none z-[9999] overflow-hidden">
            <div className="fixed top-4 right-4 z-[10000] pointer-events-auto bg-black/80 text-white p-4 rounded-lg shadow-xl backdrop-blur-md border border-white/10">
                <h3 className="font-bold flex items-center gap-2">
                    🔥 Heatmap Mode
                </h3>
                <p className="text-xs text-gray-300 mt-1">Clicks: {clicks.length}</p>
                <div className="flex gap-2 mt-3">
                    <button
                        className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded"
                        onClick={() => window.location.search = ''}
                    >
                        Close
                    </button>
                </div>
            </div>
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
            />
        </div>
    )
}
