"use client"

import * as React from "react"
import { TbX, TbArrowsMaximize } from "react-icons/tb"

/** Compact topic photo that opens fullscreen on click (Esc / click-outside closes). */
export function ForumTopicImage({ src, alt }: { src: string; alt: string }) {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
        document.addEventListener("keydown", onKey)
        document.body.style.overflow = "hidden"
        return () => {
            document.removeEventListener("keydown", onKey)
            document.body.style.overflow = ""
        }
    }, [open])

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="group relative mt-4 block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-border/40"
                title="გადიდება"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} className="max-h-64 w-full object-cover" />
                <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <TbArrowsMaximize className="w-3.5 h-3.5" /> გადიდება
                </span>
            </button>

            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/90 p-4"
                >
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute right-4 top-4 text-white/80 hover:text-white"
                        title="დახურვა"
                    >
                        <TbX className="w-7 h-7" />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={alt} className="max-h-[92vh] max-w-[96vw] rounded-lg object-contain" />
                </div>
            )}
        </>
    )
}

export default ForumTopicImage
