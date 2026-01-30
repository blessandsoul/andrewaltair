---
trigger: always_on
---

> **SCOPE**: These rules apply specifically to **Next.js App Router** projects.
> For shared rules, see `/client/` directory.

# Next.js Data Fetching

## Version: 1.0

---

## 1. Data Fetching Strategies

### 1.1 Decision Matrix

| Scenario | Strategy | Where |
|----------|----------|-------|
| Static content | Build-time fetch | Server Component |
| Dynamic content | Request-time fetch | Server Component |
| User-specific data | Client fetch | Client Component + React Query |
| Real-time updates | Client fetch + polling/WS | Client Component |
| Form submissions | Server Actions | Server Action |

---

## 2. Server Component Fetching

### 2.1 Basic Pattern

```typescript
// app/tours/page.tsx
import { getTours } from '@/lib/api/tours';

export default async function ToursPage() {
  // Fetches on the server at request time
  const tours = await getTours();

  return (
    <div>
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}
```

### 2.2 Parallel Data Fetching

```typescript
// app/dashboard/page.tsx
import { getTours, getBookings, getStats } from '@/lib/api';

export default async function DashboardPage() {
  // Fetch in parallel - much faster!
  const [tours, bookings, stats] = await Promise.all([
    getTours({ limit: 5 }),
    getBookings({ limit: 5 }),
    getStats(),
  ]);

  return (
    <div className="grid grid-cols-3 gap-6">
      <StatsCard stats={stats} />
      <RecentTours tours={tours} />
      <RecentBookings bookings={bookings} />
    </div>
  );
}
```

### 2.3 With Error Handling

```typescript
// app/tours/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getTour } from '@/lib/api/tours';

export default async function TourDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const tour = await getTour(params.id);

  // Trigger not-found.tsx
  if (!tour) {
    notFound();
  }

  return (
    <div>
      <h1>{tour.title}</h1>
      {/* ... */}
    </div>
  );
}
```

---

## 3. API Functions

### 3.1 Server-Side API Calls

```typescript
// lib/api/tours.ts

// These functions run on the server
// Can access internal APIs, databases, etc.

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

interface FetchOptions {
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
}

async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { cache = 'no-store', revalidate, tags } = options;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    cache,
    next: {
      revalidate,
      tags,
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}

export async function getTours(params: TourFilters = {}): Promise<Tour[]> {
  const searchParams = new URLSearchParams();
  if (params.city) searchParams.set('city', params.city);
  if (params.page) searchParams.set('page', String(params.page));

  return fetchApi<Tour[]>(`/tours?${searchParams}`, {
    revalidate: 60, // Revalidate every 60 seconds
    tags: ['tours'],
  });
}

export async function getTour(id: string): Promise<Tour | null> {
  try {
    return await fetchApi<Tour>(`/tours/${id}`, {
      tags: [`tour-${id}`],
    });
  } catch {
    return null;
  }
}
```

---

## 4. Caching & Revalidation

### 4.1 Caching Options

```typescript
// No caching (default for dynamic data)
fetch(url, { cache: 'no-store' });

// Cache indefinitely (static data)
fetch(url, { cache: 'force-cache' });

// Time-based revalidation
fetch(url, { next: { revalidate: 60 } }); // Revalidate after 60 seconds

// Tag-based revalidation
fetch(url, { next: { tags: ['tours'] } });
```

### 4.2 Route Segment Config

```typescript
// app/tours/page.tsx

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Or force static with revalidation
export const revalidate = 60;

// Other options:
// export const dynamic = 'force-static';
// export const dynamic = 'auto';
// export const revalidate = false; // No revalidation (static)
```

### 4.3 On-Demand Revalidation

```typescript
// app/api/revalidate/route.ts
import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { tag, path, secret } = await request.json();

  // Verify secret
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  if (tag) {
    revalidateTag(tag);
  }

  if (path) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}

// Usage: POST /api/revalidate
// Body: { "tag": "tours", "secret": "xxx" }
```

---

## 5. Client-Side Fetching

### 5.1 When to Use React Query

Use React Query in Client Components for:
- User-specific data (requires auth)
- Real-time updates
- Optimistic updates
- Infinite scroll

```typescript
// components/UserBookings.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/features/bookings/services/booking.service';

export const UserBookings = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['bookings', 'my'],
    queryFn: () => bookingService.getMyBookings(),
  });

  if (isLoading) return <BookingsSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data?.items.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
};
```

### 5.2 Hybrid Pattern

```typescript
// app/tours/page.tsx (Server Component)
import { getTours } from '@/lib/api/tours';
import { TourInteractions } from '@/components/TourInteractions';

export default async function ToursPage() {
  // Initial data from server
  const initialTours = await getTours();

  return (
    <div>
      {/* Static content from server */}
      <h1>Tours</h1>

      {/* Interactive client component with initial data */}
      <TourInteractions initialData={initialTours} />
    </div>
  );
}

// components/TourInteractions.tsx
'use client';

import { useQuery } from '@tanstack/react-query';

export const TourInteractions = ({ initialData }: { initialData: Tour[] }) => {
  const { data: tours } = useQuery({
    queryKey: ['tours'],
    queryFn: () => tourService.getTours(),
    initialData,  // Use server data as initial
  });

  // Can now use client features: filters, favorites, etc.
};
```

---

## 6. Server Actions

### 6.1 Form Actions

```typescript
// app/tours/create/page.tsx
import { createTour } from '@/app/actions/tours';

export default function CreateTourPage() {
  return (
    <form action={createTour}>
      <input name="title" required />
      <input name="price" type="number" required />
      <button type="submit">Create Tour</button>
    </form>
  );
}

// app/actions/tours.ts
'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const createTourSchema = z.object({
  title: z.string().min(1),
  price: z.coerce.number().min(0),
});

export async function createTour(formData: FormData) {
  const data = createTourSchema.parse({
    title: formData.get('title'),
    price: formData.get('price'),
  });

  const response = await fetch(`${API_URL}/tours`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create tour');
  }

  revalidateTag('tours');
  redirect('/tours');
}
```

### 6.2 With useActionState

```typescript
// components/CreateTourForm.tsx
'use client';

import { useActionState } from 'react';
import { createTour } from '@/app/actions/tours';

export const CreateTourForm = () => {
  const [state, formAction, isPending] = useActionState(createTour, null);

  return (
    <form action={formAction}>
      <input name="title" required />
      <input name="price" type="number" required />

      {state?.error && (
        <p className="text-destructive">{state.error}</p>
      )}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Tour'}
      </button>
    </form>
  );
};

// Updated action to return state
// app/actions/tours.ts
'use server';

export async function createTour(prevState: any, formData: FormData) {
  try {
    // ... create tour
    revalidateTag('tours');
    redirect('/tours');
  } catch (error) {
    return { error: 'Failed to create tour' };
  }
}
```

---

## 7. Streaming & Suspense

### 7.1 Streaming with Loading UI

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { StatsCard, StatsCardSkeleton } from './StatsCard';
import { RecentTours, ToursSkeleton } from './RecentTours';
import { RecentBookings, BookingsSkeleton } from './RecentBookings';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Each section streams independently */}
      <Suspense fallback={<StatsCardSkeleton />}>
        <StatsCard />
      </Suspense>

      <Suspense fallback={<ToursSkeleton />}>
        <RecentTours />
      </Suspense>

      <Suspense fallback={<BookingsSkeleton />}>
        <RecentBookings />
      </Suspense>
    </div>
  );
}

// These are async Server Components
async function StatsCard() {
  const stats = await getStats(); // Slow fetch
  return <Card>{/* stats */}</Card>;
}

async function RecentTours() {
  const tours = await getTours({ limit: 5 });
  return <Card>{/* tours */}</Card>;
}
```

---

## 8. Common Patterns

### 8.1 Search with URL State

```typescript
// app/tours/page.tsx
export default async function ToursPage({
  searchParams,
}: {
  searchParams: { q?: string; city?: string; page?: string };
}) {
  const tours = await getTours({
    search: searchParams.q,
    city: searchParams.city,
    page: parseInt(searchParams.page || '1'),
  });

  return (
    <div>
      <SearchFilters />
      <TourList tours={tours} />
    </div>
  );
}

// components/SearchFilters.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export const SearchFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); // Reset page
    router.push(`/tours?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div>
      <input
        defaultValue={searchParams.get('q') || ''}
        onChange={(e) => updateParams('q', e.target.value)}
        placeholder="Search..."
      />
    </div>
  );
};
```

---

## 9. Checklist

- [ ] Server Components fetch data with async/await
- [ ] Parallel fetches use Promise.all
- [ ] Caching strategy defined per route
- [ ] Tags used for on-demand revalidation
- [ ] Client Components use React Query for dynamic data
- [ ] Server Actions handle form submissions
- [ ] Suspense boundaries for streaming
- [ ] URL state for shareable filters

---

**Version**: 1.0
**Last Updated**: 2025-01-30
