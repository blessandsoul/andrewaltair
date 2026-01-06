'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TbEye, TbHeart, TbCopy, TbStar, TbTrendingUp } from "react-icons/tb"

interface GalleryPrompt {
    id: string
    title?: string
    content: string
    formData: { role: string; task: string }
    views: number
    likes: number
    qualityScore?: number
    tags: string[]
}

interface PromptGalleryProps {
    onSelect: (prompt: GalleryPrompt) => void
    onCopy: (content: string) => void
}

export function PromptGallery({ onSelect, onCopy }: PromptGalleryProps) {
    const [prompts, setPrompts] = useState<GalleryPrompt[]>([])
    const [loading, setLoading] = useState(true)
    const [sort, setSort] = useState<'likes' | 'views' | 'createdAt'>('likes')

    useEffect(() => {
        fetchGallery()
    }, [sort])

    const fetchGallery = async () => {
        try {
            const res = await fetch(`/api/prompts?type=gallery&sort=${sort}`)
            const data = await res.json()
            setPrompts(data.prompts || [])
        } catch (error) {
            console.error('Failed to fetch gallery:', error)
        } finally {
            setLoading(false)
        }
    }

    const likePrompt = async (id: string) => {
        await fetch(`/api/prompts/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'like' })
        })
        fetchGallery()
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Button
                    variant={sort === 'likes' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSort('likes')}
                >
                    <TbHeart className="w-4 h-4 mr-1" /> პოპულარული
                </Button>
                <Button
                    variant={sort === 'views' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSort('views')}
                >
                    <TbEye className="w-4 h-4 mr-1" /> ნანახი
                </Button>
                <Button
                    variant={sort === 'createdAt' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSort('createdAt')}
                >
                    <TbTrendingUp className="w-4 h-4 mr-1" /> ახალი
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-8 text-muted-foreground">იტვირთება...</div>
            ) : prompts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    გალერეა ცარიელია. გააზიარეთ თქვენი პრომპტი!
                </div>
            ) : (
                <div className="grid gap-3">
                    {prompts.map(prompt => (
                        <Card key={prompt.id} className="hover:bg-secondary/50 transition-colors">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 cursor-pointer" onClick={() => onSelect(prompt)}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline">{prompt.formData.role}</Badge>
                                            {prompt.qualityScore && (
                                                <Badge className="bg-yellow-500/10 text-yellow-600">
                                                    <TbStar className="w-3 h-3 mr-1" />{prompt.qualityScore}/10
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm line-clamp-2">{prompt.title || prompt.formData.task}</p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><TbEye className="w-3 h-3" />{prompt.views}</span>
                                            <span className="flex items-center gap-1"><TbHeart className="w-3 h-3" />{prompt.likes}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => likePrompt(prompt.id)}
                                        >
                                            <TbHeart className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => onCopy(prompt.content)}
                                        >
                                            <TbCopy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
