'use client'

import { useState, useEffect } from 'react'
import { Bot, Sparkles, Settings, X, MessageCircle, Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'

const AVATARS = [
    { id: 'sage', name: 'AI ბრძენი', emoji: '🧙‍♂️', color: 'from-purple-500 to-indigo-500', greeting: 'გამარჯობა, მოგზაურო! მზად ვარ შენი გზამკვლევი ვიყო AI-ს სამყაროში.' },
    { id: 'robot', name: 'ტექნო-ბოტი', emoji: '🤖', color: 'from-cyan-500 to-blue-500', greeting: 'სალამი! მე ვარ შენი AI ასისტენტი. როგორ დაგეხმარო?' },
    { id: 'fox', name: 'ჭკვიანი მელა', emoji: '🦊', color: 'from-orange-500 to-amber-500', greeting: 'გაიხარე! მზად ვარ ახალი რაღაცების აღმოჩენისთვის!' },
    { id: 'owl', name: 'ბუ-მასწავლებელი', emoji: '🦉', color: 'from-amber-600 to-yellow-500', greeting: 'კეთილი იყოს შენი მობრძანება! ვიყოთ AI-ს სწავლა ერთად.' },
    { id: 'dragon', name: 'დრაკონი', emoji: '🐉', color: 'from-emerald-500 to-teal-500', greeting: 'დრაკონის ძალა შენთან! მოდი აღვმოაჩინოთ AI-ს ჯადო.' },
    { id: 'alien', name: 'უცხოპლანეტელი', emoji: '👽', color: 'from-lime-500 to-green-500', greeting: 'მისალმებები დედამიწელო! AI ტექნოლოგიები ახლოს არის.' }
]

interface AIAvatarProps {
    showAsWidget?: boolean
}

export function AIAvatar({ showAsWidget = true }: AIAvatarProps) {
    const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])
    const [isOpen, setIsOpen] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [message, setMessage] = useState('')
    const [isTalking, setIsTalking] = useState(false)

    useEffect(() => {
        const savedAvatarId = localStorage.getItem('selected_avatar')
        if (savedAvatarId) {
            const avatar = AVATARS.find(a => a.id === savedAvatarId)
            if (avatar) setSelectedAvatar(avatar)
        }

        // Show greeting on first visit
        const hasSeenGreeting = sessionStorage.getItem('avatar_greeted')
        if (!hasSeenGreeting && showAsWidget) {
            setTimeout(() => {
                setMessage(selectedAvatar.greeting)
                setIsTalking(true)
                setTimeout(() => setIsTalking(false), 5000)
                sessionStorage.setItem('avatar_greeted', 'true')
            }, 2000)
        }
    }, [])

    const handleSelectAvatar = (avatar: typeof AVATARS[0]) => {
        setSelectedAvatar(avatar)
        localStorage.setItem('selected_avatar', avatar.id)
        setMessage(avatar.greeting)
        setIsTalking(true)
        setTimeout(() => setIsTalking(false), 4000)
    }

    if (!showAsWidget) {
        // Full selector view
        return (
            <div className="w-full max-w-md mx-auto">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">აირჩიე შენი AI ასისტენტი</h3>
                            <p className="text-white/50 text-xs">ის შენთან იქნება მთელი მოგზაურობის განმავლობაში</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {AVATARS.map(avatar => (
                            <button
                                key={avatar.id}
                                onClick={() => handleSelectAvatar(avatar)}
                                className={`p-4 rounded-2xl border-2 transition-all ${selectedAvatar.id === avatar.id
                                        ? `bg-gradient-to-br ${avatar.color} border-white/30`
                                        : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                                    }`}
                            >
                                <span className="text-4xl block mb-2">{avatar.emoji}</span>
                                <p className={`text-xs font-medium ${selectedAvatar.id === avatar.id ? 'text-white' : 'text-white/70'
                                    }`}>
                                    {avatar.name}
                                </p>
                            </button>
                        ))}
                    </div>

                    {message && (
                        <div className={`mt-4 p-4 rounded-xl bg-gradient-to-r ${selectedAvatar.color} bg-opacity-20 border border-white/10`}>
                            <p className="text-white text-sm">&quot;{message}&quot;</p>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Floating widget view
    return (
        <>
            {/* Floating Avatar Button */}
            <div className="fixed bottom-24 right-4 z-40">
                {/* Speech Bubble */}
                {isTalking && message && (
                    <div className="absolute bottom-full right-0 mb-2 animate-in slide-in-from-bottom-2 fade-in">
                        <div className={`relative max-w-[200px] p-3 rounded-2xl bg-gradient-to-r ${selectedAvatar.color} shadow-lg`}>
                            <p className="text-white text-sm">{message}</p>
                            <div className="absolute bottom-0 right-4 translate-y-1/2 rotate-45 w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500" />
                        </div>
                    </div>
                )}

                {/* Avatar Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${selectedAvatar.color} shadow-lg shadow-indigo-500/30 flex items-center justify-center text-3xl hover:scale-110 transition-transform`}
                >
                    {selectedAvatar.emoji}
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
                </button>
            </div>

            {/* Settings Panel */}
            {isOpen && (
                <div className="fixed bottom-40 right-4 z-50 animate-in slide-in-from-bottom-4">
                    <div className="w-72 bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                        <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{selectedAvatar.emoji}</span>
                                <span className="text-white font-medium">{selectedAvatar.name}</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4">
                            <p className="text-white/60 text-sm mb-4">აირჩიე სხვა ასისტენტი:</p>
                            <div className="grid grid-cols-3 gap-2">
                                {AVATARS.map(avatar => (
                                    <button
                                        key={avatar.id}
                                        onClick={() => handleSelectAvatar(avatar)}
                                        className={`p-2 rounded-xl text-2xl transition-all ${selectedAvatar.id === avatar.id
                                                ? `bg-gradient-to-br ${avatar.color}`
                                                : 'bg-slate-800 hover:bg-slate-700'
                                            }`}
                                    >
                                        {avatar.emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
