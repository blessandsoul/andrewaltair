"use client"

import { motion } from "framer-motion"
import { TbCircleFilled } from "react-icons/tb"

export function AboutOnlineStatus() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-white/10"
        >
            {/* Pulsing green dot - always online */}
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
            </span>

            {/* Status text */}
            <span className="text-sm font-medium text-emerald-400">
                ხელმისაწვდომი
            </span>

            {/* Response time */}
            <span className="text-sm text-muted-foreground border-l border-white/10 pl-3">
                პასუხი 24 საათში
            </span>
        </motion.div>
    )
}
