'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { TbRobot, TbArrowLeft, TbSend, TbInfoCircle, TbSparkles, TbCheck, TbCrown, TbShield, TbBolt } from "react-icons/tb";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type BotCategory = 'all' | 'content' | 'mystic' | 'business' | 'creative' | 'translation';

interface PromptSubmission {
    promptName: string;
    category: BotCategory;
    description: string;
    masterPrompt: string;
    price: number;
    isForTrading: boolean;
    isForBusiness: boolean;
    isForMarketing: boolean;
    isForCoding: boolean;
    isForWriting: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// ADD BOT PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function AddBotPage() {
    const router = useRouter();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [promptSubmission, setPromptSubmission] = useState<PromptSubmission>({
        promptName: '',
        category: 'all',
        description: '',
        masterPrompt: '',
        price: 0,
        isForTrading: false,
        isForBusiness: false,
        isForMarketing: false,
        isForCoding: false,
        isForWriting: false
    });

    const handleSubmit = async () => {
        if (!promptSubmission.promptName || !promptSubmission.description || !promptSubmission.masterPrompt || promptSubmission.price <= 0) {
            toast.error('შეცდომა', 'გთხოვთ შეავსოთ ყველა სავალდებულო ველი და მიუთითოთ ფასი');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/bots/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(promptSubmission)
            });

            if (response.ok) {
                toast.success('წარმატებით გაიგზავნა!', 'შენი ბოტი გადამოწმების რეჟიმშია');
                router.push('/bots');
            } else {
                toast.error('შეცდომა', 'დაფიქსირდა შეცდომა, სცადეთ თავიდან');
            }
        } catch (error) {
            toast.error('შეცდომა', 'დაფიქსირდა შეცდომა, სცადეთ თავიდან');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-200/30 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-200/30 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto max-w-4xl px-4 py-12">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        href="/bots"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <TbArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>უკან ბოტებზე</span>
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200 mb-6">
                        <TbRobot className="w-5 h-5 text-violet-600" />
                        <span className="text-sm font-medium text-violet-700">ახალი ბოტის დამატება</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        გააზიარე შენი{' '}
                        <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                            AI ბოტი
                        </span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        შექმენი პროფესიონალური AI ბოტი და გაყიდე ჩვენს პლატფორმაზე. მიიღე შემოსავალი შენი შემოქმედებიდან!
                    </p>
                </motion.div>

                {/* Main Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card/80 backdrop-blur-sm border-2 border-border rounded-3xl overflow-hidden shadow-xl"
                >
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 p-6 text-white">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <TbSparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">ბოტის ინფორმაცია</h2>
                                <p className="text-violet-100 text-sm">შეავსე ყველა სავალდებულო ველი</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Body */}
                    <div className="p-8 space-y-6">
                        {/* Row 1: Name & Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-3">
                                    ბოტის სახელი <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={promptSubmission.promptName}
                                    onChange={(e) => setPromptSubmission({ ...promptSubmission, promptName: e.target.value })}
                                    className="w-full px-4 py-3 bg-secondary/50 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all text-foreground placeholder:text-muted-foreground"
                                    placeholder="მაგ: SEO სტატიის გენერატორი"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-3">
                                    ფასი (₾) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={promptSubmission.price}
                                    onChange={(e) => setPromptSubmission({ ...promptSubmission, price: Number(e.target.value) })}
                                    className="w-full px-4 py-3 bg-secondary/50 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all text-foreground placeholder:text-muted-foreground"
                                    placeholder="29"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-3">
                                კატეგორია <span className="text-red-500">*</span>
                            </label>
                            <Select
                                value={promptSubmission.category}
                                onValueChange={(value) => setPromptSubmission({ ...promptSubmission, category: value as BotCategory })}
                            >
                                <SelectTrigger className="w-full h-12 bg-secondary/50 border-2 border-border rounded-xl focus:ring-2 focus:ring-violet-500">
                                    <SelectValue placeholder="აირჩიეთ კატეგორია" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="content">კონტენტი</SelectItem>
                                    <SelectItem value="mystic">მისტიკა</SelectItem>
                                    <SelectItem value="business">ბიზნესი</SelectItem>
                                    <SelectItem value="creative">კრეატივი</SelectItem>
                                    <SelectItem value="translation">თარგმნა</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-3">
                                აღწერა <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={promptSubmission.description}
                                onChange={(e) => setPromptSubmission({ ...promptSubmission, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 bg-secondary/50 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all text-foreground placeholder:text-muted-foreground resize-none"
                                placeholder="მოკლედ აღწერე რას აკეთებს შენი ბოტი და რა სარგებელს მოუტანს მომხმარებელს..."
                            />
                        </div>

                        {/* Master Prompt */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-3">
                                მთავარი პრომპტი <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={promptSubmission.masterPrompt}
                                onChange={(e) => setPromptSubmission({ ...promptSubmission, masterPrompt: e.target.value })}
                                rows={8}
                                className="w-full px-4 py-3 bg-gradient-to-br from-violet-50/50 to-purple-50/50 border-2 border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all font-mono text-sm text-foreground placeholder:text-muted-foreground resize-none"
                                placeholder="შეიყვანე შენი AI პრომპტი აქ..."
                            />
                        </div>

                        {/* Use Cases */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-4">
                                გამოყენების სფერო
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                    { key: 'isForTrading', label: 'ტრეიდინგი', icon: '📈' },
                                    { key: 'isForBusiness', label: 'ბიზნესი', icon: '💼' },
                                    { key: 'isForMarketing', label: 'მარკეტინგი', icon: '📣' },
                                    { key: 'isForCoding', label: 'კოდირება', icon: '💻' },
                                    { key: 'isForWriting', label: 'წერა', icon: '✍️' },
                                ].map((item) => (
                                    <label
                                        key={item.key}
                                        className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${promptSubmission[item.key as keyof PromptSubmission]
                                                ? 'bg-violet-50 border-violet-300 shadow-sm'
                                                : 'bg-secondary/50 border-border hover:border-violet-200 hover:bg-secondary'
                                            }`}
                                    >
                                        <Checkbox
                                            checked={promptSubmission[item.key as keyof PromptSubmission] as boolean}
                                            onCheckedChange={(checked) => setPromptSubmission({ ...promptSubmission, [item.key]: checked as boolean })}
                                            className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                                        />
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="text-sm font-medium text-foreground">{item.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-5">
                            <div className="flex gap-4">
                                <div className="p-2 bg-blue-100 rounded-xl h-fit">
                                    <TbInfoCircle className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-blue-900 mb-2">რა ხდება გაგზავნის შემდეგ?</p>
                                    <ul className="space-y-1.5 text-sm text-blue-800">
                                        <li className="flex items-center gap-2">
                                            <TbCheck className="w-4 h-4 text-blue-600" />
                                            ადმინისტრაცია გადაამოწმებს შენს ბოტს
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <TbCheck className="w-4 h-4 text-blue-600" />
                                            დამტკიცების შემთხვევაში გამოქვეყნდება პლატფორმაზე
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <TbCheck className="w-4 h-4 text-blue-600" />
                                            ყოველი გაყიდვიდან მიიღებ შემოსავალს
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Footer */}
                    <div className="p-6 bg-secondary/30 border-t border-border flex flex-col sm:flex-row gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 hover:from-violet-700 hover:via-purple-700 hover:to-violet-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    იგზავნება...
                                </>
                            ) : (
                                <>
                                    <TbSend className="w-5 h-5" />
                                    გაგზავნა
                                </>
                            )}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/bots')}
                            className="px-8 py-4 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl font-medium transition-colors"
                        >
                            გაუქმება
                        </motion.button>
                    </div>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
                >
                    <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
                        <TbShield className="w-4 h-4 text-emerald-500" />
                        <span>უსაფრთხო პლატფორმა</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
                        <TbCrown className="w-4 h-4 text-amber-500" />
                        <span>70% შემოსავალი შენთვის</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
                        <TbBolt className="w-4 h-4 text-violet-500" />
                        <span>სწრაფი გადამოწმება</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
