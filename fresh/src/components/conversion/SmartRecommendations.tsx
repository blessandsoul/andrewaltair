'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ExternalLink, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tool {
    id: string;
    name: string;
    description: string;
    category: string;
    matchScore: number;
    icon: string;
}

const RECOMMENDED_TOOLS: Tool[] = [
    { id: '1', name: 'ChatGPT', description: 'უნივერსალური AI ასისტენტი ტექსტისთვის', category: 'ტექსტი', matchScore: 98, icon: '🤖' },
    { id: '2', name: 'Midjourney', description: 'AI გამოსახულებების გენერატორი', category: 'სურათები', matchScore: 92, icon: '🎨' },
    { id: '3', name: 'Claude', description: 'ანალიტიკური AI დოკუმენტებისთვის', category: 'ტექსტი', matchScore: 89, icon: '📝' },
    { id: '4', name: 'ElevenLabs', description: 'AI ხმის გენერატორი', category: 'აუდიო', matchScore: 85, icon: '🔊' },
];

export default function SmartRecommendations() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">რეკომენდაციები</h2>
                    <p className="text-gray-400 text-sm">შენთვის შერჩეული AI ხელსაწყოები</p>
                </div>
            </div>

            <div className="space-y-3">
                {RECOMMENDED_TOOLS.map((tool, index) => (
                    <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/50 transition-all group cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-2xl shrink-0">
                                {tool.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-white">{tool.name}</h3>
                                    <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-gray-300">{tool.category}</span>
                                </div>
                                <p className="text-gray-400 text-sm truncate">{tool.description}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="flex items-center gap-1 text-purple-400 font-bold">
                                    <Zap className="w-4 h-4" />
                                    {tool.matchScore}%
                                </div>
                                <span className="text-xs text-gray-500">მატჩი</span>
                            </div>
                            <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-purple-400 transition-colors shrink-0" />
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="w-full py-3 border border-white/10 rounded-xl text-gray-300 hover:bg-white/5 transition-colors">
                ყველა ხელსაწყოს ნახვა →
            </button>
        </div>
    );
}
