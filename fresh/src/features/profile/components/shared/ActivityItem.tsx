/**
 * Profile Feature - Activity Item Component
 * Individual activity row with icon and timestamp
 */

"use client"

import * as React from "react"
import {
    User,
    Edit2,
    MessageSquare,
    Heart,
    Eye,
    Bell,
    Lock,
    type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ActivityItem as ActivityItemType } from "../../types"

const activityIcons: Record<string, { icon: LucideIcon; color: string }> = {
    login: { icon: User, color: "text-green-500" },
    profile_update: { icon: Edit2, color: "text-blue-500" },
    comment: { icon: MessageSquare, color: "text-purple-500" },
    like: { icon: Heart, color: "text-red-500" },
    view: { icon: Eye, color: "text-gray-500" },
    subscription: { icon: Bell, color: "text-yellow-500" },
    password_change: { icon: Lock, color: "text-orange-500" },
}

interface ActivityItemProps {
    activity: ActivityItemType
    className?: string
}

export function ActivityItem({ activity, className }: ActivityItemProps) {
    const iconConfig = activityIcons[activity.type] || activityIcons.login
    const IconComponent = iconConfig.icon

    return (
        <div
            className={cn(
                "flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors",
                className
            )}
        >
            <div
                className={cn(
                    "w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center",
                    iconConfig.color
                )}
            >
                <IconComponent className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{activity.description}</p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
            </div>
        </div>
    )
}
