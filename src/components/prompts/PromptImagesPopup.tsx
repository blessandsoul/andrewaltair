'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useState } from 'react'
import { TbX } from 'react-icons/tb'

interface PromptImagesPopupProps {
    images: string[]
    isVisible: boolean
}

export function PromptImagesPopup({ images, isVisible }: PromptImagesPopupProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    if (!images || images.length === 0) return null

    const displayImages = images.slice(0, 4) // Max 4 images for the popup

    const handleImageClick = (e: React.MouseEvent, src: string) => {
        e.preventDefault()
        e.stopPropagation()
        setSelectedImage(src)
    }

    const handleCloseZoom = () => {
        setSelectedImage(null)
    }

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute inset-0 z-50 overflow-hidden rounded-xl bg-background/95 backdrop-blur-md shadow-2xl border border-white/10"
                    >
                        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1 p-1">
                            {displayImages.map((src, idx) => {
                                // Layout logic
                                let className = "relative overflow-hidden bg-muted rounded-lg cursor-pointer group/img"

                                // If only 1 image, it takes full space
                                if (displayImages.length === 1) {
                                    className += " col-span-2 row-span-2"
                                }
                                // If 2 images, they take full height, split width
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
                                    <div
                                        key={idx}
                                        className={className}
                                        onClick={(e) => handleImageClick(e, src)}
                                    >
                                        <Image
                                            src={src}
                                            alt={`Preview ${idx + 1}`}
                                            fill
                                            className="object-cover transition-all duration-300 group-hover/img:scale-110 group-hover/img:brightness-110"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                            <div className="opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                                </svg>
                                            </div>
                                        </div>
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

            {/* Zoom Dialog */}
            <Dialog open={!!selectedImage} onOpenChange={(open) => !open && handleCloseZoom()}>
                <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-transparent overflow-hidden sm:rounded-none">
                    <div
                        className="relative w-full h-full flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={handleCloseZoom}
                    >
                        {selectedImage && (
                            <div className="relative w-full h-full max-w-7xl max-h-[85vh] aspect-video">
                                <Image
                                    src={selectedImage}
                                    alt="Zoomed image"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
