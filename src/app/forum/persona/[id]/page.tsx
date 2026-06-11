export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TbArrowLeft, TbThumbUp, TbThumbDown, TbMessage2, TbStack2, TbQuote, TbUsers, TbSwords, TbTrendingUp } from 'react-icons/tb';

import { getForumPersona, FORUM_PERSONAS } from '@/lib/georgian-forum-personas';
import { ForumService } from '@/services/forum.service';
import { ForumPersonaAvatar } from '@/components/forum/ForumPersonaAvatar';
import { ForumSubscribeButton } from '@/components/forum/ForumSubscribeButton';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const p = getForumPersona(id);
    if (!p) notFound(); // real 404 status — body-level notFound() alone soft-404s under root loading.tsx
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

    const [{ entries, stats }, { allTime }, prophets] = await Promise.all([
        ForumService.getPersonaActivity(id),
        ForumService.getLeaderboard(),
        ForumService.getProphetLeaderboard(),
    ]);
    const record = allTime.find((r) => r.personaId === id);
    const prophet = prophets.find((p) => p.personaId === id);

    // Allies / rivals — union of this persona's lists + anyone who lists this persona.
    const allyIds = new Set<string>(persona.allies || []);
    const rivalIds = new Set<string>(persona.rivals || []);
    for (const p of FORUM_PERSONAS) {
        if (p.id === id) continue;
        if (p.allies?.includes(id)) allyIds.add(p.id);
        if (p.rivals?.includes(id)) rivalIds.add(p.id);
    }
    const allies = [...allyIds].filter((x) => !rivalIds.has(x));
    const rivals = [...rivalIds];

    const posts = record?.posts ?? stats.posts;
    const topics = record?.topics ?? stats.topics;
    const agrees = record?.agrees ?? stats.totalAgrees;
    const disagrees = record?.disagrees ?? 0;

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
                        {prophet && prophet.resolved >= 3 && (
                            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                <TbTrendingUp className="w-3.5 h-3.5" />
                                წინასწარმეტყველის სიზუსტე: {prophet.accuracy}% ({prophet.right}/{prophet.resolved})
                            </div>
                        )}
                    </div>
                    <ForumSubscribeButton scope="persona" personaId={id} />
                </div>

                {/* Signature quote */}
                {persona.sample && (
                    <div className="mt-4 rounded-2xl border border-border/40 bg-card p-4">
                        <TbQuote className="w-4 h-4 text-primary mb-1" />
                        <p className="text-base italic leading-relaxed text-on-surface">„{persona.sample}"</p>
                    </div>
                )}

                {/* Stats */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Stat icon={<TbMessage2 className="w-4 h-4" />} label="მოსაზრება" value={posts} />
                    <Stat icon={<TbStack2 className="w-4 h-4" />} label="თემა" value={topics} />
                    <Stat icon={<TbThumbUp className="w-4 h-4" />} label="თანხმობა" value={agrees} />
                    <Stat icon={<TbThumbDown className="w-4 h-4" />} label="უთანხმოება" value={disagrees} />
                </div>

                {/* Allies / rivals */}
                {(allies.length > 0 || rivals.length > 0) && (
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {allies.length > 0 && (
                            <div className="rounded-2xl border border-border/40 bg-card p-4">
                                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">
                                    <TbUsers className="w-3.5 h-3.5" />
                                    მოკავშირეები
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {allies.map((pid) => <RelChip key={pid} pid={pid} />)}
                                </div>
                            </div>
                        )}
                        {rivals.length > 0 && (
                            <div className="rounded-2xl border border-border/40 bg-card p-4">
                                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-red-500">
                                    <TbSwords className="w-3.5 h-3.5" />
                                    მოწინააღმდეგეები
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {rivals.map((pid) => <RelChip key={pid} pid={pid} />)}
                                </div>
                            </div>
                        )}
                    </div>
                )}

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
                                    <span className="flex items-center gap-2 shrink-0 text-xs text-on-surface-variant">
                                        {e.agrees > 0 && (
                                            <span className="inline-flex items-center gap-1"><TbThumbUp className="w-3.5 h-3.5" />{e.agrees}</span>
                                        )}
                                        {e.disagrees > 0 && (
                                            <span className="inline-flex items-center gap-1"><TbThumbDown className="w-3.5 h-3.5" />{e.disagrees}</span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

function RelChip({ pid }: { pid: string }) {
    const p = getForumPersona(pid);
    if (!p) return null;
    return (
        <Link
            href={`/forum/persona/${pid}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-background px-2 py-1 text-xs hover:border-primary"
        >
            <ForumPersonaAvatar personaId={pid} size="xs" />
            <span className="truncate max-w-28 text-on-surface">{p.name}</span>
        </Link>
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
