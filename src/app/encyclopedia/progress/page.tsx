import { Metadata } from "next"
import { TbBook, TbChartPie, TbAward, TbClock, TbTarget, TbFlame, TbTrophy, TbStar } from "react-icons/tb"
import Link from "next/link"

export const metadata: Metadata = {
    title: "პროგრესი | ენციკლოპედია",
    description: "თქვენი სწავლის პროგრესი ენციკლოპედიაში",
}

// This will be replaced with actual user data
const mockProgress = {
    totalArticles: 35,
    readArticles: 12,
    totalMinutes: 245,
    streak: 5,
    sections: [
        { name: "Vibe Coding", slug: "vibe-coding", total: 3, read: 0, color: "from-violet-500 to-purple-500" },
    ],
    recentArticles: [
        // { title: "რა არის Prompt Engineering?", slug: "what-is-prompt-engineering", section: "prompt-engineering", readAt: "დღეს 14:30" },
    ],
    achievements: [
        { name: "პირველი ნაბიჯი", description: "პირველი სტატია წაიკითხე", icon: TbStar, unlocked: true },
        { name: "Prompt Master", description: "Prompt Engineering სექცია დაასრულე", icon: TbTrophy, unlocked: false },
        { name: "5-დღიანი სერია", description: "5 დღე ზედიზედ იკითხე", icon: TbFlame, unlocked: true },
    ],
}

export default function ProgressPage() {
    const overallPercent = Math.round((mockProgress.readArticles / mockProgress.totalArticles) * 100)

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container max-w-6xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                        <TbChartPie className="w-10 h-10 text-primary" />
                        შენი პროგრესი
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        თვალი ადევნე შენს სწავლის პროცესს
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <div className="bg-card rounded-xl p-6 border text-center">
                        <TbBook className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                        <div className="text-3xl font-bold">{mockProgress.readArticles}/{mockProgress.totalArticles}</div>
                        <div className="text-sm text-muted-foreground">სტატია წაკითხული</div>
                    </div>
                    <div className="bg-card rounded-xl p-6 border text-center">
                        <TbTarget className="w-8 h-8 mx-auto mb-2 text-green-500" />
                        <div className="text-3xl font-bold">{overallPercent}%</div>
                        <div className="text-sm text-muted-foreground">საერთო პროგრესი</div>
                    </div>
                    <div className="bg-card rounded-xl p-6 border text-center">
                        <TbClock className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                        <div className="text-3xl font-bold">{mockProgress.totalMinutes}</div>
                        <div className="text-sm text-muted-foreground">წუთი კითხვაში</div>
                    </div>
                    <div className="bg-card rounded-xl p-6 border text-center">
                        <TbFlame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                        <div className="text-3xl font-bold">{mockProgress.streak}</div>
                        <div className="text-sm text-muted-foreground">დღიანი სერია 🔥</div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Sections Progress */}
                    <div className="md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <TbBook className="w-5 h-5" />
                            სექციები
                        </h2>
                        <div className="space-y-4">
                            {mockProgress.sections.map((section) => {
                                const percent = section.total > 0 ? Math.round((section.read / section.total) * 100) : 0
                                return (
                                    <Link
                                        key={section.slug}
                                        href={`/encyclopedia/${section.slug}`}
                                        className="block bg-card rounded-xl p-4 border hover:border-primary/50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">{section.name}</span>
                                            <span className="text-sm text-muted-foreground">
                                                {section.read}/{section.total} ({percent}%)
                                            </span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r ${section.color} transition-all duration-500`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Recent Activity */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <TbClock className="w-5 h-5" />
                                ბოლო აქტივობა
                            </h2>
                            <div className="bg-card rounded-xl border divide-y">
                                {mockProgress.recentArticles.map((article, i) => (
                                    <Link
                                        key={i}
                                        href={`/encyclopedia/${article.section}/${article.slug}`}
                                        className="block p-4 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="font-medium text-sm">{article.title}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{article.readAt}</div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Achievements */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <TbAward className="w-5 h-5" />
                                მიღწევები
                            </h2>
                            <div className="space-y-3">
                                {mockProgress.achievements.map((achievement, i) => (
                                    <div
                                        key={i}
                                        className={`bg-card rounded-xl p-4 border flex items-center gap-3 ${!achievement.unlocked ? 'opacity-50' : ''
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${achievement.unlocked ? 'bg-amber-500/20 text-amber-500' : 'bg-muted text-muted-foreground'
                                            }`}>
                                            <achievement.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{achievement.name}</div>
                                            <div className="text-xs text-muted-foreground">{achievement.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back to Encyclopedia */}
                <div className="mt-12 text-center">
                    <Link
                        href="/encyclopedia"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                        <TbBook className="w-4 h-4" />
                        ენციკლოპედიაზე დაბრუნება
                    </Link>
                </div>
            </div>
        </div>
    )
}
