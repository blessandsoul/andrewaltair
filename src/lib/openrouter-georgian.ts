/**
 * Shared OpenRouter helpers for generating + validating GEORGIAN AI-persona text.
 *
 * Extracted from ai-comment-generator.ts so both the blog-comment engine and the
 * /forum engine reuse the exact same OpenRouter call, model fallback chain and
 * Georgian-output validation. Behaviour is unchanged from the original.
 *
 * Model chain (free tier): Gemma 4 31b → Gemma 4 26b-a4b fallback on rate-limit /
 * bad output. Both verified to produce clean, natural Georgian; the fallback exists
 * because the free tier returns 429 under load.
 */

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

export const MODEL_CHAIN = [
    'google/gemma-4-31b-it:free',
    'google/gemma-4-26b-a4b-it:free',
];

export const GEORGIAN_RE = /[Ⴀ-ჿ]/g;
export const CYRILLIC_RE = /[Ѐ-ӿ]/;
export const LONG_LATIN_WORD_RE = /[A-Za-z]{7,}/; // allow short acronyms (AI, GPT, API), reject English words

// Any non-Georgian, non-Latin SCRIPT that means the model drifted into garbage/mojibake:
// Cyrillic, Hebrew, Arabic, Thai, Hangul Jamo, Kana, CJK, Hangul syllables, CJK-compat.
// This is what lets us catch "საკუთარი 국민ის" (국민 = Korean U+AC00) which used to slip through.
export const FOREIGN_SCRIPT_RE =
    /[Ѐ-ԯ֐-׿؀-ۿݐ-ݿ฀-๿ᄀ-ᇿ぀-ヿ㐀-䶿一-鿿가-힯豈-﫿]/;

/** True if the text contains any foreign (non-Georgian/non-Latin) script character. */
export function hasForeignScript(text: string): boolean {
    return FOREIGN_SCRIPT_RE.test(text || '');
}

/** Strip foreign-script characters from UNTRUSTED input (excerpt/scraped/parent) before
 *  feeding it into a Gemma prompt — stops mojibake from priming the model. */
export function sanitizeForPrompt(text: string): string {
    return (text || '').replace(new RegExp(FOREIGN_SCRIPT_RE.source, 'g'), '').trim();
}

/** Strip <think> blocks / surrounding quotes; keep the last Georgian-heavy line. */
export function extractGeorgian(raw: string): string {
    let text = (raw || '').replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    // Reasoning-y models can emit drafts on multiple lines — keep the last Georgian-heavy line.
    const geoLines = text
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => (s.match(GEORGIAN_RE) || []).length > 10);
    if (geoLines.length) text = geoLines[geoLines.length - 1];
    return text.replace(/^["'„“]+|["'”]+$/g, '').trim();
}

/** True if text is natural Georgian Mkhedruli, no Cyrillic, no English words, within word bounds. */
export function isValidGeorgian(text: string, minWords = 12, maxWords = 45): boolean {
    if (!text) return false;
    const words = text.split(/\s+/).filter(Boolean).length;
    const georgianChars = (text.match(GEORGIAN_RE) || []).length;
    if (words < minWords || words > maxWords) return false;
    if (georgianChars < 20) return false;
    if (FOREIGN_SCRIPT_RE.test(text)) return false;  // no CJK/Korean/Arabic/Hebrew/Cyrillic mojibake
    if (LONG_LATIN_WORD_RE.test(text)) return false; // no English words (acronyms ok)
    return true;
}

export interface ChatOpts {
    temperature?: number;
    maxTokens?: number;
}

/** Low-level OpenRouter chat call → raw message content (or null on any failure). */
export async function chatRaw(
    apiKey: string,
    model: string,
    sys: string,
    user: string,
    opts: ChatOpts = {},
): Promise<string | null> {
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
                temperature: opts.temperature ?? 0.85,
                max_tokens: opts.maxTokens ?? 600,
            }),
        });
    } catch {
        return null; // network error → caller tries next model
    }
    if (!res.ok) return null; // 429 / 5xx → next model in chain
    const json = await res.json().catch(() => null);
    return json?.choices?.[0]?.message?.content ?? null;
}

/**
 * Walk the model fallback chain, returning the first response that passes a validator.
 * `build` maps (model) → raw text via chatRaw; `accept` validates the extracted text.
 * Returns the cleaned text or null if every model failed.
 */
export async function chainGeorgian(
    run: (model: string) => Promise<string | null>,
    accept: (text: string) => boolean,
): Promise<string | null> {
    for (const model of MODEL_CHAIN) {
        const raw = await run(model);
        if (!raw) continue;
        const text = extractGeorgian(raw);
        if (accept(text)) return text;
    }
    return null;
}

/**
 * Second pass — a Georgian "editor" cleans an already-generated line into natural, simple
 * everyday Georgian and strips any non-Georgian characters. Best-effort: if every model
 * fails or the result is invalid, the ORIGINAL text is returned (never throws, never 429s
 * the whole pipeline). This is how the /lang discipline is applied at runtime.
 */
export async function polishGeorgian(
    apiKey: string,
    text: string,
    minWords = 5,
    maxWords = 160,
): Promise<string> {
    if (!apiKey || !text) return text;
    const sys =
        'You are a Georgian proofreader. Fix ONLY what is broken: remove any non-Georgian characters (Chinese, Korean, Japanese, Arabic, Hebrew, Cyrillic) and repair awkward, unclear or wrong words into natural Georgian.\n' +
        'PRESERVE the author\'s voice, tone, personality, first-person stance and every concrete reference (names, deeds, places). Do NOT make it blander, more generic or more "wise"; do not flatten a vivid line into a neutral one. Keep the meaning, the character and roughly the same length.\n' +
        'You MAY keep short Latin acronyms (AI, GPT). No quotes, no notes, no emojis.\n' +
        'Output ONLY the corrected Georgian text on a single line.';
    for (const model of MODEL_CHAIN) {
        const raw = await chatRaw(apiKey, model, sys, text, { temperature: 0.3, maxTokens: 600 });
        if (!raw) continue;
        const cleaned = extractGeorgian(raw);
        if (isValidGeorgian(cleaned, minWords, maxWords)) return cleaned;
    }
    return text; // best-effort fallback
}
