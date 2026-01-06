'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash, Copy, CheckCircle, Clock, Users } from "@phosphor-icons/react";

interface CodeData {
    code: string;
    type: 'full' | 'single-article';
    usageCount: number;
    maxUsage: number;
    createdAt: string;
    expiresAt: string;
    isExpired: boolean;
    isUsedUp: boolean;
}

export default function VibeCodesAdminPage() {
    const [codes, setCodes] = useState<CodeData[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCodeType, setNewCodeType] = useState<'full' | 'single-article'>('full');
    const [newCodeDuration, setNewCodeDuration] = useState(60); // minutes
    const [newCodeMaxUsage, setNewCodeMaxUsage] = useState(1);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    // Load codes
    const loadCodes = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/vibe-codes', { method: 'PATCH' });
            const data = await response.json();
            if (data.success) {
                setCodes(data.codes);
            }
        } catch (error) {
            console.error('Failed to load codes:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadCodes();
    }, []);

    // Create new code
    const handleCreateCode = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/vibe-codes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: newCodeType,
                    duration: newCodeDuration * 60 * 1000, // convert to milliseconds
                    maxUsage: newCodeMaxUsage
                })
            });

            const data = await response.json();
            if (data.success) {
                setShowCreateModal(false);
                loadCodes();
                // Auto-copy the new code
                navigator.clipboard.writeText(data.code);
                setCopiedCode(data.code);
                setTimeout(() => setCopiedCode(null), 3000);
            }
        } catch (error) {
            console.error('Failed to create code:', error);
        }
        setLoading(false);
    };

    // Delete code
    const handleDeleteCode = async (code: string) => {
        if (!confirm(`დარწმუნებული ხართ რომ გსურთ კოდის ${code} წაშლა?`)) return;

        setLoading(true);
        try {
            await fetch(`/api/vibe-codes?code=${code}`, { method: 'DELETE' });
            loadCodes();
        } catch (error) {
            console.error('Failed to delete code:', error);
        }
        setLoading(false);
    };

    // Copy code
    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const activeCodesCount = codes.filter(c => !c.isExpired && !c.isUsedUp).length;
    const totalUsage = codes.reduce((sum, c) => sum + c.usageCount, 0);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Vibe Coding - კოდების მართვა</h1>
                    <p className="text-gray-600">გენერირება და მონიტორინგი წვდომის კოდებისთვის</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">სულ კოდები</p>
                                <p className="text-3xl font-bold text-primary">{codes.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <CheckCircle size={24} className="text-primary" weight="duotone" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">აქტიური კოდები</p>
                                <p className="text-3xl font-bold text-green-600">{activeCodesCount}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                <Clock size={24} className="text-green-600" weight="duotone" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">სულ გამოყენება</p>
                                <p className="text-3xl font-bold text-blue-600">{totalUsage}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <Users size={24} className="text-blue-600" weight="duotone" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white font-medium hover:scale-105 transition-transform"
                    >
                        <Plus size={20} weight="bold" />
                        ახალი კოდის გენერაცია
                    </button>

                    <button
                        onClick={loadCodes}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'იტვირთება...' : 'განახლება'}
                    </button>
                </div>

                {/* Codes Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">კოდი</th>
                                    <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">ტიპი</th>
                                    <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">გამოყენება</th>
                                    <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">შექმნილია</th>
                                    <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">ვადა</th>
                                    <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">სტატუსი</th>
                                    <th className="text-right py-4 px-6 font-semibold text-sm text-gray-700">მოქმედებები</th>
                                </tr>
                            </thead>
                            <tbody>
                                {codes.map((code, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <code className="font-mono font-bold text-primary">{code.code}</code>
                                                <button
                                                    onClick={() => copyCode(code.code)}
                                                    className="text-gray-400 hover:text-primary transition-colors"
                                                >
                                                    {copiedCode === code.code ? (
                                                        <CheckCircle size={18} className="text-green-500" weight="fill" />
                                                    ) : (
                                                        <Copy size={18} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${code.type === 'full'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {code.type === 'full' ? 'სრული წვდომა' : '1 სტატია'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm">
                                                {code.usageCount} / {code.maxUsage}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {new Date(code.createdAt).toLocaleString('ka-GE')}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {new Date(code.expiresAt).toLocaleString('ka-GE')}
                                        </td>
                                        <td className="py-4 px-6">
                                            {code.isExpired ? (
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                    ვადაგასული
                                                </span>
                                            ) : code.isUsedUp ? (
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                                                    გამოყენებული
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    აქტიური
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => handleDeleteCode(code.code)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                <Trash size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Create TbCode Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full"
                        >
                            <h2 className="text-2xl font-bold mb-6">ახალი კოდის გენერაცია</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">კოდის ტიპი</label>
                                    <select
                                        value={newCodeType}
                                        onChange={(e) => setNewCodeType(e.target.value as 'full' | 'single-article')}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="full">სრული წვდომა (ყველა სტატია)</option>
                                        <option value="single-article">1 სტატია (15 წუთი)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">ხანგრძლივობა (წუთებში)</label>
                                    <input
                                        type="number"
                                        value={newCodeDuration}
                                        onChange={(e) => setNewCodeDuration(parseInt(e.target.value))}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        min="1"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {newCodeType === 'single-article' ? 'რეკომენდებული: 15 წუთი' : 'რეკომენდებული: 60 წუთი (1 საათი)'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">მაქსიმალური გამოყენება</label>
                                    <input
                                        type="number"
                                        value={newCodeMaxUsage}
                                        onChange={(e) => setNewCodeMaxUsage(parseInt(e.target.value))}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        min="1"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        რამდენჯერ შეიძლება კოდის გამოყენება
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleCreateCode}
                                    disabled={loading}
                                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white font-medium hover:scale-105 transition-transform disabled:opacity-50"
                                >
                                    {loading ? 'იქმნება...' : 'გენერაცია'}
                                </button>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition-colors"
                                >
                                    გაუქმება
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
