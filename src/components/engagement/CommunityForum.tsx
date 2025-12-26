'use client'

import { useState } from 'react'
import { MessageCircle, ThumbsUp, Eye, Clock, Search, Filter, TrendingUp, Users, Star, ChevronRight, MessageSquare, Bookmark, Share2, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ForumTopic {
    id: string
    title: string
    author: string
    authorAvatar: string
    authorBadge: 'newbie' | 'contributor' | 'expert' | 'guru'
    category: string
    replies: number
    views: number
    likes: number
    lastActivity: string
    isPinned?: boolean
    isHot?: boolean
    isSolved?: boolean
    tags: string[]
    preview: string
}

const CATEGORIES = [
    { id: 'all', name: 'ყველა', icon: '📚', count: 156 },
    { id: 'chatgpt', name: 'ChatGPT', icon: '💬', count: 45 },
    { id: 'midjourney', name: 'Midjourney', icon: '🎨', count: 32 },
    { id: 'claude', name: 'Claude', icon: '🤖', count: 28 },
    { id: 'tips', name: 'Tips & Tricks', icon: '💡', count: 24 },
    { id: 'help', name: 'დახმარება', icon: '❓', count: 18 },
    { id: 'showcase', name: 'Showcase', icon: '🏆', count: 9 }
]

const TOPICS: ForumTopic[] = [
    {
        id: '1',
        title: 'როგორ დავწეროთ იდეალური პრომპტი ChatGPT-ში? 🚀',
        author: 'გიორგი',
        authorAvatar: '👨‍💻',
        authorBadge: 'guru',
        category: 'chatgpt',
        replies: 47,
        views: 1250,
        likes: 89,
        lastActivity: '5 წუთის წინ',
        isPinned: true,
        isHot: true,
        tags: ['პრომპტი', 'tips', 'beginner'],
        preview: 'გაზიარებას ვაპირებ ჩემს საუკეთესო ტექნიკებს პრომპტების წერაში...'
    },
    {
        id: '2',
        title: 'Midjourney v6 vs DALL-E 3 - რომელია უკეთესი?',
        author: 'ნინო',
        authorAvatar: '👩‍🎨',
        authorBadge: 'expert',
        category: 'midjourney',
        replies: 34,
        views: 890,
        likes: 56,
        lastActivity: '15 წუთის წინ',
        isHot: true,
        tags: ['comparison', 'images', 'review'],
        preview: 'ორივე გამოვცადე და გაზიარებას ვაპირებ ჩემს გამოცდილებას...'
    },
    {
        id: '3',
        title: 'Claude-ით დოკუმენტების ანალიზი - დამხმარე!',
        author: 'ლუკა',
        authorAvatar: '🧑‍💼',
        authorBadge: 'contributor',
        category: 'help',
        replies: 12,
        views: 234,
        likes: 8,
        lastActivity: '1 საათის წინ',
        isSolved: true,
        tags: ['claude', 'documents', 'help'],
        preview: 'დიდი PDF ფაილების ანალიზი მინდა, როგორ უკეთესად?'
    },
    {
        id: '4',
        title: 'ჩემი პირველი AI-გენერირებული ლოგო 🎨',
        author: 'თეო',
        authorAvatar: '🎨',
        authorBadge: 'newbie',
        category: 'showcase',
        replies: 23,
        views: 567,
        likes: 45,
        lastActivity: '2 საათის წინ',
        tags: ['showcase', 'logo', 'design'],
        preview: 'Midjourney-ით შევქმენი ჩემი компании ლოგო, რას ფიქრობთ?'
    },
    {
        id: '5',
        title: 'AI ავტომატიზაცია ბიზნესში - რეალური კეისი',
        author: 'დავით',
        authorAvatar: '💼',
        authorBadge: 'expert',
        category: 'tips',
        replies: 19,
        views: 445,
        likes: 67,
        lastActivity: '3 საათის წინ',
        tags: ['business', 'automation', 'case-study'],
        preview: 'როგორ დავზოგეთ კვირაში 20 საათი AI ინტეგრაციით...'
    }
]

const BADGE_STYLES = {
    newbie: { bg: 'bg-zinc-600', text: 'დამწყები' },
    contributor: { bg: 'bg-blue-600', text: 'კონტრიბუტორი' },
    expert: { bg: 'bg-purple-600', text: 'ექსპერტი' },
    guru: { bg: 'bg-gradient-to-r from-yellow-500 to-orange-500', text: 'გურუ' }
}

export function CommunityForum() {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [showNewTopicModal, setShowNewTopicModal] = useState(false)

    const filteredTopics = TOPICS.filter(topic => {
        const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory
        const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        return matchesCategory && matchesSearch
    })

    return (
        <div className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-4">
                        <Users className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm text-indigo-300">საზოგადოება</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        AI <span className="text-gradient">Community Forum</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        შეკითხვები, დისკუსიები და გამოცდილებების გაზიარება AI მოყვარულებთან ერთად
                    </p>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: MessageSquare, label: 'თემები', value: '156', color: 'text-blue-400' },
                        { icon: MessageCircle, label: 'პასუხები', value: '2.4K', color: 'text-green-400' },
                        { icon: Users, label: 'წევრები', value: '890', color: 'text-purple-400' },
                        { icon: TrendingUp, label: 'აქტიური დღეს', value: '45', color: 'text-orange-400' }
                    ].map((stat) => (
                        <div key={stat.label} className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-zinc-800 ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-white">{stat.value}</div>
                                <div className="text-xs text-zinc-500">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-64 space-y-6">
                        {/* New Topic Button */}
                        <Button
                            onClick={() => setShowNewTopicModal(true)}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                        >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            ახალი თემა
                        </Button>

                        {/* Categories */}
                        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 overflow-hidden">
                            <div className="p-4 border-b border-zinc-800/50">
                                <h3 className="font-semibold text-white flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-indigo-400" />
                                    კატეგორიები
                                </h3>
                            </div>
                            <div className="p-2">
                                {CATEGORIES.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${selectedCategory === category.id
                                                ? 'bg-indigo-600/20 text-indigo-300'
                                                : 'hover:bg-zinc-800/50 text-zinc-400'
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span>{category.icon}</span>
                                            <span className="text-sm">{category.name}</span>
                                        </span>
                                        <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded-full">
                                            {category.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Top Contributors */}
                        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 overflow-hidden">
                            <div className="p-4 border-b border-zinc-800/50">
                                <h3 className="font-semibold text-white flex items-center gap-2">
                                    <Award className="w-4 h-4 text-yellow-400" />
                                    ტოპ კონტრიბუტორები
                                </h3>
                            </div>
                            <div className="p-3 space-y-2">
                                {[
                                    { name: 'გიორგი', avatar: '👨‍💻', points: 2450 },
                                    { name: 'ნინო', avatar: '👩‍🎨', points: 1890 },
                                    { name: 'დავით', avatar: '💼', points: 1540 }
                                ].map((user, i) => (
                                    <div key={user.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors">
                                        <span className="text-lg font-bold text-zinc-500">#{i + 1}</span>
                                        <span className="text-xl">{user.avatar}</span>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-white">{user.name}</div>
                                            <div className="text-xs text-zinc-500">{user.points} XP</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="ძიება თემებში, თეგებში..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        {/* Topics List */}
                        <div className="space-y-3">
                            {filteredTopics.map((topic) => (
                                <div
                                    key={topic.id}
                                    className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-5 hover:border-indigo-500/30 transition-all cursor-pointer group"
                                >
                                    <div className="flex gap-4">
                                        {/* Author Avatar */}
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-2xl">
                                                {topic.authorAvatar}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    {/* Badges */}
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {topic.isPinned && (
                                                            <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400">📌 Pinned</span>
                                                        )}
                                                        {topic.isHot && (
                                                            <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400">🔥 Hot</span>
                                                        )}
                                                        {topic.isSolved && (
                                                            <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">✓ Solved</span>
                                                        )}
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                                                        {topic.title}
                                                    </h3>

                                                    {/* Preview */}
                                                    <p className="text-sm text-zinc-500 mt-1 line-clamp-1">
                                                        {topic.preview}
                                                    </p>

                                                    {/* Author & Meta */}
                                                    <div className="flex items-center gap-3 mt-3">
                                                        <span className="text-sm text-zinc-400">{topic.author}</span>
                                                        <span className={`text-xs px-2 py-0.5 rounded ${BADGE_STYLES[topic.authorBadge].bg}`}>
                                                            {BADGE_STYLES[topic.authorBadge].text}
                                                        </span>
                                                        <span className="text-xs text-zinc-600">•</span>
                                                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {topic.lastActivity}
                                                        </span>
                                                    </div>

                                                    {/* Tags */}
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {topic.tags.map((tag) => (
                                                            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Stats */}
                                                <div className="flex flex-col items-end gap-2 text-sm">
                                                    <div className="flex items-center gap-4">
                                                        <span className="flex items-center gap-1 text-zinc-500">
                                                            <MessageCircle className="w-4 h-4" />
                                                            {topic.replies}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-zinc-500">
                                                            <Eye className="w-4 h-4" />
                                                            {topic.views}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-zinc-500">
                                                            <ThumbsUp className="w-4 h-4" />
                                                            {topic.likes}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white">
                                                            <Bookmark className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white">
                                                            <Share2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More */}
                        <div className="text-center pt-4">
                            <Button variant="outline" className="border-zinc-700 text-zinc-400 hover:text-white">
                                მეტის ჩატვირთვა
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* New Topic Modal */}
                {showNewTopicModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-2xl w-full max-h-[80vh] overflow-auto">
                            <div className="p-6 border-b border-zinc-800">
                                <h3 className="text-xl font-bold text-white">ახალი თემის შექმნა</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">სათაური</label>
                                    <input
                                        type="text"
                                        placeholder="თქვენი კითხვა ან თემა..."
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">კატეგორია</label>
                                    <select className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500">
                                        {CATEGORIES.slice(1).map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">აღწერა</label>
                                    <textarea
                                        rows={5}
                                        placeholder="დეტალურად აღწერეთ თქვენი კითხვა..."
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">თეგები (comma separated)</label>
                                    <input
                                        type="text"
                                        placeholder="chatgpt, prompt, help..."
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setShowNewTopicModal(false)}>
                                    გაუქმება
                                </Button>
                                <Button className="bg-indigo-600 hover:bg-indigo-500">
                                    გამოქვეყნება
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
