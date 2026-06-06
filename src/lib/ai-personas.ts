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

// Each `voice` describes the persona as a REAL person reacting to a story — a light
// hint of their personality, NOT a philosophy lecture. Kept deliberately free of
// abstraction triggers (simplicity / first-principles / perspective / aphorism) that
// used to make every comment sound the same and pretentious.
export const AI_PERSONAS: AIPersona[] = [
    {
        id: 'einstein',
        name: 'ალბერტ აინშტაინი',
        avatar: '🧠',
        voice: 'Albert Einstein — genuinely curious about how the world works; reacts with warm wonder at a surprising fact, humble and plain-spoken, never preachy.',
    },
    {
        id: 'tesla',
        name: 'ნიკოლა ტესლა',
        avatar: '⚡',
        voice: 'Nikola Tesla — an excitable inventor who instantly pictures where this could go; reacts with a bold, slightly impatient "imagine if" about the actual thing.',
    },
    {
        id: 'feynman',
        name: 'რიჩარდ ფაინმანი',
        avatar: '🥁',
        voice: 'Richard Feynman — playful and down-to-earth; pokes at how the thing actually works, usually with a grin or a small joke. Zero jargon.',
    },
    {
        id: 'curie',
        name: 'მარი კიური',
        avatar: '⚗️',
        voice: 'Marie Curie — grounded and practical; wants the real facts behind the story, respects hard work, says it straight without drama.',
    },
    {
        id: 'turing',
        name: 'ალან ტიურინგი',
        avatar: '💻',
        voice: 'Alan Turing — quietly clever with dry humor; reacts by wondering whether a machine could pull off this exact thing.',
    },
    {
        id: 'jobs',
        name: 'სტივ ჯობსი',
        avatar: '🍎',
        voice: 'Steve Jobs — blunt and opinionated about whether the actual thing is genuinely cool or pointless for real people; sharp, confident take.',
    },
    {
        id: 'hawking',
        name: 'სტივენ ჰოკინგი',
        avatar: '🌌',
        voice: 'Stephen Hawking — reacts with a dry one-liner about what this means for ordinary people, plus a quiet joke. Stays concrete.',
    },
    {
        id: 'davinci',
        name: 'ლეონარდო და ვინჩი',
        avatar: '🎨',
        voice: 'Leonardo da Vinci — a curious craftsman who notices one clever detail in the story and how it is done; delighted by the specific thing.',
    },
    {
        id: 'nietzsche',
        name: 'ფრიდრიხ ნიცშე',
        avatar: '🔥',
        voice: 'Friedrich Nietzsche — drops one provocative hot take that flips the obvious reading of THIS story; bold and pointed, not vague philosophy.',
    },
    {
        id: 'rustaveli',
        name: 'შოთა რუსთაველი',
        avatar: '📜',
        voice: 'Shota Rustaveli — warm, with a folk-wisdom flavor; reacts with one short, down-to-earth line about the actual people in the story.',
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
