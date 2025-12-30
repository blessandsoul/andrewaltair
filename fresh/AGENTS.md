# AGENTS.md - AI Agent Guidelines

> Context and guidelines for AI agents working on the Andrew Altair project

## 🎯 Project Overview

**Andrew Altair** is a Georgian AI-powered mystic entertainment platform built with Next.js 14, TypeScript, and MongoDB.

### Primary Focus Areas
1. **Mystic AI Tools** - 8 interactive tools with Groq AI integration
2. **Gamification** - Badges, streaks, leaderboards
3. **Personal Branding** - Author promotion, social sharing
4. **Monetization** - Premium subscription system

---

## 🏗 Architecture

### Framework
- **Next.js 14** with App Router
- Server Components for performance
- API Routes for backend logic

### Database
- **MongoDB Atlas** via Mongoose
- Connection pooling in serverless environment
- Models in `/src/models/`

### AI Integration
- **Groq API** with OpenAI SDK compatibility
- llama-3.3-70b-versatile model
- Georgian language prompts

---

## 📁 Key Directories

```
/src/app/mystic/          # Main mystic page
/src/app/api/mystic/      # API endpoints (fortune, tarot, etc.)
/src/components/ai/       # AI tool components
/src/components/mystic/   # UI components (history, leaderboard)
/src/models/              # MongoDB schemas
/src/lib/                 # Utilities (db.ts, badges.ts)
```

---

## 🔧 Development Guidelines

### API Routes
- Use `process.env.GROQ_API_KEY` for AI calls
- Call `dbConnect()` before database operations
- Return JSON with proper error handling
- Include fallback responses for AI failures

### Components
- Use `"use client"` for interactive components
- Import UI from `@/components/ui/`
- Use Tailwind CSS with custom dark theme
- Georgian language for all user-facing text

### Models
- Always re-export types for client use
- Use `export type { }` for isolatedModules compatibility
- Include timestamps in schemas

---

## 🌐 Language

**Primary language: Georgian (ქართული)**

All user-facing text, AI prompts, and responses should be in Georgian.

### Key Terms
- გადალი = Fortune Telling
- ტაროტი = Tarot
- ჰოროსკოპი = Horoscope
- წინასწარმეტყველება = Prediction
- ბეჯი = Badge

---

## ⚠️ Common Issues

### "Missing credentials" Error
GROQ_API_KEY not set in `.env.local`

### MongoDB Connection
Ensure `MONGODB_URI` is set and IP whitelisted in Atlas

### Client/Server Mismatch
Don't import Mongoose models directly into client components - use `/lib/` utilities

---

## 🎨 Design System

### Colors
- Background: `#0a0a12`, `#12121a`
- Purple gradient: `from-purple-600 to-violet-600`
- Pink gradient: `from-pink-600 to-rose-600`
- Gold/Premium: `from-amber-500 to-yellow-500`

### Components
- Rounded: `rounded-2xl sm:rounded-3xl`
- Borders: `border border-white/10`
- Glass effect: `bg-white/5 backdrop-blur-sm`

---

## 📊 Data Flow

1. **User interaction** → Client component
2. **API call** → `/api/mystic/*` route
3. **AI generation** → Groq API (if AI tool)
4. **History save** → Optional POST to `/api/mystic/history`
5. **Response** → JSON with prediction data

---

## 🧪 Testing

Run dev server:
```bash
npm run dev
```

Test API endpoints:
```bash
curl -X POST http://localhost:3000/api/mystic/history \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","toolType":"fortune","result":{}}'
```

---

## 📝 Recent Changes

### December 2024
- Added 4 new AI tools (Tarot, Numerology, MoonPhases, Chat)
- Created gamification system (16 badges)
- Added social sharing (ShareCard)
- Implemented premium subscription UI
- Created History and Leaderboard components

---

## 🤝 Contributing

1. Follow existing code style
2. Use Georgian for UI text
3. Add proper type definitions
4. Test API endpoints
5. Update README if adding features
