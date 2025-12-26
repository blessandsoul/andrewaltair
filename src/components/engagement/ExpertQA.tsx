'use client'

import { useState } from 'react'
import { MessageCircle, Star, Clock, Users, ThumbsUp, Award, Calendar, Video, ChevronRight, Send, Bookmark, Share2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Expert {
    id: string
    name: string
    avatar: string
    title: string
    company: string
    expertise: string[]
    rating: number
    answersCount: number
    verified: boolean
    isOnline: boolean
}

interface QASession {
    id: string
    expert: Expert
    title: string
    description: string
    scheduledDate: string
    duration: string
    status: 'upcoming' | 'live' | 'completed'
    participants: number
    questionsAsked: number
    tags: string[]
}

interface Question {
    id: string
    author: string
    authorAvatar: string
    question: string
    answer?: string
    answeredBy?: Expert
    upvotes: number
    timestamp: string
    isAnswered: boolean
}

const EXPERTS: Expert[] = [
    {
        id: '1',
        name: 'გიორგი მაისურაძე',
        avatar: '🧠',
        title: 'AI Researcher',
        company: 'DeepMind',
        expertise: ['Machine Learning', 'NLP', 'ChatGPT'],
        rating: 4.9,
        answersCount: 156,
        verified: true,
        isOnline: true
    },
    {
        id: '2',
        name: 'ნინო ბერიძე',
        avatar: '👩‍💻',
        title: 'AI Product Manager',
        company: 'Google',
        expertise: ['AI Strategy', 'Product Development', 'Gemini'],
        rating: 4.8,
        answersCount: 89,
        verified: true,
        isOnline: false
    },
    {
        id: '3',
        name: 'დავით ხარაძე',
        avatar: '🎨',
        title: 'Creative AI Director',
        company: 'Midjourney',
        expertise: ['Generative Art', 'Midjourney', 'DALL-E'],
        rating: 4.9,
        answersCount: 234,
        verified: true,
        isOnline: true
    }
]

const SESSIONS: QASession[] = [
    {
        id: '1',
        expert: EXPERTS[0],
        title: 'ChatGPT მოწინავე ტექნიკები',
        description: 'ისწავლეთ როგორ გამოიყენოთ ChatGPT მაქსიმალური ეფექტურობით',
        scheduledDate: 'დღეს, 18:00',
        duration: '1 საათი',
        status: 'live',
        participants: 234,
        questionsAsked: 45,
        tags: ['ChatGPT', 'Prompts', 'Tips']
    },
    {
        id: '2',
        expert: EXPERTS[2],
        title: 'Midjourney v6: ყველაფერი რაც უნდა იცოდეთ',
        description: 'ახალი ფუნქციები, ხრიკები და საუკეთესო პრაქტიკები',
        scheduledDate: 'ხვალე, 15:00',
        duration: '45 წუთი',
        status: 'upcoming',
        participants: 156,
        questionsAsked: 23,
        tags: ['Midjourney', 'Art', 'Design']
    },
    {
        id: '3',
        expert: EXPERTS[1],
        title: 'AI ბიზნესში: რეალური კეისები',
        description: 'როგორ იყენებენ მსხვილი კომპანიები AI-ს',
        scheduledDate: '28 დეკემბერი',
        duration: '1.5 საათი',
        status: 'upcoming',
        participants: 89,
        questionsAsked: 12,
        tags: ['Business', 'Strategy', 'Case Study']
    }
]

const RECENT_QUESTIONS: Question[] = [
    {
        id: '1',
        author: 'ლუკა',
        authorAvatar: '👨‍🎓',
        question: 'რა განსხვავებაა GPT-4 და GPT-4 Turbo-ს შორის და რომელი უკეთ მუშაობს კოდზე?',
        answer: 'GPT-4 Turbo უფრო სწრაფია და იაფი, მაგრამ GPT-4 უფრო ზუსტია რთული ლოგიკისთვის. კოდისთვის ორივე კარგია, მაგრამ Turbo უკეთ მუშაობს დიდ კონტექსტებზე...',
        answeredBy: EXPERTS[0],
        upvotes: 45,
        timestamp: '2 საათის წინ',
        isAnswered: true
    },
    {
        id: '2',
        author: 'მარიამი',
        authorAvatar: '👩‍💼',
        question: 'როგორ შევქმნა კონსისტენტური პერსონაჟი Midjourney-ში?',
        answer: 'გამოიყენეთ --cref პარამეტრი character reference-ისთვის. ატვირთეთ პერსონაჟის სურათი და...',
        answeredBy: EXPERTS[2],
        upvotes: 67,
        timestamp: '5 საათის წინ',
        isAnswered: true
    },
    {
        id: '3',
        author: 'თორნიკე',
        authorAvatar: '🧑‍💻',
        question: 'Claude vs ChatGPT - რომელი უკეთ მუშაობს ანალიზისთვის?',
        upvotes: 23,
        timestamp: '1 დღის წინ',
        isAnswered: false
    }
]

export function ExpertQA() {
    const [activeTab, setActiveTab] = useState<'sessions' | 'questions' | 'experts'>('sessions')
    const [newQuestion, setNewQuestion] = useState('')
    const [subscribedSessions, setSubscribedSessions] = useState<string[]>([])

    const handleSubscribe = (sessionId: string) => {
        setSubscribedSessions(prev =>
            prev.includes(sessionId)
                ? prev.filter(id => id !== sessionId)
                : [...prev, sessionId]
        )
    }

    return (
        <div className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-4">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-emerald-300">ექსპერტების პანელი</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Expert <span className="text-gradient">Q&A Sessions</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        პირდაპირი კავშირი AI ექსპერტებთან - დასვით კითხვები და მიიღეთ პროფესიონალური პასუხები
                    </p>
                </div>

                {/* Live Banner */}
                {SESSIONS.some(s => s.status === 'live') && (
                    <div className="mb-8 bg-gradient-to-r from-red-600/20 via-red-500/10 to-red-600/20 rounded-2xl border border-red-500/30 p-6 relative overflow-hidden">
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <span className="text-red-400 font-semibold">LIVE NOW</span>
                        </div>

                        {SESSIONS.filter(s => s.status === 'live').map(session => (
                            <div key={session.id} className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                <div className="text-5xl">{session.expert.avatar}</div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-1">{session.title}</h3>
                                    <p className="text-zinc-400 text-sm mb-2">{session.description}</p>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <span className="text-zinc-400 flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {session.participants} მონაწილე
                                        </span>
                                        <span className="text-zinc-400 flex items-center gap-1">
                                            <MessageCircle className="w-4 h-4" />
                                            {session.questionsAsked} კითხვა
                                        </span>
                                    </div>
                                </div>
                                <Button className="bg-red-600 hover:bg-red-500 gap-2">
                                    <Video className="w-4 h-4" />
                                    შემოგვიერთდით
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {[
                        { id: 'sessions', label: 'სესიები', icon: Calendar, count: SESSIONS.length },
                        { id: 'questions', label: 'კითხვები', icon: MessageCircle, count: RECENT_QUESTIONS.length },
                        { id: 'experts', label: 'ექსპერტები', icon: Award, count: EXPERTS.length }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-zinc-700'
                                }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Sessions Tab */}
                {activeTab === 'sessions' && (
                    <div className="grid gap-4">
                        {SESSIONS.map((session) => (
                            <div
                                key={session.id}
                                className={`bg-zinc-900/50 rounded-xl border p-6 transition-all ${session.status === 'live'
                                        ? 'border-red-500/50 shadow-lg shadow-red-500/10'
                                        : 'border-zinc-800/50 hover:border-indigo-500/30'
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Expert Info */}
                                    <div className="flex items-start gap-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-xl bg-zinc-800 flex items-center justify-center text-3xl">
                                                {session.expert.avatar}
                                            </div>
                                            {session.expert.isOnline && (
                                                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900"></span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-white">{session.expert.name}</span>
                                                {session.expert.verified && (
                                                    <CheckCircle className="w-4 h-4 text-blue-400" />
                                                )}
                                            </div>
                                            <div className="text-sm text-zinc-400">{session.expert.title}</div>
                                            <div className="text-xs text-indigo-400">{session.expert.company}</div>
                                        </div>
                                    </div>

                                    {/* Session Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white mb-2">{session.title}</h3>
                                                <p className="text-sm text-zinc-400 mb-3">{session.description}</p>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {session.tags.map((tag) => (
                                                        <span key={tag} className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {session.scheduledDate}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {session.duration}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-4 h-4" />
                                                        {session.participants} დარეგისტრირებული
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                {session.status === 'live' ? (
                                                    <Button className="bg-red-600 hover:bg-red-500 gap-2">
                                                        <Video className="w-4 h-4" />
                                                        შესვლა
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant={subscribedSessions.includes(session.id) ? "outline" : "default"}
                                                        className={subscribedSessions.includes(session.id)
                                                            ? "border-green-500/50 text-green-400"
                                                            : "bg-indigo-600 hover:bg-indigo-500"
                                                        }
                                                        onClick={() => handleSubscribe(session.id)}
                                                    >
                                                        {subscribedSessions.includes(session.id) ? (
                                                            <>
                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                დარეგისტრირებული
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Calendar className="w-4 h-4 mr-2" />
                                                                რეგისტრაცია
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="sm" className="text-zinc-500">
                                                    <Share2 className="w-4 h-4 mr-2" />
                                                    გაზიარება
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Questions Tab */}
                {activeTab === 'questions' && (
                    <div className="space-y-6">
                        {/* Ask Question */}
                        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-6">
                            <h3 className="font-semibold text-white mb-4">დასვით კითხვა ექსპერტს</h3>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                    placeholder="თქვენი კითხვა AI-ის შესახებ..."
                                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                                />
                                <Button className="bg-indigo-600 hover:bg-indigo-500 gap-2">
                                    <Send className="w-4 h-4" />
                                    გაგზავნა
                                </Button>
                            </div>
                        </div>

                        {/* Questions List */}
                        <div className="space-y-4">
                            {RECENT_QUESTIONS.map((q) => (
                                <div key={q.id} className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-6">
                                    <div className="flex gap-4">
                                        <div className="text-2xl">{q.authorAvatar}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-medium text-white">{q.author}</span>
                                                <span className="text-xs text-zinc-500">{q.timestamp}</span>
                                                {q.isAnswered && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                                                        ✓ გაპასუხებული
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-white mb-4">{q.question}</p>

                                            {q.answer && q.answeredBy && (
                                                <div className="bg-zinc-800/50 rounded-lg p-4 border-l-2 border-indigo-500">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xl">{q.answeredBy.avatar}</span>
                                                        <span className="font-medium text-indigo-300">{q.answeredBy.name}</span>
                                                        <CheckCircle className="w-4 h-4 text-blue-400" />
                                                    </div>
                                                    <p className="text-zinc-300 text-sm">{q.answer}</p>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4 mt-4">
                                                <button className="flex items-center gap-1 text-zinc-500 hover:text-white transition-colors">
                                                    <ThumbsUp className="w-4 h-4" />
                                                    <span className="text-sm">{q.upvotes}</span>
                                                </button>
                                                <button className="flex items-center gap-1 text-zinc-500 hover:text-white transition-colors">
                                                    <Bookmark className="w-4 h-4" />
                                                </button>
                                                <button className="flex items-center gap-1 text-zinc-500 hover:text-white transition-colors">
                                                    <Share2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Experts Tab */}
                {activeTab === 'experts' && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {EXPERTS.map((expert) => (
                            <div key={expert.id} className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-6 hover:border-indigo-500/30 transition-all">
                                <div className="text-center mb-4">
                                    <div className="relative inline-block">
                                        <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-4xl mx-auto">
                                            {expert.avatar}
                                        </div>
                                        {expert.isOnline && (
                                            <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-zinc-900"></span>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-white mt-4 flex items-center justify-center gap-2">
                                        {expert.name}
                                        {expert.verified && <CheckCircle className="w-4 h-4 text-blue-400" />}
                                    </h3>
                                    <p className="text-sm text-zinc-400">{expert.title}</p>
                                    <p className="text-xs text-indigo-400">{expert.company}</p>
                                </div>

                                <div className="flex items-center justify-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < Math.floor(expert.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'}`}
                                        />
                                    ))}
                                    <span className="text-sm text-zinc-400 ml-1">{expert.rating}</span>
                                </div>

                                <div className="flex flex-wrap justify-center gap-2 mb-4">
                                    {expert.expertise.map((exp) => (
                                        <span key={exp} className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">
                                            {exp}
                                        </span>
                                    ))}
                                </div>

                                <div className="text-center text-sm text-zinc-500 mb-4">
                                    <span className="flex items-center justify-center gap-1">
                                        <MessageCircle className="w-4 h-4" />
                                        {expert.answersCount} პასუხი
                                    </span>
                                </div>

                                <Button className="w-full bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30">
                                    კითხვის დასმა
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
