/**
 * Profile Feature - Activity Item Component
 * Individual activity row with icon and timestamp
 */

"use client"

import * as React from "react"
import { TbUser, TbEdit, TbMessage, TbHeart, TbEye, TbBell, TbLock } from "react-icons/tb"
import { cn } from "@/lib/utils"
import type { ActivityItem as ActivityItemType } from "../../types"

type IconType = React.ComponentType<{ className?: string }>

const activityIcons: Record<string, { icon: IconType; color: string }> = {
    login: { icon: TbUser, color: "text-green-500" },
    profile_update: { icon: TbEdit, color: "text-blue-500" },
    comment: { icon: TbMessage, color: "text-purple-500" },
    like: { icon: TbHeart, color: "text-red-500" },
    view: { icon: TbEye, color: "text-gray-500" },
    subscription: { icon: TbBell, color: "text-yellow-500" },
    password_change: { icon: TbLock, color: "text-orange-500" },
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
