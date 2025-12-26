'use client'

import { useState } from 'react'
import { BookOpen, Copy, ThumbsUp, Search, Filter, Plus, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Prompt {
    id: string
    title: string
    content: string
    category: string
    author: string
    likes: number
    uses: number
    liked?: boolean
}

const SAMPLE_PROMPTS: Prompt[] = [
    {
        id: '1',
        title: 'კრეატიული სტატიის დაწერა',
        content: 'დაწერე [თემა] სტატია, რომელიც იქნება ინფორმაციული და გასართობი. გამოიყენე მეტაფორები, კონკრეტული მაგალითები და პრაქტიკული რჩევები. სტატია უნდა იყოს 800-1000 სიტყვის.',
        category: 'ტექსტი',
        author: 'გიორგი მ.',
        likes: 234,
        uses: 1250
    },
    {
        id: '2',
        title: 'კოდის რეფაქტორინგი',
        content: 'გაანალიზე ეს კოდი და გააუმჯობესე: [კოდი]. გამოყოფილი უნდა იყოს: 1) რა პრობლემები გაქვს 2) გაუმჯობესებული ვერსია 3) რატომ არის უკეთესი 4) შესაძლო ოპტიმიზაციები.',
        category: 'პროგრამირება',
        author: 'ანა კ.',
        likes: 189,
        uses: 890
    },
    {
        id: '3',
        title: 'ლოგოს იდეები',
        content: 'შექმენი 5 ლოგოს კონცეფცია [კომპანიის სახელი] ბრენდისთვის. კომპანია მუშაობს [ინდუსტრია] სფეროში. თითოეული კონცეფციისთვის აღწერე: ფერები, ფორმები, სიმბოლიკა და შესაფერისი ფონტის ტიპი.',
        category: 'დიზაინი',
        author: 'თეა ბ.',
        likes: 156,
        uses: 678
    },
    {
        id: '4',
        title: 'ბიზნეს გეგმის ჩარჩო',
        content: 'შექმენი დეტალური ბიზნეს გეგმა [ბიზნეს იდეა]-თვის. მოიცავს: აღმასრულებელი შეჯამება, ბაზრის ანალიზი, კონკურენტები, მარკეტინგი, ფინანსური პროგნოზი 3 წლით, რისკები და შესაძლებლობები.',
        category: 'ბიზნესი',
        author: 'ლევან წ.',
        likes: 312,
        uses: 1567
    },
    {
        id: '5',
        title: 'ინტერვიუსთვის მომზადება',
        content: 'მომამზადე [პოზიცია] პოზიციაზე ინტერვიუსთვის. მომეცი: 10 ყველაზე გავრცელებული კითხვა პასუხებით, 5 კითხვა რომ დავსვა მე, და 3 რჩევა როგორ გამოვირჩე სხვებისგან.',
        category: 'კარიერა',
        author: 'მარიამ დ.',
        likes: 278,
        uses: 1123
    }
]

const CATEGORIES = ['ყველა', 'ტექსტი', 'პროგრამირება', 'დიზაინი', 'ბიზნესი', 'კარიერა', 'მარკეტინგი']

export function PromptLibrary() {
    const [prompts, setPrompts] = useState<Prompt[]>(SAMPLE_PROMPTS)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('ყველა')
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const filteredPrompts = prompts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.content.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = activeCategory === 'ყველა' || p.category === activeCategory
        return matchesSearch && matchesCategory
    })

    const handleCopy = async (prompt: Prompt) => {
        await navigator.clipboard.writeText(prompt.content)
        setCopiedId(prompt.id)
        setTimeout(() => setCopiedId(null), 2000)

        // Update uses count
        setPrompts(prev => prev.map(p =>
            p.id === prompt.id ? { ...p, uses: p.uses + 1 } : p
        ))
    }

    const handleLike = (id: string) => {
        setPrompts(prev => prev.map(p =>
            p.id === id
                ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked }
                : p
        ))
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">პრომპტების ბიბლიოთეკა</h3>
                            <p className="text-white/50 text-xs">საუკეთესო AI პრომპტები ერთ ადგილას</p>
                        </div>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600">
                        <Plus className="w-4 h-4 mr-1" />
                        დამატება
                    </Button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <Input
                        placeholder="მოძებნე პრომპტი..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-white/40"
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${activeCategory === category
                                    ? 'bg-violet-500 text-white'
                                    : 'bg-slate-800 text-white/60 hover:text-white'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Prompts List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredPrompts.map(prompt => (
                        <div key={prompt.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h4 className="text-white font-medium">{prompt.title}</h4>
                                    <p className="text-white/40 text-xs">{prompt.author} • {prompt.category}</p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleCopy(prompt)}
                                    className={copiedId === prompt.id ? 'text-emerald-400' : 'text-white/60 hover:text-white'}
                                >
                                    {copiedId === prompt.id ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                            კოპირებულია
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 mr-1" />
                                            კოპირება
                                        </>
                                    )}
                                </Button>
                            </div>

                            <p className="text-white/70 text-sm mb-3 line-clamp-2">{prompt.content}</p>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleLike(prompt.id)}
                                    className={`flex items-center gap-1 text-sm transition-colors ${prompt.liked ? 'text-rose-400' : 'text-white/40 hover:text-white'
                                        }`}
                                >
                                    <ThumbsUp className={`w-4 h-4 ${prompt.liked ? 'fill-current' : ''}`} />
                                    {prompt.likes}
                                </button>
                                <span className="text-white/40 text-sm">გამოყენება: {prompt.uses}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPrompts.length === 0 && (
                    <div className="text-center py-8">
                        <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                        <p className="text-white/50">პრომპტები ვერ მოიძებნა</p>
                    </div>
                )}
            </div>
        </div>
    )
}
