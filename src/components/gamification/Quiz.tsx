"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronRight, Share2, RotateCcw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuizQuestion {
    question: string
    options: {
        id: string
        text: string
        emoji: string
    }[]
}

interface QuizResult {
    id: string
    title: string
    emoji: string
    description: string
    share: string
}

interface QuizProps {
    title: string
    description: string
    questions: QuizQuestion[]
    results: QuizResult[]
    getResultId: (answers: string[]) => string
    className?: string
}

export function Quiz({
    title,
    description,
    questions,
    results,
    getResultId,
    className,
}: QuizProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<string[]>([])
    const [showResult, setShowResult] = useState(false)
    const [result, setResult] = useState<QuizResult | null>(null)

    const handleAnswer = (optionId: string) => {
        const newAnswers = [...answers, optionId]
        setAnswers(newAnswers)

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1)
        } else {
            // Calculate result
            const resultId = getResultId(newAnswers)
            const finalResult = results.find((r) => r.id === resultId) || results[0]
            setResult(finalResult)
            setShowResult(true)
        }
    }

    const restart = () => {
        setCurrentQuestion(0)
        setAnswers([])
        setShowResult(false)
        setResult(null)
    }

    const share = () => {
        if (!result) return
        const url = window.location.href
        const text = `${result.share}\n\n${url}`

        if (navigator.share) {
            navigator.share({ text, url })
        } else {
            navigator.clipboard.writeText(text)
        }
    }

    const progress = ((currentQuestion + 1) / questions.length) * 100

    if (showResult && result) {
        return (
            <div className={cn("rounded-2xl border bg-card overflow-hidden", className)}>
                {/* Celebratory gradient */}
                <div className="h-32 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl">{result.emoji}</span>
                    </div>
                </div>

                <div className="p-6 text-center">
                    <h3 className="text-2xl font-bold mb-2">{result.title}</h3>
                    <p className="text-muted-foreground mb-6">{result.description}</p>

                    <div className="flex gap-3 justify-center">
                        <Button variant="outline" onClick={restart}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            თავიდან
                        </Button>
                        <Button onClick={share}>
                            <Share2 className="mr-2 h-4 w-4" />
                            გააზიარე
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={cn("rounded-2xl border bg-card overflow-hidden", className)}>
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5" />
                    <span className="text-sm font-medium">ინტერაქტიული ქვიზი</span>
                </div>
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-white/80 text-sm">{description}</p>
            </div>

            {/* Progress */}
            <div className="h-1 bg-secondary">
                <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Question */}
            <div className="p-6">
                <div className="text-sm text-muted-foreground mb-2">
                    კითხვა {currentQuestion + 1}/{questions.length}
                </div>

                <h3 className="text-lg font-semibold mb-4">
                    {questions[currentQuestion].question}
                </h3>

                <div className="space-y-3">
                    {questions[currentQuestion].options.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => handleAnswer(option.id)}
                            className="w-full flex items-center gap-3 p-4 rounded-xl border bg-secondary/50 hover:bg-secondary hover:border-primary transition-all text-left group"
                        >
                            <span className="text-2xl">{option.emoji}</span>
                            <span className="flex-1">{option.text}</span>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Pre-built "Which AI Tool Are You?" quiz
export function AIToolQuiz({ className }: { className?: string }) {
    const questions: QuizQuestion[] = [
        {
            question: "როგორ უყვარს ინფორმაციის მიღება?",
            options: [
                { id: "a", text: "ვკითხულობ დოკუმენტაციას", emoji: "📚" },
                { id: "b", text: "ვუყურებ ვიდეო ტუტორიალებს", emoji: "🎬" },
                { id: "c", text: "ვექსპერიმენტებ თვითონ", emoji: "🔬" },
                { id: "d", text: "ვეკითხები სხვებს", emoji: "💬" },
            ],
        },
        {
            question: "რომელი უფრო მნიშვნელოვანია?",
            options: [
                { id: "a", text: "სიზუსტე და სანდოობა", emoji: "🎯" },
                { id: "b", text: "კრეატიულობა და ინოვაცია", emoji: "✨" },
                { id: "c", text: "სიჩქარე და ეფექტურობა", emoji: "⚡" },
                { id: "d", text: "მარტივობა და ხელმისაწვდომობა", emoji: "🌟" },
            ],
        },
        {
            question: "რა არის შენი სუპერძალა?",
            options: [
                { id: "a", text: "ანალიტიკური აზროვნება", emoji: "🧠" },
                { id: "b", text: "კრეატიულობა", emoji: "🎨" },
                { id: "c", text: "ორგანიზებულობა", emoji: "📋" },
                { id: "d", text: "კომუნიკაცია", emoji: "🗣️" },
            ],
        },
        {
            question: "რომელ პროექტზე იმუშავებდი?",
            options: [
                { id: "a", text: "მონაცემთა ანალიზი", emoji: "📊" },
                { id: "b", text: "ვიზუალური კონტენტი", emoji: "🖼️" },
                { id: "c", text: "ავტომატიზაცია", emoji: "🤖" },
                { id: "d", text: "კონტენტის შექმნა", emoji: "✍️" },
            ],
        },
    ]

    const results: QuizResult[] = [
        {
            id: "chatgpt",
            title: "შენ ხარ ChatGPT! 🤖",
            emoji: "🤖",
            description: "მრავალფეროვანი და ადაპტირებადი ხარ. ყველაფერში შეგიძლია დახმარება - კოდირებიდან კრეატიულ წერამდე!",
            share: "მე ChatGPT ვარ! 🤖 რომელი AI ხელსაწყო ხარ შენ?",
        },
        {
            id: "midjourney",
            title: "შენ ხარ Midjourney! 🎨",
            emoji: "🎨",
            description: "კრეატიული და ვიზუალური აზროვნება გაქვს. შენი სამყარო ფერებით და სურათებით არის სავსე!",
            share: "მე Midjourney ვარ! 🎨 რომელი AI ხელსაწყო ხარ შენ?",
        },
        {
            id: "notion",
            title: "შენ ხარ Notion AI! 📋",
            emoji: "📋",
            description: "ორგანიზებული და სტრუქტურირებული ხარ. ყველაფერს თავის ადგილას ინახავ!",
            share: "მე Notion AI ვარ! 📋 რომელი AI ხელსაწყო ხარ შენ?",
        },
        {
            id: "claude",
            title: "შენ ხარ Claude! 💬",
            emoji: "💬",
            description: "თავაზიანი, ანალიტიკური და სიღრმისეული ხარ. დეტალებს ყურადღებას აქცევ!",
            share: "მე Claude ვარ! 💬 რომელი AI ხელსაწყო ხარ შენ?",
        },
    ]

    const getResultId = (answers: string[]): string => {
        const counts: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 }
        answers.forEach((a) => counts[a]++)

        const maxCount = Math.max(...Object.values(counts))
        const dominant = Object.entries(counts).find(([_, count]) => count === maxCount)?.[0] || "a"

        const mapping: Record<string, string> = {
            a: "claude",
            b: "midjourney",
            c: "notion",
            d: "chatgpt",
        }

        return mapping[dominant]
    }

    return (
        <Quiz
            className={className}
            title="რომელი AI ხელსაწყო ხარ?"
            description="გაიგე რომელ AI-ს გავხარ ყველაზე მეტად!"
            questions={questions}
            results={results}
            getResultId={getResultId}
        />
    )
}
