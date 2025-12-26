'use client'

import { useState, useEffect } from 'react'
import { Bell, X, Gift, Zap, Star, Flame, ChevronRight, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Notification {
    id: string
    type: 'new_tool' | 'challenge' | 'reward' | 'streak' | 'tip'
    title: string
    message: string
    time: string
    read: boolean
    icon: string
    action?: { label: string; href: string }
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'new_tool',
        title: 'ახალი AI ინსტრუმენტი!',
        message: 'Claude 3.5 Sonnet დაემატა კატალოგში',
        time: '5 წუთის წინ',
        read: false,
        icon: '🆕',
        action: { label: 'ნახე', href: '/tools' }
    },
    {
        id: '2',
        type: 'challenge',
        title: 'დღის გამოწვევა მზადაა!',
        message: 'შეისწავლე 3 ახალი AI ინსტრუმენტი და მიიღე 30 XP',
        time: '1 საათის წინ',
        read: false,
        icon: '🎯',
        action: { label: 'დაწყება', href: '/dashboard' }
    },
    {
        id: '3',
        type: 'streak',
        title: '🔥 7-დღიანი სტრიკი!',
        message: 'გილოცავ! შენ უკვე 7 დღეა აქტიური ხარ',
        time: '3 საათის წინ',
        read: true,
        icon: '🔥'
    },
    {
        id: '4',
        type: 'tip',
        title: 'AI რჩევა',
        message: 'იცოდი? ChatGPT-ს შეუძლია კოდის დებაგირება!',
        time: 'გუშინ',
        read: true,
        icon: '💡'
    }
]

export function SmartNotifications() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS)

    const unreadCount = notifications.filter(n => !n.read).length

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ))
    }

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    const getTypeColor = (type: Notification['type']) => {
        switch (type) {
            case 'new_tool': return 'from-blue-500 to-cyan-500'
            case 'challenge': return 'from-amber-500 to-orange-500'
            case 'reward': return 'from-emerald-500 to-teal-500'
            case 'streak': return 'from-red-500 to-orange-500'
            case 'tip': return 'from-purple-500 to-pink-500'
            default: return 'from-slate-500 to-slate-600'
        }
    }

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
            >
                <Bell className="w-5 h-5 text-white" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div className="absolute right-0 top-full mt-2 w-80 z-50 animate-in slide-in-from-top-2 fade-in">
                        <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bell className="w-4 h-4 text-indigo-400" />
                                    <span className="text-white font-medium">შეტყობინებები</span>
                                    {unreadCount > 0 && (
                                        <span className="px-2 py-0.5 bg-indigo-500/30 rounded-full text-xs text-indigo-300">
                                            {unreadCount} ახალი
                                        </span>
                                    )}
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-indigo-400 hover:text-indigo-300"
                                    >
                                        ყველას წაკითხვა
                                    </button>
                                )}
                            </div>

                            {/* Notifications List */}
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Bell className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                                        <p className="text-white/50 text-sm">შეტყობინებები არ არის</p>
                                    </div>
                                ) : (
                                    notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${!notification.read ? 'bg-indigo-500/5' : ''
                                                }`}
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            <div className="flex gap-3">
                                                {/* Icon */}
                                                <div className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${getTypeColor(notification.type)} flex items-center justify-center text-xl`}>
                                                    {notification.icon}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className={`text-sm font-medium ${notification.read ? 'text-white/70' : 'text-white'}`}>
                                                            {notification.title}
                                                        </h4>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); removeNotification(notification.id) }}
                                                            className="text-white/30 hover:text-white/60"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <p className="text-white/50 text-xs mt-0.5 line-clamp-2">{notification.message}</p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-white/30 text-xs">{notification.time}</span>
                                                        {notification.action && (
                                                            <a
                                                                href={notification.action.href}
                                                                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                                            >
                                                                {notification.action.label}
                                                                <ChevronRight className="w-3 h-3" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Unread indicator */}
                                            {!notification.read && (
                                                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-500 rounded-full" />
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-3 bg-slate-800/50 border-t border-slate-700 flex justify-center">
                                <button className="text-xs text-white/50 hover:text-white/70 flex items-center gap-1">
                                    <Settings className="w-3 h-3" />
                                    შეტყობინებების პარამეტრები
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
