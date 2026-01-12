'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface PromptImagesPopupProps {
    images: string[]
    isVisible: boolean
}

export function PromptImagesPopup({ images, isVisible }: PromptImagesPopupProps) {
    // If we only have 1 image, showing a grid is redundant, but the user asked for "all photos".
    // If 1 image -> full size.
    // If 2 images -> split vertical.
    // If 3 images -> 1 big, 2 small.
    // If 4+ images -> 2x2 grid (or similar 1+3 layout).

    // We'll use a dynamic grid layout based on count.

    if (!images || images.length === 0) return null

    const displayImages = images.slice(0, 4) // Max 4 images for the popup to keep it clean

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute inset-0 z-50 overflow-hidden rounded-xl bg-background/95 backdrop-blur-md shadow-2xl border border-white/10"
                >
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5 p-0.5">
                        {displayImages.map((src, idx) => {
                            // Layout logic
                            let className = "relative overflow-hidden bg-muted"

                            // If only 1 image, it takes full space
                            if (displayImages.length === 1) {
                                className += " col-span-2 row-span-2"
                            }
                            // If 2 images, they take full height, split width (cols-1) or full width, split height (rows-1)
                            // Let's do columns
                            else if (displayImages.length === 2) {
                                className += " col-span-1 row-span-2"
                            }
                            // If 3 images, first one is big (2 rows), others are small
                            else if (displayImages.length === 3) {
                                if (idx === 0) className += " col-span-1 row-span-2"
                                else className += " col-span-1 row-span-1"
                            }
                            // If 4 images, standard 2x2 (default)
                            else {
                                className += " col-span-1 row-span-1"
                            }

                            return (
                                <div key={idx} className={className}>
                                    <Image
                                        src={src}
                                        alt={`Preview ${idx + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-500 hover:scale-110"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                </div>
                            )
                        })}
                    </div>

                    {/* Overlay counting extra images if any */}
                    {images.length > 4 && (
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white border border-white/10">
                            +{images.length - 4}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
