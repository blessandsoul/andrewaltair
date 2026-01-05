'use client';

import { motion } from 'framer-motion';
import {
    Lock,
    TelegramLogo,
    Sparkle,
    Clock,
    Users,
    Star,
    Trophy,
    Share,
    Gift,
    ChartLine,
    CheckCircle,
    X,
    Fire
} from "@phosphor-icons/react";
import { useState, useEffect } from 'react';

// 1. Preview/Blur Effect Component
export function ArticlePreview({
    content,
    isLocked,
    onUnlock
}: {
    content: string;
    isLocked: boolean;
    onUnlock: () => void;
}) {
    if (!isLocked) return null;

    const lines = content.split('\n');
    const previewLines = lines.slice(0, Math.floor(lines.length * 0.2));
    const previewText = previewLines.join('\n');

    return (
        <div className="relative">
            <div className="relative z-10">
                {previewText}
            </div>
            <div className="absolute inset-0 top-32 bg-gradient-to-b from-transparent via-white/80 to-white z-20 backdrop-blur-sm" />
            <div className="relative z-30 mt-8 text-center py-12">
                <Lock size={48} className="mx-auto text-primary mb-4" weight="duotone" />
                <h3 className="text-2xl font-bold mb-2">🔒 გააგრძელე კითხვა</h3>
                <p className="text-muted-foreground mb-6">დარჩა კიდევ 80% ექსკლუზიური კონტენტი</p>
                <button
                    onClick={onUnlock}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white font-medium hover:scale-105 transition-transform"
                >
                    გახსნა ახლავე
                </button>
            </div>
        </div>
    );
}

// 2. Social Proof Statistics
export function SocialProofStats() {
    const [stats, setStats] = useState({
        totalUsers: 2847,
        rating: 4.9,
        lastHourUsers: 156
    });

    return (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Users size={24} className="text-primary" weight="duotone" />
                სოციალური დამადასტურება
            </h3>
            <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{stats.totalUsers.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mt-1">აქტიური მომხმარებელი</div>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-bold text-primary flex items-center justify-center gap-1">
                        {stats.rating} <Star size={20} weight="fill" className="text-yellow-500" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">საშუალო შეფასება</div>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{stats.lastHourUsers}</div>
                    <div className="text-xs text-muted-foreground mt-1">ბოლო საათში</div>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-purple-200">
                <p className="text-sm text-muted-foreground italic">
                    💬 "საუკეთესო Vibe Coding რესურსი ქართულ ენაზე" - გიორგი მ.
                </p>
            </div>
        </div>
    );
}

// 3. Urgency TbClock Component
export function UrgencyTimer() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 23,
        minutes: 45,
        seconds: 12
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;
                seconds--;
                if (seconds < 0) {
                    seconds = 59;
                    minutes--;
                }
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                }
                if (hours < 0) {
                    hours = 23;
                    minutes = 59;
                    seconds = 59;
                }
                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
            <div className="flex items-center gap-3 mb-4">
                <Clock size={28} className="text-orange-600" weight="duotone" />
                <h3 className="font-bold text-lg">⏰ შეზღუდული შეთავაზება</h3>
            </div>
            <div className="flex items-center justify-center gap-2 mb-3">
                <div className="bg-white rounded-lg px-4 py-2 text-center min-w-[60px]">
                    <div className="text-2xl font-bold text-orange-600">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-xs text-muted-foreground">საათი</div>
                </div>
                <div className="text-2xl font-bold text-orange-600">:</div>
                <div className="bg-white rounded-lg px-4 py-2 text-center min-w-[60px]">
                    <div className="text-2xl font-bold text-orange-600">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-xs text-muted-foreground">წუთი</div>
                </div>
                <div className="text-2xl font-bold text-orange-600">:</div>
                <div className="bg-white rounded-lg px-4 py-2 text-center min-w-[60px]">
                    <div className="text-2xl font-bold text-orange-600">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="text-xs text-muted-foreground">წამი</div>
                </div>
            </div>
            <p className="text-sm text-center text-muted-foreground">
                🎁 პირველი 100 მომხმარებელი იღებს +2 საათს უფასოდ
            </p>
        </div>
    );
}

// 4. Value Ladder Component
export function ValueLadder() {
    const items = [
        { icon: '✅', text: '10 პრემიუმ სტატია', value: '50₾' },
        { icon: '✅', text: 'Andrej Karpathy ექსკლუზიური ანალიზი', value: '30₾' },
        { icon: '✅', text: '2025 ინსტრუმენტების სრული რეიტინგი', value: '25₾' },
        { icon: '✅', text: 'პროფესიონალური Prompting სტრატეგიები', value: '40₾' },
        { icon: '✅', text: 'რეალური პროექტების case studies', value: '35₾' }
    ];

    const totalValue = items.reduce((sum, item) => sum + parseInt(item.value), 0);

    return (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
            <h3 className="font-bold text-xl mb-4 text-center">💎 რას იღებთ წვდომით</h3>
            <div className="space-y-3 mb-6">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-sm">{item.text}</span>
                        </div>
                        <span className="text-sm font-semibold text-primary">{item.value}</span>
                    </div>
                ))}
            </div>
            <div className="border-t border-purple-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">🎯 სულ ღირებულება:</span>
                    <span className="text-2xl font-bold text-primary">{totalValue}₾</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="font-semibold">💰 თქვენი ფასი:</span>
                    <span className="text-3xl font-bold text-green-600">0₾</span>
                </div>
                <p className="text-xs text-center text-muted-foreground mt-2">
                    (კოდით - დროებითი წვდომა)
                </p>
            </div>
        </div>
    );
}

// 5. Progress Bar Component
export function ReadingProgress({
    readArticles,
    totalArticles
}: {
    readArticles: number;
    totalArticles: number;
}) {
    const percentage = (readArticles / totalArticles) * 100;

    return (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">📚 თქვენი პროგრესი</span>
                <span className="text-sm text-primary font-bold">{readArticles}/{totalArticles}</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-primary to-purple-500"
                />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
                🔓 გახსენი დარჩენილი {totalArticles - readArticles} სტატია
            </p>
        </div>
    );
}

// 6. Comparison Table Component
export function ComparisonTable() {
    const features = [
        { name: 'ძირითადი სტატიები', free: '2', code: '✅ 12', premium: '✅ 12' },
        { name: 'ექსპერტების ანალიზი', free: '❌', code: '✅', premium: '✅' },
        { name: 'ინსტრუმენტების შედარება', free: 'TOP-3', code: '✅ 15+', premium: '✅ 15+' },
        { name: 'რეალური case studies', free: '❌', code: '✅', premium: '✅' },
        { name: 'ხანგრძლივობა', free: '-', code: '1 საათი', premium: 'უვადოდ' },
        { name: 'ფასი', free: '0₾', code: '0₾', premium: '29₾/თვე' }
    ];

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 overflow-x-auto">
            <h3 className="font-bold text-xl mb-6 text-center">📊 შედარება</h3>
            <table className="w-full">
                <thead>
                    <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold">ფუნქცია</th>
                        <th className="text-center py-3 px-4 font-semibold">უფასო</th>
                        <th className="text-center py-3 px-4 font-semibold bg-purple-50">კოდით</th>
                        <th className="text-center py-3 px-4 font-semibold bg-gradient-to-r from-purple-50 to-pink-50">პრემიუმ</th>
                    </tr>
                </thead>
                <tbody>
                    {features.map((feature, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                            <td className="py-3 px-4 text-sm">{feature.name}</td>
                            <td className="py-3 px-4 text-sm text-center">{feature.free}</td>
                            <td className="py-3 px-4 text-sm text-center bg-purple-50/50">{feature.code}</td>
                            <td className="py-3 px-4 text-sm text-center bg-gradient-to-r from-purple-50/50 to-pink-50/50">{feature.premium}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// 7. Interactive Quiz Component
export function InteractiveQuiz({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);

    const questions = [
        {
            q: 'რა არის თქვენი გამოცდილების დონე?',
            options: ['დამწყები', 'საშუალო', 'პროფესიონალი']
        },
        {
            q: 'რა არის თქვენი მთავარი მიზანი?',
            options: ['სწავლა', 'პროტოტიპირება', 'Production პროექტები']
        },
        {
            q: 'რა ბიუჯეტი გაქვთ?',
            options: ['უფასო', 'ზომიერი', 'არ აქვს მნიშვნელობა']
        }
    ];

    const handleAnswer = (answer: string) => {
        setAnswers([...answers, answer]);
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-bold text-xl mb-4">🎯 რომელი ინსტრუმენტი გჭირდება?</h3>
            <div className="mb-4">
                <div className="flex gap-2 mb-4">
                    {questions.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2 flex-1 rounded-full ${idx <= step ? 'bg-primary' : 'bg-gray-200'}`}
                        />
                    ))}
                </div>
                <p className="text-lg font-medium mb-4">{questions[step].q}</p>
                <div className="space-y-2">
                    {questions[step].options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(option)}
                            className="w-full text-left px-4 py-3 rounded-xl bg-white hover:bg-purple-100 transition-colors border border-gray-200 hover:border-purple-300"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// 10. Testimonials Component
export function Testimonials() {
    const testimonials = [
        { name: 'ნიკა ბ.', text: '1 საათში ვისწავლე მეტი ვიდრე 3 თვეში YouTube-დან', rating: 5 },
        { name: 'გიორგი მ.', text: 'Andrej Karpathy-ს ანალიზი ღირს ყველაფერს', rating: 5 },
        { name: 'ანა კ.', text: 'საუკეთესო ინვესტიცია ჩემს კარიერაში', rating: 5 }
    ];

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-xl mb-4">💬 რას ამბობენ მომხმარებლები</h3>
            {testimonials.map((t, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-1 mb-2">
                        {[...Array(t.rating)].map((_, i) => (
                            <Star key={i} size={16} weight="fill" className="text-yellow-500" />
                        ))}
                    </div>
                    <p className="text-sm mb-2 italic">"{t.text}"</p>
                    <p className="text-xs text-muted-foreground">- {t.name}</p>
                </div>
            ))}
        </div>
    );
}

// 11. Content Roadmap Component
export function ContentRoadmap() {
    const upcoming = [
        { title: 'Claude 3.5 Sonnet სრული გაიდი', date: 'იანვარი 15', icon: '✨' },
        { title: 'Cursor vs Windsurf - დეტალური შედარება', date: 'იანვარი 20', icon: '✨' },
        { title: 'Production-ready პროექტების templates', date: 'იანვარი 25', icon: '✨' }
    ];

    return (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
            <h3 className="font-bold text-xl mb-4">🚀 მალე დაემატება</h3>
            <div className="space-y-3">
                {upcoming.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white rounded-lg p-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1">
                            <p className="font-medium text-sm">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-sm text-center mt-4 text-muted-foreground">
                🎁 პრემიუმ წევრები იღებენ ყველაფერს ავტომატურად!
            </p>
        </div>
    );
}

// 12. Scarcity Indicators Component
export function ScarcityIndicators() {
    const [liveCount, setLiveCount] = useState(47);

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveCount(prev => prev + Math.floor(Math.random() * 3) - 1);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                    <Fire size={20} className="text-red-500" weight="fill" />
                    <span className="font-medium">🔴 ახლა ონლაინ: {liveCount} ადამიანი</span>
                </div>
                <div className="flex items-center gap-2">
                    <ChartLine size={20} className="text-orange-500" weight="duotone" />
                    <span>📈 დღეს გამოიყენეს კოდი: 156 ადამიანი</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={20} className="text-red-500" weight="duotone" />
                    <span>⚡ ბოლო 5 წუთში: 8 ახალი წევრი</span>
                </div>
            </div>
        </div>
    );
}

// 13. Sticky CTA Button Component
export function StickyCTA({ onClick }: { onClick: () => void }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={onClick}
            className="fixed bottom-6 right-6 z-50 px-6 py-4 rounded-full bg-gradient-to-r from-primary to-purple-500 text-white font-medium shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 animate-pulse"
        >
            <Lock size={24} weight="fill" />
            გახსენი ყველა სტატია
        </motion.button>
    );
}

// 14. Reading Time Indicator Component
export function ReadingTimeIndicator({
    freeTime,
    premiumTime
}: {
    freeTime: number;
    premiumTime: number;
}) {
    return (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>📖 {freeTime} წთ (უფასო)</span>
            </div>
            <div className="flex items-center gap-2">
                <Lock size={18} className="text-primary" />
                <span>🔒 +{premiumTime} წთ პრემიუმ</span>
            </div>
        </div>
    );
}

// 15. Content Preview Card Component
export function ContentPreviewCard({
    article,
    onUnlock
}: {
    article: any;
    onUnlock: () => void;
}) {
    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>👁️ 2,341 ნახვა</span>
                        <span>⭐ 4.9/5</span>
                        <span>⏱️ 25 წთ</span>
                    </div>
                </div>
                <Lock size={32} className="text-primary" weight="duotone" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
                {article.preview || 'Software იცვლება 70 წლის შემდეგ პირველად...'}
            </p>
            <button
                onClick={onUnlock}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white font-medium hover:scale-105 transition-transform"
            >
                🔓 გახსნა
            </button>
        </div>
    );
}

// 16. Achievement Badges Component
export function AchievementBadges({ readCount }: { readCount: number }) {
    const badges = [
        { name: 'დამწყები', required: 2, icon: '🥉', unlocked: readCount >= 2 },
        { name: 'ენთუზიასტი', required: 5, icon: '🥈', unlocked: readCount >= 5 },
        { name: 'ექსპერტი', required: 12, icon: '🥇', unlocked: readCount >= 12 },
        { name: 'მასტერი', required: 12, icon: '💎', unlocked: readCount >= 12 }
    ];

    return (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <Trophy size={20} className="text-yellow-500" weight="fill" />
                🏆 მიღწევები
            </h3>
            <div className="grid grid-cols-4 gap-2">
                {badges.map((badge, idx) => (
                    <div
                        key={idx}
                        className={`text-center p-2 rounded-lg ${badge.unlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : 'bg-gray-100 opacity-50'
                            }`}
                    >
                        <div className="text-2xl mb-1">{badge.icon}</div>
                        <div className="text-xs font-medium">{badge.name}</div>
                        {!badge.unlocked && (
                            <div className="text-xs text-muted-foreground mt-1">
                                <Lock size={12} className="inline" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// 17. Share to Unlock Component
export function ShareToUnlock({
    articleId,
    onShareComplete
}: {
    articleId: string;
    onShareComplete: (code: string) => void;
}) {
    const [isSharing, setIsSharing] = useState(false);

    const handleShare = async (platform: string) => {
        setIsSharing(true);

        // Generate share code
        const response = await fetch('/api/vibe-codes/share-unlock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ articleId })
        });

        if (response.ok) {
            const data = await response.json();

            // Open share dialog
            const shareUrl = `https://andrewaltair.com/vibe-coding?share=${data.code}`;
            const shareText = `🚀 ვიბ კოდინგი - AI-ით პროგრამირება! გამოიყენე კოდი ${data.code} 15 წუთიანი უფასო წვდომისთვის!`;

            if (platform === 'twitter') {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
            } else if (platform === 'linkedin') {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
            } else if (platform === 'facebook') {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
            }

            // Give user the code
            setTimeout(() => {
                onShareComplete(data.code);
                setIsSharing(false);
            }, 2000);
        }
    };

    return (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                <Share size={24} className="text-blue-600" weight="duotone" />
                🎁 გაზიარე და მიიღე წვდომა
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
                გაზიარე სოციალურ ქსელში და მიიღე 15 წუთიანი უფასო წვდომა ამ სტატიაზე!
            </p>
            <div className="grid grid-cols-3 gap-3">
                <button
                    onClick={() => handleShare('twitter')}
                    disabled={isSharing}
                    className="py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                    Twitter
                </button>
                <button
                    onClick={() => handleShare('linkedin')}
                    disabled={isSharing}
                    className="py-3 rounded-xl bg-blue-700 text-white font-medium hover:bg-blue-800 transition-colors disabled:opacity-50"
                >
                    LinkedIn
                </button>
                <button
                    onClick={() => handleShare('facebook')}
                    disabled={isSharing}
                    className="py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    Facebook
                </button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-3">
                ✨ ბონუსი: Vibe Coding cheat sheet PDF
            </p>
        </div>
    );
}

// 18. Referral Program Component
export function ReferralProgram({ userId }: { userId?: string }) {
    const referralLink = `andrewaltair.com/vibe?ref=${userId || 'USER123'}`;
    const [copied, setCopied] = useState(false);

    const copyLink = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                <Gift size={24} className="text-purple-600" weight="duotone" />
                👥 მოიყვანე მეგობარი
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
                მოიყვანე 3 მეგობარი და მიიღე:
            </p>
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                    <CheckCircle size={18} className="text-green-500" weight="fill" />
                    <span>🎁 1 კვირა უფასო პრემიუმ წვდომა</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <CheckCircle size={18} className="text-green-500" weight="fill" />
                    <span>🎁 ექსკლუზიური Cursor Rules template</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <CheckCircle size={18} className="text-green-500" weight="fill" />
                    <span>🎁 პრიორიტეტული მხარდაჭერა</span>
                </div>
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm"
                />
                <button
                    onClick={copyLink}
                    className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
                >
                    {copied ? '✓' : 'Copy'}
                </button>
            </div>
        </div>
    );
}

// 20. Exit Intent Popup Component
export function ExitIntentPopup({
    isOpen,
    onClose,
    onAccept
}: {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
}) {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-lg w-full bg-white rounded-3xl p-8 shadow-2xl"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>

                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                        <Clock size={40} className="text-orange-600" weight="duotone" />
                    </div>

                    <h2 className="text-3xl font-bold mb-3">⏰ დაელოდე!</h2>
                    <p className="text-lg mb-6">არ გამოტოვო ექსკლუზიური შეთავაზება</p>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
                        <h3 className="font-bold text-xl mb-4">🎁 მხოლოდ შენთვის:</h3>
                        <div className="space-y-2 text-left mb-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={20} className="text-green-500" weight="fill" />
                                <span>✅ Andrej Karpathy სრული ანალიზი</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={20} className="text-green-500" weight="fill" />
                                <span>✅ 15+ ინსტრუმენტის დეტალური შედარება</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={20} className="text-green-500" weight="fill" />
                                <span>✅ პროფესიონალური Prompting სტრატეგიები</span>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-primary mb-2">
                            + ბონუსი 30 წუთი = 1.5 საათი წვდომა!
                        </div>
                    </div>

                    <button
                        onClick={onAccept}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white font-bold text-lg hover:scale-105 transition-transform mb-3"
                    >
                        შეიყვანე კოდი ახლავე
                    </button>

                    <button
                        onClick={onClose}
                        className="text-sm text-gray-400 hover:text-gray-600"
                    >
                        არა, გმადლობთ
                    </button>

                    <p className="text-xs text-orange-600 mt-4 font-medium">
                        ⏱️ ეს შეთავაზება ძალაშია კიდევ 5 წუთი
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
