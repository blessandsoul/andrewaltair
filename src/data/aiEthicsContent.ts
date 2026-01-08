// AI Ethics Content Data
export interface Article { id: string; title: string; content: string; isFree: boolean; }
export interface Category { id: string; title: string; icon: string; articles: Article[]; }
export interface AIEthicsData { projectTitle: string; language: string; telegramContact: string; categories: Category[]; }

export const AI_ETHICS_DATA: AIEthicsData = {
    projectTitle: "AI ეთიკა",
    language: "ka",
    telegramContact: "https://t.me/andr3waltairchannel",
    categories: [
        {
            id: "basics",
            title: "საფუძვლები",
            icon: "⚖️",
            articles: [
                {
                    id: "ai-ethics-intro",
                    title: "AI ეთიკის შესავალი",
                    isFree: true,
                    content: `# AI ეთიკა\n\nხელოვნური ინტელექტის პასუხისმგებლიანი გამოყენება.\n\n## ⚠️ გამოწვევები\n1. **Bias** - მიკერძოებული მონაცემები\n2. **Privacy** - პირადი ინფორმაცია\n3. **Transparency** - შავი ყუთი\n4. **Accountability** - პასუხისმგებლობა\n\n## ✅ პრინციპები\n- სამართლიანობა\n- გამჭვირვალობა\n- პასუხისმგებლობა\n- უსაფრთხოება\n\n**დეტალური გაიდი - პრემიუმ!**`
                }
            ]
        },
        {
            id: "legal",
            title: "სამართლებრივი",
            icon: "📜",
            articles: [
                {
                    id: "ai-copyright",
                    title: "AI და საავტორო უფლებები",
                    isFree: false,
                    content: `# AI და Copyright\n\n## ❓ ვის ეკუთვნის?\n- AI output-ს საავტორო უფლება?\n- Training data პრობლემები\n- Fair use\n\n## 🌍 რეგულაციები\n- **US**: AI works not copyrightable\n- **EU**: AI Act (2024)\n- **UK**: Special provisions\n\n## ⚠️ რისკები\n- Training data lawsuits\n- Output similarity\n- Commercial use\n\n**Legal guide - პრემიუმ!**`
                },
                {
                    id: "ai-detectors",
                    title: "AI დეტექტორები",
                    isFree: false,
                    content: `# AI Content დეტექტორები\n\n## 🔍 ინსტრუმენტები\n| ინსტრუმენტი | სიზუსტე |\n|:---|:---|\n| GPTZero | 85-90% |\n| Originality | 90-95% |\n| Turnitin | 80-90% |\n\n## ⚠️ პრობლემები\n- False positives\n- Easy bypass\n- Non-native speakers\n\n## 🛡️ როგორ ავირიდოთ?\n1. ჰუმანიზირება\n2. Personal voice\n3. Fact addition\n4. Restructuring\n\n**Bypass guide - პრემიუმ!**`
                }
            ]
        },
        {
            id: "safety",
            title: "უსაფრთხოება",
            icon: "🛡️",
            articles: [
                {
                    id: "ai-safety",
                    title: "AI უსაფრთხო გამოყენება",
                    isFree: false,
                    content: `# AI უსაფრთხოება\n\n## ⚠️ რისკები\n1. **Data leaks** - სენსიტიური ინფო\n2. **Hallucinations** - ყალბი ფაქტები\n3. **Dependency** - ზედმეტი დამოკიდებულება\n\n## ✅ Best Practices\n- არ გაუზიაროთ პირადი მონაცემები\n- ყოველთვის შეამოწმეთ ფაქტები\n- გამოიყენეთ როგორც ასისტენტი\n- რეგულარულად გადახედეთ output-ს\n\n**Security checklist - პრემიუმ!**`
                }
            ]
        }
    ]
};

export function getArticleById(id: string): Article | undefined {
    for (const category of AI_ETHICS_DATA.categories) {
        const article = category.articles.find(a => a.id === id);
        if (article) return article;
    }
    return undefined;
}

export function getAdjacentArticles(currentId: string): { prev: Article | null; next: Article | null } {
    const allArticles: Article[] = [];
    for (const category of AI_ETHICS_DATA.categories) { allArticles.push(...category.articles); }
    const currentIndex = allArticles.findIndex(a => a.id === currentId);
    return { prev: currentIndex > 0 ? allArticles[currentIndex - 1] : null, next: currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null };
}

export function getAllArticleIds(): string[] {
    const ids: string[] = [];
    for (const category of AI_ETHICS_DATA.categories) { for (const article of category.articles) { ids.push(article.id); } }
    return ids;
}
