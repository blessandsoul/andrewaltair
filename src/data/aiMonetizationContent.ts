// AI Monetization Content Data
export interface Article { id: string; title: string; content: string; isFree: boolean; }
export interface Category { id: string; title: string; icon: string; articles: Article[]; }
export interface AIMonetizationData { projectTitle: string; language: string; telegramContact: string; categories: Category[]; }

export const AI_MONETIZATION_DATA: AIMonetizationData = {
    projectTitle: "AI მონეტიზაცია",
    language: "ka",
    telegramContact: "https://t.me/andr3waltairchannel",
    categories: [
        {
            id: "intro",
            title: "შესავალი",
            icon: "💰",
            articles: [
                {
                    id: "ai-income-intro",
                    title: "AI-ით შემოსავლის მიღება",
                    isFree: true,
                    content: `# AI-ით შემოსავლის მიღება\n\n**2025 წელი** არის AI მონეტიზაციის ოქროს ხანა.\n\n## 📊 სტატისტიკა\n- **400%** ზრდა AI სამუშაოებში\n- **$50-200/საათი** AI ფრილანსერებისთვის\n\n## 💡 5 გზა შემოსავლისთვის\n1. **ფრილანსი** - კლიენტებისთვის AI სერვისები\n2. **პროდუქტები** - Templates, prompts\n3. **კონსალტინგი** - AI დანერგვა\n4. **განათლება** - კურსები\n5. **SaaS** - AI აპლიკაციები\n\n**დეტალური გაიდი - პრემიუმ!**`
                },
                {
                    id: "freelance-with-ai",
                    title: "ფრილანსი AI-ით",
                    isFree: false,
                    content: `# ფრილანსი AI-ით\n\n## 💼 მოთხოვნადი სერვისები\n\n### AI Content Writing ($30-100/სტატია)\n- SEO ბლოგ პოსტები\n- Product descriptions\n\n### AI Image Generation ($50-300/პროექტი)\n- Brand assets\n- Marketing visuals\n\n### AI Video Editing ($100-500/ვიდეო)\n- YouTube ვიდეოები\n- Marketing clips\n\n## 🎯 Upwork პროფილი\n**Title Formula:**\n\`AI-Powered [Skill] | [Tool] Expert\`\n\n## 💰 ფასები\n- დამწყები: ბაზრის 50%\n- გამოცდილი: Value-based\n\n**სრული გაიდი - პრემიუმ!**`
                }
            ]
        },
        {
            id: "products",
            title: "პროდუქტები",
            icon: "🛍️",
            articles: [
                {
                    id: "ai-products",
                    title: "AI პროდუქტების შექმნა",
                    isFree: false,
                    content: `# AI პროდუქტების შექმნა\n\n## 🎯 რა იყიდება?\n1. **Prompt Libraries** ($10-50)\n2. **Templates** ($20-100)\n3. **Digital Art** ($5-500)\n4. **Courses** ($50-500)\n\n## 💰 პლატფორმები\n| პლატფორმა | საკომისიო |\n|:---|:---|\n| Gumroad | 10% |\n| Etsy | 5% + fees |\n| Teachable | 5-10% |\n\n## 💎 Revenue\n- Prompt Pack: $29 × 500 = **$14,500**\n- Template: $49 × 200 = **$9,800**\n\n**Playbook - პრემიუმ!**`
                },
                {
                    id: "case-studies",
                    title: "წარმატების ისტორიები",
                    isFree: false,
                    content: `# წარმატების ისტორიები\n\n## 🌟 გიორგი - Content Writer\n- **თვე 1**: ChatGPT სწავლა\n- **თვე 6**: $2,500/თვე\n- **თვე 12**: $8,000/თვე\n\n## 🌟 ანა - AI Artist\n- **თვე 1**: Midjourney პრაქტიკა\n- **თვე 6**: $3,000/თვე\n- **თვე 12**: $12,000/თვე\n\n## 📊 საერთო Patterns\n1. AI + human value\n2. თანმიმდევრულობა\n3. სპეციალიზაცია\n4. ბრენდის აშენება\n\n**ინტერვიუები - პრემიუმ!**`
                }
            ]
        },
        {
            id: "advanced",
            title: "გაფართოებული",
            icon: "🚀",
            articles: [
                {
                    id: "ai-agency",
                    title: "AI სააგენტოს დაწყება",
                    isFree: false,
                    content: `# AI სააგენტო\n\n## 🏢 ფრილანსი vs სააგენტო\n| ფრილანსი | სააგენტო |\n|:---|:---|\n| $5-15k/თვე | $20-100k/თვე |\n| 1 ადამიანი | გუნდი |\n\n## 📋 ნაბიჯები\n1. **ნიშა** - AI Content for SaaS\n2. **პაკეტირება** - $1.5k-7.5k/თვე\n3. **გუნდი** - PM + Operators\n4. **სისტემები** - SOPs\n\n## 💰 მოდელი\n- Revenue: $50k/თვე\n- Costs: $25k/თვე\n- Profit: $25k/თვე (50%)\n\n**Agency playbook - პრემიუმ!**`
                }
            ]
        }
    ]
};

export function getArticleById(id: string): Article | undefined {
    for (const category of AI_MONETIZATION_DATA.categories) {
        const article = category.articles.find(a => a.id === id);
        if (article) return article;
    }
    return undefined;
}

export function getAdjacentArticles(currentId: string): { prev: Article | null; next: Article | null } {
    const allArticles: Article[] = [];
    for (const category of AI_MONETIZATION_DATA.categories) {
        allArticles.push(...category.articles);
    }
    const currentIndex = allArticles.findIndex(a => a.id === currentId);
    return {
        prev: currentIndex > 0 ? allArticles[currentIndex - 1] : null,
        next: currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null
    };
}

export function getAllArticleIds(): string[] {
    const ids: string[] = [];
    for (const category of AI_MONETIZATION_DATA.categories) {
        for (const article of category.articles) { ids.push(article.id); }
    }
    return ids;
}
