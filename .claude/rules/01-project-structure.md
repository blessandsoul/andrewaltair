# Project Structure & Naming

## Tech Stack
Next.js 14 (App Router), TypeScript, Tailwind CSS 4, Radix UI, Mongoose/MongoDB, Vitest

## Folder Structure
```
src/
├── app/              # Next.js routes + API routes (app/api/)
├── components/       # UI and domain components
│   ├── ui/          # Radix UI primitives (button, card, input, etc.)
│   ├── layout/      # Header, Footer, Navigation
│   ├── universal/   # Shared cross-feature components
│   └── [domain]/    # Domain-specific (blog/, admin/, home/, etc.)
├── models/           # Mongoose models with TypeScript interfaces
├── services/         # Business logic (static class methods)
├── lib/              # Utilities, db connection, auth, email, etc.
├── hooks/            # Custom React hooks
├── features/         # Feature modules (when self-contained)
├── types/            # Global TypeScript types
├── config/           # Configuration files
└── data/             # Static data files
```

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `TourCard.tsx` |
| Pages | `page.tsx` in route folder | `app/tours/page.tsx` |
| API routes | `route.ts` in api folder | `app/api/tours/route.ts` |
| Hooks | camelCase + `use` prefix | `useAuth.ts` |
| Services | camelCase + `.service` | `post.service.ts` |
| Models | PascalCase | `User.ts`, `Post.ts` |
| Types | camelCase + `.types` | `post.types.ts` |
| Utils | camelCase | `utils.ts`, `helpers.ts` |
| Tests | Same name + `.test` | `PostService.test.ts` |

## Import Order (Strict)
1. React/Next.js imports
2. Third-party libraries (alphabetical)
3. UI components (`@/components/ui/`)
4. Domain components (`@/components/[domain]/`)
5. Hooks (`@/hooks/`)
6. Services (`@/services/`)
7. Types (use `import type`)
8. Utils & constants (`@/lib/`)

## Import Rules
- Use `@/` alias for all imports (configured in tsconfig)
- Use `import type` for type-only imports
- Named exports for everything (default exports only for Next.js pages/layouts)
- No deep relative paths (`../../../`) — always use `@/`

## Variables & Functions
- Variables/functions: `camelCase` — `userName`, `handleSubmit`
- Booleans: `is/has/can/should` prefix — `isLoading`, `hasError`
- Constants: `UPPER_SNAKE_CASE` — `API_BASE_URL`, `MAX_FILE_SIZE`
- Types/Interfaces: `PascalCase` — `IUser`, `PostQueryOptions`
- Event handlers: `handle<Event>` internally, `on<Event>` as props
