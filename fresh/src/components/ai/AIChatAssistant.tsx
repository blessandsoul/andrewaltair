"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { TbRobot, TbSend, TbX, TbMinimize, TbMaximize, TbChevronDown, TbCheck } from "react-icons/tb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

// AI Agent Roles available for selection (matching the screenshot)
const AI_ROLES = [
    { id: "andria", name: "ანდრია", icon: "✨", description: "ზოგადი AI ასისტენტი", color: "from-blue-500 to-cyan-500" },
    { id: "chatgpt", name: "ChatGPT ექსპერტი", icon: "🤖", description: "ChatGPT-ს გამოყენების სპეციალისტი", color: "from-green-500 to-emerald-500" },
    { id: "midjourney", name: "Midjourney სპეციალისტი", icon: "🎨", description: "AI არტის და გენერაციის ექსპერტი", color: "from-purple-500 to-pink-500" },
    { id: "programmer", name: "AI პროგრამისტი", icon: "💻", description: "კოდირებისა და დეველოპმენტი", color: "from-orange-500 to-amber-500" },
    { id: "business", name: "ბიზნეს კონსულტანტი", icon: "💼", description: "AI ბიზნესში გამოყენების რჩევები", color: "from-indigo-500 to-blue-500" },
]


export function AIChatAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false) // false = small widget, true = fullscreen popup
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [selectedRole, setSelectedRole] = useState(AI_ROLES[0])
    const [showRoleSelector, setShowRoleSelector] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const roleSelectorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Close selectors when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (roleSelectorRef.current && !roleSelectorRef.current.contains(event.target as Node)) {
                setShowRoleSelector(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Welcome message on open
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: "welcome",
                    role: "assistant",
                    content: `გამარჯობა! 👋 მე ვარ ანდრია - თქვენი ${selectedRole.name} ${selectedRole.icon}. შეგიძლიათ მკითხოთ რაც გსურთ!`,
                    timestamp: new Date(),
                },
            ])
        }
    }, [isOpen, messages.length, selectedRole.name, selectedRole.icon])

    const handleRoleChange = (role: typeof AI_ROLES[0]) => {
        setSelectedRole(role)
        setShowRoleSelector(false)
        // Add a message about the role change
        if (messages.length > 0) {
            const changeMessage: Message = {
                id: Date.now().toString(),
                role: "assistant",
                content: `${role.icon} ახლა ვარ თქვენი ${role.name}! ${role.description}-ში დაგეხმარებით.`,
                timestamp: new Date(),
            }
            setMessages(prev => [...prev, changeMessage])
        }
    }

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
                    role: selectedRole.id,
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

    // Closed state - just the button
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center group"
            >
                <TbRobot className="h-6 w-6" />
                {/* Online indicator - top left */}
                <span className="absolute top-0 left-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white shadow-sm">
                    <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                </span>
            </button>
        )
    }

    // Expanded/Popup mode - fullscreen modal
    if (isExpanded) {
        return (
            <>
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    onClick={() => setIsExpanded(false)}
                />

                {/* Fullscreen Popup */}
                <div className="fixed inset-4 md:inset-8 lg:inset-16 z-50 bg-card rounded-2xl shadow-2xl border overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className={`flex items-center justify-between bg-gradient-to-r ${selectedRole.color} p-4 text-white`}>
                        <div className="flex items-center gap-3">
                            {/* Online indicator */}
                            <div className="relative">
                                <span className="absolute -top-1 -left-1 h-3 w-3 rounded-full bg-green-400 border-2 border-white/50">
                                    <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                                </span>
                                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <span className="text-xl">{selectedRole.icon}</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold">{selectedRole.name}</h3>
                                <p className="text-xs text-white/80">{selectedRole.description} • ონლაინ</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                                title="შემცირება"
                            >
                                <TbMinimize className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => { setIsOpen(false); setIsExpanded(false) }}
                                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                                title="დახურვა"
                            >
                                <TbX className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Role Selector Button */}
                    <div className="p-3 border-b bg-muted/30 relative" ref={roleSelectorRef}>
                        <button
                            onClick={() => setShowRoleSelector(!showRoleSelector)}
                            className={cn(
                                "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full",
                                "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
                                "hover:from-blue-600 hover:to-cyan-600 transition-all",
                                "shadow-md hover:shadow-lg font-medium text-sm"
                            )}
                        >
                            <TbRobot className="h-4 w-4" />
                            <span>აირჩიე AI ასისტენტი</span>
                            <TbChevronDown className={cn("h-4 w-4 transition-transform", showRoleSelector && "rotate-180")} />
                        </button>

                        {/* Role Selector Dropdown */}
                        {showRoleSelector && (
                            <div className="absolute left-3 right-3 top-full mt-1 bg-card rounded-xl shadow-xl border overflow-hidden z-50">
                                <div className="p-2 border-b bg-muted/50">
                                    <p className="text-xs font-medium text-muted-foreground px-2">აირჩიეთ ასისტენტის როლი</p>
                                </div>
                                <div className="p-1 max-h-64 overflow-y-auto">
                                    {AI_ROLES.map((role) => (
                                        <button
                                            key={role.id}
                                            onClick={() => handleRoleChange(role)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                                                selectedRole.id === role.id
                                                    ? "bg-primary/10 text-primary"
                                                    : "hover:bg-muted text-foreground"
                                            )}
                                        >
                                            <span className="text-xl">{role.icon}</span>
                                            <div className="flex-1">
                                                <span className="text-sm font-medium block">{role.name}</span>
                                                <span className="text-xs text-muted-foreground">{role.description}</span>
                                            </div>
                                            {selectedRole.id === role.id && (
                                                <TbCheck className="h-4 w-4 text-primary" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-auto p-6 space-y-4">
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
                                        "max-w-[70%] rounded-2xl px-5 py-3",
                                        message.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-br-sm"
                                            : "bg-secondary rounded-bl-sm"
                                    )}
                                >
                                    <p className="text-base">{message.content}</p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-secondary rounded-2xl rounded-bl-sm px-5 py-3">
                                    <div className="flex gap-1.5">
                                        <span className="h-2.5 w-2.5 bg-muted-foreground rounded-full animate-bounce" />
                                        <span className="h-2.5 w-2.5 bg-muted-foreground rounded-full animate-bounce delay-100" />
                                        <span className="h-2.5 w-2.5 bg-muted-foreground rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className="p-4 border-t bg-background">
                        <div className="flex gap-3 max-w-4xl mx-auto">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={`დაწერე შეკითხვა ${selectedRole.name}-ს...`}
                                className="flex-1 h-12 text-base"
                            />
                            <Button type="submit" size="lg" disabled={!input.trim()} className="h-12 px-6">
                                <TbSend className="h-5 w-5" />
                            </Button>
                        </div>
                    </form>
                </div>
            </>
        )
    }

    // Normal small widget mode
    return (
        <div className="fixed bottom-4 right-4 z-50 w-96 h-[500px] max-h-[80vh] bg-card rounded-2xl shadow-2xl border overflow-hidden flex flex-col">
            {/* Header */}
            <div className={`flex items-center justify-between bg-gradient-to-r ${selectedRole.color} p-3 text-white`}>
                <div className="flex items-center gap-2">
                    {/* Online indicator */}
                    <div className="relative">
                        <span className="absolute -top-0.5 -left-0.5 h-2.5 w-2.5 rounded-full bg-green-400 border border-white/50">
                            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                        </span>
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-lg">{selectedRole.icon}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">{selectedRole.name}</h3>
                        <p className="text-xs text-white/80">ონლაინ</p>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                        title="გაზრდა"
                    >
                        <TbMaximize className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                        title="დახურვა"
                    >
                        <TbX className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Role Selector Button */}
            <div className="p-2 border-b bg-muted/30 relative" ref={roleSelectorRef}>
                <button
                    onClick={() => setShowRoleSelector(!showRoleSelector)}
                    className={cn(
                        "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-full",
                        "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
                        "hover:from-blue-600 hover:to-cyan-600 transition-all",
                        "shadow-md hover:shadow-lg font-medium text-sm"
                    )}
                >
                    <TbRobot className="h-4 w-4" />
                    <span>აირჩიე AI ასისტენტი</span>
                    <TbChevronDown className={cn("h-4 w-4 transition-transform", showRoleSelector && "rotate-180")} />
                </button>

                {/* Role Selector Dropdown */}
                {showRoleSelector && (
                    <div className="absolute left-2 right-2 top-full mt-1 bg-card rounded-xl shadow-xl border overflow-hidden z-50">
                        <div className="p-2 border-b bg-muted/50">
                            <p className="text-xs font-medium text-muted-foreground px-2">აირჩიეთ ასისტენტის როლი</p>
                        </div>
                        <div className="p-1 max-h-48 overflow-y-auto">
                            {AI_ROLES.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => handleRoleChange(role)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left",
                                        selectedRole.id === role.id
                                            ? "bg-primary/10 text-primary"
                                            : "hover:bg-muted text-foreground"
                                    )}
                                >
                                    <span className="text-lg">{role.icon}</span>
                                    <div className="flex-1">
                                        <span className="text-sm font-medium block">{role.name}</span>
                                        <span className="text-xs text-muted-foreground">{role.description}</span>
                                    </div>
                                    {selectedRole.id === role.id && (
                                        <TbCheck className="h-4 w-4 text-primary" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-4 space-y-3">
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
                                "max-w-[85%] rounded-2xl px-4 py-2",
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
            <form onSubmit={sendMessage} className="p-3 border-t">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`დაწერე შეკითხვა ${selectedRole.name}-ს...`}
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!input.trim()}>
                        <TbSend className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    )
}


