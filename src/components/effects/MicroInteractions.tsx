"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

// Hover Scale Effect
export function HoverScale({
    children,
    className,
    scale = 1.05,
}: {
    children: ReactNode
    className?: string
    scale?: number
}) {
    return (
        <div
            className={cn("transition-transform duration-300 ease-out", className)}
            style={{
                ["--hover-scale" as string]: scale,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = `scale(${scale})`
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"
            }}
        >
            {children}
        </div>
    )
}

// Click Ripple Effect
export function ClickRipple({
    children,
    className,
    color = "var(--primary)",
}: {
    children: ReactNode
    className?: string
    color?: string
}) {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.currentTarget
        const rect = target.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const ripple = document.createElement("span")
        ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%) scale(0);
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: ${color};
      opacity: 0.3;
      pointer-events: none;
      animation: ripple-out 0.6s ease-out forwards;
    `

        target.style.position = "relative"
        target.style.overflow = "hidden"
        target.appendChild(ripple)

        setTimeout(() => {
            ripple.remove()
        }, 600)
    }

    return (
        <div className={cn("relative overflow-hidden", className)} onClick={handleClick}>
            {children}
        </div>
    )
}

// Pulse Glow Effect
export function PulseGlow({
    children,
    className,
    color = "var(--primary)",
}: {
    children: ReactNode
    className?: string
    color?: string
}) {
    return (
        <div
            className={cn("relative animate-pulse-glow", className)}
            style={{
                ["--glow-color" as string]: color,
            }}
        >
            {children}
        </div>
    )
}

// Spring Bounce on Mount
export function SpringBounce({
    children,
    className,
    delay = 0,
}: {
    children: ReactNode
    className?: string
    delay?: number
}) {
    return (
        <div
            className={cn("animate-spring-in", className)}
            style={{
                animationDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    )
}

// Shake on Hover
export function ShakeOnHover({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <div className={cn("hover:animate-shake", className)}>{children}</div>
    )
}

// Float Effect
export function FloatEffect({
    children,
    className,
    amplitude = 10,
    duration = 3,
}: {
    children: ReactNode
    className?: string
    amplitude?: number
    duration?: number
}) {
    return (
        <div
            className={cn("animate-float", className)}
            style={{
                ["--float-amplitude" as string]: `${amplitude}px`,
                animationDuration: `${duration}s`,
            }}
        >
            {children}
        </div>
    )
}

// Glow Border on Hover
export function GlowBorder({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <div
            className={cn(
                "relative rounded-lg p-[2px] transition-all duration-300",
                "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-primary before:to-accent before:opacity-0 before:transition-opacity hover:before:opacity-100",
                className
            )}
        >
            <div className="relative rounded-lg bg-card">{children}</div>
        </div>
    )
}

// Typewriter Effect
export function TypewriterText({
    text,
    className,
    speed = 50,
}: {
    text: string
    className?: string
    speed?: number
}) {
    return (
        <span
            className={cn("inline-block", className)}
            style={{
                ["--text-length" as string]: text.length,
                ["--animation-duration" as string]: `${text.length * speed}ms`,
            }}
        >
            <span className="animate-typewriter overflow-hidden whitespace-nowrap border-r-2 border-primary">
                {text}
            </span>
        </span>
    )
}

// Counter Animation
export function AnimatedCounter({
    value,
    duration = 2000,
    className,
}: {
    value: number
    duration?: number
    className?: string
}) {
    return (
        <span
            className={cn("tabular-nums", className)}
            style={{
                ["--counter-value" as string]: value,
                animation: `count-up ${duration}ms ease-out forwards`,
            }}
        >
            {value}
        </span>
    )
}
