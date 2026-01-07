"use client"

import { use, useEffect, useState } from "react"
import MarketplacePromptEditor from "@/components/admin/MarketplacePromptEditor"
import { TbLoader2 } from "react-icons/tb"

interface Props {
    params: Promise<{ id: string }>
}

export default function EditMarketplacePromptPage({ params }: Props) {
    const { id } = use(params)
    const [promptData, setPromptData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchPrompt() {
            try {
                const res = await fetch(`/api/marketplace-prompts/${id}`)
                if (res.ok) {
                    const data = await res.json()
                    setPromptData(data.prompt)
                } else {
                    setError('Prompt not found')
                }
            } catch (err) {
                console.error(err)
                setError('Failed to load prompt')
            } finally {
                setIsLoading(false)
            }
        }
        fetchPrompt()
    }, [id])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <TbLoader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    return <MarketplacePromptEditor initialData={promptData || undefined} isEditing />
}
