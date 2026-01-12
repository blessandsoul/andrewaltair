# 📡 API Documentation

> **Полная документация всех API endpoints проекта Andrew Altair**

---

## 📋 Оглавление

- [Аутентификация](#-аутентификация)
- [Мистические API](#-мистические-api)
- [Посты](#-посты)
- [Комментарии](#-комментарии)
- [Пользователи](#-пользователи)
- [Боты](#-боты)
- [Маркетплейс промптов](#-маркетплейс-промптов)
- [Конверсия](#-конверсия)
- [Медиа](#-медиа)
- [Категории и теги](#-категории-и-теги)
- [Аналитика](#-аналитика)
- [Системные API](#-системные-api)
- [Admin API](#-admin-api)

---

## 🔐 Аутентификация

### POST `/api/auth/login`
Авторизация пользователя.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "user@example.com",
    "fullName": "Full Name",
    "avatar": "/avatar.jpg",
    "role": "viewer",
    "badge": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

**Error Responses:**
- `400` - Email и пароль обязательны
- `401` - Неверные учетные данные
- `403` - Аккаунт заблокирован
- `429` - Rate limit (5 попыток / 15 мин lockout)

**Rate Limiting:**
- Max 5 попыток с одного IP
- Lockout: 15 минут
- Response включает `lockoutRemaining` в секундах

---

### POST `/api/auth/register`
Регистрация нового пользователя.

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "fullName": "New User"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": { ... },
  "token": "jwt_token_here"
}
```

---

### GET `/api/auth/me`
Получить текущего пользователя по JWT токену.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "email",
    "fullName": "Full Name",
    "avatar": "/avatar.jpg",
    "role": "viewer",
    "gamification": {
      "xp": 100,
      "level": 2,
      "streak": 5,
      "completedQuests": [],
      "completedLessons": [],
      "unlockedSkills": ["prompt-basics"]
    }
  }
}
```

---

### POST `/api/auth/2fa`
Управление двухфакторной аутентификацией.

**Enable 2FA:**
```json
{
  "action": "enable"
}
```

**Verify 2FA:**
```json
{
  "action": "verify",
  "code": "123456"
}
```

**Disable 2FA:**
```json
{
  "action": "disable",
  "code": "123456"
}
```

---

## 🔮 Мистические API

### POST `/api/mystic/fortune`
AI предсказание (გადალი).

**Request Body:**
```json
{
  "name": "სახელი",
  "birthDate": "1990-01-15"
}
```

**Response (200):**
```json
{
  "prediction": "ვარსკვლავთა ქარავანი შენს სახელს ეძებს...",
  "luckyColor": "ზურმუხტისფერი",
  "luckyNumber": "7",
  "luckyDay": "პარასკევი"
}
```

---

### POST `/api/mystic/tarot`
Расклад таро (ტაროტი).

**Request Body:**
```json
{
  "question": "რა მომელის სიყვარულში?",
  "spread": "three-card"
}
```

**Response (200):**
```json
{
  "cards": [
    {
      "name": "The Fool",
      "position": "past",
      "meaning": "ახალი დასაწყისი...",
      "reversed": false
    }
  ],
  "interpretation": "კარტების საერთო ინტერპრეტაცია..."
}
```

---

### POST `/api/mystic/love`
Калькулятор совместимости (სიყვარული).

**Request Body:**
```json
{
  "name1": "სახელი 1",
  "birthDate1": "1990-01-15",
  "name2": "სახელი 2",
  "birthDate2": "1992-05-20"
}
```

**Response (200):**
```json
{
  "compatibility": 85,
  "analysis": "თქვენი კავშირი ძლიერია...",
  "strengths": ["ემოციური კავშირი", "ინტელექტუალური თავსებადობა"],
  "challenges": ["კომუნიკაცია"]
}
```

---

### POST `/api/mystic/dream`
Интерпретация снов (სიზმრები).

**Request Body:**
```json
{
  "dream": "მე ვხედავდი ზღვას და თეთრ ცხენს..."
}
```

**Response (200):**
```json
{
  "interpretation": "ზღვა სიმბოლიზირებს ემოციებს...",
  "symbols": [
    { "symbol": "ზღვა", "meaning": "ემოციები და ქვეცნობიერი" },
    { "symbol": "თეთრი ცხენი", "meaning": "სულიერი გამარჯვება" }
  ],
  "advice": "ყურადღება მიაქციეთ ინტუიციას..."
}
```

---

### POST `/api/mystic/horoscope`
Ежедневный гороскоп (ჰოროსკოპი).

**Request Body:**
```json
{
  "sign": "aries",
  "period": "daily"
}
```

**Response (200):**
```json
{
  "sign": "aries",
  "period": "daily",
  "prediction": "დღეს პოზიტიური ენერგია...",
  "love": "რომანტიკული სიურპრიზები...",
  "career": "კარიერული წინსვლა...",
  "health": "ყურადღება მიაქციეთ დასვენებას...",
  "luckyNumbers": [3, 7, 12]
}
```

---

### POST `/api/mystic/numerology`
Нумерологический анализ (ნუმეროლოგია).

**Request Body:**
```json
{
  "name": "სახელი",
  "birthDate": "1990-01-15"
}
```

**Response (200):**
```json
{
  "lifePathNumber": 7,
  "destinyNumber": 3,
  "soulNumber": 5,
  "personalityNumber": 8,
  "analysis": "ბედის რიცხვი 7 მიუთითებს..."
}
```

---

### POST `/api/mystic/chat`
Мистический AI чат.

**Request Body:**
```json
{
  "message": "რა მირჩევ დღეს?",
  "sessionId": "optional_session_id"
}
```

**Response (200):**
```json
{
  "response": "AI მისტიკოსის პასუხი...",
  "sessionId": "session_id"
}
```

---

### GET/POST/DELETE `/api/mystic/history`
История мистических запросов.

**GET - Получить историю:**
```
GET /api/mystic/history?userId=user_id&type=fortune&limit=10
```

**POST - Сохранить в историю:**
```json
{
  "userId": "user_id",
  "type": "fortune",
  "input": { "name": "სახელი" },
  "output": { "prediction": "..." }
}
```

**DELETE - Удалить запись:**
```
DELETE /api/mystic/history?id=record_id
```

---

## 📝 Посты

### GET `/api/posts`
Получить список постов.

**Query Parameters:**
| Параметр | Тип | Описание |
|----------|-----|----------|
| `page` | number | Страница (default: 1) |
| `limit` | number | Лимит (default: 10) |
| `status` | string | draft/published/scheduled/archived |
| `category` | string | Фильтр по категории |
| `search` | string | Текстовый поиск |
| `featured` | boolean | Только featured |
| `trending` | boolean | Только trending |
| `afterSlug` | string | Cursor pagination |

**Response (200):**
```json
{
  "posts": [
    {
      "id": "post_id",
      "slug": "post-slug",
      "title": "Заголовок",
      "excerpt": "Краткое описание",
      "coverImages": {
        "horizontal": "/images/cover-h.jpg",
        "vertical": "/images/cover-v.jpg"
      },
      "category": "ai",
      "tags": ["ai", "technology"],
      "author": {
        "name": "Andrew Altair",
        "avatar": "/avatar.jpg",
        "role": "AI ინოვატორი"
      },
      "publishedAt": "2024-01-01T00:00:00.000Z",
      "readingTime": 5,
      "views": 1234,
      "reactions": {
        "fire": 10,
        "love": 5,
        "mindblown": 3,
        "applause": 8,
        "insightful": 2
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### POST `/api/posts` 🔒 Admin
Создать пост.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "title": "Заголовок поста",
  "excerpt": "Краткое описание",
  "content": "Полный контент...",
  "category": "ai",
  "tags": ["ai", "tutorial"],
  "coverImages": {
    "horizontal": "/images/cover.jpg"
  },
  "status": "published",
  "seo": {
    "metaTitle": "SEO заголовок",
    "metaDescription": "SEO описание",
    "focusKeyword": "ai tutorial"
  }
}
```

---

### GET `/api/posts/[id]`
Получить пост по ID.

### PUT `/api/posts/[id]` 🔒 Admin
Обновить пост.

### DELETE `/api/posts/[id]` 🔒 Admin
Удалить пост.



---

## 📦 Репозитории (через Posts API)

Репозитории управляются через стандартный `/api/posts`, но с типом `type=repository` и дополнительным полем `repository`.

### GET `/api/posts?type=repository`
Получить список репозиториев.

### POST `/api/posts`
Создать репозиторий.

**Request Body (Specific fields):**
```json
{
  "title": "Repo Name",
  "type": "repository",
  "repository": {
    "url": "https://github.com/...",
    "name": "Repo Name",
    "description": "Description...",
    "stars": 100,
    "forks": 50,
    "language": "TypeScript",
    "topics": ["react", "ui"],
    "license": "MIT"
  }
}
```

---

## 💬 Комментарии

### GET `/api/comments`
Получить комментарии.

**Query Parameters:**
- `postId` - ID поста
- `status` - pending/approved/spam
- `limit` - лимит

### POST `/api/comments`
Создать комментарий.

**Request Body:**
```json
{
  "postId": "post_id",
  "content": "Текст комментария",
  "authorName": "Имя",
  "authorEmail": "email@example.com"
}
```

### PUT `/api/comments/[id]` 🔒 Admin
Модерация комментария.

### DELETE `/api/comments/[id]` 🔒 Admin
Удалить комментарий.

---

## 👥 Пользователи

### GET `/api/users` 🔒 Admin
Список пользователей.

### GET `/api/users/[id]`
Получить пользователя.

### PUT `/api/users/[id]`
Обновить профиль.

### DELETE `/api/users/[id]` 🔒 Admin
Удалить пользователя.

---

## 🤖 Боты

### GET `/api/bots`
Список ботов маркетплейса.

**Query Parameters:**
- `category` - content/mystic/business/creative/translation
- `tier` - free/premium/private
- `featured` - только featured
- `search` - поиск

**Response (200):**
```json
{
  "bots": [
    {
      "id": "bot_id",
      "name": "AI Помощник",
      "codename": "ai-helper",
      "version": "V1.0",
      "description": "Описание бота",
      "shortDescription": "Краткое описание",
      "category": "content",
      "tier": "free",
      "price": 0,
      "icon": "Bot",
      "color": "from-violet-500 to-purple-600",
      "features": ["Feature 1", "Feature 2"],
      "rating": 4.5,
      "downloads": 1000,
      "creator": {
        "name": "Creator Name",
        "verified": true
      }
    }
  ]
}
```

### POST `/api/bots` 🔒 Admin
Создать бота.

### GET `/api/bots/[id]`
Получить бота.

### PUT `/api/bots/[id]` 🔒 Admin
Обновить бота.

### DELETE `/api/bots/[id]` 🔒 Admin
Удалить бота.

### POST `/api/bots/[id]/demo`
Демо режим бота.

### GET `/api/bots/[id]/check-purchase`
Проверить покупку бота.

### POST `/api/bots/submit`
Отправить заявку на создание бота.

---

## 📦 Маркетплейс промптов

### GET `/api/marketplace-prompts`
Список промптов.

**Query Parameters:**
- `category` - категория
- `aiModel` - модель AI
- `generationType` - text-to-image/text-to-text/etc
- `isFree` - только бесплатные
- `status` - draft/published/archived
- `search` - поиск
- `sort` - newest/popular/rating

**Response (200):**
```json
{
  "prompts": [
    {
      "id": "prompt_id",
      "slug": "prompt-slug",
      "title": "Название промпта",
      "description": "Описание",
      "excerpt": "Краткое описание",
      "price": 10,
      "currency": "GEL",
      "originalPrice": 15,
      "isFree": false,
      "promptTemplate": "Create a [STYLE] image of [SUBJECT]...",
      "variables": [
        {
          "name": "STYLE",
          "description": "Стиль изображения",
          "options": ["realistic", "cartoon", "anime"],
          "required": true
        }
      ],
      "aiModel": "Midjourney v6",
      "generationType": "text-to-image",
      "coverImage": "/images/prompt-cover.jpg",
      "exampleImages": [
        {
          "src": "/images/example1.jpg",
          "alt": "Example",
          "promptUsed": "Actual prompt used"
        }
      ],
      "category": "portraits",
      "tags": ["portrait", "realistic"],
      "authorName": "Andrew Altair",
      "views": 500,
      "purchases": 50,
      "rating": 4.8,
      "reviewsCount": 25
    }
  ]
}
```

### POST `/api/marketplace-prompts` 🔒 Admin
Создать промпт.

### GET `/api/marketplace-prompts/[id]`
Получить промпт.

### PUT `/api/marketplace-prompts/[id]` 🔒 Admin
Обновить промпт.

### DELETE `/api/marketplace-prompts/[id]` 🔒 Admin
Удалить промпт.

### POST `/api/marketplace-prompts/[id]/purchase`
Купить промпт.

**Request Body:**
```json
{
  "userId": "user_id",
  "paymentMethod": "telegram"
}
```

---

## 🎯 Конверсия

### GET/POST `/api/conversion/lessons`
Микро-уроки.

### GET/POST `/api/conversion/deals`
Предложения с таймерами.

### GET/POST `/api/conversion/quests`
Квесты пользователей.

### GET/POST `/api/conversion/challenges`
Живые челленджи.

### GET/POST `/api/conversion/bookings`
Бронирования консультаций.

### GET/POST `/api/conversion/testimonials`
Отзывы клиентов.

### POST `/api/conversion/mystery-box`
Открыть Mystery Box.

### GET `/api/conversion/skills`
Дерево навыков.

### GET `/api/conversion/stats`
Статистика конверсии.

---

## 🖼 Медиа

### GET `/api/media`
Список медиа файлов.

### POST `/api/media` 🔒 Admin
Загрузить файл.

**Request:** multipart/form-data
- `file` - файл для загрузки
- `folder` - папка назначения

### GET `/api/media/[id]`
Получить файл.

### DELETE `/api/media/[id]` 🔒 Admin
Удалить файл.

### GET `/api/files/[...path]`
Получить файл по пути (для MongoDB storage).

---

## 📂 Папки

### GET `/api/folders`
Список папок.

### POST `/api/folders` 🔒 Admin
Создать папку.

### PUT `/api/folders/[id]` 🔒 Admin
Переименовать папку.

### DELETE `/api/folders/[id]` 🔒 Admin
Удалить папку.

---

## 🏷 Категории и теги

### GET/POST `/api/categories`
CRUD категорий.

### GET/PUT/DELETE `/api/categories/[id]`
Операции с категорией.

### GET/POST `/api/tags`
CRUD тегов.

### GET/PUT/DELETE `/api/tags/[id]`
Операции с тегом.

---

## 📊 Аналитика

### GET `/api/analytics` 🔒 Admin
Получить аналитику.

**Query Parameters:**
- `period` - day/week/month/year
- `metric` - views/users/posts/comments

**Response (200):**
```json
{
  "overview": {
    "totalViews": 10000,
    "totalUsers": 500,
    "totalPosts": 50,
    "totalComments": 200
  },
  "charts": {
    "viewsOverTime": [
      { "date": "2024-01-01", "value": 100 }
    ]
  },
  "topPosts": [...],
  "topReferrers": [...]
}
```

---

## ⚙️ Системные API

### GET `/api/health`
Health check.

**Response (200):**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST `/api/contact`
Отправить сообщение (интеграция с Telegram).

**Request Body:**
```json
{
  "name": "Имя",
  "email": "email@example.com",
  "message": "Текст сообщения"
}
```

### POST `/api/email`
Отправить email.

### GET `/api/search`
Глобальный поиск.

**Query Parameters:**
- `q` - поисковый запрос
- `type` - posts/videos/tools

### POST `/api/indexnow`
IndexNow для SEO (уведомление поисковиков).

### GET/POST `/api/seo`
SEO настройки страниц.

### GET/POST `/api/settings`
Глобальные настройки.

### GET/POST `/api/notifications`
Уведомления.

### GET/POST `/api/redirects`
Редиректы URL.

### GET `/api/error-logs` 🔒 Admin
Логи ошибок.

---

## 🕐 Cron Jobs

### GET/POST `/api/cron-jobs` 🔒 Admin
Управление cron задачами.

### GET/PUT/DELETE `/api/cron-jobs/[id]`
Операции с задачей.

### POST `/api/cron/seo-update`
Запуск SEO обновления.

### GET/POST `/api/jobs`
Запланированные задачи.

---

## 💾 Бэкапы

### GET `/api/backups` 🔒 Admin
Список бэкапов.

### POST `/api/backups` 🔒 Admin
Создать бэкап.

### GET `/api/backups/[id]` 🔒 Admin
Скачать бэкап.

### DELETE `/api/backups/[id]` 🔒 Admin
Удалить бэкап.

---

## 🔒 Admin API

### POST `/api/admin/login`
Вход в админ-панель.

**Request Body:**
```json
{
  "password": "admin_password"
}
```

### POST `/api/admin/verify`
Верификация admin сессии.

### GET/PUT `/api/admin/settings`
Настройки админ-панели.

---

## 📝 Общие правила API

### Аутентификация
Все защищенные endpoints требуют JWT токен:
```
Authorization: Bearer <jwt_token>
```

### Формат ответа

**Успешный ответ:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Ответ с ошибкой:**
```json
{
  "error": "Описание ошибки",
  "details": "Дополнительные детали (dev only)"
}
```

### HTTP статусы
| Статус | Описание |
|--------|----------|
| 200 | Успешно |
| 201 | Создано |
| 400 | Неверный запрос |
| 401 | Не авторизован |
| 403 | Доступ запрещен |
| 404 | Не найдено |
| 429 | Rate limit |
| 500 | Ошибка сервера |

### Rate Limiting
- Login: 5 попыток / 15 мин
- API: 100 запросов / минуту

---

## 🧪 Тестирование API

### cURL примеры

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

**Get Posts:**
```bash
curl http://localhost:3000/api/posts?status=published&limit=5
```

**Fortune Prediction:**
```bash
curl -X POST http://localhost:3000/api/mystic/fortune \
  -H "Content-Type: application/json" \
  -d '{"name":"სახელი","birthDate":"1990-01-01"}'
```

---

## 📚 Связанные ресурсы

- [README.md](./README.md) - Общая документация проекта
- [AGENTS.md](./AGENTS.md) - Руководство для AI агентов
- [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) - Руководство по деплою
