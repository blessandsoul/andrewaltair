/**
 * Generates Georgian AI-persona comments for a blog post via the Google Gemini API (direct).
 *
 * Model chain (canonical: MODEL_CHAIN in openrouter-georgian.ts): PRIMARY = Gemini 2.5
 * Flash-Lite (clean Georgian, cheap, free-tier eligible) → Gemini 2.5 Flash (catches the
 * rare lite rejection). Thinking is forced OFF per call. Override with env GEMINI_MODELS.
 * Auth = env GEMINI_API_KEY.
 *
 * Output is validated: must be Georgian Mkhedruli, no Cyrillic, ~12-40 words.
 */

import mongoose from 'mongoose';

import { AIPersona, pickRandomPersonas, pickRandomLikers, AI_PERSONAS } from '@/lib/ai-personas';
import { pickReactionAngle } from '@/lib/georgian-forum-personas';
import { brainBlock } from '@/lib/brains/brainBlock';
import { MODEL_CHAIN, chatRaw, extractGeorgian, isValidGeorgian, sanitizeForPrompt, polishGeorgian } from '@/lib/openrouter-georgian';
import dbConnect from '@/lib/db';
import Comment from '@/models/Comment';

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

async function callModel(
    apiKey: string,
    model: string,
    persona: AIPersona,
    post: PostSeed,
): Promise<string | null> {
    const sys =
        `You ARE ${persona.name}. Speak in FIRST PERSON as this exact historical person — ${persona.voice}\n` +
        `WHO YOU ARE: ${persona.bio}\n` +
        `YOUR LENS (pull the topic here): ${persona.lens}\n` +
        `HOW YOU SPEAK: ${persona.style}\n` +
        `EXAMPLE of your voice: "${persona.sample}"\n` +
        brainBlock(persona.id, 'trim') +
        `Leave ONE short blog comment in GEORGIAN (Mkhedruli), 12-22 words, reacting to THIS specific story — like the real you, not a generic philosopher.\n` +
        `React to a concrete detail of the actual story; be unmistakably YOU (a light hint of your deeds/lens). Angle for THIS comment (vary it): ${pickReactionAngle()}\n` +
        `READABILITY: simple modern Georgian, short clear sentences, reads aloud easily like a smart friend — specificity comes from real facts, NOT fancy or archaic words.\n` +
        `BANNED: vague filler/life-lessons ("პერსპექტივა"/"სიმარტივე"/"პრინციპი"/"არსი") and any comment generic enough for a different article.\n` +
        `Georgian Mkhedruli ONLY — NO Chinese/Korean/Japanese/Arabic/Hebrew/Cyrillic; short acronyms (AI, GPT) ok; no hashtags, quotes or emojis.\n` +
        `Think silently. Output ONLY the comment on a single line.`;
    const user = `Story title: ${sanitizeForPrompt(post.title)}\nWhat it is about: ${sanitizeForPrompt(post.excerpt || '')}\nComment specifically about THIS story.`;
    const raw = await chatRaw(apiKey, model, sys, user);
    if (!raw) return null;
    const text = extractGeorgian(raw);
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
        `You ARE ${persona.name} — ${persona.voice}\n` +
        `WHO YOU ARE: ${persona.bio}\n` +
        `YOUR LENS: ${persona.lens}\n` +
        `HOW YOU SPEAK: ${persona.style}\n` +
        brainBlock(persona.id, 'trim') +
        `Reply to another reader's Georgian comment under this story. 8-20 words, FIRST PERSON, like the real you — agree, joke, gently disagree, or add ONE concrete point. Tie it to your lens, never lecture.\n` +
        `READABILITY: simple modern Georgian, short clear sentence; specificity from real facts, not fancy words.\n` +
        `Georgian Mkhedruli ONLY — NO Chinese/Korean/Japanese/Arabic/Hebrew/Cyrillic; short acronyms ok; no hashtags, quotes or emojis.\n` +
        `Output ONLY the reply on a single line.`;
    const user = `Story: ${sanitizeForPrompt(post.title)}\nThe comment you are replying to: ${sanitizeForPrompt(parentText)}`;
    const raw = await chatRaw(apiKey, model, sys, user);
    if (!raw) return null;
    const text = extractGeorgian(raw);
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
            const polished = await polishGeorgian(apiKey, content, 10, 30);
            return { personaId: persona.id, name: persona.name, avatar: persona.avatar, content: polished };
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
        if (r) return await polishGeorgian(apiKey, r, 6, 35);
    }
    return null;
}

/** Run async `fn` over `items` with a fixed concurrency limit (throttle to avoid 429s). */
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
    const out: R[] = new Array(items.length);
    let next = 0;
    async function worker(): Promise<void> {
        for (let i = next++; i < items.length; i = next++) {
            out[i] = await fn(items[i]);
        }
    }
    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
    return out;
}

/** Generate a comment for each given persona (throttled); returns only the survivors. */
async function generateForPersonas(
    apiKey: string,
    personas: AIPersona[],
    post: PostSeed,
): Promise<GeneratedComment[]> {
    const results = await mapLimit(personas, GEN_CONCURRENCY, (p) =>
        generateForPersona(apiKey, p, post).catch(() => null),
    );
    return results.filter((c): c is GeneratedComment => c !== null);
}

/**
 * Generate `count` (default 3-5) AI-persona comments for a post.
 * Returns only the comments that passed validation — never throws on per-persona failure.
 */
export async function generatePersonaComments(
    post: PostSeed,
    count?: number,
): Promise<GeneratedComment[]> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set');
    const n = count ?? 3 + Math.floor(Math.random() * 3); // 3-5
    return generateForPersonas(apiKey, pickRandomPersonas(n), post);
}

export interface TopUpResult {
    created: number;       // new top-level AI ("great") comments added this run
    likedAdded: number;    // existing comments back-filled with likers
    replyAdded: number;    // 1 if a reply was added this run
    total: number;         // distinct great personas now present as top-level comments
    target: number;        // how many greats we aim for
    missing: number;       // greats still missing (0 = complete)
    complete: boolean;     // total >= target
}

/** Normal/auto path (publish trigger) tops up to this many distinct personas. */
export const DEFAULT_COMMENT_TARGET = 5;
/** "Fill all greats" button tops up to the full persona roster. */
export const FULL_COMMENT_TARGET = AI_PERSONAS.length;
/** Cap personas generated per single invocation (bounds serverless time). Loop the route to finish. */
const MAX_PER_CALL = 5;
/** Concurrency for OpenRouter persona calls (avoids self-inflicted 429s). */
const GEN_CONCURRENCY = 2;

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
    const apiKey = process.env.GEMINI_API_KEY!;
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

/** Shuffle a copy of an array (Fisher–Yates). */
function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Ensure a content item has AI-persona ("great") comments up to `target` DISTINCT personas.
 *
 * Top-up semantics — counts which greats ALREADY commented and generates ONLY the missing
 * ones (capped at MAX_PER_CALL per call). Also back-fills likes and guarantees one reply once
 * the thread has >=2 top-level comments. Idempotent + repeatable: if some personas fail
 * validation/rate-limit this run, call again and it fills the still-missing ones (never
 * locks after the first comment like the old logic did).
 */
export async function topUpComments(
    commentKey: string,
    seed: PostSeed,
    target = DEFAULT_COMMENT_TARGET,
): Promise<TopUpResult> {
    await dbConnect();

    const existing = await Comment.find({ postId: commentKey, isAI: true })
        .sort({ createdAt: 1 })
        .lean<ExistingComment[]>();
    const topLevel = existing.filter((c) => !c.parentId);
    const usedIds = new Set(topLevel.map((c) => c.persona).filter(Boolean) as string[]);

    // Back-fill likes on any existing comment that has none.
    let likedAdded = 0;
    for (const c of existing) {
        if (!c.likedBy || c.likedBy.length === 0) {
            const likedBy = pickRandomLikers(1, 6, c.persona);
            await Comment.updateOne({ _id: c._id }, { $set: { likedBy, likes: likedBy.length } });
            likedAdded++;
        }
    }

    // Which greats still need to comment — generate up to MAX_PER_CALL of them this run.
    const need = Math.max(0, target - topLevel.length);
    const missingPersonas = shuffle(AI_PERSONAS.filter((p) => !usedIds.has(p.id)))
        .slice(0, Math.min(need, MAX_PER_CALL));

    let created = 0;
    let firstCreated: { id: unknown; content: string } | null = null;
    const newPersonaIds: string[] = [];
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && missingPersonas.length > 0) {
        const generated = await generateForPersonas(apiKey, missingPersonas, seed);
        if (generated.length > 0) {
            const payload = generated.map((g) => {
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
            });
            // ordered:false so one bad doc never aborts the rest.
            let docs: { _id: unknown }[] = [];
            try {
                docs = (await Comment.insertMany(payload, { ordered: false })) as unknown as { _id: unknown }[];
            } catch (e: unknown) {
                docs = (e as { insertedDocs?: { _id: unknown }[] })?.insertedDocs ?? [];
            }
            created = docs.length;
            generated.forEach((g) => newPersonaIds.push(g.personaId));
            if (docs[0]) firstCreated = { id: docs[0]._id, content: generated[0].content };
        }
    }

    // Make the thread feel alive: one reply by an unused persona, once >=2 top-level exist.
    let replyAdded = 0;
    const totalTop = topLevel.length + created;
    const hasReply = existing.some((c) => c.parentId);
    if (!hasReply && totalTop >= 2) {
        const parent = topLevel[0]
            ? { id: topLevel[0]._id, content: topLevel[0].content }
            : firstCreated;
        if (parent) {
            const usedForReply = [...usedIds, ...newPersonaIds];
            if (await buildReply(commentKey, seed, usedForReply, parent.content, parent.id)) {
                replyAdded = 1;
            }
        }
    }

    return {
        created,
        likedAdded,
        replyAdded,
        total: totalTop,
        target,
        missing: Math.max(0, target - totalTop),
        complete: totalTop >= target,
    };
}

/**
 * Generate AND persist AI-persona comments for any content item, keyed by `commentKey`
 * (the value used as Comment.postId on the public page — bare _id for posts/insights/videos).
 *
 * Tops up to `target` distinct personas (default DEFAULT_COMMENT_TARGET). Re-running adds the
 * still-missing personas instead of locking after the first comment.
 * Shared by the posts/insights/videos ai-comments routes.
 */
export async function generateAndSaveComments(
    commentKey: string,
    seed: PostSeed,
    target = DEFAULT_COMMENT_TARGET,
): Promise<TopUpResult> {
    return topUpComments(commentKey, seed, target);
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
