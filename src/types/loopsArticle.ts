// Type definitions for the LOOPS encyclopedia course.
// Reuses the generic ArticleMeta + standard ContentSection from article.ts,
// and adds 4 LOOPS-specific infographic section types rendered by
// src/components/loops/LoopsArticleRenderer.tsx.

import { ArticleMeta, SchemaOrg, FAQItem, ContentSection } from '@/types/article';

// One node inside an info-card grid (icon resolved by name, never an emoji).
export interface LoopCard {
    icon?: string;
    title: string;
    desc: string;
}

// Circular loop diagram (custom SVG). The whole point of the course in one image.
export interface LoopCycleSection {
    type: 'loop_cycle';
    heading?: string;
    intro?: string;
    trigger: string;   // what starts the loop
    work: string;      // the agent does the work
    check: string;     // the goal-check question
    no: string;        // label on the "not yet" arrow back to work
    done: string;      // label on the "goal met" exit
    caption?: string;
}

// Responsive grid of icon cards. Cells follow the card count (no forced 3-equal row).
export interface LoopCardsSection {
    type: 'loop_cards';
    heading?: string;
    intro?: string;
    columns?: 2 | 3;
    cards: LoopCard[];
}

// One side of a two-column comparison.
export interface LoopCompareColumn {
    title: string;
    icon?: string;
    accent?: 'indigo' | 'green' | 'amber' | 'rose' | 'sky';
    items: string[];
    example?: string;
}

// Two-column comparison with Georgian labels (our own, so chrome is not English).
export interface LoopCompareSection {
    type: 'loop_compare';
    heading?: string;
    intro?: string;
    left: LoopCompareColumn;
    right: LoopCompareColumn;
}

// Numbered vertical step flow (a worked example, step by step).
export interface LoopStep {
    title: string;
    desc: string;
}

export interface LoopStepsSection {
    type: 'loop_steps';
    heading?: string;
    intro?: string;
    steps: LoopStep[];
}

export type LoopInfographicSection =
    | LoopCycleSection
    | LoopCardsSection
    | LoopCompareSection
    | LoopStepsSection;

// A LOOPS lesson can mix the standard article sections with our infographic sections.
export type LoopsContentSection = ContentSection | LoopInfographicSection;

export interface LoopsArticleData {
    meta: ArticleMeta;
    schema_org?: SchemaOrg;
    faq_schema?: FAQItem[];
    glossary?: Record<string, string>;
    content: LoopsContentSection[];
}
