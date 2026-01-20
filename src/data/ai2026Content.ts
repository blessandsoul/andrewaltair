
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

export interface AI2026Data {
    projectTitle: string;
    language: string;
    telegramContact: string;
    categories: Category[];
}

export const AI_2026_DATA: AI2026Data = {
    projectTitle: "AI 2026",
    language: "ka",
    telegramContact: "https://t.me/andr3waltairchannel",
    categories: [
        {
            id: "futurism",
            title: "ფუტურიზმი",
            icon: "🚀",
            articles: [
                {
                    id: "ai-momavali-2026",
                    title: "AI 2026: კაცობრიობის დიდი ფილტრი",
                    isFree: true,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["AI 2026", "Human 2.0", "The Great Filter"]
                }
            ]
        }
    ]
};

export function getAllArticles(): Article[] {
    const allArticles: Article[] = [];
    AI_2026_DATA.categories.forEach(cat => {
        allArticles.push(...cat.articles);
    });
    return allArticles;
}
