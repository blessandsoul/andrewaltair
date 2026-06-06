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

// Model chain: PRIMARY = Gemini 2.5 Flash Lite (clean Georgian, cheap, no free-tier 429),
// 2nd = Gemini 2.5 Flash (paid, reliable — catches the rare lite rejection WITHOUT hitting
// a rate-limited free model), LAST = free Gemma (best-effort safety net; it 429s under load,
// so it must never be the only fallback). Override with env OPENROUTER_MODELS="id1,id2,...".
export const MODEL_CHAIN = (process.env.OPENROUTER_MODELS
    ? process.env.OPENROUTER_MODELS.split(',').map((s) => s.trim()).filter(Boolean)
    : ['google/gemini-2.5-flash-lite', 'google/gemini-2.5-flash', 'google/gemma-4-31b-it:free']);

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
    // Keep ALL Georgian-bearing lines (drop English preamble / <think>), JOIN them —
    // previously we kept only the LAST line, which chopped multi-line answers mid-word.
    const geoLines = text
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => (s.match(GEORGIAN_RE) || []).length > 4);
    if (geoLines.length) text = geoLines.join(' ');
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
    } catch (e) {
        console.error(`[openrouter] ${model} → network error:`, e instanceof Error ? e.message : e);
        return null; // network error → caller tries next model
    }
    if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        console.error(`[openrouter] ${model} → HTTP ${res.status}: ${errBody.slice(0, 300)}`);
        return null; // 404 (bad model) / 401 (bad key) / 429 (rate limit) → next model
    }
    const json = await res.json().catch(() => null);
    const content = json?.choices?.[0]?.message?.content ?? null;
    if (!content) console.error(`[openrouter] ${model} → no content:`, JSON.stringify(json).slice(0, 300));
    return content;
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
// Unambiguous Cyrillic look-alikes → Georgian, fixed deterministically (cheap, exact)
// BEFORE the LLM proofread. Ambiguous т (→თ or ტ) is left for the LLM. Other Cyrillic
// (no look-alike) is left as-is and gets caught by the validator / LLM.
const CYRILLIC_FIX: Record<string, string> = {
    'а': 'ა', 'А': 'ა', 'е': 'ე', 'Е': 'ე', 'о': 'ო', 'О': 'ო', 'с': 'ს', 'С': 'ს',
    'у': 'უ', 'У': 'უ', 'х': 'ხ', 'Х': 'ხ', 'р': 'რ', 'Р': 'რ', 'и': 'ი', 'к': 'კ',
    'К': 'კ', 'н': 'ნ', 'Н': 'ნ', 'п': 'პ', 'л': 'ლ', 'в': 'ვ', 'д': 'დ', 'ж': 'ჟ',
};
export function fixCyrillicLookalikes(text: string): string {
    return (text || '').replace(/[Ѐ-ӿ]/g, (ch) => CYRILLIC_FIX[ch] ?? ch);
}

/** LANG corrector (2nd pass). ON by default; disable with FORUM_POLISH=off. */
export function polishEnabled(): boolean {
    return (process.env.FORUM_POLISH ?? 'on').toLowerCase() !== 'off';
}

/**
 * Georgian proofreader carrying the /lang agent's rules. Fixes spelling (e.g. თ/ტ:
 * "მთელი" not "მტელი"), Cyrillic injections, ergative, pronoun-drop, idioms — while
 * PRESERVING meaning, voice, numbers, names and sentence count. Best-effort: on failure
 * returns the (cyrillic-cleaned) original, never empty. Proofread model overridable via
 * OPENROUTER_PROOFREAD_MODEL (else uses MODEL_CHAIN — Gemini-first).
 */
export async function polishGeorgian(
    apiKey: string,
    text: string,
    minWords = 5,
    maxWords = 160,
): Promise<string> {
    if (!apiKey || !text || !polishEnabled()) return fixCyrillicLookalikes(text);
    const input = fixCyrillicLookalikes(text);
    const sys =
        'You are a strict Georgian (ქართული) proofreader. Fix spelling, grammar and machine-translation artifacts. PRESERVE the exact meaning, facts, numbers, names, tone/voice and the SAME number of sentences. Do NOT add, remove or rephrase ideas. Output ONLY the corrected Georgian text on one line — no quotes, no notes.\n' +
        'RULES (from the lang style guide):\n' +
        '1. 100% Mkhedruli. Remove any non-Georgian character; replace Cyrillic look-alikes with the correct Georgian letter.\n' +
        '2. Fix confusable consonants toward a REAL Georgian word: თ/ტ (correct "მთელი", NOT "მტელი"), ქ/კ, ჭ/ჩ, ფ/პ, ღ/გ/ხ, წ/ც/ძ, ხ/ჰ. If both spellings are valid words, leave it.\n' +
        '3. Ergative: past-transitive subject takes -მა ("კომპანიამ შექმნა", not "კომპანია შექმნა").\n' +
        '4. Emotion/sense verbs: experiencer is DATIVE ("ტექნოლოგია მიყვარს"; same for მინდა, მომწონს, მეშინია).\n' +
        '5. Correct preverbs (გამოუშვა≠გაუშვა, მოიტანა≠მიიტანა).\n' +
        '6. Inanimate plural → singular verb ("პროგრამები მუშაობს").\n' +
        '7. Numeral → singular noun ("ხუთმა კომპანიამ", not "ხუთი კომპანიები").\n' +
        '8. Drop redundant pronouns ის/მან/მას/მისი/მათ (the verb already carries person); if the actor becomes unclear, use the NAME instead of dropping.\n' +
        '9. No articles — delete ის/ეს used as "the"/"a".\n' +
        '10. Natural word order (verb near the end), active voice, max one რომელიც per sentence; split overly long clauses.\n' +
        '11. No literal idioms/calques — native phrasing (swap the metaphor verb, keep the noun); fix russisms and false-friends.\n' +
        'Keep short Latin acronyms (AI, GPT) and numbers as digits.';

    const proofModels = process.env.OPENROUTER_PROOFREAD_MODEL
        ? [process.env.OPENROUTER_PROOFREAD_MODEL, ...MODEL_CHAIN]
        : MODEL_CHAIN;

    for (const model of proofModels) {
        const raw = await chatRaw(apiKey, model, sys, input, { temperature: 0.2, maxTokens: 700 });
        if (!raw) continue;
        const cleaned = extractGeorgian(raw);
        if (isValidGeorgian(cleaned, minWords, maxWords)) return cleaned;
    }
    return input; // best-effort: at least the cyrillic-cleaned original
}
