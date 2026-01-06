'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TbStar, TbTrash, TbCopy, TbClock, TbSearch, TbHeart } from "react-icons/tb"
import { useConfirm } from "@/components/ui/confirm-dialog"

interface Prompt {
    id: string
    content: string
    formData: {
        role: string
        task: string
    }
    isFavorite: boolean
    tokenCount: number
    createdAt: string
}

interface PromptHistoryProps {
    onSelect: (prompt: Prompt) => void
    onCopy: (content: string) => void
}

export function PromptHistory({ onSelect, onCopy }: PromptHistoryProps) {
    const [prompts, setPrompts] = useState<Prompt[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<'all' | 'favorites'>('all')
    const confirm = useConfirm()

    useEffect(() => {
        fetchPrompts()
    }, [filter])

    const fetchPrompts = async () => {
        try {
            const type = filter === 'favorites' ? 'favorites' : 'history'
            const res = await fetch(`/api/prompts?type=${type}`)
            const data = await res.json()
            setPrompts(data.prompts || [])
        } catch (error) {
            console.error('Failed to fetch prompts:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleFavorite = async (id: string, current: boolean) => {
        await fetch(`/api/prompts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isFavorite: !current })
        })
        fetchPrompts()
    }

    const deletePrompt = async (id: string) => {
        const confirmed = await confirm({
            title: 'პრომპტის წაშლა',
            message: 'ნამდვილად გსურს ამ პრომპტის წაშლა? ეს მოქმედება შეუქცევადია.',
            confirmText: 'წაშლა',
            cancelText: 'გაუქმება',
            variant: 'danger'
        })
        if (!confirmed) return
        await fetch(`/api/prompts/${id}`, { method: 'DELETE' })
        fetchPrompts()
    }

    const filtered = prompts.filter(p =>
        p.formData.task?.toLowerCase().includes(search.toLowerCase()) ||
        p.formData.role?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="ძიება..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                >
                    ყველა
                </Button>
                <Button
                    variant={filter === 'favorites' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('favorites')}
                >
                    <TbHeart className="w-4 h-4" />
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-8 text-muted-foreground">იტვირთება...</div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    {filter === 'favorites' ? 'ფავორიტები ცარიელია' : 'ისტორია ცარიელია'}
                </div>
            ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {filtered.map(prompt => (
                        <Card key={prompt.id} className="cursor-pointer hover:bg-secondary/50 transition-colors">
                            <CardContent className="p-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0" onClick={() => onSelect(prompt)}>
                                        <Badge variant="outline" className="text-xs mb-1">{prompt.formData.role}</Badge>
                                        <p className="text-sm truncate">{prompt.formData.task}</p>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                            <TbClock className="w-3 h-3" />
                                            {new Date(prompt.createdAt).toLocaleDateString('ka-GE')}
                                            <span>•</span>
                                            <span>{prompt.tokenCount} tokens</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0"
                                            onClick={() => toggleFavorite(prompt.id, prompt.isFavorite)}
                                        >
                                            <TbStar className={`w-4 h-4 ${prompt.isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0"
                                            onClick={() => onCopy(prompt.content)}
                                        >
                                            <TbCopy className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 text-destructive"
                                            onClick={() => deletePrompt(prompt.id)}
                                        >
                                            <TbTrash className="w-4 h-4" />
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
