"use client"

import { useState, useEffect } from "react"
import { TbTextIncrease, TbTextDecrease } from "react-icons/tb"

const FONT_SIZES = [
    { label: "S", value: 16, class: "text-base" },
    { label: "M", value: 18, class: "text-lg" },
    { label: "L", value: 20, class: "text-xl" },
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
        // Apply to article content
        const article = document.querySelector("[data-article-content]")
        if (article) {
            article.classList.remove("text-base", "text-lg", "text-xl")
            article.classList.add(FONT_SIZES[sizeIndex].class)
        }
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
