// Premium Content Update Script - Part 6
// Final batch: more Vibe Coding + Prompt Engineering

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

const CONTENT_UPDATES: Record<string, string> = {
    'prompt-chaining': `# Prompt Chaining სტრატეგიები

**Prompt Chaining** არის კომპლექსური ამოცანების დაყოფა რამდენიმე თანმიმდევრულ prompt-ად.

---

## 🔗 რა არის Prompt Chaining?

\`\`\`markdown
ერთი კომპლექსური prompt:
"Write a full marketing plan"
↓
Chain of prompts:
1. "Analyze target audience"
2. "Define value proposition"
3. "Create channel strategy"
4. "Write campaign ideas"
5. "Create timeline"
\`\`\`

---

## 💡 Chaining Patterns

### 1. Sequential Chain
\`\`\`markdown
Output A → Input B → Output B → Input C
\`\`\`

### 2. Parallel Chain
\`\`\`markdown
Input → [Branch A, Branch B, Branch C] → Merge
\`\`\`

### 3. Conditional Chain
\`\`\`markdown
Input → If [condition] → Path A / Else → Path B
\`\`\`

---

## 🎯 Use Cases

### Code Development:
\`\`\`markdown
1. "Design the database schema"
2. "Create the API endpoints"
3. "Implement the frontend"
4. "Write tests"
5. "Add documentation"
\`\`\`

### Content Creation:
\`\`\`markdown
1. "Research topic"
2. "Create outline"
3. "Write first draft"
4. "Edit for clarity"
5. "Optimize for SEO"
\`\`\`

---

## 📝 Implementation

### Manual Chaining:
\`\`\`markdown
Step 1 output → Copy to Step 2 input
Repeat for each step
\`\`\`

### Automated (LangChain):
\`\`\`python
from langchain import PromptTemplate, LLMChain

chain1 = LLMChain(prompt=template1)
chain2 = LLMChain(prompt=template2)

result = chain1.run(input) | chain2.run
\`\`\`

---

## ✅ Best Practices

1. **Clear handoffs** — output format = input format
2. **Validation** — check each step
3. **Error handling** — what if step fails?
4. **Logging** — track the chain
5. **Modularity** — reusable components

> 💎 **Premium**: Chain templates + automation scripts!
`,

    'tools-matrix-2025': `# 2025 წლის საუკეთესო Vibe Coding ინსტრუმენტები

**სრული matrix** 2025 წლის AI კოდინგ ინსტრუმენტებისთვის.

---

## 🏆 IDE & Editors

| Tool | AI Power | Price | Best For |
|:---|:---|:---|:---|
| **Cursor** | ⭐⭐⭐⭐⭐ | $20/თვე | Power users |
| **Windsurf** | ⭐⭐⭐⭐ | $15/თვე | Cascade agent |
| **VS Code + Copilot** | ⭐⭐⭐⭐ | $10/თვე | Familiar |
| **Zed** | ⭐⭐⭐ | Free | Speed |
| **Neovim + AI** | ⭐⭐⭐ | Free | Terminal lovers |

---

## 🤖 AI Models

| Model | Coding | Context | Speed |
|:---|:---|:---|:---|
| **Claude 3.5 Sonnet** | ⭐⭐⭐⭐⭐ | 200K | ⭐⭐⭐⭐ |
| **GPT-4o** | ⭐⭐⭐⭐ | 128K | ⭐⭐⭐⭐⭐ |
| **GPT-4-mini** | ⭐⭐⭐ | 128K | ⭐⭐⭐⭐⭐ |
| **Gemini Pro** | ⭐⭐⭐⭐ | 1M | ⭐⭐⭐⭐ |
| **DeepSeek** | ⭐⭐⭐⭐ | 64K | ⭐⭐⭐⭐⭐ |

---

## 🚀 Prototyping

| Tool | Speed | Quality | Deploy |
|:---|:---|:---|:---|
| **Bolt.new** | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐ | ✅ |
| **v0.dev** | ⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | ✅ |
| **Replit** | ⚡⚡⚡⚡ | ⭐⭐⭐⭐ | ✅ |
| **Lovable** | ⚡⚡⚡⚡ | ⭐⭐⭐⭐ | ✅ |

---

## 📦 Specialized Tools

| Category | Tool | Purpose |
|:---|:---|:---|
| Testing | Metatest | AI test gen |
| Debug | Jam.dev | Bug reports |
| Docs | Mintlify | Documentation |
| Deploy | Vercel | Hosting |
| Design | Figma AI | Design-to-code |

---

## 💡 Recommended Stacks

### Starter ($0):
\`\`\`
Cursor Free + ChatGPT Free + Bolt.new
\`\`\`

### Professional ($60/თვე):
\`\`\`
Cursor Pro + Claude Pro + v0.dev Pro
\`\`\`

### Enterprise:
\`\`\`
Custom + API access + Team tools
\`\`\`

> 💎 **Premium**: Full comparison + selection guide!
`,

    'best-practices': `# საუკეთესო პრაქტიკები Cursor-თან

**Cursor-ის ეფექტური** გამოყენება მოითხოვს სწორ მიდგომას.

---

## ⌨️ Workflow Optimization

### 1. Shortcuts Master
| Action | Mac | Windows |
|:---|:---|:---|
| Inline Edit | Cmd+K | Ctrl+K |
| Chat | Cmd+L | Ctrl+L |
| Composer | Cmd+I | Ctrl+I |
| Accept | Tab | Tab |
| Reject | Esc | Esc |

### 2. @ Mentions
\`\`\`markdown
@file - specific file context
@folder - directory context
@codebase - project-wide search
@web - internet search
@docs - documentation
\`\`\`

---

## 📁 Project Setup

### .cursorrules File:
\`\`\`markdown
# Create .cursorrules in project root

You are an expert in TypeScript and React.
Follow these guidelines:
- Use functional components
- Prefer hooks over classes
- Add JSDoc comments
- Follow SOLID principles
- Use Tailwind for styling
\`\`\`

### Codebase Indexing:
1. Settings → Features → Codebase Indexing
2. Enable for better context
3. Wait for initial index

---

## 💬 Chat Best Practices

### Be Specific:
\`\`\`markdown
❌ "Fix this"
✅ "The login form should validate 
    email format before submission"
\`\`\`

### Use Context:
\`\`\`markdown
"Looking at @api/auth.ts, why does 
the token validation fail for expired tokens?"
\`\`\`

### Multi-turn:
\`\`\`markdown
1. "Design the component structure"
2. "Now implement the main component"
3. "Add error handling"
4. "Write tests"
\`\`\`

---

## 🛠️ Composer Tips

### Multi-file Edits:
\`\`\`markdown
"Refactor authentication:
1. Update @lib/auth.ts
2. Create @components/AuthForm.tsx
3. Update @app/login/page.tsx"
\`\`\`

### Review Before Apply:
- Check diff carefully
- Test incrementally
- Commit frequently

---

## ⚡ Performance

1. **Disable unused extensions**
2. **Use project-specific settings**
3. **Index only necessary files**
4. **Close unused tabs**

> 💎 **Premium**: Advanced Cursor workflows!
`,

    'advanced-prompting': `# პროფესიონალური Prompting სტრატეგიები

**Advanced prompting** ტექნიკები 10x ხარისხს იძლევა.

---

## 🧠 Meta-Prompting

### რას ნიშნავს:
AI-ს prompt-ის დახვეწა.

\`\`\`markdown
"I want to create a prompt for generating 
API documentation. Help me design it:
1. What context is needed?
2. What format is best?
3. What constraints should I include?"
\`\`\`

---

## 🔄 Self-Consistency

### Multiple Attempts:
\`\`\`markdown
"Generate 3 different solutions for this 
problem, then analyze which is best"
\`\`\`

### Verification:
\`\`\`markdown
"Review your own solution:
- Is it correct?
- Any edge cases missed?
- Can it be optimized?"
\`\`\`

---

## 🎭 Persona Stacking

\`\`\`markdown
"You are simultaneously:
1. A senior architect (for design)
2. A security expert (for vulnerabilities)
3. A performance engineer (for optimization)

Review this code from all perspectives."
\`\`\`

---

## 📊 Structured Output

### JSON Schema:
\`\`\`markdown
"Respond with JSON matching this schema:
{
  'analysis': string,
  'issues': Array<{severity, description}>,
  'recommendations': string[]
}"
\`\`\`

### Markdown Tables:
\`\`\`markdown
"Format as markdown table:
| Issue | Impact | Fix |
\`\`\`

---

## 🔍 Recursive Refinement

\`\`\`markdown
Round 1: "Create basic implementation"
Round 2: "Improve error handling"
Round 3: "Optimize performance"
Round 4: "Add comprehensive comments"
Round 5: "Final review and polish"
\`\`\`

---

## 💡 Context Injection

### Before the Task:
\`\`\`markdown
"Context: [relevant code/docs]

Given the above context, [your task]"
\`\`\`

### Reference Patterns:
\`\`\`markdown
"Following the pattern from @existing-file,
create a similar component for [new use case]"
\`\`\`

> 💎 **Premium**: Advanced prompt library!
`,

    'architecture-patterns': `# არქიტექტურული პატერნები Vibe Coding-ით

**სწორი არქიტექტურა** კრიტიკულია სწრაფი და მდგრადი კოდისთვის.

---

## 🏗️ Project Structure

### Standard Web App:
\`\`\`markdown
src/
├── app/          # Routes/Pages
├── components/   # UI Components
│   ├── ui/       # Primitives
│   └── features/ # Feature-specific
├── lib/          # Utilities
├── hooks/        # Custom hooks
├── services/     # API/External
├── types/        # TypeScript
└── styles/       # Global CSS
\`\`\`

---

## 📦 Component Patterns

### Container/Presenter:
\`\`\`markdown
UserListContainer (data fetching)
  └── UserList (display logic)
       └── UserCard (UI)
\`\`\`

### Compound Components:
\`\`\`markdown
<Tabs>
  <Tabs.List>
    <Tabs.Item>Tab 1</Tabs.Item>
  </Tabs.List>
  <Tabs.Panel>Content</Tabs.Panel>
</Tabs>
\`\`\`

---

## 🔌 API Design

### REST:
\`\`\`markdown
GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
\`\`\`

### With AI Prompt:
\`\`\`markdown
"Design RESTful API for:
- Resource: Users
- Actions: CRUD + search
- Auth: JWT
- Pagination
- Error handling"
\`\`\`

---

## 💾 State Management

### When to Use What:
| State Type | Solution |
|:---|:---|
| Local UI | useState |
| Shared UI | Context |
| Server | React Query |
| Complex | Zustand/Redux |

### Prompt:
\`\`\`markdown
"Set up Zustand store for:
- User auth state
- Shopping cart
- UI preferences
With proper typing and persist"
\`\`\`

---

## 🔄 Data Flow

\`\`\`markdown
UI → Action → Service → API → DB
      ↓
    State Update
      ↓
    Re-render
\`\`\`

---

## ✅ Checklist

- [ ] Clear folder structure
- [ ] Component boundaries
- [ ] Type safety
- [ ] Error boundaries
- [ ] Loading states
- [ ] Separation of concerns

> 💎 **Premium**: Architecture templates!
`,

    'security-best-practices': `# უსაფრთხოება და Best Practices

**Security first!** AI-generated კოდში უსაფრთხოება განსაკუთრებით მნიშვნელოვანია.

---

## 🔐 Common Vulnerabilities

### 1. Injection Attacks
\`\`\`markdown
❌ AI may generate:
const query = \`SELECT * FROM users WHERE id = \${id}\`

✅ Should be:
const query = 'SELECT * FROM users WHERE id = ?'
db.query(query, [id])
\`\`\`

### 2. Hardcoded Secrets
\`\`\`markdown
❌ AI may generate:
const API_KEY = 'sk-xxx123'

✅ Should be:
const API_KEY = process.env.API_KEY
\`\`\`

### 3. Missing Validation
\`\`\`markdown
❌ No input validation
✅ Always validate user input
\`\`\`

---

## ✅ Security Checklist

### Authentication:
- [ ] Password hashing (bcrypt)
- [ ] JWT best practices
- [ ] Session management
- [ ] Rate limiting

### Data:
- [ ] Input validation
- [ ] Output encoding
- [ ] SQL injection prevention
- [ ] XSS prevention

### Infrastructure:
- [ ] HTTPS only
- [ ] CORS configured
- [ ] Headers secured
- [ ] Dependencies updated

---

## 🛡️ Prompt for Security Review

\`\`\`markdown
"Review this code for security issues:
[code]

Check for:
1. Injection vulnerabilities
2. Authentication flaws
3. Data exposure
4. Hardcoded secrets
5. Missing error handling"
\`\`\`

---

## 📝 Environment Variables

### .env.local:
\`\`\`
DATABASE_URL=
API_KEY=
JWT_SECRET=
\`\`\`

### .env.example:
\`\`\`
DATABASE_URL=your_database_url
API_KEY=your_api_key
JWT_SECRET=random_32_char_string
\`\`\`

---

## 🚨 AI Security Pitfalls

1. **Blindly trusting AI output**
2. **Not reviewing security**
3. **Using outdated patterns**
4. **Ignoring error handling**
5. **Exposing sensitive data in prompts**

> 💎 **Premium**: Security audit checklist!
`,

    'cicd-deployment': `# CI/CD და Deployment AI-ით

**Deployment automation** AI-ით მარტივია და საიმედო.

---

## 🚀 Quick Deploy Options

| Platform | Best For | Free Tier |
|:---|:---|:---|
| **Vercel** | Next.js, React | ✅ Generous |
| **Netlify** | Static, JAMstack | ✅ Good |
| **Railway** | Full-stack | ✅ Limited |
| **Render** | Backend | ✅ Limited |
| **Fly.io** | Containers | ✅ Good |

---

## 📦 Vercel Deployment

### Setup:
\`\`\`bash
npm i -g vercel
vercel login
vercel
\`\`\`

### With AI:
\`\`\`markdown
"Configure Vercel deployment:
- Environment variables
- Build settings
- Domain setup
- Preview deployments"
\`\`\`

---

## 🔄 GitHub Actions

### Basic Workflow:
\`\`\`yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test
      - run: npm run build
\`\`\`

### AI Prompt:
\`\`\`markdown
"Create GitHub Actions workflow:
- Run tests on PR
- Build and deploy on main
- Send Slack notification
- Cache node_modules"
\`\`\`

---

## 🐳 Docker

### Dockerfile:
\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
\`\`\`

---

## ✅ Pre-Deploy Checklist

- [ ] Tests pass
- [ ] Build succeeds
- [ ] Env vars set
- [ ] Security reviewed
- [ ] Performance tested
- [ ] Monitoring ready

---

## 📊 Monitoring

| Tool | Purpose | Free |
|:---|:---|:---|
| Sentry | Errors | ✅ |
| LogRocket | Sessions | ✅ |
| Vercel Analytics | Performance | ✅ |
| Uptime Robot | Uptime | ✅ |

> 💎 **Premium**: CI/CD templates!
`,

    'monetization-guide': `# Vibe Coding უნარების მონეტიზაცია

**Vibe Coding skills = income** — აი როგორ.

---

## 💰 Income Streams

### 1. Freelancing ($1K-10K/თვე)
- Web development
- App development
- Automation
- Chatbots

### 2. Products ($500-50K/თვე)
- SaaS apps
- Templates
- Courses
- Prompt packs

### 3. Agency ($5K-100K/თვე)
- Full-service development
- Team management
- Client relations

### 4. Employment ($80K-200K/წელი)
- AI-focused roles
- Higher productivity
- Competitive advantage

---

## 📊 Quick Start Path

### Month 1-2:
\`\`\`
Master tools → Build portfolio
5 projects, various types
\`\`\`

### Month 3-4:
\`\`\`
First clients → Freelance platforms
Upwork, Fiverr, LinkedIn
\`\`\`

### Month 5-6:
\`\`\`
Scale → Specialize or productize
Niche down or create products
\`\`\`

---

## 🎯 Pricing Guide

| Service | Price Range |
|:---|:---|
| Landing page | $500-2,000 |
| Web app | $2,000-10,000 |
| Mobile app | $5,000-25,000 |
| SaaS MVP | $10,000-50,000 |
| Chatbot | $1,000-5,000 |

---

## 📝 Portfolio Projects

### Must-Have:
1. E-commerce site
2. Dashboard/Admin
3. Mobile app
4. API/Backend
5. AI integration

### Showcase:
- Live demos
- GitHub repos
- Case studies
- Before/after

---

## 🚀 Action Plan

### დღეს:
- [ ] Create portfolio site
- [ ] Update LinkedIn
- [ ] Join communities

### კვირა:
- [ ] Build 2 projects
- [ ] Post content
- [ ] Network

### თვეში:
- [ ] Land first client
- [ ] Get testimonial
- [ ] Iterate

> 💎 **Premium**: Full monetization playbook!
`,

    'vibe-coding-glossary': `# Vibe Coding ტერმინების ლექსიკონი

**A-Z ტერმინები** Vibe Coding-ში.

---

## A

**Agent Mode** — AI რომელიც თვითონ ასრულებს tasks.

**Autocomplete** — კოდის ავტომატური დასრულება.

---

## C

**Chain-of-Thought** — ნაბიჯ-ნაბიჯ აზროვნება.

**Codebase Indexing** — პროექტის AI-სთვის ანალიზი.

**Composer** — Cursor-ის multi-file editing.

**Context Window** — AI-ის მეხსიერების ზომა.

---

## F

**Few-Shot** — მაგალითებით სწავლება.

---

## H

**Hallucination** — AI-ის არასწორი ინფორმაცია.

---

## L

**LLM** — Large Language Model.

**Long Context** — დიდი მეხსიერების მოდელები.

---

## M

**Multi-modal** — text + image + audio.

---

## P

**Prompt** — AI-სთვის მიცემული ინსტრუქცია.

**Prompt Engineering** — პროფესიონალური prompting.

---

## R

**RAG** — Retrieval Augmented Generation.

**Reasoning** — AI-ის ლოგიკური აზროვნება.

---

## S

**System Prompt** — AI-ის საწყისი ინსტრუქციები.

---

## T

**Token** — ტექსტის ერთეული AI-სთვის.

**Transformer** — AI არქიტექტურა.

---

## V

**Vibe Coding** — AI-assisted პროგრამირება.

---

## Z

**Zero-Shot** — მაგალითების გარეშე სწავლება.

> 💎 **Premium**: Extended glossary + examples!
`,

    'ai-history': `# AI პროგრამირების ისტორია

**AI coding-ის ევოლუცია** — 50 წლის მოგზაურობა.

---

## 📅 Timeline

### 1950-1980: Foundations
- **1950** — Turing Test
- **1956** — AI term coined
- **1970s** — Expert systems

### 1980-2010: Machine Learning
- **1986** — Neural networks
- **1997** — Deep Blue beats Kasparov
- **2006** — Deep learning begins

### 2010-2020: Deep Learning Era
- **2012** — AlexNet (computer vision)
- **2017** — Transformers paper
- **2018** — GPT-1

### 2020+: LLM Revolution
- **2020** — GPT-3
- **2021** — GitHub Copilot
- **2022** — ChatGPT
- **2023** — GPT-4, Claude
- **2024** — Agents era
- **2025** — Vibe Coding mainstream

---

## 🎯 Milestones

| Year | Event | Impact |
|:---|:---|:---|
| 2021 | Copilot | First AI coding assistant |
| 2022 | ChatGPT | AI mainstream |
| 2023 | GPT-4 | Pro-level coding |
| 2024 | Claude 3 | Long context |
| 2025 | Agents | Autonomous coding |

---

## 🔮 მომავალი

### 2025-2027:
- More capable agents
- Specialized models
- Local AI on devices
- AI-human collaboration standard

### 2027-2030:
- AGI possibilities
- Full automation potential
- New programming paradigms

---

## 💡 Key Insights

1. **Progress exponential** — ყოველ წელს 10x
2. **Tools commoditize** — უფასო ხდება
3. **Skills shift** — prompting > syntax
4. **Opportunity grows** — ადრე მოსწვდი

> 💎 **Premium**: Detailed AI history timeline!
`,
};

async function updateContent() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    let updated = 0;
    let errors = 0;

    for (const [slug, content] of Object.entries(CONTENT_UPDATES)) {
        try {
            const result = await Article.findOneAndUpdate(
                { slug },
                {
                    content,
                    estimatedMinutes: Math.ceil(content.split(/\s+/).length / 200),
                    excerpt: content.substring(0, 200).replace(/[#*\`]/g, '').trim() + '...',
                    version: 2,
                },
                { new: true }
            );
            if (result) {
                console.log(`✅ Updated: ${slug}`);
                updated++;
            } else {
                console.log(`⚠️ Not found: ${slug}`);
            }
        } catch (err) {
            console.error(`❌ Error: ${slug}`, err);
            errors++;
        }
    }

    console.log(`\n📊 Results: ${updated} updated, ${errors} errors`);
    await mongoose.disconnect();
}

updateContent().catch(console.error);
