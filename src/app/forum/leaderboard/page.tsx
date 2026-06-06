export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import Link from 'next/link';
import { TbArrowLeft, TbTrophy, TbThumbUp, TbCrown, TbTrendingUp } from 'react-icons/tb';

import { ForumService } from '@/services/forum.service';
import { getForumPersona } from '@/lib/georgian-forum-personas';
import { ForumPersonaAvatar } from '@/components/forum/ForumPersonaAvatar';

export const metadata: Metadata = {
    title: 'ლიდერბორდი | ფორუმი',
    description: 'საქართველოს ისტორიული პირები — ვინ ყველაზე დამაჯერებელია ფორუმის დებატებში.',
    alternates: { canonical: '/forum/leaderboard' },
};

export default async function ForumLeaderboardPage() {
    const { allTime, monthTop } = await ForumService.getLeaderboard();
    const monthPersona = monthTop ? getForumPersona(monthTop.personaId) : null;
    const prophets = await ForumService.getProphetLeaderboard();

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-10 max-w-3xl">
                <Link href="/forum" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    <TbArrowLeft className="w-4 h-4" />
                    ფორუმი
                </Link>

                <h1 className="mt-3 text-3xl font-bold text-on-surface flex items-center gap-2">
                    <TbTrophy className="w-7 h-7 text-yellow-500" />
                    ლიდერბორდი
                </h1>
                <p className="mt-1 text-muted-foreground">ვინ ყველაზე დამაჯერებელია — თანხმობების მიხედვით</p>

                {/* Thinker of the month */}
                {monthPersona && monthTop && (
                    <Link
                        href={`/forum/persona/${monthTop.personaId}`}
                        className="mt-6 flex items-center gap-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5 hover:shadow-lg transition-shadow"
                    >
                        <ForumPersonaAvatar personaId={monthTop.personaId} size="lg" />
                        <div className="min-w-0 flex-1">
                            <div className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide flex items-center gap-1">
                                <TbCrown className="w-4 h-4" />
                                თვის მოაზროვნე
                            </div>
                            <div className="font-bold text-on-surface truncate">{monthPersona.name}</div>
                            <div className="text-xs text-on-surface-variant">{monthPersona.era} · {monthPersona.role}</div>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="text-2xl font-bold text-on-surface">{monthTop.agrees}</div>
                            <div className="text-xs text-on-surface-variant">თანხმობა (30 დღე)</div>
                        </div>
                    </Link>
                )}

                {/* All-time ranking */}
                <h2 className="mt-8 mb-3 text-lg font-semibold text-on-surface">საერთო რეიტინგი</h2>
                {allTime.length === 0 ? (
                    <p className="text-sm text-on-surface-variant py-8 text-center">მონაცემები ჯერ არ არის.</p>
                ) : (
                    <div className="space-y-2">
                        {allTime.map((row, i) => {
                            const p = getForumPersona(row.personaId);
                            if (!p) return null;
                            return (
                                <Link
                                    key={row.personaId}
                                    href={`/forum/persona/${row.personaId}`}
                                    className="flex items-center gap-3 rounded-xl border border-border/40 bg-card p-3 hover:shadow-md transition-shadow"
                                >
                                    <span className="w-6 text-center font-bold text-on-surface-variant shrink-0">{i + 1}</span>
                                    <ForumPersonaAvatar personaId={row.personaId} size="md" />
                                    <div className="min-w-0 flex-1">
                                        <div className="font-medium text-on-surface truncate">{p.name}</div>
                                        <div className="text-xs text-on-surface-variant">{p.role} · {row.posts} მოსაზრება</div>
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-on-surface shrink-0">
                                        <TbThumbUp className="w-4 h-4 text-green-500" />
                                        {row.agrees}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Prophet leaderboard — prediction accuracy (resolved predictions only) */}
                {prophets.length > 0 && (
                    <>
                        <h2 className="mt-10 mb-1 text-lg font-semibold text-on-surface flex items-center gap-2">
                            <TbTrendingUp className="w-5 h-5 text-primary" />
                            წინასწარმეტყველები
                        </h2>
                        <p className="mb-3 text-sm text-muted-foreground">ვისი პროგნოზები ყველაზე ხშირად მართლდება</p>
                        <div className="space-y-2">
                            {prophets.map((row, i) => {
                                const p = getForumPersona(row.personaId);
                                if (!p) return null;
                                return (
                                    <Link
                                        key={row.personaId}
                                        href={`/forum/persona/${row.personaId}`}
                                        className="flex items-center gap-3 rounded-xl border border-border/40 bg-card p-3 hover:shadow-md transition-shadow"
                                    >
                                        <span className="w-6 text-center font-bold text-on-surface-variant shrink-0">{i + 1}</span>
                                        <ForumPersonaAvatar personaId={row.personaId} size="md" />
                                        <div className="min-w-0 flex-1">
                                            <div className="font-medium text-on-surface truncate">{p.name}</div>
                                            <div className="text-xs text-on-surface-variant">{row.right}/{row.resolved} გამართლდა</div>
                                        </div>
                                        <span className="text-lg font-bold text-on-surface shrink-0">{row.accuracy}%</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
