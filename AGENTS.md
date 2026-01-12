# AGENTS.md - AI Agent Guidelines

> Полное руководство для AI агентов по работе с проектом Andrew Altair

---

## 🎯 Обзор проекта

**Andrew Altair** — полнофункциональная AI-платформа на Next.js 14 с:
- Мистическими AI инструментами (Groq API)
- Маркетплейсом ботов и промптов
- Энциклопедией AI (Vibe Coding курс)
- Блогом с rich content
- Админ-панелью
- Системой геймификации и конверсии

### Ключевые области

| Область | Описание |
|---------|----------|
| **Mystic AI Tools** | 8 интерактивных инструментов с Groq AI |
| **Bots Marketplace** | Маркетплейс AI ботов с tier системой |
| **Prompts Marketplace** | Продажа AI промптов |
| **Repositories** | Каталог Open Source решений |
| **Encyclopedia** | Vibe Coding образовательный курс |
| **Conversion System** | 21 компонент для конверсии пользователей |
| **Admin Panel** | 17 разделов управления контентом |
| **User Profile** | 21 фича профиля с 2FA и gamification |

---

## 🏗 Архитектура

### Framework
```
Next.js 14.2.3 (App Router)
├── Server Components (default)
├── Client Components ('use client')
├── API Routes (/api/...)
└── Middleware (src/middleware.ts)
```

### Database
```
MongoDB Atlas (Mongoose 9)
├── 48 моделей в /src/models/
├── Connection pooling через /src/lib/db.ts
└── Connection string: MONGODB_URI env var
```

### AI Integration
```
Groq API (OpenAI SDK compatible)
├── Model: llama-3.3-70b-versatile
├── Config: /src/lib/mystic-rules.ts
└── API Key: GROQ_API_KEY env var
```

### Authentication
```
JWT + bcryptjs + otplib (2FA)
├── /src/lib/auth.tsx - Client auth context
├── /src/lib/server-auth.ts - Server auth utils
├── /src/lib/admin-auth.ts - Admin protection
└── /src/lib/totp.ts - 2FA helpers
```

---

## 📁 Ключевые директории

```
src/
├── app/                        # Next.js App Router
│   ├── (legal)/               # Privacy, Terms pages
│   ├── admin/                 # 16 admin sections
│   ├── api/                   # 112+ API endpoints
│   ├── blog/                  # Blog pages
│   ├── bots/                  # Bots marketplace
│   ├── encyclopedia/          # AI Encyclopedia
│   │   └── vibe-coding/       # Vibe Coding course
│   ├── mystic/                # Mystic tools pages
│   ├── prompts/               # Prompts marketplace
│   └── profile/               # User profile
│
├── components/                 # 160+ React components
│   ├── admin/                 # Admin components
│   ├── ai/                    # AI tool components
│   ├── blog/                  # Blog components
│   ├── bots/                  # Bot components
│   ├── conversion/            # Conversion widgets
│   ├── interactive/           # Interactive elements
│   ├── mystic/                # Mystic UI
│   ├── prompt-builder/        # Prompt builder
│   ├── ui/                    # UI primitives (shadcn)
│   └── vibe-coding/           # Vibe Coding components
│
├── models/                     # 48 MongoDB schemas
├── features/profile/           # 21 profile components
├── lib/                        # 17 utility files
├── data/                       # 13 JSON/TS data files
├── hooks/                      # 5 custom hooks
└── types/                      # TypeScript types
```

---

## 🔧 Правила разработки

### API Routes

```typescript
// Стандартный паттерн API route
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ModelName from '@/models/ModelName';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';

// GET - Public endpoint
export async function GET(request: Request) {
    try {
        await dbConnect();
        
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        
        const items = await ModelName.find({})
            .limit(limit)
            .lean();
        
        return NextResponse.json({ success: true, data: items });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch data' },
            { status: 500 }
        );
    }
}

// POST - Protected endpoint
export async function POST(request: Request) {
    // 🛡️ Admin protection
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }
    
    try {
        await dbConnect();
        const data = await request.json();
        
        const item = new ModelName(data);
        await item.save();
        
        return NextResponse.json({ success: true, data: item });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create' },
            { status: 500 }
        );
    }
}
```

**Правила:**
- Всегда вызывай `dbConnect()` перед DB операциями
- Используй `try/catch` с proper error handling
- Добавляй `verifyAdmin()` для protected endpoints
- Возвращай JSON с `success` или `error` полями
- Логируй ошибки с `console.error()`

### Components

```tsx
'use client' // ОБЯЗАТЕЛЬНО для интерактивных компонентов

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface ComponentProps {
    title: string;
    onAction?: () => void;
}

export function MyComponent({ title, onAction }: ComponentProps) {
    const [loading, setLoading] = useState(false);
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                <CardHeader>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {title}
                    </h3>
                </CardHeader>
                <CardContent>
                    <Button 
                        onClick={onAction}
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl"
                    >
                        Action
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}
```

**Правила:**
- `"use client"` ОБЯЗАТЕЛЬНО для интерактивных компонентов
- Импортируй UI из `@/components/ui/`
- Используй Tailwind с dark theme классами
- Framer Motion для анимаций
- TypeScript interfaces для props
- Грузинский текст для mystic UI

### Models

```typescript
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IModelName extends Document {
    _id: mongoose.Types.ObjectId;
    field1: string;
    field2: number;
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}

const ModelSchema = new Schema<IModelName>(
    {
        field1: {
            type: String,
            required: [true, 'Field1 is required'],
            trim: true,
        },
        field2: {
            type: Number,
            default: 0,
            min: 0,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Text index for search
ModelSchema.index({ field1: 'text' });

const ModelName: Model<IModelName> = 
    mongoose.models.ModelName || 
    mongoose.model<IModelName>('ModelName', ModelSchema);

export default ModelName;
```

**Правила:**
- Включай `timestamps: true` в опциях
- Export interface с `I` prefix
- Используй `mongoose.models.X || mongoose.model()` паттерн
- Добавляй text indexes для searchable полей
- Используй enum для ограниченных значений

---

## 📊 Основные модели

### User Model
```typescript
interface IUser {
    _id: ObjectId;
    username: string;          // unique
    email: string;             // unique, lowercase
    password: string;          // hashed, select: false
    fullName: string;
    bio?: string;
    avatar?: string;
    coverImage?: string;
    role: 'god' | 'admin' | 'editor' | 'viewer' | 'subscriber';
    badge?: string;
    isBlocked: boolean;
    twoFactorEnabled: boolean;
    twoFactorSecret?: string;  // select: false
    lastLogin?: Date;
    credits: number;
    mysteryBox: { lastClaimedAt?: Date; streak: number };
    gamification: {
        xp: number;
        level: number;
        streak: number;
        completedQuests: string[];
        completedLessons: string[];
        unlockedSkills: string[];
    };
    newsletterSubscribed: boolean;
}
```

### Post Model
```typescript
interface IPost {
    _id: ObjectId;
    slug: string;              // unique
    numericId: string;         // unique, sparse
    title: string;
    excerpt: string;
    content?: string;
    rawContent?: string;
    coverImage?: string;
    coverImages?: { horizontal?: string; vertical?: string };
    gallery?: Array<{ src: string; alt?: string; caption?: string }>;
    sections?: Array<{ 
        icon?: string; 
        title?: string; 
        content: string; 
        type: 'intro' | 'section' | 'sarcasm' | 'warning' | 'tip' | 'fact' | 'opinion' | 'cta' | 'hashtags' | 'prompt' | 'author-comment';
    }>;
    category: string;
    tags: string[];
    author: { name: string; avatar?: string; role?: string };
    publishedAt: Date;
    readingTime: number;
    views: number;
    reactions: { fire, love, mindblown, applause, insightful };
    featured: boolean;
    trending: boolean;
    status: 'draft' | 'published' | 'scheduled' | 'archived';
    seo?: { metaTitle, metaDescription, keywords, canonicalUrl, focusKeyword, seoScore, ogImage };
    videos?: Array<{ url, platform, videoId, thumbnailUrl }>;
    repository?: {
        type: 'github' | 'gitlab' | 'other';
        url: string;
        name: string;
        description: string;
        stars: number;
        forks: number;
        language: string;
        topics: string[];
        license: string;
    };
}
```

### Bot Model
```typescript
interface IBot {
    _id: ObjectId;
    name: string;              // unique
    codename: string;
    version: string;
    description: string;
    shortDescription: string;
    category: 'content' | 'mystic' | 'business' | 'creative' | 'translation';
    tier: 'free' | 'premium' | 'private';
    price?: number;
    icon: string;
    color: string;
    features: string[];
    masterPrompt: string;
    rating: number;
    downloads: number;
    likes: number;
    isRecentlyAdded: boolean;
    isFeatured: boolean;
    isActive: boolean;
    creator?: { name, avatar, bio, verified, totalSales, rating };
    guarantees?: { moneyBack, freeUpdates, support, warranty };
    stats?: { avgRating, totalReviews, successRate, completionRate, repeatPurchase };
    updates?: { lastUpdated, changelog, roadmap };
}
```

### MarketplacePrompt Model
```typescript
interface IMarketplacePrompt {
    _id: ObjectId;
    slug: string;              // unique
    title: string;
    description: string;
    excerpt?: string;
    price: number;
    currency: 'GEL' | 'USD';
    originalPrice?: number;
    isFree: boolean;
    promptTemplate: string;    // with [VARIABLES]
    variables: Array<{ name, description?, options?, required }>;
    instructions: string;
    aiModel: string;
    aiModelVersion?: string;
    generationType: 'text-to-image' | 'text-to-text' | 'image-to-image' | 'text-to-video';
    coverImage: string;
    exampleImages: Array<{ src, alt?, promptUsed? }>;
    category: string;
    tags: string[];
    authorId?: ObjectId;
    authorName: string;
    views: number;
    purchases: number;
    rating: number;
    reviewsCount: number;
    status: 'draft' | 'published' | 'archived';
    featuredOrder?: number;
    metaTitle?: string;
    metaDescription?: string;
}
```

---

## 🔑 Ключевые API Endpoints

### Auth
```
POST /api/auth/login      - Login with rate limiting
POST /api/auth/register   - Register new user
GET  /api/auth/me         - Get current user
POST /api/auth/2fa        - 2FA management
```

### Mystic
```
POST /api/mystic/fortune     - Fortune telling
POST /api/mystic/tarot       - Tarot reading
POST /api/mystic/love        - Love compatibility
POST /api/mystic/dream       - Dream interpretation
POST /api/mystic/horoscope   - Horoscope
POST /api/mystic/numerology  - Numerology
POST /api/mystic/chat        - Mystic AI chat
GET  /api/mystic/history     - History
```

### CRUD Pattern
Все CRUD API следуют паттерну:
```
GET    /api/{resource}        - List all
POST   /api/{resource}        - Create new
GET    /api/{resource}/[id]   - Get one
PUT    /api/{resource}/[id]   - Update
DELETE /api/{resource}/[id]   - Delete
```

Resources: posts, comments, users, bots, marketplace-prompts, media, folders, categories, tags, etc.

---

## 🌐 Языки

### Грузинский (ქართული) — для мистики UI
```
გადალი = Fortune Telling
ტაროტი = Tarot
ჰოროსკოპი = Horoscope
წინასწარმეტყველება = Prediction
ბეჯი = Badge
სიყვარული = Love
სიზმრები = Dreams
ნუმეროლოგია = Numerology
მთვარე = Moon
```

### Русский — для документации и админки

---

## 🎨 Дизайн-система

### Colors
```css
/* Backgrounds */
--bg-primary: #0a0a12;
--bg-secondary: #12121a;

/* Gradients */
--purple: from-purple-600 to-violet-600;
--pink: from-pink-600 to-rose-600;
--gold: from-amber-500 to-yellow-500;
--blue: from-blue-600 to-cyan-600;
```

### Component Patterns
```jsx
// Card
className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"

// Button Primary
className="rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500"

// Glass effect
className="bg-white/5 backdrop-blur-sm border border-white/10"

// Gradient text
className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
```

### Spacing
```
Rounded: rounded-2xl sm:rounded-3xl
Gap: gap-4 sm:gap-6 lg:gap-8
Padding: p-4 sm:p-6 lg:p-8
```

---

## ⚠️ Частые проблемы и решения

### MongoDB Connection
```typescript
// ❌ НЕПРАВИЛЬНО - нет dbConnect
const users = await User.find({});

// ✅ ПРАВИЛЬНО
await dbConnect();
const users = await User.find({});
```

### Client/Server Mismatch
```typescript
// ❌ НЕПРАВИЛЬНО - импорт mongoose в client
import mongoose from 'mongoose';  // В client component

// ✅ ПРАВИЛЬНО - через API route
const res = await fetch('/api/users');
```

### Missing 'use client'
```typescript
// ❌ НЕПРАВИЛЬНО - useState без 'use client'
import { useState } from 'react';
export function Component() {
    const [state, setState] = useState('');
}

// ✅ ПРАВИЛЬНО
'use client';
import { useState } from 'react';
export function Component() {
    const [state, setState] = useState('');
}
```

### Environment Variables
```bash
# ❌ НЕПРАВИЛЬНО - undefined
process.env.GROQ_API_KEY  # undefined if not set

# ✅ ПРАВИЛЬНО - check .env.local
# Required vars:
MONGODB_URI=mongodb+srv://...
GROQ_API_KEY=gsk_...
JWT_SECRET=...
ADMIN_PASSWORD=...
```

---

## 🧪 Тестирование

### Dev Server
```bash
npm run dev
# http://localhost:3000
```

### Unit Tests
```bash
npm run test           # Run tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

### API Testing (cURL)
```bash
# Auth
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Mystic Fortune
curl -X POST http://localhost:3000/api/mystic/fortune \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","birthDate":"1990-01-01"}'

# Get Posts
curl "http://localhost:3000/api/posts?status=published&limit=5"
```

---

## 📝 Development Checklist

- [ ] Вызвал `dbConnect()` перед DB операциями
- [ ] Добавил proper error handling (try/catch)
- [ ] Использовал TypeScript interfaces
- [ ] Добавил `"use client"` если интерактивный
- [ ] Использовал компоненты из `@/components/ui/`
- [ ] Добавил `verifyAdmin()` для protected endpoints
- [ ] Протестировал API endpoints
- [ ] Проверил responsive design
- [ ] Обновил документацию если добавил фичи

---

## 🤝 Contribution Guidelines

1. Следуй существующему code style
2. Используй TypeScript strict mode
3. Добавляй proper type definitions
4. Тестируй API endpoints
5. Документируй новые фичи
6. Используй conventional commits

---

## 📚 Ресурсы

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Groq API](https://console.groq.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Zod Validation](https://zod.dev/)
