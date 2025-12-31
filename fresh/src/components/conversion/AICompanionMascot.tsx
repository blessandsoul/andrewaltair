'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, MessageCircle, Sparkles, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

const MASCOT_RESPONSES: Record<string, string[]> = {
    greeting: [
        '👋 გამარჯობა! მე ვარ AI ასისტენტი. რით შემიძლია დაგეხმარო?',
        '🌟 მოგესალმები! მზად ვარ შენს კითხვებზე პასუხისთვის!',
    ],
    help: [
        '💡 შემიძლია დაგეხმარო AI ხელსაწყოების არჩევაში, გაკვეთილების პოვნაში, ან კვესტების დაწყებაში!',
    ],
    tools: [
        '🛠️ ჩვენ გვაქვს 1000+ AI ხელსაწყო! რომელი კატეგორია გაინტერესებს - ტექსტი, სურათები, ვიდეო თუ ხმა?',
    ],
    lessons: [
        '📚 მიკრო-გაკვეთილები 2 წუთიანი AI დროსია! დაიწყე "პრომპტის საფუძვლებით".',
    ],
    default: [
        '🤔 საინტერესო კითხვაა! დამიწერე მეტი დეტალი.',
        '✨ კარგი! მოდი ერთად ვიპოვოთ საუკეთესო გადაწყვეტა.',
    ],
};

function getResponse(input: string): string {
    const lower = input.toLowerCase();
    if (lower.includes('გამარჯობა') || lower.includes('hello') || lower.includes('hi')) {
        return MASCOT_RESPONSES.greeting[Math.floor(Math.random() * MASCOT_RESPONSES.greeting.length)];
    }
    if (lower.includes('დახმარება') || lower.includes('help')) {
        return MASCOT_RESPONSES.help[0];
    }
    if (lower.includes('ხელსაწყო') || lower.includes('tool')) {
        return MASCOT_RESPONSES.tools[0];
    }
    if (lower.includes('გაკვეთილ') || lower.includes('lesson')) {
        return MASCOT_RESPONSES.lessons[0];
    }
    return MASCOT_RESPONSES.default[Math.floor(Math.random() * MASCOT_RESPONSES.default.length)];
}

export default function AICompanionMascot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: '👋 გამარჯობა! მე ვარ შენი AI დამხმარე. რით შემიძლია დაგეხმარო დღეს?',
            isUser: false,
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate response delay
        setTimeout(() => {
            const response = getResponse(input);
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response,
                isUser: false,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, 800 + Math.random() * 500);
    };

    return (
        <>
            {/* Floating Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl flex items-center justify-center z-50"
                    >
                        <Bot className="w-8 h-8" />
                        <motion.div
                            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={cn(
                            "fixed z-50 bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col",
                            isMinimized
                                ? "bottom-6 right-6 w-72 h-14"
                                : "bottom-6 right-6 w-96 h-[500px]"
                        )}
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">AI ასისტენტი</h3>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                        <span className="text-xs text-gray-400">ონლაინ</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="p-1.5 text-gray-400 hover:text-white transition-colors"
                                >
                                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.map(message => (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn(
                                                "flex",
                                                message.isUser ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div className={cn(
                                                "max-w-[80%] p-3 rounded-2xl text-sm",
                                                message.isUser
                                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm"
                                                    : "bg-white/10 text-gray-200 rounded-bl-sm"
                                            )}>
                                                {message.text}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-white/10 p-3 rounded-2xl rounded-bl-sm">
                                                <div className="flex items-center gap-1">
                                                    <motion.div
                                                        className="w-2 h-2 bg-gray-400 rounded-full"
                                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                                        transition={{ repeat: Infinity, duration: 1 }}
                                                    />
                                                    <motion.div
                                                        className="w-2 h-2 bg-gray-400 rounded-full"
                                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                                    />
                                                    <motion.div
                                                        className="w-2 h-2 bg-gray-400 rounded-full"
                                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t border-white/10">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder="დაწერე შეკითხვა..."
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={!input.trim()}
                                            className={cn(
                                                "p-2.5 rounded-xl transition-all",
                                                input.trim()
                                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                                            )}
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
