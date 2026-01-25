// Type definitions for Generic Article JSON structure

export interface ArticleMeta {
    title: string;
    description?: string; // made optional
    slug?: string;
    category?: string;
    id?: string;
    reading_time_minutes?: string; // mapped from reading_time
    reading_time?: string; // support direct
    difficulty: string;
    last_updated?: string;
    tags: string[];
    validation_hash?: string;
    author?: {
        name: string;
        role: string;
    };
}

export interface SchemaOrg {
    "@context": string;
    "@type": string;
    headline: string;
    datePublished: string;
    author: {
        "@type": string;
        name: string;
    };
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface TimelineEvent {
    year: string;
    title: string;
    desc: string;
}

export interface HighlightQuote {
    text: string;
    author: string;
    year: string;
}

export interface Warning {
    title: string;
    desc: string;
}

export interface MythFactPair {
    myth: string;
    fact: string;
}

export interface CallToAction {
    text: string;
    url: string;
    type: string;
}

// Section Types
export interface SectionIntro {
    type: 'section_intro';
    heading: string;
    body: string;
    image_prompt: string;
}

export interface TimelineSection {
    type: 'timeline';
    heading: string;
    intro: string;
    events: TimelineEvent[];
    body: string;
    image_prompt: string;
}

export interface SectionStandard {
    type: 'section_standard';
    heading: string;
    highlight_quote?: HighlightQuote;
    body: string;
    image_prompt: string;
}

export interface ComparisonTableSection {
    type: 'comparison_table';
    heading: string;
    intro: string;
    table_headers: string[];
    table_rows: string[][];
    body: string;
    image_prompt: string;
}

export interface ChecklistSection {
    type: 'checklist_section';
    heading: string;
    checklist: string[];
    body: string;
    image_prompt: string;
}

// New Types for AI 2026 Article
export interface SectionSimpleIntro {
    type: 'intro';
    content: string;
}

export interface SectionSimple {
    type: 'section';
    content: string;
}

export interface CalloutSection {
    type: 'callout';
    variant: 'warning' | 'info' | 'tip';
    content: string;
}

export interface FactSection {
    type: 'fact';
    content: string;
}

export interface QuizQuestion {
    q: string;
    options: string[];
    scores: number[];
}

export interface QuizResult {
    title: string;
    desc: string;
    color: string;
}

export interface QuizSection {
    type: 'quiz';
    title: string;
    questions: QuizQuestion[];
    results: Record<string, QuizResult>;
}

export interface ResourceItem {
    title: string;
    link?: string;
    desc?: string;
}

export interface ResourceCategory {
    name: string;
    items: ResourceItem[];
}

export interface ResourcesSection {
    type: 'resources';
    categories: ResourceCategory[];
}

export interface WarningSection {
    type: 'warning_section';
    heading: string;
    body: string;
    warnings: Warning[];
    image_prompt: string;
}

export interface MythsFactsSection {
    type: 'myths_facts';
    heading: string;
    pairs: MythFactPair[];
    body: string;
}

export interface SectionOutro {
    type: 'section_outro';
    heading: string;
    body: string;
    call_to_action: CallToAction;
    image_prompt: string;
}

export type ContentSection =
    | SectionIntro
    | TimelineSection
    | SectionStandard
    | ComparisonTableSection
    | ChecklistSection
    | WarningSection
    | MythsFactsSection
    | SectionOutro
    // New types
    | SectionSimpleIntro
    | SectionSimple
    | CalloutSection
    | FactSection
    | QuizSection
    | ResourcesSection;

export interface ArticleData {
    meta: ArticleMeta;
    schema_org?: SchemaOrg;
    faq_schema?: FAQItem[];
    seo?: {
        excerpt?: string;
        key_points?: string[];
        toc?: string[];
        faq?: { question: string; answer: string; }[];
        entities?: string[];
    };
    glossary?: Record<string, string>;
    content: ContentSection[];
}
