"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Bot, Sparkles, Palette, Code, Brain, Briefcase, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface AssistantType {
    id: string
    name: string
    description: string
    icon: React.ReactNode
    color: string
    systemPrompt: string
    welcomeMessage: string
}

const ASSISTANTS: AssistantType[] = [
    {
        id: "general",
        name: "ანდრია",
        description: "ზოგადი AI ასისტენტი",
        icon: <Sparkles className="h-5 w-5" />,
        color: "from-primary to-accent",
        systemPrompt: "ზოგადი AI ასისტენტი",
        welcomeMessage: "გამარჯობა! 👋 მე ვარ ანდრია, შენი AI ასისტენტი. რითი დაგეხმარო?"
    },
    {
        id: "chatgpt",
        name: "ChatGPT ექსპერტი",
        description: "ChatGPT-ს გამოყენების სპეციალისტი",
        icon: <Brain className="h-5 w-5" />,
        color: "from-green-500 to-emerald-600",
        systemPrompt: "ChatGPT ექსპერტი",
        welcomeMessage: "გამარჯობა! 🤖 მე ვარ ChatGPT ექსპერტი. დაგეხმარები პრომპტების წერასა და ChatGPT-ს ეფექტურად გამოყენებაში!"
    },
    {
        id: "midjourney",
        name: "Midjourney სპეციალისტი",
        description: "AI არტის და გენერაციის ექსპერტი",
        icon: <Palette className="h-5 w-5" />,
        color: "from-purple-500 to-pink-600",
        systemPrompt: "Midjourney და AI არტის სპეციალისტი",
        welcomeMessage: "გამარჯობა! 🎨 მე ვარ Midjourney სპეციალისტი. დაგეხმარები AI-ით ხელოვნების შექმნაში!"
    },
    {
        id: "developer",
        name: "AI პროგრამისტი",
        description: "კოდირებისა და დეველოპმენტის დახმარება",
        icon: <Code className="h-5 w-5" />,
        color: "from-blue-500 to-cyan-600",
        systemPrompt: "AI პროგრამისტი და ტექნიკური კონსულტანტი",
        welcomeMessage: "გამარჯობა! 💻 მე ვარ AI პროგრამისტი. დაგეხმარები კოდირებასა და ტექნიკურ საკითხებში!"
    },
    {
        id: "business",
        name: "ბიზნეს კონსულტანტი",
        description: "AI ბიზნესში გამოყენების რჩევები",
        icon: <Briefcase className="h-5 w-5" />,
        color: "from-amber-500 to-orange-600",
        systemPrompt: "AI ბიზნეს კონსულტანტი",
        welcomeMessage: "გამარჯობა! 📈 მე ვარ AI ბიზნეს კონსულტანტი. დაგეხმარები AI-ს შენს ბიზნესში ინტეგრაციაში!"
    }
]

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

export function AIAssistantSelector() {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedAssistant, setSelectedAssistant] = useState<AssistantType | null>(null)
    const [showChat, setShowChat] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)

    const selectAssistant = (assistant: AssistantType) => {
        setSelectedAssistant(assistant)
        setMessages([
            {
                id: "welcome",
                role: "assistant",
                content: assistant.welcomeMessage,
                timestamp: new Date()
            }
        ])
        setShowChat(true)
    }

    const closeChat = () => {
        setShowChat(false)
        setSelectedAssistant(null)
        setMessages([])
        setIsOpen(false)
    }

    const goBack = () => {
        setShowChat(false)
        setSelectedAssistant(null)
        setMessages([])
    }

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isTyping || !selectedAssistant) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        const userInput = input
        setInput("")
        setIsTyping(true)

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userInput,
                    assistantType: selectedAssistant.id,
                    history: messages.map(m => ({ role: m.role, content: m.content }))
                })
            })

            const data = await response.json()

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response || "ბოდიში, დროებით ვერ ვპასუხობ. 🙏",
                timestamp: new Date()
            }

            setMessages(prev => [...prev, aiResponse])
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "ბოდიში, დროებით ვერ ვპასუხობ. გთხოვთ სცადოთ თავიდან! 🙏",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsTyping(false)
        }
    }

    // Floating button when closed
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-20 right-4 z-50 h-12 px-4 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 text-sm font-medium"
            >
                <Bot className="h-5 w-5" />
                აირჩიე AI ასისტენტი
            </button>
        )
    }

    // Chat view
    if (showChat && selectedAssistant) {
        return (
            <div className="fixed bottom-4 right-4 z-50 w-96 h-[500px] max-h-[80vh] bg-card rounded-2xl shadow-2xl border overflow-hidden flex flex-col">
                {/* Header */}
                <div className={cn("flex items-center justify-between p-4 text-white bg-gradient-to-r", selectedAssistant.color)}>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                            {selectedAssistant.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">{selectedAssistant.name}</h3>
                            <p className="text-xs text-white/80">ონლაინ</p>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={goBack}
                            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-xs"
                        >
                            ← უკან
                        </button>
                        <button
                            onClick={closeChat}
                            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-auto p-4 space-y-4">
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
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} className="p-4 border-t">
                    <div className="flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="დაწერე შეკითხვა..."
                            className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Button type="submit" size="sm" disabled={!input.trim()}>
                            გაგზავნა
                        </Button>
                    </div>
                </form>
            </div>
        )
    }

    // Assistant selection view
    return (
        <div className="fixed bottom-4 right-4 z-50 w-80 bg-card rounded-2xl shadow-2xl border overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-accent text-white">
                <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    <h3 className="font-bold text-sm">აირჩიე AI ასისტენტი</h3>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Assistant list */}
            <div className="p-2 max-h-[400px] overflow-auto">
                {ASSISTANTS.map((assistant) => (
                    <button
                        key={assistant.id}
                        onClick={() => selectAssistant(assistant)}
                        className="w-full p-3 rounded-xl hover:bg-secondary transition-colors flex items-center gap-3 text-left group"
                    >
                        <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white", assistant.color)}>
                            {assistant.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{assistant.name}</h4>
                            <p className="text-xs text-muted-foreground truncate">{assistant.description}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                ))}
            </div>

            <div className="p-3 border-t bg-secondary/30">
                <p className="text-xs text-center text-muted-foreground">
                    აირჩიე ასისტენტი შენი ამოცანისთვის
                </p>
            </div>
        </div>
    )
}
