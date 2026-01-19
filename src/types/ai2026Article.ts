// Type definitions for AI 2026 Article JSON structure
// "Apocalyptic Tech" theme article types

export interface AI2026Meta {
    title: string;
    slug: string;
    category: string;
    tags: string[];
    id: string;
    reading_time: string;
    difficulty: string;
    author: {
        name: string;
        role: string;
    };
}

export interface AI2026SEO {
    excerpt: string;
    key_points: string[];
    toc: string[];
    faq: FAQItem[];
    entities: string[];
}

export interface FAQItem {
    question: string;
    answer: string;
}

// Section Types
export interface IntroSection {
    type: 'intro';
    content: string;
}

export interface ContentSection {
    type: 'section';
    content: string;
}

export interface CalloutSection {
    type: 'callout';
    variant: 'warning' | 'tip' | 'example' | 'counter';
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
    author?: string;
    desc?: string;
    link?: string;
}

export interface ResourceCategory {
    name: string;
    items: ResourceItem[];
}

export interface ResourcesSection {
    type: 'resources';
    categories: ResourceCategory[];
}

export interface FactSection {
    type: 'fact';
    content: string;
}

export type AI2026ContentSection =
    | IntroSection
    | ContentSection
    | CalloutSection
    | QuizSection
    | ResourcesSection
    | FactSection;

export interface AI2026ArticleData {
    meta: AI2026Meta;
    seo: AI2026SEO;
    content: AI2026ContentSection[];
}
