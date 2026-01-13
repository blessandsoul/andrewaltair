"use client"

import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TbMail } from "react-icons/tb"

export function StickyCTA() {
    const { scrollY } = useScroll()
    const [visible, setVisible] = useState(false)

    useMotionValueEvent(scrollY, "change", (latest) => {
        // Show after scrolling past hero (~600px)
        if (latest > 600) {
            setVisible(true)
        } else {
            setVisible(false)
        }
    })

    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm py-3"
        >
            <div className="container mx-auto px-4 flex items-center justify-between max-w-7xl">
                <div className="font-bold text-sm sm:text-base">
                    Mada for Collaboration?
                </div>
                <div className="flex gap-3">
                    <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
                        <TbMail className="mr-2 w-4 h-4" />
                        Let's Talk
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
