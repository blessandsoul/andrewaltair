/**
 * Shared GEMINI helpers for generating + validating GEORGIAN AI-persona text.
 *
 * Calls the Google Generative Language API DIRECTLY (not OpenRouter) — the blog-comment
 * engine and the /forum engine both reuse the same chatRaw call, model fallback chain and
 * Georgian-output validation. Direct Google = free-tier eligible + no 5.5% credit surcharge.
 * Auth = env GEMINI_API_KEY (get one free at https://aistudio.google.com/apikey).
 *
 * Thinking is forced OFF per call (thinkingBudget:0): these outputs are 12-22 word one-liners
 * that need no reasoning. Leaving it on makes Gemini 2.5 burn the whole maxOutputTokens budget
 * on hidden reasoning and return EMPTY content — that was the bug behind zero comments.
 * (File name kept as openrouter-georgian.ts to avoid churning ~12 import sites.)
 */

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// Model chain (Google direct, free-tier eligible): PRIMARY = Gemini 2.5 Flash-Lite (cheapest,
// fastest, clean Georgian) → 2.5 Flash (rare lite rejection) → 3.1 Flash-Lite (SEPARATE capacity
// pool — the escape hatch when both 2.5 models 503 "high demand" in a spike). Bare Google model
// IDs (no "google/" prefix). NOTE: the 2.0 series 404s "no longer available" on generateContent
// despite ListModels still listing it — do not use it. Override with env GEMINI_MODELS="id1,id2".
export const MODEL_CHAIN = (process.env.GEMINI_MODELS
    ? process.env.GEMINI_MODELS.split(',').map((s) => s.trim()).filter(Boolean)
    : ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-3.1-flash-lite']);

/** Thinking is a 2.5+/3.x feature — 2.0 models reject `thinkingConfig` with a 400. */
function supportsThinking(model: string): boolean {
    return /gemini-(2\.5|3)/.test(model);
}

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

// Same as FOREIGN_SCRIPT_RE but WITHOUT the Cyrillic block — strips genuine mojibake
// (Hebrew/Arabic/Thai/Hangul/Kana/CJK) while KEEPING Cyrillic + Latin + Georgian.
const MOJIBAKE_KEEP_CYRILLIC_RE = /[֐-׿؀-ۿݐ-ݿ฀-๿ᄀ-ᇿ぀-ヿ㐀-䶿一-鿿가-힯豈-﫿]/g;

/** Sanitize TRUSTED admin input that may be Russian/English — translate-to-Georgian sources.
 *  Keeps Cyrillic + Latin (the model translates them); only drops real mojibake scripts. */
export function sanitizeKeepCyrillic(text: string): string {
    return (text || '').replace(MOJIBAKE_KEEP_CYRILLIC_RE, '').trim();
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

/** Low-level Gemini generateContent call → raw text (or null on any failure).
 *  `apiKey` is the GEMINI_API_KEY; `model` is a bare Google model id (e.g. gemini-2.5-flash-lite).
 *  Thinking is disabled (thinkingBudget:0) so the model emits the short comment instead of
 *  spending the token budget on hidden reasoning (the empty-content bug). */
export async function chatRaw(
    apiKey: string,
    model: string,
    sys: string,
    user: string,
    opts: ChatOpts = {},
): Promise<string | null> {
    if (!apiKey) {
        console.error('[gemini] GEMINI_API_KEY missing');
        return null;
    }
    const url = `${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`;
    const generationConfig: Record<string, unknown> = {
        temperature: opts.temperature ?? 0.85,
        maxOutputTokens: opts.maxTokens ?? 1024,
    };
    // thinkingBudget:0 — OFF; short one-liners need no reasoning (leaving it on burns the whole
    // token budget on hidden reasoning → empty content). Only for thinking-capable models.
    if (supportsThinking(model)) generationConfig.thinkingConfig = { thinkingBudget: 0 };
    const payload = JSON.stringify({
        systemInstruction: { parts: [{ text: sys }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig,
    });
    // Retry TRANSIENT failures — 429 (rate limit) AND 5xx (503 UNAVAILABLE / "high demand"
    // capacity spikes) — with exponential backoff + jitter. 503 is a Google-side blip, so a
    // couple of backed-off retries usually ride it out instead of dropping the persona. Hard
    // errors (400 bad key, 404 bad model) fall straight through to the next model in the chain.
    const MAX_ATTEMPTS = 3;
    const backoff = (a: number) => new Promise((r) => setTimeout(r, 700 * 2 ** a + Math.random() * 300));
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const isLast = attempt === MAX_ATTEMPTS - 1;
        let res: Response;
        try {
            res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
            });
        } catch (e) {
            console.error(`[gemini] ${model} → network error:`, e instanceof Error ? e.message : e);
            if (isLast) return null;
            await backoff(attempt);
            continue; // network blip → back off + retry
        }
        if ((res.status === 429 || res.status >= 500) && !isLast) {
            await backoff(attempt);
            continue; // transient rate limit / capacity spike → back off + retry
        }
        if (!res.ok) {
            const errBody = await res.text().catch(() => '');
            console.error(`[gemini] ${model} → HTTP ${res.status}: ${errBody.slice(0, 200)}`);
            return null; // 400 / 404 / retries-exhausted 5xx → caller tries next model
        }
        const json = await res.json().catch(() => null);
        const parts = json?.candidates?.[0]?.content?.parts;
        const content = Array.isArray(parts)
            ? parts.map((p: { text?: string }) => p?.text ?? '').join('').trim()
            : '';
        if (!content) console.error(`[gemini] ${model} → no content:`, JSON.stringify(json).slice(0, 300));
        return content || null;
    }
    return null;
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
 * GEMINI_PROOFREAD_MODEL (else uses MODEL_CHAIN — Flash-Lite first).
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

    const proofModels = process.env.GEMINI_PROOFREAD_MODEL
        ? [process.env.GEMINI_PROOFREAD_MODEL, ...MODEL_CHAIN]
        : MODEL_CHAIN;

    for (const model of proofModels) {
        const raw = await chatRaw(apiKey, model, sys, input, { temperature: 0.2, maxTokens: 700 });
        if (!raw) continue;
        const cleaned = extractGeorgian(raw);
        if (isValidGeorgian(cleaned, minWords, maxWords)) return cleaned;
    }
    return input; // best-effort: at least the cyrillic-cleaned original
}
