"use client"

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation, PanInfo } from "framer-motion"
import {
    TbX, TbZoomIn, TbZoomOut, TbChevronLeft, TbChevronRight,
    TbDownload, TbMaximize, TbMinimize, TbLayoutGrid
} from "react-icons/tb"
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
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showControls, setShowControls] = useState(true)
    const [direction, setDirection] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const hasMultiple = images.length > 1
    const currentPhoto = hasMultiple ? images[currentIndex] : { src, alt }

    // Animation controls
    const x = useMotionValue(0)
    const scale = useMotionValue(1)
    const controlsOpacity = useMotionValue(1)

    // Reset state when opening (useLayoutEffect prevents flash of old state)
    useLayoutEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex)
            setZoom(1)
            setDirection(0)
            document.body.style.overflow = "hidden"
            resetControlsTimer()
        } else {
            document.body.style.overflow = ""
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
        }
        return () => {
            document.body.style.overflow = ""
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
        }
    }, [isOpen, initialIndex])

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            // Stop this event from triggering other listeners (like PostNavigation)
            e.stopImmediatePropagation();
            resetControlsTimer()
            switch (e.key) {
                case "Escape":
                    if (isFullscreen) toggleFullscreen()
                    else onClose()
                    break
                case "ArrowLeft":
                    if (hasMultiple) {
                        e.preventDefault()
                        paginate(-1)
                    }
                    break
                case "ArrowRight":
                    if (hasMultiple) {
                        e.preventDefault()
                        paginate(1)
                    }
                    break
                case "+":
                case "=":
                    zoomIn()
                    break
                case "-":
                    zoomOut()
                    break
                case " ":
                case "Enter":
                    e.preventDefault()
                    toggleZoom()
                    break
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, hasMultiple, currentIndex, zoom, isFullscreen])

    // Auto-hide controls
    const resetControlsTimer = () => {
        setShowControls(true)
        controlsOpacity.set(1)
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
        controlsTimeoutRef.current = setTimeout(() => {
            if (!containerRef.current?.matches(':hover')) {
                setShowControls(false)
            }
        }, 3000)
    }

    const handleMouseMove = () => {
        resetControlsTimer()
    }

    const paginate = (newDirection: number) => {
        setDirection(newDirection)
        setCurrentIndex((prev) => (prev + newDirection + images.length) % images.length)
        setZoom(1)
        scale.set(1)
        x.set(0)
    }

    const zoomIn = () => {
        const newZoom = Math.min(zoom + 0.5, 4)
        setZoom(newZoom)
        scale.set(newZoom)
    }

    const zoomOut = () => {
        const newZoom = Math.max(zoom - 0.5, 0.5)
        setZoom(newZoom)
        scale.set(newZoom)
        if (newZoom <= 1) x.set(0)
    }

    const toggleZoom = () => {
        if (zoom > 1) {
            setZoom(1)
            scale.set(1)
            x.set(0)
        } else {
            setZoom(2)
            scale.set(2)
        }
    }

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    // Drag handlers
    const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (zoom > 1) return // Allow panning when zoomed

        const swipeThreshold = 50
        const velocityThreshold = 500

        // Vertical swipe to close
        if (Math.abs(info.offset.y) > 100 && Math.abs(info.velocity.y) > 500) {
            onClose()
            return
        }

        // Horizontal swipe to navigate
        if (hasMultiple) {
            if (info.offset.x > swipeThreshold && info.velocity.x > velocityThreshold) {
                paginate(-1)
            } else if (info.offset.x < -swipeThreshold && info.velocity.x < -velocityThreshold) {
                paginate(1)
            }
        }
    }

    // Thumbnails logic
    const thumbnailContainerRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (thumbnailContainerRef.current) {
            const activeThumb = thumbnailContainerRef.current.children[currentIndex] as HTMLElement
            if (activeThumb) {
                activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
            }
        }
    }, [currentIndex])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={containerRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
                    onClick={onClose}
                    onMouseMove={handleMouseMove}
                >
                    {/* Immersive Background Gradient */}
                    {/* Immersive Background Gradient - Moved INSIDE to ensure it exits with parent */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 overflow-hidden pointer-events-none"
                    >
                        <motion.div
                            key={currentPhoto.src}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 bg-cover bg-center blur-3xl transform"
                            style={{ backgroundImage: `url(${currentPhoto.src})` }}
                        />
                    </motion.div>

                    {/* Top Controls Bar */}
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: showControls ? 0 : -50, opacity: showControls ? 1 : 0 }}
                        className="absolute top-0 left-0 right-0 z-[130] flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-4 text-white/80">
                            <span className="text-sm font-medium px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/5">
                                {currentIndex + 1} / {images.length}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <ControlButton onClick={toggleZoom} tooltip="Zoom">
                                {zoom > 1 ? <TbZoomOut /> : <TbZoomIn />}
                            </ControlButton>
                            <ControlButton onClick={toggleFullscreen} tooltip="Fullscreen">
                                {isFullscreen ? <TbMinimize /> : <TbMaximize />}
                            </ControlButton>
                            <div className="w-px h-6 bg-white/20 mx-2" />
                            <ControlButton
                                onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = currentPhoto.src;
                                    link.download = currentPhoto.alt || "image";
                                    link.click();
                                }}
                                tooltip="Download"
                            >
                                <TbDownload />
                            </ControlButton>
                            <ControlButton onClick={onClose} className="bg-red-500/20 hover:bg-red-500/40 text-red-500 border-red-500/20">
                                <TbX />
                            </ControlButton>
                        </div>
                    </motion.div>

                    {/* Main Image Area */}
                    <div
                        className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={{
                                    enter: (direction: number) => ({
                                        x: direction > 0 ? 500 : -500,
                                        opacity: 0,
                                        scale: 0.8
                                    }),
                                    center: {
                                        zIndex: 1,
                                        x: 0,
                                        opacity: 1,
                                        scale: 1
                                    },
                                    exit: (direction: number) => ({
                                        zIndex: 0,
                                        x: direction < 0 ? 500 : -500,
                                        opacity: 0,
                                        scale: 0.8
                                    })
                                }}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 },
                                    scale: { duration: 0.2 }
                                }}
                                className="relative w-full h-full flex items-center justify-center px-4 md:px-16"
                                drag={zoom > 1 ? true : "x"}
                                dragConstraints={zoom > 1 ? containerRef : { left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragEnd={onDragEnd}
                                onDoubleClick={toggleZoom}
                            >
                                <motion.div
                                    animate={{ scale: zoom }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="relative max-w-full max-h-full cursor-grab active:cursor-grabbing shadow-2xl"
                                >
                                    {/* Spinner */}
                                    <div className="absolute inset-0 flex items-center justify-center -z-10">
                                        <div className="w-10 h-10 border-2 border-white/20 border-t-primary rounded-full animate-spin" />
                                    </div>

                                    <Image
                                        src={currentPhoto.src}
                                        alt=""
                                        width={1920}
                                        height={1080}
                                        className="max-w-full max-h-[85vh] object-contain select-none rounded-lg ring-1 ring-white/10"
                                        draggable={false}
                                        priority
                                        sizes="100vw"
                                    />
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows (Desktop) */}
                        {hasMultiple && (
                            <>
                                <NavigationButton
                                    direction="left"
                                    onClick={(e) => { e.stopPropagation(); paginate(-1) }}
                                    visible={showControls}
                                />
                                <NavigationButton
                                    direction="right"
                                    onClick={(e) => { e.stopPropagation(); paginate(1) }}
                                    visible={showControls}
                                />
                            </>
                        )}
                    </div>

                    {/* Bottom Thumbnail Strip - High Z-Index & Premium Style */}
                    {hasMultiple && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: showControls ? 0 : 100, opacity: showControls ? 1 : 0 }}
                            className="absolute bottom-6 left-0 right-0 z-[150] flex justify-center px-4 pointer-events-none"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-3 flex gap-4 overflow-x-auto max-w-full md:max-w-4xl scrollbar-hide shadow-2xl pointer-events-auto ring-1 ring-white/5"
                                ref={thumbnailContainerRef}
                            >
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setDirection(idx > currentIndex ? 1 : -1)
                                            setCurrentIndex(idx)
                                            setZoom(1)
                                        }}
                                        className={cn(
                                            "relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-500 transform border-2",
                                            idx === currentIndex
                                                ? "border-primary scale-110 shadow-lg shadow-primary/40 z-10 opacity-100 ring-2 ring-primary/20"
                                                : "border-white/5 opacity-40 hover:opacity-100 hover:scale-105 hover:border-white/20 grayscale hover:grayscale-0"
                                        )}
                                    >
                                        <Image
                                            src={img.src}
                                            alt={img.alt || ""}
                                            fill
                                            className="object-cover transition-transform duration-700 hover:scale-110"
                                            sizes="120px"
                                        />
                                        {idx === currentIndex && (
                                            <motion.div
                                                layoutId="active-thumb"
                                                className="absolute inset-0 border-2 border-primary rounded-2xl z-20 pointer-events-none"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Subcomponents
interface ControlButtonProps {
    children: React.ReactNode
    onClick: (e: React.MouseEvent) => void
    className?: string
    tooltip?: string
}

function ControlButton({ children, onClick, className, tooltip }: ControlButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
                e.stopPropagation()
                onClick(e as any)
            }}
            className={cn(
                "p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-md border border-white/5 shadow-lg",
                className
            )}
            title={tooltip}
        >
            {children}
        </motion.button>
    )
}

interface NavigationButtonProps {
    direction: 'left' | 'right'
    onClick: (e: React.MouseEvent) => void
    visible: boolean
}

function NavigationButton({ direction, onClick, visible }: NavigationButtonProps) {
    return (
        <motion.button
            initial={{ opacity: 0, x: direction === 'left' ? -20 : 20 }}
            animate={{ opacity: visible ? 1 : 0, x: 0 }}
            whileHover={{ scale: 1.2, backgroundColor: "rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className={cn(
                "absolute top-1/2 -translate-y-1/2 z-50 p-4 rounded-full text-white backdrop-blur-sm transition-colors cursor-pointer hover:bg-black/20",
                direction === 'left' ? "left-4 md:left-8" : "right-4 md:right-8"
            )}
        >
            {direction === 'left' ? <TbChevronLeft className="w-8 h-8" /> : <TbChevronRight className="w-8 h-8" />}
        </motion.button>
    )
}

// Hook export remains the same
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
