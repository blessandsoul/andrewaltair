# AGENTS.md - AI Agent Guidelines

> Полное руководство для AI агентов по работе с проектом Andrew Altair

---

## 🎯 Обзор проекта

**Andrew Altair** — полнофункциональная AI-платформа на Next.js 14 с мистическими инструментами, блогом, админ-панелью и системой конверсии.

### Ключевые области

| Область | Описание |
|---------|----------|
| **Mystic AI Tools** | 8 интерактивных инструментов с Groq AI |
| **Conversion System** | 20 компонентов для конверсии пользователей |
| **Admin Panel** | 12 разделов управления контентом |
| **User Profile** | 18 фичей профиля с 2FA |
| **Gamification** | Badges, streaks, leaderboards |

---

## 🏗 Архитектура

### Framework
- **Next.js 14** с App Router
- Server Components для оптимизации
- API Routes для бэкенда

### Database
- **MongoDB Atlas** через Mongoose 9
- Connection pooling в serverless
- Модели в `/src/models/`

### AI Integration
- **Groq API** с OpenAI SDK совместимостью
- Model: `llama-3.3-70b-versatile`
- Грузинские промпты для мистики

### Authentication
- **JWT** tokens с bcryptjs
- **2FA** через otplib (TOTP)
- Session management с force logout

---

## 📁 Ключевые директории

```
src/
├── app/
│   ├── (pages)/           # 14 публичных страниц
│   ├── admin/             # 12 админ разделов
│   └── api/               # 31 категория API (66+ маршрутов)
│
├── components/
│   ├── ai/                # 11 AI компонентов
│   ├── conversion/        # 20 conversion компонентов
│   ├── mystic/            # 19 UI мистики
│   ├── engagement/        # 7 вовлечение
│   ├── interactive/       # 8 интерактив
│   ├── layout/            # 5 лейаут
│   ├── ui/                # 13 примитивов
│   ├── admin/             # 4 админ
│   ├── blog/              # 5 блог
│   └── effects/           # 3 эффекта
│
├── models/                # 31 MongoDB схема
├── features/profile/      # 18 profile компонентов
├── lib/                   # 8 утилит
├── data/                  # 6 JSON файлов
├── types/                 # TypeScript типы
└── hooks/                 # Custom hooks
```

---

## 🔧 Правила разработки

### API Routes

```typescript
// Всегда используй:
import dbConnect from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    await dbConnect()
    // ... логика
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: 'Message' }, { status: 500 })
  }
}
```

**Правила:**
- Вызывай `dbConnect()` перед любыми DB операциями
- Возвращай JSON с proper error handling
- Включай fallback для AI failures
- Используй `process.env.GROQ_API_KEY` для AI

### Components

```tsx
'use client' // для интерактивных компонентов

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
```

**Правила:**
- Используй `"use client"` для интерактивных
- Импортируй UI из `@/components/ui/`
- Tailwind CSS с custom dark theme
- Грузинский для мистики UI

### Models

```typescript
import mongoose from 'mongoose'

const Schema = new mongoose.Schema({
  // ... fields
}, { timestamps: true })

// ВАЖНО: Re-export types
export type { IModel }
export default mongoose.models.Model || mongoose.model('Model', Schema)
```

**Правила:**
- Включай timestamps в схемы
- Re-export types для client use
- Используй `isolatedModules` совместимость

---

## 📊 Модели данных (31)

### Core Models
| Model | Описание | Ключевые поля |
|-------|----------|---------------|
| `User` | Пользователи | email, password, role, twoFactorEnabled, socialAccounts |
| `Session` | Сессии | userId, token, ip, userAgent, expiresAt |
| `Post` | Публикации | title, slug, content, author, status, views |
| `Video` | Видео | title, url, thumbnail, duration |
| `Comment` | Комментарии | postId, userId, content, status |

### Mystic Models
| Model | Описание |
|-------|----------|
| `MysticHistory` | История предсказаний с sessionId |
| `MysticProfile` | Профили: zodiac, birthDate, premium |
| `MysticAchievement` | Badges, streaks, stats |
| `MysticGift` | Gift tokens |

### Conversion Models
| Model | Описание |
|-------|----------|
| `Deal` | Предложения с таймерами |
| `Lesson` | Микро-уроки |
| `Quest` | Квесты пользователей |
| `Challenge` | Живые челленджи |
| `Booking` | Бронирования консультаций |
| `Testimonial` | Отзывы |

### System Models
| Model | Описание |
|-------|----------|
| `Settings` | Глобальные настройки |
| `Seo` | SEO для страниц |
| `Notification` | Уведомления |
| `Task` | Задачи админа |
| `Backup` | Бэкапы |
| `CronJob` | Cron задачи |
| `ErrorLog` | Лог ошибок |

---

## 🔑 API Endpoints Reference

### Auth (`/api/auth/`)
| Method | Endpoint | Описание |
|--------|----------|----------|
| POST | `/login` | Логин |
| POST | `/register` | Регистрация |
| GET | `/me` | Текущий юзер |
| POST | `/logout` | Логаут |

### Mystic (`/api/mystic/`)
| Method | Endpoint | Описание |
|--------|----------|----------|
| POST | `/fortune` | Гадание |
| POST | `/tarot` | Таро расклад |
| POST | `/numerology` | Нумерология |
| POST | `/chat` | AI чат |
| GET/POST/DELETE | `/history` | История |

### Conversion (`/api/conversion/`)
| Method | Endpoint | Описание |
|--------|----------|----------|
| GET/POST | `/lessons` | Микро-уроки |
| GET/POST | `/deals` | Предложения |
| GET/POST | `/quests` | Квесты |
| GET/POST | `/challenges` | Челленджи |
| GET/POST | `/bookings` | Бронирования |
| GET/POST | `/testimonials` | Отзывы |

### CRUD APIs
Все CRUD API следуют паттерну:
- `GET /api/{resource}` — список
- `POST /api/{resource}` — создание
- `GET /api/{resource}/[id]` — один item
- `PUT /api/{resource}/[id]` — обновление
- `DELETE /api/{resource}/[id]` — удаление

---

## 🌐 Языки

### Грузинский (ქართული) — для мистики

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

### Русский — для админки и документации

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
```

### Components
```jsx
// Card
className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"

// Button
className="rounded-xl bg-gradient-to-r from-purple-600 to-violet-600"

// Glass effect
className="bg-white/5 backdrop-blur-sm border border-white/10"
```

### Spacing
- Rounded: `rounded-2xl sm:rounded-3xl`
- Gap: `gap-4 sm:gap-6 lg:gap-8`
- Padding: `p-4 sm:p-6 lg:p-8`

---

## ⚠️ Частые проблемы

### "Missing credentials" Error
```bash
# Проверь .env.local
GROQ_API_KEY=gsk_...
```

### MongoDB Connection
```bash
# Проверь IP whitelist в Atlas
# Проверь MONGODB_URI
```

### Client/Server Mismatch
```typescript
// НЕ импортируй Mongoose напрямую в client!
// Используй /lib/ утилиты
```

### 2FA Issues
```typescript
// Проверь что otplib правильно настроен
import { authenticator } from 'otplib'
```

---

## 🧪 Тестирование

### Dev Server
```bash
npm run dev
# http://localhost:3000
```

### Seed Database
```bash
npm run seed
```

### API Testing
```bash
# Auth
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Mystic
curl -X POST http://localhost:3000/api/mystic/fortune \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","birthDate":"1990-01-01"}'
```

---

## 📝 Чек-лист для разработки

- [ ] Вызвал `dbConnect()` перед DB операциями
- [ ] Добавил proper error handling
- [ ] Использовал TypeScript types
- [ ] Добавил `"use client"` если интерактивный
- [ ] Использовал компоненты из `@/components/ui/`
- [ ] Протестировал API endpoints
- [ ] Обновил README если добавил фичи

---

## 🤝 Вклад в проект

1. Следуй существующему code style
2. Используй TypeScript strict mode
3. Добавляй proper type definitions
4. Тестируй API endpoints
5. Обновляй документацию

---

## 📚 Дополнительные ресурсы

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Groq API](https://console.groq.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
