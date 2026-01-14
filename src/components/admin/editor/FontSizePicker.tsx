"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { TbTextSize } from "react-icons/tb"

interface FontSizePickerProps {
    onChange: (size: string) => void
    currentSize?: string
}

const fontSizes = [
    { name: "პატარა", value: "0.875em", label: "S" },
    { name: "ნორმალური", value: "1em", label: "M" },
    { name: "დიდი", value: "1.25em", label: "L" },
    { name: "ძალიან დიდი", value: "1.5em", label: "XL" },
    { name: "უზარმაზარი", value: "2em", label: "XXL" },
]

export function FontSizePicker({ onChange, currentSize }: FontSizePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(!isOpen)}
                title="ტექსტის ზომა"
            >
                <TbTextSize className="w-4 h-4" />
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-1 z-50 bg-background border rounded-lg shadow-xl overflow-hidden min-w-[140px]">
                        {fontSizes.map((size) => (
                            <button
                                key={size.value}
                                onClick={() => {
                                    onChange(size.value)
                                    setIsOpen(false)
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${currentSize === size.value ? "bg-accent" : "hover:bg-muted/50"
                                    }`}
                            >
                                <span style={{ fontSize: size.value }}>{size.name}</span>
                                <span className="text-xs text-muted-foreground ml-2">{size.label}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default FontSizePicker
