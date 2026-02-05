# State Management & Data Fetching

## State Strategy

| State Type | Tool | Examples |
|------------|------|----------|
| Server data (SSR/ISR) | Server Components + `fetch()` | Posts, tours, page content |
| Server data (client) | `fetch()` or SWR (if needed) | User-specific dynamic data |
| Local UI state | `useState` | Modals, toggles, form inputs |
| Complex local state | `useReducer` | Multi-field forms, wizards |
| URL state | `useSearchParams` | Filters, pagination, search |
| Form state | React Hook Form + Zod | All forms |

**No Redux/Zustand in this project.** Data fetching happens in Server Components.

## Server Component Data Fetching
```tsx
// app/tours/page.tsx — Server Component (default)
export default async function ToursPage() {
  const tours = await getTours();      // Direct async fetch
  return <TourList tours={tours} />;
}
```

- Use `Promise.all()` for parallel fetches
- Use `notFound()` from `next/navigation` when resource doesn't exist
- Set `export const dynamic = 'force-dynamic'` for non-cacheable routes
- Use `revalidatePath()` / `revalidateTag()` for ISR

## Service Layer Pattern
Services use **static class methods** (not instances):
```ts
export class PostService {
  static async getAllPosts(options: PostQueryOptions) {
    await dbConnect();
    return Post.find(query).sort(sort).skip(skip).limit(limit);
  }
}
// Usage: PostService.getAllPosts(options)
```

## Forms: React Hook Form + Zod
```tsx
const schema = z.object({ title: z.string().min(1), price: z.number().min(0) });
type FormData = z.infer<typeof schema>;

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

Rules:
- Schema defines validation, type is inferred from schema
- Show field errors immediately below inputs
- Disable submit button during submission
- Handle API errors by mapping to form fields via `setError()`
- `aria-invalid` on errored fields

## URL State for Filters/Pagination
```tsx
'use client';
const [searchParams, setSearchParams] = useSearchParams();
const page = parseInt(searchParams.get('page') || '1', 10);
```

## Derived State
Compute, don't store. Use `useMemo` for expensive computations, plain expressions for simple ones.
```tsx
// CORRECT
const activeTours = useMemo(() => tours.filter(t => t.isActive), [tours]);
// WRONG — redundant state
const [activeTours, setActiveTours] = useState([]);
useEffect(() => setActiveTours(tours.filter(...)), [tours]);
```
