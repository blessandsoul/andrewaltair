'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, Clock, Tag, Bookmark, BookmarkCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsItem {
    id: string;
    title: string;
    source: string;
    category: string;
    timeAgo: string;
    image: string;
}

const NEWS: NewsItem[] = [
    { id: '1', title: 'OpenAI გამოუშვებს GPT-5-ს 2025 წელს', source: 'TechCrunch', category: 'LLM', timeAgo: '2 სთ', image: '🤖' },
    { id: '2', title: 'Google Gemini 2.0 - ახალი თაობა', source: 'The Verge', category: 'AI', timeAgo: '5 სთ', image: '🔮' },
    { id: '3', title: 'AI აგენტები: მომავლის ოფისი', source: 'Wired', category: 'ტრენდი', timeAgo: '8 სთ', image: '🚀' },
    { id: '4', title: 'Midjourney V7 - ახალი შესაძლებლობები', source: 'Ars Technica', category: 'გამოსახულება', timeAgo: '1 დ', image: '🎨' },
];

const CATEGORIES = ['ყველა', 'LLM', 'AI', 'გამოსახულება', 'ტრენდი'];

export default function AINewsCurator() {
    const [selectedCategory, setSelectedCategory] = useState('ყველა');
    const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

    const toggleBookmark = (id: string) => {
        setBookmarked(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const filteredNews = selectedCategory === 'ყველა'
        ? NEWS
        : NEWS.filter(n => n.category === selectedCategory);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Newspaper className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">AI სიახლეები</h2>
                    <p className="text-gray-400 text-sm">პერსონალიზებული AI ნიუს ფიდი</p>
                </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                            "px-3 py-1.5 rounded-full text-sm transition-all",
                            selectedCategory === cat
                                ? "bg-orange-500 text-white"
                                : "bg-white/5 text-gray-300 hover:bg-white/10"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* News List */}
            <div className="space-y-3">
                {filteredNews.map((news, index) => (
                    <motion.div
                        key={news.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-orange-500/30 transition-all group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-yellow-500/20 flex items-center justify-center text-2xl shrink-0">
                                {news.image}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-white group-hover:text-orange-300 transition-colors">{news.title}</h3>
                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                    <span>{news.source}</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {news.timeAgo}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        {news.category}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => toggleBookmark(news.id)}
                                    className="p-2 text-gray-500 hover:text-orange-400 transition-colors"
                                >
                                    {bookmarked.has(news.id) ? (
                                        <BookmarkCheck className="w-5 h-5 text-orange-400" />
                                    ) : (
                                        <Bookmark className="w-5 h-5" />
                                    )}
                                </button>
                                <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-orange-400 transition-colors" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
