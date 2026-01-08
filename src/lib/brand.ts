// Brand configuration for AndrewAltair.GE
// AI Content Creator Personal Brand

export const brand = {
  // Core Identity
  name: "Andrew Altair",
  tagline: "AI ინოვატორი და კონტენტ კრეატორი",
  domain: "andrewaltair.ge",
  email: "andrewaltair@icloud.com",
  logo: "/logo.png",

  // Experience & Stats (for credibility)
  stats: {
    yearsExperience: "8+",
    subscribers: "50K+",
    articles: "200+",
    projects: "30+",
  },

  // Color Palette - Cyber Premium Style
  colors: {
    // Primary - Electric Blue/Purple gradient
    primary: {
      50: "#f0f4ff",
      100: "#e0e7ff",
      200: "#c4cdff",
      300: "#a2afff",
      400: "#7c85ff",
      500: "#6366f1", // Main primary
      600: "#5046e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
    },
    // Accent - Neon Cyan
    accent: {
      50: "#ecfeff",
      100: "#cffafe",
      200: "#a5f3fc",
      300: "#67e8f9",
      400: "#22d3ee", // Main accent
      500: "#06b6d4",
      600: "#0891b2",
      700: "#0e7490",
      800: "#155e75",
      900: "#164e63",
    },
    // Success - Emerald
    success: "#10b981",
    // Warning - Amber
    warning: "#f59e0b",
    // Error - Rose
    error: "#f43f5e",
    // Neutrals
    dark: {
      bg: "#0a0a0f",
      card: "#12121a",
      border: "#1e1e2e",
      text: "#e4e4e7",
      muted: "#71717a",
    },
    light: {
      bg: "#fafafa",
      card: "#ffffff",
      border: "#e4e4e7",
      text: "#18181b",
      muted: "#71717a",
    },
  },

  // Typography
  fonts: {
    // Georgian font for body text
    georgian: "'Noto Sans Georgian', 'BPG Nino Mtavruli', sans-serif",
    // English/Display font
    display: "'Inter', 'SF Pro Display', system-ui, sans-serif",
    // Monospace for code
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },

  // Reactions for posts
  reactions: [
    { emoji: "🔥", label: "Fire", key: "fire" },
    { emoji: "❤️", label: "Love", key: "love" },
    { emoji: "🤯", label: "Mind Blown", key: "mindblown" },
    { emoji: "👏", label: "Applause", key: "applause" },
    { emoji: "💡", label: "Insightful", key: "insightful" },
  ],

  // Social Links (to be filled with real URLs)
  social: {
    youtube: "https://www.youtube.com/@AndrewAltair",
    instagram: "https://www.instagram.com/andr3waltair/",
    facebook: "https://www.facebook.com/andr3waltair",
    tiktok: "https://www.tiktok.com/@andrewaltair",
    telegram: "https://t.me/andr3waltairchannel",
    linkedin: "https://www.linkedin.com/in/andrewaltair",
    twitter: "https://x.com/andr3waltair",
    github: "https://github.com/andrewaltair",
  },

  // Categories for blog posts
  categories: [
    { id: "articles", name: "სტატიები", icon: "FileText", color: "#6366f1" },
    { id: "ai", name: "ხელოვნური ინტელექტი", icon: "Bot", color: "#22d3ee" },
    { id: "science", name: "მეცნიერება და ტექნიკა", icon: "Atom", color: "#10b981" },
  ],

  // Animation presets
  animations: {
    spring: { type: "spring", stiffness: 300, damping: 30 },
    smooth: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    bounce: { type: "spring", stiffness: 400, damping: 10 },
  },
} as const

export type Brand = typeof brand
