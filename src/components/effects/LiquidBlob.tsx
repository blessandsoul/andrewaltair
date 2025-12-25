"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface LiquidBlobProps {
    className?: string
    color1?: string
    color2?: string
    size?: number
    speed?: "slow" | "medium" | "fast"
    opacity?: number
}

export function LiquidBlob({
    className,
    color1 = "var(--primary)",
    color2 = "var(--accent)",
    size = 400,
    speed = "medium",
    opacity = 0.3,
}: LiquidBlobProps) {
    const blobRef = useRef<SVGPathElement>(null)

    const speedMap = {
        slow: 20000,
        medium: 12000,
        fast: 6000,
    }

    return (
        <div className={cn("pointer-events-none absolute", className)}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                className="overflow-visible"
            >
                <defs>
                    <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: color1 }} />
                        <stop offset="100%" style={{ stopColor: color2 }} />
                    </linearGradient>
                    <filter id="blur">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
                    </filter>
                </defs>
                <path
                    ref={blobRef}
                    fill="url(#blobGradient)"
                    filter="url(#blur)"
                    opacity={opacity}
                    style={{
                        animation: `blob-morph ${speedMap[speed]}ms ease-in-out infinite`,
                    }}
                >
                    <animate
                        attributeName="d"
                        dur={`${speedMap[speed]}ms`}
                        repeatCount="indefinite"
                        values="
              M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.8,-0.7C87.6,14.9,82.6,29.8,74.8,43.5C67,57.2,56.4,69.7,43.1,77.9C29.8,86.1,13.9,90,-1.4,92.4C-16.7,94.8,-33.4,95.7,-47.9,89.5C-62.4,83.3,-74.7,70,-81.8,54.6C-88.9,39.2,-90.8,21.6,-89.2,0.9C-87.6,-19.8,-82.5,-39.6,-72.2,-54.7C-61.9,-69.8,-46.4,-80.2,-30.3,-85.9C-14.2,-91.6,2.5,-92.6,18.6,-88.9C34.7,-85.2,50.2,-76.8,44.7,-76.4Z;
              M47.3,-79.7C60.9,-72.5,71.2,-59.4,78.4,-44.9C85.6,-30.4,89.7,-14.5,88.8,0.9C87.9,16.3,82,32.6,73.1,46.5C64.2,60.4,52.3,71.9,38.4,78.9C24.5,85.9,8.6,88.4,-6.9,86.8C-22.4,85.2,-37.5,79.5,-50.8,71.2C-64.1,62.9,-75.6,52,-82.4,38.5C-89.2,25,-91.3,8.9,-88.9,-6.2C-86.5,-21.3,-79.6,-35.4,-69.6,-46.6C-59.6,-57.8,-46.5,-66.1,-33,-73.8C-19.5,-81.5,-5.6,-88.6,5.9,-88.1C17.4,-87.6,33.7,-86.9,47.3,-79.7Z;
              M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.8,-0.7C87.6,14.9,82.6,29.8,74.8,43.5C67,57.2,56.4,69.7,43.1,77.9C29.8,86.1,13.9,90,-1.4,92.4C-16.7,94.8,-33.4,95.7,-47.9,89.5C-62.4,83.3,-74.7,70,-81.8,54.6C-88.9,39.2,-90.8,21.6,-89.2,0.9C-87.6,-19.8,-82.5,-39.6,-72.2,-54.7C-61.9,-69.8,-46.4,-80.2,-30.3,-85.9C-14.2,-91.6,2.5,-92.6,18.6,-88.9C34.7,-85.2,50.2,-76.8,44.7,-76.4Z
            "
                    />
                </path>
            </svg>
        </div>
    )
}

// Multiple floating blobs as background
export function LiquidBlobBackground({ className }: { className?: string }) {
    return (
        <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
            <LiquidBlob
                className="left-1/4 top-1/4"
                color1="var(--primary)"
                color2="#8b5cf6"
                speed="slow"
                opacity={0.2}
                size={500}
            />
            <LiquidBlob
                className="right-1/4 bottom-1/4"
                color1="var(--accent)"
                color2="#6366f1"
                speed="medium"
                opacity={0.15}
                size={450}
            />
            <LiquidBlob
                className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                color1="#ec4899"
                color2="var(--primary)"
                speed="fast"
                opacity={0.1}
                size={350}
            />
        </div>
    )
}
