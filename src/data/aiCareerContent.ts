// AI Career Content Data
export interface Article { id: string; title: string; content: string; isFree: boolean; }
export interface Category { id: string; title: string; icon: string; articles: Article[]; }
export interface AICareerData { projectTitle: string; language: string; telegramContact: string; categories: Category[]; }

export const AI_CAREER_DATA: AICareerData = {
    projectTitle: "AI კარიერა",
    language: "ka",
    telegramContact: "https://t.me/andr3waltairchannel",
    categories: [
        {
            id: "future",
            title: "მომავალი",
            icon: "🚀",
            articles: [
                {
                    id: "ai-future-jobs",
                    title: "AI და სამუშაოს მომავალი",
                    isFree: true,
                    content: `# AI და სამუშაოს მომავალი\n\n## 📊 სტატისტიკა\n- **85M** სამუშაო ადგილი შეიცვლება 2025-მდე\n- **97M** ახალი სამუშაო შეიქმნება\n\n## 🔥 მზარდი პროფესიები\n1. AI Prompt Engineer\n2. AI Product Manager\n3. AI Ethics Specialist\n4. AI Trainer\n5. AI Integration Specialist\n\n## ⚠️ რისკის ქვეშ\n- Data Entry\n- Basic Translation\n- Simple Design\n- Routine Coding\n\n**დეტალური ანალიზი - პრემიუმ!**`
                }
            ]
        },
        {
            id: "skills",
            title: "უნარები",
            icon: "💪",
            articles: [
                {
                    id: "ai-interview",
                    title: "AI გამოყენება სამსახურის ძიებაში",
                    isFree: false,
                    content: `# AI სამსახურის ძიებაში\n\n## 📝 Resume\n1. AI-ით გაანალიზეთ სამუშაო აღწერა\n2. მოარგეთ resume keywords\n3. ოპტიმიზაცია ATS-ისთვის\n\n## 💼 Interview Prep\n- AI mock interviews\n- Question preparation\n- STAR method practice\n\n## 🔍 Research\n- Company analysis\n- Industry insights\n- Salary data\n\n**Templates - პრემიუმ!**`
                },
                {
                    id: "ai-resume",
                    title: "AI-ით Resume-ს შექმნა",
                    isFree: false,
                    content: `# Resume AI-ით\n\n## 🛠️ Tools\n1. **ChatGPT** - Content writing\n2. **Claude** - Analysis\n3. **Rezi** - ATS optimization\n\n## 📋 Process\n1. სამუშაო აღწერის ანალიზი\n2. Keywords extraction\n3. Achievement quantification\n4. Format optimization\n\n## ✅ Checklist\n- [ ] ATS-friendly format\n- [ ] Action verbs\n- [ ] Quantified results\n- [ ] Keywords matched\n\n**Templates pack - პრემიუმ!**`
                }
            ]
        },
        {
            id: "professions",
            title: "პროფესიები",
            icon: "👔",
            articles: [
                {
                    id: "prompt-engineer-career",
                    title: "Prompt Engineer კარიერა",
                    isFree: false,
                    content: `# Prompt Engineer\n\n## 💰 ხელფასი\n- Junior: $50-80k/წელი\n- Mid: $80-120k/წელი\n- Senior: $120-200k/წელი\n\n## 📚 უნარები\n- LLM ცოდნა\n- Technical writing\n- Python basics\n- Domain expertise\n\n## 🛤️ Path\n1. AI basics (1-2 კვირა)\n2. Prompt mastery (1 თვე)\n3. Portfolio (2-4 კვირა)\n4. Job hunt\n\n**Roadmap - პრემიუმ!**`
                }
            ]
        }
    ]
};

export function getArticleById(id: string): Article | undefined {
    for (const category of AI_CAREER_DATA.categories) {
        const article = category.articles.find(a => a.id === id);
        if (article) return article;
    }
    return undefined;
}

export function getAdjacentArticles(currentId: string): { prev: Article | null; next: Article | null } {
    const allArticles: Article[] = [];
    for (const category of AI_CAREER_DATA.categories) { allArticles.push(...category.articles); }
    const currentIndex = allArticles.findIndex(a => a.id === currentId);
    return { prev: currentIndex > 0 ? allArticles[currentIndex - 1] : null, next: currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null };
}

export function getAllArticleIds(): string[] {
    const ids: string[] = [];
    for (const category of AI_CAREER_DATA.categories) { for (const article of category.articles) { ids.push(article.id); } }
    return ids;
}
