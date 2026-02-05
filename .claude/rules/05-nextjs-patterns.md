# Next.js Patterns

## Server vs Client Components

**Server Components (default)** — no `'use client'` directive:
- Async data fetching with `await`
- Access to server-only resources (DB, env vars without `NEXT_PUBLIC_`)
- No hooks, no event handlers, no browser APIs

**Client Components** — add `'use client'` at top:
- `useState`, `useEffect`, all React hooks
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`localStorage`, `window`)

**Composition pattern:** Server Component fetches data, passes to Client Component for interactivity.

## File Conventions

| File | Purpose |
|------|---------|
| `page.tsx` | Route UI (default export) |
| `layout.tsx` | Shared layout wrapping `children` |
| `loading.tsx` | Loading UI (auto Suspense boundary) |
| `error.tsx` | Error boundary (`'use client'` required) |
| `not-found.tsx` | 404 UI |
| `route.ts` | API endpoint (GET, POST, etc.) |

## API Routes
```ts
// app/api/posts/route.ts
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  await dbConnect();
  const posts = await PostService.getAllPosts();
  return Response.json({ success: true, data: posts });
}

export async function POST(request: Request) {
  const body = await request.json();
  const post = await PostService.createPost(body);
  return Response.json({ success: true, data: post }, { status: 201 });
}
```

## Dynamic Routes
```ts
// app/tours/[id]/page.tsx
export default async function TourPage({ params }: { params: { id: string } }) {
  const tour = await getTour(params.id);
  if (!tour) notFound();
  return <TourDetails tour={tour} />;
}
```

## Metadata
```ts
export const metadata: Metadata = { title: 'Page Title', description: '...' };

// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const tour = await getTour(params.id);
  return { title: tour?.title };
}
```

## Navigation
- `<Link href="/tours">` for links (auto-prefetches)
- `useRouter()` from `next/navigation` for programmatic navigation (`'use client'`)
- `usePathname()` for active link detection
- `useSearchParams()` for query params

## Streaming
Use `<Suspense>` boundaries to stream independent sections:
```tsx
<Suspense fallback={<Skeleton />}>
  <SlowComponent />
</Suspense>
```

## Environment Variables
- Public (client-accessible): `NEXT_PUBLIC_*` prefix
- Private (server-only): no prefix — `MONGODB_URI`, `JWT_SECRET`, etc.
- Never expose server-only vars to client components
