// Premium Content Update Script - Part 5
// Vibe Coding section - more articles

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
    'tools-overview': `# Vibe Coding ინსტრუმენტები - სრული მიმოხილვა

**Vibe Coding-ის წარმატება** დამოკიდებულია სწორი ინსტრუმენტების არჩევაზე. ეს გაიდი დაგეხმარებათ.

---

## 🏆 Top Vibe Coding Tools 2025

### IDE/Editors:
| Tool | AI Level | ფასი | საუკეთესო |
|:---|:---|:---|:---|
| **Cursor** | ⭐⭐⭐⭐⭐ | $20/თვე | Full AI integration |
| **VS Code + Copilot** | ⭐⭐⭐⭐ | $10/თვე | Familiar environment |
| **Windsurf** | ⭐⭐⭐⭐ | $15/თვე | Lightweight |
| **Zed** | ⭐⭐⭐ | უფასო | Speed |

### AI Assistants:
| Tool | Strength | ფასი |
|:---|:---|:---|
| **ChatGPT** | All-round | $20/თვე |
| **Claude** | Long context, Coding | $20/თვე |
| **Gemini** | Research, Multimodal | $20/თვე |
| **Perplexity** | Research | $20/თვე |

### Prototyping:
| Tool | Speed | Best For |
|:---|:---|:---|
| **Bolt.new** | ⚡⚡⚡⚡⚡ | Quick web apps |
| **v0.dev** | ⚡⚡⚡⚡ | UI components |
| **Replit** | ⚡⚡⚡⚡ | Full projects |
| **Lovable** | ⚡⚡⚡⚡ | MVPs |

---

## 💡 Tool Selection Guide

### დამწყებისთვის:
\`\`\`markdown
1. Cursor (Free tier)
2. ChatGPT (Free)
3. Bolt.new (Quick tests)
\`\`\`

### ინტერმედიატე:
\`\`\`markdown
1. Cursor Pro ($20)
2. Claude Pro ($20)
3. GitHub Copilot ($10)
\`\`\`

### პროფესიონალი:
\`\`\`markdown
1. Cursor Pro
2. Claude + ChatGPT
3. Multiple specialized tools
4. API access
\`\`\`

---

## 🛠️ Tool Combinations

### Web Development:
\`\`\`markdown
Cursor (IDE) + Claude (complex logic) 
+ v0.dev (UI) + Vercel (deploy)
\`\`\`

### Mobile:
\`\`\`markdown
Cursor + Claude + Expo (React Native)
\`\`\`

### Backend:
\`\`\`markdown
Cursor + ChatGPT (API design) 
+ Railway (deploy)
\`\`\`

---

## 📊 Feature Comparison

| Feature | Cursor | Copilot | Claude |
|:---|:---|:---|:---|
| Autocomplete | ✅ | ✅ | ❌ |
| Chat | ✅ | ✅ | ✅ |
| Multi-file | ✅ | ❌ | ✅ |
| Codebase aware | ✅ | ❌ | ✅ |
| Composer/Agent | ✅ | ❌ | ❌ |

---

## 🚀 Setup Recommendation

### Starter Kit ($0):
- Cursor Free
- ChatGPT Free
- Bolt.new Free

### Pro Kit ($50-60/თვე):
- Cursor Pro
- Claude Pro
- v0.dev Pro

> 💎 **Premium**: Full setup guides + workflow templates!
`,

    'common-mistakes': `# 20 ყველაზე გავრცელებული შეცდომა Vibe Coding-ში

**ამ შეცდომების თავიდან აცილება** დაგაჩქარებთ და ხარისხს გააუმჯობესებს.

---

## 🚫 Prompting Mistakes

### 1. ბუნდოვანი Prompts
\`\`\`markdown
❌ "Make it better"
✅ "Improve the loading performance by 
    implementing lazy loading for images"
\`\`\`

### 2. კონტექსტის უგულებელყოფა
\`\`\`markdown
❌ "Fix this bug"
✅ "This function should return user data 
    but returns undefined when user.status is 'pending'"
\`\`\`

### 3. ყველაფერი ერთ Prompt-ში
\`\`\`markdown
❌ "Create full e-commerce with auth, payments, cart"
✅ Step-by-step approach
\`\`\`

### 4. Examples-ის უგულებელყოფა
\`\`\`markdown
❌ "Format the output"
✅ "Format like: {name: string, email: string}"
\`\`\`

---

## 🚫 Code Review Mistakes

### 5. სრულად AI-ს ენდობი
\`\`\`markdown
❌ Copy-paste without reading
✅ Understand what code does
\`\`\`

### 6. Security-ის იგნორირება
\`\`\`markdown
❌ AI-generated code with hardcoded secrets
✅ Always check for security issues
\`\`\`

### 7. Edge Cases-ის იგნორირება
\`\`\`markdown
❌ Works for happy path
✅ Test edge cases (null, empty, errors)
\`\`\`

---

## 🚫 Architecture Mistakes

### 8. არქიტექტურის გარეშე დაწყება
\`\`\`markdown
❌ "Just start coding"
✅ Plan structure first
\`\`\`

### 9. ფაილების ორგანიზაცია
\`\`\`markdown
❌ Everything in one file
✅ Proper folder structure
\`\`\`

### 10. Over-engineering
\`\`\`markdown
❌ Complex patterns for simple app
✅ Match complexity to needs
\`\`\`

---

## 🚫 Workflow Mistakes

### 11. Version Control-ის უგულებელყოფა
\`\`\`markdown
❌ No git commits
✅ Commit frequently
\`\`\`

### 12. Testing-ის იგნორირება
\`\`\`markdown
❌ "It works on my machine"
✅ Write tests with AI
\`\`\`

### 13. Documentation-ის გამოტოვება
\`\`\`markdown
❌ No comments, no README
✅ AI can document for you
\`\`\`

---

## 🚫 Learning Mistakes

### 14. კოდის არგაგება
\`\`\`markdown
❌ Magic code that "just works"
✅ Ask AI to explain
\`\`\`

### 15. ერთი Tool-ზე დამოკიდებულება
\`\`\`markdown
❌ Only ChatGPT
✅ Right tool for right job
\`\`\`

### 16. Prompt-ების არშენახვა
\`\`\`markdown
❌ Forget good prompts
✅ Build prompt library
\`\`\`

---

## 🚫 Production Mistakes

### 17. Testing Production-ში
\`\`\`markdown
❌ Deploy and pray
✅ Staging environment
\`\`\`

### 18. Error Handling-ის უგულებელყოფა
\`\`\`markdown
❌ No try-catch
✅ Proper error handling
\`\`\`

### 19. Environment Variables
\`\`\`markdown
❌ Hardcoded API keys
✅ .env files
\`\`\`

### 20. Performance-ის იგნორირება
\`\`\`markdown
❌ Slow queries, no optimization
✅ Review performance
\`\`\`

---

## ✅ Best Practices Summary

1. Be specific in prompts
2. Always review AI code
3. Plan before coding
4. Test thoroughly
5. Document everything

> 💎 **Premium**: Mistake prevention checklist + templates!
`,

    'cheat-sheet': `# Vibe Coding Cheat Sheet - ყველაფერი ერთ გვერდზე

**Print this!** Vibe Coding-ის ყველაზე მნიშვნელოვანი ინფორმაცია.

---

## ⌨️ Cursor Shortcuts

| Shortcut | Action |
|:---|:---|
| **Cmd+K** | Inline edit |
| **Cmd+L** | Chat |
| **Cmd+I** | Composer |
| **Cmd+Shift+L** | Add to chat |
| **Tab** | Accept suggestion |
| **Escape** | Dismiss |

---

## 📝 Prompt Formula

\`\`\`markdown
[CONTEXT] + [TASK] + [FORMAT] + [CONSTRAINTS]
\`\`\`

### მაგალითი:
\`\`\`markdown
"I'm building a Next.js app (CONTEXT).
Create a login form component (TASK)
with email and password fields (FORMAT).
Use Tailwind CSS, include validation (CONSTRAINTS)."
\`\`\`

---

## 🎯 @ Mentions (Cursor)

| Command | Purpose |
|:---|:---|
| @file | Specific file |
| @folder | Directory |
| @codebase | Whole project |
| @web | Web search |
| @docs | Documentation |

---

## 💬 Chat Prefixes

| Prefix | Use |
|:---|:---|
| "Explain..." | Learn code |
| "Fix..." | Debug |
| "Refactor..." | Improve |
| "Add..." | New feature |
| "Test..." | Generate tests |

---

## 🛠️ Quick Commands

### Project Setup:
\`\`\`bash
npx create-next-app@latest my-app
npx create-vite my-app
npx create-expo-app my-app
\`\`\`

### Common Asks:
\`\`\`markdown
"Add TypeScript types"
"Add error handling"
"Make it responsive"
"Add loading state"
"Optimize performance"
\`\`\`

---

## 📊 Model Selection

| Task | Best Model |
|:---|:---|
| Quick code | GPT-4-mini |
| Complex logic | Claude 3.5 |
| Long files | Claude (200K) |
| Research | Perplexity |
| Images | DALL-E/Midjourney |

---

## ✅ Pre-Deploy Checklist

- [ ] Error handling
- [ ] Loading states
- [ ] Mobile responsive
- [ ] Environment variables
- [ ] Security review
- [ ] Performance check
- [ ] Tests passing

---

## 🚀 Workflow

\`\`\`
1. Plan → Prompt for structure
2. Build → Iterate with AI
3. Test → AI writes tests
4. Deploy → Vercel/Railway
5. Monitor → Add logging
\`\`\`

> 💎 Print-ready PDF version available in Premium!
`,

    'debugging-with-ai': `# Debugging with AI - სრული გზამკვლევი

**AI-ით debugging** 10x სწრაფია. ეს გაიდი გაჩვენებთ პროფესიონალურ მიდგომას.

---

## 🐛 Debugging Workflow

\`\`\`markdown
1. Reproduce the bug
2. Gather information
3. Ask AI with context
4. Apply fix
5. Verify solution
\`\`\`

---

## 📝 Error Reporting Template

\`\`\`markdown
**Problem:**
[What happens]

**Expected:**
[What should happen]

**Error Message:**
\\\`\\\`\\\`
[Full error]
\\\`\\\`\\\`

**Code:**
\\\`\\\`\\\`typescript
[Relevant code]
\\\`\\\`\\\`

**Context:**
- Node.js v20
- Next.js 14
- Steps to reproduce
\`\`\`

---

## 💡 Common Debug Prompts

### Type Error:
\`\`\`markdown
"I'm getting this TypeScript error:
[error]

In this code:
[code]

How do I fix the type mismatch?"
\`\`\`

### Runtime Error:
\`\`\`markdown
"My function throws [error] when:
- Input: [value]
- Expected: [result]
- Actual: [result]

Here's the code: [code]"
\`\`\`

### Logic Bug:
\`\`\`markdown
"This code should [expected behavior]
but instead it [actual behavior].

Walk through the logic step by step
and find where it goes wrong:
[code]"
\`\`\`

---

## 🔍 Debug Strategies

### 1. Chain of Thought:
\`\`\`markdown
"Walk through this code step by step,
explaining what happens at each line
when input is [value]"
\`\`\`

### 2. Rubber Duck with AI:
\`\`\`markdown
"I'll explain what my code does,
please ask clarifying questions
if something seems wrong"
\`\`\`

### 3. Compare & Contrast:
\`\`\`markdown
"Here's working code: [code1]
Here's broken code: [code2]
What's the difference that causes the bug?"
\`\`\`

---

## 🛠️ Cursor Debug Features

### @codebase for Context:
\`\`\`markdown
"@codebase why is the user object 
undefined in this component?"
\`\`\`

### Multi-file Debugging:
\`\`\`markdown
"The bug might be in how @file1 
calls @file2. Find the issue."
\`\`\`

---

## 📊 Error Categories

| Error Type | First Ask |
|:---|:---|
| Syntax | "Find syntax error in..." |
| Type | "Explain type mismatch..." |
| Runtime | "Why does this throw..." |
| Logic | "Expected X got Y because..." |
| Async | "Why is this undefined..." |

---

## ✅ Post-Debug Checklist

- [ ] Fix verified
- [ ] No new bugs introduced
- [ ] Similar issues checked
- [ ] Test added
- [ ] Root cause understood

> 💎 **Premium**: Advanced debug templates + video tutorials!
`,

    'prompt-templates': `# 50 გამზადებული Prompt შაბლონი

**Copy-paste ready!** საუკეთესო prompt-ები Vibe Coding-ისთვის.

---

## 🏗️ Project Setup (10)

### 1. New Project
\`\`\`markdown
Create a [framework] project with:
- TypeScript
- ESLint + Prettier
- [CSS framework]
- Basic folder structure
Include package.json and README.
\`\`\`

### 2. Folder Structure
\`\`\`markdown
Design folder structure for [app type]:
- Components
- Pages
- API routes
- Utils
- Types
Explain the reasoning.
\`\`\`

### 3. Environment Setup
\`\`\`markdown
Create .env.example with all necessary
environment variables for [service integrations].
Add comments explaining each variable.
\`\`\`

---

## 🎨 UI Components (10)

### 4. Form Component
\`\`\`markdown
Create a [form type] form with:
- [Fields]
- Validation (Zod/Yup)
- Error messages
- Loading state
- Success feedback
\`\`\`

### 5. Data Table
\`\`\`markdown
Create a data table component with:
- Sorting
- Pagination
- Search/filter
- Selection
- Responsive design
\`\`\`

### 6. Modal/Dialog
\`\`\`markdown
Create a reusable modal component with:
- Open/close animation
- Backdrop click close
- Keyboard navigation
- Focus trap
\`\`\`

---

## 🔌 API/Backend (10)

### 7. API Route
\`\`\`markdown
Create an API route for [resource]:
- GET (list with pagination)
- POST (create with validation)
- Include error handling
- Return proper status codes
\`\`\`

### 8. Database Query
\`\`\`markdown
Write a [database] query to:
[Describe requirement]
Include indexes if needed.
Optimize for performance.
\`\`\`

### 9. Authentication
\`\`\`markdown
Implement [auth method] authentication:
- Login/logout
- Session/token management
- Protected routes
- Include types
\`\`\`

---

## 🐛 Debugging (10)

### 10. Error Fix
\`\`\`markdown
Fix this error:
[Error message]

In this code:
[Code]

Explain what caused it.
\`\`\`

### 11. Performance Issue
\`\`\`markdown
This code is slow:
[Code]

Identify bottlenecks and optimize.
Explain improvements.
\`\`\`

---

## ✨ Improvements (10)

### 12. Code Review
\`\`\`markdown
Review this code for:
- Best practices
- Security issues
- Performance
- Readability
[Code]
\`\`\`

### 13. Refactoring
\`\`\`markdown
Refactor this code to:
- Reduce complexity
- Improve readability
- Follow [pattern]
[Code]
\`\`\`

### 14. Add Types
\`\`\`markdown
Add TypeScript types to this JavaScript:
[Code]
Use strict types, avoid 'any'.
\`\`\`

### 15. Add Tests
\`\`\`markdown
Write tests for this function:
[Code]
Cover: happy path, edge cases, errors.
Use [testing framework].
\`\`\`

---

## 📝 Documentation (10)

### 16. README
\`\`\`markdown
Generate README for this project:
[Project description]
Include: setup, usage, API docs.
\`\`\`

### 17. JSDoc
\`\`\`markdown
Add JSDoc comments to:
[Code]
Include params, returns, examples.
\`\`\`

### 18. API Documentation
\`\`\`markdown
Document this API endpoint:
[Route]
Include: request, response, errors.
\`\`\`

---

> 💎 **Premium**: Полная коллекция 100+ промптов!
`,

    'webapp-1hour': `# ვებ-აპლიკაცია 1 საათში - სრული გზამკვლევი

**1 საათში** შეგიძლია fully-functional web app-ის გაშვება. აი როგორ.

---

## 🎯 რას გავაკეთებთ?

**AI Quote Generator:**
- Random quotes display
- Save favorites
- Share functionality
- Beautiful UI

---

## ⏱️ Time Breakdown

| Task | Time |
|:---|:---|
| Setup | 5 min |
| UI | 20 min |
| Logic | 15 min |
| Polish | 10 min |
| Deploy | 10 min |
| **Total** | 60 min |

---

## 🚀 Minute 0-5: Setup

### Prompt:
\`\`\`markdown
Create a new Vite + React + TypeScript project
with Tailwind CSS. Initialize with:
- Basic App component
- Tailwind configured
- index.html updated
\`\`\`

### Commands:
\`\`\`bash
npm create vite@latest quote-app -- --template react-ts
cd quote-app
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

---

## 🎨 Minute 5-25: UI

### Prompt:
\`\`\`markdown
Create a beautiful quote display app with:
- Centered card with quote text
- Author name below
- "New Quote" button
- Heart icon to save favorites
- Share button
- Dark gradient background
- Smooth animations
\`\`\`

---

## ⚙️ Minute 25-40: Logic

### Prompt:
\`\`\`markdown
Add functionality:
- Array of 20 inspiring quotes
- Random quote on button click
- Save to favorites (localStorage)
- View favorites modal
- Share to Twitter button
\`\`\`

---

## ✨ Minute 40-50: Polish

### Prompt:
\`\`\`markdown
Add polish:
- Loading animation
- Quote fade-in effect
- Responsive design
- Keyboard shortcuts (N for new, F for fav)
- Toast notifications
\`\`\`

---

## 🌐 Minute 50-60: Deploy

### Vercel (ყველაზე მარტივი):
\`\`\`bash
npm i -g vercel
vercel
\`\`\`

### ან Netlify:
\`\`\`bash
npm run build
# drag dist folder to netlify
\`\`\`

---

## 📊 Final Result

\`\`\`markdown
✅ Beautiful, responsive UI
✅ Random quotes
✅ Favorites system
✅ Share functionality
✅ Deployed live
\`\`\`

---

## 🎓 What You Learned

1. **Rapid prototyping** with AI
2. **Component design** patterns
3. **State management** basics
4. **localStorage** usage
5. **Deployment** workflow

---

## 🚀 Next Steps

- Add quote API instead of static
- User accounts
- Comment system
- More sharing options

> 💎 **Premium**: Source code + 10 more 1-hour projects!
`,

    'telegram-bot': `# Telegram ბოტის შექმნა AI-ით

**Telegram bot** შესანიშნავი პროექტია Vibe Coding-ის სწავლისთვის. მარტივი, პრაქტიკული, და სასარგებლო.

---

## 🎯 რას გავაკეთებთ?

**AI Assistant Bot:**
- ChatGPT integration
- Command handling
- Conversation history
- Error handling

---

## 🛠️ Setup

### 1. Bot Token (BotFather):
1. Open @BotFather in Telegram
2. /newbot
3. Name your bot
4. Copy token

### 2. Project Setup:
\`\`\`markdown
Prompt: "Create a Node.js Telegram bot with:
- node-telegram-bot-api
- OpenAI SDK
- dotenv for env vars
- TypeScript
- Basic folder structure"
\`\`\`

---

## 📝 Core Code

### Bot Setup:
\`\`\`typescript
import TelegramBot from 'node-telegram-bot-api';
import OpenAI from 'openai';

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN!, { polling: true });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  // Process with AI
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: text }],
  });
  
  bot.sendMessage(chatId, response.choices[0].message.content);
});
\`\`\`

---

## 💡 Features to Add

### Prompt for Commands:
\`\`\`markdown
"Add these commands:
/start - Welcome message
/help - List commands
/clear - Clear history
/mode [mode] - Change AI mode (creative/precise)"
\`\`\`

### Prompt for History:
\`\`\`markdown
"Add conversation history:
- Store last 10 messages per user
- Include in OpenAI context
- /clear command to reset"
\`\`\`

### Prompt for Rate Limiting:
\`\`\`markdown
"Add rate limiting:
- Max 10 messages per minute
- Friendly message when exceeded
- Reset timer"
\`\`\`

---

## 🌐 Deployment

### Railway:
\`\`\`bash
railway login
railway init
railway up
\`\`\`

### Or Docker:
\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
\`\`\`

---

## 📊 Architecture

\`\`\`markdown
User Message
    ↓
Telegram Bot API
    ↓
Message Handler
    ↓
OpenAI API
    ↓
Response
    ↓
Back to User
\`\`\`

---

## ✅ Checklist

- [ ] Bot token secured
- [ ] OpenAI key secured
- [ ] Error handling
- [ ] Rate limiting
- [ ] Logging
- [ ] Deployed

> 💎 **Premium**: Full source code + advanced features!
`,

    'chrome-extension': `# Chrome Extension-ის შექმნა AI-ით

**Browser extensions** ძლიერი და პრაქტიკული პროექტებია. AI-ით მათი შექმნა სწრაფია.

---

## 🎯 რას გავაკეთებთ?

**AI Page Summarizer:**
- Select text → Summarize
- Page URL → Summary
- Copy result
- Clean UI

---

## 📁 Project Structure

\`\`\`markdown
Prompt: "Create Chrome extension structure:
- manifest.json (v3)
- popup.html/js
- content.js
- background.js
- styles.css
Include all necessary permissions"
\`\`\`

---

## 📝 Key Files

### manifest.json:
\`\`\`json
{
  "manifest_version": 3,
  "name": "AI Summarizer",
  "version": "1.0",
  "permissions": ["activeTab", "storage"],
  "action": {
    "default_popup": "popup.html"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }]
}
\`\`\`

### popup.html:
\`\`\`markdown
Prompt: "Create popup UI with:
- Title 'AI Summarizer'
- 'Summarize Page' button
- Result display area
- Copy button
- Loading indicator
- Error display"
\`\`\`

---

## 💡 Core Logic

### Prompt:
\`\`\`markdown
"Create content script that:
1. Gets selected text or page content
2. Sends to OpenAI API
3. Returns summary
4. Handles errors gracefully"
\`\`\`

### API Integration:
\`\`\`typescript
async function summarize(text: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${apiKey}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: \`Summarize this in 3 sentences: \${text}\`
      }],
    }),
  });
  return response.json();
}
\`\`\`

---

## 🛠️ Development

### Load Extension:
1. chrome://extensions
2. Developer mode ON
3. Load unpacked
4. Select folder

### Debug:
- Right-click extension → Inspect popup
- Console for errors

---

## ✨ Enhancements

### Prompt:
\`\`\`markdown
"Add features:
- Save API key securely
- Multiple summary lengths
- Language selection
- History of summaries
- Keyboard shortcut"
\`\`\`

---

## 📦 Publishing

### Chrome Web Store:
1. Create developer account ($5)
2. Prepare screenshots
3. Write description
4. Zip and upload
5. Wait for review

---

## ✅ Checklist

- [ ] Manifest v3 correct
- [ ] Permissions minimal
- [ ] Error handling
- [ ] API key secure
- [ ] Nice UI
- [ ] Tested

> 💎 **Premium**: Full source + publishing guide!
`,

    'cursor-vs-copilot': `# Cursor vs GitHub Copilot - დეტალური შედარება

**რომელი ჯობია?** დამოკიდებულია use case-ზე. აი სრული შედარება.

---

## 📊 Overview

| Feature | Cursor | GitHub Copilot |
|:---|:---|:---|
| Base | VS Code fork | VS Code extension |
| ფასი | $20/თვე | $10/თვე |
| AI Chat | ✅ Built-in | ✅ Copilot Chat |
| Codebase aware | ✅ Deep | ⚠️ Limited |
| Multi-file edit | ✅ Composer | ❌ |

---

## 💪 Cursor Advantages

### 1. Codebase Understanding
\`\`\`markdown
@codebase "why does auth fail?"
→ Searches entire project
→ Finds related issues
→ Suggests solution
\`\`\`

### 2. Composer (Agent Mode)
\`\`\`markdown
"Refactor auth to use NextAuth"
→ Updates multiple files
→ Creates new files
→ Updates imports
\`\`\`

### 3. Inline Editing (Cmd+K)
- Select code
- Describe change
- Apply diff

### 4. Model Choice
- GPT-4
- Claude 3.5
- GPT-4-mini

---

## 💪 Copilot Advantages

### 1. ფასი
- $10 vs $20
- Better for beginners

### 2. Ecosystem
- GitHub integration
- Copilot Chat
- Copilot Workspace (soon)

### 3. Stability
- More mature
- Larger user base
- Better documentation

### 4. Autocomplete
- Very fast
- High accuracy
- Less intrusive

---

## 🎯 When to Choose

### აირჩიე Cursor თუ:
\`\`\`markdown
✅ Full-time developer
✅ Complex refactoring
✅ Need multi-file edits
✅ Want agent capabilities
✅ Budget not primary concern
\`\`\`

### აირჩიე Copilot თუ:
\`\`\`markdown
✅ Budget-conscious
✅ Mainly autocomplete
✅ Existing GitHub workflow
✅ Team standardization
✅ VS Code extensions important
\`\`\`

---

## 💰 Cost Analysis

### Cursor:
\`\`\`
$20/თვე × 12 = $240/წელი
+ Potential productivity: 50%+
ROI: High for active devs
\`\`\`

### Copilot:
\`\`\`
$10/თვე × 12 = $120/წელი
+ Good autocomplete
ROI: Good for all developers
\`\`\`

---

## 🤝 Using Both?

Some developers use:
- **Copilot** for autocomplete
- **Claude/ChatGPT** for complex tasks
- **Cost:** $30/თვე but flexible

---

## 🏆 Verdict

| Use Case | Winner |
|:---|:---|
| Autocomplete | Copilot |
| Complex edits | Cursor |
| Budget | Copilot |
| Power users | Cursor |
| Teams | Tie |

> 💎 **Premium**: Migration guide + setup optimization!
`,

    'perfect-prompt': `# იდეალური Prompt-ის ანატომია

**იდეალური prompt** = თანმიმდევრული, ხარისხიანი შედეგები. აი რით შედგება.

---

## 🧬 Prompt DNA

\`\`\`markdown
[ROLE] + [CONTEXT] + [TASK] + [FORMAT] + [CONSTRAINTS] + [EXAMPLES]
\`\`\`

---

## 🎭 1. ROLE

### რას აკეთებს:
AI-ს აძლევ პერსონას/expertise-ს.

### მაგალითები:
\`\`\`markdown
❌ "Write code"
✅ "You are a senior TypeScript developer 
    with 10 years of React experience"

❌ "Fix this"
✅ "As a code reviewer focusing on 
    performance and best practices"
\`\`\`

---

## 📚 2. CONTEXT

### რას აკეთებს:
Background ინფორმაციას აწვდი.

### მაგალითები:
\`\`\`markdown
"I'm building a Next.js 14 e-commerce app.
We use TypeScript, Tailwind, and Prisma.
The app has user auth with NextAuth.
Current issue is in the checkout flow."
\`\`\`

---

## 📝 3. TASK

### რას აკეთებს:
კონკრეტული დავალება.

### მაგალითები:
\`\`\`markdown
❌ "Help with form"

✅ "Create a checkout form component that:
    1. Collects shipping address
    2. Validates all fields
    3. Handles payment selection
    4. Shows order summary"
\`\`\`

---

## 📋 4. FORMAT

### რას აკეთებს:
output-ის სტრუქტურა.

### მაგალითები:
\`\`\`markdown
"Provide your response as:
1. TypeScript code with types
2. Comments explaining logic
3. Usage example
4. Brief explanation"
\`\`\`

---

## 🚧 5. CONSTRAINTS

### რას აკეთებს:
საზღვრები და წესები.

### მაგალითები:
\`\`\`markdown
"Requirements:
- No external dependencies
- Must work with React 18
- Mobile-first design
- Under 100 lines of code
- Use only Tailwind (no custom CSS)"
\`\`\`

---

## 📎 6. EXAMPLES

### რას აკეთებს:
Few-shot learning.

### მაგალითები:
\`\`\`markdown
"Follow this pattern:
Input: Button
Output: 
\\\`\\\`\\\`tsx
export const Button = ({ children }) => (
  <button className='px-4 py-2'>{children}</button>
);
\\\`\\\`\\\`

Now create: Card component"
\`\`\`

---

## 🎯 Perfect Prompt Example

\`\`\`markdown
**Role:** You are a senior React developer 
specializing in TypeScript and Tailwind CSS.

**Context:** I'm building a SaaS dashboard 
with Next.js 14. We use shadcn/ui components.

**Task:** Create a data table component that:
1. Displays user data
2. Has sorting on all columns
3. Includes search functionality
4. Supports row selection
5. Has pagination

**Format:** 
- Single file TypeScript component
- Types included
- Usage example

**Constraints:**
- Use shadcn/ui Table
- No external table libraries
- Mobile responsive
- Accessible (keyboard nav)

**Example styling:**
[existing component code]
\`\`\`

---

## ✅ Checklist

Before sending:
- [ ] Role defined?
- [ ] Context clear?
- [ ] Task specific?
- [ ] Format requested?
- [ ] Constraints listed?
- [ ] Example provided?

> 💎 **Premium**: 100+ perfect prompt templates!
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
