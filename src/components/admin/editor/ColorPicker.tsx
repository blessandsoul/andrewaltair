"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { TbPalette, TbX } from "react-icons/tb"

interface ColorPickerProps {
    onChange: (color: string) => void
    currentColor?: string
    type?: "text" | "background"
}

const textColors = [
    { name: "Default", value: "" },
    { name: "Gray", value: "#6B7280" },
    { name: "Brown", value: "#92400E" },
    { name: "Orange", value: "#EA580C" },
    { name: "Yellow", value: "#CA8A04" },
    { name: "Green", value: "#16A34A" },
    { name: "Blue", value: "#2563EB" },
    { name: "Purple", value: "#9333EA" },
    { name: "Pink", value: "#DB2777" },
    { name: "Red", value: "#DC2626" },
]

const backgroundColors = [
    { name: "Default", value: "" },
    { name: "Gray", value: "rgba(107, 114, 128, 0.15)" },
    { name: "Brown", value: "rgba(146, 64, 14, 0.15)" },
    { name: "Orange", value: "rgba(234, 88, 12, 0.15)" },
    { name: "Yellow", value: "rgba(202, 138, 4, 0.15)" },
    { name: "Green", value: "rgba(22, 163, 74, 0.15)" },
    { name: "Blue", value: "rgba(37, 99, 235, 0.15)" },
    { name: "Purple", value: "rgba(147, 51, 234, 0.15)" },
    { name: "Pink", value: "rgba(219, 39, 119, 0.15)" },
    { name: "Red", value: "rgba(220, 38, 38, 0.15)" },
]

export function ColorPicker({ onChange, currentColor, type = "text" }: ColorPickerProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const colors = type === "text" ? textColors : backgroundColors

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(!isOpen)}
                title={type === "text" ? "ტექსტის ფერი" : "ფონის ფერი"}
            >
                <TbPalette className="w-4 h-4" style={{ color: currentColor || undefined }} />
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-1 z-50 p-2 bg-background border rounded-lg shadow-xl">
                        <div className="flex items-center justify-between mb-2 pb-2 border-b">
                            <span className="text-xs font-medium text-muted-foreground">
                                {type === "text" ? "ტექსტის ფერი" : "ფონის ფერი"}
                            </span>
                            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <TbX className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="grid grid-cols-5 gap-1">
                            {colors.map((color) => (
                                <button
                                    key={color.name}
                                    onClick={() => {
                                        onChange(color.value)
                                        setIsOpen(false)
                                    }}
                                    className={`w-6 h-6 rounded-md border transition-transform hover:scale-110 ${!color.value ? "bg-muted" : ""
                                        } ${currentColor === color.value ? "ring-2 ring-primary ring-offset-1" : ""}`}
                                    style={{ backgroundColor: color.value || undefined }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default ColorPicker
