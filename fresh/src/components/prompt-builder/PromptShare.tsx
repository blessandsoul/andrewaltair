'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TbCheck, TbCopy, TbShare, TbWorld, TbLock } from "react-icons/tb"

interface PromptShareProps {
    promptId: string
    shareToken?: string
    isPublic: boolean
    onTogglePublic: (isPublic: boolean) => void
}

export function PromptShare({ promptId, shareToken, isPublic, onTogglePublic }: PromptShareProps) {
    const [copied, setCopied] = useState(false)

    const shareUrl = shareToken
        ? `${typeof window !== 'undefined' ? window.location.origin : ''}/prompt-builder/share/${shareToken}`
        : ''

    const copyLink = async () => {
        if (!shareUrl) return
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                    <TbShare className="w-4 h-4" />
                    გაზიარება
                </h4>
                <Button
                    size="sm"
                    variant={isPublic ? 'default' : 'outline'}
                    onClick={() => onTogglePublic(!isPublic)}
                >
                    {isPublic ? (
                        <><TbWorld className="w-4 h-4 mr-1" /> საჯარო</>
                    ) : (
                        <><TbLock className="w-4 h-4 mr-1" /> პირადი</>
                    )}
                </Button>
            </div>

            {shareToken && (
                <div className="flex gap-2">
                    <Input
                        value={shareUrl}
                        readOnly
                        className="text-xs"
                    />
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={copyLink}
                    >
                        {copied ? <TbCheck className="w-4 h-4" /> : <TbCopy className="w-4 h-4" />}
                    </Button>
                </div>
            )}

            {isPublic && (
                <p className="text-xs text-muted-foreground">
                    თქვენი პრომპტი გამოჩნდება გალერეაში
                </p>
            )}
        </div>
    )
}
