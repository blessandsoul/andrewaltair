/**
 * check-brain-symmetry — dev-only audit of PersonaBrain relations.
 *
 * Run: npx tsx scripts/check-brain-symmetry.ts
 *
 * Reports (non-zero exit only on ERRORS):
 *  - ERROR: relation → unknown id / self-reference / registry key ≠ brain id
 *  - WARN:  asymmetric relation (A sees B, B has no entry for A) — legitimate for
 *           cross-era reverence (a later figure admiring an earlier one), so warnings
 *           are reviewed by a human, not auto-failed.
 *  - WARN:  stance tension (A allies B, but B clashes/disdains A) — usually a bug.
 */

import { BRAINS } from '../src/lib/brains';

const ids = new Set(Object.keys(BRAINS));
let errors = 0;
let warns = 0;

const COMPAT: Record<string, string[]> = {
    // stance of A→B : acceptable stances of B→A (when B has an entry at all)
    allies: ['allies', 'respects', 'reveres', 'wary'], // one side may be warmer (Noe↔Kakutsa)
    reveres: ['reveres', 'respects', 'allies', 'wary', 'disdains', 'clashes', 'fears'], // reverence may be unrequited
    respects: ['respects', 'allies', 'reveres', 'wary', 'clashes', 'disdains'],
    wary: ['wary', 'clashes', 'disdains', 'fears', 'respects', 'allies', 'reveres'], // father wary of son who reveres him
    disdains: ['disdains', 'clashes', 'wary', 'fears', 'respects', 'reveres'],
    clashes: ['clashes', 'disdains', 'wary', 'fears'],
    fears: ['disdains', 'clashes', 'wary', 'allies', 'respects'],
};

for (const [key, b] of Object.entries(BRAINS)) {
    if (b.id !== key) {
        console.log(`ERROR  registry key "${key}" holds brain id "${b.id}"`);
        errors++;
    }
    for (const r of b.relations) {
        if (!ids.has(r.id)) {
            console.log(`ERROR  ${b.id} → unknown id "${r.id}"`);
            errors++;
            continue;
        }
        if (r.id === b.id) {
            console.log(`ERROR  ${b.id} → relation to itself`);
            errors++;
            continue;
        }
        const back = BRAINS[r.id].relations.find((x) => x.id === b.id);
        if (!back) {
            console.log(`WARN   asymmetric: ${b.id} ${r.stance} ${r.id}, but ${r.id} has no entry for ${b.id}`);
            warns++;
        } else if (!COMPAT[r.stance]?.includes(back.stance)) {
            console.log(`WARN   stance tension: ${b.id} ${r.stance} ${r.id}, but ${r.id} ${back.stance} ${b.id}`);
            warns++;
        }
    }
}

const n = Object.keys(BRAINS).length;
console.log(`\nchecked ${n} brains — ${errors} error(s), ${warns} warning(s)`);
process.exit(errors > 0 ? 1 : 0);
