"use client"

import * as React from "react"
import { TbBell, TbCheck, TbLoader2 } from "react-icons/tb"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AdminNotification {
    id: string
    type: "info" | "success" | "warning" | "error"
    message: string
    read: boolean
    time: string
}

const TYPE_DOT: Record<AdminNotification["type"], string> = {
    info: "bg-blue-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
}

function timeAgo(iso: string): string {
    const t = new Date(iso).getTime()
    if (Number.isNaN(t)) return ""
    const s = Math.floor((Date.now() - t) / 1000)
    if (s < 60) return "ახლახ"
    const m = Math.floor(s / 60)
    if (m < 60) return `${m} წთ`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h} სთ`
    return `${Math.floor(h / 24)} დღ`
}

export function NotificationBell() {
    const [open, setOpen] = React.useState(false)
    const [items, setItems] = React.useState<AdminNotification[]>([])
    const [loading, setLoading] = React.useState(false)
    const ref = React.useRef<HTMLDivElement>(null)

    const unread = items.filter((n) => !n.read).length

    const load = React.useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/notifications")
            if (res.ok) {
                const json = await res.json()
                setItems(json?.data?.notifications ?? [])
            }
        } catch {
            // Network error — keep the last known list
        }
        setLoading(false)
    }, [])

    // Initial load + light polling so the badge stays fresh
    React.useEffect(() => {
        load()
        const timer = setInterval(load, 60000)
        return () => clearInterval(timer)
    }, [load])

    // Close the dropdown on outside click
    React.useEffect(() => {
        if (!open) return
        const onClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", onClick)
        return () => document.removeEventListener("mousedown", onClick)
    }, [open])

    const markRead = async (id: string) => {
        setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
        try {
            await fetch(`/api/notifications/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ read: true }),
            })
        } catch {
            load() // revert optimistic update from source of truth
        }
    }

    const markAllRead = async () => {
        const unreadItems = items.filter((n) => !n.read)
        if (unreadItems.length === 0) return
        setItems((prev) => prev.map((n) => ({ ...n, read: true })))
        await Promise.allSettled(
            unreadItems.map((n) =>
                fetch(`/api/notifications/${n.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ read: true }),
                })
            )
        )
    }

    return (
        <div className="relative" ref={ref}>
            <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9"
                onClick={() => setOpen((v) => !v)}
                aria-label="შეტყობინებები"
            >
                <TbBell className="w-4 h-4" />
                {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center px-1">
                        {unread > 99 ? "99+" : unread}
                    </span>
                )}
            </Button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-2xl z-100 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <span className="text-sm font-semibold">შეტყობინებები</span>
                        {unread > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                            >
                                <TbCheck className="w-3.5 h-3.5" />
                                ყველას წაკითხვა
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {loading && items.length === 0 ? (
                            <div className="flex items-center justify-center py-8 text-muted-foreground">
                                <TbLoader2 className="w-5 h-5 animate-spin" />
                            </div>
                        ) : items.length === 0 ? (
                            <div className="py-8 text-center text-sm text-muted-foreground">
                                შეტყობინებები არ არის
                            </div>
                        ) : (
                            items.map((n) => (
                                <button
                                    key={n.id}
                                    onClick={() => !n.read && markRead(n.id)}
                                    className={cn(
                                        "w-full text-left flex gap-3 px-4 py-3 border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors",
                                        !n.read && "bg-primary/5"
                                    )}
                                >
                                    <span className={cn("mt-1.5 w-2 h-2 rounded-full shrink-0", TYPE_DOT[n.type] ?? "bg-blue-500")} />
                                    <span className="flex-1 min-w-0">
                                        <span className={cn("block text-sm break-words", !n.read ? "text-foreground font-medium" : "text-muted-foreground")}>
                                            {n.message}
                                        </span>
                                        <span className="block text-xs text-muted-foreground mt-0.5">{timeAgo(n.time)}</span>
                                    </span>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
