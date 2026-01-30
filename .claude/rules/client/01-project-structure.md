---
trigger: always_on
---

> **SCOPE**: These rules apply to **all client projects** (React SPA and Next.js).
> For framework-specific structure, see `/client/react/` or `/client/nextjs/`.

# Project Structure & File Organization

## Version: 2.0

---

## 1. Core Folder Structure

### 1.1 Base Structure (Both React & Next.js)

```
src/
├── components/           # Shared UI components
│   ├── ui/              # Primitive UI (shadcn/ui)
│   ├── common/          # Shared business components
│   └── layout/          # Layout components
├── features/            # Feature modules (domain-driven)
│   └── <feature>/       # Each feature is self-contained
├── hooks/               # Global custom hooks
├── lib/                 # Shared utilities & config
│   ├── api/            # API client configuration
│   ├── constants/      # App-wide constants
│   └── utils/          # Utility functions
├── store/              # Global state (Redux/Zustand)
├── types/              # Global TypeScript types
└── styles/             # Global styles
```

### 1.2 Feature Module Structure

Every feature follows the **same internal structure**:

```
features/<feature>/
├── components/          # Feature-specific components
│   ├── TourCard.tsx
│   ├── TourList.tsx
│   └── TourFilters.tsx
├── hooks/              # Feature-specific hooks
│   ├── useTours.ts
│   ├── useTour.ts
│   └── useCreateTour.ts
├── services/           # API service layer
│   └── tour.service.ts
├── types/              # Feature types
│   └── tour.types.ts
├── utils/              # Feature utilities
│   └── tour.utils.ts
├── schemas/            # Zod validation schemas
│   └── tour.schemas.ts
└── index.ts            # Barrel exports
```

### 1.3 Components Folder

```
components/
├── ui/                  # Primitive UI components (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── common/              # Shared business components
│   ├── LoadingSpinner.tsx
│   ├── ErrorBoundary.tsx
│   ├── ErrorMessage.tsx
│   ├── EmptyState.tsx
│   ├── Pagination.tsx
│   ├── ConfirmDialog.tsx
│   └── ProtectedRoute.tsx
└── layout/              # Layout components
    ├── Header.tsx
    ├── Footer.tsx
    ├── Sidebar.tsx
    └── MainLayout.tsx
```

---

## 2. File Naming Conventions

### 2.1 Naming Rules Table

| Type | Convention | Example |
|------|------------|---------|
| **Components** | PascalCase | `TourCard.tsx`, `LoginForm.tsx` |
| **Pages** | PascalCase + Page suffix | `ToursPage.tsx`, `LoginPage.tsx` |
| **Hooks** | camelCase + use prefix | `useTours.ts`, `useAuth.ts` |
| **Services** | camelCase + .service | `tour.service.ts`, `auth.service.ts` |
| **Types** | camelCase + .types | `tour.types.ts`, `auth.types.ts` |
| **Schemas** | camelCase + .schemas | `tour.schemas.ts`, `auth.schemas.ts` |
| **Utils** | camelCase + .utils | `format.utils.ts`, `date.utils.ts` |
| **Constants** | camelCase or kebab-case | `routes.ts`, `api-endpoints.ts` |
| **Redux Slices** | camelCase + Slice | `authSlice.ts`, `tourSlice.ts` |
| **Tests** | Same name + .test | `TourCard.test.tsx`, `useTours.test.ts` |

### 2.2 Examples

```
✅ CORRECT:
TourCard.tsx           # Component
TourCard.test.tsx      # Test file
useTours.ts            # Hook
tour.service.ts        # Service
tour.types.ts          # Types
tour.schemas.ts        # Validation schemas
format.utils.ts        # Utilities
ToursPage.tsx          # Page component

❌ WRONG:
tourCard.tsx           # Should be PascalCase
use-tours.ts           # Should be camelCase
TourService.ts         # Should be tour.service.ts
TourTypes.ts           # Should be tour.types.ts
tours-page.tsx         # Should be ToursPage.tsx
```

---

## 3. Import Organization

### 3.1 Import Order (Strict)

```typescript
// 1. React/Framework imports
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// OR for Next.js
import { useRouter } from 'next/navigation';

// 2. Third-party libraries (alphabetical)
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';

// 3. UI components (shadcn/ui)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// 4. Common components
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';

// 5. Feature components (relative imports)
import { TourCard } from '../components/TourCard';
import { TourFilters } from '../components/TourFilters';

// 6. Hooks
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTours } from '../hooks/useTours';

// 7. Services
import { tourService } from '../services/tour.service';

// 8. Types (always use 'type' keyword)
import type { Tour, TourFilters } from '../types/tour.types';

// 9. Utils & Constants
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/format.utils';
import { ROUTES } from '@/lib/constants/routes';
```

### 3.2 Import Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/store/*": ["./src/store/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

### 3.3 Import Rules

```typescript
// ✅ DO: Use aliases for cross-module imports
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';

// ✅ DO: Use relative imports within a feature
import { TourCard } from '../components/TourCard';
import { useTours } from './useTours';

// ✅ DO: Use 'type' keyword for type-only imports
import type { Tour } from '../types/tour.types';

// ❌ DON'T: Use deep relative paths across features
import { useAuth } from '../../../auth/hooks/useAuth';

// ❌ DON'T: Mix default and named exports inconsistently
import TourCard from './TourCard'; // Use named exports
```

---

## 4. Export Patterns

### 4.1 Named Exports (Required)

```typescript
// ✅ REQUIRED: Named exports for all components
export const TourCard = () => { ... };
export const TourList = () => { ... };

// ✅ REQUIRED: Named exports for hooks
export const useTours = () => { ... };
export const useAuth = () => { ... };

// ✅ REQUIRED: Named exports for utilities
export const formatCurrency = () => { ... };
export const formatDate = () => { ... };
```

### 4.2 Default Exports (Exceptions Only)

```typescript
// ✅ ALLOWED: Default export for pages (Next.js requirement)
export default function ToursPage() { ... }

// ✅ ALLOWED: Default export for App entry
export default App;

// ❌ AVOID: Default exports for components
export default TourCard; // Use named export instead
```

### 4.3 Barrel Exports (index.ts)

```typescript
// features/tours/index.ts
// Export components
export { TourCard } from './components/TourCard';
export { TourList } from './components/TourList';
export { TourFilters } from './components/TourFilters';

// Export hooks
export { useTours } from './hooks/useTours';
export { useTour } from './hooks/useTour';
export { useCreateTour } from './hooks/useCreateTour';

// Export services
export { tourService } from './services/tour.service';

// Export types (use 'export type' for types)
export type { Tour, TourFilters, CreateTourRequest } from './types/tour.types';

// Usage from other features
import { TourCard, useTours, tourService } from '@/features/tours';
import type { Tour } from '@/features/tours';
```

---

## 5. Constants Organization

### 5.1 API Endpoints

```typescript
// lib/constants/api-endpoints.ts
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    REQUEST_PASSWORD_RESET: '/auth/request-password-reset',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    ME: '/users/me',
    UPDATE_ME: '/users/me',
    DELETE_ME: '/users/me',
  },
  TOURS: {
    LIST: '/tours',
    MY_TOURS: '/tours/my',
    CREATE: '/tours',
    GET: (id: string) => `/tours/${id}`,
    UPDATE: (id: string) => `/tours/${id}`,
    DELETE: (id: string) => `/tours/${id}`,
    SEARCH: '/tours/search',
  },
  BOOKINGS: {
    LIST: '/bookings',
    CREATE: '/bookings',
    GET: (id: string) => `/bookings/${id}`,
    CANCEL: (id: string) => `/bookings/${id}/cancel`,
  },
} as const;
```

### 5.2 Route Paths

```typescript
// lib/constants/routes.ts
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Protected routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',

  // Feature routes with helpers
  TOURS: {
    LIST: '/tours',
    DETAILS: (id: string) => `/tours/${id}`,
    CREATE: '/tours/create',
    EDIT: (id: string) => `/tours/${id}/edit`,
    MY_TOURS: '/my-tours',
  },
  BOOKINGS: {
    LIST: '/bookings',
    DETAILS: (id: string) => `/bookings/${id}`,
  },
} as const;
```

### 5.3 App Constants

```typescript
// lib/constants/app.constants.ts
export const APP_NAME = 'Tourism Georgia';
export const APP_DESCRIPTION = 'Discover the best tours in Georgia';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const USER_ROLES = {
  USER: 'USER',
  COMPANY: 'COMPANY',
  ADMIN: 'ADMIN',
} as const;

export const CURRENCIES = {
  GEL: 'GEL',
  USD: 'USD',
  EUR: 'EUR',
} as const;

export const TOUR_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;
```

---

## 6. Environment Variables

### 6.1 Naming Convention

```env
# React (Vite) - Prefix with VITE_
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Tourism Georgia
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx

# Next.js - Public variables prefix with NEXT_PUBLIC_
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_APP_NAME=Tourism Georgia
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxx

# Server-only (Next.js) - No prefix
DATABASE_URL=postgres://...
JWT_SECRET=xxx
```

### 6.2 Environment File Structure

```
.env                    # Default values (committed to repo)
.env.local             # Local overrides (gitignored)
.env.development       # Development defaults
.env.production        # Production defaults
.env.example           # Template with all variables (committed)
```

### 6.3 Type-Safe Environment

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_APP_NAME: z.string().min(1),
  VITE_STRIPE_PUBLIC_KEY: z.string().startsWith('pk_').optional(),
});

// Validate at build time
export const env = envSchema.parse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  VITE_STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
});

// Usage
import { env } from '@/lib/env';
const apiUrl = env.VITE_API_BASE_URL;
```

### 6.4 Environment Rules

```
✅ DO:
- Prefix client-exposed variables (VITE_ or NEXT_PUBLIC_)
- Provide .env.example with all required variables
- Validate env at build time with Zod
- Use typed env object throughout app

❌ NEVER:
- Commit .env with real secrets
- Expose server-only secrets to client
- Use process.env directly (use typed env)
- Hardcode API URLs or keys
```

---

## 7. Naming Conventions

### 7.1 Variables & Functions

```typescript
// Variables: camelCase
const userName = 'John';
const tourList = [];
const isLoading = true;
const hasError = false;

// Functions: camelCase, verb + noun
const getUserData = () => { ... };
const handleSubmit = () => { ... };
const formatPrice = () => { ... };
const validateEmail = () => { ... };

// Boolean variables: is/has/can/should prefix
const isAuthenticated = true;
const hasPermission = false;
const canEdit = true;
const shouldRefetch = false;
```

### 7.2 Types & Interfaces

```typescript
// Types/Interfaces: PascalCase
interface User { ... }
interface TourFilters { ... }
type UserRole = 'USER' | 'ADMIN';

// Props interfaces: ComponentNameProps
interface TourCardProps { ... }
interface LoginFormProps { ... }

// State interfaces: ComponentNameState (if needed)
interface AuthState { ... }
```

### 7.3 Constants

```typescript
// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const DEFAULT_PAGE_SIZE = 10;

// Const objects: UPPER_SNAKE_CASE name, camelCase or UPPER_CASE keys
const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
};

const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};
```

---

## 8. Quick Reference

### 8.1 File Types Cheat Sheet

| What | Where | Name |
|------|-------|------|
| UI Component | `components/ui/` | `button.tsx` |
| Common Component | `components/common/` | `LoadingSpinner.tsx` |
| Layout Component | `components/layout/` | `Header.tsx` |
| Feature Component | `features/X/components/` | `TourCard.tsx` |
| Page Component | `features/X/pages/` or `app/` | `ToursPage.tsx` |
| Custom Hook | `hooks/` or `features/X/hooks/` | `useTours.ts` |
| Service | `features/X/services/` | `tour.service.ts` |
| Types | `types/` or `features/X/types/` | `tour.types.ts` |
| Utils | `lib/utils/` | `format.utils.ts` |
| Constants | `lib/constants/` | `routes.ts` |
| Schema | `features/X/schemas/` | `tour.schemas.ts` |

### 8.2 Structure Checklist

- [ ] All features in `features/` folder
- [ ] Each feature has consistent internal structure
- [ ] Named exports used (except pages)
- [ ] Barrel exports in feature `index.ts`
- [ ] Imports follow defined order
- [ ] Path aliases configured and used
- [ ] Environment variables typed and validated
- [ ] Constants organized by domain

---

**Version**: 2.0
**Last Updated**: 2025-01-30
