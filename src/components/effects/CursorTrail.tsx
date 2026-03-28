"use client"

import { useEffect, useRef, useState } from "react"

interface Point {
    x: number
    y: number
    age: number
}

export function CursorTrail() {
    const [isVisible, setIsVisible] = useState(true)
    const svgRef = useRef<SVGSVGElement>(null)
    const pointsRef = useRef<Point[]>([])
    const animationRef = useRef<number | null>(null)
    const pathRef = useRef<SVGPathElement>(null)
    const circlesGroupRef = useRef<SVGGElement>(null)

    useEffect(() => {
        const hasPointer = window.matchMedia("(pointer: fine)").matches
        if (!hasPointer) {
            setIsVisible(false)
            return
        }

        let isIdle = true

        const handleMouseMove = (e: MouseEvent) => {
            const pts = pointsRef.current
            pts.push({ x: e.clientX, y: e.clientY, age: 0 })
            if (pts.length > 20) pts.splice(0, pts.length - 20)

            // Start animation loop if idle
            if (isIdle) {
                isIdle = false
                animate()
            }
        }

        const animate = () => {
            const pts = pointsRef.current
            // Age and filter
            for (let i = pts.length - 1; i >= 0; i--) {
                pts[i].age++
                if (pts[i].age >= 30) pts.splice(i, 1)
            }

            // Update SVG directly (no React re-render)
            if (pathRef.current && pts.length > 1) {
                pathRef.current.setAttribute("d", `M ${pts.map(p => `${p.x} ${p.y}`).join(" L ")}`)
                pathRef.current.style.display = ""
            } else if (pathRef.current) {
                pathRef.current.style.display = "none"
            }

            // Update circles
            if (circlesGroupRef.current) {
                const last5 = pts.slice(-5)
                circlesGroupRef.current.innerHTML = last5.map(p =>
                    `<circle cx="${p.x}" cy="${p.y}" r="${Math.max(0, 4 - p.age * 0.1)}" fill="var(--primary)" opacity="${1 - p.age / 30}" style="filter:blur(2px)"/>`
                ).join("")
            }

            if (pts.length > 0) {
                animationRef.current = requestAnimationFrame(animate)
            } else {
                isIdle = true
                animationRef.current = null
            }
        }

        window.addEventListener("mousemove", handleMouseMove)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    if (!isVisible) return null

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            <svg ref={svgRef} className="h-full w-full">
                <defs>
                    <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
                        <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.8" />
                    </linearGradient>
                </defs>
                <path
                    ref={pathRef}
                    fill="none"
                    stroke="url(#trailGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: "blur(1px)", display: "none" }}
                />
                <g ref={circlesGroupRef} />
            </svg>
        </div>
    )
}
