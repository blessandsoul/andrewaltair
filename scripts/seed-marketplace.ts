
// Script to seed the Marketplace with 20 premium prompts
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || '';

// Define Schema locally to avoid import issues
const PromptVariableSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    options: [{ type: String }],
    required: { type: Boolean, default: true },
}, { _id: false });

const ExampleImageSchema = new mongoose.Schema({
    src: { type: String, required: true },
    alt: { type: String },
    promptUsed: { type: String },
}, { _id: false });

const MarketplacePromptSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    excerpt: String,
    price: { type: Number, required: true, default: 0 },
    currency: { type: String, enum: ['GEL', 'USD'], default: 'GEL' },
    originalPrice: Number,
    isFree: { type: Boolean, default: true },
    promptTemplate: { type: String, required: true },
    variables: [PromptVariableSchema],
    instructions: String,
    aiModel: { type: String, required: true },
    aiModelVersion: String,
    generationType: {
        type: String,
        enum: ['text-to-image', 'text-to-text', 'image-to-image', 'text-to-video'],
        default: 'text-to-image'
    },
    coverImage: { type: String, required: true },
    exampleImages: [ExampleImageSchema],
    category: { type: String, required: true },
    tags: [String],
    authorName: { type: String, default: 'Andrew Altair' },
    views: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    rating: { type: Number, default: 5 },
    reviewsCount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published'
    },
    featuredOrder: Number,
}, { timestamps: true });

const MarketplacePrompt = mongoose.models.MarketplacePrompt || mongoose.model('MarketplacePrompt', MarketplacePromptSchema, 'marketplaceprompts');

// Copy generated images to public folder
async function setupImages() {
    const publicDir = path.join(process.cwd(), 'public', 'marketplace', 'covers');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    const sourceDir = 'C:/Users/User/.gemini/antigravity/brain/b62475a9-1d8d-4391-aeaa-f20f76c2d90c';
    const images = [
        { src: 'marketplace_business_1767883726882.png', dest: 'business.png' },
        { src: 'marketplace_creative_1767883742927.png', dest: 'creative.png' },
        { src: 'marketplace_developer_1767883760184.png', dest: 'developer.png' },
        { src: 'marketplace_personal_1767883778872.png', dest: 'personal.png' },
    ];

    for (const img of images) {
        try {
            const srcPath = path.join(sourceDir, img.src);
            const destPath = path.join(publicDir, img.dest);
            if (fs.existsSync(srcPath)) {
                fs.copyFileSync(srcPath, destPath);
                console.log(`✅ Copied ${img.dest}`);
            } else {
                console.error(`❌ Source image not found: ${img.src}`);
            }
        } catch (err) {
            console.error(`❌ Error copying ${img.dest}:`, err);
        }
    }
}

const PROMPTS = [
    // BUSINESS & MARKETING
    {
        title: "SEO Blog Post Generator Pro",
        slug: "seo-blog-post-generator",
        description: "Generate high-ranking, SEO-optimized blog posts with proper structure, keywords, and tone. Perfect for content marketing.",
        excerpt: "Write rankable blog posts in seconds.",
        price: 29.99,
        currency: 'GEL',
        aiModel: "Gemini 2.0",
        generationType: 'text-to-text',
        category: "content",
        coverImage: "/marketplace/covers/business.png",
        tags: ["seo", "blogging", "marketing", "content-writing"],
        promptTemplate: "Act as an expert SEO copywriter. Write a [LENGTH] word blog post about [TOPIC]. \\nTarget Audience: [AUDIENCE].\\nKeywords to include: [KEYWORDS].\\nTone: [TONE].\\nStructure:\\n1. Catchy H1\\n2. Engaging Intro with Hook\\n3. H2/H3 Subheadings\\n4. Conclusion with CTA.",
        variables: [
            { name: "TOPIC", description: "Main topic of the blog post", required: true },
            { name: "LENGTH", description: "Approximate word count", options: ["500", "1000", "1500", "2000"], required: true },
            { name: "AUDIENCE", description: "Who is reading this?", required: true },
            { name: "KEYWORDS", description: "Comma separated SEO keywords", required: true },
            { name: "TONE", description: "Writing style", options: ["Professional", "Casual", "Humorous", "Academic"], required: true }
        ]
    },
    {
        title: "Cold Email Outreach Master",
        slug: "cold-email-master",
        description: "Create personalized cold emails that get responses. Uses psychology-based frameworks like AIDA and PAS.",
        excerpt: "Cold emails that actually convert.",
        price: 0,
        currency: 'GEL',
        aiModel: "GPT-4o",
        generationType: 'text-to-text',
        category: "business",
        coverImage: "/marketplace/covers/business.png",
        tags: ["email", "sales", "outreach", "b2b"],
        promptTemplate: "Write a cold email to [RECIPIENT_ROLE] at [COMPANY_TYPE].\\nMy Offer: [MY_OFFER].\\nPain Point: [PAIN_POINT].\\nGoal: [GOAL].\\nUse the [FRAMEWORK] framework.\\nKeep it under 150 words.",
        variables: [
            { name: "RECIPIENT_ROLE", description: "Job title of recipient", required: true },
            { name: "MY_OFFER", description: "What are you selling?", required: true },
            { name: "PAIN_POINT", description: "Problem you solve", required: true },
            { name: "FRAMEWORK", options: ["AIDA", "PAS", "BAB"], required: true },
            { name: "GOAL", options: ["Call", "Reply", "Demo"], required: true }
        ]
    },
    {
        title: "Viral LinkedIn Post Creator",
        slug: "linkedin-viral-post",
        description: "Craft engaging LinkedIn posts with hooks, storytelling, and formatting that drives engagement and connection.",
        excerpt: "Go viral on LinkedIn with proven structures.",
        price: 15.00,
        currency: 'GEL',
        aiModel: "Claude 3.5 Sonnet",
        generationType: 'text-to-text',
        category: "business",
        coverImage: "/marketplace/covers/business.png",
        tags: ["linkedin", "social-media", "personal-brand"],
        promptTemplate: "Write a LinkedIn post about [TOPIC].\\nHook style: [HOOK_STYLE].\\nStory: [STORY_DETAILS].\\nLesson: [LESSON].\\nFormatting: Use short paragraphs and emojis.\\nEnding: Ask a question.",
        variables: [
            { name: "TOPIC", required: true },
            { name: "HOOK_STYLE", options: ["Controversial", "Question", "Story", "Statistic"], required: true },
            { name: "STORY_DETAILS", required: true },
            { name: "LESSON", required: true }
        ]
    },
    {
        title: "Business Plan Strategist",
        slug: "business-plan-strategist",
        description: "Generate a comprehensive business plan including executive summary, market analysis, and financial projections.",
        excerpt: "Full business plan in minutes.",
        price: 49.00,
        currency: 'GEL',
        aiModel: "GPT-4o",
        generationType: 'text-to-text',
        category: "business",
        coverImage: "/marketplace/covers/business.png",
        tags: ["business", "strategy", "startup", "planning"],
        promptTemplate: "Create a lean business plan for a [BUSINESS_TYPE] named [NAME].\\nTarget Market: [MARKET].\\nUnique Value: [USP].\\nRevenue Model: [REVENUE].\\nInclude sections: Executive Summary, Market Analysis, Operations, Financial Plan.",
        variables: [
            { name: "BUSINESS_TYPE", required: true },
            { name: "NAME", required: true },
            { name: "MARKET", required: true },
            { name: "USP", required: true },
            { name: "REVENUE", required: true }
        ]
    },
    {
        title: "Interview Question Generator",
        slug: "interview-questions",
        description: "Generate role-specific interview questions to assess technical skills, culture fit, and soft skills.",
        excerpt: "Hire the best talent with better questions.",
        price: 0,
        currency: 'GEL',
        aiModel: "Gemini 1.5 Pro",
        generationType: 'text-to-text',
        category: "business",
        coverImage: "/marketplace/covers/business.png",
        tags: ["hr", "hiring", "interview", "management"],
        promptTemplate: "Generate 10 interview questions for a [JOB_TITLE] role.\\nIndustry: [INDUSTRY].\\nExperience Level: [LEVEL].\\nFocus areas: [FOCUS].\\nInclude 3 technical, 3 behavioral, and 4 situational questions.",
        variables: [
            { name: "JOB_TITLE", required: true },
            { name: "INDUSTRY", required: true },
            { name: "LEVEL", options: ["Junior", "Mid-Level", "Senior", "Executive"], required: true },
            { name: "FOCUS", required: true }
        ]
    },

    // CREATIVE & ART
    {
        title: "Midjourney Photorealism Pro",
        slug: "midjourney-photorealism",
        description: "Create stunning, indiscernible-from-reality photos with Midjourney v6 using advanced camera and lighting parameters.",
        excerpt: "Ultra-realistic photography prompts.",
        price: 25.00,
        currency: 'GEL',
        aiModel: "Midjourney v6",
        generationType: 'text-to-image',
        category: "creative",
        coverImage: "/marketplace/covers/creative.png",
        tags: ["midjourney", "photography", "realistic", "art"],
        promptTemplate: "/imagine prompt: [SUBJECT] shot on [CAMERA] with [LENS] lens. Lighting: [LIGHTING]. Environment: [ENVIRONMENT]. Mood: [MOOD]. --ar [ASPECT_RATIO] --v 6.0 --style raw --stylize 250",
        variables: [
            { name: "SUBJECT", required: true },
            { name: "CAMERA", options: ["Sony A7R IV", "Canon R5", "Leica M11", "iPhone 15 Pro"], required: true },
            { name: "LENS", options: ["35mm f/1.4", "85mm f/1.2", "24-70mm", "Macro 100mm"], required: true },
            { name: "LIGHTING", options: ["Golden Hour", "Studio Softbox", "Neon Noir", "Natural Overcast"], required: true },
            { name: "ASPECT_RATIO", options: ["16:9", "1:1", "4:5", "9:16"], required: true }
        ]
    },
    {
        title: "Logo Design Concepts",
        slug: "logo-design-concepts",
        description: "Generate professional logo concepts. Minimalist, geometric, mascot, or vintage styles available.",
        excerpt: "Infinite logo ideas for your brand.",
        price: 19.00,
        currency: 'GEL',
        aiModel: "DALL-E 3",
        generationType: 'text-to-image',
        category: "creative",
        coverImage: "/marketplace/covers/creative.png",
        tags: ["logo", "branding", "design", "vector"],
        promptTemplate: "Vector logo design for [BRAND_NAME], a [INDUSTRY] company. Style: [STYLE]. Symbol: [SYMBOL]. Colors: [COLORS]. Background: White. Minimalist, clean lines, scalable.",
        variables: [
            { name: "BRAND_NAME", required: true },
            { name: "INDUSTRY", required: true },
            { name: "STYLE", options: ["Minimalist", "Geometric", "Vintage", "Mascot", "Abstract"], required: true },
            { name: "SYMBOL", required: true },
            { name: "COLORS", required: true }
        ]
    },
    {
        title: "Anime Character Sheet",
        slug: "anime-character-sheet",
        description: "Create detailed character reference sheets for anime/manga characters, including front, side, and back views.",
        excerpt: "Design your own anime characters.",
        price: 0,
        currency: 'GEL',
        aiModel: "Niji 6",
        generationType: 'text-to-image',
        category: "creative",
        coverImage: "/marketplace/covers/creative.png",
        tags: ["anime", "character-design", "manga", "art"],
        promptTemplate: "Anime character reference sheet for [GENDER] [ARCHETYPE]. Appearance: [APPEARANCE]. Outfit: [OUTFIT]. Style: [STYLE]. Views: Front, Side, Back, Expressions. --niji 6",
        variables: [
            { name: "GENDER", options: ["Male", "Female", "Androgynous"], required: true },
            { name: "ARCHETYPE", required: true },
            { name: "APPEARANCE", required: true },
            { name: "OUTFIT", required: true },
            { name: "STYLE", options: ["Studio Ghibli", "Cyberpunk", "Fantasy", "School Life"], required: true }
        ]
    },
    {
        title: "UI/UX App Interface",
        slug: "ui-ux-app-interface",
        description: "Generate modern, beautiful mobile app interface designs for inspiration.",
        excerpt: "App design inspiration on demand.",
        price: 35.00,
        currency: 'GEL',
        aiModel: "Midjourney v6",
        generationType: 'text-to-image',
        category: "creative",
        coverImage: "/marketplace/covers/creative.png",
        tags: ["ui", "ux", "web-design", "app-design"],
        promptTemplate: "High fidelity UI design for a [APP_TYPE] mobile app. Screen: [SCREEN_NAME]. Style: [STYLE]. Color palette: [COLORS]. --ar 9:16 --v 6.0",
        variables: [
            { name: "APP_TYPE", required: true },
            { name: "SCREEN_NAME", required: true },
            { name: "STYLE", options: ["Glassmorphism", "Neomorphism", "Flat", "Material"], required: true },
            { name: "COLORS", required: true }
        ]
    },
    {
        title: "T-Shirt Vector Design",
        slug: "t-shirt-vector",
        description: "Create isolated vector-style illustrations perfect for t-shirt printing and merchandise.",
        excerpt: "Print-ready t-shirt art.",
        price: 0,
        currency: 'GEL',
        aiModel: "DALL-E 3",
        generationType: 'text-to-image',
        category: "creative",
        coverImage: "/marketplace/covers/creative.png",
        tags: ["t-shirt", "merch", "vector", "illustration"],
        promptTemplate: "Vector illustration for t-shirt of [SUBJECT]. Style: [STYLE]. Colors: Limited palette [COLORS]. Background: [BACKGROUND]. High contrast, clean lines.",
        variables: [
            { name: "SUBJECT", required: true },
            { name: "STYLE", options: ["Retro", "Graffiti", "Minimal", "Comic"], required: true },
            { name: "COLORS", required: true },
            { name: "BACKGROUND", options: ["White", "Black", "None"], required: true }
        ]
    },

    // DEVELOPER & CODE
    {
        title: "React Component Architect",
        slug: "react-component-architect",
        description: "Generate production-ready React components with TypeScript, Tailwind CSS, and best practices.",
        excerpt: "Perfect React components every time.",
        price: 39.00,
        currency: 'GEL',
        aiModel: "Claude 3.5 Sonnet",
        generationType: 'text-to-text',
        category: "developer",
        coverImage: "/marketplace/covers/developer.png",
        tags: ["react", "frontend", "typescript", "tailwind"],
        promptTemplate: "Create a React component named [COMPONENT_NAME].\\nFunctionality: [DESCRIPTION].\\nTech Stack: Next.js 14, TypeScript, Tailwind CSS, Lucide Icons.\\nRequirements:\\n- [REQ_1]\\n- [REQ_2]\\n- Fully responsive\\n- Accessibility compliant",
        variables: [
            { name: "COMPONENT_NAME", required: true },
            { name: "DESCRIPTION", required: true },
            { name: "REQ_1", required: true },
            { name: "REQ_2", required: true }
        ]
    },
    {
        title: "Python Script Optimizer",
        slug: "python-optimizer",
        description: "Optimize your Python scripts for performance, readability, and PEP8 compliance.",
        excerpt: "Make your Python code faster and cleaner.",
        price: 20.00,
        currency: 'GEL',
        aiModel: "GPT-4o",
        generationType: 'text-to-text',
        category: "developer",
        coverImage: "/marketplace/covers/developer.png",
        tags: ["python", "optimization", "refactoring"],
        promptTemplate: "Optimize the following Python code for [GOAL].\\nFocus on: [FOCUS_AREA].\\nApply PEP8 standards.\\nAdd type hints.\\n\\nCode:\\n[PASTE_CODE]",
        variables: [
            { name: "GOAL", options: ["Speed", "Memory Usage", "Readability"], required: true },
            { name: "FOCUS_AREA", required: true },
            { name: "PASTE_CODE", required: true }
        ]
    },
    {
        title: "SQL Query Master",
        slug: "sql-query-master",
        description: "Generate complex SQL queries for any database from plain English descriptions.",
        excerpt: "Complex SQL made simple.",
        price: 0,
        currency: 'GEL',
        aiModel: "Gemini 1.5 Pro",
        generationType: 'text-to-text',
        category: "developer",
        coverImage: "/marketplace/covers/developer.png",
        tags: ["sql", "database", "postgres", "mysql"],
        promptTemplate: "Write a SQL query for [DATABASE_TYPE].\\nGoal: [GOAL].\\nTables:\\n- [TABLE_1] (columns: [COLS_1])\\n- [TABLE_2] (columns: [COLS_2])\\nRequirements: Efficient joins, handle nulls.",
        variables: [
            { name: "DATABASE_TYPE", options: ["PostgreSQL", "MySQL", "MongoDB", "SQLite"], required: true },
            { name: "GOAL", required: true },
            { name: "TABLE_1", required: true },
            { name: "COLS_1", required: true },
            { name: "TABLE_2", required: true },
            { name: "COLS_2", required: true }
        ]
    },
    {
        title: "Regex Master Pattern",
        slug: "regex-master",
        description: "Generate Regular Expressions for any validation or extraction task instantly.",
        excerpt: "Solve Regex headaches forever.",
        price: 0,
        currency: 'GEL',
        aiModel: "GPT-4o",
        generationType: 'text-to-text',
        category: "developer",
        coverImage: "/marketplace/covers/developer.png",
        tags: ["regex", "validation", "developer-tools"],
        promptTemplate: "Create a Regular Expression (Regex) to match [PATTERN_DESCRIPTION].\\nLanguage: [LANGUAGE].\\nTest cases that should match: [MATCH_CASES].\\nTest cases that should NOT match: [NO_MATCH_CASES].\\nExplain how it works.",
        variables: [
            { name: "PATTERN_DESCRIPTION", required: true },
            { name: "LANGUAGE", options: ["JavaScript", "Python", "PHP", "Go"], required: true },
            { name: "MATCH_CASES", required: true },
            { name: "NO_MATCH_CASES", required: true }
        ]
    },
    {
        title: "Unit Test Generator",
        slug: "unit-test-generator",
        description: "Generate comprehensive unit tests for your code functions using Jest, PyTest, or others.",
        excerpt: "100% test coverage easily.",
        price: 15.00,
        currency: 'GEL',
        aiModel: "Claude 3.5 Sonnet",
        generationType: 'text-to-text',
        category: "developer",
        coverImage: "/marketplace/covers/developer.png",
        tags: ["testing", "unit-tests", "qa", "jest"],
        promptTemplate: "Write unit tests for the following code using [FRAMEWORK].\\nCover happy paths, edge cases, and error handling.\\n\\nCode:\\n[PASTE_CODE]",
        variables: [
            { name: "FRAMEWORK", options: ["Jest", "PyTest", "Mocha", "RSpec"], required: true },
            { name: "PASTE_CODE", required: true }
        ]
    },

    // PERSONAL & LIFESTYLE
    {
        title: "Personal Fitness Trainer",
        slug: "fitness-trainer",
        description: "Get a personalized workout plan and nutrition advice based on your goals and equipment.",
        excerpt: "Your AI personal trainer.",
        price: 0,
        currency: 'GEL',
        aiModel: "GPT-4o",
        generationType: 'text-to-text',
        category: "personal",
        coverImage: "/marketplace/covers/personal.png",
        tags: ["fitness", "health", "workout", "nutrition"],
        promptTemplate: "Act as a professional fitness trainer. Create a [DURATION] week workout plan for me.\\nGoal: [GOAL].\\nCurrent fitness level: [LEVEL].\\nEquipment available: [EQUIPMENT].\\nDays per week: [DAYS].\\nInclude warm-ups and cool-downs.",
        variables: [
            { name: "DURATION", options: ["4", "8", "12"], required: true },
            { name: "GOAL", options: ["Weight Loss", "Muscle Gain", "Endurance", "Flexibility"], required: true },
            { name: "LEVEL", options: ["Beginner", "Intermediate", "Advanced"], required: true },
            { name: "EQUIPMENT", required: true },
            { name: "DAYS", required: true }
        ]
    },
    {
        title: "Travel Itinerary Planner",
        slug: "travel-planner",
        description: "Plan the perfect trip with a detailed day-by-day itinerary, hidden gems, and logistics.",
        excerpt: "Stress-free travel planning.",
        price: 9.99,
        currency: 'GEL',
        aiModel: "Gemini 1.5 Pro",
        generationType: 'text-to-text',
        category: "personal",
        coverImage: "/marketplace/covers/personal.png",
        tags: ["travel", "vacation", "planning", "guide"],
        promptTemplate: "Plan a [DAYS] day trip to [DESTINATION] for [TRAVELERS].\\nBudget: [BUDGET].\\nInterests: [INTERESTS].\\nInclude: Accommodation suggestions, daily activities, transport, and food recommendations.",
        variables: [
            { name: "DAYS", required: true },
            { name: "DESTINATION", required: true },
            { name: "TRAVELERS", options: ["Solo", "Couple", "Family", "Friends"], required: true },
            { name: "BUDGET", options: ["Budget", "Mid-range", "Luxury"], required: true },
            { name: "INTERESTS", required: true }
        ]
    },
    {
        title: "Georgian Language Tutor",
        slug: "georgian-tutor",
        description: "Learn Georgian language with a patient AI tutor. Practice conversation, grammar, and vocabulary.",
        excerpt: "Master Georgian with AI.",
        price: 0,
        currency: 'GEL',
        aiModel: "GPT-4o",
        generationType: 'text-to-text',
        category: "personal",
        coverImage: "/marketplace/covers/personal.png",
        tags: ["language", "learning", "georgian", "education"],
        promptTemplate: "Act as a Georgian language tutor. I want to replace English sentences with Georgian translations and explanations.\\nTopic: [TOPIC].\\nMy Level: [LEVEL].\\nProvide 5 useful phrases with pronunciation guide and literal translation.",
        variables: [
            { name: "TOPIC", required: true },
            { name: "LEVEL", options: ["A1 (Beginner)", "A2", "B1", "B2"], required: true }
        ]
    },
    {
        title: "Dream Interpreter",
        slug: "dream-interpreter",
        description: "Analyze your dreams using psychology and symbolism to uncover hidden meanings.",
        excerpt: "What do your dreams mean?",
        price: 5.00,
        currency: 'GEL',
        aiModel: "Claude 3.5 Sonnet",
        generationType: 'text-to-text',
        category: "personal",
        coverImage: "/marketplace/covers/personal.png",
        tags: ["dreams", "psychology", "mystic", "self-discovery"],
        promptTemplate: "Interpret the following dream using Jungian psychology and symbolism.\\nDream: [DREAM_DETAILS].\\nEmotion felt: [EMOTION].\\nProvide: Symbols analysis, emotional meaning, and potential life message.",
        variables: [
            { name: "DREAM_DETAILS", required: true },
            { name: "EMOTION", required: true }
        ]
    },
    {
        title: "Smart Gift Idea Generator",
        slug: "gift-generator",
        description: "Find the perfect gift for anyone based on their interests, age, and your budget.",
        excerpt: "Never stress about gifts again.",
        price: 0,
        currency: 'GEL',
        aiModel: "Gemini 1.5 Pro",
        generationType: 'text-to-text',
        category: "personal",
        coverImage: "/marketplace/covers/personal.png",
        tags: ["gifts", "shopping", "ideas", "lifestyle"],
        promptTemplate: "Suggest 5 gift ideas for a [AGE] year old [RELATIONSHIP].\\nInterests: [INTERESTS].\\nOccasion: [OCCASION].\\nBudget: [BUDGET].\\nFor each idea, explain why it fits.",
        variables: [
            { name: "AGE", required: true },
            { name: "RELATIONSHIP", required: true },
            { name: "INTERESTS", required: true },
            { name: "OCCASION", required: true },
            { name: "BUDGET", required: true }
        ]
    }
];

async function seed() {
    await setupImages();

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    console.log('Clearing existing prompts...');
    // Optional: await MarketplacePrompt.deleteMany({}); 
    // Commented out to be safe, but you might want to uncomment if you want a clean slate.

    let created = 0;
    for (const promptData of PROMPTS) {
        try {
            await MarketplacePrompt.findOneAndUpdate(
                { slug: promptData.slug },
                promptData,
                { upsert: true, new: true }
            );
            console.log(`✅ Seeded: ${promptData.title}`);
            created++;
        } catch (err) {
            console.error(`❌ Error seeding ${promptData.title}:`, err);
        }
    }

    console.log(`\n🎉 Seeded ${created} prompts successfully!`);
    await mongoose.disconnect();
}

seed().catch(console.error);
