"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TbSparkles, TbArrowRight, TbArrowLeft, TbCircleCheck, TbShare, TbRefresh, TbBulb, TbTool, TbPalette, TbCode, TbFileText, TbBolt } from "react-icons/tb"

const questions = [
    {
        id: 1,
        question: "რისთვის გჭირდება AI ძირითადად?",
        options: [
            { id: "a", text: "ტექსტის წერა და რედაქტირება", icon: TbFileText, scores: { chatgpt: 3, claude: 3, jasper: 2 } },
            { id: "b", text: "კოდირება და პროგრამირება", icon: TbCode, scores: { chatgpt: 2, claude: 3, github: 3 } },
            { id: "c", text: "სურათების გენერაცია", icon: TbPalette, scores: { midjourney: 3, dalle: 2, stable: 2 } },
            { id: "d", text: "ავტომატიზაცია და workflow", icon: TbBolt, scores: { make: 3, zapier: 3, chatgpt: 1 } }
        ]
    },
    {
        id: 2,
        question: "რა დონეზე ხარ AI-ს გამოყენებაში?",
        options: [
            { id: "a", text: "დამწყები - ახლა ვიწყებ", icon: TbBulb, scores: { chatgpt: 2, claude: 1 } },
            { id: "b", text: "საშუალო - ვიცი საფუძვლები", icon: TbTool, scores: { chatgpt: 1, claude: 2, make: 1 } },
            { id: "c", text: "მოწინავე - ვიყენებ ყოველდღე", icon: TbSparkles, scores: { claude: 2, make: 2, github: 2 } }
        ]
    },
    {
        id: 3,
        question: "რამდენს მზად ხარ გადაიხადო თვეში?",
        options: [
            { id: "a", text: "უფასო ვერსიებით მინდა", icon: TbSparkles, scores: { chatgpt: 2, claude: 1 } },
            { id: "b", text: "$20-30", icon: TbSparkles, scores: { chatgpt: 2, claude: 2, midjourney: 2 } },
            { id: "c", text: "$50+", icon: TbSparkles, scores: { claude: 2, make: 2, midjourney: 2 } }
        ]
    },
    {
        id: 4,
        question: "რომელი უფრო მნიშვნელოვანია შენთვის?",
        options: [
            { id: "a", text: "სიზუსტე და ხარისხი", icon: TbCircleCheck, scores: { claude: 3, chatgpt: 2 } },
            { id: "b", text: "სიჩქარე და მოხერხებულობა", icon: TbBolt, scores: { chatgpt: 3, make: 2 } },
            { id: "c", text: "კრეატიულობა", icon: TbPalette, scores: { midjourney: 3, chatgpt: 2 } }
        ]
    }
]

const tools = {
    chatgpt: {
        name: "ChatGPT",
        description: "უნივერსალური AI ასისტენტი ტექსტის გენერაციისთვის, კოდირებისთვის და ანალიზისთვის.",
        icon: "🤖",
        color: "#10a37f",
        link: "/tools"
    },
    claude: {
        name: "Claude",
        description: "მძლავრი AI გრძელი კონტექსტით და ანალიტიკური უნარებით.",
        icon: "🧠",
        color: "#6366f1",
        link: "/tools"
    },
    midjourney: {
        name: "Midjourney",
        description: "საუკეთესო AI სურათების გენერაციისთვის. ფოტორეალისტური და არტისტული შედეგები.",
        icon: "🎨",
        color: "#ec4899",
        link: "/tools"
    },
    make: {
        name: "Make.com",
        description: "ავტომატიზაციის პლატფორმა ვიზუალური workflow-ებით.",
        icon: "⚡",
        color: "#9333ea",
        link: "/tools"
    },
    github: {
        name: "GitHub Copilot",
        description: "AI კოდინგ ასისტენტი IDE-ში ინტეგრირებული.",
        icon: "💻",
        color: "#000",
        link: "/tools"
    }
}

type ToolKey = keyof typeof tools

export default function QuizPage() {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [scores, setScores] = useState<Record<string, number>>({})
    const [showResult, setShowResult] = useState(false)

    const handleAnswer = (optionId: string, optionScores: Record<string, number>) => {
        setAnswers({ ...answers, [currentQuestion]: optionId })

        const newScores = { ...scores }
        Object.entries(optionScores).forEach(([tool, score]) => {
            newScores[tool] = (newScores[tool] || 0) + score
        })
        setScores(newScores)

        if (currentQuestion < questions.length - 1) {
            setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300)
        } else {
            setTimeout(() => setShowResult(true), 300)
        }
    }

    const getTopTools = (): ToolKey[] => {
        return Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([tool]) => tool as ToolKey)
            .filter(tool => tool in tools)
    }

    const restart = () => {
        setCurrentQuestion(0)
        setAnswers({})
        setScores({})
        setShowResult(false)
    }

    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative py-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10">
                    <div className="absolute inset-0 noise-overlay"></div>
                </div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
                    <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 mb-6">
                        <TbSparkles className="w-4 h-4 mr-2" />
                        ინტერაქტიული ქვიზი
                    </Badge>

                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                        რომელი AI ინსტრუმენტი გიხდება?
                    </h1>

                    <p className="text-muted-foreground">
                        უპასუხე 4 კითხვას და გაიგე რომელი AI შენთვისაა საუკეთესო
                    </p>
                </div>
            </section>

            {/* Quiz Content */}
            <section className="py-8 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
                    {!showResult ? (
                        <>
                            {/* Progress Bar */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                                    <span>კითხვა {currentQuestion + 1}/{questions.length}</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Question */}
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold mb-8 text-center">
                                    {questions[currentQuestion].question}
                                </h2>

                                <div className="space-y-3">
                                    {questions[currentQuestion].options.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => handleAnswer(option.id, option.scores as unknown as Record<string, number>)}
                                            className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${answers[currentQuestion] === option.id
                                                ? "border-primary bg-primary/10"
                                                : "border-border hover:border-primary/50 hover:bg-secondary/50"
                                                }`}
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                <option.icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <span className="font-medium">{option.text}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Navigation */}
                                {currentQuestion > 0 && (
                                    <Button
                                        variant="ghost"
                                        className="mt-6"
                                        onClick={() => setCurrentQuestion(currentQuestion - 1)}
                                    >
                                        <TbArrowLeft className="w-4 h-4 mr-2" />
                                        უკან
                                    </Button>
                                )}
                            </Card>
                        </>
                    ) : (
                        /* Results */
                        <div className="space-y-8">
                            <div className="text-center">
                                <div className="text-6xl mb-4">🎉</div>
                                <h2 className="text-3xl font-bold mb-2">შენი შედეგები!</h2>
                                <p className="text-muted-foreground">
                                    შენთვის რეკომენდებული AI ინსტრუმენტები
                                </p>
                            </div>

                            <div className="space-y-4">
                                {getTopTools().map((toolKey, i) => {
                                    const tool = tools[toolKey]
                                    if (!tool) return null

                                    return (
                                        <Card
                                            key={toolKey}
                                            className={`overflow-hidden ${i === 0 ? "ring-2 ring-primary" : ""}`}
                                        >
                                            <CardContent className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <div
                                                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                                                        style={{ backgroundColor: `${tool.color}20` }}
                                                    >
                                                        {tool.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {i === 0 && (
                                                                <Badge className="bg-primary text-white">
                                                                    #1 რეკომენდაცია
                                                                </Badge>
                                                            )}
                                                            <span className="text-sm text-muted-foreground">
                                                                {i === 1 && "ასევე კარგია"}
                                                                {i === 2 && "ალტერნატივა"}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xl font-bold mb-1">{tool.name}</h3>
                                                        <p className="text-muted-foreground">{tool.description}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" asChild>
                                    <Link href="/tools">
                                        ყველა ინსტრუმენტი
                                        <TbArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </Button>
                                <Button variant="outline" size="lg" onClick={restart}>
                                    <TbRefresh className="w-5 h-5 mr-2" />
                                    თავიდან
                                </Button>
                                <Button variant="outline" size="lg">
                                    <TbShare className="w-5 h-5 mr-2" />
                                    გაზიარება
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
