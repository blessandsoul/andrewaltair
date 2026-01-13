"use client"

import { motion } from "framer-motion"
import { TbCircleFilled, TbClock } from "react-icons/tb"

export function AboutOnlineStatus() {
    // Get current hour for Georgian timezone (UTC+4)
    const now = new Date()
    const georgiaHour = (now.getUTCHours() + 4) % 24

    // Determine activity based on time
    const getActivity = () => {
        if (georgiaHour >= 23 || georgiaHour < 8) {
            return { status: "💤 ძილში", color: "text-purple-400", bgColor: "bg-purple-400" }
        } else if (georgiaHour >= 8 && georgiaHour < 10) {
            return { status: "☕ დილის კოფე", color: "text-amber-400", bgColor: "bg-amber-400" }
        } else if (georgiaHour >= 10 && georgiaHour < 13) {
            return { status: "💻 სამუშაოზე", color: "text-emerald-400", bgColor: "bg-emerald-400" }
        } else if (georgiaHour >= 13 && georgiaHour < 14) {
            return { status: "🍽️ ლანჩი", color: "text-orange-400", bgColor: "bg-orange-400" }
        } else if (georgiaHour >= 14 && georgiaHour < 18) {
            return { status: "🎬 კონტენტი/მუშაობა", color: "text-emerald-400", bgColor: "bg-emerald-400" }
        } else if (georgiaHour >= 18 && georgiaHour < 21) {
            return { status: "📱 ხელმისაწვდომი", color: "text-emerald-400", bgColor: "bg-emerald-400" }
        } else {
            return { status: "📚 კითხვა/რელაქსი", color: "text-sky-400", bgColor: "bg-sky-400" }
        }
    }

    const activity = getActivity()
    const isOnline = georgiaHour >= 9 && georgiaHour < 23

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-white/10"
        >
            {/* Pulsing dot */}
            <span className="relative flex h-3 w-3">
                {isOnline && (
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${activity.bgColor} opacity-75`} />
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${activity.bgColor}`} />
            </span>

            {/* Status text */}
            <span className={`text-sm font-medium ${activity.color}`}>
                {isOnline ? "🟢 ონლაინი" : activity.status}
            </span>

            {/* Current activity */}
            <span className="text-sm text-muted-foreground border-l border-white/10 pl-3">
                {activity.status}
            </span>
        </motion.div>
    )
}
