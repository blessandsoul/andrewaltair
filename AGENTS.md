# 🤖 AGENTS.md - AI Agent Optimization Guide

> **Purpose:** This document provides AI agents with comprehensive context about the AndrewAltair.ge codebase for efficient assistance.

---

## 📋 Project Overview

| Attribute | Value |
|-----------|-------|
| **Name** | Andrew Altair AI Blog |
| **Domain** | andrewaltair.ge |
| **GitHub** | github.com/blessandsoul/andrewaltair |
| **Type** | Georgian AI Content Platform |
| **Framework** | Next.js 16.1.1 (App Router) |
| **Language** | TypeScript 5 (Strict Mode) |
| **Styling** | TailwindCSS 4 + Radix UI |
| **Content Language** | Georgian (ქართული) |
| **AI Integration** | OpenAI SDK 6.15 |

---

## 🏗️ Architecture

### Directory Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout with fonts
│   ├── globals.css             # Design tokens (13KB)
│   ├── page.tsx                # Homepage (22KB)
│   ├── not-found.tsx           # 404 with Snake game
│   │
│   ├── blog/                   # Blog pages
│   │   ├── page.tsx            # Blog listing
│   │   └── [slug]/page.tsx     # Article detail
│   │
│   ├── mystic/                 # Mystic AI tools
│   ├── tools/                  # 1000+ AI tools catalog
│   ├── features/               # Features showcase (50+)
│   ├── videos/                 # Video content
│   ├── about/                  # About page
│   ├── contact/                # Contact form
│   ├── resources/              # AI resources
│   │
│   ├── admin/                  # Admin Panel (12 subpages)
│   │   ├── layout.tsx          # Admin layout
│   │   ├── page.tsx            # Dashboard
│   │   ├── analytics/          # Analytics
│   │   ├── posts/              # Posts management
│   │   │   ├── page.tsx        # Posts list
│   │   │   └── new/page.tsx    # Rich text editor
│   │   ├── videos/             # Videos
│   │   ├── categories/         # Categories
│   │   ├── tags/               # Tags
│   │   ├── comments/           # Comments moderation
│   │   ├── users/              # Users
│   │   ├── media/              # Media library
│   │   ├── content/            # Bulk actions
│   │   ├── seo/                # SEO analyzer
│   │   ├── settings/           # Settings
│   │   └── tools/              # System tools
│   │
│   └── api/                    # API Routes
│       ├── chat/route.ts       # OpenAI Chat
│       └── mystic/             # Mystic APIs
│           ├── fortune/route.ts
│           ├── horoscope/route.ts
│           ├── dream/route.ts
│           └── love/route.ts
│
├── components/                 # React Components (70+)
│   ├── ai/                     # AI-powered (9 components)
│   │   ├── AIChatAssistant.tsx
│   │   ├── FortuneTeller.tsx
│   │   ├── LoveCalculator.tsx
│   │   ├── DreamInterpreter.tsx
│   │   ├── Horoscope.tsx
│   │   ├── TLDRSummary.tsx
│   │   ├── VoiceSearch.tsx
│   │   ├── ArticleNarrator.tsx
│   │   ├── SmartRecommendations.tsx
│   │   └── index.ts
│   │
│   ├── effects/                # Visual effects (8 components)
│   │   ├── TiltCard.tsx
│   │   ├── MagneticButton.tsx
│   │   ├── LiquidBlob.tsx
│   │   ├── CursorTrail.tsx
│   │   ├── TextScramble.tsx
│   │   ├── ParallaxSection.tsx
│   │   ├── PageTransition.tsx
│   │   ├── MicroInteractions.tsx
│   │   └── index.ts
│   │
│   ├── gamification/           # Game elements (5 components)
│   │   ├── Quiz.tsx
│   │   ├── SpinWheel.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── AchievementBadge.tsx
│   │   ├── StreakCounter.tsx
│   │   └── index.ts
│   │
│   ├── interactive/            # Interactive (18 components)
│   │   ├── Comments.tsx
│   │   ├── BookmarkSystem.tsx
│   │   ├── ReactionBar.tsx
│   │   ├── ShareButtons.tsx
│   │   ├── HighlightShare.tsx
│   │   ├── ReadingProgress.tsx
│   │   ├── ReadingMode.tsx
│   │   ├── TableOfContents.tsx
│   │   ├── SearchDialog.tsx
│   │   ├── InfiniteScroll.tsx
│   │   ├── LiveVisitorCounter.tsx
│   │   ├── NewsletterPopup.tsx
│   │   ├── SocialProofToast.tsx
│   │   ├── QuoteCardGenerator.tsx
│   │   ├── BeforeAfterSlider.tsx
│   │   ├── ContentFilters.tsx
│   │   ├── Footnotes.tsx
│   │   ├── EasterEgg.tsx
│   │   └── index.ts
│   │
│   ├── layout/                 # Layout (4 components)
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── MobileMenu.tsx
│   │
│   ├── blog/                   # Blog (4 components)
│   │   ├── PostCard.tsx
│   │   ├── PostGrid.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── FeaturedPost.tsx
│   │
│   ├── cards/                  # Cards (4 components)
│   │   ├── TrendingCard.tsx
│   │   ├── ToolCard.tsx
│   │   ├── VideoCard.tsx
│   │   └── AnimatedCard.tsx
│   │
│   ├── admin/                  # Admin (4 components)
│   │   ├── AdminNav.tsx
│   │   ├── DataTable.tsx
│   │   ├── StatsCard.tsx
│   │   └── Editor.tsx
│   │
│   └── ui/                     # Shadcn UI Primitives (10)
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── input.tsx
│       ├── tabs.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── separator.tsx
│       ├── navigation-menu.tsx
│       └── index.ts
│
├── data/                       # JSON Data Sources
│   ├── posts.json              # Blog posts (7KB)
│   ├── tools.json              # AI tools (433KB, 1000+ entries)
│   ├── videos.json             # Videos (3KB)
│   └── repos.json              # GitHub projects (2KB)
│
├── lib/                        # Utilities
│   ├── brand.ts                # Brand configuration
│   └── utils.ts                # cn() helper
│
└── types/                      # TypeScript Types
    └── index.ts                # Type definitions
```

### Key Files

| File | Purpose | Size |
|------|---------|------|
| `src/lib/brand.ts` | Brand config (colors, fonts, socials) | 2KB |
| `src/app/globals.css` | Design tokens & utilities | 13KB |
| `src/data/posts.json` | Blog posts data | 7KB |
| `src/data/tools.json` | AI tools catalog | 433KB |
| `src/data/videos.json` | Video content | 3KB |
| `src/app/page.tsx` | Homepage | 22KB |
| `src/app/admin/page.tsx` | Admin dashboard | 19KB |

---

## 🎨 Design System

### Color Tokens

```css
/* Primary Palette */
--primary: #6366f1;            /* Electric Indigo */
--primary-hover: #4f46e5;      /* Darker Indigo */
--accent: #22d3ee;             /* Neon Cyan */
--accent-glow: rgba(34, 211, 238, 0.5);

/* Status Colors */
--success: #10b981;            /* Emerald */
--warning: #f59e0b;            /* Amber */
--error: #f43f5e;              /* Rose */

/* Dark Theme (Default) */
--background: #0a0a0f;         /* Deep Black */
--card: #12121a;               /* Card Surface */
--card-hover: #1a1a24;         /* Elevated Surface */
--border: #1e1e2e;             /* Subtle Border */

/* Text */
--foreground: #ffffff;
--muted: #a1a1aa;
--muted-foreground: #71717a;
```

### CSS Utilities

```css
/* Text Effects */
.text-gradient              /* Primary → accent gradient text */
.text-shimmer               /* Animated shimmer text */

/* Glass Effects */
.glass-strong               /* Strong glassmorphism */
.glass-subtle               /* Subtle glass effect */

/* Hover Effects */
.hover-lift                 /* TranslateY -4px on hover */
.hover-glow                 /* Box shadow glow */
.hover-scale                /* Scale 1.02 on hover */

/* Card Effects */
.card-shine                 /* Moving shine effect */
.card-gradient              /* Gradient border */

/* Glow Effects */
.glow-sm                    /* Small glow ring */
.glow-md                    /* Medium glow ring */
.glow-lg                    /* Large glow ring */

/* Animation */
.animated-gradient          /* Moving gradient background */
.animate-float              /* Floating animation */
.animate-pulse-slow         /* Slow pulse */
```

### Typography

```css
/* Georgian Text */
font-family: 'Noto Sans Georgian', 'BPG Nino Mtavruli', sans-serif;

/* English/UI Text */
font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;

/* Code */
font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', monospace;
```

---

## 🔧 Component Reference

### AI Components (`/components/ai/`)

```typescript
import { 
  AIChatAssistant,        // Floating chat widget (OpenAI)
  FortuneTeller,          // Mystic fortune telling
  LoveCalculator,         // Love compatibility analysis
  DreamInterpreter,       // Dream interpretation
  Horoscope,              // Daily horoscope by zodiac
  TLDRSummary,            // Article summarization
  VoiceSearch,            // Voice input (Web Speech API)
  ArticleNarrator,        // Text-to-Speech
  SmartRecommendations    // AI content suggestions
} from '@/components/ai'
```

### Effects (`/components/effects/`)

```typescript
import { 
  TiltCard,               // 3D perspective on mouse move
  MagneticButton,         // Magnetic hover effect
  LiquidBlobBackground,   // Animated blob background
  CursorTrail,            // Mouse trail particles
  TextScramble,           // Hacker-style text animation
  ParallaxSection,        // Parallax scrolling
  PageTransition,         // Page transition wrapper
  MicroInteractions       // HoverScale, PulseGlow, FloatEffect, ClickRipple
} from '@/components/effects'
```

### Gamification (`/components/gamification/`)

```typescript
import { 
  Quiz,                   // AI personality quiz with scoring
  SpinWheel,              // Prize wheel with canvas
  Leaderboard,            // User rankings with XP
  AchievementBadge,       // Achievement badges system
  StreakCounter           // Daily streak tracker
} from '@/components/gamification'
```

### Interactive (`/components/interactive/`)

```typescript
import { 
  Comments,               // Comment system with reactions
  BookmarkButton,         // Bookmark with localStorage
  ReactionBar,            // Emoji reactions (🔥❤️🤯👏💡)
  ShareButtons,           // Social sharing
  HighlightShare,         // Text selection sharing
  ReadingProgress,        // Progress indicator
  ReadingMode,            // Focus reading mode
  TableOfContents,        // Auto-generated TOC
  SearchDialog,           // Global search (⌘K)
  InfiniteScroll,         // Infinite scroll pagination
  LiveVisitorCounter,     // Real-time visitor count
  NewsletterPopup,        // Exit-intent popup
  SocialProofToast,       // Social proof notifications
  QuoteCardGenerator,     // Quote image generator
  BeforeAfterSlider,      // Comparison slider
  ContentFilters,         // Category filtering
  Footnotes,              // Footnotes with tooltips
  EasterEgg               // Konami code and secrets
} from '@/components/interactive'
```

### UI Primitives (`/components/ui/`)

```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
```

---

## 📡 API Routes

### Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/chat` | OpenAI chat completion | API Key |
| POST | `/api/mystic/fortune` | Fortune telling | API Key |
| POST | `/api/mystic/horoscope` | Horoscope generation | API Key |
| POST | `/api/mystic/dream` | Dream interpretation | API Key |
| POST | `/api/mystic/love` | Love calculator | API Key |

### Environment Variables

```env
OPENAI_API_KEY=sk-...        # Required for all AI features
```

### Example Request

```typescript
// POST /api/chat
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'გამარჯობა, რა არის AI?' }
    ]
  })
});

const data = await response.json();
// { id: "chatcmpl-xxx", choices: [{ message: { content: "..." } }] }
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
  content?: string
  coverImage?: string
  category: 'ai-tips' | 'tutorials' | 'news' | 'tools' | 'reviews' | 'opinion'
  tags: string[]
  author: {
    name: string
    avatar: string
    role: string
  }
  publishedAt: string       // ISO date
  readingTime: number       // minutes
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

### Tool Schema

```typescript
interface AITool {
  id: number
  name: string
  description: string       // Georgian description
  url: string
  logo?: string
  category: string          // 30+ categories
  pricing: 'უფასო' | 'Freemium' | 'ფასიანი' | 'Trial'
  rating: number            // 1-5
  tags?: string[]
}
```

### Brand Configuration

```typescript
// import { brand } from '@/lib/brand'

brand.name                  // "Andrew Altair"
brand.tagline               // "AI ინოვატორი და კონტენტ კრეატორი"
brand.colors.primary        // "#6366f1"
brand.colors.accent         // "#22d3ee"
brand.categories            // Blog category config
brand.social                // Social media links
brand.reactions             // Emoji reactions config
```

---

## 🌍 Page Routes

### Public Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage - Hero, Trending, Newsletter |
| `/blog` | Blog listing with filters |
| `/blog/[slug]` | Article detail page |
| `/mystic` | Mystic AI tools hub |
| `/tools` | 1000+ AI tools catalog |
| `/features` | 50+ features showcase |
| `/videos` | Video content gallery |
| `/about` | About page |
| `/contact` | Contact form |
| `/resources` | AI learning resources |

### Admin Pages

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard with stats |
| `/admin/analytics` | Detailed analytics |
| `/admin/posts` | Post management |
| `/admin/posts/new` | Rich text editor |
| `/admin/videos` | Video management |
| `/admin/categories` | Category management |
| `/admin/tags` | Tag management |
| `/admin/comments` | Comment moderation |
| `/admin/users` | User management |
| `/admin/media` | Media library |
| `/admin/content` | Bulk actions |
| `/admin/seo` | SEO analyzer |
| `/admin/settings` | System settings |
| `/admin/tools` | System tools |

---

## 🚀 Common Tasks

### Adding a New Blog Post

1. Add entry to `src/data/posts.json`
2. Include required fields: id, slug, title, excerpt, category, author, publishedAt
3. Post automatically renders at `/blog/[slug]`

### Adding New AI Tool

1. Add entry to `src/data/tools.json`
2. Include: id, name, description (Georgian), url, category, pricing, rating
3. Tool appears in `/tools` page

### Creating New Component

1. Create `.tsx` file in appropriate `src/components/[category]/`
2. Use `"use client"` directive if client-side interactivity needed
3. Export from category's `index.ts`
4. Import with `@/components/[category]/ComponentName`

### Modifying Design Tokens

1. Edit CSS variables in `src/app/globals.css`
2. Or update `src/lib/brand.ts` for brand config
3. Use TailwindCSS classes with custom tokens

### Adding New Admin Page

1. Create folder in `src/app/admin/[page-name]/`
2. Add `page.tsx` with admin layout
3. Update navigation in admin layout

---

## ⚠️ Important Notes

### Georgian Language

- All user-facing content is in Georgian (ქართული)
- Use Georgian fonts: `Noto Sans Georgian`
- Georgian is Left-to-Right (LTR), no RTL needed
- Keep UI labels and messages in Georgian

### Performance

- Use Next.js `<Image />` for all images
- Use `"use client"` only when absolutely needed
- Heavy effects (CursorTrail, Blobs) load conditionally
- Large data (tools.json) loads with pagination

### Styling Conventions

- Use TailwindCSS utility classes first
- Custom utilities defined in `globals.css`
- Component variants via `class-variance-authority` (CVA)
- Class merging with `cn()` from `@/lib/utils`

### Type Safety

- All components are TypeScript
- Props interfaces defined per component
- Strict mode enabled in tsconfig
- No implicit any allowed

---

## 🔍 Quick Reference

### Import Patterns

```typescript
// Components
import { Component } from '@/components/category/Component'

// UI Primitives
import { Button } from '@/components/ui/button'

// Data
import postsData from '@/data/posts.json'
import toolsData from '@/data/tools.json'

// Config
import { brand } from '@/lib/brand'

// Utils
import { cn } from '@/lib/utils'

// Types
import type { Post, AITool } from '@/types'

// Icons
import { IconName } from 'lucide-react'
```

### Running Commands

```bash
npm run dev       # Dev server (localhost:3000)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint check
```

### Git Commands

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

---

## 📊 Project Statistics

| Metric | Count |
|--------|-------|
| Total Components | 70+ |
| Features | 50+ |
| Pages | 20+ |
| API Routes | 5 |
| AI Tools | 1000+ |
| Lines of Code | 25,000+ |
| Dependencies | 15 |
| Dev Dependencies | 8 |

---

## 🔗 Resources

- **Next.js Docs**: https://nextjs.org/docs
- **TailwindCSS**: https://tailwindcss.com/docs
- **Radix UI**: https://radix-ui.com
- **OpenAI API**: https://platform.openai.com/docs
- **Lucide Icons**: https://lucide.dev

---

*This document is optimized for AI agents to quickly understand and assist with the AndrewAltair.ge codebase. Last updated: December 2024.*
