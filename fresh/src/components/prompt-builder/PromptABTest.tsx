'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TbFlask, TbPlus, TbPlayerPlay, TbPlayerPause, TbCheck, TbTrophy, TbChartBar, TbTrash, TbLoader2 } from "react-icons/tb"
import { useToast } from "@/components/ui/toast"
import { useConfirm } from "@/components/ui/confirm-dialog"

interface TestResult {
    promptId: string
    uses: number
    avgRating: number
    conversions: number
}

interface ABTest {
    _id: string
    name: string
    description?: string
    promptIds: Array<{
        _id: string
        content: string
        formData: { role: string; task: string }
        qualityScore?: number
        uses: number
    }>
    results: TestResult[]
    status: 'active' | 'completed' | 'paused'
    winnerId?: { _id: string; content: string }
    startedAt: string
    completedAt?: string
}

interface PromptABTestProps {
    currentPromptId?: string
    promptHistory: Array<{ id: string; formData: { task: string } }>
}

export function PromptABTest({ currentPromptId, promptHistory }: PromptABTestProps) {
    const [tests, setTests] = useState<ABTest[]>([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [newTestName, setNewTestName] = useState('')
    const [selectedPrompts, setSelectedPrompts] = useState<string[]>([])
    const [showCreateForm, setShowCreateForm] = useState(false)
    const toast = useToast()
    const confirm = useConfirm()

    useEffect(() => {
        fetchTests()
    }, [])

    const fetchTests = async () => {
        try {
            const res = await fetch('/api/prompts/tests')
            const data = await res.json()
            setTests(data.tests || [])
        } catch (error) {
            console.error('Failed to fetch tests:', error)
        } finally {
            setLoading(false)
        }
    }

    const createTest = async () => {
        if (!newTestName || selectedPrompts.length < 2) {
            toast.warning('სავალდებულო ველები', 'სახელი და მინიმუმ 2 პრომპტი სავალდებულოა')
            return
        }

        setCreating(true)
        try {
            await fetch('/api/prompts/tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newTestName,
                    promptIds: selectedPrompts
                })
            })

            setNewTestName('')
            setSelectedPrompts([])
            setShowCreateForm(false)
            fetchTests()
        } catch (error) {
            console.error('Failed to create test:', error)
        } finally {
            setCreating(false)
        }
    }

    const updateTestStatus = async (testId: string, action: string) => {
        await fetch(`/api/prompts/tests/${testId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action })
        })
        fetchTests()
    }

    const deleteTest = async (testId: string) => {
        const confirmed = await confirm({
            title: 'ტესტის წაშლა',
            message: 'ნამდვილად გსურს ამ ტესტის წაშლა?',
            confirmText: 'წაშლა',
            cancelText: 'გაუქმება',
            variant: 'danger'
        })
        if (!confirmed) return
        await fetch(`/api/prompts/tests/${testId}`, { method: 'DELETE' })
        fetchTests()
    }

    const togglePromptSelection = (promptId: string) => {
        setSelectedPrompts(prev =>
            prev.includes(promptId)
                ? prev.filter(id => id !== promptId)
                : [...prev, promptId]
        )
    }

    const getConversionRate = (result: TestResult) => {
        if (result.uses === 0) return 0
        return ((result.conversions / result.uses) * 100).toFixed(1)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                    <TbFlask className="w-4 h-4 text-purple-500" />
                    A/B ტესტირება
                </h4>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    <TbPlus className="w-4 h-4 mr-1" />
                    ახალი ტესტი
                </Button>
            </div>

            {/* Create Test Form */}
            {showCreateForm && (
                <Card className="border-purple-500/30">
                    <CardContent className="p-4 space-y-3">
                        <Input
                            placeholder="ტესტის სახელი..."
                            value={newTestName}
                            onChange={e => setNewTestName(e.target.value)}
                        />

                        <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">აირჩიე მინიმუმ 2 პრომპტი შედარებისთვის:</p>
                            <div className="max-h-[150px] overflow-y-auto space-y-1">
                                {promptHistory.map((prompt) => (
                                    <div
                                        key={prompt.id}
                                        className={`p-2 rounded-md text-sm cursor-pointer transition-colors ${selectedPrompts.includes(prompt.id)
                                            ? 'bg-purple-500/20 border border-purple-500/50'
                                            : 'bg-secondary hover:bg-secondary/80'
                                            }`}
                                        onClick={() => togglePromptSelection(prompt.id)}
                                    >
                                        <span className="line-clamp-1">{prompt.formData.task}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                არჩეულია: {selectedPrompts.length}/მინ. 2
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={createTest}
                                disabled={creating || selectedPrompts.length < 2}
                                className="flex-1"
                            >
                                {creating ? <TbLoader2 className="w-4 h-4 animate-spin" /> : 'შექმნა'}
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowCreateForm(false)}
                            >
                                გაუქმება
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Tests List */}
            {loading ? (
                <div className="text-center py-4 text-muted-foreground">იტვირთება...</div>
            ) : tests.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                    <TbFlask className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">ტესტები ჯერ არ არის</p>
                    <p className="text-xs">შექმენი A/B ტესტი პრომპტების შესადარებლად</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {tests.map(test => (
                        <Card key={test._id} className="border">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h5 className="font-medium">{test.name}</h5>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge
                                                variant="outline"
                                                className={
                                                    test.status === 'active' ? 'border-green-500 text-green-600' :
                                                        test.status === 'completed' ? 'border-blue-500 text-blue-600' :
                                                            'border-yellow-500 text-yellow-600'
                                                }
                                            >
                                                {test.status === 'active' ? '🔄 აქტიური' :
                                                    test.status === 'completed' ? '✅ დასრულებული' :
                                                        '⏸️ პაუზაზე'}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {test.promptIds?.length || 0} პრომპტი
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        {test.status === 'active' && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0"
                                                    onClick={() => updateTestStatus(test._id, 'pause')}
                                                >
                                                    <TbPlayerPause className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0 text-green-600"
                                                    onClick={() => updateTestStatus(test._id, 'complete')}
                                                >
                                                    <TbCheck className="w-4 h-4" />
                                                </Button>
                                            </>
                                        )}
                                        {test.status === 'paused' && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 w-7 p-0"
                                                onClick={() => updateTestStatus(test._id, 'resume')}
                                            >
                                                <TbPlayerPlay className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 text-destructive"
                                            onClick={() => deleteTest(test._id)}
                                        >
                                            <TbTrash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Results */}
                                <div className="space-y-2">
                                    {test.results?.map((result, index) => {
                                        const prompt = test.promptIds?.find((p: any) => p._id === result.promptId)
                                        const isWinner = test.winnerId?._id === result.promptId

                                        return (
                                            <div
                                                key={result.promptId}
                                                className={`p-2 rounded-md ${isWinner ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-secondary/50'}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {isWinner && <TbTrophy className="w-4 h-4 text-yellow-500" />}
                                                        <span className="text-sm font-medium">ვარიანტი {index + 1}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <span>{result.uses} გამოყენება</span>
                                                        <span className="flex items-center gap-1">
                                                            <TbChartBar className="w-3 h-3" />
                                                            {getConversionRate(result)}%
                                                        </span>
                                                    </div>
                                                </div>
                                                {prompt && (
                                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                        {prompt.formData?.task || prompt.content?.slice(0, 50)}
                                                    </p>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
