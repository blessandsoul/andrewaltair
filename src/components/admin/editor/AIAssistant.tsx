"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    TbSparkles,
    TbArrowsMinimize,
    TbArrowsMaximize,
    TbLanguage,
    TbCheck,
    TbWand,
    TbListCheck,
    TbX,
    TbLoader2
} from "react-icons/tb"

interface AIAssistantProps {
    selectedText: string
    onReplace: (newText: string) => void
    isOpen: boolean
    onClose: () => void
}

const aiActions = [
    {
        id: "improve",
        icon: TbWand,
        label: "გააუმჯობესე",
        description: "ტექსტის გაუმჯობესება",
        prompt: "Improve the following text, make it more engaging and professional. Keep the same meaning but enhance the writing style:",
    },
    {
        id: "shorten",
        icon: TbArrowsMinimize,
        label: "შეამოკლე",
        description: "ტექსტის შემოკლება",
        prompt: "Make the following text more concise while keeping the key message:",
    },
    {
        id: "expand",
        icon: TbArrowsMaximize,
        label: "გააფართოვე",
        description: "ტექსტის გაფართოება",
        prompt: "Expand the following text with more details and examples:",
    },
    {
        id: "fix",
        icon: TbCheck,
        label: "გრამატიკა",
        description: "გრამატიკის შესწორება",
        prompt: "Fix any grammar, spelling, or punctuation errors in the following text:",
    },
    {
        id: "translate_en",
        icon: TbLanguage,
        label: "EN-ზე",
        description: "თარგმნე ინგლისურად",
        prompt: "Translate the following text to English:",
    },
    {
        id: "translate_ru",
        icon: TbLanguage,
        label: "RU-ზე",
        description: "თარგმნე რუსულად",
        prompt: "Translate the following text to Russian:",
    },
    {
        id: "translate_ka",
        icon: TbLanguage,
        label: "KA-ზე",
        description: "თარგმნე ქართულად",
        prompt: "Translate the following text to Georgian:",
    },
    {
        id: "summarize",
        icon: TbListCheck,
        label: "შეაჯამე",
        description: "ტექსტის შეჯამება",
        prompt: "Summarize the following text in a few key points:",
    },
]

export function AIAssistant({ selectedText, onReplace, isOpen, onClose }: AIAssistantProps) {
    const [loading, setLoading] = React.useState(false)
    const [result, setResult] = React.useState<string | null>(null)
    const [error, setError] = React.useState<string | null>(null)

    const handleAction = async (action: typeof aiActions[0]) => {
        if (!selectedText.trim()) return

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const response = await fetch("/api/ai/text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: action.id,
                    text: selectedText,
                    prompt: action.prompt,
                }),
            })

            if (!response.ok) {
                throw new Error("AI მოთხოვნა ვერ შესრულდა")
            }

            const data = await response.json()
            setResult(data.result)
        } catch (err) {
            setError(err instanceof Error ? err.message : "შეცდომა")
        } finally {
            setLoading(false)
        }
    }

    const applyResult = () => {
        if (result) {
            onReplace(result)
            setResult(null)
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background border rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                    <div className="flex items-center gap-2">
                        <TbSparkles className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-semibold">AI ასისტენტი</h3>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <TbX className="w-5 h-5" />
                    </button>
                </div>

                {/* Selected text preview */}
                <div className="p-4 border-b bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">მონიშნული ტექსტი:</p>
                    <p className="text-sm line-clamp-3">{selectedText || "ტექსტი არ არის მონიშნული"}</p>
                </div>

                {/* Actions grid */}
                {!result && !loading && (
                    <div className="p-4 grid grid-cols-2 gap-2">
                        {aiActions.map((action) => {
                            const Icon = action.icon
                            return (
                                <button
                                    key={action.id}
                                    onClick={() => handleAction(action)}
                                    disabled={!selectedText.trim()}
                                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Icon className="w-5 h-5 text-indigo-500" />
                                    <div className="text-left">
                                        <div className="font-medium text-sm">{action.label}</div>
                                        <div className="text-xs text-muted-foreground">{action.description}</div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}

                {/* Loading state */}
                {loading && (
                    <div className="p-8 flex flex-col items-center justify-center">
                        <TbLoader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
                        <p className="text-sm text-muted-foreground">მუშავდება...</p>
                    </div>
                )}

                {/* Result */}
                {result && (
                    <div className="p-4">
                        <p className="text-xs text-muted-foreground mb-2">შედეგი:</p>
                        <div className="p-3 bg-muted/50 rounded-lg text-sm mb-4 max-h-48 overflow-y-auto">
                            {result}
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={applyResult} className="flex-1 gap-2">
                                <TbCheck className="w-4 h-4" />
                                ჩასვა
                            </Button>
                            <Button variant="outline" onClick={() => setResult(null)}>
                                თავიდან
                            </Button>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="p-4">
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500">
                            {error}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AIAssistant
