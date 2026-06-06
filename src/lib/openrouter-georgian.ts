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
    if (CYRILLIC_RE.test(text)) return false;       // absolute: no Cyrillic in Georgian
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
