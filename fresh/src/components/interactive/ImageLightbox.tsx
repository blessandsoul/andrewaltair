"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { TbX, TbZoomIn, TbZoomOut, TbChevronLeft, TbChevronRight, TbDownload } from "react-icons/tb"
import { cn } from "@/lib/utils"

interface ImageLightboxProps {
    src: string
    alt: string
    isOpen: boolean
    onClose: () => void
    images?: { src: string; alt: string }[]
    initialIndex?: number
}

export function ImageLightbox({
    src,
    alt,
    isOpen,
    onClose,
    images = [],
    initialIndex = 0
}: ImageLightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)
    const [zoom, setZoom] = useState(1)
    const [isLoading, setIsLoading] = useState(true)

    const hasMultiple = images.length > 1
    const currentTbPhoto = hasMultiple ? images[currentIndex] : { src, alt }

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex)
            setZoom(1)
            setIsLoading(true)
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen, initialIndex])

    // TbKeyboard navigation
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "Escape":
                    onClose()
                    break
                case "ArrowLeft":
                    if (hasMultiple) goToPrev()
                    break
                case "ArrowRight":
                    if (hasMultiple) goToNext()
                    break
                case "+":
                case "=":
                    zoomIn()
                    break
                case "-":
                    zoomOut()
                    break
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, hasMultiple, currentIndex])

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
        setZoom(1)
        setIsLoading(true)
    }, [images.length])

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
        setZoom(1)
        setIsLoading(true)
    }, [images.length])

    const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 3))
    const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5))

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="დახურვა"
            >
                <TbX className="w-6 h-6" />
            </button>

            {/* Controls */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <button
                    onClick={(e) => { e.stopPropagation(); zoomOut() }}
                    className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
                    disabled={zoom <= 0.5}
                >
                    <TbZoomOut className="w-5 h-5" />
                </button>
                <span className="text-white text-sm min-w-[3rem] text-center">
                    {Math.round(zoom * 100)}%
                </span>
                <button
                    onClick={(e) => { e.stopPropagation(); zoomIn() }}
                    className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
                    disabled={zoom >= 3}
                >
                    <TbZoomIn className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-white/20 mx-2" />
                <a
                    href={currentTbPhoto.src}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
                >
                    <TbDownload className="w-5 h-5" />
                </a>
            </div>

            {/* Navigation arrows */}
            {hasMultiple && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); goToPrev() }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        aria-label="წინა"
                    >
                        <TbChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); goToNext() }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        aria-label="შემდეგი"
                    >
                        <TbChevronRight className="w-6 h-6" />
                    </button>
                </>
            )}

            {/* TbPhoto */}
            <div
                className="relative max-w-[90vw] max-h-[85vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                )}
                <Image
                    src={currentTbPhoto.src}
                    alt={currentTbPhoto.alt}
                    width={1200}
                    height={800}
                    className={cn(
                        "object-contain max-h-[85vh] transition-all duration-300",
                        isLoading && "opacity-0"
                    )}
                    style={{ transform: `scale(${zoom})` }}
                    onLoad={() => setIsLoading(false)}
                    priority
                />
            </div>

            {/* TbPhoto counter */}
            {hasMultiple && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                    {currentIndex + 1} / {images.length}
                </div>
            )}

            {/* Alt text */}
            {currentTbPhoto.alt && (
                <div className="absolute bottom-4 left-4 right-4 text-center text-white/60 text-sm max-w-lg mx-auto line-clamp-2">
                    {currentTbPhoto.alt}
                </div>
            )}
        </div>
    )
}

// Hook for easy usage with article images
export function useImageLightbox() {
    const [isOpen, setIsOpen] = useState(false)
    const [images, setImages] = useState<{ src: string; alt: string }[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)

    const openLightbox = useCallback((src: string, alt: string, allImages?: { src: string; alt: string }[], index?: number) => {
        if (allImages && allImages.length > 0) {
            setImages(allImages)
            setCurrentIndex(index || 0)
        } else {
            setImages([{ src, alt }])
            setCurrentIndex(0)
        }
        setIsOpen(true)
    }, [])

    const closeLightbox = useCallback(() => {
        setIsOpen(false)
    }, [])

    return {
        isOpen,
        images,
        currentIndex,
        openLightbox,
        closeLightbox
    }
}
