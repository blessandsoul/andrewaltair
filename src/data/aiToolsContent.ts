// AI Tools Content Data
export interface Article { id: string; title: string; content: string; isFree: boolean; }
export interface Category { id: string; title: string; icon: string; articles: Article[]; }
export interface AIToolsData { projectTitle: string; language: string; telegramContact: string; categories: Category[]; }

export const AI_TOOLS_DATA: AIToolsData = {
    projectTitle: "AI ინსტრუმენტები",
    language: "ka",
    telegramContact: "https://t.me/andr3waltairchannel",
    categories: [
        {
            id: "overview",
            title: "მიმოხილვა",
            icon: "🔧",
            articles: [
                {
                    id: "ai-tools-2025",
                    title: "AI ინსტრუმენტები 2025",
                    isFree: true,
                    content: `# AI ინსტრუმენტები 2025\n\n100+ ინსტრუმენტების კატალოგი.\n\n## 🎨 გამოსახულება\n- **Midjourney** - საუკეთესო ხარისხი\n- **DALL-E 3** - ChatGPT integration\n- **Flux** - Open source\n- **Ideogram** - ტექსტი გამოსახულებაში\n\n## 🎬 ვიდეო\n- **Runway** - Professional\n- **Pika** - Quick clips\n- **Kling** - Long videos\n- **Sora** - OpenAI (soon)\n\n## 🎵 აუდიო\n- **ElevenLabs** - Voice cloning\n- **Suno** - Music generation\n- **Murf** - Voiceovers\n\n**სრული რეიტინგი - პრემიუმ!**`
                }
            ]
        },
        {
            id: "image",
            title: "გამოსახულება",
            icon: "🎨",
            articles: [
                {
                    id: "midjourney-guide",
                    title: "Midjourney გაიდი",
                    isFree: false,
                    content: `# Midjourney სრული გაიდი\n\n## ⚙️ პარამეტრები\n- \`--ar 16:9\` Aspect ratio\n- \`--v 6\` Version\n- \`--style raw\` No styling\n- \`--no text\` Exclude\n\n## 🎨 სტილები\n- Photorealistic\n- Cinematic\n- Anime\n- 3D render\n\n## 💡 Pro Prompts\n\`\`\`\nA futuristic city, neon lights, \ncyberpunk style, cinematic lighting, \n8k, detailed --ar 16:9 --v 6\n\`\`\`\n\n**100+ prompts - პრემიუმ!**`
                },
                {
                    id: "dalle-guide",
                    title: "DALL-E 3 გაიდი",
                    isFree: false,
                    content: `# DALL-E 3 გაიდი\n\n## ✨ უპირატესობები\n- ChatGPT integration\n- ტექსტი გამოსახულებაში\n- Natural language prompts\n\n## 📝 Prompting\nDALL-E 3 უკეთ ესმის:\n- ბუნებრივი ენა\n- დეტალური აღწერა\n- კონკრეტული სტილები\n\n## 🎯 Best Uses\n- Marketing graphics\n- Blog images\n- Social media\n- Presentations\n\n**Templates - პრემიუმ!**`
                }
            ]
        },
        {
            id: "video",
            title: "ვიდეო",
            icon: "🎬",
            articles: [
                {
                    id: "runway-guide",
                    title: "Runway Gen-3 გაიდი",
                    isFree: false,
                    content: `# Runway Gen-3\n\n## 🎬 Features\n- Text to video\n- Image to video\n- Video to video\n- Motion brush\n\n## ⚙️ Settings\n- Duration: 4-16 sec\n- Camera: pan, zoom, rotate\n- Motion: amount, speed\n\n## 💰 Pricing\n- Free: 125 credits\n- Standard: $12/month\n- Pro: $28/month\n\n**Prompts library - პრემიუმ!**`
                }
            ]
        },
        {
            id: "audio",
            title: "აუდიო",
            icon: "🎵",
            articles: [
                {
                    id: "elevenlabs-guide",
                    title: "ElevenLabs გაიდი",
                    isFree: false,
                    content: `# ElevenLabs\n\n## 🎤 Features\n- Text to speech\n- Voice cloning\n- 29+ languages\n- Emotion control\n\n## 💡 Use Cases\n- Podcasts\n- Audiobooks\n- Videos\n- Ads\n\n## 💰 Pricing\n- Free: 10k chars/month\n- Starter: $5/month\n- Creator: $22/month\n\n**Clone tutorial - პრემიუმ!**`
                }
            ]
        }
    ]
};

export function getArticleById(id: string): Article | undefined {
    for (const category of AI_TOOLS_DATA.categories) {
        const article = category.articles.find(a => a.id === id);
        if (article) return article;
    }
    return undefined;
}

export function getAdjacentArticles(currentId: string): { prev: Article | null; next: Article | null } {
    const allArticles: Article[] = [];
    for (const category of AI_TOOLS_DATA.categories) { allArticles.push(...category.articles); }
    const currentIndex = allArticles.findIndex(a => a.id === currentId);
    return { prev: currentIndex > 0 ? allArticles[currentIndex - 1] : null, next: currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null };
}

export function getAllArticleIds(): string[] {
    const ids: string[] = [];
    for (const category of AI_TOOLS_DATA.categories) { for (const article of category.articles) { ids.push(article.id); } }
    return ids;
}
