/**
 * Profile Feature - Reusable Setting Toggle Component
 * Modern Radix-based implementation
 */

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SettingToggleProps {
    label: string
    description?: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
    disabled?: boolean
    className?: string
}

export function SettingToggle({
    label,
    description,
    checked,
    onCheckedChange,
    disabled = false,
    className,
}: SettingToggleProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-between p-4 rounded-lg border border-border",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            <div className="flex-1">
                <p className="font-medium">{label}</p>
                {description && (
                    <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
                )}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => !disabled && onCheckedChange(!checked)}
                className={cn(
                    "relative w-12 h-6 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    checked ? "bg-primary" : "bg-muted",
                    disabled && "pointer-events-none"
                )}
            >
                <span
                    className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                        checked ? "right-1" : "left-1"
                    )}
                />
            </button>
        </div>
    )
}
