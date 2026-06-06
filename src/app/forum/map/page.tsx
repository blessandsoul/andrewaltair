export const dynamic = 'force-static';

import { Metadata } from 'next';
import Link from 'next/link';
import { TbArrowLeft, TbUsers, TbSwords } from 'react-icons/tb';

import { FORUM_PERSONAS, getForumPersona } from '@/lib/georgian-forum-personas';
import { ForumPersonaAvatar } from '@/components/forum/ForumPersonaAvatar';

export const metadata: Metadata = {
    title: 'მოკავშირეები და მტრები | ფორუმი',
    description: 'საქართველოს ისტორიულ პირთა ალიანსებისა და დაპირისპირებების რუკა.',
    alternates: { canonical: '/forum/map' },
};

export default function ForumMapPage() {
    const N = FORUM_PERSONAS.length;
    const nodes = FORUM_PERSONAS.map((p, i) => {
        const a = (i / N) * Math.PI * 2 - Math.PI / 2;
        return { id: p.id, x: 50 + 44 * Math.cos(a), y: 50 + 44 * Math.sin(a) };
    });
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

    const edges: { a: string; b: string; type: 'ally' | 'rival' }[] = [];
    const seen = new Set<string>();
    for (const p of FORUM_PERSONAS) {
        const add = (a: string, b: string, type: 'ally' | 'rival') => {
            if (!byId[a] || !byId[b]) return;
            const key = [a, b].sort().join('|') + type;
            if (seen.has(key)) return;
            seen.add(key);
            edges.push({ a, b, type });
        };
        for (const al of p.allies || []) add(p.id, al, 'ally');
        for (const rv of p.rivals || []) add(p.id, rv, 'rival');
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-10 max-w-3xl">
                <Link href="/forum" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    <TbArrowLeft className="w-4 h-4" /> ფორუმი
                </Link>

                <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-on-surface">მოკავშირეები და მტრები</h1>
                <p className="mt-1 text-muted-foreground">ვინ ვისთან არის და ვის უპირისპირდება — ისტორიულ პირთა რუკა.</p>

                <div className="mt-4 flex items-center gap-4 text-sm">
                    <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400"><TbUsers className="w-4 h-4" /> მოკავშირე</span>
                    <span className="inline-flex items-center gap-1.5 text-red-500"><TbSwords className="w-4 h-4" /> მოწინააღმდეგე</span>
                </div>

                <div className="relative mx-auto mt-6 aspect-square w-full max-w-[640px]">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                        {edges.map((e, i) => {
                            const A = byId[e.a], B = byId[e.b];
                            return (
                                <line
                                    key={i}
                                    x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                                    stroke={e.type === 'ally' ? '#22c55e' : '#ef4444'}
                                    strokeWidth={0.4}
                                    strokeOpacity={0.5}
                                />
                            );
                        })}
                    </svg>
                    {nodes.map((n) => (
                        <Link
                            key={n.id}
                            href={`/forum/persona/${n.id}`}
                            title={getForumPersona(n.id)?.name}
                            className="absolute -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${n.x}%`, top: `${n.y}%` }}
                        >
                            <ForumPersonaAvatar personaId={n.id} size="md" className="ring-2 ring-background hover:ring-primary transition" />
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
