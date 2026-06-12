/**
 * brainBlock — the single injection helper that turns a PersonaBrain into prompt text.
 *
 * FULL  (~900 tokens) — opinions, ask/council, duels: the showcase surfaces.
 * TRIM  (~350 tokens) — replies, predictions, blog comments: short outputs, core psyche only.
 *
 * Returns '' when the brain is missing/not-ready or env BRAINS=off, so every caller keeps
 * its legacy ${p.bio}/${p.lens}/${p.style} lines as the graceful fallback.
 */

import { getBrain } from './index';
import type { BrainRelation } from './types';
import { getForumPersona } from '@/lib/georgian-forum-personas';

export type BrainVariant = 'full' | 'trim';

function relLine(r: BrainRelation): string {
    // Georgian display name for forum figures (the model meets them by that name in
    // debates); blog-only figures fall back to the id.
    const p = getForumPersona(r.id);
    return `- ${p?.name ?? r.id}: ${r.stance} — ${r.note}`;
}

export function brainBlock(personaId: string, variant: BrainVariant = 'full'): string {
    if (process.env.BRAINS === 'off') return '';
    const b = getBrain(personaId);
    if (!b || !b.oneLine) return '';

    const core = [
        `PSYCHE: ${b.oneLine}`,
        b.temperament && `TEMPERAMENT: ${b.temperament}`,
        b.cognitiveStyle && `MIND: ${b.cognitiveStyle}`,
        b.values && `VALUES: ${b.values}`,
        b.worldview && `WORLDVIEW: ${b.worldview}`,
        b.speechDNA && `SPEECH DNA: ${b.speechDNA}`,
        b.hotButtons && `HOT BUTTONS: ${b.hotButtons}`,
        b.reactionMap && `REACTION MAP: ${b.reactionMap}`,
        b.quotes.length
            ? `REAL THINGS YOU SAID (echo the SPIRIT in Georgian, NEVER translate verbatim): ${b.quotes.map((q) => `"${q}"`).join(' ')}`
            : '',
    ];

    const framing = b.criticalFraming ? `FRAMING: ${b.criticalFraming}` : '';

    if (variant === 'trim') {
        return [...core, framing].filter(Boolean).join('\n') + '\n';
    }

    const depth = [
        b.biography && `LIFE FACTS: ${b.biography}`,
        b.fearsWounds && `WOUNDS & FEARS: ${b.fearsWounds}`,
        b.contradictions && `CONTRADICTIONS: ${b.contradictions}`,
        b.quirks && `QUIRKS: ${b.quirks}`,
        b.humor && `HUMOR: ${b.humor}`,
        b.relations.length ? `HOW YOU SEE THE OTHERS HERE:\n${b.relations.map(relLine).join('\n')}` : '',
    ];

    return [...core, ...depth, framing].filter(Boolean).join('\n') + '\n';
}
