"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Bot, Send, X, Minimize2, Maximize2, Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

export function AIChatAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Welcome message on open
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: "welcome",
                    role: "assistant",
                    content: "გამარჯობა! 👋 მე ვარ AI ასისტენტი. შეგიძლიათ მკითხოთ ChatGPT-ს, Midjourney-ს ან სხვა AI ინსტრუმენტების შესახებ!",
                    timestamp: new Date(),
                },
            ])
        }
    }, [isOpen, messages.length])

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isTyping) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
        }

        const currentMessages = [...messages, userMessage]
        setMessages(currentMessages)
        const userInput = input
        setInput("")
        setIsTyping(true)

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userInput,
                    history: currentMessages.map(m => ({ role: m.role, content: m.content }))
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "API error")
            }

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response,
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, aiResponse])
        } catch (error) {
            console.error("Chat error:", error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "ბოდიში, დროებით ვერ ვპასუხობ. გთხოვთ სცადოთ თავიდან! 🙏",
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsTyping(false)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
            >
                <Bot className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background animate-pulse" />
            </button>
        )
    }

    return (
        <div
            className={cn(
                "fixed z-50 bg-card rounded-2xl shadow-2xl border overflow-hidden transition-all duration-300",
                isMinimized
                    ? "bottom-4 right-4 w-72 h-14"
                    : "bottom-4 right-4 w-96 h-[500px] max-h-[80vh]"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-primary to-accent p-4 text-white">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">AI ასისტენტი</h3>
                        {!isMinimized && (
                            <p className="text-xs text-white/80">ონლაინ</p>
                        )}
                    </div>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                    >
                        {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <div className="flex-1 overflow-auto p-4 space-y-4" style={{ height: "calc(100% - 130px)" }}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex",
                                    message.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "max-w-[80%] rounded-2xl px-4 py-2",
                                        message.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-br-sm"
                                            : "bg-secondary rounded-bl-sm"
                                    )}
                                >
                                    <p className="text-sm">{message.content}</p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-2">
                                    <div className="flex gap-1">
                                        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
                                        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                                        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className="p-4 border-t">
                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="დაწერე შეკითხვა..."
                                className="flex-1"
                            />
                            <Button type="submit" size="icon" disabled={!input.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                </>
            )}
        </div>
    )
}
