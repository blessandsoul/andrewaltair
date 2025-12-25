"use client"

import { useRef, useState, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MagneticButtonProps {
    children: ReactNode
    className?: string
    magnetStrength?: number
    as?: "button" | "div" | "a"
    onClick?: () => void
    href?: string
}

export function MagneticButton({
    children,
    className,
    magnetStrength = 0.3,
    as = "button",
    onClick,
    href,
}: MagneticButtonProps) {
    const buttonRef = useRef<HTMLElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!buttonRef.current) return

        const rect = buttonRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const distanceX = (e.clientX - centerX) * magnetStrength
        const distanceY = (e.clientY - centerY) * magnetStrength

        setPosition({ x: distanceX, y: distanceY })
    }

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 })
    }

    const Component = as as React.ElementType

    return (
        <Component
            ref={buttonRef as React.RefObject<HTMLButtonElement>}
            className={cn(
                "relative inline-flex items-center justify-center transition-transform duration-200 ease-out",
                className
            )}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            href={href}
        >
            {children}
        </Component>
    )
}

// Higher-order wrapper for existing buttons
export function withMagnetic<T extends object>(
    WrappedComponent: React.ComponentType<T>
) {
    return function MagneticWrapper(props: T & { magnetStrength?: number }) {
        const { magnetStrength = 0.3, ...restProps } = props
        const wrapperRef = useRef<HTMLDivElement>(null)
        const [position, setPosition] = useState({ x: 0, y: 0 })

        const handleMouseMove = (e: React.MouseEvent) => {
            if (!wrapperRef.current) return

            const rect = wrapperRef.current.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            const distanceX = (e.clientX - centerX) * magnetStrength
            const distanceY = (e.clientY - centerY) * magnetStrength

            setPosition({ x: distanceX, y: distanceY })
        }

        const handleMouseLeave = () => {
            setPosition({ x: 0, y: 0 })
        }

        return (
            <div
                ref={wrapperRef}
                className="inline-block transition-transform duration-200 ease-out"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <WrappedComponent {...(restProps as T)} />
            </div>
        )
    }
}
