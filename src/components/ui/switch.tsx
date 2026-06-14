"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
    ({ className, checked, onCheckedChange, ...props }, ref) => {
        return (
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    ref={ref}
                    checked={checked}
                    onChange={(e) => onCheckedChange?.(e.target.checked)}
                    className="sr-only peer"
                    {...props}
                />
                <div
                    className={cn(
                        "w-11 h-6 bg-input border border-border rounded-full peer transition-colors",
                        "peer-checked:bg-primary peer-checked:border-primary",
                        "peer-focus-visible:ring-2 peer-focus-visible:ring-ring/40",
                        "after:content-['']",
                        "after:absolute after:top-0.5 after:left-0.5",
                        "after:bg-background after:rounded-full after:shadow-sm",
                        "after:h-5 after:w-5",
                        "after:transition-all after:duration-200",
                        "peer-checked:after:translate-x-full",
                        className
                    )}
                />
            </label>
        )
    }
)
Switch.displayName = "Switch"

export { Switch }
