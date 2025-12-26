'use client'

import { useState, useEffect } from 'react'
import { Video, Calendar, Clock, Users, Star, Play, Bell, ChevronRight, Share2, CheckCircle, ExternalLink, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DemoSession {
    id: string
    title: string
    description: string
    host: {
        name: string
        avatar: string
        title: string
        company: string
    }
    tool: {
        name: string
        icon: string
        category: string
    }
    scheduledDate: Date
    duration: string
    status: 'live' | 'upcoming' | 'completed'
    participants: number
    maxParticipants: number
    rating?: number
    topics: string[]
    demoLink?: string
    recordingLink?: string
}

const DEMO_SESSIONS: DemoSession[] = [
    {
        id: '1',
        title: 'ChatGPT-ით პროდუქტიულობის გაზრდა',
        description: 'ისწავლეთ როგორ გამოიყენოთ ChatGPT ყოველდღიურ სამუშაოში: ემაილები, დოკუმენტები, ანალიზი და მეტი',
        host: {
            name: 'გიორგი მაისურაძე',
            avatar: '👨‍💻',
            title: 'AI Consultant',
            company: 'TechGeo'
        },
        tool: { name: 'ChatGPT', icon: '🤖', category: 'ჩატბოტი' },
        scheduledDate: new Date(Date.now() + 1000 * 60 * 30), // 30 min from now
        duration: '45 წუთი',
        status: 'live',
        participants: 156,
        maxParticipants: 200,
        topics: ['პრომპტის წერა', 'პროდუქტიულობა', 'ავტომატიზაცია'],
        demoLink: '#'
    },
    {
        id: '2',
        title: 'Midjourney v6: ახალი ფუნქციები',
        description: 'სიღრმისეული მიმოხილვა ახალი ვერსიის ფუნქციებზე: --cref, --sref და სტილის კონტროლი',
        host: {
            name: 'ნინო ბერიძე',
            avatar: '👩‍🎨',
            title: 'Digital Artist',
            company: 'ArtSpace'
        },
        tool: { name: 'Midjourney', icon: '🎨', category: 'გამოსახულება' },
        scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours
        duration: '1 საათი',
        status: 'upcoming',
        participants: 89,
        maxParticipants: 150,
        topics: ['v6 ფუნქციები', 'სტილის კონტროლი', 'პარამეტრები'],
        demoLink: '#'
    },
    {
        id: '3',
        title: 'Cursor IDE: AI-პირველი კოდის რედაქტორი',
        description: 'როგორ გამოვიყენოთ Cursor დეველოპმენტის დასაჩქარებლად',
        host: {
            name: 'დავით ხარაძე',
            avatar: '💻',
            title: 'Senior Developer',
            company: 'CodeLab'
        },
        tool: { name: 'Cursor', icon: '⚡', category: 'IDE' },
        scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
        duration: '1 საათი',
        status: 'upcoming',
        participants: 234,
        maxParticipants: 300,
        topics: ['AI კოდინგი', 'Copilot++', 'ინტეგრაცია'],
        demoLink: '#'
    },
    {
        id: '4',
        title: 'Claude 3.5 Sonnet: სიღრმისეული ანალიზი',
        description: 'როგორ გამოვიყენოთ Claude დიდი დოკუმენტების ანალიზისთვის',
        host: {
            name: 'მარიამი თბილელი',
            avatar: '🧠',
            title: 'AI Researcher',
            company: 'DataHub'
        },
        tool: { name: 'Claude', icon: '🧠', category: 'ჩატბოტი' },
        scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        duration: '45 წუთი',
        status: 'completed',
        participants: 178,
        maxParticipants: 200,
        rating: 4.8,
        topics: ['დოკუმენტები', 'ანალიზი', 'API'],
        recordingLink: '#'
    },
    {
        id: '5',
        title: 'DALL-E 3 vs Midjourney: შედარება',
        description: 'პრაქტიკული შედარება ორ ტოპ გამოსახულების გენერატორს შორის',
        host: {
            name: 'ლუკა კახიანი',
            avatar: '🎨',
            title: 'Creative Director',
            company: 'VisualAI'
        },
        tool: { name: 'DALL-E 3', icon: '🖼️', category: 'გამოსახულება' },
        scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
        duration: '1 საათი',
        status: 'completed',
        participants: 256,
        maxParticipants: 300,
        rating: 4.9,
        topics: ['შედარება', 'პრომპტები', 'ხარისხი'],
        recordingLink: '#'
    }
]

function formatTimeUntil(date: Date): string {
    const now = Date.now()
    const diff = date.getTime() - now

    if (diff < 0) return 'დასრულდა'

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days} დღეში`
    if (hours > 0) return `${hours} საათში`
    if (minutes > 0) return `${minutes} წუთში`
    return 'მალე იწყება'
}

function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    }
    return date.toLocaleDateString('ka-GE', options)
}

export function LiveDemoSessions() {
    const [activeTab, setActiveTab] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all')
    const [subscribedSessions, setSubscribedSessions] = useState<string[]>([])
    const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({})

    // Update countdowns
    useEffect(() => {
        const updateCountdowns = () => {
            const newCountdowns: { [key: string]: string } = {}
            DEMO_SESSIONS.forEach(session => {
                if (session.status !== 'completed') {
                    newCountdowns[session.id] = formatTimeUntil(session.scheduledDate)
                }
            })
            setCountdowns(newCountdowns)
        }

        updateCountdowns()
        const interval = setInterval(updateCountdowns, 60000)
        return () => clearInterval(interval)
    }, [])

    const handleSubscribe = (sessionId: string) => {
        setSubscribedSessions(prev =>
            prev.includes(sessionId)
                ? prev.filter(id => id !== sessionId)
                : [...prev, sessionId]
        )
    }

    const filteredSessions = DEMO_SESSIONS.filter(session =>
        activeTab === 'all' || session.status === activeTab
    )

    const liveSessions = DEMO_SESSIONS.filter(s => s.status === 'live')
    const upcomingSessions = DEMO_SESSIONS.filter(s => s.status === 'upcoming')

    return (
        <div className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-4">
                        <Video className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-cyan-300">ცოცხალი დემოები</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Live AI <span className="text-gradient">Demo Sessions</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        შემოგვიერთდით ცოცხალ დემო სესიებზე და ისწავლეთ AI ხელსაწყოების გამოყენება ექსპერტებისგან
                    </p>
                </div>

                {/* Live Banner */}
                {liveSessions.length > 0 && (
                    <div className="mb-8">
                        {liveSessions.map(session => (
                            <div
                                key={session.id}
                                className="bg-gradient-to-r from-red-900/40 via-red-800/30 to-red-900/40 rounded-2xl border border-red-500/40 p-6 relative overflow-hidden"
                            >
                                {/* Animated Background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent animate-pulse" />

                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                        </span>
                                        <span className="text-red-400 font-bold">ახლა პირდაპირ ეთერში</span>
                                        <span className="text-zinc-500">•</span>
                                        <span className="text-zinc-400 flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {session.participants} უყურებს
                                        </span>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="text-5xl">{session.tool.icon}</div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{session.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-2xl">{session.host.avatar}</span>
                                                    <div>
                                                        <div className="text-sm text-zinc-300">{session.host.name}</div>
                                                        <div className="text-xs text-zinc-500">{session.host.title} @ {session.host.company}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1" />

                                        <Button className="bg-red-600 hover:bg-red-500 gap-2 shadow-lg shadow-red-500/30">
                                            <Play className="w-4 h-4" />
                                            შემოგვიერთდით
                                        </Button>
                                    </div>

                                    {/* Topics */}
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {session.topics.map((topic) => (
                                            <span key={topic} className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300">
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 text-center">
                        <div className="text-3xl font-bold text-red-400">{liveSessions.length}</div>
                        <div className="text-sm text-zinc-500">ცოცხლად ახლა</div>
                    </div>
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 text-center">
                        <div className="text-3xl font-bold text-blue-400">{upcomingSessions.length}</div>
                        <div className="text-sm text-zinc-500">მოახლოებული</div>
                    </div>
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 text-center">
                        <div className="text-3xl font-bold text-green-400">{subscribedSessions.length}</div>
                        <div className="text-sm text-zinc-500">გამოწერილი</div>
                    </div>
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 text-center">
                        <div className="text-3xl font-bold text-purple-400">5</div>
                        <div className="text-sm text-zinc-500">ჩანაწერები</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {[
                        { id: 'all', label: 'ყველა' },
                        { id: 'live', label: '🔴 პირდაპირ', count: liveSessions.length },
                        { id: 'upcoming', label: '📅 მოახლოებული', count: upcomingSessions.length },
                        { id: 'completed', label: '📼 ჩანაწერები' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800'
                                }`}
                        >
                            {tab.label}
                            {tab.count !== undefined && tab.count > 0 && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Sessions Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {filteredSessions.filter(s => s.status !== 'live').map((session) => (
                        <div
                            key={session.id}
                            className={`bg-zinc-900/50 rounded-xl border overflow-hidden transition-all hover:border-indigo-500/30 ${session.status === 'completed' ? 'border-zinc-800/50' : 'border-zinc-800/50'
                                }`}
                        >
                            {/* Session Header */}
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${session.status === 'completed' ? 'bg-zinc-800' : 'bg-indigo-600/20'
                                        }`}>
                                        {session.tool.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${session.status === 'upcoming'
                                                    ? 'bg-blue-500/20 text-blue-400'
                                                    : 'bg-zinc-700 text-zinc-400'
                                                }`}>
                                                {session.tool.name}
                                            </span>
                                            {session.status === 'upcoming' && (
                                                <span className="text-xs text-cyan-400">
                                                    {countdowns[session.id]}
                                                </span>
                                            )}
                                            {session.status === 'completed' && session.rating && (
                                                <span className="flex items-center gap-1 text-xs text-yellow-400">
                                                    <Star className="w-3 h-3 fill-yellow-400" />
                                                    {session.rating}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">{session.title}</h3>
                                        <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{session.description}</p>
                                    </div>
                                </div>

                                {/* Host */}
                                <div className="flex items-center gap-3 mt-4 p-3 bg-zinc-800/50 rounded-lg">
                                    <span className="text-2xl">{session.host.avatar}</span>
                                    <div>
                                        <div className="text-sm font-medium text-white">{session.host.name}</div>
                                        <div className="text-xs text-zinc-500">{session.host.title}</div>
                                    </div>
                                </div>

                                {/* Meta */}
                                <div className="flex flex-wrap gap-4 mt-4 text-sm text-zinc-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(session.scheduledDate)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {session.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        {session.participants}/{session.maxParticipants}
                                    </span>
                                </div>

                                {/* Topics */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {session.topics.map((topic) => (
                                        <span key={topic} className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-4 border-t border-zinc-800 flex gap-3">
                                {session.status === 'upcoming' ? (
                                    <>
                                        <Button
                                            variant={subscribedSessions.includes(session.id) ? "outline" : "default"}
                                            className={`flex-1 ${subscribedSessions.includes(session.id)
                                                    ? 'border-green-500/50 text-green-400'
                                                    : 'bg-indigo-600 hover:bg-indigo-500'
                                                }`}
                                            onClick={() => handleSubscribe(session.id)}
                                        >
                                            {subscribedSessions.includes(session.id) ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    შეხსენება აქტიურია
                                                </>
                                            ) : (
                                                <>
                                                    <Bell className="w-4 h-4 mr-2" />
                                                    შეხსენება
                                                </>
                                            )}
                                        </Button>
                                        <Button variant="outline" className="border-zinc-700">
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button className="flex-1 bg-zinc-800 hover:bg-zinc-700 gap-2">
                                            <Play className="w-4 h-4" />
                                            ჩანაწერის ნახვა
                                        </Button>
                                        <Button variant="outline" className="border-zinc-700">
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredSessions.length === 0 && (
                    <div className="text-center py-12 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
                        <div className="text-5xl mb-4">📭</div>
                        <h3 className="text-xl font-semibold text-white mb-2">სესიები არ მოიძებნა</h3>
                        <p className="text-zinc-400">ამ კატეგორიაში ჯერ სესიები არ არის</p>
                    </div>
                )}

                {/* Suggest Session CTA */}
                <div className="mt-8 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-2xl border border-indigo-500/30 p-8 text-center">
                    <h3 className="text-xl font-semibold text-white mb-2">გსურთ თქვენი დემოს ჩატარება?</h3>
                    <p className="text-zinc-400 mb-4">გახდით ჰოსტი და გაუზიარეთ ცოდნა საზოგადოებას</p>
                    <Button className="bg-indigo-600 hover:bg-indigo-500 gap-2">
                        <MessageCircle className="w-4 h-4" />
                        განაცხადის გაგზავნა
                    </Button>
                </div>
            </div>
        </div>
    )
}
