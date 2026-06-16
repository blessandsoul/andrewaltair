'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Projector no-scroll guarantee. Measures its content's natural height against its
 * bounded box and scales the content DOWN (never up) so it always fits — instead of
 * clipping or scrolling. Transforms don't reflow, so `scrollHeight` stays the true
 * unscaled height and the scale converges in one pass.
 */
export default function FitScale({ children, className }: { children: React.ReactNode; className?: string }) {
    const boxRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)

    useLayoutEffect(() => {
        const box = boxRef.current
        const content = contentRef.current
        if (!box || !content) return
        const measure = () => {
            const bh = box.clientHeight
            const ch = content.scrollHeight
            if (!bh || !ch) return
            const s = Math.min(1, bh / ch)
            setScale(s > 0.05 ? s : 1)
        }
        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(box)
        ro.observe(content)
        return () => ro.disconnect()
    }, [children])

    return (
        <div ref={boxRef} className={cn('relative flex min-h-0 flex-1 items-center justify-center overflow-hidden', className)}>
            <div ref={contentRef} style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }} className="w-full">
                {children}
            </div>
        </div>
    )
}
