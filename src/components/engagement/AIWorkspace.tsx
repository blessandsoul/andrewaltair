'use client'

import { useState, useEffect } from 'react'
import { LayoutDashboard, Star, Clock, Trash2, ExternalLink, Plus, Grid3X3, List, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SavedTool {
    id: string
    name: string
    icon: string
    category: string
    url: string
    addedAt: string
    uses: number
}

interface RecentActivity {
    id: string
    action: string
    tool: string
    icon: string
    time: string
}

const SAMPLE_TOOLS: SavedTool[] = [
    { id: '1', name: 'ChatGPT', icon: '🤖', category: 'ჩატბოტი', url: 'https://chat.openai.com', addedAt: '2024-12-20', uses: 45 },
    { id: '2', name: 'Midjourney', icon: '🎨', category: 'სურათი', url: 'https://midjourney.com', addedAt: '2024-12-19', uses: 23 },
    { id: '3', name: 'Claude', icon: '🧠', category: 'ჩატბოტი', url: 'https://claude.ai', addedAt: '2024-12-18', uses: 31 },
    { id: '4', name: 'Notion AI', icon: '📝', category: 'პროდუქტიულობა', url: 'https://notion.so', addedAt: '2024-12-17', uses: 18 },
    { id: '5', name: 'GitHub Copilot', icon: '💻', category: 'კოდი', url: 'https://github.com/copilot', addedAt: '2024-12-16', uses: 52 },
    { id: '6', name: 'ElevenLabs', icon: '🎙️', category: 'აუდიო', url: 'https://elevenlabs.io', addedAt: '2024-12-15', uses: 12 }
]

const SAMPLE_ACTIVITY: RecentActivity[] = [
    { id: '1', action: 'გამოყენებულია', tool: 'ChatGPT', icon: '🤖', time: '5 წუთის წინ' },
    { id: '2', action: 'დამატებულია', tool: 'Suno AI', icon: '🎵', time: '2 საათის წინ' },
    { id: '3', action: 'გამოყენებულია', tool: 'Midjourney', icon: '🎨', time: '4 საათის წინ' },
    { id: '4', action: 'გამოყენებულია', tool: 'Claude', icon: '🧠', time: 'გუშინ' }
]

export function AIWorkspace() {
    const [tools, setTools] = useState<SavedTool[]>(SAMPLE_TOOLS)
    const [activity, setActivity] = useState<RecentActivity[]>(SAMPLE_ACTIVITY)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredTools = tools.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const removeTool = (id: string) => {
        setTools(prev => prev.filter(t => t.id !== id))
    }

    const useTool = (tool: SavedTool) => {
        // Update uses count
        setTools(prev => prev.map(t =>
            t.id === tool.id ? { ...t, uses: t.uses + 1 } : t
        ))

        // Add to activity
        setActivity(prev => [{
            id: Date.now().toString(),
            action: 'გამოყენებულია',
            tool: tool.name,
            icon: tool.icon,
            time: 'ახლახანს'
        }, ...prev].slice(0, 10))

        // Open URL
        window.open(tool.url, '_blank')
    }

    const totalUses = tools.reduce((sum, t) => sum + t.uses, 0)

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-4">
                {/* Main Workspace */}
                <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                                <LayoutDashboard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">ჩემი AI სივრცე</h3>
                                <p className="text-white/50 text-xs">{tools.length} ინსტრუმენტი • {totalUses} გამოყენება</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-indigo-500/20 text-indigo-400' : 'text-white/40 hover:text-white'}`}
                            >
                                <Grid3X3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-indigo-500/20 text-indigo-400' : 'text-white/40 hover:text-white'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <Input
                            placeholder="მოძებნე ინსტრუმენტი..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-white/40"
                        />
                    </div>

                    {/* Tools */}
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-3 gap-3">
                            {filteredTools.map(tool => (
                                <div
                                    key={tool.id}
                                    className="group relative p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/50 transition-all cursor-pointer"
                                    onClick={() => useTool(tool)}
                                >
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeTool(tool.id) }}
                                        className="absolute top-2 right-2 p-1 rounded-full bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                    <span className="text-3xl block mb-2">{tool.icon}</span>
                                    <h4 className="text-white font-medium text-sm">{tool.name}</h4>
                                    <p className="text-white/40 text-xs">{tool.uses} გამოყენება</p>
                                </div>
                            ))}
                            {/* Add New */}
                            <button className="p-4 bg-slate-800/30 rounded-xl border-2 border-dashed border-slate-700 hover:border-indigo-500/50 transition-colors flex flex-col items-center justify-center gap-2 text-white/40 hover:text-white">
                                <Plus className="w-6 h-6" />
                                <span className="text-xs">დამატება</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredTools.map(tool => (
                                <div
                                    key={tool.id}
                                    className="group flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/50 transition-all cursor-pointer"
                                    onClick={() => useTool(tool)}
                                >
                                    <span className="text-2xl">{tool.icon}</span>
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium">{tool.name}</h4>
                                        <p className="text-white/40 text-xs">{tool.category} • {tool.uses} გამოყენება</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white/60" />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeTool(tool.id) }}
                                        className="p-1 rounded-full text-white/20 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Quick Stats */}
                    <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-4">
                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-400" />
                            სტატისტიკა
                        </h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-white/60 text-sm">შენახული</span>
                                <span className="text-white font-medium">{tools.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60 text-sm">სულ გამოყენება</span>
                                <span className="text-white font-medium">{totalUses}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60 text-sm">ფავორიტი</span>
                                <span className="text-white font-medium">{tools.sort((a, b) => b.uses - a.uses)[0]?.name || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-4">
                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-indigo-400" />
                            ბოლო აქტივობა
                        </h4>
                        <div className="space-y-2">
                            {activity.slice(0, 5).map(act => (
                                <div key={act.id} className="flex items-center gap-2 text-sm">
                                    <span>{act.icon}</span>
                                    <span className="text-white/60">{act.action}</span>
                                    <span className="text-white">{act.tool}</span>
                                    <span className="text-white/30 text-xs ml-auto">{act.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
