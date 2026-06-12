/**
 * Brain registry — maps persona id → PersonaBrain. `rustaveli` serves BOTH rosters
 * (forum + blog comments). A missing/empty brain degrades gracefully: brainBlock()
 * returns '' and the legacy roster fields carry the persona as before.
 */

import type { PersonaBrain } from './types';

import { vakhtang } from './vakhtang';
import { david } from './david';
import { tamar } from './tamar';
import { erekle } from './erekle';
import { rustaveli } from './rustaveli';
import { ilia } from './ilia';
import { akaki } from './akaki';
import { vazha } from './vazha';
import { nikoladze } from './nikoladze';
import { noe } from './noe';
import { takaishvili } from './takaishvili';
import { javakhishvili } from './javakhishvili';
import { galaktion } from './galaktion';
import { k_gamsakhurdia } from './k_gamsakhurdia';
import { zviad } from './zviad';
import { mamardashvili } from './mamardashvili';
import { cholokashvili } from './cholokashvili';
import { stalin } from './stalin';
import { beria } from './beria';
import { bagration } from './bagration';
import { einstein } from './einstein';
import { tesla } from './tesla';
import { feynman } from './feynman';
import { curie } from './curie';
import { turing } from './turing';
import { jobs } from './jobs';
import { hawking } from './hawking';
import { davinci } from './davinci';
import { nietzsche } from './nietzsche';

export const BRAINS: Record<string, PersonaBrain> = {
    // Forum roster (20 Georgian figures)
    vakhtang,
    david,
    tamar,
    erekle,
    rustaveli, // also serves the blog-comment roster
    ilia,
    akaki,
    vazha,
    nikoladze,
    noe,
    takaishvili,
    javakhishvili,
    galaktion,
    k_gamsakhurdia,
    zviad,
    mamardashvili,
    cholokashvili,
    stalin,
    beria,
    bagration,
    // Blog-comment roster (global greats)
    einstein,
    tesla,
    feynman,
    curie,
    turing,
    jobs,
    hawking,
    davinci,
    nietzsche,
};

export function getBrain(id?: string): PersonaBrain | undefined {
    return id ? BRAINS[id] : undefined;
}

export type { PersonaBrain, BrainRelation } from './types';
