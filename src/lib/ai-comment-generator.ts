/**
 * Generates Georgian AI-persona comments for a blog post via OpenRouter.
 *
 * Model chain (free tier): Gemma 4 31b → Gemma 4 26b-a4b fallback on rate-limit /
 * bad output. Both were verified to produce clean, natural Georgian; the fallback
 * exists because the free tier returns 429 under load.
 *
 * Output is validated: must be Georgian Mkhedruli, no Cyrillic, ~12-40 words.
 */

import mongoose from 'mongoose';

import { AIPersona, pickRandomPersonas, pickRandomLikers, AI_PERSONAS } from '@/lib/ai-personas';
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

function isValidGeorgian(text: string, minWords = 12, maxWords = 45): boolean {
    if (!text) return false;
    const words = text.split(/\s+/).filter(Boolean).length;
    const georgianChars = (text.match(GEORGIAN_RE) || []).length;
    if (words < minWords || words > maxWords) return false;
    if (georgianChars < 20) return false;
    if (CYRILLIC_RE.test(text)) return false;       // absolute: no Cyrillic in Georgian
    if (LONG_LATIN_WORD_RE.test(text)) return false; // no English words (acronyms ok)
    return true;
}

/** Low-level OpenRouter chat call → raw message content (or null on any failure). */
async function chatRaw(apiKey: string, model: string, sys: string, user: string): Promise<string | null> {
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
        return null; // network error → caller tries next model
    }
    if (!res.ok) return null; // 429 / 5xx → next model in chain
    const json = await res.json().catch(() => null);
    return json?.choices?.[0]?.message?.content ?? null;
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
    const raw = await chatRaw(apiKey, model, sys, user);
    if (!raw) return null;
    const text = extractComment(raw);
    return isValidGeorgian(text) ? text : null;
}

async function callReplyModel(
    apiKey: string,
    model: string,
    persona: AIPersona,
    post: PostSeed,
    parentText: string,
): Promise<string | null> {
    const sys =
        `You are ${persona.voice}\n` +
        `Reply to another reader's Georgian comment under this blog post. 8-25 words, in your persona's voice — agree, gently push back, or add one thought.\n` +
        `Rules: natural spoken Georgian; real Georgian words; you MAY keep short acronyms (AI, GPT); NO Cyrillic; no hashtags, quotes or emojis.\n` +
        `Output ONLY the reply on a single line.`;
    const user = `Post title: ${post.title}\nThe comment you are replying to: ${parentText}`;
    const raw = await chatRaw(apiKey, model, sys, user);
    if (!raw) return null;
    const text = extractComment(raw);
    return isValidGeorgian(text, 6, 30) ? text : null;
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

/** Generate one reply (different persona) to a comment, walking the model chain. */
async function generateReplyForPersona(
    apiKey: string,
    persona: AIPersona,
    post: PostSeed,
    parentText: string,
): Promise<string | null> {
    for (const model of MODEL_CHAIN) {
        const r = await callReplyModel(apiKey, model, persona, post, parentText);
        if (r) return r;
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
    | { skipped: true; existing: number }
    | { augmented: true; likedAdded: number; replyAdded: number; existing: number };

interface ExistingComment {
    _id: unknown;
    persona?: string;
    content: string;
    parentId?: unknown;
    likedBy?: unknown[];
}

/** Insert one reply by a persona NOT already used in the thread. Returns true on success. */
async function buildReply(
    commentKey: string,
    seed: PostSeed,
    usedPersonaIds: string[],
    parentContent: string,
    parentId: unknown,
): Promise<boolean> {
    const used = new Set(usedPersonaIds.filter(Boolean));
    const pool = AI_PERSONAS.filter((p) => !used.has(p.id));
    const candidates = pool.length ? pool : AI_PERSONAS;
    const replyPersona = candidates[Math.floor(Math.random() * candidates.length)];
    if (!replyPersona) return false;
    const apiKey = process.env.OPENROUTER_API_KEY!;
    const replyText = await generateReplyForPersona(apiKey, replyPersona, seed, parentContent);
    if (!replyText) return false;
    const likedBy = pickRandomLikers(1, 5, replyPersona.id);
    await Comment.create({
        postId: commentKey,
        author: { name: replyPersona.name, avatar: replyPersona.avatar },
        content: replyText,
        isAI: true,
        persona: replyPersona.id,
        parentId,
        likedBy,
        likes: likedBy.length,
        status: 'approved',
    });
    return true;
}

/** Backfill likes + one reply onto comments that already exist (created before this logic). */
async function augmentExistingComments(
    commentKey: string,
    seed: PostSeed,
    existingDocs: ExistingComment[],
): Promise<SaveCommentsResult> {
    let likedAdded = 0;
    for (const c of existingDocs) {
        if (!c.likedBy || c.likedBy.length === 0) {
            const likedBy = pickRandomLikers(1, 6, c.persona);
            await Comment.updateOne({ _id: c._id }, { $set: { likedBy, likes: likedBy.length } });
            likedAdded++;
        }
    }

    let replyAdded = 0;
    const hasReply = existingDocs.some((c) => c.parentId);
    const topLevel = existingDocs.filter((c) => !c.parentId);
    if (!hasReply && topLevel.length >= 1) {
        const parent = topLevel[0];
        const usedIds = existingDocs.map((c) => c.persona).filter(Boolean) as string[];
        if (await buildReply(commentKey, seed, usedIds, parent.content, parent._id)) replyAdded = 1;
    }

    // Nothing was missing → report as a clean skip (fully complete already)
    if (likedAdded === 0 && replyAdded === 0) {
        return { skipped: true, existing: existingDocs.length };
    }
    return { augmented: true, likedAdded, replyAdded, existing: existingDocs.length };
}

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

    // If AI comments already exist, backfill likes + a reply instead of skipping.
    const existingDocs = await Comment.find({ postId: commentKey, isAI: true })
        .sort({ createdAt: 1 })
        .lean<ExistingComment[]>();
    if (existingDocs.length > 0) {
        return augmentExistingComments(commentKey, seed, existingDocs);
    }

    const generated = await generatePersonaComments(seed);
    if (generated.length === 0) return { created: 0 };

    const docs = await Comment.insertMany(
        generated.map((g) => {
            const likedBy = pickRandomLikers(1, 6, g.personaId);
            return {
                postId: commentKey,
                author: { name: g.name, avatar: g.avatar },
                content: g.content,
                isAI: true,
                persona: g.personaId,
                likedBy,
                likes: likedBy.length,
                status: 'approved',
            };
        }),
    );

    // Make the thread feel alive: a different persona replies to the first comment.
    let replies = 0;
    if (docs.length >= 2) {
        const usedIds = generated.map((g) => g.personaId);
        if (await buildReply(commentKey, seed, usedIds, generated[0].content, docs[0]._id)) replies = 1;
    }

    return { created: docs.length + replies };
}

/**
 * Seed AI-persona "likes" on a content doc (Post / Insight / Video). Idempotent:
 * if it already has likers it returns the current count and changes nothing.
 */
export async function seedLikes(model: mongoose.Model<any>, id: string): Promise<number> {
    await dbConnect();
    const doc = await model.findById(id).select('likedBy').lean<{ likedBy?: unknown[] } | null>();
    if (!doc) return 0;
    if (Array.isArray(doc.likedBy) && doc.likedBy.length > 0) return doc.likedBy.length;
    const likers = pickRandomLikers(2, 7);
    await model.updateOne({ _id: id }, { $set: { likedBy: likers } });
    return likers.length;
}
