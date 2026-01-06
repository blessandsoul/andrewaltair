"use client"

import { ReactNode, useEffect, useState, useCallback } from "react"
import { usePathname } from "next/navigation"

// Smooth CSS transition wrapper
export function MorphTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const [displayChildren, setDisplayChildren] = useState(children)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        // Start fade out
        setIsAnimating(true)

        // After fade out, swap content and fade in
        const timer = setTimeout(() => {
            setDisplayChildren(children)
            // Small delay before fade in
            requestAnimationFrame(() => {
                setIsAnimating(false)
            })
        }, 200)

        return () => clearTimeout(timer)
    }, [pathname]) // Only trigger on pathname change

    // Update children immediately on first render
    useEffect(() => {
        setDisplayChildren(children)
    }, [])

    return (
        <div
            style={{
                opacity: isAnimating ? 0 : 1,
                transform: isAnimating ? 'translateY(8px) scale(0.995)' : 'translateY(0) scale(1)',
                filter: isAnimating ? 'blur(4px)' : 'blur(0px)',
                transition: 'opacity 0.25s ease-out, transform 0.3s ease-out, filter 0.25s ease-out',
                willChange: 'opacity, transform, filter'
            }}
        >
            {displayChildren}
        </div>
    )
}

// Simple fade
export function FadeTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const [displayChildren, setDisplayChildren] = useState(children)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        setIsAnimating(true)
        const timer = setTimeout(() => {
            setDisplayChildren(children)
            requestAnimationFrame(() => setIsAnimating(false))
        }, 150)
        return () => clearTimeout(timer)
    }, [pathname])

    useEffect(() => {
        setDisplayChildren(children)
    }, [])

    return (
        <div
            style={{
                opacity: isAnimating ? 0 : 1,
                transition: 'opacity 0.2s ease-out',
            }}
        >
            {displayChildren}
        </div>
    )
}

// Slide transition
export function SlideTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const [displayChildren, setDisplayChildren] = useState(children)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        setIsAnimating(true)
        const timer = setTimeout(() => {
            setDisplayChildren(children)
            requestAnimationFrame(() => setIsAnimating(false))
        }, 150)
        return () => clearTimeout(timer)
    }, [pathname])

    useEffect(() => {
        setDisplayChildren(children)
    }, [])

    return (
        <div
            style={{
                opacity: isAnimating ? 0 : 1,
                transform: isAnimating ? 'translateX(20px)' : 'translateX(0)',
                transition: 'opacity 0.2s ease-out, transform 0.25s ease-out',
            }}
        >
            {displayChildren}
        </div>
    )
}

export function ScaleTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const [displayChildren, setDisplayChildren] = useState(children)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        setIsAnimating(true)
        const timer = setTimeout(() => {
            setDisplayChildren(children)
            requestAnimationFrame(() => setIsAnimating(false))
        }, 150)
        return () => clearTimeout(timer)
    }, [pathname])

    useEffect(() => {
        setDisplayChildren(children)
    }, [])

    return (
        <div
            style={{
                opacity: isAnimating ? 0 : 1,
                transform: isAnimating ? 'scale(0.96)' : 'scale(1)',
                transition: 'opacity 0.2s ease-out, transform 0.25s ease-out',
            }}
        >
            {displayChildren}
        </div>
    )
}
