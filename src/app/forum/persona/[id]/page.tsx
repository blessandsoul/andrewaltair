export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TbArrowLeft, TbThumbUp, TbMessage2, TbStack2 } from 'react-icons/tb';

import { getForumPersona } from '@/lib/georgian-forum-personas';
import { ForumService } from '@/services/forum.service';
import { ForumPersonaAvatar } from '@/components/forum/ForumPersonaAvatar';
import { ForumSubscribeButton } from '@/components/forum/ForumSubscribeButton';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const p = getForumPersona(id);
    if (!p) return { title: 'პერსონა ვერ მოიძებნა | Andrew Altair' };
    return {
        title: `${p.name} | ფორუმი`,
        description: `${p.era} · ${p.role} — AI-წარმოსახული ისტორიული პერსონა`,
        alternates: { canonical: `/forum/persona/${id}` },
    };
}

export default async function PersonaProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const persona = getForumPersona(id);
    if (!persona) return notFound();

    const { entries, stats } = await ForumService.getPersonaActivity(id);

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-10 max-w-3xl">
                <Link href="/forum" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    <TbArrowLeft className="w-4 h-4" />
                    ფორუმი
                </Link>

                {/* Header */}
                <div className="mt-4 flex items-start gap-4">
                    <ForumPersonaAvatar personaId={id} size="lg" />
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl font-bold text-on-surface">{persona.name}</h1>
                        <div className="text-sm text-on-surface-variant">{persona.era} · {persona.role}</div>
                        {persona.bioKa && (
                            <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{persona.bioKa}</p>
                        )}
                    </div>
                    <ForumSubscribeButton scope="persona" personaId={id} />
                </div>

                {/* Stats */}
                <div className="mt-5 grid grid-cols-3 gap-3">
                    <Stat icon={<TbMessage2 className="w-4 h-4" />} label="მოსაზრება" value={stats.posts} />
                    <Stat icon={<TbStack2 className="w-4 h-4" />} label="თემა" value={stats.topics} />
                    <Stat icon={<TbThumbUp className="w-4 h-4" />} label="თანხმობა" value={stats.totalAgrees} />
                </div>

                <h2 className="mt-8 mb-3 text-lg font-semibold text-on-surface">მოსაზრებები</h2>
                {entries.length === 0 ? (
                    <p className="text-sm text-on-surface-variant py-8 text-center">ჯერ არ მონაწილეობია დებატში.</p>
                ) : (
                    <div className="space-y-3">
                        {entries.map((e) => (
                            <div key={e.id} className="rounded-xl border border-border/40 bg-card p-4">
                                <p className="text-sm sm:text-base leading-relaxed text-on-surface-variant whitespace-pre-line">
                                    {e.content}
                                </p>
                                <div className="mt-2 flex items-center justify-between gap-2">
                                    {e.topicSlug ? (
                                        <Link href={`/forum/${e.topicSlug}`} className="text-xs text-primary hover:underline truncate">
                                            {e.topicTitleKa}
                                        </Link>
                                    ) : <span />}
                                    {e.agrees > 0 && (
                                        <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant shrink-0">
                                            <TbThumbUp className="w-3.5 h-3.5" />
                                            {e.agrees}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
    return (
        <div className="rounded-xl border border-border/40 bg-card p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-on-surface-variant">{icon}</div>
            <div className="mt-1 text-xl font-bold text-on-surface">{value}</div>
            <div className="text-xs text-on-surface-variant">{label}</div>
        </div>
    );
}
