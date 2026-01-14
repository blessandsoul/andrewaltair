'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { TbX, TbChevronLeft, TbChevronRight, TbZoomIn } from 'react-icons/tb'
import { createPortal } from 'react-dom'

interface PromptImagesPopupProps {
    images: string[]
    isVisible: boolean
}

export function PromptImagesPopup({ images, isVisible }: PromptImagesPopupProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return
            if (e.key === 'Escape') setSelectedIndex(null)
            if (e.key === 'ArrowLeft') navigatePrev()
            if (e.key === 'ArrowRight') navigateNext()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedIndex, images.length])

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedIndex !== null) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [selectedIndex])

    if (!images || images.length === 0) return null

    const displayImages = images.slice(0, 4)

    const handleImageClick = (e: React.MouseEvent, index: number) => {
        e.preventDefault()
        e.stopPropagation()
        setSelectedIndex(index)
    }

    const handleClose = (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }
        setSelectedIndex(null)
    }

    const navigatePrev = () => {
        if (selectedIndex === null) return
        setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1)
    }

    const navigateNext = () => {
        if (selectedIndex === null) return
        setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1)
    }

    // Grid layout
    const getGridClass = (idx: number, total: number) => {
        const base = "relative overflow-hidden cursor-pointer group/thumb"
        if (total === 1) return base + " col-span-2 row-span-2"
        if (total === 2) return base + " col-span-1 row-span-2"
        if (total === 3) return idx === 0 ? base + " col-span-1 row-span-2" : base + " col-span-1 row-span-1"
        return base + " col-span-1 row-span-1"
    }

    return (
        <>
            {/* Hover Grid Preview */}
            <div
                className={`
                    absolute inset-0 z-30 bg-black/95 backdrop-blur-sm rounded-xl overflow-hidden
                    transition-all duration-300 ease-out
                    ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                `}
            >
                <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1 p-1">
                    {displayImages.map((src, idx) => (
                        <div
                            key={idx}
                            className={getGridClass(idx, displayImages.length)}
                            onClick={(e) => handleImageClick(e, idx)}
                        >
                            <Image
                                src={src}
                                alt={`Preview ${idx + 1}`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                                sizes="200px"
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white/20 backdrop-blur-md rounded-full p-3 transform scale-75 group-hover/thumb:scale-100 transition-transform duration-200">
                                        <TbZoomIn className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* More images indicator */}
                {images.length > 4 && (
                    <div className="absolute bottom-2 right-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20">
                        +{images.length - 4} ფოტო
                    </div>
                )}
            </div>

            {/* Fullscreen Lightbox */}
            {mounted && selectedIndex !== null && createPortal(
                <div
                    className="fixed inset-0 flex items-center justify-center"
                    style={{ zIndex: 99999 }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                        onClick={handleClose}
                    />

                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-md border border-white/10"
                    >
                        <TbX className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </button>

                    {/* Navigation Arrows - Desktop */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); navigatePrev() }}
                                className="hidden sm:flex absolute left-4 sm:left-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-md border border-white/10 items-center justify-center"
                            >
                                <TbChevronLeft className="w-6 h-6 text-white" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); navigateNext() }}
                                className="hidden sm:flex absolute right-4 sm:right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-md border border-white/10 items-center justify-center"
                            >
                                <TbChevronRight className="w-6 h-6 text-white" />
                            </button>
                        </>
                    )}

                    {/* Image Container */}
                    <div
                        className="relative z-10 w-full h-full flex items-center justify-center p-4 sm:p-12"
                        onClick={handleClose}
                    >
                        <div
                            className="relative max-w-full max-h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={images[selectedIndex]}
                                alt="Enlarged view"
                                className="max-w-[95vw] sm:max-w-[85vw] max-h-[85vh] sm:max-h-[90vh] w-auto h-auto object-contain rounded-lg sm:rounded-2xl shadow-2xl"
                                draggable={false}
                            />
                        </div>
                    </div>

                    {/* Mobile swipe indicators / dots */}
                    {images.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                            {/* Mobile nav buttons */}
                            <button
                                onClick={(e) => { e.stopPropagation(); navigatePrev() }}
                                className="sm:hidden p-1.5 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <TbChevronLeft className="w-5 h-5 text-white" />
                            </button>

                            {/* Dots */}
                            <div className="flex items-center gap-1.5">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setSelectedIndex(idx) }}
                                        className={`
                                            w-2 h-2 rounded-full transition-all duration-200
                                            ${idx === selectedIndex
                                                ? 'bg-white w-6'
                                                : 'bg-white/40 hover:bg-white/60'}
                                        `}
                                    />
                                ))}
                            </div>

                            {/* Mobile nav buttons */}
                            <button
                                onClick={(e) => { e.stopPropagation(); navigateNext() }}
                                className="sm:hidden p-1.5 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <TbChevronRight className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    )}

                    {/* Counter */}
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-sm font-medium text-white border border-white/10">
                        {selectedIndex + 1} / {images.length}
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
