"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { TbChevronLeft, TbChevronRight, TbMaximize, TbPhoto } from "react-icons/tb"
import { cn } from "@/lib/utils"
import { ImageLightbox } from "@/components/interactive/ImageLightbox"

interface GalleryImage {
    src: string;
    alt?: string;
    caption?: string;
}

interface PostGalleryProps {
    images: GalleryImage[];
    title?: string;
    className?: string;
}

export function PostGallery({ images, title = "გალერეა", className }: PostGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [direction, setDirection] = useState(0);

    if (!images || images.length === 0) {
        return null;
    }

    const goToNext = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const goToPrev = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setIsLightboxOpen(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            e.stopPropagation();
            goToPrev();
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            e.stopPropagation();
            goToNext();
        }
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.95
        })
    };

    return (
        <>
            <div
                className={cn("post-gallery space-y-5 outline-none", className)}
                tabIndex={0}
                onKeyDown={handleKeyDown}
            >
                {/* Title with icon */}
                {title && (
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <TbPhoto className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                            {title}
                        </h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                    </div>
                )}

                {/* Main Image Container */}
                <div className="relative group rounded-2xl overflow-hidden bg-gradient-to-br from-card via-card to-muted/30 border border-white/10 shadow-2xl">
                    {/* Main image with fixed aspect ratio container but contain mode */}
                    <div
                        className="relative aspect-[16/10] w-full cursor-zoom-in overflow-hidden"
                        onClick={() => openLightbox(currentIndex)}
                    >
                        {/* Animated Blurred background for ambient effect */}
                        <AnimatePresence initial={false}>
                            <motion.div
                                key={currentIndex + "-bg"}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 0.4, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0 overflow-hidden"
                            >
                                <Image
                                    src={images[currentIndex].src}
                                    alt="Background blur"
                                    fill
                                    className="object-cover blur-3xl scale-125"
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Main Image with slide animation */}
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 },
                                    scale: { duration: 0.2 }
                                }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <Image
                                    src={images[currentIndex].src}
                                    alt={images[currentIndex].alt || `Gallery image ${currentIndex + 1}`}
                                    fill
                                    className="object-contain relative z-10 transition-transform duration-500 group-hover:scale-[1.02]"
                                    sizes="(max-width: 768px) 100vw, 800px"
                                    priority
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Counter Badge - Premium Style */}
                        <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-xl px-4 py-1.5 rounded-full text-white text-xs font-semibold border border-white/10 shadow-lg flex items-center gap-2">
                            <span className="text-primary">{currentIndex + 1}</span>
                            <span className="text-white/40">/</span>
                            <span>{images.length}</span>
                        </div>

                        {/* Zoom Indicator */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ opacity: 1, scale: 1 }}
                            className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-xl p-2.5 rounded-full text-white border border-white/10 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                            <TbMaximize className="w-4 h-4" />
                        </motion.div>

                        {/* Caption with gradient overlay */}
                        {images[currentIndex].caption && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pt-16"
                            >
                                <p className="text-white font-medium text-sm md:text-base max-w-2xl drop-shadow-lg">
                                    {images[currentIndex].caption}
                                </p>
                            </motion.div>
                        )}

                        {/* Decorative corner gradients */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent" />
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary/10 to-transparent" />
                        </div>
                    </div>

                    {/* Navigation buttons - Premium Style */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrev();
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60 hover:scale-110 border border-white/10 shadow-xl"
                                aria-label="Previous image"
                            >
                                <TbChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNext();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60 hover:scale-110 border border-white/10 shadow-xl"
                                aria-label="Next image"
                            >
                                <TbChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails - Premium Floating Style */}
                {images.length > 1 && (
                    <div className="relative z-30 flex gap-3 overflow-x-auto overflow-y-visible pt-4 pb-4 scrollbar-hide px-1 -mt-2">
                        {images.map((image, index) => (
                            <motion.button
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setDirection(index > currentIndex ? 1 : -1);
                                    setCurrentIndex(index);
                                }}
                                whileHover={{ scale: 1.08, y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 border-2 shadow-lg",
                                    index === currentIndex
                                        ? "border-primary ring-2 ring-primary/30 scale-105 opacity-100 z-10 shadow-primary/20"
                                        : "border-white/10 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 hover:border-white/20"
                                )}
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt || `Thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 120px, 200px"
                                    quality={85}
                                />
                                {/* Active indicator dot */}
                                {index === currentIndex && (
                                    <motion.div
                                        layoutId="active-gallery-thumb"
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/50"
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>

            {/* Reused ImageLightbox Component */}
            <ImageLightbox
                src={images[currentIndex].src}
                alt={images[currentIndex].alt || ""}
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
                images={images.map(img => ({
                    src: img.src,
                    alt: img.alt || ""
                }))}
                initialIndex={currentIndex}
            />
        </>
    );
}

export default PostGallery;
