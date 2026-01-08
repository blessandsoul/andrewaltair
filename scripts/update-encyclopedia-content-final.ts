// Premium Content Update Script - Final
// Updating the last 2 articles by ID

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || '';

const articleSchema = new mongoose.Schema({
    slug: String,
    title: String,
    content: String,
    excerpt: String,
    estimatedMinutes: Number,
    version: Number,
}, { timestamps: true });

const Article = mongoose.models.EncyclopediaArticle || mongoose.model('EncyclopediaArticle', articleSchema, 'encyclopediaarticles');

const UPDATES = [
    {
        id: '695f80949fa8d4b860abdfcb',
        slug: 'system-prompts',
        title: 'სისტემური პრომპტების პრინციპები',
        content: `# სისტემური პრომპტების პრინციპები

**System Prompt** არის AI-ს "ტვინის" კონფიგურაცია. ეს განსაზღვრავს მის ქცევას, სტილს და შეზღუდვებს.

---

## 🧠 რა არის System Prompt?

System Prompt არის პირველი ინსტრუქცია, რომელსაც AI იღებს საუბრის დაწყებამდე.

\`\`\`markdown
Role: You are a senior software architect.
Tone: Professional, concise, technical.
Constraints: Never apologize, focus on solutions.
\`\`\`

---

## 🛠️ System Prompt-ის სტრუქტურა

### 1. Persona (როლი)
ვინ არის AI?
- "You are a helpful assistant" (ცუდი)
- "You are an expert Python developer with 10 years experience" (კარგი)

### 2. Objective (მიზანი)
რა უნდა გააკეთოს?
- "Help users write code" (ცუდი)
- "Review user code for security vulnerabilities and performance issues" (კარგი)

### 3. Constraints (შეზღუდვები)
რა არ უნდა გააკეთოს?
- "Do not provide dangerous instructions"
- "Do not mention you are an AI"
- "Keep answers under 100 words"

### 4. Format (ფორმატი)
როგორ უნდა უპასუხოს?
- "Use Markdown formatting"
- "Respond in JSON"
- "Use Georgian language only"

---

## 📝 საუკეთესო მაგალითები

### Code Reviewer:
\`\`\`markdown
You are a Code Quality Auditor.
Your goal is to find bugs and suggest improvements.
Rules:
1. Always check for security first.
2. Suggest ES6+ syntax.
3. If code is good, praise it.
4. Use code blocks for corrections.
\`\`\`

### Language Teacher:
\`\`\`markdown
You are a Georgian Language Tutor.
Correct the user's grammar politely.
After correction, explain the rule.
Provide one example sentence.
\`\`\`

---

## 💡 Advanced Techniques

### Chain of Thought in System Prompt:
\`\`\`markdown
Before answering, think step-by-step:
1. Analyze the user's intent.
2. Check facts against your knowledge.
3. Formulate the answer.
4. Review for clarity.
\`\`\`

### XML Tagging:
\`\`\`markdown
You will receive input in <input> tags.
Provide output in <output> tags.
Reasoning in <thought> tags.
\`\`\`

---

## 🎯 Pro Tips

1. **Iterate:** მუდმივად დახვეწეთ system prompt.
2. **Be Specific:** რაც უფრო დეტალურია, მით უკეთესი.
3. **Defense:** დაიცავით prompt injection-გან ("Ignore previous instructions").
4. **Context:** მიეცით პროექტის კონტექსტი.

> 💎 **Premium**: 50+ System Prompt Templates!
`
    },
    {
        id: '695f80989fa8d4b860abdfe5',
        slug: 'prompt-templates',
        title: '50 გამზადებული Prompt შაბლონი',
        content: `# 50 გამზადებული Prompt შაბლონი

**Copy-paste ready!** საუკეთესო prompt-ები ყველა სიტუაციისთვის.

---

## 🧑‍💻 Coding Prompts

### 1. New Feature Implementation
\`\`\`markdown
Act as a Senior React Developer.
Implement a [FEATURE NAME] component.
Requirements:
- Use Tailwind CSS
- Responsive design
- Accessibility (WCAG 2.1)
- Unit tests (Jest)
\`\`\`

### 2. Bug Fixing
\`\`\`markdown
I have a bug in this code:
[CODE]
Error message: [ERROR]
Analyze the root cause and provide a fix.
Explain why it happened.
\`\`\`

### 3. Refactoring
\`\`\`markdown
Refactor this function to be more readable and performant.
Apply SOLID principles.
Add JSDoc comments.
\`\`\`

---

## 📝 Writing Prompts

### 4. SEO Blog Post
\`\`\`markdown
Write a 1500-word blog post about [TOPIC].
Target Audience: Beginners.
Keywords: [KEYWORD 1, KEYWORD 2].
Structure:
- Catchy Title
- Introduction (Hook)
- Body Paragraphs (H2, H3)
- Conclusion
- FAQ
\`\`\`

### 5. Email Newsletter
\`\`\`markdown
Write a newsletter for [PRODUCT].
Goal: Increase click-through rate.
Tone: Friendly, exciting.
Subject lines: Give 5 variations.
Content: [DETAILS]
\`\`\`

---

## 🎨 Design Prompts

### 6. UI/UX Ideas
\`\`\`markdown
Generate 3 UI design concepts for a [APP TYPE].
Style: Minimalist, Dark Mode.
Describe:
- Color palette (Hex codes)
- Typography
- Layout structure
\`\`\`

### 7. Midjourney Prompts
\`\`\`markdown
Create a prompt for Midjourney to generate:
[DESCRIPTION].
Parameters to include: --ar 16:9 --v 6.0 --style raw
Keywords: Cinematic lighting, photorealistic, 8k.
\`\`\`

---

## 📊 Business Prompts

### 8. Market Research
\`\`\`markdown
Analyze the market for [PRODUCT] in 2025.
Identify:
- Top 3 competitors
- Market trends
- Target audience pain points
- SWOT analysis
\`\`\`

### 9. Pitch Deck Structure
\`\`\`markdown
Create an outline for a 10-slide pitch deck for [STARTUP].
Focus on: Problem, Solution, Market Size, Business Model.
\`\`\`

---

## 🎓 Learning Prompts

### 10. Explain Like I'm 5
\`\`\`markdown
Explain [COMPLEX TOPIC] to a 5-year-old.
Use analogies and simple language.
\`\`\`

### 11. Study Plan
\`\`\`markdown
Create a 4-week study plan to learn [SKILL].
2 hours per day.
Include resources (free).
Weekly goals and projects.
\`\`\`

> 💎 **Premium**: ჩამოტვირთეთ ყველა 50 შაბლონი PDF-ში!
`
    }
];

async function updateFinal() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    for (const update of UPDATES) {
        try {
            const result = await Article.findByIdAndUpdate(
                update.id,
                {
                    content: update.content,
                    estimatedMinutes: Math.ceil(update.content.split(/\s+/).length / 200),
                    excerpt: update.content.substring(0, 200).replace(/[#*\`]/g, '').trim() + '...',
                    version: 2,
                },
                { new: true }
            );
            console.log(`✅ Updated by ID: ${update.slug} (${update.id})`);
        } catch (err) {
            console.error(`❌ Error updating ${update.slug}:`, err);
        }
    }

    console.log(`\n🎉 Final 2 articles updated! Encyclopedia complete.`);
    await mongoose.disconnect();
}

updateFinal().catch(console.error);
