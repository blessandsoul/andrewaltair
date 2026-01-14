"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"

interface PageTransitionProps {
    children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname()

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [pathname])

    return (
        <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
                type: "tween",
                ease: "easeOut",
                duration: 0.3
            }}
        >
            {children}
        </motion.div>
    )
}

