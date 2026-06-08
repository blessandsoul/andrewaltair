"use client"

import { useState, useEffect } from "react"
import { TbTextIncrease, TbTextDecrease } from "react-icons/tb"

// scale multiplies article font-size via the --article-font-scale CSS var (see globals.css).
const FONT_SIZES = [
    { label: "S", scale: 0.9 },
    { label: "M", scale: 1 },
    { label: "L", scale: 1.15 },
]

export function FontSizeControl() {
    const [sizeIndex, setSizeIndex] = useState(1) // Default to M

    useEffect(() => {
        const saved = localStorage.getItem("articleFontSize")
        if (saved) {
            const idx = parseInt(saved, 10)
            if (idx >= 0 && idx < FONT_SIZES.length) {
                setSizeIndex(idx)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("articleFontSize", sizeIndex.toString())
        // Set a root CSS var; globals.css scales every [id^="post-article-"] block.
        // Using :root means infinitely-appended articles inherit the size for free.
        document.documentElement.style.setProperty(
            "--article-font-scale",
            String(FONT_SIZES[sizeIndex].scale)
        )
    }, [sizeIndex])

    const decrease = () => {
        if (sizeIndex > 0) setSizeIndex(sizeIndex - 1)
    }

    const increase = () => {
        if (sizeIndex < FONT_SIZES.length - 1) setSizeIndex(sizeIndex + 1)
    }

    return (
        <div className="flex items-center gap-1 bg-secondary/50 rounded-full px-2 py-1">
            <button
                onClick={decrease}
                disabled={sizeIndex === 0}
                className="p-1.5 rounded-full hover:bg-secondary transition-colors disabled:opacity-30"
                title="შრიფტის შემცირება"
            >
                <TbTextDecrease className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium min-w-[20px] text-center">
                {FONT_SIZES[sizeIndex].label}
            </span>
            <button
                onClick={increase}
                disabled={sizeIndex === FONT_SIZES.length - 1}
                className="p-1.5 rounded-full hover:bg-secondary transition-colors disabled:opacity-30"
                title="შრიფტის გაზრდა"
            >
                <TbTextIncrease className="w-4 h-4" />
            </button>
        </div>
    )
}

export default FontSizeControl
