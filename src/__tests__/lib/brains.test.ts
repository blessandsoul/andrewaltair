/**
 * Brain registry contract — every roster persona has a ready PersonaBrain, every brain
 * is registered under its own id, brainBlock() assembles within the token budget, and
 * relations reference only real roster ids. Run after the 29 brain files land.
 */

import { describe, it, expect, afterEach } from 'vitest';

import { FORUM_PERSONAS } from '@/lib/georgian-forum-personas';
import { AI_PERSONAS } from '@/lib/ai-personas';
import { BRAINS, getBrain } from '@/lib/brains';
import { brainBlock } from '@/lib/brains/brainBlock';

const ROSTER_IDS = Array.from(
    new Set([...FORUM_PERSONAS.map((p) => p.id), ...AI_PERSONAS.map((p) => p.id)]),
);

// Cyrillic or CJK/Arabic/Hebrew in the prompt block = research drift (content must be
// English; Georgian display names in relations are expected and allowed).
const BANNED_SCRIPTS_RE = /[Ѐ-ӿ一-鿿぀-ヿ가-힯؀-ۿ֐-׿]/;

// Measured corpus: FULL 4.5-6.1K chars (~1.1-1.5K tokens), TRIM 2.3-3.1K. Ceilings guard
// against future bloat, not against the researched density (input-side only, Flash-Lite).
const FULL_MAX_CHARS = 6500;
const TRIM_MAX_CHARS = 3300;

afterEach(() => {
    delete process.env.BRAINS;
});

describe('brain registry coverage', () => {
    it('covers every roster persona (29 unique ids)', () => {
        expect(ROSTER_IDS.length).toBe(29);
        for (const id of ROSTER_IDS) {
            const b = getBrain(id);
            expect(b, `brain missing for "${id}"`).toBeDefined();
            expect(b!.oneLine, `brain "${id}" not ready (empty oneLine)`).toBeTruthy();
        }
    });

    it('every brain is registered under its own id and matches it', () => {
        for (const [key, b] of Object.entries(BRAINS)) {
            expect(b.id, `registry key "${key}" holds brain with id "${b.id}"`).toBe(key);
        }
    });

    it('stalin and beria carry criticalFraming', () => {
        for (const id of ['stalin', 'beria']) {
            expect(getBrain(id)?.criticalFraming, `${id} missing criticalFraming`).toBeTruthy();
        }
    });
});

describe('brain content sanity', () => {
    it('quotes: 0-6 per brain (0 = none survived verification, never invented), each short', () => {
        for (const id of ROSTER_IDS) {
            const b = getBrain(id)!;
            expect(b.quotes.length, `${id} quotes count`).toBeLessThanOrEqual(6);
            for (const q of b.quotes) {
                expect(q.length, `${id} quote too long: "${q.slice(0, 40)}…"`).toBeLessThanOrEqual(250);
            }
        }
    });

    it('relations reference only real roster ids, never self', () => {
        for (const id of ROSTER_IDS) {
            const b = getBrain(id)!;
            for (const r of b.relations) {
                expect(ROSTER_IDS, `${id} relation → unknown id "${r.id}"`).toContain(r.id);
                expect(r.id, `${id} relation → itself`).not.toBe(id);
                expect(r.note, `${id} → ${r.id} relation note empty`).toBeTruthy();
            }
        }
    });
});

describe('brainBlock assembly', () => {
    it('returns a non-empty English block for every persona, both variants', () => {
        for (const id of ROSTER_IDS) {
            for (const variant of ['full', 'trim'] as const) {
                const block = brainBlock(id, variant);
                expect(block.length, `${id} ${variant} block empty`).toBeGreaterThan(200);
                expect(block, `${id} ${variant} block has banned script`).not.toMatch(BANNED_SCRIPTS_RE);
                expect(block).toContain('PSYCHE:');
            }
        }
    });

    it('stays within the token budget', () => {
        for (const id of ROSTER_IDS) {
            expect(brainBlock(id, 'full').length, `${id} FULL over budget`).toBeLessThanOrEqual(FULL_MAX_CHARS);
            expect(brainBlock(id, 'trim').length, `${id} TRIM over budget`).toBeLessThanOrEqual(TRIM_MAX_CHARS);
        }
    });

    it('trim variant drops depth sections', () => {
        for (const id of ROSTER_IDS) {
            const trim = brainBlock(id, 'trim');
            expect(trim).not.toContain('LIFE FACTS:');
            expect(trim).not.toContain('HOW YOU SEE THE OTHERS HERE:');
        }
    });

    it('unknown id and BRAINS=off both degrade to empty string', () => {
        expect(brainBlock('no_such_persona', 'full')).toBe('');
        process.env.BRAINS = 'off';
        expect(brainBlock('einstein', 'full')).toBe('');
    });
});
