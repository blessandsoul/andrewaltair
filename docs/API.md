# Fresh Platform API Documentation

Complete API reference for the Fresh Platform - a Georgian AI & Technology content platform.

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [SDK Examples](#sdk-examples)
- [Testing](#testing)

---

## Overview

The Fresh Platform API provides access to:

- **Blog Posts** - CRUD operations for articles
- **AI Bots** - Marketplace of AI assistants
- **Chat** - Real-time AI conversations
- **Mystic Tools** - Horoscope, Tarot, Dream interpretation, etc.
- **Tools Directory** - AI tools catalog
- **Videos** - Video content
- **User Management** - Authentication, profiles, sessions
- **Comments** - Content comments with moderation
- **Analytics** - Platform statistics

### Base URL

```
Production: https://your-domain.com
Development: http://localhost:3000
```

---

## Authentication

### User Authentication (JWT)

Most endpoints require a JWT token obtained via login:

```bash
# Login to get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "yourpassword"}'

# Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}

# Use token in subsequent requests
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Admin Authentication

Admin endpoints use a separate password-based authentication:

```bash
# Admin login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "admin-password"}'

# Response includes token + sets httpOnly cookie
{
  "success": true,
  "token": "admin-jwt-token",
  "message": "წარმატებით შეხვედით"
}
```

### Two-Factor Authentication (2FA)

```bash
# Setup 2FA - get QR code
curl -X POST http://localhost:3000/api/auth/2fa \
  -H "Authorization: Bearer YOUR_TOKEN"

# Enable 2FA with TOTP code
curl -X PUT http://localhost:3000/api/auth/2fa \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"token": "123456", "action": "enable"}'
```

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/search` | 30 requests | 1 minute |
| `/api/admin/login` | 5 attempts | 15 min lockout |

When rate limited, you'll receive a `429 Too Many Requests` response.

---

## API Reference

### Posts

#### List Posts
```bash
GET /api/posts?page=1&limit=10&status=published

# With filters
GET /api/posts?category=ai-tips&featured=true&search=GPT
```

#### Get Single Post
```bash
GET /api/posts/{id_or_slug}
```

#### Create Post (Admin)
```bash
POST /api/posts
Content-Type: application/json
Cookie: admin_session=TOKEN

{
  "title": "New Article",
  "excerpt": "Short description",
  "content": "Full content...",
  "category": "ai-tips",
  "tags": ["AI", "Tech"],
  "status": "published"
}
```

#### AI-Powered Features
```bash
# Generate SEO suggestions
POST /api/posts/ai-suggest
{"title": "...", "rawContent": "..."}

# Generate tags
POST /api/posts/generate-tags
{"title": "...", "content": "..."}

# SEO analysis
POST /api/posts/seo-analysis
{"title": "...", "content": "...", "focusKeyword": "..."}
```

---

### Chat

#### Send Message
```bash
POST /api/chat
{
  "message": "გამარჯობა! რა არის AI?",
  "history": [],
  "masterPrompt": "optional custom system prompt"
}

# Response
{"response": "AI არის ხელოვნური ინტელექტი..."}
```

---

### Mystic Tools

#### Daily Horoscope
```bash
POST /api/mystic/horoscope
{"sign": "aries", "signName": "ვერძი"}

# Response
{
  "general": "დღეს კოსმიური ენერგიები...",
  "love": "სიყვარულის სფეროში...",
  "career": "პროფესიულ ასპარეზზე...",
  "health": "შენი ენერგია..."
}
```

#### Tarot Reading
```bash
POST /api/mystic/tarot
{
  "cards": ["The Fool", "The Magician", "The High Priestess"],
  "spreadType": "three"
}
```

#### Dream Interpretation
```bash
POST /api/mystic/dream
{"dream": "ვიფრინავდი ცაში და..."}
```

#### Love Compatibility
```bash
POST /api/mystic/love
{"name1": "გიორგი", "name2": "თამარ"}

# Response
{"percentage": 78, "title": "...", "description": "..."}
```

#### Numerology
```bash
POST /api/mystic/numerology
{
  "fullName": "გიორგი ბერიძე",
  "birthDate": "1990-05-15",
  "lifePath": 3,
  "destiny": 7
}
```

---

### Search

#### Global Search
```bash
GET /api/search?q=AI&limit=10

# Filter by type
GET /api/search?q=AI&type=posts

# Response
{
  "results": [
    {
      "type": "post",
      "id": "123",
      "title": "AI Article",
      "description": "...",
      "url": "/blog/ai-article",
      "image": "/cover.jpg"
    }
  ],
  "total": 10,
  "query": "AI"
}
```

---

### Bots Marketplace

```bash
# List bots
GET /api/bots?tier=free&category=coding

# Get bot details
GET /api/bots/{id}

# Like a bot
POST /api/bots/{id}
```

---

### User Profile

```bash
# Get profile with stats
GET /api/profile
Authorization: Bearer TOKEN

# Update profile
PUT /api/profile
{
  "fullName": "New Name",
  "bio": "About me",
  "avatar": "/avatar.jpg"
}
```

---

### Sessions Management

```bash
# List active sessions
GET /api/sessions

# Revoke all except current
DELETE /api/sessions?all=true&exceptCurrent=true

# Revoke specific session
DELETE /api/sessions?id=SESSION_ID
```

---

### File Upload

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/image.jpg" \
  -F "title=My Image" \
  -F "type=horizontal"

# Response
{
  "success": true,
  "url": "/uploads/2026/01/my-image-horizontal.jpg",
  "filename": "my-image-horizontal.jpg"
}
```

---

### Health Check

```bash
GET /api/health

# Response
{
  "status": "healthy",
  "timestamp": "2026-01-05T12:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0"
}
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "error": "Error message in Georgian",
  "details": "Technical details (dev only)"
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - validation error |
| 401 | Unauthorized - missing/invalid token |
| 403 | Forbidden - insufficient permissions |
| 404 | Not Found |
| 429 | Too Many Requests - rate limited |
| 500 | Internal Server Error |

### Georgian Error Messages

| English | Georgian |
|---------|----------|
| Not authenticated | არ ხართ ავტორიზებული |
| Invalid password | არასწორი პაროლი |
| User not found | მომხმარებელი ვერ მოიძებნა |
| Access denied | წვდომა აკრძალულია |
| Server error | სერვერის შეცდომა |
| Account blocked | თქვენი ანგარიში დაბლოკილია |

---

## SDK Examples

### JavaScript/TypeScript

```typescript
// api-client.ts
const BASE_URL = 'http://localhost:3000';

class FreshAPI {
  private token: string | null = null;

  async login(email: string, password: string) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    this.token = data.token;
    return data;
  }

  async getPosts(params: { page?: number; limit?: number; status?: string } = {}) {
    const query = new URLSearchParams(params as Record<string, string>);
    const res = await fetch(`${BASE_URL}/api/posts?${query}`);
    return res.json();
  }

  async chat(message: string, history: any[] = []) {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    return res.json();
  }

  async getHoroscope(sign: string, signName: string) {
    const res = await fetch(`${BASE_URL}/api/mystic/horoscope`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sign, signName }),
    });
    return res.json();
  }

  async search(query: string, type?: 'posts' | 'videos' | 'tools') {
    const params = new URLSearchParams({ q: query });
    if (type) params.set('type', type);
    const res = await fetch(`${BASE_URL}/api/search?${params}`);
    return res.json();
  }

  // Authenticated request helper
  private async authRequest(url: string, options: RequestInit = {}) {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${this.token}`,
      },
    });
  }
}

// Usage
const api = new FreshAPI();
await api.login('user@example.com', 'password');
const posts = await api.getPosts({ status: 'published' });
const horoscope = await api.getHoroscope('aries', 'ვერძი');
```

### Python

```python
import requests

class FreshAPI:
    def __init__(self, base_url='http://localhost:3000'):
        self.base_url = base_url
        self.token = None
    
    def login(self, email: str, password: str):
        res = requests.post(f'{self.base_url}/api/auth/login', json={
            'email': email,
            'password': password
        })
        data = res.json()
        self.token = data.get('token')
        return data
    
    def get_posts(self, page=1, limit=10, status='published'):
        res = requests.get(f'{self.base_url}/api/posts', params={
            'page': page,
            'limit': limit,
            'status': status
        })
        return res.json()
    
    def chat(self, message: str, history: list = None):
        res = requests.post(f'{self.base_url}/api/chat', json={
            'message': message,
            'history': history or []
        })
        return res.json()
    
    def get_horoscope(self, sign: str, sign_name: str):
        res = requests.post(f'{self.base_url}/api/mystic/horoscope', json={
            'sign': sign,
            'signName': sign_name
        })
        return res.json()
    
    def search(self, query: str, type_filter: str = None):
        params = {'q': query}
        if type_filter:
            params['type'] = type_filter
        res = requests.get(f'{self.base_url}/api/search', params=params)
        return res.json()

# Usage
api = FreshAPI()
api.login('user@example.com', 'password')
posts = api.get_posts(status='published')
horoscope = api.get_horoscope('aries', 'ვერძი')
```

---

## Testing

### Using Postman

Import the included Postman collection:

```
docs/Fresh_Platform_API.postman_collection.json
```

1. Set `BASE_URL` variable to your server
2. Run "Login" request first - token auto-saves
3. Test other endpoints

### Using cURL

```bash
# Health check
curl http://localhost:3000/api/health

# List posts
curl http://localhost:3000/api/posts

# Search
curl "http://localhost:3000/api/search?q=AI"

# Chat
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'
```

### OpenAPI Specification

The full OpenAPI 3.0 specification is available in:

```
docs/openapi.yaml
```

Use with Swagger UI, Redoc, or any OpenAPI-compatible tool.

---

## API Endpoints Summary

| Category | Endpoints | Auth |
|----------|-----------|------|
| **Admin** | `/api/admin/login`, `/api/admin/verify` | Admin |
| **Auth** | `/api/auth/login`, `/api/auth/register`, `/api/auth/me`, `/api/auth/2fa` | Public/JWT |
| **Posts** | `/api/posts`, `/api/posts/{id}`, `/api/posts/ai-suggest`, etc. | Public/Admin |
| **Bots** | `/api/bots`, `/api/bots/{id}` | Public |
| **Chat** | `/api/chat` | Public |
| **Mystic** | `/api/mystic/horoscope`, `/api/mystic/tarot`, etc. | Public |
| **Search** | `/api/search` | Public (Rate Limited) |
| **Tools** | `/api/tools`, `/api/tools/{id}` | Public |
| **Videos** | `/api/videos` | Public |
| **Comments** | `/api/comments` | Public |
| **Analytics** | `/api/analytics` | Public |
| **Users** | `/api/users` | Admin JWT |
| **Profile** | `/api/profile` | JWT |
| **Sessions** | `/api/sessions` | JWT |
| **Upload** | `/api/upload` | Public |
| **Email** | `/api/email` | Public |
| **SEO** | `/api/seo` | Public |
| **Prompts** | `/api/prompts`, `/api/prompt-builder` | Public |
| **Health** | `/api/health` | Public |

---

## Support

- **Email**: andrewaltair@icloud.com
- **Website**: https://andrewaltair.com

---

*Generated on 2026-01-05*
