'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TbX, TbSparkles, TbUser, TbMail, TbPhone, TbLoader2, TbCheck, TbBrandTelegram, TbBrandInstagram } from 'react-icons/tb';

interface PremiumRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    source: 'vibe-coding' | 'ai-2026' | 'encyclopedia' | 'other';
    sourcePage?: string; // Optional: specific page/article
}

export default function PremiumRequestModal({ isOpen, onClose, source, sourcePage }: PremiumRequestModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        social: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/premium-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    source,
                    sourcePage: sourcePage || window.location.pathname,
                    timestamp: new Date().toISOString()
                })
            });

            const data = await response.json();

            if (data.success) {
                setIsSuccess(true);
                setTimeout(() => {
                    onClose();
                    setIsSuccess(false);
                    setFormData({ name: '', email: '', phone: '', social: '' });
                }, 3000);
            } else {
                setError(data.error || 'დაფიქსირდა შეცდომა. სცადეთ თავიდან.');
            }
        } catch (err) {
            setError('კავშირის შეცდომა. სცადეთ თავიდან.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getSectionEmoji = () => {
        switch (source) {
            case 'vibe-coding': return '💜';
            case 'ai-2026': return '🚀';
            default: return '✨';
        }
    };

    const getSectionName = () => {
        switch (source) {
            case 'vibe-coding': return 'Vibe Coding';
            case 'ai-2026': return 'AI 2026';
            default: return 'ენციკლოპედია';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 
                                   md:max-w-md md:w-full bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden"
                    >
                        {/* Success State */}
                        {isSuccess ? (
                            <div className="p-8 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <TbCheck size={40} className="text-green-600" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">მოთხოვნა გაიგზავნა! 🎉</h2>
                                <p className="text-gray-600">
                                    მალე დაგიკავშირდებით ტელეგრამზე ან ელფოსტაზე
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-6 text-white">
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                    >
                                        <TbX size={20} />
                                    </button>
                                    <div className="flex items-center gap-3 mb-2">
                                        <TbSparkles size={28} />
                                        <h2 className="text-xl font-bold">პრემიუმის მიღება</h2>
                                    </div>
                                    <p className="text-white/90 text-sm">
                                        შეავსეთ ფორმა და მიიღეთ უფასო წვდომა {getSectionEmoji()} {getSectionName()}-ზე
                                    </p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            სახელი *
                                        </label>
                                        <div className="relative">
                                            <TbUser size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                placeholder="თქვენი სახელი"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            ელფოსტა *
                                        </label>
                                        <div className="relative">
                                            <TbMail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                required
                                                placeholder="example@email.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            ტელეფონი *
                                        </label>
                                        <div className="relative">
                                            <TbPhone size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                required
                                                placeholder="595 123 456"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Social Media */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            სოც. ქსელი <span className="text-gray-400 font-normal">(არასავალდებულო)</span>
                                        </label>
                                        <div className="relative">
                                            <TbBrandInstagram size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="@username ან ლინკი"
                                                value={formData.social}
                                                onChange={(e) => setFormData({ ...formData, social: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                            {error}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <TbLoader2 size={20} className="animate-spin" />
                                                იგზავნება...
                                            </>
                                        ) : (
                                            <>
                                                <TbBrandTelegram size={20} />
                                                მოთხოვნის გაგზავნა
                                            </>
                                        )}
                                    </button>

                                    <p className="text-xs text-gray-500 text-center">
                                        თქვენი მონაცემები დაცულია და არ გადაეცემა მესამე პირებს
                                    </p>
                                </form>
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
