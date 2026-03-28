"use client"

import { useEffect, useRef, useState } from "react"

interface Trail {
    x: number
    y: number
    opacity: number
}

export function MagicCursor() {
    const [isEnabled, setIsEnabled] = useState(true)
    const [mounted, setMounted] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const trailsRef = useRef<Trail[]>([])
    const animationRef = useRef<number | null>(null)
    const lastMouseRef = useRef<{ x: number; y: number } | null>(null)

    useEffect(() => {
        setMounted(true)
        if ('ontouchstart' in window) {
            setIsEnabled(false)
        }
    }, [])

    useEffect(() => {
        if (!mounted || !isEnabled) return

        const handleMouseMove = (e: MouseEvent) => {
            lastMouseRef.current = { x: e.clientX, y: e.clientY }
            const trails = trailsRef.current
            trails.push({ x: e.clientX, y: e.clientY, opacity: 1 })
            if (trails.length > 20) trails.splice(0, trails.length - 20)

            // Start loop if not running
            if (animationRef.current === null) {
                animate()
            }
        }

        const animate = () => {
            const trails = trailsRef.current
            // Fade all trails
            for (let i = trails.length - 1; i >= 0; i--) {
                trails[i].opacity -= 0.03
                if (trails[i].opacity <= 0) trails.splice(i, 1)
            }

            // Direct DOM update — no React re-render
            const container = containerRef.current
            if (container) {
                let html = ''
                for (const t of trails) {
                    html += `<div style="position:absolute;width:12px;height:12px;border-radius:50%;left:${t.x}px;top:${t.y}px;opacity:${t.opacity * 0.6};background:radial-gradient(circle,rgba(168,85,247,0.8) 0%,rgba(236,72,153,0.4) 50%,transparent 70%);box-shadow:0 0 12px rgba(168,85,247,${t.opacity * 0.5});transform:translate(-50%,-50%) scale(${t.opacity})"></div>`
                }
                // Main cursor glow
                const last = lastMouseRef.current
                if (last && trails.length > 0) {
                    html += `<div style="position:absolute;width:24px;height:24px;border-radius:50%;left:${last.x}px;top:${last.y}px;background:radial-gradient(circle,rgba(168,85,247,0.3) 0%,transparent 70%);box-shadow:0 0 20px rgba(168,85,247,0.4);transform:translate(-50%,-50%)"></div>`
                }
                container.innerHTML = html
            }

            if (trails.length > 0) {
                animationRef.current = requestAnimationFrame(animate)
            } else {
                animationRef.current = null
                if (container) container.innerHTML = ''
            }
        }

        window.addEventListener("mousemove", handleMouseMove)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current)
                animationRef.current = null
            }
        }
    }, [mounted, isEnabled])

    if (!mounted || !isEnabled) return null

    return (
        <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[100]" />
    )
}
