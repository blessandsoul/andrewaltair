"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface TextScrambleProps {
    text: string
    className?: string
    duration?: number
    triggerOnView?: boolean
    chars?: string
}

export function TextScramble({
    text,
    className,
    duration = 1500,
    triggerOnView = true,
    chars = "!<>-_\\/[]{}—=+*^?#________",
}: TextScrambleProps) {
    const [displayText, setDisplayText] = useState(text)
    const [isScrambling, setIsScrambling] = useState(false)
    const elementRef = useRef<HTMLSpanElement>(null)

    const scramble = () => {
        if (isScrambling) return
        setIsScrambling(true)

        const length = text.length
        const startTime = Date.now()

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)

            let result = ""
            for (let i = 0; i < length; i++) {
                const charProgress = i / length
                if (progress > charProgress) {
                    result += text[i]
                } else {
                    result += chars[Math.floor(Math.random() * chars.length)]
                }
            }

            setDisplayText(result)

            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                setDisplayText(text)
                setIsScrambling(false)
            }
        }

        animate()
    }

    useEffect(() => {
        if (!triggerOnView) {
            scramble()
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    scramble()
                }
            },
            { threshold: 0.5 }
        )

        if (elementRef.current) {
            observer.observe(elementRef.current)
        }

        return () => observer.disconnect()
    }, [text, triggerOnView])

    return (
        <span
            ref={elementRef}
            className={cn("inline-block font-mono", className)}
            onMouseEnter={() => scramble()}
        >
            {displayText}
        </span>
    )
}

// Title variant with larger styling
export function ScrambleTitle({
    text,
    className,
}: {
    text: string
    className?: string
}) {
    return (
        <TextScramble
            text={text}
            className={cn("text-4xl font-bold", className)}
            duration={2000}
        />
    )
}
