"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { TbTypography } from "react-icons/tb"

interface FontPickerProps {
    onChange: (font: string) => void
    currentFont?: string
}

const fonts = [
    { name: "Default", value: "", preview: "Aa" },
    { name: "Inter", value: "Inter", preview: "Aa" },
    { name: "Roboto", value: "Roboto", preview: "Aa" },
    { name: "Open Sans", value: "Open Sans", preview: "Aa" },
    { name: "Playfair", value: "Playfair Display", preview: "Aa" },
    { name: "Georgia", value: "Georgia", preview: "Aa" },
    { name: "Courier", value: "Courier New", preview: "Aa" },
    { name: "Comic Sans", value: "Comic Sans MS", preview: "Aa" },
]

export function FontPicker({ onChange, currentFont }: FontPickerProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(!isOpen)}
                title="შრიფტი"
            >
                <TbTypography className="w-4 h-4" />
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-1 z-50 bg-background border rounded-lg shadow-xl overflow-hidden min-w-[180px]">
                        {fonts.map((font) => (
                            <button
                                key={font.value || 'default'}
                                onClick={() => {
                                    onChange(font.value)
                                    setIsOpen(false)
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${currentFont === font.value ? "bg-accent" : "hover:bg-muted/50"
                                    }`}
                            >
                                <span
                                    className="w-8 text-center font-bold"
                                    style={{ fontFamily: font.value || 'inherit' }}
                                >
                                    {font.preview}
                                </span>
                                <span style={{ fontFamily: font.value || 'inherit' }}>{font.name}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default FontPicker
