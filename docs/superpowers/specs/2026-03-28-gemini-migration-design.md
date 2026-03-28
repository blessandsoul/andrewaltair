# Gemini 2.0 Flash Migration Design

## Goal
Replace all Groq and OpenAI API calls with Google Gemini 2.0 Flash (`gemini-2.0-flash`) using the native `@google/generative-ai` SDK.

## Central Client

Create `src/lib/gemini.ts`:
- Single `GoogleGenerativeAI` instance using `GEMINI_API_KEY`
- Export `callGemini({ systemPrompt, userMessage, temperature, jsonMode })` utility
- Model: `gemini-2.0-flash`
- JSON mode via `responseMimeType: "application/json"` when `jsonMode: true`

## Affected Files (14 endpoints)

### Mystic services
- `src/app/api/mystic/tarot/route.ts` — temp 0.88
- `src/app/api/mystic/horoscope/route.ts` — temp 0.88
- `src/app/api/mystic/dream/route.ts` — temp 0.88
- `src/app/api/mystic/fortune/route.ts` — temp 0.88
- `src/app/api/mystic/numerology/route.ts` — temp 0.88
- `src/app/api/mystic/love/route.ts` — temp 0.88
- `src/app/api/mystic/chat/route.ts` — temp 0.88

### Content processing
- `src/app/api/ai/text/route.ts` — temp 0.7 (was OpenAI gpt-4o-mini)
- `src/app/api/posts/ai-suggest/route.ts` — temp 0.3
- `src/app/api/posts/generate-tags/route.ts` — temp 0.3
- `src/app/api/posts/parse-ai/route.ts` — temp 0.3
- `src/app/api/prompts/generate/route.ts` — temp 0.7
- `src/app/api/prompt-builder/route.ts` — temp 0.7
- `src/app/api/prompts/parse/route.ts` — temp 0.3

### Bot marketplace
- `src/app/api/bots/[id]/demo/route.ts` — temp 0.7

## Dependencies
- Add: `@google/generative-ai`
- Remove: `openai` (if unused elsewhere)

## Environment
- Add: `GEMINI_API_KEY`
- Remove: `GROQ_API_KEY`, `OPENAI_API_KEY`

## Preserved
- All system prompts in `src/lib/mystic-rules.ts` unchanged
- All temperature values unchanged
- All rate limiting, CSRF, sanitization logic unchanged
