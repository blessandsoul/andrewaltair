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
                    id: "01-shesavali",
                    title: "შესავალი: კოდინგი მოკვდა!",
                    isFree: true,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["Vibe Coding", "შესავალი", "კარპატი", "2026"]
                }
            ]
        },
        {
            id: "fundamentals",
            title: "საფუძვლები",
            icon: "📚",
            articles: [
                {
                    id: "02-istoria-timeline",
                    title: "ისტორია: კარპატის ტვიტიდან Vibe ეპოქამდე",
                    isFree: false,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["Timeline", "ისტორია", "კარპატი", "Cursor", "MCP"]
                },
                {
                    id: "03-filosofia",
                    title: "ფილოსოფია: ვაიბი > სინტაქსი",
                    isFree: false,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["ფილოსოფია", "აბსტრაქცია", "მებაღეობა", "არქიტექტურა"]
                }
            ]
        },
        {
            id: "tools",
            title: "ინსტრუმენტები",
            icon: "🛠️",
            articles: [
                {
                    id: "04-instrumentebi",
                    title: "ტექნოლოგიური არსენალი 2026",
                    isFree: false,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["Cursor", "Windsurf", "Warp", "ინსტრუმენტები", "რედაქტორი"]
                }
            ]
        },
        {
            id: "practice",
            title: "პრაქტიკა",
            icon: "🚀",
            articles: [
                {
                    id: "05-praqtikuli-gzamkvlevi",
                    title: "პრაქტიკული გზამკვლევი: 6 ნაბიჯი",
                    isFree: false,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["პრაქტიკა", "გზამკვლევი", "ჩეკლისტი", "წესები"]
                },
                {
                    id: "06-axali-unarebi",
                    title: "ახალი უნარები 2026 წელს",
                    isFree: false,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["უნარები", "2026", "კონტექსტი", "აზროვნება"]
                }
            ]
        },
        {
            id: "advanced",
            title: "მოწინავე",
            icon: "💎",
            articles: [
                {
                    id: "07-ekonomikuri-revolucia",
                    title: "ეკონომიკური რევოლუცია: 1-კაციანი Unicorn-ები",
                    isFree: false,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["ეკონომიკა", "Unicorn", "SaaS", "სტარტაპი"]
                },
                {
                    id: "08-riskebi-mitebi-daskvna",
                    title: "რისკები, მითები და დასკვნა",
                    isFree: false,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["რისკები", "უსაფრთხოება", "მითები", "დასკვნა"]
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
