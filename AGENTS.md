# AGENTS.md - AI Agent Instructions

This document provides instructions for AI agents working with this codebase.

## Project Overview

**Andrew Altair** is a Next.js 16 AI platform in Georgian language featuring:
- 1000+ AI tools catalog
- AI-powered mystic features (fortune, horoscope, dreams, love calculator)
- Gamification (quizzes, leaderboard, achievements, spin wheel)
- 110+ React components across 7 categories
- Admin panel with full CMS capabilities

## Tech Stack

```
Framework:    Next.js 16.1.1 (App Router, Turbopack)
Language:     TypeScript 5 (Strict Mode)
Styling:      TailwindCSS 4 + CSS Variables
UI Library:   Radix UI + Shadcn/ui components
AI:           OpenAI SDK 6.15 (GPT-4, DALL-E 3)
Data:         JSON files + LocalStorage
```

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin panel (12 subpages)
│   ├── blog/               # Blog with dynamic [slug]
│   ├── tools/              # AI tools catalog
│   ├── mystic/             # Mystic AI features
│   ├── features/           # All features showcase (113+)
│   ├── new-features/       # New conversion features demo
│   └── api/                # API routes (chat, mystic)
│
├── components/
│   ├── ai/                 # AI components (9): Chat, Fortune, Horoscope, etc.
│   ├── effects/            # Visual effects (8): TiltCard, MagneticButton, etc.
│   ├── gamification/       # Game elements (5): Quiz, SpinWheel, etc.
│   ├── interactive/        # Interactive (18): Comments, Bookmarks, etc.
│   ├── engagement/         # Engagement (29): NFT, Forum, Workspace, etc.
│   ├── conversion/         # Conversion (20): MysteryBox, SkillTree, etc. [NEW]
│   ├── layout/             # Header, Footer, Navigation
│   └── ui/                 # Shadcn UI primitives
│
├── data/
│   ├── tools.json          # 1000+ AI tools (433KB)
│   ├── posts.json          # Blog articles
│   └── videos.json         # Video content
│
└── lib/
    ├── utils.ts            # Helper functions
    └── brand.ts            # Brand configuration
```

## Component Categories

### Conversion Components (20) - Priority for Updates
Located in `src/components/conversion/`:

| Component | Purpose |
|-----------|---------|
| MysteryBox | Daily reward box with 24h cooldown |
| LimitedTimeDeals | Countdown timer offers |
| MicroLessons | 2-minute AI lessons |
| AICompanionMascot | Chat assistant mascot |
| SavingsCalculator | ROI calculator |
| AIHealthScore | AI readiness quiz |
| PromptPlayground | Prompt testing sandbox |
| CaseStudyBuilder | Industry case generator |
| AIQuestJourney | Learning quests with XP |
| SkillTree | Visual skill progression |
| SeasonPass | Seasonal rewards tiers |
| LiveChallenges | Real-time competitions |
| AIBuddyMatching | Partner finder for learning |
| ExpertOfficeHours | Consultation booking |
| ProofWall | Client results showcase |
| SmartRecommendations | AI-powered suggestions |
| AIReadinessAssessment | Company readiness test |
| ImplementationRoadmap | AI implementation plan |
| AINewsCurator | Personalized news feed |
| ProgressSnapshot | Weekly progress summary |

## Coding Standards

### Component Pattern
```tsx
'use client';

import React, { useState, useEffect } from 'react';

interface Props {
  // Define props
}

export default function ComponentName({ prop }: Props) {
  const [state, setState] = useState<Type>(initial);

  useEffect(() => {
    // Load from localStorage if needed
    const saved = localStorage.getItem('key');
    if (saved) setState(JSON.parse(saved));
  }, []);

  return (
    <section style={{ padding: '80px 20px' }}>
      {/* Component content */}
    </section>
  );
}
```

### Styling Approach
- Use inline styles for component-specific styling
- Use Tailwind classes for layout and common utilities
- Use CSS variables from globals.css for colors
- Add gradient backgrounds: `linear-gradient(135deg, #color1, #color2)`
- Add hover effects with transition: `transition: 'all 0.3s'`

### State Management
- Use React useState/useEffect for local state
- Use localStorage for persistence (bookmarks, progress, etc.)
- No external state management library

### API Pattern
```tsx
// src/app/api/endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  const data = await request.json();
  // Process with OpenAI
  return NextResponse.json({ result });
}
```

## Key Pages

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Hero, trending posts, newsletter |
| Features | `/features` | All 113+ features catalog |
| New Features | `/new-features` | 20 conversion components demo |
| Mystic | `/mystic` | Fortune, horoscope, dreams, love |
| Tools | `/tools` | 1000+ AI tools directory |
| Admin | `/admin` | Full CMS dashboard |

## Common Tasks

### Adding a New Conversion Component
1. Create file in `src/components/conversion/NewComponent.tsx`
2. Add to `src/components/conversion/index.ts`
3. Add to features page array in `src/app/features/page.tsx`
4. Add demo in `src/app/new-features/page.tsx`

### Updating Feature Counts
- Features page: `src/app/features/page.tsx`
- README badges: `README.md`
- This file: `AGENTS.md`

## Environment Variables

```env
OPENAI_API_KEY=sk-...    # Required for AI features
```

## Running the Project

```bash
npm install
npm run dev              # Development with Turbopack
npm run build            # Production build
npm run start            # Production server
```

---

Last updated: December 2024
Components: 110+ | Features: 113+ | AI Tools: 1000+
