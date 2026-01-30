---
trigger: always_on
---

> **SCOPE**: These rules apply to **all client projects** (React SPA and Next.js).

# TypeScript Rules & Type System

## Version: 2.0

---

## 1. Configuration

### 1.1 tsconfig.json Base

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",

    // Strict mode - ALL must be enabled
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Module settings
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,

    // Path aliases
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 1.2 Strict Mode Rules

| Setting | Required | Purpose |
|---------|----------|---------|
| `strict` | Yes | Enables all strict checks |
| `noUnusedLocals` | Yes | No unused variables |
| `noUnusedParameters` | Yes | No unused function params |
| `noUncheckedIndexedAccess` | Yes | Safe array/object access |
| `exactOptionalPropertyTypes` | Yes | Stricter optional props |

---

## 2. Type vs Interface

### 2.1 When to Use `interface`

Use for **object shapes** that may be extended:

```typescript
// ✅ Props - use interface
interface TourCardProps {
  tour: Tour;
  onClick?: (id: string) => void;
  className?: string;
}

// ✅ Domain models - use interface
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
}

// ✅ Extendable - use interface
interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface Tour extends BaseEntity {
  title: string;
  price: number;
}
```

### 2.2 When to Use `type`

Use for **unions, intersections, and utility types**:

```typescript
// ✅ Union types
type UserRole = 'USER' | 'COMPANY' | 'ADMIN';
type TourStatus = 'draft' | 'active' | 'inactive';
type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';

// ✅ Intersection types
type TourWithOwner = Tour & { owner: User };
type TourWithBookings = Tour & { bookings: Booking[] };

// ✅ Utility types
type PartialTour = Partial<Tour>;
type TourKeys = keyof Tour;
type CreateTourInput = Omit<Tour, 'id' | 'createdAt' | 'updatedAt'>;

// ✅ Function types
type ClickHandler = (event: React.MouseEvent) => void;
type AsyncFunction<T> = () => Promise<T>;

// ✅ Mapped types
type FormErrors<T> = { [K in keyof T]?: string };
```

### 2.3 Decision Table

| Use Case | Use | Example |
|----------|-----|---------|
| Component props | `interface` | `interface ButtonProps { ... }` |
| API response | `interface` | `interface ApiResponse<T> { ... }` |
| Domain entity | `interface` | `interface Tour { ... }` |
| Union of strings | `type` | `type Status = 'a' \| 'b'` |
| Function signature | `type` | `type Handler = () => void` |
| Combining types | `type` | `type A = B & C` |
| Utility derivation | `type` | `type X = Pick<Y, 'a'>` |

---

## 3. Strict Typing Rules

### 3.1 No `any` Type

```typescript
// ❌ NEVER use any
const data: any = fetchData();
function process(input: any) { ... }

// ✅ Use unknown for truly unknown data
const data: unknown = fetchData();
if (isValidData(data)) {
  // data is now typed
}

// ✅ Use generics for flexible typing
function process<T>(input: T): T { ... }

// ✅ Use specific types
const data: Tour[] = await fetchTours();
```

### 3.2 Explicit Return Types

```typescript
// ❌ BAD - Implicit return type
const fetchTour = async (id: string) => {
  const response = await api.get(`/tours/${id}`);
  return response.data;
};

// ✅ GOOD - Explicit return type
const fetchTour = async (id: string): Promise<Tour> => {
  const response = await api.get<ApiResponse<Tour>>(`/tours/${id}`);
  return response.data.data;
};

// ✅ GOOD - For simple functions, return type can be inferred
const formatPrice = (price: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
};
```

### 3.3 No Type Assertions (Escape Hatch)

```typescript
// ❌ AVOID - Type assertion (casting)
const tour = data as Tour;
const element = document.getElementById('app') as HTMLDivElement;

// ✅ PREFER - Type guards
function isTour(data: unknown): data is Tour {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data
  );
}

if (isTour(data)) {
  console.log(data.title);  // TypeScript knows it's a Tour
}

// ✅ ACCEPTABLE - Non-null assertion when you're certain
const id = useParams().id!;  // OK if route guarantees id exists
```

---

## 4. API Types

### 4.1 Response Types

```typescript
// lib/api/api.types.ts

// Standard success response
export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

// Paginated response
export interface PaginatedResponse<T> {
  success: true;
  message: string;
  data: {
    items: T[];
    pagination: PaginationMeta;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Error response
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

// Pagination params
export interface PaginationParams {
  page?: number;
  limit?: number;
}
```

### 4.2 Service Type Patterns

```typescript
// features/tours/services/tour.service.ts
import type { ApiResponse, PaginatedResponse } from '@/lib/api/api.types';
import type { Tour, CreateTourRequest, UpdateTourRequest, TourFilters } from '../types/tour.types';

class TourService {
  async getTours(params: TourFilters & PaginationParams): Promise<PaginatedResponse<Tour>['data']> {
    const response = await apiClient.get<PaginatedResponse<Tour>>('/tours', { params });
    return response.data.data;
  }

  async getTour(id: string): Promise<Tour> {
    const response = await apiClient.get<ApiResponse<Tour>>(`/tours/${id}`);
    return response.data.data;
  }

  async createTour(data: CreateTourRequest): Promise<Tour> {
    const response = await apiClient.post<ApiResponse<Tour>>('/tours', data);
    return response.data.data;
  }

  async updateTour(id: string, data: UpdateTourRequest): Promise<Tour> {
    const response = await apiClient.patch<ApiResponse<Tour>>(`/tours/${id}`, data);
    return response.data.data;
  }

  async deleteTour(id: string): Promise<void> {
    await apiClient.delete(`/tours/${id}`);
  }
}

export const tourService = new TourService();
```

---

## 5. Domain Types

### 5.1 Entity Types

```typescript
// features/auth/types/auth.types.ts

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'USER' | 'COMPANY' | 'ADMIN';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// State types
export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
}
```

```typescript
// features/tours/types/tour.types.ts

export interface Tour {
  id: string;
  ownerId: string;
  title: string;
  summary: string | null;
  description: string | null;
  price: number;
  currency: Currency;
  city: string | null;
  durationMinutes: number | null;
  maxPeople: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type Currency = 'GEL' | 'USD' | 'EUR';

// Request types - Omit auto-generated fields
export type CreateTourRequest = Omit<Tour, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>;

export type UpdateTourRequest = Partial<CreateTourRequest>;

// Filter types
export interface TourFilters {
  search?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'createdAt' | 'price' | 'title';
  sortOrder?: 'asc' | 'desc';
}
```

---

## 6. Component Types

### 6.1 Props Patterns

```typescript
// Base props pattern
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Extend for specific component
interface TourCardProps extends BaseComponentProps {
  tour: Tour;
  onSelect?: (id: string) => void;
}

// Generic data component
interface DataListProps<T> extends BaseComponentProps {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

// With HTML attributes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}
```

### 6.2 Event Handler Types

```typescript
// React event types
type ClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
type ChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;
type SubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void;
type KeyboardHandler = (event: React.KeyboardEvent<HTMLInputElement>) => void;

// Custom callback types
type SelectHandler<T> = (item: T) => void;
type ErrorHandler = (error: Error) => void;
type AsyncHandler<T> = () => Promise<T>;

// Usage in component
interface FormProps {
  onSubmit: (data: FormData) => void | Promise<void>;
  onCancel: () => void;
  onError?: ErrorHandler;
}
```

---

## 7. Type Guards

### 7.1 Standard Type Guards

```typescript
// Check for API error
export function isApiError(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'success' in error &&
    (error as ApiErrorResponse).success === false
  );
}

// Check for specific entity
export function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value &&
    'role' in value
  );
}

// Check for array of type
export function isTourArray(value: unknown): value is Tour[] {
  return Array.isArray(value) && value.every(isTour);
}

function isTour(value: unknown): value is Tour {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'price' in value
  );
}
```

### 7.2 Using Type Guards

```typescript
// In error handling
try {
  await createTour(data);
} catch (error) {
  if (isApiError(error)) {
    toast.error(error.error.message);
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('An unexpected error occurred');
  }
}

// In data validation
function processData(data: unknown) {
  if (isTour(data)) {
    // TypeScript knows data is Tour
    console.log(data.title);
  }
}
```

---

## 8. Utility Types

### 8.1 Built-in Utility Types

```typescript
// Pick specific properties
type TourPreview = Pick<Tour, 'id' | 'title' | 'price' | 'city'>;

// Omit specific properties
type TourInput = Omit<Tour, 'id' | 'createdAt' | 'updatedAt'>;

// Make all properties optional
type PartialTour = Partial<Tour>;

// Make all properties required
type RequiredTour = Required<Tour>;

// Make all properties readonly
type ReadonlyTour = Readonly<Tour>;

// Record type
type TourById = Record<string, Tour>;

// Extract from union
type AdminRole = Extract<UserRole, 'ADMIN'>;

// Exclude from union
type NonAdminRoles = Exclude<UserRole, 'ADMIN'>;

// Non-nullable
type DefinitelyString = NonNullable<string | null | undefined>;

// Return type of function
type ServiceReturn = ReturnType<typeof tourService.getTour>;

// Parameters of function
type ServiceParams = Parameters<typeof tourService.createTour>;
```

### 8.2 Custom Utility Types

```typescript
// Nullable type
type Nullable<T> = T | null;

// Optional type
type Optional<T> = T | undefined;

// Form errors type
type FormErrors<T> = { [K in keyof T]?: string };

// Deep partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Make specific fields required
type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Make specific fields optional
type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

---

## 9. Discriminated Unions

### 9.1 State Machine Pattern

```typescript
// Request state
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// Usage
const [state, setState] = useState<RequestState<Tour[]>>({ status: 'idle' });

// Type-safe access
if (state.status === 'success') {
  console.log(state.data);  // TypeScript knows data exists
}

if (state.status === 'error') {
  console.log(state.error);  // TypeScript knows error exists
}
```

### 9.2 Action Pattern (Redux-like)

```typescript
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; tokens: AuthTokens } }
  | { type: 'LOGIN_ERROR'; payload: { error: string } }
  | { type: 'LOGOUT' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,  // TypeScript knows payload exists
        tokens: action.payload.tokens,
      };
    case 'LOGIN_ERROR':
      return { ...state, isLoading: false, error: action.payload.error };
    case 'LOGOUT':
      return initialState;
  }
}
```

---

## 10. Zod Integration

### 10.1 Schema-Derived Types

```typescript
import { z } from 'zod';

// Define schema
const tourSchema = z.object({
  title: z.string().min(1).max(200),
  summary: z.string().max(1000).optional(),
  price: z.number().min(0),
  currency: z.enum(['GEL', 'USD', 'EUR']),
  city: z.string().optional(),
  durationMinutes: z.number().int().positive().optional(),
  maxPeople: z.number().int().positive().optional(),
});

// Derive type from schema - NO DUPLICATION
type TourFormData = z.infer<typeof tourSchema>;

// Use in form
const { register } = useForm<TourFormData>({
  resolver: zodResolver(tourSchema),
});
```

### 10.2 Shared Schemas

```typescript
// features/tours/schemas/tour.schemas.ts

// Base schemas
export const priceSchema = z.number().min(0).max(1000000);
export const currencySchema = z.enum(['GEL', 'USD', 'EUR']);

// Form schemas
export const createTourSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  summary: z.string().max(1000).optional(),
  price: priceSchema,
  currency: currencySchema.default('GEL'),
  city: z.string().optional(),
  durationMinutes: z.number().int().positive().optional(),
  maxPeople: z.number().int().positive().optional(),
});

export const updateTourSchema = createTourSchema.partial();

// Derived types
export type CreateTourFormData = z.infer<typeof createTourSchema>;
export type UpdateTourFormData = z.infer<typeof updateTourSchema>;
```

---

## 11. Enums vs Const Objects

### 11.1 Avoid TypeScript Enums

```typescript
// ❌ AVOID - TypeScript enums
enum UserRole {
  USER = 'USER',
  COMPANY = 'COMPANY',
  ADMIN = 'ADMIN',
}

// Problems:
// - Generate runtime code
// - Can't be tree-shaken
// - Behave unexpectedly with numeric values
```

### 11.2 Use Const Objects + Types

```typescript
// ✅ PREFERRED - Const object + type
export const USER_ROLES = {
  USER: 'USER',
  COMPANY: 'COMPANY',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
// Result: type UserRole = 'USER' | 'COMPANY' | 'ADMIN'

// ✅ SIMPLE ALTERNATIVE - Just the union type
export type UserRole = 'USER' | 'COMPANY' | 'ADMIN';
```

---

## 12. Type Checklist

Before completing any TypeScript code:

- [ ] No `any` types used
- [ ] Explicit return types on public functions
- [ ] `interface` for props and entities
- [ ] `type` for unions and utilities
- [ ] Type guards for runtime checks
- [ ] API response types match backend
- [ ] Zod schemas derive form types
- [ ] No type assertions without justification
- [ ] Props interfaces properly defined
- [ ] Generic types used where appropriate

---

**Version**: 2.0
**Last Updated**: 2025-01-30
