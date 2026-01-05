"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface NeuroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost"
    size?: "sm" | "md" | "lg"
    children: React.ReactNode
}

/**
 * NeuroButton — Button with built-in micro-interactions
 * 
 * Features:
 * - TbScale 0.98 on active (visceral press feedback)
 * - 0.2s transition duration
 * - Focus-visible ring (keyboard only)
 * - Single accent color for dopamine anchor
 */
export const NeuroButton = forwardRef<HTMLButtonElement, NeuroButtonProps>(
    ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
        const baseStyles = cn(
            // Base layout
            "inline-flex items-center justify-center gap-2",
            "font-medium rounded-lg",
            // Micro-interaction: scale 0.98 on active
            "transition-all duration-200 ease-out",
            "hover:scale-[1.01] active:scale-[0.98]",
            // Focus-visible only (keyboard navigation)
            "focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
            "focus-visible:outline-[oklch(0.7_0.15_280)]",
            // Disabled state
            "disabled:opacity-50 disabled:pointer-events-none"
        )

        const variants = {
            primary: cn(
                "bg-[oklch(0.7_0.15_280)] text-[#0A0A0A]",
                "hover:shadow-[0_0_20px_oklch(0.7_0.15_280_/_0.4)]"
            ),
            secondary: cn(
                "bg-[#1A1A1E] text-[#FCFCFC] border border-white/[0.08]",
                "hover:border-white/[0.15] hover:bg-[#222226]"
            ),
            ghost: cn(
                "text-[#A1A1AA]",
                "hover:text-[#FCFCFC] hover:bg-white/[0.05]"
            )
        }

        const sizes = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-sm",
            lg: "px-6 py-3 text-base"
        }

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {children}
            </button>
        )
    }
)

NeuroButton.displayName = "NeuroButton"
