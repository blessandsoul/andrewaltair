'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TbTrophy, TbTrendingUp, TbStar, TbQuote } from "react-icons/tb";

interface Testimonial {
    _id: string;
    name: string;
    company: string;
    avatar?: string;
    metric: string;
    improvement: string;
    testimonial: string;
    rating: number;
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
    { _id: '1', name: 'გიორგი კ.', company: 'ტექ სტარტაპი', avatar: '👨‍💼', metric: 'პროდუქტიულობა', improvement: '+65%', testimonial: 'AI ინსტრუმენტებმა სრულად შეცვალა ჩვენი მუშაობის სტილი.', rating: 5 },
    { _id: '2', name: 'ნინო მ.', company: 'მარკეტინგ ეიჯენსი', avatar: '👩‍💻', metric: 'კონტენტის წარმოება', improvement: '+3x', testimonial: 'თვეში 3-ჯერ მეტ კონტენტს ვაწარმოებთ იგივე გუნდით.', rating: 5 },
    { _id: '3', name: 'დავით ლ.', company: 'ელ-კომერცია', avatar: '👨‍🚀', metric: 'მომხმარებლის სერვისი', improvement: '-50% დრო', testimonial: 'AI ჩატბოტმა განახევრა მომხმარებელთა მომსახურების დრო.', rating: 5 },
    { _id: '4', name: 'მარიამ დ.', company: 'ფრილანსერი', avatar: '👩‍🎨', metric: 'შემოსავალი', improvement: '+40%', testimonial: 'AI ხელსაწყოებით პროექტებს უფრო სწრაფად ვასრულებ.', rating: 5 },
];

export default function ProofWall() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await fetch('/api/conversion/testimonials');
                if (res.ok) {
                    const data = await res.json();
                    setTestimonials(data.testimonials?.length > 0 ? data.testimonials : FALLBACK_TESTIMONIALS);
                } else {
                    setTestimonials(FALLBACK_TESTIMONIALS);
                }
            } catch {
                setTestimonials(FALLBACK_TESTIMONIALS);
            }
            setLoading(false);
        };
        fetchTestimonials();
    }, []);

    if (loading) return <div className="animate-pulse bg-white/5 h-64 rounded-2xl" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                    <TbTrophy className="w-6 h-6 text-green-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">შედეგების კედელი</h2>
                    <p className="text-gray-400 text-sm">რეალური შედეგები ჩვენი მომხმარებლებისგან</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {testimonials.map((result, index) => (
                    <motion.div
                        key={result._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center text-2xl">
                                    {result.avatar || '👤'}
                                </div>
                                <div>
                                    <div className="font-semibold text-white">{result.name}</div>
                                    <div className="text-gray-400 text-sm">{result.company}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-400">{result.improvement}</div>
                                <div className="text-xs text-gray-500">{result.metric}</div>
                            </div>
                        </div>

                        <div className="relative">
                            <TbQuote className="absolute -top-2 -left-1 w-6 h-6 text-purple-500/30" />
                            <p className="text-gray-300 text-sm italic pl-6">{result.testimonial}</p>
                        </div>

                        <div className="flex items-center gap-1 mt-4">
                            {[1, 2, 3, 4, 5].map(s => (
                                <TbStar key={s} className={`w-4 h-4 ${s <= result.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <TbTrendingUp className="w-6 h-6 text-green-400" />
                    <span className="text-white">შენც გინდა ასეთი შედეგები?</span>
                </div>
                <button className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium transition-colors">
                    დაიწყე დღეს
                </button>
            </div>
        </div>
    );
}
