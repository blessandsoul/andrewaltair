'use client'

import { useMemo } from 'react'
import { Badge } from "@/components/ui/badge"

interface TokenCounterProps {
    text: string
}

export function TokenCounter({ text }: TokenCounterProps) {
    const tokenCount = useMemo(() => {
        if (!text) return 0
        const hasNonLatin = /[^\x00-\x7F]/.test(text)
        const charsPerToken = hasNonLatin ? 2 : 4
        return Math.ceil(text.length / charsPerToken)
    }, [text])

    const getColor = () => {
        if (tokenCount < 500) return 'bg-green-500/10 text-green-600 border-green-500/20'
        if (tokenCount < 1500) return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
        return 'bg-red-500/10 text-red-600 border-red-500/20'
    }

    const getLabel = () => {
        if (tokenCount < 500) return 'მოკლე'
        if (tokenCount < 1500) return 'საშუალო'
        return 'გრძელი'
    }

    return (
        <Badge variant="outline" className={getColor()}>
            ~{tokenCount} tokens ({getLabel()})
        </Badge>
    )
}
