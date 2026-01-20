// Vibe Coding Library Content Data
// Source: vibecoding/content.json (Georgian translation)

export interface Article {
    id: string;
    title: string;
    content: string;
    isFree: boolean;
    tags?: string[];
}

export interface Category {
    id: string;
    title: string;
    icon: string;
    articles: Article[];
}

export interface VibeCodingData {
    projectTitle: string;
    language: string;
    telegramContact: string;
    categories: Category[];
}

export const VIBE_CODING_DATA: VibeCodingData = {
    projectTitle: "Vibe Coding",
    language: "ka",
    telegramContact: "https://t.me/andr3waltairchannel",
    categories: [
        {
            id: "intro",
            title: "შესავალი",
            icon: "🎯",
            articles: [
                {
                    id: "ra-aris-vibe-coding",
                    title: "რა არის Vibe Coding?",
                    isFree: true,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["Vibe Coding", "AI", "Future"]
                }
            ]
        }
    ]
};

// Helper function to get total article count
export function getTotalArticleCount(): number {
    return VIBE_CODING_DATA.categories.reduce(
        (acc, cat) => acc + cat.articles.length,
        0
    );
}

// Helper function to get free article count
export function getFreeArticleCount(): number {
    return VIBE_CODING_DATA.categories.reduce(
        (acc, cat) => acc + cat.articles.filter(a => a.isFree).length,
        0
    );
}

// Helper function to get article by id
export function getArticleById(articleId: string): Article | undefined {
    for (const category of VIBE_CODING_DATA.categories) {
        const article = category.articles.find(a => a.id === articleId);
        if (article) return article;
    }
    return undefined;
}

// Helper function to get next/prev articles
export function getAdjacentArticles(articleId: string): { prev?: Article; next?: Article } {
    const allArticles: Article[] = [];
    VIBE_CODING_DATA.categories.forEach(cat => {
        allArticles.push(...cat.articles);
    });

    const currentIndex = allArticles.findIndex(a => a.id === articleId);

    return {
        prev: currentIndex > 0 ? allArticles[currentIndex - 1] : undefined,
        next: currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : undefined
    };
}


// Helper function to get all articles
export function getAllArticles(): Article[] {
    const allArticles: Article[] = [];
    VIBE_CODING_DATA.categories.forEach(cat => {
        allArticles.push(...cat.articles);
    });
    return allArticles;
}
