'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TbX, TbRobot, TbUser, TbLoader2, TbAlertCircle, TbLock, TbMessage, TbCrown } from "react-icons/tb";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface DemoChatModalProps {
    bot: {
        id: string;
        name: string;
        codename: string;
        icon: string;
        color: string;
        tier: string;
        price?: number;
    };
    onClose: () => void;
    iconMap: Record<string, React.ReactNode>;
}

// All predefined questions - no free input allowed for security
const ALL_QUESTIONS = [
    // Introduction
    { text: "ვინ ხარ?", emoji: "👤", category: "intro" },
    { text: "რა შეგიძლია?", emoji: "✨", category: "intro" },
    { text: "როგორ მუშაობ?", emoji: "🤖", category: "intro" },
    // Capabilities
    { text: "დამეხმარე დაწყებაში", emoji: "🚀", category: "help" },
    { text: "მაჩვენე მაგალითი", emoji: "📝", category: "help" },
    { text: "რა არის შენი ძლიერი მხარე?", emoji: "💪", category: "capabilities" },
    { text: "რა ტიპის ამოცანებში გეხმარები?", emoji: "📋", category: "capabilities" },
    // Specific
    { text: "რა ენებზე მუშაობ?", emoji: "🌍", category: "specific" },
    { text: "რამდენად ზუსტი ხარ?", emoji: "🎯", category: "specific" },
    { text: "რა არის შენი ლიმიტები?", emoji: "⚠️", category: "specific" },
    // Fun
    { text: "მითხარი რაიმე საინტერესო", emoji: "💡", category: "fun" },
    { text: "გააკეთე ხუმრობა", emoji: "😄", category: "fun" },
    { text: "მომეცი მოტივაცია", emoji: "🔥", category: "motivation" },
    // Closing
    { text: "გმადლობთ!", emoji: "🙏", category: "closing" },
];

// Get random questions excluding already asked ones
function getRandomQuestions(askedQuestions: string[], count: number = 4): typeof ALL_QUESTIONS {
    const available = ALL_QUESTIONS.filter(q => !askedQuestions.includes(q.text));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

export function DemoChatModal({ bot, onClose, iconMap }: DemoChatModalProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [messagesRemaining, setMessagesRemaining] = useState(5);
    const [limitReached, setLimitReached] = useState(false);
    const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
    const [currentSuggestions, setCurrentSuggestions] = useState(getRandomQuestions([], 4));
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleQuestionClick = async (question: string) => {
        if (isLoading || limitReached) return;

        setError(null);
        setAskedQuestions(prev => [...prev, question]);

        // Add user message
        setMessages(prev => [...prev, { role: 'user', content: question }]);
        setIsLoading(true);

        try {
            const response = await fetch(`/api/bots/${bot.id}/demo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: question,
                    conversationHistory: messages.map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                })
            });

            const data = await response.json();

            if (data.limitReached) {
                setLimitReached(true);
                setError(data.message);
                return;
            }

            if (data.error) {
                setError(data.message || data.error);
                return;
            }

            // Add assistant response
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
            setMessagesRemaining(data.messagesRemaining || 0);

            // Update suggestions with new random questions
            setCurrentSuggestions(getRandomQuestions([...askedQuestions, question], 4));

            if (data.messagesRemaining === 0) {
                setLimitReached(true);
            }
        } catch (err) {
            setError('კავშირის შეცდომა. სცადეთ ხელახლა.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-lg h-[650px] max-h-[85vh] flex flex-col bg-background rounded-2xl shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`bg-gradient-to-br ${bot.color} p-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 backdrop-blur rounded-xl text-white">
                            {iconMap[bot.icon] || <TbRobot className="w-5 h-5" />}
                        </div>
                        <div className="text-white">
                            <h3 className="font-semibold">{bot.name}</h3>
                            <p className="text-white/80 text-xs flex items-center gap-1">
                                <TbMessage className="w-3 h-3" />
                                დემო რეჟიმი
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-white/80 text-xs bg-white/20 px-2 py-1 rounded-full">
                            {messagesRemaining} კითხვა დარჩა
                        </span>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
                        >
                            <TbX className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Demo Notice */}
                <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-amber-800 text-xs flex items-center gap-2">
                    <TbAlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>დემო ვერსია მხოლოდ წინასწარ განსაზღვრული კითხვებით. სრული ვერსიისთვის შეიძინეთ ბოტი.</span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                            <TbRobot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="font-medium">გამარჯობა! 👋</p>
                            <p className="text-sm mt-1">აირჩიეთ კითხვა ქვემოთ და ნახეთ როგორ მუშაობს {bot.name}</p>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`
                                max-w-[80%] px-4 py-3 rounded-2xl
                                ${msg.role === 'user'
                                    ? 'bg-violet-600 text-white rounded-br-md'
                                    : 'bg-secondary text-foreground rounded-bl-md'
                                }
                            `}>
                                <div className="flex items-start gap-2">
                                    {msg.role === 'assistant' && (
                                        <div className="p-1 bg-violet-100 rounded-lg mt-0.5">
                                            <TbRobot className="w-3 h-3 text-violet-600" />
                                        </div>
                                    )}
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    {msg.role === 'user' && (
                                        <div className="p-1 bg-white/20 rounded-lg mt-0.5">
                                            <TbUser className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="bg-secondary px-4 py-3 rounded-2xl rounded-bl-md">
                                <TbLoader2 className="w-5 h-5 animate-spin text-violet-600" />
                            </div>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Limit Reached Overlay */}
                {limitReached && (
                    <div className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center p-6 text-center">
                        <TbLock className="w-16 h-16 text-violet-600 mb-4" />
                        <h3 className="text-xl font-bold text-foreground mb-2">
                            დემო ლიმიტი ამოიწურა
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-sm">
                            თქვენ გამოიყენეთ ყველა უფასო კითხვა. სრული ვერსიისთვის შეიძინეთ ბოტი.
                        </p>
                        {bot.tier === 'premium' ? (
                            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium shadow-lg shadow-amber-500/20">
                                <TbCrown className="w-5 h-5" />
                                ყიდვა ${bot.price}
                            </button>
                        ) : (
                            <button
                                onClick={onClose}
                                className="px-6 py-3 rounded-xl bg-violet-600 text-white font-medium"
                            >
                                დახურვა
                            </button>
                        )}
                    </div>
                )}

                {/* Quick Questions - replaces free input */}
                {!limitReached && (
                    <div className="p-4 border-t border-border bg-secondary/30">
                        <p className="text-xs text-muted-foreground mb-3 text-center">აირჩიეთ კითხვა:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {currentSuggestions.map((suggestion, i) => (
                                <motion.button
                                    key={`${suggestion.text}-${i}`}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => handleQuestionClick(suggestion.text)}
                                    disabled={isLoading}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white hover:bg-violet-50 border border-border hover:border-violet-300 text-foreground text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                                >
                                    <span>{suggestion.emoji}</span>
                                    <span>{suggestion.text}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
