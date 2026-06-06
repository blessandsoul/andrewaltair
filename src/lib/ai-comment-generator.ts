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
import { pickReactionAngle } from '@/lib/georgian-forum-personas';
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
