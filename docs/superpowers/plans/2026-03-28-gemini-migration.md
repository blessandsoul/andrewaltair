# Gemini 2.0 Flash Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all Groq and OpenAI API calls with Google Gemini 2.0 Flash using `@google/generative-ai` SDK.

**Architecture:** Create a central `src/lib/gemini.ts` utility that all 14 API routes import. Each route replaces its `getClient()` / `fetch(GROQ_API_URL)` pattern with a single `callGemini(...)` call. Conversation history (mystic/chat) is converted from OpenAI format to Gemini format inside the utility.

**Tech Stack:** `@google/generative-ai`, Next.js 14 App Router, TypeScript

---

## File Map

| Action | File | Change |
|--------|------|--------|
| Create | `src/lib/gemini.ts` | New central Gemini client |
| Modify | `src/lib/mystic-rules.ts` | Remove `baseURL`, `createMysticClient`; update `AI_CONFIG.model` |
| Modify | `src/app/api/mystic/tarot/route.ts` | Replace OpenAI SDK call |
| Modify | `src/app/api/mystic/horoscope/route.ts` | Replace OpenAI SDK call |
| Modify | `src/app/api/mystic/dream/route.ts` | Replace OpenAI SDK call |
| Modify | `src/app/api/mystic/fortune/route.ts` | Replace OpenAI SDK call |
| Modify | `src/app/api/mystic/numerology/route.ts` | Replace OpenAI SDK call |
| Modify | `src/app/api/mystic/chat/route.ts` | Replace OpenAI SDK call + convert history format |
| Modify | `src/app/api/ai/text/route.ts` | Replace OpenAI direct call |
| Modify | `src/app/api/posts/ai-suggest/route.ts` | Replace raw fetch |
| Modify | `src/app/api/posts/generate-tags/route.ts` | Replace raw fetch |
| Modify | `src/app/api/posts/parse-ai/route.ts` | Remove dead `callGroq` + GROQ_API_KEY check |
| Modify | `src/app/api/prompts/generate/route.ts` | Replace OpenAI SDK + json_object |
| Modify | `src/app/api/prompt-builder/route.ts` | Replace local `callGroq` helper |
| Modify | `src/app/api/prompts/parse/route.ts` | Replace OpenAI SDK + json_object |
| Modify | `src/app/api/bots/[id]/demo/route.ts` | Replace OpenAI SDK call |
| Modify | `.env.example` | Add `GEMINI_API_KEY`, remove `GROQ_API_KEY`, `OPENAI_API_KEY` |

---

## Task 1: Install SDK and update environment

**Files:**
- Modify: `package.json`
- Modify: `.env.example`

- [ ] **Step 1: Install `@google/generative-ai`**

Run: `npm install @google/generative-ai`

Expected output: added 1 package

- [ ] **Step 2: Update `.env.example`**

Replace the AI keys block. Read the file first, then find lines with `GROQ_API_KEY` and `OPENAI_API_KEY` and replace them:

```
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
```

Remove these lines:
```
GROQ_API_KEY=...
OPENAI_API_KEY=...
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json .env.example
git commit -m "chore: install @google/generative-ai, update env example"
```

---

## Task 2: Create central Gemini utility

**Files:**
- Create: `src/lib/gemini.ts`

- [ ] **Step 1: Create `src/lib/gemini.ts`**

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const GEMINI_MODEL = 'gemini-2.0-flash'

export interface GeminiMessage {
  role: 'user' | 'model'
  parts: Array<{ text: string }>
}

export async function callGemini({
  systemPrompt,
  userMessage,
  temperature = 0.7,
  jsonMode = false,
  maxOutputTokens,
  history = [],
}: {
  systemPrompt: string
  userMessage: string
  temperature?: number
  jsonMode?: boolean
  maxOutputTokens?: number
  history?: GeminiMessage[]
}): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature,
      ...(maxOutputTokens ? { maxOutputTokens } : {}),
      ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
    },
  })

  const chat = model.startChat({ history })
  const result = await chat.sendMessage(userMessage)
  return result.response.text()
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: no errors related to `src/lib/gemini.ts`

- [ ] **Step 3: Commit**

```bash
git add src/lib/gemini.ts
git commit -m "feat: add central Gemini 2.0 Flash client utility"
```

---

## Task 3: Update mystic-rules.ts

**Files:**
- Modify: `src/lib/mystic-rules.ts`

- [ ] **Step 1: Update `AI_CONFIG` — remove Groq-specific fields**

Find:
```typescript
export const AI_CONFIG = {
    model: "llama-3.3-70b-versatile",
    temperature: 0.88,  // Баланс креативности и консистентности
    baseURL: "https://api.groq.com/openai/v1"
}
```

Replace with:
```typescript
export const AI_CONFIG = {
    temperature: 0.88,
}
```

- [ ] **Step 2: Remove `createMysticClient` function**

Find and delete this entire function:
```typescript
/**
 * Создает OpenAI клиент для Groq
 */
export function createMysticClient() {
    const OpenAI = require('openai').default
    return new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: AI_CONFIG.baseURL
    })
}
```

- [ ] **Step 3: Verify no other references to `AI_CONFIG.model` or `AI_CONFIG.baseURL`**

Run: `grep -r "AI_CONFIG\." src/`

Expected: only `AI_CONFIG.temperature` references remain (in route files that will be updated next).

- [ ] **Step 4: Commit**

```bash
git add src/lib/mystic-rules.ts
git commit -m "refactor: remove Groq config from mystic-rules, keep temperature"
```

---

## Task 4: Update mystic routes — tarot, horoscope, dream, fortune, numerology

These 5 routes share the same pattern: `getClient()` returns an OpenAI instance, then calls `client.chat.completions.create(...)`. Replace both with `callGemini`.

**Files:**
- Modify: `src/app/api/mystic/tarot/route.ts`
- Modify: `src/app/api/mystic/horoscope/route.ts`
- Modify: `src/app/api/mystic/dream/route.ts`
- Modify: `src/app/api/mystic/fortune/route.ts`
- Modify: `src/app/api/mystic/numerology/route.ts`

### tarot/route.ts

- [ ] **Step 1: Replace OpenAI import and getClient with callGemini import**

Find:
```typescript
import OpenAI from "openai"
```
Replace with:
```typescript
import { callGemini } from "@/lib/gemini"
```

Find and delete the entire `getClient` function:
```typescript
// Lazy initialization to avoid build-time errors
function getClient() {
    return new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: AI_CONFIG.baseURL,
    })
}
```

- [ ] **Step 2: Replace the AI call**

Find:
```typescript
        const client = getClient()
```
Delete that line.

Find:
```typescript
        const response = await client.chat.completions.create({
            model: AI_CONFIG.model,
            messages: [
                {
                    role: "system",
                    content: TAROT_RULES.systemPrompt
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: AI_CONFIG.temperature,
            max_tokens: 1000,
        })

        const content = response.choices[0]?.message?.content || ""
```

Replace with:
```typescript
        const content = await callGemini({
            systemPrompt: TAROT_RULES.systemPrompt,
            userMessage: prompt,
            temperature: AI_CONFIG.temperature,
            maxOutputTokens: 1000,
        })
```

- [ ] **Step 3: Remove unused `AI_CONFIG` model reference — it's no longer used here**

`AI_CONFIG` is still imported for `temperature` — keep that import.

### horoscope/route.ts

- [ ] **Step 4: Apply same pattern to horoscope**

Find:
```typescript
import OpenAI from "openai"
```
Replace with:
```typescript
import { callGemini } from "@/lib/gemini"
```

Delete `getClient()` function.

Find:
```typescript
        const client = getClient()
```
Delete that line.

Find:
```typescript
        const response = await client.chat.completions.create({
            model: AI_CONFIG.model,
            messages: [
                {
                    role: "system",
                    content: HOROSCOPE_RULES.systemPrompt
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: AI_CONFIG.temperature,
            max_tokens: 900,
        })

        const content = response.choices[0]?.message?.content || ""
```

Replace with:
```typescript
        const content = await callGemini({
            systemPrompt: HOROSCOPE_RULES.systemPrompt,
            userMessage: prompt,
            temperature: AI_CONFIG.temperature,
            maxOutputTokens: 900,
        })
```

### dream/route.ts

- [ ] **Step 5: Apply same pattern to dream**

Find:
```typescript
import OpenAI from "openai"
```
Replace with:
```typescript
import { callGemini } from "@/lib/gemini"
```

Delete `getClient()` function.

Delete `const client = getClient()` line.

Find:
```typescript
        const response = await client.chat.completions.create({
            model: AI_CONFIG.model,
            messages: [
                {
                    role: "system",
                    content: DREAM_RULES.systemPrompt
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: AI_CONFIG.temperature,
            max_tokens: 1000,
        })

        const content = response.choices[0]?.message?.content || ""
        const safeContent = sanitizeAIResponse(content);
```

Replace with:
```typescript
        const rawContent = await callGemini({
            systemPrompt: DREAM_RULES.systemPrompt,
            userMessage: prompt,
            temperature: AI_CONFIG.temperature,
            maxOutputTokens: 1000,
        })

        const safeContent = sanitizeAIResponse(rawContent);
```

### fortune/route.ts

- [ ] **Step 6: Apply same pattern to fortune**

Find:
```typescript
import OpenAI from "openai"
```
Replace with:
```typescript
import { callGemini } from "@/lib/gemini"
```

Delete `getClient()` function and `const client = getClient()` line.

Find:
```typescript
        const response = await client.chat.completions.create({
            model: AI_CONFIG.model,
            messages: [
                {
                    role: "system",
                    content: FORTUNE_RULES.systemPrompt
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: AI_CONFIG.temperature,
            max_tokens: 800,
        })

        const content = response.choices[0]?.message?.content || ""

        // Sanitize AI response
        const safeContent = sanitizeAIResponse(content);
```

Replace with:
```typescript
        const rawContent = await callGemini({
            systemPrompt: FORTUNE_RULES.systemPrompt,
            userMessage: prompt,
            temperature: AI_CONFIG.temperature,
            maxOutputTokens: 800,
        })

        const safeContent = sanitizeAIResponse(rawContent);
```

### numerology/route.ts

- [ ] **Step 7: Apply same pattern to numerology**

Find:
```typescript
import OpenAI from "openai"
```
Replace with:
```typescript
import { callGemini } from "@/lib/gemini"
```

Delete `getClient()` function and `const client = getClient()` line.

Find:
```typescript
        const response = await client.chat.completions.create({
            model: AI_CONFIG.model,
            messages: [
                {
                    role: "system",
                    content: NUMEROLOGY_RULES.systemPrompt
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: AI_CONFIG.temperature,
            max_tokens: 800,
        })

        const content = response.choices[0]?.message?.content || ""
        const safeContent = sanitizeAIResponse(content);
```

Replace with:
```typescript
        const rawContent = await callGemini({
            systemPrompt: NUMEROLOGY_RULES.systemPrompt,
            userMessage: prompt,
            temperature: AI_CONFIG.temperature,
            maxOutputTokens: 800,
        })

        const safeContent = sanitizeAIResponse(rawContent);
```

- [ ] **Step 8: Commit all 5 mystic routes**

```bash
git add src/app/api/mystic/tarot/route.ts src/app/api/mystic/horoscope/route.ts src/app/api/mystic/dream/route.ts src/app/api/mystic/fortune/route.ts src/app/api/mystic/numerology/route.ts
git commit -m "feat: migrate tarot, horoscope, dream, fortune, numerology to Gemini"
```

---

## Task 5: Update mystic/chat route

This route passes conversation history — needs format conversion (OpenAI `assistant` → Gemini `model`).

**Files:**
- Modify: `src/app/api/mystic/chat/route.ts`

- [ ] **Step 1: Replace OpenAI import**

Find:
```typescript
import OpenAI from "openai"
```
Replace with:
```typescript
import { callGemini } from "@/lib/gemini"
import type { GeminiMessage } from "@/lib/gemini"
```

- [ ] **Step 2: Delete `getClient` function**

Delete:
```typescript
// Lazy initialization to avoid build-time errors
function getClient() {
    return new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: AI_CONFIG.baseURL,
    })
}
```

- [ ] **Step 3: Replace AI call — convert history format and call Gemini**

Find:
```typescript
        const client = getClient()
```
Delete that line.

Find:
```typescript
        const messages = [
            { role: "system" as const, content: fullSystemPrompt },
            ...safeHistory.slice(-8),
            { role: "user" as const, content: safeMessage }
        ]

        const response = await client.chat.completions.create({
            model: AI_CONFIG.model,
            messages,
            temperature: AI_CONFIG.temperature,
            max_tokens: 500,
        })

        const content = response.choices[0]?.message?.content || "ვარსკვლავები დროებით დადუმდნენ... გთხოვ სცადო ხელახლა."
```

Replace with:
```typescript
        const geminiHistory: GeminiMessage[] = safeHistory.slice(-8).map(
            (m: { role: string; content: string }) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
            })
        )

        const content = await callGemini({
            systemPrompt: fullSystemPrompt,
            userMessage: safeMessage,
            temperature: AI_CONFIG.temperature,
            maxOutputTokens: 500,
            history: geminiHistory,
        }).catch(() => "ვარსკვლავები დროებით დადუმდნენ... გთხოვ სცადო ხელახლა.")
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/mystic/chat/route.ts
git commit -m "feat: migrate mystic chat to Gemini with history format conversion"
```

---

## Task 6: Update ai/text route

This was the only route using OpenAI (gpt-4o-mini) directly, not Groq.

**Files:**
- Modify: `src/app/api/ai/text/route.ts`

- [ ] **Step 1: Rewrite the file**

Replace the entire file content with:

```typescript
export const dynamic = 'force-dynamic'
import { NextRequest } from "next/server"
import { callGemini } from "@/lib/gemini"
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'

export async function POST(request: NextRequest) {
    try {
        const { action, text, prompt } = await request.json()

        if (!text || !prompt) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, "ტექსტი და მოქმედება აუცილებელია", 400)
        }

        const result = await callGemini({
            systemPrompt: "You are a helpful writing assistant. Follow the user's instructions precisely and return only the improved text without any additional commentary or explanation.",
            userMessage: `${prompt}\n\nText:\n${text}`,
            temperature: 0.7,
            maxOutputTokens: 2000,
        })

        return apiSuccess({ result: result || text, action }, 'AI text processed')
    } catch (error) {
        console.error("AI text processing error:", error)
        return apiError(ERROR_CODES.AI_SERVICE_ERROR, "AI დამუშავება ვერ მოხერხდა", 500)
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/ai/text/route.ts
git commit -m "feat: migrate ai/text from OpenAI gpt-4o-mini to Gemini"
```

---

## Task 7: Update posts/ai-suggest route

This route uses raw `fetch` to the Groq API URL. Replace with `callGemini`.

**Files:**
- Modify: `src/app/api/posts/ai-suggest/route.ts`

- [ ] **Step 1: Replace Groq fetch with callGemini**

Find at top:
```typescript
import { NextRequest } from 'next/server'
```
Replace with:
```typescript
import { NextRequest } from 'next/server'
import { callGemini } from '@/lib/gemini'
```

Find and delete:
```typescript
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
```

- [ ] **Step 2: Replace the fetch call inside POST**

Find:
```typescript
        const GROQ_API_KEY = process.env.GROQ_API_KEY
        if (!GROQ_API_KEY) {
            return apiError(ERROR_CODES.AI_SERVICE_ERROR, 'GROQ_API_KEY not configured', 500)
        }
```
Delete those 4 lines.

Find:
```typescript
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: context }
                ],
                temperature: 0.3,
                max_tokens: 1000,
            }),
        })

        if (!response.ok) {
            throw new Error('Groq API error')
        }

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content || ''
```

Replace with:
```typescript
        const content = await callGemini({
            systemPrompt: SYSTEM_PROMPT,
            userMessage: context,
            temperature: 0.3,
            maxOutputTokens: 1000,
        })
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/posts/ai-suggest/route.ts
git commit -m "feat: migrate posts/ai-suggest to Gemini"
```

---

## Task 8: Update posts/generate-tags route

**Files:**
- Modify: `src/app/api/posts/generate-tags/route.ts`

- [ ] **Step 1: Add callGemini import, remove GROQ_API_URL**

Find:
```typescript
import { NextRequest } from 'next/server'
```
Replace with:
```typescript
import { NextRequest } from 'next/server'
import { callGemini } from '@/lib/gemini'
```

Delete:
```typescript
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
```

- [ ] **Step 2: Replace fetch block**

Find:
```typescript
        const GROQ_API_KEY = process.env.GROQ_API_KEY
        if (!GROQ_API_KEY) {
            return apiError(ERROR_CODES.AI_SERVICE_ERROR, 'GROQ_API_KEY not configured', 500)
        }
```
Delete those 4 lines.

Find:
```typescript
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: context }
                ],
                temperature: 0.5,
                max_tokens: 500,
            }),
        })

        if (!response.ok) {
            const errText = await response.text()
            console.error('Groq API error:', errText)
            throw new Error('Groq API error')
        }

        const data = await response.json()
        const rawContent = data.choices?.[0]?.message?.content || ''
```

Replace with:
```typescript
        const rawContent = await callGemini({
            systemPrompt: SYSTEM_PROMPT,
            userMessage: context,
            temperature: 0.5,
            maxOutputTokens: 500,
        })
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/posts/generate-tags/route.ts
git commit -m "feat: migrate posts/generate-tags to Gemini"
```

---

## Task 9: Clean up posts/parse-ai route

This route defines `callGroq` but never calls it — the POST handler uses `fallbackParse`. Remove the dead code and the unused `GROQ_API_KEY` check.

**Files:**
- Modify: `src/app/api/posts/parse-ai/route.ts`

- [ ] **Step 1: Delete `GROQ_API_URL` constant**

Find and delete:
```typescript
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
```

- [ ] **Step 2: Delete the entire `callGroq` function**

Find and delete everything from:
```typescript
async function callGroq(rawContent: string, apiKey: string): Promise<ParseResult> {
```
through the closing `}` of that function (ends just before `// Improved fallback parser`).

- [ ] **Step 3: Remove GROQ_API_KEY check in POST handler**

Find:
```typescript
        const GROQ_API_KEY = process.env.GROQ_API_KEY
        if (!GROQ_API_KEY) {
            return apiError(ERROR_CODES.AI_SERVICE_ERROR, 'GROQ_API_KEY not configured', 500)
        }
```
Delete those 4 lines.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/posts/parse-ai/route.ts
git commit -m "refactor: remove dead callGroq code from parse-ai (uses fallback parser)"
```

---

## Task 10: Update prompts/generate route

Uses `response_format: { type: "json_object" }` — replaced with Gemini `jsonMode: true`.

**Files:**
- Modify: `src/app/api/prompts/generate/route.ts`

- [ ] **Step 1: Replace OpenAI import and client initialization**

Find:
```typescript
import OpenAI from "openai"
```
Replace with:
```typescript
import { callGemini } from "@/lib/gemini"
```

Find and delete:
```typescript
// Initialize OpenAI client for Groq
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
})
```

- [ ] **Step 2: Replace the AI call**

Find:
```typescript
        const completion = await client.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userContent }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        })

        const content = completion.choices[0]?.message?.content
        if (!content) {
            throw new Error("No content received from AI")
        }

        const result = JSON.parse(content)
```

Replace with:
```typescript
        const content = await callGemini({
            systemPrompt,
            userMessage: userContent,
            temperature: 0.7,
            jsonMode: true,
        })

        if (!content) {
            throw new Error("No content received from AI")
        }

        const result = JSON.parse(content)
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/prompts/generate/route.ts
git commit -m "feat: migrate prompts/generate to Gemini with JSON mode"
```

---

## Task 11: Update prompt-builder route

Has its own local `callGroq` helper function. Replace with `callGemini`.

**Files:**
- Modify: `src/app/api/prompt-builder/route.ts`

- [ ] **Step 1: Add callGemini import, remove GROQ_API_URL**

Find:
```typescript
import { NextRequest } from 'next/server'
```
Replace with:
```typescript
import { NextRequest } from 'next/server'
import { callGemini } from '@/lib/gemini'
```

Delete:
```typescript
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
```

- [ ] **Step 2: Replace the local `callGroq` function with a wrapper that calls `callGemini`**

Find and delete the entire local function:
```typescript
async function callGroq(
    systemPrompt: string,
    userMessage: string,
    apiKey: string,
    settings: ModelSettings = {}
): Promise<string> {
    const {
        model = 'llama-3.3-70b-versatile',
        temperature = 0.7,
        maxTokens = 1500
    } = settings

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature,
            max_tokens: maxTokens,
        }),
    })

    if (!response.ok) {
        throw new Error('Groq API error')
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
}
```

Replace with:
```typescript
async function callGroqCompat(
    systemPrompt: string,
    userMessage: string,
    settings: ModelSettings = {}
): Promise<string> {
    const { temperature = 0.7, maxTokens = 1500 } = settings
    return callGemini({
        systemPrompt,
        userMessage,
        temperature,
        maxOutputTokens: maxTokens,
    })
}
```

- [ ] **Step 3: Remove GROQ_API_KEY check in POST handler**

Find:
```typescript
        // Check API key first
        const GROQ_API_KEY = process.env.GROQ_API_KEY
        if (!GROQ_API_KEY) {
            return apiError(ERROR_CODES.PROMPT_FETCH_FAILED, 'GROQ_API_KEY not configured', 500)
        }
```
Delete those 5 lines.

- [ ] **Step 4: Replace all `callGroq(` calls with `callGroqCompat(` and remove the `apiKey` argument**

Each `callGroq(systemPrompt, userMessage, GROQ_API_KEY, settings)` → `callGroqCompat(systemPrompt, userMessage, settings)`

There are 7 call sites (enhance, suggest-task, improve-task, score, translate, variations, test). For each, remove `, GROQ_API_KEY` from the argument list.

For example:
```typescript
// Before
result = await callGroq(
    `შენ ხარ ექსპერტი...`,
    `გააუმჯობესე...`,
    GROQ_API_KEY,
    settings
)
// After
result = await callGroqCompat(
    `შენ ხარ ექსპერტი...`,
    `გააუმჯობესე...`,
    settings
)
```

Apply this same removal of `, GROQ_API_KEY` to all 7 switch cases.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/prompt-builder/route.ts
git commit -m "feat: migrate prompt-builder to Gemini"
```

---

## Task 12: Update prompts/parse route

Uses `response_format: { type: "json_object" }`.

**Files:**
- Modify: `src/app/api/prompts/parse/route.ts`

- [ ] **Step 1: Replace OpenAI import and module-level client**

Find:
```typescript
import OpenAI from "openai"
```
Replace with:
```typescript
import { callGemini } from "@/lib/gemini"
```

Find and delete:
```typescript
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
})
```

- [ ] **Step 2: Replace the AI call**

Find:
```typescript
        // 2. USE AI ONLY FOR METADATA (Title, Desc, Tags)
        // We give it the "cleaned" text without the confusion of the prompt block.
        const completion = await client.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: textForAI }
            ],
            temperature: 0.1,
            response_format: { type: "json_object" }
        })

        const content = completion.choices[0]?.message?.content
        if (!content) throw new Error("No content from AI")

        const aiResult = JSON.parse(content)
```

Replace with:
```typescript
        // 2. USE AI ONLY FOR METADATA (Title, Desc, Tags)
        // We give it the "cleaned" text without the confusion of the prompt block.
        const content = await callGemini({
            systemPrompt: SYSTEM_PROMPT,
            userMessage: textForAI,
            temperature: 0.1,
            jsonMode: true,
        })

        if (!content) throw new Error("No content from AI")

        const aiResult = JSON.parse(content)
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/prompts/parse/route.ts
git commit -m "feat: migrate prompts/parse to Gemini with JSON mode"
```

---

## Task 13: Update bots/[id]/demo route

**Files:**
- Modify: `src/app/api/bots/[id]/demo/route.ts`

- [ ] **Step 1: Replace OpenAI import**

Find:
```typescript
import OpenAI from 'openai';
import { AI_CONFIG } from '@/lib/mystic-rules';
```
Replace with:
```typescript
import { callGemini } from '@/lib/gemini';
```

- [ ] **Step 2: Remove the client initialization and replace the API call**

Find:
```typescript
        // Check API key
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return apiError(ERROR_CODES.AI_SERVICE_ERROR, 'AI service not configured', 500);
        }

        // Create Groq client (compatible with OpenAI SDK)
        const client = new OpenAI({
            apiKey: apiKey,
            baseURL: AI_CONFIG.baseURL,
        });

        // Prepare messages for AI API
        const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
            { role: 'system', content: securePrompt },
            ...conversationHistory.slice(-6).map((m: { role: string; content: string }) => ({
                role: m.role as 'user' | 'assistant',
                content: m.content
            })),
            { role: 'user', content: message }
        ];

        // Call Groq API via OpenAI SDK
        const response = await client.chat.completions.create({
            model: AI_CONFIG.model,
            messages: messages,
            temperature: 0.7,
            max_tokens: 200, // Limited for demo
        });

        const aiResponse = response.choices[0]?.message?.content ||
            'ვერ მოხერხდა პასუხის გენერაცია.';
```

Replace with:
```typescript
        import type { GeminiMessage } from '@/lib/gemini';

        // Prepare history in Gemini format
        const geminiHistory: GeminiMessage[] = conversationHistory.slice(-6).map(
            (m: { role: string; content: string }) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
            })
        );

        const aiResponse = await callGemini({
            systemPrompt: securePrompt,
            userMessage: message,
            temperature: 0.7,
            maxOutputTokens: 200,
            history: geminiHistory,
        }).catch(() => 'ვერ მოხერხდა პასუხის გენერაცია.');
```

Note: Move the `import type { GeminiMessage }` to the top of the file with other imports, not inside the function body.

Correct form — add to file top imports:
```typescript
import { callGemini } from '@/lib/gemini';
import type { GeminiMessage } from '@/lib/gemini';
```

- [ ] **Step 3: Commit**

```bash
git add "src/app/api/bots/[id]/demo/route.ts"
git commit -m "feat: migrate bots/demo to Gemini"
```

---

## Task 14: Remove openai package

- [ ] **Step 1: Verify openai is no longer imported anywhere**

Run: `grep -r "from ['\"]openai['\"]" src/ --include="*.ts" --include="*.tsx"`

Expected: no output (zero matches)

- [ ] **Step 2: Uninstall openai package**

Run: `npm uninstall openai`

- [ ] **Step 3: Final TypeScript check**

Run: `npx tsc --noEmit`

Expected: no errors

- [ ] **Step 4: Final commit**

```bash
git add package.json package-lock.json
git commit -m "chore: remove openai package, migration to Gemini complete"
```

---

## Notes

- `posts/parse-ai` has a `callGroq` function that was already dead code (unused). Removed in Task 9.
- `mystic/love/route.ts` was not found during exploration — verify it exists. If it follows the same OpenAI SDK pattern, apply the same Task 4 pattern.
- All rate limiting, CSRF, sanitization logic is untouched.
- All system prompts in `mystic-rules.ts` are untouched.
- Temperatures preserved exactly: 0.88 for mystic, 0.3 for SEO/parsing, 0.7 for content/prompts.
