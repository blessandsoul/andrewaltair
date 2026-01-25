export interface HeroModern {
    type: 'hero_modern';
    title: string;
    subtitle?: string;
    video_url?: string;
    image_url?: string;
    overlay_opacity?: number;
}

export interface TextColumns {
    type: 'text_columns';
    columns: string[]; // Array of markdown strings
    cols_count?: 2 | 3;
}

export interface HighlightBox {
    type: 'highlight_box';
    variant: 'tip' | 'warning' | 'idea' | 'quote';
    content: string;
    title?: string;
}

export interface QuoteMinimal {
    type: 'quote_minimal';
    text: string;
    author?: string;
    role?: string;
}

export interface AuthorBioInline {
    type: 'author_bio_inline';
    name: string;
    role: string;
    avatar_url: string;
    bio: string;
}

export interface StatGrid {
    type: 'stat_grid';
    stats: Array<{
        value: string;
        label: string;
        desc?: string;
        color?: string;
    }>;
}

export interface ComparisonTablePro {
    type: 'comparison_table_pro';
    features: string[];
    items: Array<{
        name: string;
        is_winner?: boolean;
        values: Array<boolean | string>; // true=check, false=cross, string=text
    }>;
}

export interface ProsConsCards {
    type: 'pros_cons_cards';
    pros: string[];
    cons: string[];
}

export interface TimelineVertical {
    type: 'timeline_vertical';
    events: Array<{
        date: string;
        title: string;
        desc: string;
    }>;
}

export interface ProcessSteps {
    type: 'process_steps';
    steps: Array<{
        title: string;
        desc: string;
    }>;
}

export interface GalleryMasonry {
    type: 'gallery_masonry';
    images: Array<{
        url: string;
        caption?: string;
        width?: number; // Aspect ratio helper
        height?: number;
    }>;
}

export interface ImageSlider {
    type: 'image_slider';
    items: Array<{
        url: string;
        label?: string; // e.g. "Before", "After"
    }>;
    variant: 'comparison' | 'carousel';
}

export interface VideoEmbedCustom {
    type: 'video_embed_custom';
    url: string; // YouTube or MP4
    thumbnail_url?: string;
    title?: string;
}

export interface AudioPodcast {
    type: 'audio_podcast';
    audio_url: string;
    title: string;
    duration?: string;
}

export interface CodeTerminal {
    type: 'code_terminal';
    lang: string;
    code: string;
    file_name?: string;
}

export interface FAQAccordion {
    type: 'faq_accordion';
    items: Array<{
        q: string;
        a: string;
    }>;
}

export interface CTABannerWide {
    type: 'cta_banner_wide';
    title: string;
    desc?: string;
    button_text: string;
    button_url: string;
    bg_image?: string;
}

export interface ProductCardMini {
    type: 'product_card_mini';
    name: string;
    desc: string;
    rating?: number;
    icon_url?: string;
    link?: string;
}

export interface QuizWidget {
    type: 'quiz_widget';
    question: string;
    options: Array<{
        text: string;
        is_correct?: boolean;
    }>;
    correct_message?: string;
}

export interface DownloadBox {
    type: 'download_box';
    title: string;
    file_size?: string;
    file_type?: string;
    download_url: string;
}

// Union Type
export type UniversalSectionType =
    | HeroModern | TextColumns | HighlightBox | QuoteMinimal | AuthorBioInline
    | StatGrid | ComparisonTablePro | ProsConsCards | TimelineVertical | ProcessSteps
    | GalleryMasonry | ImageSlider | VideoEmbedCustom | AudioPodcast | CodeTerminal
    | FAQAccordion | CTABannerWide | ProductCardMini | QuizWidget | DownloadBox;
