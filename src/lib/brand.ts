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

  // Author Bio & Philosophy
  bio: {
    title: "AI ინოვატორი საქართველოში",
    short: "ვასწავლი როგორ გამოიყენო ხელოვნური ინტელექტი რეალურ ცხოვრებაში — შემოსავლის ზრდისა და ბიზნესის ავტომატიზაციისთვის.",
    long: "ვასწავლი როგორ გამოიყენო ხელოვნური ინტელექტი რეალურ ცხოვრებაში — შემოსავლის ზრდისთვის, ბიზნესის ავტომატიზაციისთვის და კონკურენტული უპირატესობისთვის.",
    philosophy: "AI არ არის მომავალი — ეს არის აწმყო. ვინც დღეს ისწავლის, ხვალ გაიმარჯვებს.",
    bullets: [
      "AI ბოტები და პრომპტების მარკეტფლეისი (პირველი საქართველოში)",
      "ყოველდღიური ვიდეოები და სტატიები AI სამყაროზე",
      "კურსები: ნულიდან — AI პროფესიონალამდე"
    ]
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
    linkedin: "https://www.linkedin.com/in/andr3waltair",
    twitter: "https://x.com/andr3waltair",
    github: "https://github.com/andr3waltair",
  },

  // Categories for blog posts - articles is parent, others are subcategories
  categories: [
    {
      id: "articles",
      name: "სტატიები",
      icon: "FileText",
      color: "#6366f1",
      isParent: true,
      subcategories: [
        { id: "ai", name: "ხელოვნური ინტელექტი", icon: "Bot", color: "#22d3ee" },
        { id: "science", name: "მეცნიერება და ტექნიკა", icon: "Atom", color: "#10b981" },
        { id: "tutorials", name: "ტუტორიალები", icon: "Book", color: "#f59e0b" },
        { id: "news", name: "სიახლეები", icon: "News", color: "#ef4444" },
        { id: "technology", name: "ტექნოლოგიები", icon: "Cpu", color: "#8b5cf6" },
        { id: "economy", name: "ეკონომიკა", icon: "TrendingUp", color: "#f97316" },
        { id: "politics", name: "პოლიტიკა", icon: "Landmark", color: "#dc2626" },
        { id: "business", name: "ბიზნესი", icon: "Briefcase", color: "#0ea5e9" },
        { id: "society", name: "საზოგადოება", icon: "Users", color: "#a855f7" },
        { id: "education", name: "განათლება", icon: "GraduationCap", color: "#14b8a6" },
        { id: "world", name: "მსოფლიო", icon: "Globe", color: "#6366f1" },
      ]
    },
  ],

  // Default category for new posts
  defaultCategory: "ai",

  // Animation presets
  animations: {
    spring: { type: "spring", stiffness: 300, damping: 30 },
    smooth: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    bounce: { type: "spring", stiffness: 400, damping: 10 },
  },
} as const

export type Brand = typeof brand
