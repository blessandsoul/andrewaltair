'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TbLoader2, TbStar, TbBulb } from "react-icons/tb"

interface QualityResult {
    score: number
    feedback: string
    suggestions: string[]
}

interface PromptQualityProps {
    prompt: string
    onScoreReceived?: (score: number, feedback: string) => void
}

export function PromptQuality({ prompt, onScoreReceived }: PromptQualityProps) {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<QualityResult | null>(null)

    const scorePrompt = async () => {
        if (!prompt || loading) return

        setLoading(true)
        try {
            const res = await fetch('/api/prompt-builder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'score', prompt })
            })
            const data = await res.json()

            const parsed: QualityResult = JSON.parse(data.result)
            setResult(parsed)
            onScoreReceived?.(parsed.score, parsed.feedback)
        } catch (error) {
            console.error('Failed to score:', error)
        } finally {
            setLoading(false)
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 8) return 'bg-green-500'
        if (score >= 6) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                    <TbStar className="w-4 h-4 text-yellow-500" />
                    ხარისხის შეფასება
                </h4>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={scorePrompt}
                    disabled={!prompt || loading}
                >
                    {loading ? <TbLoader2 className="w-4 h-4 animate-spin" /> : 'შეაფასე'}
                </Button>
            </div>

            {result && (
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full ${getScoreColor(result.score)} flex items-center justify-center text-white font-bold text-lg`}>
                            {result.score}
                        </div>
                        <div className="flex-1">
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${getScoreColor(result.score)} transition-all`}
                                    style={{ width: `${result.score * 10}%` }}
                                />
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{result.feedback}</p>
                        </div>
                    </div>

                    {result.suggestions?.length > 0 && (
                        <div className="space-y-1">
                            <p className="text-xs font-medium flex items-center gap-1">
                                <TbBulb className="w-3 h-3 text-yellow-500" />
                                გაუმჯობესების წინადადებები:
                            </p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                {result.suggestions.map((s, i) => (
                                    <li key={i}>• {s}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
