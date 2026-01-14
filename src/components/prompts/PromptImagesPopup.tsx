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
            <AnimatePresence mode="wait">
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute inset-0 z-30 overflow-hidden rounded-xl bg-black/95"
                    >
                        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1 p-1">
                            {displayImages.map((src, idx) => {
                                // Layout logic
                                let className = "relative overflow-hidden bg-muted/20 rounded-md cursor-pointer group/img"

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
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.15, delay: idx * 0.05 }}
                                        className={className}
                                        onClick={(e) => handleImageClick(e, src)}
                                    >
                                        <Image
                                            src={src}
                                            alt={`Preview ${idx + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-200 group-hover/img:scale-105"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-white/0 group-hover/img:bg-white/10 transition-colors duration-200 flex items-center justify-center">
                                            <div className="opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 bg-black/40 backdrop-blur-sm rounded-full p-2.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* Overlay counting extra images if any */}
                        {images.length > 4 && (
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-[10px] font-bold text-white">
                                +{images.length - 4}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Zoom Dialog - High z-index to appear above header */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={handleCloseZoom}
                >
                    {/* Close button */}
                    <button
                        onClick={handleCloseZoom}
                        className="absolute top-4 right-4 z-[10000] p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <TbX className="w-6 h-6 text-white" />
                    </button>

                    {/* Image container - preserves aspect ratio */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative max-w-[90vw] max-h-[90vh] w-auto h-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={selectedImage}
                            alt="Zoomed image"
                            width={1920}
                            height={1080}
                            className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-lg"
                            priority
                            unoptimized
                        />
                    </motion.div>
                </div>
            )}
        </>
    )
}
