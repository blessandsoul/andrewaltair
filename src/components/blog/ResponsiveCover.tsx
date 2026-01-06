"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface CoverImages {
    horizontal?: string;  // 16:9 for desktop
    vertical?: string;    // 9:16 for mobile
}

interface ResponsiveCoverProps {
    coverImages?: CoverImages;
    coverImage?: string;  // Fallback legacy single cover
    title: string;
    onClick?: () => void;
    className?: string;
}

export function ResponsiveCover({
    coverImages,
    coverImage,
    title,
    onClick,
    className
}: ResponsiveCoverProps) {
    const [isMobile, setIsMobile] = useState(false);

    // Determine which image to show
    const horizontalSrc = coverImages?.horizontal || coverImage;
    const verticalSrc = coverImages?.vertical || coverImage;

    // Handle responsive detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // No images at all
    if (!horizontalSrc && !verticalSrc) {
        return null;
    }

    return (
        <div className={cn("relative", className)}>
            {/* Desktop: Horizontal 16:9 */}
            {horizontalSrc && (
                <div
                    className={cn(
                        "hidden md:block relative aspect-[16/9] rounded-xl overflow-hidden shadow-xl",
                        onClick && "cursor-zoom-in"
                    )}
                    onClick={onClick}
                >
                    <Image
                        src={horizontalSrc}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 0vw, (max-width: 1200px) 80vw, 900px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
            )}

            {/* Mobile: Vertical 9:16 or fallback to horizontal */}
            <div
                className={cn(
                    "md:hidden relative rounded-xl overflow-hidden shadow-xl",
                    verticalSrc && verticalSrc !== horizontalSrc
                        ? "aspect-[9/16]"
                        : "aspect-[16/9]",
                    onClick && "cursor-zoom-in"
                )}
                onClick={onClick}
            >
                <Image
                    src={verticalSrc || horizontalSrc || ''}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
        </div>
    );
}

export default ResponsiveCover;
