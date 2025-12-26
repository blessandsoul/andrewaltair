'use client'

import { useState } from 'react'
import { Newspaper, Mail, Calendar, TrendingUp, ChevronRight, Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface NewsItem {
    id: string
    title: string
    summary: string
    category: string
    date: string
    trending?: boolean
}

const SAMPLE_NEWS: NewsItem[] = [
    {
        id: '1',
        title: 'OpenAI გამოაქვეყნებს GPT-5 2025 წელს',
        summary: 'ახალი მოდელი იქნება მნიშვნელოვნად უფრო ძლიერი და ეფექტური...',
        category: 'ჩატბოტები',
        date: 'დღეს',
        trending: true
    },
    {
        id: '2',
        title: 'Google Gemini 2.0 ახლა ხელმისაწვდომია',
        summary: 'Google-მა გამოუშვა თავისი ახალი AI მოდელი გაუმჯობესებული...',
        category: 'AI მოდელები',
        date: 'დღეს'
    },
    {
        id: '3',
        title: 'Midjourney V7 მოდის იანვარში',
        summary: 'ახალ ვერსიაში იქნება რევოლუციური ცვლილებები ხარისხში...',
        category: 'სურათები',
        date: 'გუშინ'
    },
    {
        id: '4',
        title: 'Claude 4 Beta Test იწყება',
        summary: 'Anthropic-ის ახალი მოდელი უკვე ტესტირებაშია...',
        category: 'ჩატბოტები',
        date: 'ამ კვირაში',
        trending: true
    }
]

const TRENDING_TOPICS = ['GPT-5', 'Sora Video', 'Claude 4', 'Gemini 2.0', 'AI ეთიკა', 'AGI']

export function NewsDigest() {
    const [email, setEmail] = useState('')
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily')

    const handleSubscribe = () => {
        if (!email) return

        localStorage.setItem('newsletter_email', email)
        localStorage.setItem('newsletter_frequency', frequency)
        setIsSubscribed(true)
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4">
                {/* Main News */}
                <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl">
                            <Newspaper className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">AI სიახლეები</h3>
                            <p className="text-white/50 text-xs">უახლესი ამბები AI სამყაროდან</p>
                        </div>
                    </div>

                    {/* News List */}
                    <div className="space-y-3">
                        {SAMPLE_NEWS.map(news => (
                            <div
                                key={news.id}
                                className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-cyan-500/20 rounded-full text-xs text-cyan-400">
                                            {news.category}
                                        </span>
                                        {news.trending && (
                                            <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-500/20 rounded-full text-xs text-rose-400">
                                                <TrendingUp className="w-3 h-3" />
                                                ტრენდი
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-white/30 text-xs">{news.date}</span>
                                </div>
                                <h4 className="text-white font-medium mb-1 group-hover:text-cyan-400 transition-colors">
                                    {news.title}
                                </h4>
                                <p className="text-white/50 text-sm line-clamp-1">{news.summary}</p>
                            </div>
                        ))}
                    </div>

                    {/* View All */}
                    <Button
                        variant="ghost"
                        className="w-full mt-4 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                    >
                        ყველა სიახლე
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Trending Topics */}
                    <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-4">
                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-rose-400" />
                            ტრენდული თემები
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {TRENDING_TOPICS.map(topic => (
                                <span
                                    key={topic}
                                    className="px-2 py-1 bg-slate-800 rounded-full text-xs text-white/70 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                                >
                                    #{topic}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter Signup */}
                    <div className="rounded-2xl bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Mail className="w-4 h-4 text-cyan-400" />
                            <h4 className="text-white font-medium">AI Digest</h4>
                        </div>

                        {!isSubscribed ? (
                            <>
                                <p className="text-white/60 text-sm mb-3">
                                    მიიღე AI სიახლეები ელ-ფოსტაზე
                                </p>

                                {/* Frequency */}
                                <div className="flex gap-2 mb-3">
                                    {(['daily', 'weekly'] as const).map(freq => (
                                        <button
                                            key={freq}
                                            onClick={() => setFrequency(freq)}
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${frequency === freq
                                                    ? 'bg-cyan-500 text-white'
                                                    : 'bg-slate-800 text-white/60 hover:text-white'
                                                }`}
                                        >
                                            <Calendar className="w-3 h-3 inline mr-1" />
                                            {freq === 'daily' ? 'ყოველდღე' : 'კვირაში ერთხელ'}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <Input
                                        type="email"
                                        placeholder="ელ-ფოსტა"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-white/40 text-sm"
                                    />
                                    <Button
                                        onClick={handleSubscribe}
                                        disabled={!email}
                                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-sm"
                                    >
                                        გამოწერა
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-2">
                                <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-500/20 rounded-full mb-2">
                                    <Check className="w-5 h-5 text-emerald-400" />
                                </div>
                                <p className="text-emerald-400 font-medium text-sm">გამოწერილია!</p>
                                <p className="text-white/50 text-xs mt-1">
                                    მიიღებ {frequency === 'daily' ? 'ყოველდღე' : 'კვირაში ერთხელ'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
