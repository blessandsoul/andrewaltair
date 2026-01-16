# 🔮 Andrew Altair Platform

> **The Next-Gen AI Mystic & Educational Ecosystem**
> *AI-Powered Tarot, Marketplace, Encyclopedia, and Gamified Profile System.*

![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Groq AI](https://img.shields.io/badge/AI-Groq_Llama_3-orange?style=for-the-badge&logo=openai)

---

## 🚀 Навигация для Разработчиков и AI

Если вы разработчик или AI-агент, начните отсюда:

*   **[📂 API_AGENTS.md](./API_AGENTS.md)** — **SYSTEM CORE & ARCHITECTURE**. (Required reading for AI). Глубокое описание архитектуры, бизнес-логики и скрытых механик.
*   **[📡 API.md](./API.md)** — Полная документация всех 120+ REST API эндпоинтов.
*   **[🤖 AGENTS.md](./AGENTS.md)** — Гайдлайны по код-стайлу, структуре компонентов и лучшим практикам.

---

## 🌌 О Платформе

**Andrew Altair** — это не просто сайт, это экосистема, объединяющая мистику и технологии.

### Ключевые Модули:

1.  **🔮 Mystic Tools**: 8 уникальных AI-инструментов (Таро, Гадание, Сны), работающих на базе Groq Llama 3. Полностью локализованы на грузинский язык.
2.  **🎓 Vibe Coding Encyclopedia**: Огромный образовательный курс по программированию и AI.
3.  **🤖 Bots & Prompts Marketplace**: Полноценный e-commerce движок для продажи цифровых AI-товаров (Промпты, Боты).
4.  **👤 Super Profile**: Геймифицированный профиль пользователя (XP, Levels, Streaks, Badges, 2FA).
5.  **⚡ Admin Neural Center**: Мощная админ-панель для управления всем контентом и аналитикой.

---

## 🛠 Технологический Стек

| Уровень | Технологии |
| :--- | :--- |
| **Frontend** | **Next.js 14 (App Router)**, React 18, Tailwind CSS 4, Framer Motion, shadcn/ui |
| **Backend** | Next.js API Routes, **Groq SDK** (Llama 3.3 70B), Nodemailer |
| **Database** | **MongoDB Atlas**, Mongoose 9 (Schemas, Validation, Hooks) |
| **Auth** | JWT, bcryptjs, **otplib (2FA TOTP)**, NextAuth-like custom implementation |
| **DevOps** | Docker, Vercel/VPS, CI/CD pipelines |

---

## ⚡ Быстрый Старт

### 1. Клонирование
```bash
git clone https://github.com/blessandsoul/andrewaltair.git
cd andrewaltair
```

### 2. Установка Зависимостей
```bash
npm install
```

### 3. Настройка Окружения
Создайте файл `.env.local` в корне проекта:
```env
# Database
MONGODB_URI=mongodb+srv://...

# AI Brain
GROQ_API_KEY=gsk_...

# Security
JWT_SECRET=super_secret_key_32_chars
NEXTAUTH_SECRET=another_secret_key
NEXTAUTH_URL=http://localhost:3000

# Admin Access
ADMIN_PASSWORD=your_admin_password
```

### 4. Запуск
```bash
npm run dev
```
Откройте [http://localhost:3000](http://localhost:3000).

---

## 📂 Структура Проекта (High-Level)

Подробный разбор см. в `API_AGENTS.md`.

*   `/src/app` — Страницы и API роуты.
*   `/src/components` — Reusable UI компоненты (Atom/Molecule pattern).
*   `/src/models` — Схемы данных MongoDB (Single Source of Truth).
*   `/src/lib` — Утилиты, аутентификация, подключение к БД.
*   `/public` — Статические ассеты.

---

## 🛡 Безопасность

*   **Middleware**: Защита админских роутов.
*   **Validation**: Zod схемы на всех входах API.
*   **Sanitization**: MongoDB query sanitization.
*   **Rate Limiting**: Защита от брутфорса на логине.

---

## 🤝 Контрибьютинг

Мы приветствуем Pull Requests! Пожалуйста, следуйте стилю кода, описанному в `AGENTS.md`. Перед коммитом убедитесь, что `npm run build` проходит без ошибок.

---

<div align="center">

**Built with 💜 by Andrew Altair Team**
*2024-2026*

</div>
