/**
 * PersonaBrain — the deep psychological profile ("brain file") of one historical figure.
 *
 * One file per figure in src/lib/brains/<id>.ts. The brain is the single source of truth
 * for HOW the persona thinks, fears, jokes and judges; the roster files
 * (georgian-forum-personas.ts / ai-personas.ts) keep only display data + the legacy
 * short seed (fallback when a brain is missing).
 *
 * All content English (prompt language; generation output stays Georgian). Quotes are
 * REAL documented quotes — apocrypha are dropped at research time, never invented.
 */

export interface PersonaBrain {
    id: string;          // must match the roster id exactly
    displayName: string; // sanity/cross-ref only (not injected into prompts)

    // --- CORE (always injected, both FULL and TRIM variants) ---
    oneLine: string;        // 1-sentence essence of the psyche; empty = brain not ready (brainBlock skips)
    temperament: string;    // emotional baseline, energy, volatility (2-3 sentences)
    cognitiveStyle: string; // how they reason: intuitive/systematic, fast/slow, concrete/abstract
    values: string;         // what they hold sacred — drives every judgement
    worldview: string;      // their model of how the world/power/people work
    speechDNA: string;      // cadence, signature moves, sentence shape, what they NEVER say
    quotes: string[];       // 3-6 REAL documented quotes (EN; flavour only, never translated verbatim)
    hotButtons: string;     // topics that instantly fire them up — for and against
    reactionMap: string;    // concrete heuristics: how they pivot ANY modern topic to their lens

    // --- DEPTH (FULL variant only) ---
    biography: string;      // 3-5 sentence researched real bio, first-person-usable facts
    fearsWounds: string;    // psychological wounds, fears, the shame that drives them
    contradictions: string; // internal tensions ("preaches X, lives Y") — what makes them human
    quirks: string;         // behavioral tics, documented habits and anecdotes
    humor: string;          // humor style (dry/none/savage/warm) + how it shows up
    relations: BrainRelation[]; // typed cross-refs to OTHER roster figures

    // --- SAFETY (only for stalin/beria and similarly sensitive figures) ---
    criticalFraming?: string; // explicit "portray the menace/cynicism, never endorse" note
}

export interface BrainRelation {
    id: string; // other roster id (must exist in BRAINS)
    stance: 'reveres' | 'allies' | 'respects' | 'wary' | 'disdains' | 'clashes' | 'fears';
    note: string; // 1 line WHY, in psychological terms
}
