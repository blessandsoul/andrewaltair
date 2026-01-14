"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { TbChevronLeft, TbChevronRight, TbZoomIn } from "react-icons/tb"
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

export function PostGallery({ images, title = "შედეგების გალერეა", className }: PostGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    if (!images || images.length === 0) {
        return null;
    }

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setIsLightboxOpen(true);
    };

    return (
        <>
            <div className={cn("post-gallery space-y-4", className)}>
                {/* Title */}
                {title && (
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <TbZoomIn className="w-5 h-5 text-primary" />
                        {title}
                    </h3>
                )}

                {/* Main Image Container */}
                <div className="relative group rounded-xl overflow-hidden bg-black/5 border border-white/10 shadow-2xl">
                    {/* Main image with fixed aspect ratio container but contain mode */}
                    <div
                        className="relative aspect-video w-full cursor-zoom-in"
                        onClick={() => openLightbox(currentIndex)}
                    >
                        {/* Blurred background for fill */}
                        <div className="absolute inset-0 overflow-hidden">
                            <Image
                                src={images[currentIndex].src}
                                alt="Background blur"
                                fill
                                className="object-cover opacity-30 blur-2xl scale-110"
                            />
                        </div>

                        {/* Main Image */}
                        <Image
                            src={images[currentIndex].src}
                            alt={images[currentIndex].alt || `Gallery image ${currentIndex + 1}`}
                            fill
                            className="object-contain relative z-10 transition-transform duration-300 group-hover:scale-[1.02]"
                            sizes="(max-width: 768px) 100vw, 800px"
                            priority
                        />

                        {/* Counter */}
                        <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium border border-white/10">
                            {currentIndex + 1} / {images.length}
                        </div>

                        {/* Caption */}
                        {images[currentIndex].caption && (
                            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-12">
                                <p className="text-white font-medium text-sm md:text-base max-w-2xl">
                                    {images[currentIndex].caption}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Navigation buttons */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrev();
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70 hover:scale-110 border border-white/10"
                                aria-label="Previous image"
                            >
                                <TbChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNext();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70 hover:scale-110 border border-white/10"
                                aria-label="Next image"
                            >
                                <TbChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide py-1">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={cn(
                                    "relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden transition-all duration-200 border border-transparent",
                                    index === currentIndex
                                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105 opacity-100 z-10"
                                        : "opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
                                )}
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt || `Thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            </button>
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
