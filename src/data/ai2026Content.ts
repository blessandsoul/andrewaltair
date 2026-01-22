
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
            id: "intro",
            title: "შესავალი",
            icon: "🔥",
            articles: [
                {
                    id: "01-shesavali",
                    title: "შესავალი: დიდი ფილტრი",
                    isFree: true,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["AI 2026", "შესავალი", "ტრაქტორი", "ფილტრი"]
                }
            ]
        },
        {
            id: "technology",
            title: "ტექნოლოგია",
            icon: "📱",
            articles: [
                {
                    id: "02-interfacis-sikvdili",
                    title: "ინტერფეისის სიკვდილი: ტელეფონების სასაფლაო",
                    isFree: false,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["AR", "ინტერფეისი", "სათვალე", "Vision Pro"]
                },
                {
                    id: "03-agentebis-ekonomika",
                    title: "აგენტების ეკონომიკა: შენ აღარ ხარ კლიენტი",
                    isFree: false,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["აგენტები", "ეკონომიკა", "მარკეტინგი", "ბოტები"]
                }
            ]
        },
        {
            id: "society",
            title: "საზოგადოება",
            icon: "☠️",
            articles: [
                {
                    id: "04-samusao-bazari",
                    title: "სამუშაო ბაზრის აპოკალიფსი",
                    isFree: false,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["სამუშაო", "პროფესიები", "Junior", "არქიტექტორი"]
                },
                {
                    id: "05-cifruli-ukvdaveba",
                    title: "ციფრული უკვდავება და სიყალბის ოკეანე",
                    isFree: false,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["Deepfake", "ბლოკჩეინი", "Worldcoin", "იდენტობა"]
                }
            ]
        },
        {
            id: "human",
            title: "Human 2.0",
            icon: "🧬",
            articles: [
                {
                    id: "06-human-2-bio-hacking",
                    title: "Human 2.0 და ბიო-ჰაკინგი",
                    isFree: false,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["Neuralink", "ბიო-ჰაკინგი", "Human 2.0", "ევოლუცია"]
                },
                {
                    id: "07-ganatleba-testi",
                    title: "განათლების კრახი და ტესტი",
                    isFree: false,
                    content: "This content is loaded dynamically from JSON.",
                    tags: ["განათლება", "სკოლა", "ტესტი", "უნივერსიტეტი"]
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

export function getTotalArticleCount(): number {
    return AI_2026_DATA.categories.reduce(
        (acc, cat) => acc + cat.articles.length,
        0
    );
}
