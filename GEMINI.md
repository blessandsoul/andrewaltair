# 🔮 Andrew Altair Platform - Context & Guidelines

## 1. Project Overview
**Andrew Altair** is a comprehensive AI platform built with Next.js 14, featuring mystical AI tools, a marketplace for bots and prompts, an educational AI encyclopedia (Vibe Coding), and a robust user profile system with gamification.

The platform combines modern web technologies with AI integrations (Groq API) to deliver interactive experiences like Tarot reading, dream interpretation, and AI-powered chat, alongside e-commerce functionality for AI assets.

## 2. Tech Stack

| Category | Technologies |
|----------|--------------|
| **Framework** | Next.js 14.2.3 (App Router) |
| **Language** | TypeScript 5.0 |
| **Database** | MongoDB Atlas + Mongoose 9 |
| **AI Provider** | Groq API (Llama 3.3 70B) |
| **Styling** | Tailwind CSS 4, shadcn/ui, Framer Motion |
| **Auth** | NextAuth (JWT), bcryptjs, otplib (2FA) |
| **Email** | Nodemailer |
| **Validation** | Zod 4 |
| **State** | React Hooks, nuqs (URL state) |
| **Deployment** | Docker, VPS |

## 3. Project Structure

```
andrewaltair/
├── src/
│   ├── app/                    # Next.js App Router (Pages & API)
│   │   ├── (legal)/            # Privacy, Terms
│   │   ├── admin/              # Admin Panel (16+ sections)
│   │   ├── api/                # API Routes (backend logic)
│   │   ├── mystic/             # Mystic Tools (Tarot, Fortune, etc.)
│   │   ├── bots/               # Bots Marketplace
│   │   ├── encyclopedia/       # Vibe Coding Course
│   │   └── profile/            # User Profile & Settings
│   │
│   ├── components/             # React Components
│   │   ├── ui/                 # Reusable UI primitives (shadcn)
│   │   ├── mystic/             # Thematic UI for mystic tools
│   │   ├── admin/              # Admin-specific components
│   │   └── interactive/        # Complex interactive elements
│   │
│   ├── models/                 # Mongoose Schemas (User, Post, Bot, etc.)
│   ├── lib/                    # Utilities (dbConnect, auth, helpers)
│   ├── hooks/                  # Custom React Hooks
│   ├── types/                  # TypeScript Definitions
│   └── data/                   # Static Data & Seeds
│
├── public/                     # Static Assets (images, icons)
├── scripts/                    # Maintenance & Seed scripts
└── AGENTS.md                   # Specific guidelines for AI Agents
```

## 4. Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests (Vitest) |
| `npm run seed` | Seed database with initial data |
| `docker-compose up -d` | Start application via Docker |

## 5. Architecture & Patterns

### Database Connection
**Crucial:** Always ensure a database connection is established before performing any DB operations in API routes.
```typescript
import dbConnect from '@/lib/db';

export async function GET() {
  await dbConnect(); // MUST be called
  // ... DB operations
}
```

### API Routes
Follow the standard pattern for API handlers, including error handling and admin verification where necessary.
```typescript
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyAdmin } from '@/lib/admin-auth';

export async function POST(req: Request) {
  if (!verifyAdmin(req)) { // Protected route example
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await dbConnect();
    const data = await req.json();
    // ... logic
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

### Components ("use client")
Any component using hooks (`useState`, `useEffect`, `useRouter`, etc.) or event listeners **must** have `'use client'` at the top.
```typescript
'use client';

import { useState } from 'react';
// ...
```

### Authentication
*   **Client:** `useSession` from `next-auth/react`.
*   **Server:** Helper functions in `src/lib/server-auth.ts`.
*   **Protection:** `verifyAdmin` middleware-like function for API routes.
*   **2FA:** Implemented using `otplib` and stored in `User` model.

## 6. ⚠️ CRITICAL: Shadow Ban Prevention (კონტენტის წესები)

**ეს წესი სავალდებულოა ყველა სოციალური მედიის პოსტისთვის (Facebook, Instagram, TikTok, YouTube).**

### 🚫 აკრძალული სიტყვები/თემები (იწვევს Shadow Ban-ს):

| კატეგორია | აკრძალული სიტყვები | ალტერნატივა |
|-----------|---------------------|-------------|
| **სიკვდილი** | სუიციდი, თვითმკვლელობა, ევთანაზია | "თვითგანადგურება", "მედიკამენტური გასვლა", "ს*იც*დი" |
| **ძალადობა** | მკვლელობა, სისხლი, წამება, ტერორი | "განადგურება", "კონფლიქტი", ემოჯი 💀☠️ |
| **იარაღი** | თოფი, იარაღი, ბომბი, აფეთქება | "მოწყობილობა", "ინსტრუმენტი" |
| **ნარკოტიკები** | დრაგი, ნარკოტიკი, კოკაინი, ჰეროინი | "ნივთიერება", "სუბსტანცია" |
| **სექსუალური** | შიშველი, პორნო, სექსი, NSFW | "გაშიშვლება" → "დეკლოთინგ", emojis |
| **პოლიტიკური** | ფაშიზმი, ნაცი, გენოციდი | კონტექსტუალური შემცვლელები |

### ✅ სავალდებულო პროტოკოლი:

1. **გამოქვეყნებამდე** - შეამოწმე ტექსტი/სკრიპტი აკრძალულ სიტყვებზე
2. **გაფრთხილება** - თუ თემა რისკიანია, მომხმარებელს აცნობე ᲛᲐᲜᲐᲛ, სანამ კონტენტს შექმნი
3. **ენკოდინგი** - რისკიანი სიტყვები ჩაანაცვლე ალტერნატივებით ან გამოიყენე სპეცსიმბოლოები (*, emojis)
4. **გამოქვეყნების დრო** - მგრძნობიარე კონტენტი არ გამოაქვეყნო გვიან ღამით (დაბალი reach + მაღალი მოდერაცია)

> **⚠️ CRITICAL:** არასოდეს შექმნა კონტენტი რომელმაც შეიძლება Shadow Ban მიიღოს მომხმარებლის გაფრთხილების გარეშე!

---

## 7. Development Guidelines (Do's & Don'ts)

*   **DO** use `dbConnect()` in every API route.
*   **DO** strictly adhere to TypeScript types (`interface` over `type` for models).
*   **DO** use Tailwind CSS for styling with the project's dark theme palette.
*   **DO** use the `src/components/ui` primitives for consistency.
*   **DON'T** import Mongoose models in Client Components. Use API routes instead.
*   **DON'T** expose sensitive environment variables (API keys, secrets) to the client.

## 8. Key Features Context

*   **Mystic Tools:** 8 distinct tools (Tarot, Fortune Teller, etc.) localized in **Georgian** (`ka`) for the UI, powered by AI prompts.
*   **Marketplace:** Supports buying/selling of "Bots" and "Prompts" with currency handling (GEL/USD).
*   **Gamification:** extensive system with XP, Levels, Streaks, and 16 distinct Badges (e.g., `zodiac_explorer`, `tarot_master`).
*   **Encyclopedia:** A structured learning module ("Vibe Coding") with progress tracking.

## 8. Environment Variables
Ensure `.env.local` contains:
*   `MONGODB_URI`
*   `GROQ_API_KEY`
*   `JWT_SECRET`
*   `NEXTAUTH_SECRET`
*   `NEXTAUTH_URL`
