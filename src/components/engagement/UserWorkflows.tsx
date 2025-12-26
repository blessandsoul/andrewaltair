'use client'

import { useState } from 'react'
import { Workflow, Share2, ThumbsUp, Eye, Clock, Copy, ChevronRight, Play, Download, Star, User, Zap, CheckCircle, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AIWorkflow {
    id: string
    title: string
    description: string
    author: string
    authorAvatar: string
    category: string
    tools: string[]
    steps: WorkflowStep[]
    likes: number
    uses: number
    views: number
    rating: number
    createdAt: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    estimatedTime: string
    tags: string[]
    isFeatured?: boolean
}

interface WorkflowStep {
    id: number
    tool: string
    action: string
    description: string
    icon: string
}

const CATEGORIES = [
    { id: 'all', name: 'ყველა', icon: '📚' },
    { id: 'content', name: 'კონტენტი', icon: '✍️' },
    { id: 'design', name: 'დიზაინი', icon: '🎨' },
    { id: 'coding', name: 'კოდინგი', icon: '💻' },
    { id: 'marketing', name: 'მარკეტინგი', icon: '📈' },
    { id: 'research', name: 'კვლევა', icon: '🔍' },
    { id: 'automation', name: 'ავტომატიზაცია', icon: '⚡' }
]

const WORKFLOWS: AIWorkflow[] = [
    {
        id: '1',
        title: 'ბლოგ პოსტის სრული ავტომატიზაცია',
        description: 'ChatGPT-ით იდეის გენერაცია, Claude-ით წერა, Midjourney-ით ილუსტრაცია',
        author: 'გიორგი',
        authorAvatar: '👨‍💻',
        category: 'content',
        tools: ['ChatGPT', 'Claude', 'Midjourney', 'Canva AI'],
        steps: [
            { id: 1, tool: 'ChatGPT', action: 'იდეაცია', description: '10 თემის გენერაცია ნიشაში', icon: '💡' },
            { id: 2, tool: 'Claude', action: 'კვლევა', description: 'თემის სიღრმისეული ანალიზი', icon: '🔍' },
            { id: 3, tool: 'ChatGPT', action: 'აუტლაინი', description: 'სტრუქტურის შექმნა', icon: '📝' },
            { id: 4, tool: 'Claude', action: 'წერა', description: 'სრული ტექსტის გენერაცია', icon: '✍️' },
            { id: 5, tool: 'Midjourney', action: 'ვიზუალი', description: 'თემატური ილუსტრაციები', icon: '🎨' },
            { id: 6, tool: 'Canva AI', action: 'დიზაინი', description: 'სოციალური მედიის გრაფიკა', icon: '📱' }
        ],
        likes: 234,
        uses: 567,
        views: 2340,
        rating: 4.8,
        createdAt: '2 დღის წინ',
        difficulty: 'intermediate',
        estimatedTime: '30 წუთი',
        tags: ['ბლოგი', 'კონტენტი', 'სოციალური'],
        isFeatured: true
    },
    {
        id: '2',
        title: 'Website-ის Full Design Pipeline',
        description: 'Wireframe-დან მზა დიზაინამდე AI-ით',
        author: 'ნინო',
        authorAvatar: '👩‍🎨',
        category: 'design',
        tools: ['ChatGPT', 'Midjourney', 'Figma AI', 'Framer'],
        steps: [
            { id: 1, tool: 'ChatGPT', action: 'UX Brief', description: 'მომხმარებლის მოთხოვნების ანალიზი', icon: '📋' },
            { id: 2, tool: 'Midjourney', action: 'Moodboard', description: 'ვიზუალური სტილის შექმნა', icon: '🎨' },
            { id: 3, tool: 'Figma AI', action: 'Wireframes', description: 'სტრუქტურის დიზაინი', icon: '📐' },
            { id: 4, tool: 'Midjourney', action: 'Assets', description: 'UI ელემენტების გენერაცია', icon: '🖼️' },
            { id: 5, tool: 'Framer', action: 'Prototype', description: 'ინტერაქტიული პროტოტიპი', icon: '🚀' }
        ],
        likes: 189,
        uses: 345,
        views: 1890,
        rating: 4.9,
        createdAt: '5 დღის წინ',
        difficulty: 'advanced',
        estimatedTime: '2 საათი',
        tags: ['დიზაინი', 'UI/UX', 'ვებ'],
        isFeatured: true
    },
    {
        id: '3',
        title: 'მარკეტინგ კამპანიის AI Stack',
        description: 'სრული მარკეტინგ ფაზელი AI-ს გამოყენებით',
        author: 'დავით',
        authorAvatar: '💼',
        category: 'marketing',
        tools: ['ChatGPT', 'Copy.ai', 'DALL-E', 'Buffer AI'],
        steps: [
            { id: 1, tool: 'ChatGPT', action: 'სტრატეგია', description: 'კამპანიის დაგეგმვა', icon: '📊' },
            { id: 2, tool: 'Copy.ai', action: 'კოპირაიტი', description: 'რეკლამის ტექსტები', icon: '✍️' },
            { id: 3, tool: 'DALL-E', action: 'ვიზუალი', description: 'რეკლამის გრაფიკა', icon: '🖼️' },
            { id: 4, tool: 'Buffer AI', action: 'პოსტინგი', description: 'ავტომატური გამოქვეყნება', icon: '📱' }
        ],
        likes: 156,
        uses: 289,
        views: 1450,
        rating: 4.7,
        createdAt: '1 კვირის წინ',
        difficulty: 'intermediate',
        estimatedTime: '1 საათი',
        tags: ['მარკეტინგი', 'სოციალური', 'ავტომატიზაცია']
    },
    {
        id: '4',
        title: 'კოდის რევიუ და რეფაქტორინგი AI-ით',
        description: 'GitHub Copilot + Claude კოდის გაუმჯობესებისთვის',
        author: 'ლუკა',
        authorAvatar: '🧑‍💻',
        category: 'coding',
        tools: ['GitHub Copilot', 'Claude', 'ChatGPT'],
        steps: [
            { id: 1, tool: 'Claude', action: 'ანალიზი', description: 'კოდის სტრუქტურის შეფასება', icon: '🔍' },
            { id: 2, tool: 'ChatGPT', action: 'რევიუ', description: 'პრობლემების იდენტიფიკაცია', icon: '🐛' },
            { id: 3, tool: 'GitHub Copilot', action: 'რეფაქტორი', description: 'კოდის გაუმჯობესება', icon: '⚡' },
            { id: 4, tool: 'Claude', action: 'ტესტები', description: 'ტესტების გენერაცია', icon: '✅' }
        ],
        likes: 198,
        uses: 412,
        views: 2100,
        rating: 4.8,
        createdAt: '3 დღის წინ',
        difficulty: 'advanced',
        estimatedTime: '45 წუთი',
        tags: ['კოდი', 'დეველოპმენტი', 'ავტომატიზაცია']
    }
]

const DIFFICULTY_STYLES = {
    beginner: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'დამწყები' },
    intermediate: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'საშუალო' },
    advanced: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'მოწინავე' }
}

export function UserWorkflows() {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)

    const filteredWorkflows = WORKFLOWS.filter(workflow =>
        selectedCategory === 'all' || workflow.category === selectedCategory
    )

    const handleCopyWorkflow = (workflowId: string) => {
        // Copy to clipboard logic
        alert('Workflow copied to clipboard!')
    }

    return (
        <div className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 mb-4">
                        <Workflow className="w-4 h-4 text-violet-400" />
                        <span className="text-sm text-violet-300">სამუშაო პროცესები</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        User <span className="text-gradient">AI Workflows</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        აღმოაჩინე და გააზიარე AI სამუშაო პროცესები — შენი საყვარელი ინსტრუმენტების კომბინაციები
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                    {/* Categories */}
                    <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${selectedCategory === category.id
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800'
                                    }`}
                            >
                                <span>{category.icon}</span>
                                {category.name}
                            </button>
                        ))}
                    </div>

                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Workflow-ის შექმნა
                    </Button>
                </div>

                {/* Featured Workflows */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        რჩეული Workflows
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredWorkflows.filter(w => w.isFeatured).map((workflow) => (
                            <div
                                key={workflow.id}
                                className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl border border-indigo-500/30 p-6 hover:border-indigo-400/50 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${DIFFICULTY_STYLES[workflow.difficulty].bg} ${DIFFICULTY_STYLES[workflow.difficulty].text}`}>
                                                {DIFFICULTY_STYLES[workflow.difficulty].label}
                                            </span>
                                            <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {workflow.estimatedTime}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white">{workflow.title}</h3>
                                        <p className="text-zinc-400 text-sm mt-1">{workflow.description}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-400">
                                        <Star className="w-4 h-4 fill-yellow-400" />
                                        <span className="text-sm">{workflow.rating}</span>
                                    </div>
                                </div>

                                {/* Tools Used */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {workflow.tools.map((tool) => (
                                        <span key={tool} className="text-xs px-3 py-1 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700">
                                            {tool}
                                        </span>
                                    ))}
                                </div>

                                {/* Steps Preview */}
                                <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                                    {workflow.steps.slice(0, 4).map((step, i) => (
                                        <div key={step.id} className="flex items-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xl">
                                                    {step.icon}
                                                </div>
                                                <span className="text-xs text-zinc-500 mt-1">{step.tool}</span>
                                            </div>
                                            {i < workflow.steps.length - 1 && i < 3 && (
                                                <ArrowRight className="w-4 h-4 text-zinc-600 mx-2" />
                                            )}
                                        </div>
                                    ))}
                                    {workflow.steps.length > 4 && (
                                        <span className="text-xs text-zinc-500">+{workflow.steps.length - 4} more</span>
                                    )}
                                </div>

                                {/* Author & Stats */}
                                <div className="flex items-center justify-between pt-4 border-t border-zinc-700/50">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{workflow.authorAvatar}</span>
                                        <span className="text-sm text-zinc-400">{workflow.author}</span>
                                        <span className="text-xs text-zinc-600">•</span>
                                        <span className="text-xs text-zinc-500">{workflow.createdAt}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                                        <span className="flex items-center gap-1">
                                            <ThumbsUp className="w-4 h-4" />
                                            {workflow.likes}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Play className="w-4 h-4" />
                                            {workflow.uses}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 mt-4">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-zinc-700 hover:bg-zinc-800"
                                        onClick={() => setExpandedWorkflow(expandedWorkflow === workflow.id ? null : workflow.id)}
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        {expandedWorkflow === workflow.id ? 'დამალვა' : 'ნაბიჯების ნახვა'}
                                    </Button>
                                    <Button
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-500"
                                        onClick={() => handleCopyWorkflow(workflow.id)}
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        კოპირება
                                    </Button>
                                </div>

                                {/* Expanded Steps */}
                                {expandedWorkflow === workflow.id && (
                                    <div className="mt-4 pt-4 border-t border-zinc-700/50">
                                        <h4 className="text-sm font-semibold text-white mb-3">დეტალური ნაბიჯები:</h4>
                                        <div className="space-y-3">
                                            {workflow.steps.map((step, i) => (
                                                <div key={step.id} className="flex items-start gap-3 bg-zinc-800/50 rounded-lg p-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                                                        {i + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg">{step.icon}</span>
                                                            <span className="font-medium text-white">{step.tool}</span>
                                                            <span className="text-xs text-zinc-500">→</span>
                                                            <span className="text-sm text-indigo-300">{step.action}</span>
                                                        </div>
                                                        <p className="text-sm text-zinc-400 mt-1">{step.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* All Workflows */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">ყველა Workflow</h3>
                    <div className="grid gap-4">
                        {filteredWorkflows.filter(w => !w.isFeatured).map((workflow) => (
                            <div
                                key={workflow.id}
                                className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-5 hover:border-violet-500/30 transition-all"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${DIFFICULTY_STYLES[workflow.difficulty].bg} ${DIFFICULTY_STYLES[workflow.difficulty].text}`}>
                                                {DIFFICULTY_STYLES[workflow.difficulty].label}
                                            </span>
                                            <span className="text-xs text-zinc-500">{workflow.estimatedTime}</span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">{workflow.title}</h3>
                                        <p className="text-sm text-zinc-400 mt-1">{workflow.description}</p>

                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {workflow.tools.map((tool) => (
                                                <span key={tool} className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                                            <span className="flex items-center gap-1">
                                                <ThumbsUp className="w-4 h-4" />
                                                {workflow.likes}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Play className="w-4 h-4" />
                                                {workflow.uses}
                                            </span>
                                            <span className="flex items-center gap-1 text-yellow-400">
                                                <Star className="w-4 h-4 fill-yellow-400" />
                                                {workflow.rating}
                                            </span>
                                        </div>
                                        <Button variant="outline" className="border-zinc-700">
                                            <Eye className="w-4 h-4 mr-2" />
                                            ნახვა
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-2xl w-full max-h-[80vh] overflow-auto">
                            <div className="p-6 border-b border-zinc-800">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Workflow className="w-5 h-5 text-violet-400" />
                                    ახალი Workflow-ის შექმნა
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">სახელი</label>
                                    <input
                                        type="text"
                                        placeholder="Workflow-ის სახელი..."
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">აღწერა</label>
                                    <textarea
                                        rows={3}
                                        placeholder="რას აკეთებს ეს workflow..."
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">კატეგორია</label>
                                    <select className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-violet-500">
                                        {CATEGORIES.slice(1).map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">AI ინსტრუმენტები (comma separated)</label>
                                    <input
                                        type="text"
                                        placeholder="ChatGPT, Claude, Midjourney..."
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                                    />
                                </div>
                            </div>
                            <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                                    გაუქმება
                                </Button>
                                <Button className="bg-violet-600 hover:bg-violet-500">
                                    შექმნა
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
