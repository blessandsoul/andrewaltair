/**
 * Generates Georgian AI-persona comments for a blog post via OpenRouter.
 *
 * Model chain (free tier): Gemma 4 31b → Gemma 4 26b-a4b fallback on rate-limit /
 * bad output. Both were verified to produce clean, natural Georgian; the fallback
 * exists because the free tier returns 429 under load.
 *
 * Output is validated: must be Georgian Mkhedruli, no Cyrillic, ~12-40 words.
 */

import { AIPersona, pickRandomPersonas } from '@/lib/ai-personas';
import dbConnect from '@/lib/db';
import Comment from '@/models/Comment';

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

const MODEL_CHAIN = [
    'google/gemma-4-31b-it:free',
    'google/gemma-4-26b-a4b-it:free',
];

export interface PostSeed {
    title: string;
    excerpt?: string;
}

export interface GeneratedComment {
    personaId: string;
    name: string;
    avatar: string;
    content: string;
}

const GEORGIAN_RE = /[Ⴀ-ჿ]/g;
const CYRILLIC_RE = /[Ѐ-ӿ]/;
const LONG_LATIN_WORD_RE = /[A-Za-z]{7,}/; // allow short acronyms (AI, GPT, API), reject English words

function extractComment(raw: string): string {
    let text = (raw || '').replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    // Reasoning-y models can emit drafts on multiple lines — keep the last Georgian-heavy line.
    const geoLines = text
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => (s.match(GEORGIAN_RE) || []).length > 10);
    if (geoLines.length) text = geoLines[geoLines.length - 1];
    return text.replace(/^["'„“]+|["'”]+$/g, '').trim();
}

function isValidGeorgian(text: string): boolean {
    if (!text) return false;
    const words = text.split(/\s+/).filter(Boolean).length;
    const georgianChars = (text.match(GEORGIAN_RE) || []).length;
    if (words < 12 || words > 45) return false;
    if (georgianChars < 30) return false;
    if (CYRILLIC_RE.test(text)) return false;       // absolute: no Cyrillic in Georgian
    if (LONG_LATIN_WORD_RE.test(text)) return false; // no English words (acronyms ok)
    return true;
}

async function callModel(
    apiKey: string,
    model: string,
    persona: AIPersona,
    post: PostSeed,
): Promise<string | null> {
    const sys =
        `You are ${persona.voice}\n` +
        `Write ONE short blog comment in GEORGIAN (ქართული, Mkhedruli script), 20-30 words, in this persona's voice, reacting to the blog post.\n` +
        `Rules: natural spoken Georgian; every word a real Georgian word; you MAY keep short well-known acronyms (AI, GPT) in Latin; NO Cyrillic letters; no hashtags, no quotation marks, no emojis.\n` +
        `Think silently. Output ONLY the final comment text on a single line, nothing else.`;
    const user = `Post title: ${post.title}\nPost excerpt: ${post.excerpt || ''}`;

    let res: Response;
    try {
        res = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model,
                messages: [
                    { role: 'system', content: sys },
                    { role: 'user', content: user },
                ],
                temperature: 0.85,
                max_tokens: 600,
            }),
        });
    } catch {
        return null; // network error → let caller try next model
    }

    if (!res.ok) return null; // 429 / 5xx → next model in chain
    const json = await res.json().catch(() => null);
    const raw = json?.choices?.[0]?.message?.content;
    if (!raw) return null;
    const text = extractComment(raw);
    return isValidGeorgian(text) ? text : null;
}

/** Generate one comment for a persona, walking the model fallback chain. */
async function generateForPersona(
    apiKey: string,
    persona: AIPersona,
    post: PostSeed,
): Promise<GeneratedComment | null> {
    for (const model of MODEL_CHAIN) {
        const content = await callModel(apiKey, model, persona, post);
        if (content) {
            return { personaId: persona.id, name: persona.name, avatar: persona.avatar, content };
        }
    }
    return null;
}

/**
 * Generate `count` (default 3-5) AI-persona comments for a post.
 * Returns only the comments that passed validation — never throws on per-persona failure.
 */
export async function generatePersonaComments(
    post: PostSeed,
    count?: number,
): Promise<GeneratedComment[]> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set');

    const n = count ?? 3 + Math.floor(Math.random() * 3); // 3-5
    const personas = pickRandomPersonas(n);

    const results = await Promise.allSettled(
        personas.map((p) => generateForPersona(apiKey, p, post)),
    );

    return results
        .filter((r): r is PromiseFulfilledResult<GeneratedComment | null> => r.status === 'fulfilled')
        .map((r) => r.value)
        .filter((c): c is GeneratedComment => c !== null);
}

export type SaveCommentsResult =
    | { created: number }
    | { skipped: true; existing: number };

/**
 * Generate AND persist AI-persona comments for any content item, keyed by `commentKey`
 * (the value used as Comment.postId on the public page — bare _id for posts/insights/videos).
 *
 * Idempotent: if AI comments already exist for the key it skips, so re-publishing /
 * re-importing / clicking the backfill button twice never duplicates.
 * Shared by the posts/insights/videos ai-comments routes.
 */
export async function generateAndSaveComments(
    commentKey: string,
    seed: PostSeed,
): Promise<SaveCommentsResult> {
    await dbConnect();

    const existing = await Comment.countDocuments({ postId: commentKey, isAI: true });
    if (existing > 0) return { skipped: true, existing };

    const generated = await generatePersonaComments(seed);
    if (generated.length === 0) return { created: 0 };

    await Comment.insertMany(
        generated.map((g) => ({
            postId: commentKey,
            author: { name: g.name, avatar: g.avatar },
            content: g.content,
            isAI: true,
            persona: g.personaId,
            status: 'approved',
        })),
    );

    return { created: generated.length };
}
