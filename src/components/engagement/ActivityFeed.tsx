'use client'

import { useState, useEffect } from 'react'
import { TbMapPin, TbEye, TbBolt, TbStar, TbTrendingUp } from "react-icons/tb"

const GEORGIAN_CITIES = [
    'თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'გორი',
    'ზუგდიდი', 'ფოთი', 'თელავი', 'ახალციხე', 'მცხეთა'
]

const ACTIVITIES = [
    { action: 'შეისწავლა', target: 'ChatGPT', icon: '🤖' },
    { action: 'შეისწავლა', target: 'Claude AI', icon: '🧠' },
    { action: 'შეისწავლა', target: 'Midjourney', icon: '🎨' },
    { action: 'შეისწავლა', target: 'DALL-E 3', icon: '🖼️' },
    { action: 'გაიარა', target: 'AI ქვიზი', icon: '🎯' },
    { action: 'წაიკითხა', target: 'AI სტატია', icon: '📖' },
    { action: 'გახდა', target: 'Premium მომხმარებელი', icon: '👑' },
    { action: 'მიიღო', target: 'AI სერტიფიკატი', icon: '🎓' },
    { action: 'სცადა', target: 'AI ჰოროსკოპი', icon: '🔮' },
    { action: 'გამოიყენა', target: 'AI ჩატბოტი', icon: '💬' }
]

interface Activity {
    id: string
    city: string
    action: string
    target: string
    icon: string
    minutes: number
}

function generateRandomActivity(): Activity {
    const city = GEORGIAN_CITIES[Math.floor(Math.random() * GEORGIAN_CITIES.length)]
    const activity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)]
    const minutes = Math.floor(Math.random() * 10) + 1

    return {
        id: Math.random().toString(36).substr(2, 9),
        city,
        ...activity,
        minutes
    }
}

export function ActivityFeed() {
    const [activities, setActivities] = useState<Activity[]>([])
    const [currentActivity, setCurrentActivity] = useState<Activity | null>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Initial activity after 3 seconds
        const initialTimeout = setTimeout(() => {
            showNewActivity()
        }, 3000)

        return () => clearTimeout(initialTimeout)
    }, [])

    const showNewActivity = () => {
        const newActivity = generateRandomActivity()
        setCurrentActivity(newActivity)
        setIsVisible(true)
        setActivities(prev => [newActivity, ...prev].slice(0, 10))

        // Hide after 5 seconds
        setTimeout(() => {
            setIsVisible(false)

            // Schedule next activity
            const nextDelay = Math.random() * 15000 + 10000 // 10-25 seconds
            setTimeout(showNewActivity, nextDelay)
        }, 5000)
    }

    if (!isVisible || !currentActivity) return null

    return (
        <div className="fixed bottom-4 left-4 z-40 animate-in slide-in-from-left-4 fade-in duration-500">
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl max-w-sm">
                {/* Icon */}
                <div className="shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center text-xl">
                    {currentActivity.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">
                        <span className="font-medium">მომხმარებელმა</span>
                        <span className="text-white/70"> {currentActivity.action} </span>
                        <span className="font-medium text-indigo-400">{currentActivity.target}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <TbMapPin className="w-3 h-3 text-white/40" />
                        <span className="text-white/50 text-xs">{currentActivity.city}</span>
                        <span className="text-white/30">•</span>
                        <span className="text-white/50 text-xs">{currentActivity.minutes} წუთის წინ</span>
                    </div>
                </div>

                {/* Pulse indicator */}
                <div className="shrink-0">
                    <div className="relative">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    </div>
                </div>
            </div>

            {/* Subtle "X people viewing" */}
            <div className="flex items-center justify-center gap-1 mt-2 text-white/40 text-xs">
                <TbEye className="w-3 h-3" />
                <span>{Math.floor(Math.random() * 50) + 20} ადამიანი ათვალიერებს ახლა</span>
            </div>
        </div>
    )
}
