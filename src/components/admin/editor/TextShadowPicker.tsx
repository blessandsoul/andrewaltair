"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { TbShadow } from "react-icons/tb"

interface TextShadowPickerProps {
    onChange: (shadow: string) => void
    currentShadow?: string
}

const shadows = [
    { name: "არაფერი", value: "none", preview: "Aa" },
    { name: "მსუბუქი", value: "1px 1px 2px rgba(0,0,0,0.2)", preview: "Aa" },
    { name: "საშუალო", value: "2px 2px 4px rgba(0,0,0,0.3)", preview: "Aa" },
    { name: "ძლიერი", value: "3px 3px 6px rgba(0,0,0,0.4)", preview: "Aa" },
    { name: "ნათელი", value: "0 0 10px rgba(99,102,241,0.8)", preview: "Aa" },
    { name: "ნეონი", value: "0 0 5px #6366f1, 0 0 10px #6366f1, 0 0 20px #6366f1", preview: "Aa" },
    { name: "3D", value: "1px 1px 0 #6366f1, 2px 2px 0 #8b5cf6, 3px 3px 0 #a855f7", preview: "Aa" },
]

export function TextShadowPicker({ onChange, currentShadow }: TextShadowPickerProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(!isOpen)}
                title="ტექსტის ჩრდილი"
            >
                <TbShadow className="w-4 h-4" />
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-1 z-50 bg-background border rounded-lg shadow-xl overflow-hidden min-w-[160px]">
                        {shadows.map((shadow) => (
                            <button
                                key={shadow.name}
                                onClick={() => {
                                    onChange(shadow.value)
                                    setIsOpen(false)
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${currentShadow === shadow.value ? "bg-accent" : "hover:bg-muted/50"
                                    }`}
                            >
                                <span
                                    className="text-lg font-bold"
                                    style={{ textShadow: shadow.value }}
                                >
                                    {shadow.preview}
                                </span>
                                <span>{shadow.name}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default TextShadowPicker
