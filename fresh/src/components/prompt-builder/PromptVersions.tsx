'use client'

import { useState, useEffect } from 'react'
import { TbHistory, TbRefresh, TbClock, TbChevronDown, TbChevronUp, TbFileText } from "react-icons/tb"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PromptVersion {
    content: string
    formData: {
        task: string
        role: string
    }
    createdAt: string
    changeNote?: string
}

interface PromptVersionsProps {
    promptId: string | null
    currentContent: string
    onRestore: (content: string) => void
}

export function PromptVersions({ promptId, currentContent, onRestore }: PromptVersionsProps) {
    const [versions, setVersions] = useState<PromptVersion[]>([])
    const [loading, setLoading] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [selectedVersion, setSelectedVersion] = useState<number | null>(null)

    useEffect(() => {
        if (promptId && expanded) {
            fetchVersions()
        }
    }, [promptId, expanded])

    const fetchVersions = async () => {
        if (!promptId) return

        setLoading(true)
        try {
            const res = await fetch(`/api/prompts/${promptId}`)
            const data = await res.json()
            if (data.versions) {
                setVersions(data.versions.slice().reverse()) // Show newest first
            }
        } catch (error) {
            console.error('Failed to fetch versions:', error)
        } finally {
            setLoading(false)
        }
    }

    const restoreVersion = (version: PromptVersion, index: number) => {
        setSelectedVersion(index)
        onRestore(version.content)
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'ახლახანს'
        if (diffMins < 60) return `${diffMins} წუთის წინ`
        if (diffHours < 24) return `${diffHours} საათის წინ`
        if (diffDays < 7) return `${diffDays} დღის წინ`
        return date.toLocaleDateString('ka-GE')
    }

    if (!promptId) {
        return (
            <div className="text-center py-4 text-muted-foreground text-sm">
                <TbHistory className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p>ჯერ შექმენით პრომპტი ვერსიების სანახავად</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
                onClick={() => setExpanded(!expanded)}
            >
                <span className="flex items-center gap-2">
                    <TbHistory className="w-4 h-4" />
                    ვერსიების ისტორია
                    {versions.length > 0 && (
                        <Badge variant="secondary" className="ml-1">
                            {versions.length}
                        </Badge>
                    )}
                </span>
                {expanded ? (
                    <TbChevronUp className="w-4 h-4" />
                ) : (
                    <TbChevronDown className="w-4 h-4" />
                )}
            </Button>

            {expanded && (
                <div className="space-y-2">
                    {loading ? (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                            იტვირთება...
                        </div>
                    ) : versions.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                            ვერსიები ჯერ არ არის
                        </div>
                    ) : (
                        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                            {versions.map((version, index) => (
                                <Card
                                    key={index}
                                    className={`border cursor-pointer transition-colors ${selectedVersion === index
                                        ? 'border-primary bg-primary/5'
                                        : 'hover:border-muted-foreground/50'
                                        }`}
                                    onClick={() => setSelectedVersion(selectedVersion === index ? null : index)}
                                >
                                    <CardContent className="p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <TbClock className="w-3 h-3" />
                                                {formatDate(version.createdAt)}
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                v{versions.length - index}
                                            </Badge>
                                        </div>

                                        <p className="text-sm line-clamp-2 mb-2">
                                            {version.content.substring(0, 150)}...
                                        </p>

                                        {version.formData?.task && (
                                            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                                <TbFileText className="w-3 h-3" /> {version.formData.task}
                                            </p>
                                        )}

                                        {selectedVersion === index && (
                                            <div className="mt-3 pt-3 border-t">
                                                <Button
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        restoreVersion(version, index)
                                                    }}
                                                >
                                                    <TbRefresh className="w-3 h-3 mr-1" />
                                                    აღდგენა
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
