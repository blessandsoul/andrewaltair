/**
 * Profile Feature - Stat Card Component
 * Display metrics with icons and gradients
 */

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type IconType = React.ComponentType<{ className?: string }>

interface StatCardProps {
    icon: IconType
    value: string | number
    label: string
    color: "blue" | "green" | "purple" | "red" | "yellow"
    className?: string
}

const colorVariants = {
    blue: "from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-500",
    green: "from-green-500/10 to-green-500/5 border-green-500/20 text-green-500",
    purple: "from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-500",
    red: "from-red-500/10 to-red-500/5 border-red-500/20 text-red-500",
    yellow: "from-yellow-500/10 to-yellow-500/5 border-yellow-500/20 text-yellow-500",
}

export function StatCard({ icon: Icon, value, label, color, className }: StatCardProps) {
    return (
        <div
            className={cn(
                "p-4 rounded-lg bg-gradient-to-br border",
                colorVariants[color],
                className
            )}
        >
            <Icon className="w-6 h-6 mb-2" />
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    )
}
