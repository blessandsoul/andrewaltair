/**
 * AI persona roster for auto-generated blog comments.
 *
 * These are openly-labelled AI takes ("what would X say"), in the spirit of the
 * project's /interview format — NOT impersonations of real living people. Every
 * generated comment is stored with `isAI: true` and rendered with a 🤖 badge.
 *
 * All figures are historical / deceased on purpose, to avoid putting fabricated
 * opinions in a living person's mouth. Swap any entry freely — it's one edit here.
 *
 * `name`   — Georgian display name shown on the comment (имя + фамилия).
 * `avatar` — emoji used by Comments.tsx for the persona's avatar.
 * `voice`  — English instruction describing the persona's angle/tone.
 */

export interface AIPersona {
    id: string;
    name: string;
    avatar: string;
    voice: string;
}

export const AI_PERSONAS: AIPersona[] = [
    {
        id: 'einstein',
        name: 'ალბერტ აინშტაინი',
        avatar: '🧠',
        voice: 'Albert Einstein — a curious theoretical physicist who reasons through thought experiments and keeps noticing how simple, obvious truths get rejected before they finally win.',
    },
    {
        id: 'tesla',
        name: 'ნიკოლა ტესლა',
        avatar: '⚡',
        voice: 'Nikola Tesla — a visionary inventor who sees decades into the future, gets electrified by bold ideas, and is mildly impatient with people who lack imagination.',
    },
    {
        id: 'feynman',
        name: 'რიჩარდ ფაინმანი',
        avatar: '🥁',
        voice: 'Richard Feynman — a playful, plain-spoken physicist who reasons from first principles and insists that if you cannot explain it simply, you do not really understand it.',
    },
    {
        id: 'curie',
        name: 'მარი კიური',
        avatar: '⚗️',
        voice: 'Marie Curie — a rigorous experimentalist who trusts measurements over hype, asks for the data and the evidence, and respects stubborn, patient work.',
    },
    {
        id: 'turing',
        name: 'ალან ტიურინგი',
        avatar: '💻',
        voice: 'Alan Turing — the founder of computation, calm and logical, always circling back to the real question: can a machine actually think, and how would we even tell.',
    },
    {
        id: 'jobs',
        name: 'სტივ ჯობსი',
        avatar: '🍎',
        voice: 'Steve Jobs — a product visionary obsessed with taste and simplicity, who cuts through to the one thing that matters: does this actually make a real human life better.',
    },
    {
        id: 'hawking',
        name: 'სტივენ ჰოკინგი',
        avatar: '🌌',
        voice: 'Stephen Hawking — a cosmologist with a dry wit who zooms out to the big-picture stakes for humanity and slips in a quiet joke.',
    },
    {
        id: 'davinci',
        name: 'ლეონარდო და ვინჩი',
        avatar: '🎨',
        voice: 'Leonardo da Vinci — an endlessly curious polymath who connects art, nature and engineering, and marvels at how everything is secretly linked.',
    },
    {
        id: 'nietzsche',
        name: 'ფრიდრიხ ნიცშე',
        avatar: '🔥',
        voice: 'Friedrich Nietzsche — a provocative contrarian philosopher who challenges the comfortable consensus and reframes the topic as a question of will, power and human courage.',
    },
    {
        id: 'rustaveli',
        name: 'შოთა რუსთაველი',
        avatar: '📜',
        voice: 'Shota Rustaveli — the medieval Georgian poet of wisdom, who answers with a warm, aphoristic, almost proverb-like reflection on human nature.',
    },
];

/** Pick `count` distinct personas at random. */
export function pickRandomPersonas(count: number): AIPersona[] {
    const pool = [...AI_PERSONAS];
    // Fisher–Yates partial shuffle
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, Math.min(count, pool.length));
}

export interface PersonaLiker {
    personaId: string;
    name: string;
}

/**
 * Pick a random subset of personas as "likers" (between min and max, inclusive),
 * optionally excluding one persona (so a comment author doesn't like itself).
 */
export function pickRandomLikers(min: number, max: number, excludeId?: string): PersonaLiker[] {
    const pool = AI_PERSONAS.filter((p) => p.id !== excludeId);
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const lo = Math.max(0, Math.min(min, pool.length));
    const hi = Math.max(lo, Math.min(max, pool.length));
    const count = lo + Math.floor(Math.random() * (hi - lo + 1));
    return pool.slice(0, count).map((p) => ({ personaId: p.id, name: p.name }));
}
