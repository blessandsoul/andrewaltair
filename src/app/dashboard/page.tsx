import { Metadata } from 'next'
import {
    UserAIProfile,
    DailyChallenge,
    LearningPath,
    AIWorkspace,
    WeeklyRewards,
    AIUsageCredits,
    AICertification,
    PromptLibrary
} from '@/components/engagement'

export const metadata: Metadata = {
    title: 'ჩემი Dashboard | Andrew Altair',
    description: 'შენი პერსონალური AI სივრცე - აქტივობა, გამოწვევები, და პროგრესი'
}

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        ჩემი AI Dashboard
                    </h1>
                    <p className="text-white/60">
                        შენი პერსონალური AI მოგზაურობის ცენტრი
                    </p>
                </div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <UserAIProfile />
                        <AIUsageCredits />
                        <WeeklyRewards />
                    </div>

                    {/* Center Column */}
                    <div className="space-y-6">
                        <DailyChallenge />
                        <LearningPath />
                        <AICertification />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6">
                            <h2 className="text-xl font-bold text-white mb-4">სწრაფი ნავიგაცია</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: '🤖', label: 'AI ჩატი', href: '/mystic' },
                                    { icon: '🔧', label: 'ინსტრუმენტები', href: '/tools' },
                                    { icon: '📖', label: 'ბლოგი', href: '/blog' },
                                    { icon: '🎯', label: 'ქვიზი', href: '/quiz' },
                                    { icon: '🔮', label: 'მისტიკა', href: '/mystic' },
                                    { icon: '📚', label: 'რესურსები', href: '/resources' }
                                ].map((item, i) => (
                                    <a
                                        key={i}
                                        href={item.href}
                                        className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors"
                                    >
                                        <span className="text-2xl">{item.icon}</span>
                                        <span className="text-white/80 text-sm">{item.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                        <PromptLibrary />
                    </div>
                </div>

                {/* Full Width Section */}
                <div className="mt-8">
                    <AIWorkspace />
                </div>
            </div>
        </div>
    )
}
