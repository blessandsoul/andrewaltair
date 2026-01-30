---
trigger: always_on
---

> **SCOPE**: These rules apply to **all client projects** (React SPA and Next.js).

# Color System & Theming

## Version: 2.0

---

## 1. Architecture Overview

```
CSS Variables (globals.css)
         ↓
Tailwind Config (tailwind.config.js)
         ↓
Component Classes (className="bg-primary")
```

**Key Principle**: All colors are CSS variables. Never hardcode color values.

---

## 2. CSS Variables

### 2.1 Light Theme

```css
/* styles/globals.css */
@layer base {
  :root {
    /* Base */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    /* Primary (Main brand color) */
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;

    /* Secondary */
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    /* Muted (Disabled, placeholders) */
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    /* Accent (Highlights) */
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    /* Destructive (Errors, delete) */
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    /* Card */
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    /* Popover */
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    /* Border & Input */
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;

    /* Radius */
    --radius: 0.5rem;

    /* Semantic Colors */
    --success: 142.1 76.2% 36.3%;
    --success-foreground: 0 0% 100%;
    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 100%;
    --info: 199 89% 48%;
    --info-foreground: 0 0% 100%;
  }
}
```

### 2.2 Dark Theme

```css
/* styles/globals.css */
@layer base {
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;

    --success: 142.1 70.6% 45.3%;
    --success-foreground: 0 0% 100%;
    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 0%;
    --info: 199 89% 48%;
    --info-foreground: 0 0% 100%;
  }
}
```

---

## 3. Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

---

## 4. Color Usage Rules

### 4.1 ALWAYS Use Semantic Classes

```tsx
// ✅ CORRECT
<div className="bg-background text-foreground">
<Button className="bg-primary text-primary-foreground">
<Alert className="bg-destructive text-destructive-foreground">
<Badge className="bg-success text-success-foreground">
<Card className="bg-card text-card-foreground border">
<Input className="bg-input border-border">
```

### 4.2 NEVER Hardcode Colors

```tsx
// ❌ WRONG - Hardcoded colors
<div className="bg-blue-500">              // Tailwind color palette
<div className="bg-[#3b82f6]">             // Hex code
<div style={{ backgroundColor: '#fff' }}> // Inline style
<div className="text-gray-900">            // Tailwind gray

// ✅ CORRECT - Semantic colors
<div className="bg-primary">
<div className="bg-background">
<div className="text-foreground">
```

---

## 5. Color Purpose Reference

| Color | Purpose | Examples |
|-------|---------|----------|
| `primary` | Main actions, links, brand | Book Now button, nav links |
| `secondary` | Secondary actions | Cancel button, secondary nav |
| `destructive` | Dangerous actions, errors | Delete button, error messages |
| `muted` | Disabled, subdued content | Disabled inputs, placeholders |
| `accent` | Highlights, badges | "New" badge, highlights |
| `success` | Success states | Confirmation messages |
| `warning` | Warning states | "Pending" status |
| `info` | Informational | Tips, info banners |
| `background` | Page background | Main page bg |
| `foreground` | Main text | Body text |
| `card` | Card surfaces | Card backgrounds |
| `border` | Borders, dividers | Card borders, hr |
| `input` | Input backgrounds | Form inputs |
| `ring` | Focus rings | Focus outline |

---

## 6. Component Examples

### 6.1 Buttons

```tsx
// Primary action
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Book Now
</Button>

// Secondary action
<Button variant="secondary" className="bg-secondary text-secondary-foreground">
  Cancel
</Button>

// Destructive action
<Button variant="destructive" className="bg-destructive text-destructive-foreground">
  Delete
</Button>

// Ghost/Outline
<Button variant="outline" className="border-border hover:bg-accent">
  Learn More
</Button>
```

### 6.2 Cards

```tsx
<Card className="bg-card text-card-foreground border border-border">
  <CardHeader>
    <CardTitle className="text-foreground">Tour Title</CardTitle>
    <CardDescription className="text-muted-foreground">
      Tour description
    </CardDescription>
  </CardHeader>
</Card>
```

### 6.3 Alerts/Badges

```tsx
// Success
<Alert className="bg-success/10 text-success border-success">
  <CheckCircle className="h-4 w-4" />
  <AlertDescription>Booking confirmed!</AlertDescription>
</Alert>

// Warning
<Badge className="bg-warning text-warning-foreground">
  Pending
</Badge>

// Error
<Alert variant="destructive" className="bg-destructive/10 text-destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertDescription>Payment failed</AlertDescription>
</Alert>
```

### 6.4 Status Colors Pattern

```typescript
// lib/utils/status.utils.ts
type Status = 'pending' | 'confirmed' | 'cancelled' | 'completed';

const statusStyles: Record<Status, string> = {
  pending: 'bg-warning text-warning-foreground',
  confirmed: 'bg-success text-success-foreground',
  cancelled: 'bg-destructive text-destructive-foreground',
  completed: 'bg-primary text-primary-foreground',
};

export function getStatusStyle(status: Status): string {
  return statusStyles[status] ?? 'bg-muted text-muted-foreground';
}

// Usage
<Badge className={getStatusStyle(booking.status)}>
  {booking.status}
</Badge>
```

---

## 7. Dark Mode

### 7.1 Theme Toggle Hook

```typescript
// hooks/useTheme.ts
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem('theme') as Theme) || 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

    const activeTheme = theme === 'system' ? systemTheme : theme;

    root.classList.remove('light', 'dark');
    root.classList.add(activeTheme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  return { theme, setTheme };
}
```

### 7.2 Theme Toggle Component

```tsx
// components/common/ThemeToggle.tsx
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

---

## 8. Opacity Variants

```tsx
// Background with opacity
<div className="bg-primary/10">10% opacity primary</div>
<div className="bg-primary/50">50% opacity primary</div>
<div className="bg-destructive/20">20% opacity destructive</div>

// Hover states
<Button className="bg-primary hover:bg-primary/90">
<Card className="hover:bg-accent/50">

// Overlays
<div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
```

---

## 9. Strict Prohibitions

### 9.1 Never Do These

```tsx
// ❌ NEVER - Tailwind palette colors
className="bg-blue-500"
className="text-gray-700"
className="border-red-600"

// ❌ NEVER - Hex codes
className="bg-[#3b82f6]"
className="text-[#333333]"

// ❌ NEVER - Inline styles for colors
style={{ backgroundColor: '#ffffff' }}
style={{ color: 'rgb(0,0,0)' }}

// ❌ NEVER - CSS color names
className="bg-white"
className="text-black"
```

### 9.2 Always Do These

```tsx
// ✅ ALWAYS - Semantic variable-based colors
className="bg-primary"
className="bg-background"
className="text-foreground"
className="text-muted-foreground"
className="border-border"
```

---

## 10. Changing Brand Colors

To change the brand color across the entire app:

```css
/* Just update the CSS variable */
:root {
  /* Change from blue to green */
  --primary: 142.1 76.2% 36.3%;  /* green */
  /* All bg-primary classes update automatically */
}
```

---

## 11. Color Checklist

- [ ] All colors defined in CSS variables
- [ ] Tailwind config maps all variables
- [ ] No hardcoded hex/rgb values
- [ ] No Tailwind color palette (blue-500, etc.)
- [ ] Dark mode colors defined
- [ ] Proper foreground paired with background
- [ ] Semantic names used (not color names)
- [ ] Status colors consistent across app
- [ ] WCAG contrast requirements met

---

**Version**: 2.0
**Last Updated**: 2025-01-30
