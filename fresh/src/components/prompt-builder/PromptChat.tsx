'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TbLoader2, TbSend, TbRobot, TbUser, TbTestPipe } from "react-icons/tb"

interface Message {
    role: 'user' | 'assistant'
    content: string
}

interface PromptChatProps {
    prompt: string
}

export function PromptChat({ prompt }: PromptChatProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)

    const testPrompt = async () => {
        if (!prompt || loading) return

        setLoading(true)
        setMessages([{ role: 'user', content: 'Testing prompt...' }])

        try {
            const res = await fetch('/api/prompt-builder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'test', prompt })
            })
            const data = await res.json()

            setMessages([
                { role: 'user', content: prompt.slice(0, 200) + '...' },
                { role: 'assistant', content: data.result || 'No response' }
            ])
        } catch (error) {
            setMessages([{ role: 'assistant', content: 'Error: Failed to test prompt' }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                    <TbTestPipe className="w-4 h-4 text-purple-500" />
                    პრომპტის ტესტი
                </h4>
                <Button
                    size="sm"
                    onClick={testPrompt}
                    disabled={!prompt || loading}
                >
                    {loading ? <TbLoader2 className="w-4 h-4 animate-spin" /> : <TbSend className="w-4 h-4 mr-1" />}
                    ტესტი
                </Button>
            </div>

            {messages.length > 0 && (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary/10' : 'bg-accent/10'
                                    }`}>
                                    {msg.role === 'user' ? <TbUser className="w-3 h-3" /> : <TbRobot className="w-3 h-3" />}
                                </div>
                                <div className={`p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-primary/10' : 'bg-secondary'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!prompt && (
                <p className="text-sm text-muted-foreground text-center py-4">
                    შექმენი პრომპტი რომ გატესტო
                </p>
            )}
        </div>
    )
}
