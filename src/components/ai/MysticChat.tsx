"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TbMessage, TbSend, TbLoader2, TbSparkles, TbUser, TbRobot, TbTrash } from "react-icons/tb"

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

interface MysticChatProps {
    userName?: string
    zodiacSign?: string
}

export function MysticChat({ userName, zodiacSign }: MysticChatProps) {
    const { csrfToken } = useAuth()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Welcome message on mount
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: 'welcome',
                    role: 'assistant',
                    content: `გამარჯობა${userName ? `, ${userName}` : ''}! 🔮 მე ვარ შენი პირადი მისტიკოსი. მეკითხე რაც გინდა - ბედის, სიყვარულის, კარიერის ან სულიერი განვითარების შესახებ. მზად ვარ გაგიზიარო კოსმოსური სიბრძნე.${zodiacSign ? ` ვიცი, რომ ${zodiacSign} ხარ - ეს ჩვენს საუბარს კიდევ უფრო პერსონალურს გახდის!` : ''}`,
                    timestamp: new Date()
                }
            ])
        }
    }, [userName, zodiacSign, messages.length])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const response = await fetch("/api/mystic/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": csrfToken || ""
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
                    userName,
                    zodiacSign
                }),
            })

            if (!response.ok) throw new Error("API error")

            const data = await response.json()

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "ვარსკვლავები დროებით გაფანტულია... გთხოვ სცადე ხელახლა. 🌟",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
            inputRef.current?.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleClear = () => {
        setMessages([])
    }

    return (
        <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl sm:rounded-3xl blur-xl opacity-20" />

            <div className="relative rounded-2xl sm:rounded-3xl bg-[#12121a] border border-white/10 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-white/10 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                                <TbSparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">მისტიკური AI</h3>
                                <p className="text-xs text-gray-500">ონლაინ</p>
                            </div>
                        </div>
                        {messages.length > 1 && (
                            <Button
                                onClick={handleClear}
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                            >
                                <TbTrash className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div className="h-[300px] sm:h-[400px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center flex-shrink-0">
                                    <TbRobot className="w-4 h-4 text-violet-400" />
                                </div>
                            )}
                            <div
                                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${message.role === 'user'
                                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-br-sm'
                                    : 'bg-white/5 text-gray-300 rounded-bl-sm border border-white/5'
                                    }`}
                            >
                                {message.content}
                            </div>
                            {message.role === 'user' && (
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <TbUser className="w-4 h-4 text-gray-400" />
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                                <TbRobot className="w-4 h-4 text-violet-400" />
                            </div>
                            <div className="bg-white/5 p-3 rounded-2xl rounded-bl-sm border border-white/5">
                                <div className="flex items-center gap-2">
                                    <TbLoader2 className="w-4 h-4 text-violet-400 animate-spin" />
                                    <span className="text-sm text-gray-500">ვარსკვლავებს ვკითხულობ...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10 bg-black/20">
                    <div className="flex gap-2">
                        <Input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="დასვი შეკითხვა..."
                            disabled={isLoading}
                            className="flex-1 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl focus:border-violet-500"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="h-11 w-11 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 border-0"
                        >
                            <TbSend className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
