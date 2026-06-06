export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import Link from 'next/link';
import { TbArrowLeft, TbSearch, TbThumbUp } from 'react-icons/tb';

import { ForumService } from '@/services/forum.service';
import { FORUM_PERSONAS, getForumPersona } from '@/lib/georgian-forum-personas';
import { ForumPersonaAvatar } from '@/components/forum/ForumPersonaAvatar';

export const metadata: Metadata = {
    title: 'ძებნა | ფორუმი',
    description: 'მოძებნე რა თქვა ნებისმიერმა ისტორიულმა პერსონამ ნებისმიერ თემაზე.',
    alternates: { canonical: '/forum/search' },
};

export default async function ForumSearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; persona?: string }>;
}) {
    const { q, persona } = await searchParams;
    const query = (q || '').trim();
    const results = query || persona ? await ForumService.searchPosts(query, persona || undefined) : [];

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-10 max-w-3xl">
                <Link href="/forum" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    <TbArrowLeft className="w-4 h-4" />
                    ფორუმი
                </Link>

                <h1 className="mt-3 text-3xl font-bold text-on-surface flex items-center gap-2">
                    <TbSearch className="w-7 h-7 text-primary" />
                    ძებნა მოსაზრებებში
                </h1>

                <form method="get" className="mt-5 flex flex-col sm:flex-row gap-2">
                    <input
                        name="q"
                        defaultValue={query}
                        placeholder="საკვანძო სიტყვა..."
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    <select
                        name="persona"
                        defaultValue={persona || ''}
                        className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    >
                        <option value="">ყველა პერსონა</option>
                        {FORUM_PERSONAS.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <button className="rounded-lg bg-primary text-white px-4 py-2 text-sm font-medium hover:opacity-90">
                        ძებნა
                    </button>
                </form>

                <div className="mt-6">
                    {!query && !persona ? (
                        <p className="text-sm text-on-surface-variant py-8 text-center">შეიყვანე საძიებო სიტყვა.</p>
                    ) : results.length === 0 ? (
                        <p className="text-sm text-on-surface-variant py-8 text-center">ვერაფერი მოიძებნა.</p>
                    ) : (
                        <div className="space-y-3">
                            {results.map((r) => {
                                const p = getForumPersona(r.personaId);
                                return (
                                    <div key={r.id} className="rounded-xl border border-border/40 bg-card p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ForumPersonaAvatar personaId={r.personaId} size="sm" />
                                            <Link href={`/forum/persona/${r.personaId}`} className="text-sm font-medium text-on-surface hover:text-primary">
                                                {p?.name || 'პერსონა'}
                                            </Link>
                                        </div>
                                        <p className="text-sm leading-relaxed text-on-surface-variant whitespace-pre-line">{r.content}</p>
                                        <div className="mt-2 flex items-center justify-between gap-2">
                                            {r.topicSlug ? (
                                                <Link href={`/forum/${r.topicSlug}`} className="text-xs text-primary hover:underline truncate">
                                                    {r.topicTitleKa}
                                                </Link>
                                            ) : <span />}
                                            {r.agrees > 0 && (
                                                <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant shrink-0">
                                                    <TbThumbUp className="w-3.5 h-3.5" />
                                                    {r.agrees}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
