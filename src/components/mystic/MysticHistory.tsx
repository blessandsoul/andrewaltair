"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TbHistory, TbSparkles, TbMoon, TbHeart, TbStar, TbHash, TbRefresh, TbTrash, TbShare, TbChevronRight, TbLoader2 } from "react-icons/tb"

interface HistoryItem {
    id: string
    toolType: string
    input: Record<string, unknown>
    result: Record<string, unknown>
    createdAt: string
}

const TOOL_CONFIG: Record<string, { icon: typeof TbSparkles; color: string; name: string }> = {
    fortune: { icon: TbSparkles, color: "text-purple-400", name: "გადალი" },
    love: { icon: TbHeart, color: "text-pink-400", name: "სიყვარული" },
    dream: { icon: TbMoon, color: "text-blue-400", name: "სიზმარი" },
    horoscope: { icon: TbStar, color: "text-amber-400", name: "ჰოროსკოპი" },
    tarot: { icon: TbSparkles, color: "text-indigo-400", name: "ტაროტი" },
    numerology: { icon: TbHash, color: "text-emerald-400", name: "ნუმეროლოგია" },
}

export function MysticHistory() {
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)
    const [filter, setFilter] = useState<string>("all")

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        setIsLoading(true)
        try {
            const sessionId = getSessionId()
            const response = await fetch(`/api/mystic/history?sessionId=${sessionId}`)
            if (response.ok) {
                const data = await response.json()
                setHistory(data.history || [])
            }
        } catch (error) {
            console.error("Failed to fetch history:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const getSessionId = () => {
        if (typeof window === 'undefined') return ''
        let sessionId = localStorage.getItem('mystic_session_id')
        if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            localStorage.setItem('mystic_session_id', sessionId)
        }
        return sessionId
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/mystic/history?id=${id}`, { method: 'DELETE' })
            if (response.ok) {
                setHistory(prev => prev.filter(item => item.id !== id))
                if (selectedItem?.id === id) setSelectedItem(null)
            }
        } catch (error) {
            console.error("Failed to delete:", error)
        }
    }

    const handleShare = async (item: HistoryItem) => {
        const text = `🔮 ${TOOL_CONFIG[item.toolType]?.name || item.toolType}\n\n${JSON.stringify(item.result, null, 2)}`
        if (navigator.share) {
            await navigator.share({ text, url: window.location.href })
        } else {
            await navigator.clipboard.writeText(text)
        }
    }

    const filteredHistory = filter === "all"
        ? history
        : history.filter(item => item.toolType === filter)

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('ka-GE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    if (isLoading) {
        return (
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-slate-600 rounded-2xl blur-xl opacity-20" />
                <div className="relative rounded-2xl bg-[#12121a] border border-white/10 p-8">
                    <div className="flex justify-center">
                        <TbLoader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    </div>
                    <p className="text-center text-gray-500 mt-4">ისტორია იტვირთება...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative">
            {/* Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-slate-600 rounded-2xl sm:rounded-3xl blur-xl opacity-20" />

            <div className="relative rounded-2xl sm:rounded-3xl bg-[#12121a] border border-white/10 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-white/10 bg-gradient-to-r from-gray-600/10 to-slate-600/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-500/20 flex items-center justify-center">
                                <TbHistory className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">ჩემი ისტორია</h3>
                                <p className="text-xs text-gray-500">{history.length} წინასწარმეტყველება</p>
                            </div>
                        </div>
                        <Button
                            onClick={fetchHistory}
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-white"
                        >
                            <TbRefresh className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Filter tabs */}
                <div className="p-3 border-b border-white/5 flex gap-2 overflow-x-auto">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filter === "all" ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"
                            }`}
                    >
                        ყველა
                    </button>
                    {Object.entries(TOOL_CONFIG).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${filter === key ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"
                                }`}
                        >
                            <config.icon className={`w-3 h-3 ${config.color}`} />
                            {config.name}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="max-h-[400px] overflow-y-auto">
                    {filteredHistory.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="text-4xl mb-3">🔮</div>
                            <p className="text-gray-500 text-sm">ჯერ არ გაქვს წინასწარმეტყველებები</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {filteredHistory.map((item) => {
                                const config = TOOL_CONFIG[item.toolType] || TOOL_CONFIG.fortune
                                const Icon = config.icon
                                return (
                                    <div
                                        key={item.id}
                                        className="p-4 hover:bg-white/5 transition-colors cursor-pointer group"
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center`}>
                                                <Icon className={`w-4 h-4 ${config.color}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-white text-sm">{config.name}</span>
                                                    <span className="text-xs text-gray-600">{formatDate(item.createdAt)}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {String(item.input.name || item.input.signName || "—")}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleShare(item) }}
                                                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-blue-400"
                                                >
                                                    <TbShare className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}
                                                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-400"
                                                >
                                                    <TbTrash className="w-3.5 h-3.5" />
                                                </button>
                                                <TbChevronRight className="w-4 h-4 text-gray-600" />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Detail modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
                    <div className="w-full max-w-md rounded-2xl bg-[#12121a] border border-white/10 p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center`}>
                                {(() => {
                                    const cfg = TOOL_CONFIG[selectedItem.toolType] || TOOL_CONFIG.fortune
                                    const Icon = cfg.icon
                                    return <Icon className={`w-5 h-5 ${cfg.color}`} />
                                })()}
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{TOOL_CONFIG[selectedItem.toolType]?.name || selectedItem.toolType}</h3>
                                <p className="text-xs text-gray-500">{formatDate(selectedItem.createdAt)}</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 mb-4">
                            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                                {typeof selectedItem.result === 'string'
                                    ? selectedItem.result
                                    : JSON.stringify(selectedItem.result, null, 2)}
                            </pre>
                        </div>
                        <Button
                            onClick={() => setSelectedItem(null)}
                            className="w-full bg-white/10 hover:bg-white/20 text-white border-0"
                        >
                            დახურვა
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
