# API & Error Handling

## API Response Format
All API routes return a consistent structure:

```ts
// Success
{ success: true, message: "...", data: T }

// Error
{ success: false, error: { code: "ERROR_CODE", message: "Human-readable message" } }

// Paginated
{ success: true, message: "...", data: { items: T[], pagination: { page, limit, totalItems, totalPages, hasNextPage, hasPreviousPage } } }
```

## API Route Pattern
```ts
export async function GET(request: Request) {
  try {
    await dbConnect();
    const data = await SomeService.getData();
    return Response.json({ success: true, message: 'Retrieved', data });
  } catch (error) {
    return Response.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch' } },
      { status: 500 }
    );
  }
}
```

## Error Handling Rules
- Never swallow errors silently — always log and respond
- Never expose stack traces, SQL/Mongo queries, or file paths to clients
- Use descriptive error codes: `DOMAIN_ACTION_REASON` format (e.g., `TOUR_NOT_FOUND`, `AUTH_TOKEN_EXPIRED`)
- Preserve error context when re-throwing

## Client-Side Error Handling
```ts
// Extract user-friendly message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}
```

- Show errors via toast notifications (sonner) for mutations
- Show inline `ErrorMessage` component for page-level errors
- Show loading skeletons while data loads, not spinners where possible

## Loading States
- Use `loading.tsx` for route-level loading (Next.js convention)
- Use skeleton components that match the content shape
- Use `<Suspense>` boundaries for streaming

## Toast Pattern
```ts
import { toast } from 'sonner';
toast.success('Saved successfully');
toast.error(getErrorMessage(error));
```
