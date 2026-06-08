"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { consumeShallowNav } from "@/lib/inPageNav"

interface PageTransitionProps {
    children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname()
    const prevPathRef = useRef(pathname)
    // Decouple the remount key from pathname so an in-page (shallow) URL sync
    // does NOT remount the subtree (which would reset infinite-scroll state).
    const [transitionKey, setTransitionKey] = useState(pathname)

    useEffect(() => {
        // Effect re-ran without a real path change — do nothing.
        if (pathname === prevPathRef.current) return

        const shallow = consumeShallowNav()
        prevPathRef.current = pathname

        // In-page URL update (infinite scroll): keep scroll position, keep mount.
        if (shallow) return

        // Real navigation: bump key (remount + exit/enter anim) and scroll to top.
        setTransitionKey(pathname)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [pathname])

    return (
        <motion.div
            key={transitionKey}
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

