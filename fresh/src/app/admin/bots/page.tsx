'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TbRobot, TbPlus, TbEdit, TbTrash, TbSearch, TbCrown, TbLock, TbDeviceFloppy, TbX, TbStar, TbDatabase, TbDownload, TbEye, TbShield, TbClock, TbCheck, TbTrendingUp } from "react-icons/tb";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface AIBot {
    id: string;
    name: string;
    codename: string;
    version: string;
    description: string;
    shortDescription: string;
    category: string;
    tier: 'free' | 'premium' | 'private';
    price?: number;
    icon: string;
    color: string;
    features: string[];
    masterPrompt?: string;
    rating: number;
    downloads: number;
    likes: number;
    isRecentlyAdded?: boolean;
    isFeatured?: boolean;
    creator?: {
        name: string;
        avatar?: string;
        bio?: string;
        verified: boolean;
        totalSales: number;
        rating: number;
        responseTime?: string;
    };
    guarantees?: {
        moneyBack: number;
        freeUpdates: boolean;
        support: {
            type: string;
            responseTime: string;
            languages: string[];
        };
        warranty?: string;
    };
    stats?: {
        avgRating: number;
        totalReviews: number;
        successRate: number;
        completionRate: number;
        repeatPurchase: number;
    };
    updates?: {
        lastUpdated: string;
        changelog: Array<{
            version: string;
            date: string;
            changes: string[];
        }>;
        roadmap: string[];
    };
}

interface UserOption {
    id: string;
    username: string;
    fullName: string;
    bio: string;
    avatar: string;
    verified: boolean;
}

export default function AdminBotsPage() {
    const [bots, setBots] = useState<AIBot[]>([]);
    const [users, setUsers] = useState<UserOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedTier, setSelectedTier] = useState<string>('all');
    const [selectedBot, setSelectedBot] = useState<AIBot | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState<Partial<AIBot>>({
        name: '',
        codename: '',
        version: '1.0',
        description: '',
        shortDescription: '',
        category: 'all',
        tier: 'free',
        price: 0,
        icon: 'Bot',
        color: 'from-blue-500 to-cyan-500',
        features: [],
        masterPrompt: '',
        rating: 5.0,
        downloads: 0,
        likes: 0,
        isRecentlyAdded: false,
        isFeatured: false,
        creator: {
            name: '',
            avatar: '',
            bio: '',
            verified: false,
            totalSales: 0,
            rating: 5.0,
            responseTime: ''
        },
        guarantees: {
            moneyBack: 30,
            freeUpdates: true,
            support: {
                type: '24/7 ჩატი',
                responseTime: '< 2 საათი',
                languages: ['ქართული', 'English']
            },
            warranty: ''
        },
        stats: {
            avgRating: 4.5,
            totalReviews: 0,
            successRate: 95,
            completionRate: 90,
            repeatPurchase: 60
        },
        updates: {
            lastUpdated: '',
            changelog: [],
            roadmap: []
        }
    });

    useEffect(() => {
        fetchBots();
        fetchUsers();
    }, []);

    const fetchBots = async () => {
        try {
            const response = await fetch('/api/bots');
            const data = await response.json();
            setBots(Array.isArray(data.bots) ? data.bots : []);
        } catch (error) {
            console.error('Error fetching bots:', error);
            setBots([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users/list');
            const data = await response.json();
            setUsers(Array.isArray(data.users) ? data.users : []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        }
    };

    const handleEdit = (bot: AIBot) => {
        setSelectedBot(bot);
        setFormData(bot);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`/api/bots/${id}`, { method: 'DELETE' });
            setBots(bots.filter(b => b.id !== id));
            setShowDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting bot:', error);
        }
    };

    const handleSave = async () => {
        try {
            const url = selectedBot ? `/api/bots/${selectedBot.id}` : '/api/bots';
            const method = selectedBot ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchBots();
                setIsEditing(false);
                setSelectedBot(null);
            }
        } catch (error) {
            console.error('Error saving bot:', error);
        }
    };

    const handleSeed30 = async () => {
        if (!confirm('დარწმუნებული ხარ? ეს წაშლის ყველა არსებულ ბოტს და დაამატებს 30 ახალ დემო ბოტს!')) {
            return;
        }

        try {
            const response = await fetch('/api/bots/seed-30', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secret: 'seed-mongodb-2024' })
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                fetchBots();
            } else {
                alert('შეცდომა seed-ის დროს');
            }
        } catch (error) {
            console.error('Seed error:', error);
            alert('შეცდომა seed-ის დროს');
        }
    };

    const filteredBots = bots.filter(bot => {
        const matchesSearch = bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bot.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || bot.category === selectedCategory;
        const matchesTier = selectedTier === 'all' || bot.tier === selectedTier;
        return matchesSearch && matchesCategory && matchesTier;
    });

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">AI ბოტების მართვა</h1>
                    <p className="text-muted-foreground">დაამატე, შეცვალე ან წაშალე AI ბოტები</p>
                </div>

                {/* Filters */}
                <div className="mb-6 space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium text-foreground">კატეგორია:</span>
                        {['all', 'writing', 'coding', 'design', 'business', 'marketing'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat
                                        ? 'bg-violet-600 text-white'
                                        : 'bg-secondary hover:bg-secondary/80 text-foreground'
                                    }`}
                            >
                                {cat === 'all' ? 'ყველა' : cat === 'writing' ? 'წერა' : cat === 'coding' ? 'კოდირება' : cat === 'design' ? 'დიზაინი' : cat === 'business' ? 'ბიზნესი' : 'მარკეტინგი'}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium text-foreground">ტიპი:</span>
                        {['all', 'free', 'premium', 'private'].map((tier) => (
                            <button
                                key={tier}
                                onClick={() => setSelectedTier(tier)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedTier === tier
                                        ? 'bg-violet-600 text-white'
                                        : 'bg-secondary hover:bg-secondary/80 text-foreground'
                                    }`}
                            >
                                {tier === 'all' ? 'ყველა' : tier === 'free' ? 'უფასო' : tier === 'premium' ? 'პრემიუმი' : 'პირადი'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 relative">
                        <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="ძებნა..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSeed30}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium flex items-center gap-2"
                    >
                        <TbDatabase className="w-5 h-5" />
                        Seed 30 ბოტი
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            setSelectedBot(null);
                            setFormData({
                                name: '',
                                codename: '',
                                version: '1.0',
                                description: '',
                                shortDescription: '',
                                category: 'all',
                                tier: 'free',
                                price: 0,
                                icon: 'Bot',
                                color: 'from-blue-500 to-cyan-500',
                                features: [],
                                masterPrompt: '',
                                rating: 5.0,
                                downloads: 0,
                                likes: 0,
                                isRecentlyAdded: false,
                                isFeatured: false
                            });
                            setIsEditing(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
                    >
                        <TbPlus className="w-5 h-5" />
                        ახალი ბოტი
                    </motion.button>
                </div>

                {/* Bots Grid */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full mx-auto" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBots.map((bot) => (
                            <motion.div
                                key={bot.id}
                                layout
                                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${bot.color} rounded-xl flex items-center justify-center text-white`}>
                                            <TbRobot className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">{bot.name}</h3>
                                            <p className="text-xs text-muted-foreground">{bot.codename}</p>
                                        </div>
                                    </div>
                                    {bot.tier === 'premium' && (
                                        <TbCrown className="w-5 h-5 text-amber-500" />
                                    )}
                                    {bot.tier === 'private' && (
                                        <TbLock className="w-5 h-5 text-muted-foreground" />
                                    )}
                                </div>

                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {bot.shortDescription}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                    <div className="flex items-center gap-1">
                                        <TbStar className="w-3.5 h-3.5 fill-current text-yellow-500" />
                                        {bot.rating}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <TbDownload className="w-3.5 h-3.5" />
                                        {(bot.downloads / 1000).toFixed(1)}k
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <TbEye className="w-3.5 h-3.5" />
                                        {bot.likes}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleEdit(bot)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <TbEdit className="w-4 h-4" />
                                        რედაქტირება
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowDeleteConfirm(bot.id)}
                                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                    >
                                        <TbTrash className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Edit/Create Modal */}
                <AnimatePresence>
                    {isEditing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                            onClick={() => setIsEditing(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold">
                                            {selectedBot ? 'ბოტის რედაქტირება' : 'ახალი ბოტის დამატება'}
                                        </h2>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                        >
                                            <TbX className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                    {/* Basic Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                            <TbRobot className="w-5 h-5" />
                                            ძირითადი ინფორმაცია
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">სახელი *</label>
                                                <Input
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="მაგ: AICONTENT"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">კოდური სახელი *</label>
                                                <Input
                                                    value={formData.codename}
                                                    onChange={(e) => setFormData({ ...formData, codename: e.target.value })}
                                                    placeholder="მაგ: Agent Alpha V1.0"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">მოკლე აღწერა *</label>
                                            <Input
                                                value={formData.shortDescription}
                                                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                                placeholder="მოკლე აღწერა..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">სრული აღწერა *</label>
                                            <Textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                rows={3}
                                                placeholder="დეტალური აღწერა..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">კატეგორია *</label>
                                                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="content">კონტენტი</SelectItem>
                                                        <SelectItem value="mystic">მისტიკა</SelectItem>
                                                        <SelectItem value="business">ბიზნესი</SelectItem>
                                                        <SelectItem value="creative">კრეატიული</SelectItem>
                                                        <SelectItem value="translation">თარგმანი</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">ტიპი *</label>
                                                <Select value={formData.tier} onValueChange={(value: any) => setFormData({ ...formData, tier: value })}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="free">უფასო</SelectItem>
                                                        <SelectItem value="premium">პრემიუმი</SelectItem>
                                                        <SelectItem value="private">პირადი</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">ფასი (₾)</label>
                                                <Input
                                                    type="number"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">იკონა *</label>
                                            <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Bot">🤖 Bot</SelectItem>
                                                    <SelectItem value="MessageCircle">💬 MessageCircle</SelectItem>
                                                    <SelectItem value="TbSparkles">✨ TbSparkles</SelectItem>
                                                    <SelectItem value="TbTrendingUp">📈 TbTrendingUp</SelectItem>
                                                    <SelectItem value="TbPencil">✏️ TbPencil</SelectItem>
                                                    <SelectItem value="TbPalette">🎨 TbPalette</SelectItem>
                                                    <SelectItem value="Share2">🔄 Share2</SelectItem>
                                                    <SelectItem value="Brain">🧠 Brain</SelectItem>
                                                    <SelectItem value="TbBolt">⚡ TbBolt</SelectItem>
                                                    <SelectItem value="Crown">👑 Crown</SelectItem>
                                                    <SelectItem value="Heart">❤️ Heart</SelectItem>
                                                    <SelectItem value="Star">⭐ Star</SelectItem>
                                                    <SelectItem value="Rocket">🚀 Rocket</SelectItem>
                                                    <SelectItem value="Target">🎯 Target</SelectItem>
                                                    <SelectItem value="Gift">🎁 Gift</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">ფერი (Header Gradient) *</label>
                                            <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="from-blue-500 to-cyan-500">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                                                            <span>ლურჯი → ციანი</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="from-green-500 to-emerald-500">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded bg-gradient-to-r from-green-500 to-emerald-500"></div>
                                                            <span>მწვანე → ზურმუხტი</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="from-purple-500 to-pink-500">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded bg-gradient-to-r from-purple-500 to-pink-500"></div>
                                                            <span>იასამნისფერი → ვარდისფერი</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="from-pink-500 to-rose-500">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded bg-gradient-to-r from-pink-500 to-rose-500"></div>
                                                            <span>ვარდისფერი → ალუბლისფერი</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="from-indigo-500 to-blue-500">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                                                            <span>ინდიგო → ლურჯი</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="from-red-500 to-orange-500">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded bg-gradient-to-r from-red-500 to-orange-500"></div>
                                                            <span>წითელი → ნარინჯისფერი</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="from-yellow-500 to-amber-500">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded bg-gradient-to-r from-yellow-500 to-amber-500"></div>
                                                            <span>ყვითელი → ქარვისფერი</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="from-lime-500 to-green-500">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded bg-gradient-to-r from-lime-500 to-green-500"></div>
                                                            <span>ლაიმი → მწვანე</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="from-teal-500 to-cyan-500">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded bg-gradient-to-r from-teal-500 to-cyan-500"></div>
                                                            <span>ფირუზისფერი → ციანი</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="from-sky-500 to-blue-500">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded bg-gradient-to-r from-sky-500 to-blue-500"></div>
                                                            <span>ცისფერი → ლურჯი</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="from-violet-500 to-purple-500">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded bg-gradient-to-r from-violet-500 to-purple-500"></div>
                                                            <span>იისფერი → იასამნისფერი</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="from-fuchsia-500 to-pink-500">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded bg-gradient-to-r from-fuchsia-500 to-pink-500"></div>
                                                            <span>ფუქსია → ვარდისფერი</span>
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">მთავარი პრომპტი *</label>
                                            <Textarea
                                                value={formData.masterPrompt}
                                                onChange={(e) => setFormData({ ...formData, masterPrompt: e.target.value })}
                                                rows={6}
                                                className="font-mono text-sm"
                                                placeholder="შეიყვანე AI პრომპტი..."
                                            />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={formData.isRecentlyAdded}
                                                    onCheckedChange={(checked) => setFormData({ ...formData, isRecentlyAdded: checked as boolean })}
                                                />
                                                <span className="text-sm">ახალი</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={formData.isFeatured}
                                                    onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked as boolean })}
                                                />
                                                <span className="text-sm">რჩეული</span>
                                            </label>
                                        </div>

                                        {/* Bot Statistics */}
                                        <div className="space-y-4 pt-4 border-t">
                                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                                <TbTrendingUp className="w-5 h-5" />
                                                სტატისტიკა
                                            </h3>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">რეიტინგი</label>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="5"
                                                        value={formData.rating || 5.0}
                                                        onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">ჩამოტვირთვები</label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={formData.downloads || 0}
                                                        onChange={(e) => setFormData({ ...formData, downloads: Number(e.target.value) })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">მოწონებები</label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={formData.likes || 0}
                                                        onChange={(e) => setFormData({ ...formData, likes: Number(e.target.value) })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Creator Info */}
                                        <div className="space-y-4 pt-4 border-t">
                                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                                <TbShield className="w-5 h-5" />
                                                შემქმნელი
                                            </h3>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">აირჩიე მომხმარებელი *</label>
                                                <Select
                                                    value={formData.creator?.name || ''}
                                                    onValueChange={(value) => {
                                                        const selectedUser = users.find(u => u.fullName === value);
                                                        if (selectedUser) {
                                                            setFormData({
                                                                ...formData,
                                                                creator: {
                                                                    ...formData.creator!,
                                                                    name: selectedUser.fullName,
                                                                    bio: selectedUser.bio,
                                                                    avatar: selectedUser.avatar,
                                                                    verified: selectedUser.verified
                                                                }
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="აირჩიე მომხმარებელი..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {users.map((user) => (
                                                            <SelectItem key={user.id} value={user.fullName}>
                                                                <div className="flex items-center gap-2">
                                                                    <img
                                                                        src={user.avatar}
                                                                        alt={user.fullName}
                                                                        className="w-6 h-6 rounded-full"
                                                                    />
                                                                    <span>{user.fullName}</span>
                                                                    {user.verified && (
                                                                        <TbCheck className="w-4 h-4 text-blue-500" />
                                                                    )}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">გაყიდვები</label>
                                                    <Input
                                                        type="number"
                                                        value={formData.creator?.totalSales || 0}
                                                        onChange={(e) => setFormData({ ...formData, creator: { ...formData.creator!, totalSales: Number(e.target.value) } })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">რეიტინგი</label>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        value={formData.creator?.rating || 5.0}
                                                        onChange={(e) => setFormData({ ...formData, creator: { ...formData.creator!, rating: Number(e.target.value) } })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="flex items-center gap-2 mt-6">
                                                        <Checkbox
                                                            checked={formData.creator?.verified || false}
                                                            onCheckedChange={(checked) => setFormData({ ...formData, creator: { ...formData.creator!, verified: checked as boolean } })}
                                                        />
                                                        <span className="text-sm">გადამოწმებული</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Guarantees */}
                                        <div className="space-y-4 pt-4 border-t">
                                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                                <TbShield className="w-5 h-5" />
                                                გარანტიები
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">თანხის დაბრუნება (დღე)</label>
                                                    <Input
                                                        type="number"
                                                        value={formData.guarantees?.moneyBack || 30}
                                                        onChange={(e) => setFormData({ ...formData, guarantees: { ...formData.guarantees!, moneyBack: Number(e.target.value) } })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="flex items-center gap-2 mt-6">
                                                        <Checkbox
                                                            checked={formData.guarantees?.freeUpdates || true}
                                                            onCheckedChange={(checked) => setFormData({ ...formData, guarantees: { ...formData.guarantees!, freeUpdates: checked as boolean } })}
                                                        />
                                                        <span className="text-sm">უფასო განახლებები</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="p-6 bg-secondary/30 border-t border-border flex gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSave}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-colors"
                                    >
                                        <TbDeviceFloppy className="w-5 h-5" />
                                        შენახვა
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl font-medium transition-colors"
                                    >
                                        გაუქმება
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation */}
                <AnimatePresence>
                    {showDeleteConfirm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setShowDeleteConfirm(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                            >
                                <h3 className="text-xl font-bold text-foreground mb-2">ბოტის წაშლა</h3>
                                <p className="text-muted-foreground mb-6">დარწმუნებული ხარ, რომ გსურს ამ ბოტის წაშლა?</p>
                                <div className="flex gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleDelete(showDeleteConfirm)}
                                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        წაშლა
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowDeleteConfirm(null)}
                                        className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg font-medium transition-colors"
                                    >
                                        გაუქმება
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
