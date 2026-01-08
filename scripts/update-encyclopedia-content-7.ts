// Premium Content Update Script - Part 7
// Final batch: remaining 23 articles

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
    'real-world-examples': `# რეალური პროექტების მაგალითები

**რეალური პროექტები** საუკეთესო გზაა Vibe Coding-ის დასწავლისთვის.

---

## 🛒 E-commerce MVP

### დავალება:
\`\`\`markdown
"Create an e-commerce MVP with:
- Product listing
- Shopping cart
- Checkout (Stripe)
- User accounts
- Admin dashboard"
\`\`\`

### Timeline: 1 კვირა
| Day | Task |
|:---|:---|
| 1-2 | Setup + Auth |
| 3-4 | Products + Cart |
| 5-6 | Checkout + Payments |
| 7 | Polish + Deploy |

### Stack:
- Next.js 14
- Prisma + PostgreSQL
- Stripe
- Tailwind

---

## 📊 Dashboard App

### დავალება:
\`\`\`markdown
"Create analytics dashboard:
- Real-time data
- Charts (Recharts)
- Filters
- Export CSV/PDF"
\`\`\`

### Features:
- Date range picker
- Multiple chart types
- Responsive tables
- Dark mode

---

## 🤖 AI Chatbot

### დავალება:
\`\`\`markdown
"Build customer support chatbot:
- OpenAI integration
- Conversation history
- Knowledge base
- Human handoff"
\`\`\`

### Architecture:
\`\`\`
User → Widget → API → OpenAI
          ↓
     Knowledge Base
\`\`\`

---

## 📱 Mobile App

### დავალება:
\`\`\`markdown
"Create React Native app:
- Authentication
- Push notifications
- Offline support
- Camera integration"
\`\`\`

### Stack:
- Expo
- React Navigation
- AsyncStorage
- Firebase

---

## 🎓 Learning Platform

### Features:
- Course catalog
- Video player
- Progress tracking
- Certificates
- Payment integration

### Timeline: 2 კვირა

> 💎 **Premium**: Full source code for all projects!
`,

    'language-elements': `# ენის ელემენტები Vibe Coding-ში

**სწორი ტერმინოლოგია** აუმჯობესებს AI-სთან კომუნიკაციას.

---

## 📝 Action Verbs

### Creation:
| Verb | გამოყენება |
|:---|:---|
| Create | ახალი კომპონენტი |
| Generate | კონტენტი, მონაცემები |
| Build | სტრუქტურა |
| Design | არქიტექტურა |
| Implement | ფუნქციონალი |

### Modification:
| Verb | გამოყენება |
|:---|:---|
| Update | ცვლილება |
| Refactor | გაუმჯობესება |
| Optimize | პერფორმანსი |
| Fix | შეცდომა |
| Enhance | ფუნქცია |

### Analysis:
| Verb | გამოყენება |
|:---|:---|
| Analyze | კოდის განხილვა |
| Explain | ახსნა |
| Review | შემოწმება |
| Debug | პრობლემის პოვნა |
| Compare | შედარება |

---

## 🎯 Specificity Words

### Precision:
\`\`\`markdown
"exactly" — ზუსტად ასე
"only" — მხოლოდ ეს
"specifically" — კონკრეტულად
"must" — აუცილებელი
"strictly" — მკაცრად
\`\`\`

### Flexibility:
\`\`\`markdown
"optionally" — სურვილისამებრ
"preferably" — სასურველია
"if possible" — თუ შესაძლებელია
"consider" — გაითვალისწინე
\`\`\`

---

## 📋 Structure Words

### Organization:
\`\`\`markdown
"First... Then..." — თანმიმდევრობა
"Include..." — ჩართვა
"Separate..." — გამოყოფა
"Group..." — დაჯგუფება
"Organize..." — სტრუქტურირება
\`\`\`

---

## 💡 Examples

### ცუდი:
\`\`\`markdown
"Make it better"
"Fix the thing"
"Add stuff"
\`\`\`

### კარგი:
\`\`\`markdown
"Refactor the authentication flow 
to use secure session tokens"
"Fix the null pointer exception 
in the user validation function"
"Add pagination with 10 items per page"
\`\`\`

> 💎 **Premium**: ტერმინების სრული ლექსიკონი!
`,

    'pitfalls': `# ხარვეზების შეჯამება

**თავიდან ასაცილებელი** ხარვეზები Vibe Coding-ში.

---

## 🚫 Prompting Pitfalls

### 1. ბუნდოვანება
\`\`\`markdown
❌ "Make it work"
✅ "The login form should validate 
    email format and show error message"
\`\`\`

### 2. კონტექსტის ნაკლებობა
\`\`\`markdown
❌ "Fix this error"
✅ "Fix this TypeScript error: 
    Type 'string' is not assignable to 'number'
    in the calculateTotal function"
\`\`\`

### 3. ზედმეტი სიმარტივე
\`\`\`markdown
❌ "Create a complete SaaS"
✅ Step-by-step approach
\`\`\`

---

## 🚫 Code Quality Pitfalls

### 1. Blind Copy-Paste
- ყოველთვის წაიკითხე კოდი
- გაიგე რას აკეთებს
- შეამოწმე security

### 2. No Testing
- AI-ს tests აწერინე
- Manual testing
- Edge cases

### 3. No Error Handling
\`\`\`markdown
❌ Happy path only
✅ try-catch, loading, errors
\`\`\`

---

## 🚫 Workflow Pitfalls

### 1. No Version Control
\`\`\`markdown
❌ მხოლოდ ლოკალური ცვლილებები
✅ Git commit frequently
\`\`\`

### 2. No Documentation
\`\`\`markdown
❌ კოდი კომენტარების გარეშე
✅ AI-ს documentation აწერინე
\`\`\`

### 3. Single Tool Dependency
\`\`\`markdown
❌ მხოლოდ ერთი tool
✅ სწორი tool სწორი ამოცანისთვის
\`\`\`

---

## ✅ Prevention Checklist

- [ ] Prompt კონკრეტულია?
- [ ] კოდი reviewed?
- [ ] Tests დაწერილია?
- [ ] Errors handled?
- [ ] Git committed?

> 💎 **Premium**: Pitfall prevention guide!
`,

    'strict-constraints': `# მკაცრი წინაპირობები

**მკაცრი constraints** უზრუნველყოფს თანმიმდევრულ შედეგებს.

---

## 📏 Constraint Types

### Technical:
\`\`\`markdown
"Use TypeScript strictly - no 'any' types"
"Maximum file size: 200 lines"
"All functions must have JSDoc"
"No external dependencies"
\`\`\`

### Format:
\`\`\`markdown
"Respond in JSON format only"
"Use exactly this structure: {...}"
"Maximum 3 sentences per paragraph"
"Include code comments"
\`\`\`

### Style:
\`\`\`markdown
"Use camelCase for variables"
"Follow Airbnb style guide"
"Use functional components only"
"Tailwind for all styling"
\`\`\`

---

## 💡 Constraint Patterns

### Template:
\`\`\`markdown
MUST:
- [requirement 1]
- [requirement 2]

MUST NOT:
- [prohibition 1]
- [prohibition 2]

PREFER:
- [preference 1]
\`\`\`

### Example:
\`\`\`markdown
MUST:
- Use TypeScript
- Handle errors
- Include loading states

MUST NOT:
- Use class components
- Mutate state directly
- Skip validation

PREFER:
- Functional approach
- Named exports
\`\`\`

---

## 🎯 Constraint Benefits

| Without | With |
|:---|:---|
| Inconsistent output | Predictable |
| Random styling | Uniform |
| Missing elements | Complete |
| Review needed | Ready to use |

---

## 📝 Examples

### API Response:
\`\`\`markdown
Constraints:
- Always return {success: boolean, data?: T, error?: string}
- Use HTTP status codes correctly
- Include timestamps
\`\`\`

### Component:
\`\`\`markdown
Constraints:
- Accept props typed with interface
- Export default + types
- Include loading/error states
- Mobile-first responsive
\`\`\`

> 💎 **Premium**: Constraint templates library!
`,

    'meta-methodology': `# მეტა-მეთოდოლოგია

**მეტა-მეთოდოლოგია** — AI-ს prompt-ის გაუმჯობესებინე.

---

## 🔄 Meta-Prompting

### რა არის:
AI-ს სთხოვო შენი prompt-ის გაუმჯობესებას.

### Example:
\`\`\`markdown
"I want to ask AI to create a login form.
Help me write a better prompt that will:
1. Be specific
2. Include all requirements
3. Reduce ambiguity"
\`\`\`

---

## 📝 Prompt Improvement Loop

\`\`\`markdown
1. Write initial prompt
2. Ask AI to improve it
3. Test improved version
4. Iterate
5. Save best version
\`\`\`

---

## 💡 Meta Techniques

### 1. Prompt Critique
\`\`\`markdown
"Review this prompt and suggest 
improvements for clarity and specificity:
[your prompt]"
\`\`\`

### 2. Prompt Expansion
\`\`\`markdown
"This prompt is too vague. 
Expand it with necessary details:
[your prompt]"
\`\`\`

### 3. Prompt Compression
\`\`\`markdown
"This prompt is too long.
Make it concise without losing requirements:
[your prompt]"
\`\`\`

---

## 🎯 Use Cases

| Situation | Meta Approach |
|:---|:---|
| Poor results | "Why didn't this work?" |
| Inconsistent | "How to make consistent?" |
| Too verbose | "Compress while keeping quality" |
| Missing info | "What context is needed?" |

---

## 📊 Benefits

- Better prompts over time
- Learning prompt patterns
- Reduced iterations
- Higher quality output

> 💎 **Premium**: Meta-prompting advanced guide!
`,

    'programming-way': `# პროგრამირების გზა

**პროგრამირების სწორი გზა** Vibe Coding-ში.

---

## 🎯 The Vibe Coding Way

### ტრადიციული:
\`\`\`
იდეა → სწავლა → coding → debug → deploy
\`\`\`

### Vibe Coding:
\`\`\`
იდეა → prompt → review → iterate → deploy
\`\`\`

---

## 📝 Key Principles

### 1. Describe, Don't Code
\`\`\`markdown
❌ ხელით კოდის წერა
✅ მოთხოვნის აღწერა
\`\`\`

### 2. Iterate Rapidly
\`\`\`markdown
შედეგი → feedback → improve → repeat
\`\`\`

### 3. Review Everything
\`\`\`markdown
AI output → human review → approve/edit
\`\`\`

### 4. Learn Patterns
\`\`\`markdown
რა მუშაობს → შეინახე → გამოიყენე
\`\`\`

---

## 🛠️ Workflow

### Daily:
1. Plan features
2. Prompt AI
3. Review output
4. Test
5. Commit

### Weekly:
1. Review patterns
2. Update templates
3. Clean up code
4. Document learns

---

## 💡 Mindset

### Old:
"მე უნდა ვიცოდე syntax"

### New:
"მე უნდა ვიცოდე რას ვაშენებ და როგორ აღვწერო"

---

## 📊 Skills Focus

| Less Important | More Important |
|:---|:---|
| Syntax memorization | Problem description |
| Typing speed | Prompt clarity |
| Framework details | Architecture design |
| Language specifics | Universal patterns |

> 💎 **Premium**: Complete methodology guide!
`,

    'code-organization': `# კოდის ორგანიზება

**სწორი სტრუქტურა** ეხმარება AI-ს და ადამიანს.

---

## 📁 Project Structure

### Next.js App:
\`\`\`
src/
├── app/               # Routes
│   ├── (auth)/       # Auth routes group
│   ├── api/          # API routes
│   └── page.tsx      # Home
├── components/
│   ├── ui/           # Primitives
│   └── features/     # Business logic
├── lib/              # Utilities
├── hooks/            # Custom hooks
├── services/         # External APIs
├── types/            # TypeScript
└── styles/           # Global CSS
\`\`\`

---

## 🎯 Organization Rules

### 1. Feature-Based
\`\`\`
features/
├── auth/
│   ├── components/
│   ├── hooks/
│   └── services/
├── products/
└── cart/
\`\`\`

### 2. Co-location
\`\`\`
Component.tsx
Component.test.tsx
Component.styles.ts
Component.types.ts
\`\`\`

### 3. Barrel Exports
\`\`\`typescript
// components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';
\`\`\`

---

## 💡 File Naming

| Type | Pattern | Example |
|:---|:---|:---|
| Component | PascalCase | UserProfile.tsx |
| Hook | camelCase | useAuth.ts |
| Utility | camelCase | formatDate.ts |
| Type | PascalCase | User.types.ts |
| Constant | UPPER_CASE | API_URL.ts |

---

## 📝 AI Prompt

\`\`\`markdown
"Create folder structure for:
- E-commerce app
- Feature-based organization
- Scalable for team
Include README with guidelines"
\`\`\`

> 💎 **Premium**: Structure templates!
`,

    'code-review': `# კოდის განხილვა (Code Review)

**AI + Human review** = ხარისხიანი კოდი.

---

## 🔍 Review Workflow

\`\`\`markdown
1. AI generates code
2. You review for logic
3. AI checks for issues
4. Final human approval
5. Commit
\`\`\`

---

## 📝 Review Prompts

### Quality Check:
\`\`\`markdown
"Review this code for:
- Best practices
- Performance issues
- Security vulnerabilities
- Error handling
- Code style"
\`\`\`

### Specific Issue:
\`\`\`markdown
"Is this code vulnerable to 
SQL injection? Explain why or why not."
\`\`\`

### Refactoring:
\`\`\`markdown
"Refactor this code to:
- Reduce complexity
- Improve readability
- Follow DRY principle"
\`\`\`

---

## ✅ Review Checklist

### Functionality:
- [ ] ამოცანას წყვეტს?
- [ ] Edge cases handled?
- [ ] Errors handled?

### Quality:
- [ ] Readable?
- [ ] DRY?
- [ ] Tested?

### Security:
- [ ] Input validated?
- [ ] No secrets exposed?
- [ ] Auth checked?

---

## 🎯 AI Review vs Human

| AI Catches | Human Catches |
|:---|:---|
| Syntax issues | Business logic |
| Common patterns | Context issues |
| Security basics | UX problems |
| Type errors | Edge cases |

---

## 💡 Best Practice

\`\`\`markdown
"Let AI catch technical issues,
You focus on:
- Does it solve the problem?
- Is it maintainable?
- Will users understand it?"
\`\`\`

> 💎 **Premium**: Review checklist templates!
`,

    'environment-setup': `# გარემოს აწყობა

**სწორი setup** = ნაყოფიერი Vibe Coding.

---

## 💻 System Requirements

### Minimum:
- 8GB RAM
- Modern CPU
- 50GB free space
- Stable internet

### Recommended:
- 16GB+ RAM
- SSD storage
- Fast CPU
- Multiple monitors

---

## 🛠️ Software Setup

### Essential:
\`\`\`bash
# Node.js
nvm install 20
nvm use 20

# Package manager
npm install -g pnpm

# Git
git config --global user.name "Name"
git config --global user.email "email"
\`\`\`

### IDE:
1. Install Cursor
2. Sign in
3. Import VS Code settings

---

## ⚙️ Environment Variables

### .env.local:
\`\`\`
DATABASE_URL=
OPENAI_API_KEY=
NEXT_PUBLIC_APP_URL=
\`\`\`

### .env.example:
\`\`\`
DATABASE_URL=your_database_url
OPENAI_API_KEY=your_api_key
\`\`\`

---

## 📦 Project Template

\`\`\`bash
# Start new project
npx create-next-app@latest my-app
cd my-app

# Add essentials
npm install @prisma/client
npm install -D prisma
npx prisma init
\`\`\`

---

## ✅ Setup Checklist

- [ ] Node.js 20+
- [ ] Git configured
- [ ] Cursor installed
- [ ] AI accounts (OpenAI, etc.)
- [ ] Database ready
- [ ] Env vars set

> 💎 **Premium**: Full setup scripts!
`,

    'ide-config': `# IDE კონფიგურაცია

**ოპტიმალური Cursor settings** მაქსიმალური პროდუქტატიულობისთვის.

---

## ⚙️ Cursor Settings

### AI Features:
\`\`\`json
{
  "cursor.autocomplete": true,
  "cursor.chat.defaultModel": "claude-3.5-sonnet",
  "cursor.composer.enabled": true,
  "cursor.codebaseIndexing": true
}
\`\`\`

### Editor:
\`\`\`json
{
  "editor.fontSize": 14,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
\`\`\`

---

## 📦 Extensions

### Essential:
- Prettier
- ESLint
- GitLens
- Error Lens
- Auto Rename Tag

### Nice to Have:
- Thunder Client
- Import Cost
- Todo Tree
- GitHub Copilot (optional)

---

## 📝 .cursorrules

### Create in project root:
\`\`\`markdown
You are an expert in TypeScript and React.

Code Style:
- Use functional components
- Prefer hooks
- Follow SOLID principles
- Use Tailwind CSS

Always:
- Add proper types
- Handle errors
- Include loading states
- Write accessible code
\`\`\`

---

## ⌨️ Key Shortcuts

| Action | Mac | Windows |
|:---|:---|:---|
| Inline Edit | Cmd+K | Ctrl+K |
| Chat | Cmd+L | Ctrl+L |
| Composer | Cmd+I | Ctrl+I |
| File search | Cmd+P | Ctrl+P |
| Commands | Cmd+Shift+P | Ctrl+Shift+P |

---

## 💡 Pro Tips

1. **Codebase Indexing** — ჩართე deeper context-ისთვის
2. **@ Mentions** — ფაილების კონტექსტი
3. **Model switching** — სწორი model ამოცანისთვის
4. **Keyboard-first** — shortcuts ისწავლე

> 💎 **Premium**: Full config exports!
`,

    'vscode-extensions': `# 20 საუკეთესო VS Code Extension

**ეფექტური extensions** Vibe Coding-ისთვის.

---

## 🏆 Top 10 Essential

### 1. Prettier
- კოდის ფორმატირება
- Auto-format on save

### 2. ESLint
- ხარისხის კონტროლი
- Auto-fix

### 3. GitLens
- Git history
- Blame annotations

### 4. Error Lens
- Inline errors
- Quick visibility

### 5. Auto Rename Tag
- HTML/JSX tags
- Automatic sync

### 6. Tailwind IntelliSense
- Class suggestions
- Preview

### 7. TypeScript Hero
- Auto imports
- Organization

### 8. Thunder Client
- API testing
- Lightweight

### 9. Import Cost
- Package size
- Performance awareness

### 10. Todo Tree
- TODO tracking
- Project-wide

---

## 👍 Nice to Have (11-20)

| Extension | Purpose |
|:---|:---|
| Color Highlight | CSS colors |
| Bracket Colorizer | Code nesting |
| Path Intellisense | File paths |
| Better Comments | Comment highlighting |
| DotENV | .env syntax |
| Markdown Preview | Docs |
| Code Spell Checker | Typos |
| REST Client | API testing |
| Live Server | Local dev |
| Peacock | Workspace colors |

---

## 🎯 By Use Case

### React/Next.js:
- ES7+ Snippets
- Tailwind IntelliSense
- Prisma

### Backend:
- REST Client
- MongoDB extension
- Redis extension

---

## ⚠️ Performance

### Disable if slow:
- Too many extensions
- Heavy ones not used
- Old extensions

> 💎 **Premium**: Curated extension packs!
`,

    'advanced-prompt-patterns': `# Advanced Prompt Patterns - Master Level

**მაღალი დონის patterns** ხარისხიანი შედეგებისთვის.

---

## 🧠 Pattern 1: Self-Consistency

### Concept:
Generate multiple solutions, pick best.

\`\`\`markdown
"Generate 3 different approaches to:
[problem]

For each approach:
- Pros and cons
- Complexity
- Recommendation

Then suggest which is best and why."
\`\`\`

---

## 🔄 Pattern 2: Iterative Refinement

### Concept:
Progressive improvement.

\`\`\`markdown
Round 1: "Create basic version"
Round 2: "Add error handling"
Round 3: "Optimize performance"
Round 4: "Add documentation"
Round 5: "Final polish"
\`\`\`

---

## 🎭 Pattern 3: Perspective Stacking

### Concept:
Multiple expert views.

\`\`\`markdown
"Review this code as:
1. Security expert — vulnerabilities
2. Performance engineer — bottlenecks
3. UX designer — user experience
4. Junior developer — readability"
\`\`\`

---

## 📊 Pattern 4: Structured Output

### Concept:
Predictable format.

\`\`\`markdown
"Respond with JSON:
{
  'analysis': string,
  'issues': [{severity, description}],
  'recommendations': string[],
  'code': string
}"
\`\`\`

---

## 🔍 Pattern 5: Verification Loop

### Concept:
Self-checking.

\`\`\`markdown
"After generating the solution:
1. Verify it meets requirements
2. Check for edge cases
3. Test with example inputs
4. Confirm no security issues"
\`\`\`

---

## 💡 Pattern 6: Context Injection

### Concept:
Rich context provision.

\`\`\`markdown
"Context: 
[related code]
[documentation]
[constraints]

Given this context: [task]"
\`\`\`

> 💎 **Premium**: 50+ advanced patterns!
`,

    'ethics-copyright': `# ეთიკა და საავტორო უფლებები Vibe Coding-ში

**ეთიკური კითხვები** AI-assisted coding-ში.

---

## ⚖️ Key Questions

### 1. კოდის ownership
\`\`\`markdown
AI-გენერირებული კოდი:
- ვისას არის?
- შეгралენ გაყიდო?
- რა ლიცენზია?
\`\`\`

### 2. Training Data
\`\`\`markdown
AI სწავლობდა:
- Open source კოდზე
- Licensed კოდზე
- Is it fair use?
\`\`\`

---

## ✅ Best Practices

### Disclosure:
\`\`\`markdown
✅ აღნიშნე AI გამოყენება
✅ იყავი გამჭვირვალე
✅ დაასაბუთე გადაწყვეტილებები
\`\`\`

### Attribution:
\`\`\`markdown
✅ Credit open source
✅ Follow licenses
✅ Don't claim pure AI as original
\`\`\`

### Quality:
\`\`\`markdown
✅ Review all AI code
✅ Test thoroughly
✅ Don't ship unchecked
\`\`\`

---

## 🚫 Avoid

- არ გაყიდო სხვის კოდს
- არ გამოიყენო protected IP
- არ უგულებელყო licenses
- არ გატანო AI hallucinations

---

## 📋 Checklist

- [ ] AI disclosure appropriate?
- [ ] Licenses respected?
- [ ] Code reviewed?
- [ ] No protected content?
- [ ] Quality assured?

> 💎 **Premium**: Legal templates!
`,

    'performance-optimization': `# პერფორმანსის ოპტიმიზაცია AI-ით

**AI-ით პერფორმანსის** გაუმჯობესება ეფექტურია.

---

## 🎯 Optimization Areas

### Frontend:
- Bundle size
- Render performance
- Loading speed
- Memory usage

### Backend:
- Query optimization
- Caching
- Response time
- Throughput

---

## 📝 Optimization Prompts

### Performance Audit:
\`\`\`markdown
"Analyze this code for performance:
[code]

Check for:
- Unnecessary re-renders
- Memory leaks
- N+1 queries
- Large bundles
- Blocking operations"
\`\`\`

### Specific Fix:
\`\`\`markdown
"This component re-renders too often.
Optimize using:
- useMemo
- useCallback
- React.memo
Explain each change."
\`\`\`

---

## 🛠️ Common Fixes

### React:
\`\`\`typescript
// Before
const items = data.map(x => process(x));

// After (memoized)
const items = useMemo(
  () => data.map(x => process(x)),
  [data]
);
\`\`\`

### Database:
\`\`\`typescript
// Before: N+1 queries
users.forEach(u => getOrders(u.id));

// After: Single query
getUsersWithOrders();
\`\`\`

---

## 📊 Metrics

| Metric | Target |
|:---|:---|
| LCP | <2.5s |
| FID | <100ms |
| CLS | <0.1 |
| TTI | <3.8s |

---

## ✅ Checklist

- [ ] Bundle analyzed
- [ ] Images optimized
- [ ] Lazy loading
- [ ] Caching enabled
- [ ] Queries optimized

> 💎 **Premium**: Performance optimization guide!
`,

    'andrej-karpathy-insights': `# Andrej Karpathy: Software-ის მომავალი

**Andrej Karpathy** — Tesla AI და OpenAI-ს ყოფილი ლიდერი, Vibe Coding-ის მთავარი ხმა.

---

## 💭 Key Insights

### "Software 3.0"
\`\`\`markdown
1.0: ხელით დაწერილი კოდი
2.0: მონაცემებით სწავლება (ML)
3.0: Natural language → code
\`\`\`

### "Vibe Coding"
\`\`\`markdown
"The English language is becoming
the programming language"
\`\`\`

---

## 🎯 Predictions

### Short-term (2025):
- AI assistants everywhere
- Non-coders building apps
- Productivity 10x

### Medium-term (2027):
- AI agents autonomous
- Less manual coding
- New skill requirements

### Long-term:
- Programming democratized
- Traditional coding niche
- AI-human collaboration standard

---

## 📝 Quotes

> "The hottest new programming language is English"

> "We're entering an age where describing what you want will be more important than knowing how to implement it"

> "The role of programmer shifts from implementer to director"

---

## 💡 Takeaways

### For Developers:
1. Learn prompting
2. Focus on architecture
3. Embrace AI tools
4. Stay adaptable

### For Non-Coders:
1. You can build now
2. Start with AI tools
3. Learn to describe clearly
4. Iterate quickly

---

## 🎓 Resources

- YouTube: Andrej Karpathy
- X/Twitter: @karpathy
- Stanford lectures
- OpenAI blog posts

> 💎 **Premium**: Full interview analysis!
`,

    'glue-coding': `# Glue Coding (წებოვანი პროგრამირება)

**Glue Coding** — კომპონენტების ერთად "შეწებება" AI-ით.

---

## 🧩 რა არის Glue Coding?

### განმარტება:
\`\`\`markdown
არსებული კომპონენტების, APIs, და ბიბლიოთეკების
"შეწებება" AI-ს დახმარებით.
\`\`\`

### მაგალითი:
\`\`\`markdown
Stripe (payments) + 
SendGrid (email) + 
Supabase (database) + 
Vercel (hosting) = 
Working SaaS
\`\`\`

---

## 💡 Philosophy

### ნაცვლად:
"ხელახლა გამოიგონე ბორბალი"

### გააკეთე:
"შეაერთე არსებული ბორბლები"

---

## 🛠️ Common Glue Points

### APIs:
| Category | Options |
|:---|:---|
| Payments | Stripe, Paddle |
| Auth | NextAuth, Clerk |
| Email | SendGrid, Resend |
| Database | Supabase, PlanetScale |
| Storage | Cloudflare R2, S3 |

### Integration Prompt:
\`\`\`markdown
"Integrate Stripe checkout:
- Create checkout session
- Handle webhook
- Update user subscription
- Send confirmation email"
\`\`\`

---

## 📊 Benefits

| Build from Scratch | Glue Coding |
|:---|:---|
| Weeks | Days |
| Error-prone | Battle-tested |
| Maintenance | Managed |
| Expensive | Often free tier |

---

## 🎯 Best Practices

1. **Choose quality components**
2. **Understand integration points**
3. **Handle edge cases**
4. **Test connections**
5. **Document dependencies**

---

## 📝 Prompt Pattern

\`\`\`markdown
"Connect [Service A] with [Service B]:
1. When [trigger] happens
2. Do [action] in A
3. Then do [action] in B
4. Handle errors gracefully"
\`\`\`

> 💎 **Premium**: Integration templates!
`,

    'canvas-whiteboard': `# Canvas დაფა Vibe Coding-ისთვის

**Visual whiteboard** AI-სთან collaboration-ისთვის.

---

## 🎨 რა არის Canvas?

### გამოყენება:
- Architecture diagrams
- Flowcharts
- Component trees
- Data flows
- UI wireframes

---

## 🛠️ Tools

| Tool | Best For | Free |
|:---|:---|:---|
| Excalidraw | Diagrams | ✅ |
| Miro | Collaboration | ✅ Limited |
| FigJam | Design | ✅ Limited |
| tldraw | Quick sketches | ✅ |

---

## 💡 With AI

### Workflow:
\`\`\`markdown
1. Sketch architecture
2. Screenshot to AI
3. "Build this structure"
4. Iterate
\`\`\`

### Prompt:
\`\`\`markdown
"Based on this diagram [image],
create the folder structure and
initial components for this architecture"
\`\`\`

---

## 🎯 Use Cases

### 1. Planning:
- სანამ კოდს დაწერ
- Architecture visualization
- Team alignment

### 2. Debugging:
- Data flow visualization
- State management
- Component hierarchy

### 3. Documentation:
- System overview
- API diagrams
- Deployment architecture

---

## 📝 Best Practices

1. **Keep diagrams simple**
2. **Label clearly**
3. **Version diagrams**
4. **Share with team**

> 💎 **Premium**: Diagram templates!
`,

    'canvas-advanced': `# Canvas Whiteboard Development

**Canvas-based app** development AI-ით.

---

## 🎨 Canvas Technologies

### Browser APIs:
- Canvas 2D Context
- WebGL (3D)
- OffscreenCanvas

### Libraries:
| Library | Use Case |
|:---|:---|
| Fabric.js | Interactive |
| Konva.js | 2D scenes |
| Three.js | 3D |
| PixiJS | Games |

---

## 💡 AI Prompts

### Drawing App:
\`\`\`markdown
"Create a drawing canvas with:
- Brush tool
- Eraser
- Color picker
- Undo/redo
- Save as image"
\`\`\`

### Whiteboard:
\`\`\`markdown
"Build collaborative whiteboard:
- Shapes (rect, circle, line)
- Text tool
- Select & move
- Zoom & pan
- Export"
\`\`\`

---

## 🛠️ Basic Setup

\`\`\`typescript
// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Drawing
ctx.beginPath();
ctx.moveTo(x1, y1);
ctx.lineTo(x2, y2);
ctx.stroke();
\`\`\`

---

## 🎯 Challenges

| Challenge | Solution |
|:---|:---|
| Performance | requestAnimationFrame |
| Zoom/Pan | Transform matrix |
| History | State snapshots |
| Collaboration | WebSocket |

---

## 📊 Example Apps

- Drawing apps
- Diagram tools
- Image editors
- Games
- Data visualization

> 💎 **Premium**: Canvas app templates!
`,

    'ssh-mobile': `# SSH წვდომა მობილურიდან (FRP)

**Remote development** მობილურიდან FRP-ით.

---

## 🔧 რა არის FRP?

### Fast Reverse Proxy:
\`\`\`markdown
ლოკალური სერვერის გამოყენება
ინტერნეტიდან, NAT-ის გვერდით.
\`\`\`

### Use Case:
\`\`\`markdown
📱 Mobile → 🌐 FRP Server → 💻 Your PC
\`\`\`

---

## 🛠️ Setup

### Server Side (VPS):
\`\`\`bash
# Download frps
wget https://github.com/fatedier/frp/releases/...
# Configure frps.ini
# Run frps
\`\`\`

### Client Side (Your PC):
\`\`\`bash
# Download frpc
# Configure frpc.ini
[ssh]
type = tcp
local_port = 22
remote_port = 6000
\`\`\`

---

## 📱 Mobile Access

### Apps:
| Platform | App |
|:---|:---|
| iOS | Termius, Blink |
| Android | JuiceSSH, Termux |

### Connect:
\`\`\`
ssh user@your-vps-ip -p 6000
\`\`\`

---

## 🎯 Use Cases

1. **Emergency fixes** — სასწრაფო changes
2. **Monitoring** — server check
3. **Quick edits** — configuration
4. **Learning** — anywhere practice

---

## ⚠️ Security

- [ ] Use SSH keys
- [ ] Strong passwords
- [ ] Fail2ban on server
- [ ] Limit access

> 💎 **Premium**: Full FRP setup guide!
`,

    'architecture-template': `# პროექტის არქიტექტურის შაბლონი

**სტანდარტული templates** სხვადასხვა პროექტისთვის.

---

## 🛒 E-commerce

\`\`\`
src/
├── app/
│   ├── (shop)/
│   │   ├── products/
│   │   ├── cart/
│   │   └── checkout/
│   ├── (account)/
│   │   ├── orders/
│   │   └── profile/
│   └── api/
│       ├── products/
│       ├── orders/
│       └── payments/
├── components/
│   ├── product/
│   ├── cart/
│   └── checkout/
├── lib/
│   ├── stripe.ts
│   └── db.ts
└── types/
\`\`\`

---

## 📊 SaaS Dashboard

\`\`\`
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   │   ├── overview/
│   │   ├── analytics/
│   │   └── settings/
│   └── api/
├── components/
│   ├── charts/
│   ├── tables/
│   └── layout/
├── hooks/
├── services/
└── types/
\`\`\`

---

## 📱 Mobile App (Expo)

\`\`\`
src/
├── app/
│   ├── (tabs)/
│   ├── (auth)/
│   └── _layout.tsx
├── components/
├── hooks/
├── services/
├── stores/
└── types/
\`\`\`

---

## 🔌 API Backend

\`\`\`
src/
├── routes/
├── controllers/
├── services/
├── models/
├── middlewares/
├── utils/
└── types/
\`\`\`

---

## 💡 Selection Guide

| Project Type | Template |
|:---|:---|
| Store | E-commerce |
| Admin panel | Dashboard |
| Consumer app | Mobile |
| Microservice | API Backend |

> 💎 **Premium**: 10+ detailed templates!
`,

    'network-config': `# ქსელის კონფიგურაცია

**Development network** სწორად კონფიგურირებისთვის.

---

## 🌐 Local Development

### Ports:
| Service | Default Port |
|:---|:---|
| Next.js | 3000 |
| API | 3001 |
| Database | 5432 (PG), 27017 (Mongo) |
| Redis | 6379 |

### CORS Setup:
\`\`\`typescript
// Next.js API
export async function GET(request: Request) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}
\`\`\`

---

## 🔒 HTTPS Local

### mkcert:
\`\`\`bash
# Install
brew install mkcert
mkcert -install

# Generate
mkcert localhost
\`\`\`

---

## 🌍 Environment URLs

\`\`\`env
# Development
NEXT_PUBLIC_API_URL=http://localhost:3001

# Staging  
NEXT_PUBLIC_API_URL=https://staging-api.example.com

# Production
NEXT_PUBLIC_API_URL=https://api.example.com
\`\`\`

---

## 📦 Docker Networking

\`\`\`yaml
version: '3'
services:
  app:
    networks:
      - webnet
  db:
    networks:
      - webnet
networks:
  webnet:
\`\`\`

---

## ✅ Checklist

- [ ] Ports not conflicting
- [ ] CORS configured
- [ ] Env vars per environment
- [ ] SSL for production

> 💎 **Premium**: Network setup scripts!
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
