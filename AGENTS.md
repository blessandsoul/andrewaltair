# 🤖 AGENTS.md - AI Agent Optimization Guide

> **Purpose:** This document provides AI agents with comprehensive context about the AndrewAltair.ge codebase for efficient assistance.

---

## 📋 Project Overview

| Attribute | Value |
|-----------|-------|
| **Name** | Andrew Altair AI Blog |
| **Domain** | andrewaltair.ge |
| **Type** | Georgian AI Content Platform |
| **Framework** | Next.js 16.1.1 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | TailwindCSS 4 + Radix UI |
| **Content Language** | Georgian (ქართული) |

---

## 🏗️ Architecture

### Directory Structure
```
src/
├── app/                    # Next.js App Router (pages & API)
├── components/             # React components by feature
│   ├── ai/                 # AI-powered components (9)
│   ├── effects/            # Visual effects (9)
│   ├── gamification/       # Game elements (6)
│   ├── interactive/        # User interactions (19)
│   ├── layout/             # Header, Footer
│   └── ui/                 # Shadcn/Radix primitives
├── data/                   # JSON data sources
├── lib/                    # Utilities & brand config
└── types/                  # TypeScript definitions
```

### Key Files
| File | Purpose |
|------|---------|
| `src/lib/brand.ts` | Brand configuration (colors, fonts, socials) |
| `src/app/globals.css` | Global styles & design tokens |
| `src/data/posts.json` | Blog posts data |
| `src/data/tools.json` | AI tools catalog |

---

## 🎨 Design System

### Color Tokens
```css
--primary: #6366f1;        /* Electric Indigo */
--accent: #22d3ee;         /* Neon Cyan */
--background: #0a0a0f;     /* Deep Black (dark mode) */
--card: #12121a;           /* Card surfaces */
```

### CSS Utilities
```css
.text-gradient          /* Primary to accent gradient text */
.glass-strong           /* Glassmorphism effect */
.hover-lift             /* Hover elevation animation */
.card-shine             /* Card hover shine effect */
.glow-sm                /* Subtle glow effect */
.animated-gradient      /* Animated background gradient */
```

### Typography
- **Georgian:** `'Noto Sans Georgian'`
- **English:** `'Inter'`
- **Code:** `'JetBrains Mono'`

---

## 🔧 Component Reference

### AI Components (`/components/ai/`)
```typescript
import { 
  AIChatAssistant,      // Floating chat widget
  FortuneTeller,        // Mystic fortune telling
  LoveCalculator,       // Love compatibility
  DreamInterpreter,     // Dream analysis
  Horoscope,            // Daily horoscope
  TLDRSummary,          // Article summary
  VoiceSearch,          // Voice search input
  ArticleNarrator,      // TTS for articles
  SmartRecommendations  // AI content suggestions
} from '@/components/ai'
```

### Effects (`/components/effects/`)
```typescript
import { 
  TiltCard,             // 3D perspective cards
  MagneticButton,       // Magnetic hover buttons
  LiquidBlobBackground, // Blob background
  CursorTrail,          // Mouse trail particles
  TextScramble,         // Text scramble animation
  ParallaxSection,      // Parallax scrolling
  PageTransition,       // Page transitions
  MicroInteractions     // HoverScale, PulseGlow, FloatEffect
} from '@/components/effects'
```

### Gamification (`/components/gamification/`)
```typescript
import { 
  Quiz,                 // AI personality quiz
  SpinWheel,            // Prize wheel
  Leaderboard,          // User rankings
  AchievementBadge,     // Achievement system
  StreakCounter         // Daily streak
} from '@/components/gamification'
```

### Interactive (`/components/interactive/`)
```typescript
import { 
  Comments,             // Comment system
  BookmarkButton,       // Bookmark functionality
  ReactionBar,          // Emoji reactions
  ShareButtons,         // Social sharing
  ReadingProgress,      // Progress indicator
  TableOfContents,      // Auto TOC
  SearchDialog,         // Global search
  InfiniteScroll,       // Infinite loading
  QuoteCardGenerator,   // Quote image generator
  BeforeAfterSlider     // Comparison slider
} from '@/components/interactive'
```

### UI Primitives (`/components/ui/`)
```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
```

---

## 📡 API Routes

### Available Endpoints
```
POST /api/chat       # OpenAI chat completion
POST /api/fortune    # Fortune telling
POST /api/horoscope  # Horoscope generation
POST /api/dream      # Dream interpretation
```

### Environment Variables
```env
OPENAI_API_KEY=sk-...   # Required for AI features
```

---

## 📝 Data Models

### Post Schema
```typescript
interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  category: 'ai-tips' | 'tutorials' | 'news' | 'tools' | 'reviews' | 'opinion'
  tags: string[]
  author: {
    name: string
    avatar: string
    role: string
  }
  publishedAt: string
  readingTime: number
  views: number
  reactions: {
    fire: number
    love: number
    mindblown: number
    applause: number
    insightful: number
  }
  featured: boolean
  trending: boolean
}
```

### Brand Configuration
```typescript
// Access via: import { brand } from '@/lib/brand'
brand.name              // "Andrew Altair"
brand.tagline           // "AI ინოვატორი და კონტენტ კრეატორი"
brand.colors.primary    // Color palette
brand.categories        // Blog categories
brand.social            // Social media links
brand.reactions         // Emoji reactions config
```

---

## 🌍 Page Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `page.tsx` | Homepage - Hero, Trending, Newsletter |
| `/blog` | `blog/page.tsx` | Blog listing with filters |
| `/blog/[slug]` | `blog/[slug]/page.tsx` | Article detail page |
| `/mystic` | `mystic/page.tsx` | Mystic AI tools hub |
| `/features` | `features/page.tsx` | Features showcase |
| `/videos` | `videos/page.tsx` | Video content |
| `/about` | `about/page.tsx` | About page |
| `/contact` | `contact/page.tsx` | Contact form |
| `/resources` | `resources/page.tsx` | AI resources |
| `/admin` | `admin/page.tsx` | Admin dashboard |
| `/admin/posts` | `admin/posts/page.tsx` | Post management |
| `/admin/posts/new` | `admin/posts/new/page.tsx` | Post editor |

---

## 🚀 Common Tasks

### Adding a New Blog Post
1. Add entry to `src/data/posts.json`
2. Create MDX/content if needed
3. Post will auto-render at `/blog/[slug]`

### Adding New AI Component
1. Create component in `src/components/ai/`
2. Export from `src/components/ai/index.ts`
3. Integrate in relevant pages

### Modifying Design Tokens
1. Edit `src/app/globals.css` for CSS variables
2. Or update `src/lib/brand.ts` for brand config

### Adding New Page
1. Create folder in `src/app/[route]/`
2. Add `page.tsx` with component
3. Update navigation if needed

---

## ⚠️ Important Notes

### Georgian Language
- All user-facing content is in Georgian (ქართული)
- Use Georgian fonts: Noto Sans Georgian
- RTL is NOT required (Georgian is LTR)

### Performance Considerations
- Images should use Next.js `<Image />` 
- Components use `"use client"` only when needed
- Heavy effects (CursorTrail, Blobs) are conditionally loaded

### Styling Conventions
- Use TailwindCSS utility classes
- Custom utilities in `globals.css`
- Component variants via CVA

### Type Safety
- All components are TypeScript
- Props interfaces defined per component
- Strict mode enabled

---

## 🔍 Quick Reference

### Import Patterns
```typescript
// Components
import { Component } from '@/components/category/Component'

// UI
import { Button } from '@/components/ui/button'

// Data
import postsData from '@/data/posts.json'

// Config
import { brand } from '@/lib/brand'

// Utils
import { cn } from '@/lib/utils'
```

### Running Commands
```bash
npm run dev     # Start dev server (port 3000)
npm run build   # Production build
npm run lint    # ESLint check
```

---

## 📊 Project Statistics

- **Total Components:** 50+
- **Features:** 45+
- **Pages:** 15+
- **API Routes:** 4
- **Lines of Code:** 15,000+

---

*This document is optimized for AI agents to quickly understand and assist with the AndrewAltair.ge codebase.*
