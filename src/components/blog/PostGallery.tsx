"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { TbChevronLeft, TbChevronRight, TbX, TbZoomIn } from "react-icons/tb"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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
    const [lightboxIndex, setLightboxIndex] = useState(0);

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
        setLightboxIndex(index);
        setIsLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        document.body.style.overflow = '';
    };

    const lightboxNext = () => {
        setLightboxIndex((prev) => (prev + 1) % images.length);
    };

    const lightboxPrev = () => {
        setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <>
            <div className={cn("post-gallery", className)}>
                {/* Title */}
                {title && (
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <TbZoomIn className="w-5 h-5 text-primary" />
                        {title}
                    </h3>
                )}

                {/* Carousel container */}
                <div className="relative group">
                    {/* Main image */}
                    <div
                        className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-zoom-in"
                        onClick={() => openLightbox(currentIndex)}
                    >
                        <Image
                            src={images[currentIndex].src}
                            alt={images[currentIndex].alt || `Gallery image ${currentIndex + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 600px"
                        />

                        {/* TbPhoto counter */}
                        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                            {currentIndex + 1} / {images.length}
                        </div>

                        {/* Caption */}
                        {images[currentIndex].caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                                <p className="text-white text-sm">
                                    {images[currentIndex].caption}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Navigation buttons */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={goToPrev}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                            >
                                <TbChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                            >
                                <TbChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={cn(
                                    "relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden transition-all",
                                    index === currentIndex
                                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                                        : "opacity-60 hover:opacity-100"
                                )}
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt || `Thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={closeLightbox}
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                    >
                        <TbX className="w-6 h-6" />
                    </button>

                    {/* TbPhoto */}
                    <div
                        className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={images[lightboxIndex].src}
                            alt={images[lightboxIndex].alt || `Gallery image ${lightboxIndex + 1}`}
                            fill
                            className="object-contain"
                            sizes="90vw"
                        />
                    </div>

                    {/* Navigation */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                            >
                                <TbChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                            >
                                <TbChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Counter and caption */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                        <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-2">
                            {lightboxIndex + 1} / {images.length}
                        </div>
                        {images[lightboxIndex].caption && (
                            <p className="text-white/80 text-sm max-w-lg">
                                {images[lightboxIndex].caption}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default PostGallery;
