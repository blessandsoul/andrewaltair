"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { TbUsers, TbMail, TbMessage, TbTrendingUp } from "react-icons/tb"

interface Toast {
    id: number
    message: string
    type: "subscribe" | "reading" | "comment" | "trending"
    location?: string
}

// Sample Georgian cities and names
const cities = [
    "თბილისი", "ბათუმი", "ქუთაისი", "რუსთავი", "გორი",
    "ზუგდიდი", "ფოთი", "თელავი", "მცხეთა", "ახალციხე"
]

const names = [
    "გიორგი", "თამარ", "ნიკოლოზ", "მარიამ", "ალექსანდრე",
    "ნინო", "დავით", "ანა", "ლუკა", "სოფია"
]

const actions = [
    { type: "subscribe", template: "{name} ახლახანს გამოიწერა!", icon: TbMail },
    { type: "reading", template: "{name} {city}-დან კითხულობს", icon: TbUsers },
    { type: "comment", template: "{name}-მ დატოვა კომენტარი", icon: TbMessage },
    { type: "trending", template: "ეს სტატია ტრენდშია! 🔥", icon: TbTrendingUp },
]

export function SocialProofToast({ enabled = true }: { enabled?: boolean }) {
    const [toasts, setToasts] = useState<Toast[]>([])
    const [lastId, setLastId] = useState(0)

    useEffect(() => {
        if (!enabled) return

        // Show first toast after a delay
        const initialDelay = setTimeout(() => {
            addRandomToast()
        }, 5000)

        // Then show toasts periodically
        const interval = setInterval(() => {
            if (Math.random() > 0.3) { // 70% chance to show
                addRandomToast()
            }
        }, 15000 + Math.random() * 10000) // Random interval 15-25 seconds

        return () => {
            clearTimeout(initialDelay)
            clearInterval(interval)
        }
    }, [enabled])

    const addRandomToast = () => {
        const action = actions[Math.floor(Math.random() * actions.length)]
        const name = names[Math.floor(Math.random() * names.length)]
        const city = cities[Math.floor(Math.random() * cities.length)]

        const message = action.template
            .replace("{name}", name)
            .replace("{city}", city)

        const newToast: Toast = {
            id: lastId + 1,
            message,
            type: action.type as Toast["type"],
            location: city,
        }

        setLastId((prev) => prev + 1)
        setToasts((prev) => [...prev.slice(-2), newToast])

        // Auto-remove after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== newToast.id))
        }, 5000)
    }

    const getIcon = (type: Toast["type"]) => {
        switch (type) {
            case "subscribe":
                return <TbMail className="h-4 w-4 text-primary" />
            case "reading":
                return <TbUsers className="h-4 w-4 text-accent" />
            case "comment":
                return <TbMessage className="h-4 w-4 text-green-500" />
            case "trending":
                return <TbTrendingUp className="h-4 w-4 text-red-500" />
        }
    }

    if (!enabled || toasts.length === 0) return null

    return (
        <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(
                        "flex items-center gap-3 rounded-lg bg-card/95 backdrop-blur-lg px-4 py-3 shadow-xl border",
                        "animate-in slide-in-from-left-4 fade-in duration-300"
                    )}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                        {getIcon(toast.type)}
                    </div>
                    <div>
                        <p className="text-sm font-medium">{toast.message}</p>
                        {toast.location && toast.type !== "reading" && (
                            <p className="text-xs text-muted-foreground">{toast.location}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

// Simple visitor notification (single toast style)
export function RecentActivityToast() {
    const [visible, setVisible] = useState(false)
    const [activity, setActivity] = useState({ name: "", action: "" })

    useEffect(() => {
        const showActivity = () => {
            const name = names[Math.floor(Math.random() * names.length)]
            const city = cities[Math.floor(Math.random() * cities.length)]

            setActivity({
                name,
                action: `${city}-დან კითხულობს`,
            })
            setVisible(true)

            setTimeout(() => setVisible(false), 4000)
        }

        const timeout = setTimeout(showActivity, 8000)
        const interval = setInterval(showActivity, 20000)

        return () => {
            clearTimeout(timeout)
            clearInterval(interval)
        }
    }, [])

    if (!visible) return null

    return (
        <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-left-4 fade-in">
            <div className="flex items-center gap-3 rounded-lg bg-card/95 backdrop-blur-lg px-4 py-3 shadow-xl border">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-sm">
                    <span className="font-medium">{activity.name}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>
                </p>
            </div>
        </div>
    )
}
