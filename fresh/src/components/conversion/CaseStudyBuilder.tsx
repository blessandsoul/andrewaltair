'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Building2, TrendingUp, Download, Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const INDUSTRIES = [
    { id: 'ecommerce', label: 'ელ-კომერცია', icon: '🛒' },
    { id: 'finance', label: 'ფინანსები', icon: '💰' },
    { id: 'healthcare', label: 'ჯანდაცვა', icon: '🏥' },
    { id: 'education', label: 'განათლება', icon: '📚' },
    { id: 'marketing', label: 'მარკეტინგი', icon: '📣' },
    { id: 'manufacturing', label: 'წარმოება', icon: '🏭' },
];

const USE_CASES = [
    { id: 'customer-service', label: 'მომხმარებლის სერვისი', improvement: '60%' },
    { id: 'content-creation', label: 'კონტენტის შექმნა', improvement: '70%' },
    { id: 'data-analysis', label: 'მონაცემთა ანალიზი', improvement: '50%' },
    { id: 'process-automation', label: 'პროცესების ავტომატიზაცია', improvement: '80%' },
    { id: 'personalization', label: 'პერსონალიზაცია', improvement: '55%' },
];

export default function CaseStudyBuilder() {
    const [step, setStep] = useState(1);
    const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
    const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
    const [companySize, setCompanySize] = useState<string>('small');
    const [showResult, setShowResult] = useState(false);

    const toggleUseCase = (id: string) => {
        setSelectedUseCases(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            setShowResult(true);
        }
    };

    const industry = INDUSTRIES.find(i => i.id === selectedIndustry);
    const cases = USE_CASES.filter(c => selectedUseCases.includes(c.id));

    if (showResult) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">შენი AI კეისი</h2>
                        <p className="text-gray-400 text-sm">{industry?.label} სექტორისთვის</p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/20 to-purple-900/20"
                >
                    <div className="text-4xl mb-4">{industry?.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">
                        AI ტრანსფორმაცია: {industry?.label}
                    </h3>
                    <p className="text-gray-300 mb-6">
                        {companySize === 'small' ? 'მცირე' : companySize === 'medium' ? 'საშუალო' : 'დიდი'} ბიზნესისთვის
                    </p>

                    <div className="space-y-4 mb-6">
                        <h4 className="font-semibold text-white">გამოყენების სფეროები:</h4>
                        {cases.map(c => (
                            <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                <span className="text-gray-200">{c.label}</span>
                                <span className="text-green-400 font-bold">+{c.improvement} ეფექტურობა</span>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 rounded-xl bg-green-900/30 border border-green-500/30 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            <span className="font-semibold text-white">პროგნოზირებული შედეგი</span>
                        </div>
                        <p className="text-gray-300 text-sm">
                            სავარაუდო ROI: <span className="text-green-400 font-bold">250-400%</span> პირველ წელს
                        </p>
                    </div>

                    <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                        <Download className="w-5 h-5" />
                        PDF-ად ჩამოტვირთვა
                    </button>
                </motion.div>

                <button
                    onClick={() => { setShowResult(false); setStep(1); setSelectedIndustry(null); setSelectedUseCases([]); }}
                    className="w-full py-3 border border-white/10 rounded-xl text-gray-300 hover:bg-white/5 transition-colors"
                >
                    ახალი კეისი
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">კეის სტადის შემქმნელი</h2>
                    <p className="text-gray-400 text-sm">შექმენი პერსონალიზებული AI კეისი</p>
                </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2">
                {[1, 2, 3].map(s => (
                    <div
                        key={s}
                        className={cn(
                            "flex-1 h-1 rounded-full transition-colors",
                            s <= step ? "bg-purple-500" : "bg-gray-700"
                        )}
                    />
                ))}
            </div>

            {/* Step 1: Industry */}
            {step === 1 && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                >
                    <h3 className="text-lg font-medium text-white">აირჩიე ინდუსტრია</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {INDUSTRIES.map(ind => (
                            <button
                                key={ind.id}
                                onClick={() => setSelectedIndustry(ind.id)}
                                className={cn(
                                    "p-4 rounded-xl border transition-all text-center",
                                    selectedIndustry === ind.id
                                        ? "border-purple-500 bg-purple-500/20"
                                        : "border-white/10 bg-white/5 hover:border-white/20"
                                )}
                            >
                                <div className="text-2xl mb-2">{ind.icon}</div>
                                <div className="text-sm text-gray-200">{ind.label}</div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Step 2: Use Cases */}
            {step === 2 && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                >
                    <h3 className="text-lg font-medium text-white">აირჩიე გამოყენების სფეროები</h3>
                    <div className="space-y-2">
                        {USE_CASES.map(uc => (
                            <button
                                key={uc.id}
                                onClick={() => toggleUseCase(uc.id)}
                                className={cn(
                                    "w-full p-4 rounded-xl border transition-all flex items-center justify-between",
                                    selectedUseCases.includes(uc.id)
                                        ? "border-purple-500 bg-purple-500/20"
                                        : "border-white/10 bg-white/5 hover:border-white/20"
                                )}
                            >
                                <span className="text-gray-200">{uc.label}</span>
                                {selectedUseCases.includes(uc.id) && (
                                    <Check className="w-5 h-5 text-purple-400" />
                                )}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Step 3: Company Size */}
            {step === 3 && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                >
                    <h3 className="text-lg font-medium text-white">კომპანიის ზომა</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'small', label: 'მცირე', desc: '1-50' },
                            { id: 'medium', label: 'საშუალო', desc: '50-500' },
                            { id: 'large', label: 'დიდი', desc: '500+' },
                        ].map(size => (
                            <button
                                key={size.id}
                                onClick={() => setCompanySize(size.id)}
                                className={cn(
                                    "p-4 rounded-xl border transition-all text-center",
                                    companySize === size.id
                                        ? "border-purple-500 bg-purple-500/20"
                                        : "border-white/10 bg-white/5 hover:border-white/20"
                                )}
                            >
                                <div className="text-white font-medium">{size.label}</div>
                                <div className="text-xs text-gray-400">{size.desc} თანამშრომელი</div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Next Button */}
            <button
                onClick={handleNext}
                disabled={(step === 1 && !selectedIndustry) || (step === 2 && selectedUseCases.length === 0)}
                className={cn(
                    "w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all",
                    ((step === 1 && selectedIndustry) || (step === 2 && selectedUseCases.length > 0) || step === 3)
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                )}
            >
                {step === 3 ? 'კეისის შექმნა' : 'შემდეგი'}
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}
