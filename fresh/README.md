# 🔮 Andrew Altair - AI Mystic Blog

> **Georgian AI-powered mystical entertainment platform with personal branding focus**

![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)

## 🌟 Overview

Andrew Altair is a Next.js 14 blog platform featuring **8 AI-powered mystic tools** with Georgian language support, gamification, social sharing, and premium subscription capabilities.

---

## ✨ Features

### 🔮 Mystic AI Tools (8 Total)

| Tool | Description | API |
|------|-------------|-----|
| **გადალი** (Fortune Teller) | AI predictions based on name & birth date | `/api/mystic/fortune` |
| **ტაროტი** (Tarot Cards) | 22 Major Arcana with 3-card + Celtic Cross spreads | `/api/mystic/tarot` |
| **სიყვარული** (Love Calculator) | Compatibility analysis between two names | `/api/mystic/love` |
| **სიზმრები** (Dream Interpreter) | AI dream analysis with symbolism | `/api/mystic/dream` |
| **ჰოროსკოპი** (Horoscope) | Daily zodiac predictions | `/api/mystic/horoscope` |
| **ნუმეროლოგია** (Numerology) | Life path, destiny, soul numbers | `/api/mystic/numerology` |
| **მთვარე** (Moon Phases) | Real-time lunar phase with rituals | Client-side |
| **AI ჩატი** (Mystic Chat) | Personal AI mystic advisor | `/api/mystic/chat` |

### 🎮 Gamification System
- **16 Achievement Badges** - Unlock by using tools, maintaining streaks, sharing
- **Leaderboard** - Daily, weekly, monthly rankings
- **Streak Tracking** - Current and longest streaks
- **Prediction History** - View, filter, delete, share past predictions

### 📱 Social Features
- **Instagram Story Sharing** - Download predictions as images
- **Native Share API** - Share to any platform
- **Copy to Clipboard** - Formatted text for messaging

### 💎 Premium System
- **Monthly** (₾9.99) / **Yearly** (₾79.99) subscriptions
- Premium-only features (Celtic Cross spread, unlimited chat)
- Premium badges and indicators

### 👤 Author Branding
- Profile section with stats and trust badges
- Social links (YouTube, Instagram)
- "Andrew Altair" AI persona

---

## 🛠 Tech Stack

- **Framework:** Next.js 14.2.3 (App Router)
- **Language:** TypeScript 5.0
- **Database:** MongoDB Atlas + Mongoose
- **AI Provider:** Groq API (Llama 3.3 70B)
- **Styling:** Tailwind CSS + shadcn/ui
- **Animations:** Framer Motion
- **Icons:** Lucide React

---

## 📁 Project Structure

```
fresh/
├── src/
│   ├── app/
│   │   ├── mystic/          # Main mystic page
│   │   ├── api/mystic/      # 6 API endpoints
│   │   │   ├── fortune/
│   │   │   ├── tarot/
│   │   │   ├── numerology/
│   │   │   ├── chat/
│   │   │   └── history/
│   │   ├── blog/
│   │   ├── tools/           # 1000+ AI tools catalog
│   │   └── admin/
│   ├── components/
│   │   ├── ai/              # 8 AI tool components
│   │   └── mystic/          # UI components
│   ├── models/              # MongoDB schemas
│   │   ├── MysticHistory.ts
│   │   ├── MysticProfile.ts
│   │   ├── MysticGift.ts
│   │   └── MysticAchievement.ts
│   └── lib/
│       ├── db.ts            # MongoDB connection
│       └── badges.ts        # Badge definitions
├── .env.local               # Environment variables
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Groq API key (free at https://console.groq.com)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/andrewaltair.git
cd andrewaltair/fresh

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

### Environment Variables

```env
MONGODB_URI=mongodb+srv://...
GROQ_API_KEY=gsk_...
NEXTAUTH_SECRET=your-secret
```

---

## 🔑 API Endpoints

### Mystic APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/mystic/fortune` | Generate fortune prediction |
| POST | `/api/mystic/tarot` | Interpret tarot cards |
| POST | `/api/mystic/numerology` | Analyze numerology |
| POST | `/api/mystic/chat` | Chat with AI mystic |
| GET | `/api/mystic/history` | Get prediction history |
| POST | `/api/mystic/history` | Save prediction |
| DELETE | `/api/mystic/history` | Delete prediction |

---

## 📊 MongoDB Models

### MysticHistory
Stores all user predictions with session/user tracking.

### MysticProfile
User settings: zodiac, birth date, premium status.

### MysticAchievement
Gamification: badges, streaks, leaderboard stats.

### MysticGift
Gift predictions to friends with claim tokens.

---

## 🎨 Design System

- **Theme:** Dark mystical with purple/pink gradients
- **Font:** Noto Sans Georgian
- **Animations:** Floating orbs, twinkling stars
- **Components:** shadcn/ui with custom styling

---

## 📄 License

MIT License - Feel free to use for your own mystic projects!

---

## 👨‍💻 Author

**Andrew Altair** - AI Mystic & Blogger

- 🌐 [andrewaltair.ge](https://andrewaltair.ge)
- 📺 [YouTube](https://youtube.com/@andrewaltair)
- 📸 [Instagram](https://instagram.com/andrewaltair)
