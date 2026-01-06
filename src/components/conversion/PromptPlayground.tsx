'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TbPlayerPlay, TbLoader2, TbSparkles, TbCopy, TbCheck, TbRefresh } from "react-icons/tb";
import { cn } from '@/lib/utils';

const EXAMPLE_PROMPTS = [
    { label: 'კრეატიული წერა', prompt: 'დაწერე მოკლე ამბავი კოსმოსურ მოგზაურობაზე' },
    { label: 'კოდის დახმარება', prompt: 'დაწერე Python ფუნქცია რომელიც ითვლის ფიბონაჩის რიცხვებს' },
    { label: 'ბიზნეს იდეა', prompt: 'შემოგვთავაზე 3 AI სტარტაპ იდეა საქართველოში' },
    { label: 'მარკეტინგი', prompt: 'დაწერე Instagram პოსტი ახალი კაფეს გახსნისთვის' },
];

export default function PromptPlayground() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleRun = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setResponse('');

        // Simulate AI response (in production, call actual API)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate mock response
        const mockResponses: Record<string, string> = {
            default: `🤖 AI პასუხი თქვენს მოთხოვნაზე:\n\nშენი პრომპტი: "${prompt}"\n\nეს არის სადემონსტრაციო რეჟიმი. რეალურ გამოყენებაში აქ გამოჩნდება AI-ს პასუხი თქვენს კონკრეტულ მოთხოვნაზე.\n\n💡 რჩევა: კარგი პრომპტი უნდა იყოს:\n- კონკრეტული და დეტალური\n- აღწერდეს სასურველ ფორმატს\n- შეიცავდეს კონტექსტს`,
        };

        setResponse(mockResponses.default);
        setLoading(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(response);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        setPrompt('');
        setResponse('');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <TbSparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">პრომპტის სათამაშო</h2>
                    <p className="text-gray-400 text-sm">სცადე სხვადასხვა პრომპტები</p>
                </div>
            </div>

            {/* Quick Examples */}
            <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((example) => (
                    <button
                        key={example.label}
                        onClick={() => setPrompt(example.prompt)}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-gray-300 transition-colors"
                    >
                        {example.label}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div className="space-y-3">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="დაწერე შენი პრომპტი აქ..."
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                />

                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{prompt.length} სიმბოლო</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                        >
                            <TbRefresh className="w-4 h-4" />
                            გასუფთავება
                        </button>
                        <button
                            onClick={handleRun}
                            disabled={!prompt.trim() || loading}
                            className={cn(
                                "px-6 py-2 rounded-xl font-medium flex items-center gap-2 transition-all",
                                prompt.trim() && !loading
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                            )}
                        >
                            {loading ? (
                                <>
                                    <TbLoader2 className="w-4 h-4 animate-spin" />
                                    იტვირთება...
                                </>
                            ) : (
                                <>
                                    <TbPlayerPlay className="w-4 h-4" />
                                    გაშვება
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Response */}
            {response && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border border-white/10 bg-white/5"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-400">AI პასუხი</span>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                        >
                            {copied ? (
                                <>
                                    <TbCheck className="w-3 h-3 text-green-400" />
                                    <span className="text-green-400">დაკოპირდა!</span>
                                </>
                            ) : (
                                <>
                                    <TbCopy className="w-3 h-3" />
                                    კოპირება
                                </>
                            )}
                        </button>
                    </div>
                    <div className="text-gray-200 whitespace-pre-wrap text-sm">{response}</div>
                </motion.div>
            )}
        </div>
    );
}
