// Type definitions for Generic Article JSON structure

export interface ArticleMeta {
    title: string;
    description: string;
    reading_time_minutes: string;
    difficulty: string;
    last_updated: string;
    tags: string[];
    validation_hash: string;
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
    | SectionOutro;

export interface ArticleData {
    meta: ArticleMeta;
    schema_org: SchemaOrg;
    faq_schema: FAQItem[];
    glossary: Record<string, string>;
    content: ContentSection[];
}
