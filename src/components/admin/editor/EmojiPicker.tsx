"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { TbMoodSmile } from "react-icons/tb"

// Popular emojis for quick access
const popularEmojis = [
    "😀", "😂", "🤣", "😊", "😍", "🤔", "😎", "🥳",
    "👍", "👎", "👏", "🙌", "💪", "🤝", "✌️", "🤙",
    "❤️", "🔥", "⭐", "✨", "💡", "🎯", "🚀", "💯",
    "✅", "❌", "⚠️", "📌", "📝", "💻", "🤖", "🧠",
    "🎨", "🎬", "📸", "🎵", "📚", "🔗", "📊", "💰",
]

interface EmojiPickerProps {
    onSelect: (emoji: string) => void
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")

    const filteredEmojis = popularEmojis // Could filter based on search if needed

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(!isOpen)}
                title="Emoji"
            >
                <TbMoodSmile className="w-4 h-4" />
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 z-50 p-3 bg-background border rounded-lg shadow-xl w-72">
                        <div className="mb-2">
                            <input
                                type="text"
                                placeholder="მოძებნე emoji..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-2 py-1 text-sm border rounded-md bg-muted/50 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="grid grid-cols-8 gap-1">
                            {filteredEmojis.map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => {
                                        onSelect(emoji)
                                        setIsOpen(false)
                                    }}
                                    className="w-8 h-8 flex items-center justify-center text-lg hover:bg-muted rounded transition-colors"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default EmojiPicker
