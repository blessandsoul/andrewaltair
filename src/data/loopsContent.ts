// LOOPS encyclopedia course registry.
// Mirrors vibeCodingContent.ts: LOOPS_DATA + the same 5 helper functions (kept by
// name so the cloned route files / sidebar / library import them unchanged).
// Article `id` values match the JSON files in src/data/encyclopedia/loops/.

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
    icon: string; // Tabler icon NAME (resolved by the sidebar/landing), never an emoji
    articles: Article[];
}

export interface LoopsData {
    projectTitle: string;
    language: string;
    telegramContact: string;
    categories: Category[];
}

export const LOOPS_DATA: LoopsData = {
    projectTitle: "Loops",
    language: "ka",
    telegramContact: "https://t.me/andr3waltairchannel",
    categories: [
        {
            id: "safudzvlebi",
            title: "საფუძვლები",
            icon: "bulb",
            articles: [
                {
                    id: "01-ra-aris-cikli",
                    title: "რა არის ციკლი (Loop)?",
                    isFree: true,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["ციკლი", "AI აგენტი", "ავტომატიზაცია", "Loops"]
                },
                {
                    id: "02-trigeri-da-mizani",
                    title: "ციკლის ორი ნაწილი: ტრიგერი და მიზანი",
                    isFree: true,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["ტრიგერი", "მიზანი", "LLM მსაჯი", "AI აგენტი"]
                }
            ]
        },
        {
            id: "praktika",
            title: "პრაქტიკა",
            icon: "rocket",
            articles: [
                {
                    id: "03-ciklebis-biblioteka",
                    title: "ციკლების ბიბლიოთეკა: რეალური მაგალითები",
                    isFree: true,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["Loop Library", "მაგალითები", "ავტომატიზაცია", "Codex"]
                },
                {
                    id: "04-sad-gamodgeba",
                    title: "სად გამოდგება ციკლი და სად არა",
                    isFree: true,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["შეზღუდვები", "ღირებულება", "ტოკენები", "AI აგენტი"]
                }
            ]
        }
    ]
};

// Total article count
export function getTotalArticleCount(): number {
    return LOOPS_DATA.categories.reduce((acc, cat) => acc + cat.articles.length, 0);
}

// Free article count
export function getFreeArticleCount(): number {
    return LOOPS_DATA.categories.reduce(
        (acc, cat) => acc + cat.articles.filter(a => a.isFree).length,
        0
    );
}

// Article by id
export function getArticleById(articleId: string): Article | undefined {
    for (const category of LOOPS_DATA.categories) {
        const article = category.articles.find(a => a.id === articleId);
        if (article) return article;
    }
    return undefined;
}

// Adjacent (prev / next) articles
export function getAdjacentArticles(articleId: string): { prev?: Article; next?: Article } {
    const allArticles: Article[] = [];
    LOOPS_DATA.categories.forEach(cat => {
        allArticles.push(...cat.articles);
    });

    const currentIndex = allArticles.findIndex(a => a.id === articleId);

    return {
        prev: currentIndex > 0 ? allArticles[currentIndex - 1] : undefined,
        next: currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : undefined
    };
}

// All articles (flat)
export function getAllArticles(): Article[] {
    const allArticles: Article[] = [];
    LOOPS_DATA.categories.forEach(cat => {
        allArticles.push(...cat.articles);
    });
    return allArticles;
}
