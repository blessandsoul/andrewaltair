'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TbBriefcase, TbCode, TbHeart, TbPalette, TbSearch, TbSparkles } from "react-icons/tb"

const categories = [
    { id: 'marketing', label: 'მარკეტინგი', icon: TbBriefcase },
    { id: 'development', label: 'დეველოპმენტი', icon: TbCode },
    { id: 'personal', label: 'პირადი', icon: TbHeart },
    { id: 'creative', label: 'კრეატივი', icon: TbPalette },
    { id: 'research', label: 'კვლევა', icon: TbSearch },
]

interface Template {
    id: string
    title: string
    description: string
    content: string
    category: string
    tags: string[]
    uses: number
}

interface PromptTemplatesProps {
    onSelect: (template: Template) => void
}

export function PromptTemplates({ onSelect }: PromptTemplatesProps) {
    const [templates, setTemplates] = useState<Template[]>([])
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState<string | null>(null)

    useEffect(() => {
        fetchTemplates()
    }, [category])

    const fetchTemplates = async () => {
        try {
            let url = '/api/prompts?type=templates'
            if (category) url += `&category=${category}`
            const res = await fetch(url)
            const data = await res.json()
            setTemplates(data.prompts || [])
        } catch (error) {
            console.error('Failed to fetch templates:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
                <Button
                    variant={!category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCategory(null)}
                >
                    ყველა
                </Button>
                {categories.map(cat => (
                    <Button
                        key={cat.id}
                        variant={category === cat.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCategory(cat.id)}
                    >
                        <cat.icon className="w-4 h-4 mr-1" />
                        {cat.label}
                    </Button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-8 text-muted-foreground">იტვირთება...</div>
            ) : templates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    <TbSparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    შაბლონები ჯერ არ არის დამატებული
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                    {templates.map(template => (
                        <Card
                            key={template.id}
                            className="cursor-pointer hover:bg-secondary/50 transition-colors"
                            onClick={() => onSelect(template)}
                        >
                            <CardContent className="p-4">
                                <h4 className="font-medium mb-1">{template.title}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                    {template.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-1">
                                        {template.tags?.slice(0, 2).map(tag => (
                                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                                        ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground">{template.uses} გამოყენება</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
