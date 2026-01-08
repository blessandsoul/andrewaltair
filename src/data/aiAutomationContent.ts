// AI Automation Content Data
export interface Article { id: string; title: string; content: string; isFree: boolean; }
export interface Category { id: string; title: string; icon: string; articles: Article[]; }
export interface AIAutomationData { projectTitle: string; language: string; telegramContact: string; categories: Category[]; }

export const AI_AUTOMATION_DATA: AIAutomationData = {
    projectTitle: "AI ავტომატიზაცია",
    language: "ka",
    telegramContact: "https://t.me/andr3waltairchannel",
    categories: [
        {
            id: "basics",
            title: "საფუძვლები",
            icon: "⚡",
            articles: [
                {
                    id: "automation-intro",
                    title: "AI ავტომატიზაციის შესავალი",
                    isFree: true,
                    content: `# AI ავტომატიზაცია\n\nბიზნეს პროცესების ავტომატიზაცია AI-ით.\n\n## 📊 ROI\n- **$2,000-10,000/თვე** დაზოგვა\n- **80%** დროის ეკონომია\n\n## 🔧 ინსტრუმენტები\n1. **Zapier** - No-code automation\n2. **Make.com** - Advanced workflows\n3. **n8n** - Self-hosted\n4. **ChatGPT API** - AI integration\n\n## 💡 მაგალითები\n- Email ავტომატიზაცია\n- CRM sync\n- Report generation\n- Customer support\n\n**დეტალური გაიდი - პრემიუმ!**`
                },
                {
                    id: "zapier-ai",
                    title: "Zapier + AI Workflows",
                    isFree: false,
                    content: `# Zapier + AI\n\n## 🔄 AI Actions\n1. **ChatGPT in Zapier**\n2. **Claude integration**\n3. **Custom AI prompts**\n\n## 📋 Workflow მაგალითები\n\n### Email to Summary\n\`\`\`\nTrigger: New Email\n→ ChatGPT: Summarize\n→ Slack: Post summary\n\`\`\`\n\n### Lead Scoring\n\`\`\`\nTrigger: New Lead\n→ AI: Score 1-10\n→ CRM: Update score\n→ If >7: Notify sales\n\`\`\`\n\n**50+ templates - პრემიუმ!**`
                }
            ]
        },
        {
            id: "workflows",
            title: "Workflows",
            icon: "🔄",
            articles: [
                {
                    id: "email-automation",
                    title: "Email ავტომატიზაცია",
                    isFree: false,
                    content: `# Email ავტომატიზაცია\n\n## 📧 Use Cases\n1. **Auto-replies** - AI პასუხები\n2. **Summarization** - Daily digests\n3. **Categorization** - Auto-labeling\n4. **Follow-ups** - Smart reminders\n\n## 🛠️ Setup\n1. Gmail/Outlook trigger\n2. AI classification\n3. Action based on category\n\n**Templates - პრემიუმ!**`
                },
                {
                    id: "crm-automation",
                    title: "CRM ავტომატიზაცია",
                    isFree: false,
                    content: `# CRM ავტომატიზაცია\n\n## 📊 Automations\n1. **Lead enrichment** - AI research\n2. **Score prediction** - ML models\n3. **Follow-up timing** - Optimal send\n4. **Email personalization** - AI drafts\n\n## 💰 ROI\n- **30%** conversion ზრდა\n- **5h/კვირა** დაზოგვა\n\n**CRM playbook - პრემიუმ!**`
                }
            ]
        },
        {
            id: "advanced",
            title: "გაფართოებული",
            icon: "🚀",
            articles: [
                {
                    id: "roi-calculator",
                    title: "Automation ROI კალკულატორი",
                    isFree: false,
                    content: `# ROI კალკულატორი\n\n## 📊 ფორმულა\n\`\`\`\nROI = (დაზოგილი დრო × საათობრივი) - ხარჯი\n\`\`\`\n\n## 🎯 მაგალითი\n- დრო: 10h/კვირა\n- საათობრივი: $30\n- ხარჯი: $100/თვე\n\n**ROI = (40h × $30) - $100 = $1,100/თვე**\n\n**კალკულატორი + templates - პრემიუმ!**`
                }
            ]
        }
    ]
};

export function getArticleById(id: string): Article | undefined {
    for (const category of AI_AUTOMATION_DATA.categories) {
        const article = category.articles.find(a => a.id === id);
        if (article) return article;
    }
    return undefined;
}

export function getAdjacentArticles(currentId: string): { prev: Article | null; next: Article | null } {
    const allArticles: Article[] = [];
    for (const category of AI_AUTOMATION_DATA.categories) { allArticles.push(...category.articles); }
    const currentIndex = allArticles.findIndex(a => a.id === currentId);
    return { prev: currentIndex > 0 ? allArticles[currentIndex - 1] : null, next: currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null };
}

export function getAllArticleIds(): string[] {
    const ids: string[] = [];
    for (const category of AI_AUTOMATION_DATA.categories) { for (const article of category.articles) { ids.push(article.id); } }
    return ids;
}
