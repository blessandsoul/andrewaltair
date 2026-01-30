---
trigger: always_on
---

> **SCOPE**: These rules apply specifically to **Next.js App Router** projects.
> For shared rules, see `/client/` directory.

# Next.js Fundamentals

## Version: 1.0

---

## 1. Project Structure

### 1.1 Next.js App Router Structure

```
my-nextjs-app/
├── app/                        # App Router
│   ├── (auth)/                # Route group (no URL impact)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (main)/                # Main layout group
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Home page
│   │   ├── tours/
│   │   │   ├── page.tsx       # /tours
│   │   │   └── [id]/
│   │   │       └── page.tsx   # /tours/:id
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── api/                   # API routes (if needed)
│   │   └── [...]/route.ts
│   ├── layout.tsx             # Root layout
│   ├── loading.tsx            # Root loading
│   ├── error.tsx              # Root error
│   ├── not-found.tsx          # 404 page
│   └── globals.css
├── src/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── store/
│   └── types/
├── public/
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 2. File Conventions

### 2.1 Special Files

| File | Purpose |
|------|---------|
| `page.tsx` | Route UI |
| `layout.tsx` | Shared layout for segment |
| `loading.tsx` | Loading UI (Suspense) |
| `error.tsx` | Error boundary |
| `not-found.tsx` | 404 UI |
| `route.ts` | API endpoint |
| `template.tsx` | Re-rendered layout |
| `default.tsx` | Parallel route fallback |

### 2.2 Page Component

```typescript
// app/tours/page.tsx

// Metadata (for SEO)
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tours | Tourism Georgia',
  description: 'Explore the best tours in Georgia',
};

// Default export for page
export default function ToursPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">Tours</h1>
      {/* Page content */}
    </div>
  );
}
```

### 2.3 Dynamic Routes

```typescript
// app/tours/[id]/page.tsx

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Generate metadata dynamically
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tour = await getTour(params.id);

  return {
    title: `${tour?.title} | Tourism Georgia`,
    description: tour?.summary,
  };
}

export default async function TourDetailsPage({ params }: PageProps) {
  const tour = await getTour(params.id);

  if (!tour) {
    notFound();
  }

  return (
    <div>
      <h1>{tour.title}</h1>
      {/* Tour details */}
    </div>
  );
}
```

---

## 3. Layouts

### 3.1 Root Layout

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Tourism Georgia',
    template: '%s | Tourism Georgia',
  },
  description: 'Discover the best tours in Georgia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 3.2 Nested Layout

```typescript
// app/(main)/layout.tsx
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
```

---

## 4. Server vs Client Components

### 4.1 Server Components (Default)

```typescript
// app/tours/page.tsx
// This is a Server Component by default

import { getTours } from '@/lib/api/tours';

export default async function ToursPage() {
  // Fetch data on the server
  const tours = await getTours();

  return (
    <div>
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}

// ✅ CAN DO in Server Components:
// - async/await for data fetching
// - Access backend resources directly
// - Keep sensitive data (API keys) server-side
// - Reduce client bundle size

// ❌ CANNOT DO in Server Components:
// - useState, useEffect, or any hooks
// - Event handlers (onClick, onChange)
// - Browser APIs (localStorage, window)
// - Context that uses hooks
```

### 4.2 Client Components

```typescript
// components/TourFilters.tsx
'use client';  // Mark as Client Component

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const TourFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [city, setCity] = useState(searchParams.get('city') || '');

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams);
    if (city) {
      params.set('city', city);
    } else {
      params.delete('city');
    }
    router.push(`/tours?${params.toString()}`);
  };

  return (
    <div>
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Filter by city"
      />
      <button onClick={handleFilter}>Apply</button>
    </div>
  );
};

// ✅ CAN DO in Client Components:
// - useState, useEffect, all React hooks
// - Event handlers
// - Browser APIs
// - Third-party libraries that use hooks

// ❌ CANNOT DO in Client Components:
// - async component (no async function component)
// - Direct database access
```

### 4.3 Composition Pattern

```typescript
// app/tours/page.tsx (Server Component)
import { getTours } from '@/lib/api/tours';
import { TourFilters } from '@/components/TourFilters';  // Client
import { TourList } from '@/components/TourList';        // Server

export default async function ToursPage({
  searchParams,
}: {
  searchParams: { city?: string };
}) {
  const tours = await getTours({ city: searchParams.city });

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Client Component for interactivity */}
      <aside className="col-span-1">
        <TourFilters />
      </aside>

      {/* Server Component with data */}
      <section className="col-span-3">
        <TourList tours={tours} />
      </section>
    </div>
  );
}
```

---

## 5. Loading & Error States

### 5.1 Loading UI

```typescript
// app/tours/loading.tsx
import { TourListSkeleton } from '@/components/common/Skeletons';

export default function ToursLoading() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Tours</h1>
      <TourListSkeleton count={6} />
    </div>
  );
}
```

### 5.2 Error Boundary

```typescript
// app/tours/error.tsx
'use client';  // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function ToursError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

### 5.3 Not Found

```typescript
// app/tours/[id]/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TourNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-2xl font-bold mb-4">Tour Not Found</h2>
      <p className="text-muted-foreground mb-4">
        The tour you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link href="/tours">Browse Tours</Link>
      </Button>
    </div>
  );
}
```

---

## 6. Navigation

### 6.1 Link Component

```typescript
import Link from 'next/link';

// Basic link
<Link href="/tours">Tours</Link>

// With dynamic route
<Link href={`/tours/${tour.id}`}>{tour.title}</Link>

// Replace instead of push
<Link href="/login" replace>Login</Link>

// Prefetch disabled
<Link href="/tours" prefetch={false}>Tours</Link>
```

### 6.2 Programmatic Navigation

```typescript
'use client';

import { useRouter } from 'next/navigation';

export const TourCard = ({ tour }: { tour: Tour }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/tours/${tour.id}`);
  };

  // Other navigation methods
  // router.replace('/login');
  // router.back();
  // router.forward();
  // router.refresh();  // Re-fetch server components

  return (
    <div onClick={handleClick}>
      {tour.title}
    </div>
  );
};
```

### 6.3 Active Links

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        'px-4 py-2 rounded-md transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-accent'
      )}
    >
      {children}
    </Link>
  );
};
```

---

## 7. Providers Setup

```typescript
// components/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import { store } from '@/store';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient inside component to avoid sharing between requests
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-right" richColors />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}
```

---

## 8. Environment Variables

```env
# .env.local

# Server-only (no prefix)
DATABASE_URL=postgres://...
JWT_SECRET=xxx

# Public (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_APP_NAME=Tourism Georgia
```

```typescript
// Access
// Server-only: process.env.DATABASE_URL
// Client: process.env.NEXT_PUBLIC_API_BASE_URL
```

---

## 9. Checklist

- [ ] App Router structure with route groups
- [ ] Root layout with metadata
- [ ] Server Components for data fetching
- [ ] Client Components for interactivity ('use client')
- [ ] loading.tsx for loading states
- [ ] error.tsx for error handling
- [ ] Providers in Client Component wrapper
- [ ] Environment variables prefixed correctly

---

**Version**: 1.0
**Last Updated**: 2025-01-30
