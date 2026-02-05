# TypeScript Rules

## Strict Mode
All strict checks enabled: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`.

## Core Rules
- **No `any`** — use `unknown` for truly unknown data, generics for flexible typing
- **Explicit return types** on public/exported functions
- **No type assertions** (`as`) without justification — prefer type guards
- **No TypeScript enums** — use `as const` objects or union types

## Type vs Interface

| Use Case | Use |
|----------|-----|
| Component props, domain entities, API responses | `interface` |
| Union types, function signatures, utility derivations | `type` |

## Patterns

**Const objects over enums:**
```ts
export const USER_ROLES = { USER: 'USER', ADMIN: 'ADMIN' } as const;
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
```

**Type guards for runtime checks:**
```ts
function isUser(value: unknown): value is IUser {
  return typeof value === 'object' && value !== null && 'email' in value;
}
```

**Import types separately:**
```ts
import type { IUser } from '@/models/User';
```

## Mongoose Model Types
Models export both interface and model:
```ts
export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  // ...
}
const postSchema = new Schema({...});
export default mongoose.models.Post || mongoose.model<IPost>('Post', postSchema);
```

## Zod Integration
Derive form types from Zod schemas — no type duplication:
```ts
const schema = z.object({ title: z.string().min(1), price: z.number().min(0) });
type FormData = z.infer<typeof schema>;
```
