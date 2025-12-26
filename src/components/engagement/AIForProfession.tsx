'use client'

import { useState } from 'react'
import { Briefcase, Sparkles, ChevronRight, Star, Zap, BookOpen, Play, ArrowRight, Check, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Profession {
    id: string
    name: string
    icon: string
    description: string
    color: string
    tools: AIToolRecommendation[]
    useCases: string[]
    skillLevel: 'beginner' | 'intermediate' | 'advanced'
}

interface AIToolRecommendation {
    id: string
    name: string
    icon: string
    category: string
    useCase: string
    rating: number
    isFree: boolean
    isPremium?: boolean
}

const PROFESSIONS: Profession[] = [
    {
        id: 'marketer',
        name: 'მარკეტოლოგი',
        icon: '📢',
        description: 'AI მარკეტინგის ავტომატიზაციისა და კონტენტისთვის',
        color: 'from-pink-600 to-rose-600',
        skillLevel: 'intermediate',
        useCases: [
            'სოციალური მედიის კონტენტი',
            'ემაილ კამპანიები',
            'SEO ოპტიმიზაცია',
            'რეკლამის ტექსტები',
            'ანალიტიკა და რეპორტინგი'
        ],
        tools: [
            { id: 'chatgpt', name: 'ChatGPT', icon: '🤖', category: 'ტექსტი', useCase: 'კოპირაიტინგი, იდეაცია', rating: 4.9, isFree: true },
            { id: 'canva', name: 'Canva AI', icon: '🎨', category: 'დიზაინი', useCase: 'სოციალური მედიის გრაფიკა', rating: 4.7, isFree: true },
            { id: 'jasper', name: 'Jasper', icon: '✍️', category: 'ტექსტი', useCase: 'მარკეტინგ კოპი', rating: 4.6, isFree: false, isPremium: true },
            { id: 'buffer', name: 'Buffer AI', icon: '📱', category: 'SMM', useCase: 'პოსტების დაგეგმვა', rating: 4.5, isFree: true },
            { id: 'surfer', name: 'Surfer SEO', icon: '🔍', category: 'SEO', useCase: 'SEO ანალიზი', rating: 4.7, isFree: false }
        ]
    },
    {
        id: 'designer',
        name: 'დიზაინერი',
        icon: '🎨',
        description: 'AI კრეატიული დიზაინისა და ვიზუალებისთვის',
        color: 'from-purple-600 to-violet-600',
        skillLevel: 'intermediate',
        useCases: [
            'კონცეფციის გენერაცია',
            'UI/UX პროტოტიპები',
            'ბრენდინგი და ლოგოები',
            'ილუსტრაციები',
            'ფოტო რედაქტირება'
        ],
        tools: [
            { id: 'midjourney', name: 'Midjourney', icon: '🖼️', category: 'გამოსახულება', useCase: 'კონცეფტ არტი', rating: 4.9, isFree: false, isPremium: true },
            { id: 'dalle', name: 'DALL-E 3', icon: '🎨', category: 'გამოსახულება', useCase: 'ილუსტრაციები', rating: 4.8, isFree: true },
            { id: 'figma', name: 'Figma AI', icon: '📐', category: 'UI/UX', useCase: 'დიზაინის ავტომატიზაცია', rating: 4.7, isFree: true },
            { id: 'remove', name: 'Remove.bg', icon: '✂️', category: 'ფოტო', useCase: 'ფონის წაშლა', rating: 4.6, isFree: true },
            { id: 'adobe', name: 'Adobe Firefly', icon: '🔥', category: 'გამოსახულება', useCase: 'გენერატიული AI', rating: 4.7, isFree: true }
        ]
    },
    {
        id: 'developer',
        name: 'დეველოპერი',
        icon: '💻',
        description: 'AI კოდის წერისა და დეველოპმენტისთვის',
        color: 'from-green-600 to-emerald-600',
        skillLevel: 'intermediate',
        useCases: [
            'კოდის გენერაცია',
            'დებაგინგი',
            'კოდის რევიუ',
            'დოკუმენტაცია',
            'ტესტების წერა'
        ],
        tools: [
            { id: 'copilot', name: 'GitHub Copilot', icon: '🤖', category: 'კოდი', useCase: 'კოდის ავტოკომპლიტი', rating: 4.8, isFree: false, isPremium: true },
            { id: 'cursor', name: 'Cursor', icon: '⚡', category: 'IDE', useCase: 'AI-პირველი IDE', rating: 4.9, isFree: true },
            { id: 'claude', name: 'Claude', icon: '🧠', category: 'ჩატბოტი', useCase: 'კოდის ანალიზი', rating: 4.8, isFree: true },
            { id: 'phind', name: 'Phind', icon: '🔍', category: 'ძებნა', useCase: 'კოდის ძებნა', rating: 4.5, isFree: true },
            { id: 'tabnine', name: 'Tabnine', icon: '📝', category: 'კოდი', useCase: 'AI ასისტენტი', rating: 4.4, isFree: true }
        ]
    },
    {
        id: 'writer',
        name: 'კოპირაიტერი',
        icon: '✍️',
        description: 'AI წერისა და კონტენტ შექმნისთვის',
        color: 'from-blue-600 to-indigo-600',
        skillLevel: 'beginner',
        useCases: [
            'ბლოგ პოსტები',
            'სტატიები და ესეები',
            'სოციალური მედია',
            'ემაილები',
            'სკრიპტები'
        ],
        tools: [
            { id: 'chatgpt', name: 'ChatGPT', icon: '🤖', category: 'ჩატბოტი', useCase: 'უნივერსალური წერა', rating: 4.9, isFree: true },
            { id: 'claude', name: 'Claude', icon: '🧠', category: 'ჩატბოტი', useCase: 'დიდი ტექსტები', rating: 4.8, isFree: true },
            { id: 'grammarly', name: 'Grammarly', icon: '📝', category: 'რედაქტირება', useCase: 'გრამატიკა', rating: 4.7, isFree: true },
            { id: 'copy', name: 'Copy.ai', icon: '✨', category: 'კოპირაიტი', useCase: 'მარკეტინგ ტექსტები', rating: 4.5, isFree: true },
            { id: 'notion', name: 'Notion AI', icon: '📓', category: 'დოკუმენტი', useCase: 'ნოუთების AI', rating: 4.6, isFree: false }
        ]
    },
    {
        id: 'entrepreneur',
        name: 'მეწარმე',
        icon: '💼',
        description: 'AI ბიზნესის მართვისა და განვითარებისთვის',
        color: 'from-amber-600 to-orange-600',
        skillLevel: 'intermediate',
        useCases: [
            'ბიზნეს გეგმები',
            'პრეზენტაციები',
            'მომხმარებლის მხარდაჭერა',
            'ფინანსური ანალიზი',
            'პროდუქტის განვითარება'
        ],
        tools: [
            { id: 'chatgpt', name: 'ChatGPT Plus', icon: '🤖', category: 'ასისტენტი', useCase: 'უნივერსალური', rating: 4.9, isFree: false, isPremium: true },
            { id: 'gamma', name: 'Gamma', icon: '📊', category: 'პრეზენტაცია', useCase: 'AI პრეზენტაციები', rating: 4.7, isFree: true },
            { id: 'intercom', name: 'Intercom AI', icon: '💬', category: 'მხარდაჭერა', useCase: 'ჩატბოტი', rating: 4.6, isFree: false },
            { id: 'zapier', name: 'Zapier AI', icon: '⚡', category: 'ავტომატიზაცია', useCase: 'ავტომატიზაცია', rating: 4.5, isFree: true },
            { id: 'otter', name: 'Otter.ai', icon: '🎙️', category: 'ტრანსკრიფცია', useCase: 'შეხვედრების ჩაწერა', rating: 4.6, isFree: true }
        ]
    },
    {
        id: 'student',
        name: 'სტუდენტი',
        icon: '🎓',
        description: 'AI სწავლებისა და კვლევისთვის',
        color: 'from-cyan-600 to-teal-600',
        skillLevel: 'beginner',
        useCases: [
            'კვლევა და ანალიზი',
            'ესეების წერა',
            'შენიშვნების ორგანიზება',
            'ენების სწავლა',
            'მათემატიკა და მეცნიერება'
        ],
        tools: [
            { id: 'perplexity', name: 'Perplexity', icon: '🔍', category: 'ძებნა', useCase: 'კვლევა', rating: 4.8, isFree: true },
            { id: 'claude', name: 'Claude', icon: '🧠', category: 'ჩატბოტი', useCase: 'ანალიზი', rating: 4.8, isFree: true },
            { id: 'notion', name: 'Notion AI', icon: '📓', category: 'ნოუთები', useCase: 'ორგანიზება', rating: 4.6, isFree: true },
            { id: 'quillbot', name: 'QuillBot', icon: '✏️', category: 'რედაქტირება', useCase: 'პარაფრაზირება', rating: 4.4, isFree: true },
            { id: 'duolingo', name: 'Duolingo', icon: '🦉', category: 'ენები', useCase: 'ენის სწავლა', rating: 4.7, isFree: true }
        ]
    }
]

export function AIForProfession() {
    const [selectedProfession, setSelectedProfession] = useState<Profession | null>(null)
    const [showAllTools, setShowAllTools] = useState(false)

    const displayedTools = selectedProfession
        ? (showAllTools ? selectedProfession.tools : selectedProfession.tools.slice(0, 3))
        : []

    return (
        <div className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-4">
                        <Briefcase className="w-4 h-4 text-amber-400" />
                        <span className="text-sm text-amber-300">პროფესიებისთვის</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        AI თქვენი <span className="text-gradient">პროფესიისთვის</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        აირჩიეთ თქვენი პროფესია და მიიღეთ პერსონალიზებული AI რეკომენდაციები
                    </p>
                </div>

                {/* Profession Selector */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                    {PROFESSIONS.map((profession) => (
                        <button
                            key={profession.id}
                            onClick={() => setSelectedProfession(profession)}
                            className={`p-5 rounded-xl border-2 text-center transition-all ${selectedProfession?.id === profession.id
                                    ? 'border-indigo-500 bg-indigo-500/10 scale-105'
                                    : 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50'
                                }`}
                        >
                            <div className="text-4xl mb-3">{profession.icon}</div>
                            <div className="font-medium text-white text-sm">{profession.name}</div>
                        </button>
                    ))}
                </div>

                {/* Selected Profession Content */}
                {selectedProfession && (
                    <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 overflow-hidden">
                        {/* Profession Header */}
                        <div className={`bg-gradient-to-r ${selectedProfession.color} p-8`}>
                            <div className="flex items-center gap-6">
                                <div className="text-6xl">{selectedProfession.icon}</div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{selectedProfession.name}</h3>
                                    <p className="text-white/80">{selectedProfession.description}</p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="px-3 py-1 rounded-full bg-white/20 text-sm text-white">
                                            {selectedProfession.skillLevel === 'beginner' ? '🌱 დამწყები' :
                                                selectedProfession.skillLevel === 'intermediate' ? '🌿 საშუალო' : '🌳 მოწინავე'}
                                        </span>
                                        <span className="text-sm text-white/80">
                                            {selectedProfession.tools.length} რეკომენდებული ინსტრუმენტი
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Use Cases */}
                                <div>
                                    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-yellow-400" />
                                        გამოყენების სფეროები
                                    </h4>
                                    <div className="space-y-2">
                                        {selectedProfession.useCases.map((useCase, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50">
                                                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                                                <span className="text-zinc-300">{useCase}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recommended Tools */}
                                <div>
                                    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-blue-400" />
                                        რეკომენდებული AI ხელსაწყოები
                                    </h4>
                                    <div className="space-y-3">
                                        {displayedTools.map((tool) => (
                                            <div key={tool.id} className="flex items-center gap-4 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 transition-all cursor-pointer group">
                                                <div className="text-3xl">{tool.icon}</div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-white">{tool.name}</span>
                                                        {tool.isPremium && (
                                                            <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
                                                                Premium
                                                            </span>
                                                        )}
                                                        {tool.isFree && !tool.isPremium && (
                                                            <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
                                                                უფასო
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-zinc-400">{tool.useCase}</div>
                                                </div>
                                                <div className="flex items-center gap-1 text-yellow-400">
                                                    <Star className="w-4 h-4 fill-yellow-400" />
                                                    <span className="text-sm">{tool.rating}</span>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                                            </div>
                                        ))}
                                    </div>

                                    {selectedProfession.tools.length > 3 && (
                                        <Button
                                            variant="outline"
                                            className="w-full mt-4 border-zinc-700"
                                            onClick={() => setShowAllTools(!showAllTools)}
                                        >
                                            {showAllTools ? 'ნაკლების ჩვენება' : `კიდევ ${selectedProfession.tools.length - 3} ინსტრუმენტის ნახვა`}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-center sm:text-left">
                                    <h4 className="font-semibold text-white">გსურთ სრული გზამკვლევი?</h4>
                                    <p className="text-sm text-zinc-400">მიიღეთ დეტალური ტუტორიალები თითოეული ინსტრუმენტისთვის</p>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" className="border-zinc-700 gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        სახელმძღვანელოები
                                    </Button>
                                    <Button className="bg-indigo-600 hover:bg-indigo-500 gap-2">
                                        <Play className="w-4 h-4" />
                                        ვიდეო კურსი
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!selectedProfession && (
                    <div className="text-center py-12 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
                        <div className="text-5xl mb-4">👆</div>
                        <h3 className="text-xl font-semibold text-white mb-2">აირჩიეთ თქვენი პროფესია</h3>
                        <p className="text-zinc-400">მიიღეთ პერსონალიზებული AI რეკომენდაციები</p>
                    </div>
                )}
            </div>
        </div>
    )
}
