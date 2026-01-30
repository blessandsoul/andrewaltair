---
trigger: always_on
---

> **SCOPE**: These rules apply specifically to the **server** directory.

# Tourism Server – Pagination Contract

## Version: 2.0

---

## 1. Pagination Response Structure

All paginated endpoints MUST return this exact structure:

```typescript
interface PaginatedResponse<T> {
  success: true;
  message: string;
  data: {
    items: T[];
    pagination: {
      page: number;         // Current page (1-indexed)
      limit: number;        // Items per page
      totalItems: number;   // Total count across all pages
      totalPages: number;   // Calculated: ceil(totalItems / limit)
      hasNextPage: boolean; // true if page < totalPages
      hasPreviousPage: boolean; // true if page > 1
    };
  };
}
```

```json
{
  "success": true,
  "message": "Tours retrieved successfully",
  "data": {
    "items": [...],
    "pagination": {
      "page": 2,
      "limit": 10,
      "totalItems": 237,
      "totalPages": 24,
      "hasNextPage": true,
      "hasPreviousPage": true
    }
  }
}
```

---

## 2. Pagination Helper (Required)

### 2.1 Helper Function

```typescript
// src/shared/helpers/pagination.ts
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}

export function paginatedResponse<T>(
  message: string,
  items: T[],
  page: number,
  limit: number,
  totalItems: number
): SuccessResponse<PaginatedData<T>> {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    success: true,
    message,
    data: {
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  };
}
```

### 2.2 Usage (Required)

```typescript
// ✅ CORRECT: Use the helper
return reply.send(
  paginatedResponse('Tours retrieved successfully', tours, page, limit, totalCount)
);
```

---

## 3. Input Validation (Required)

### 3.1 Pagination Schema

```typescript
// src/shared/schemas/common.ts
import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type PaginationParams = z.infer<typeof PaginationSchema>;
```

### 3.2 Validation Rules

| Parameter | Type | Default | Min | Max |
|-----------|------|---------|-----|-----|
| `page` | integer | 1 | 1 | — |
| `limit` | integer | 10 | 1 | 100 |

- Use `z.coerce.number()` to handle query string conversion
- Pages are 1-indexed (never 0-indexed)
- Maximum limit of 100 prevents resource exhaustion

---

## 4. Controller Layer

### 4.1 Controller Implementation

```typescript
// src/modules/tours/tour.controller.ts
import { PaginationSchema } from '@/shared/schemas/common';
import { paginatedResponse } from '@/shared/helpers/pagination';

export const tourController = {
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    // Step 1: Validate pagination params
    const { page, limit } = PaginationSchema.parse(request.query);

    // Step 2: Parse domain-specific filters
    const filters = TourFiltersSchema.parse(request.query);

    // Step 3: Call service with pagination
    const { items, totalItems } = await tourService.findAll({
      ...filters,
      page,
      limit,
    });

    // Step 4: Return using helper
    return reply.send(
      paginatedResponse('Tours retrieved successfully', items, page, limit, totalItems)
    );
  },
};
```

### 4.2 Controller Rules

| ✅ DO | ❌ DON'T |
|-------|---------|
| Validate pagination input | Accept raw query params |
| Use `paginatedResponse` helper | Build pagination manually |
| Calculate metadata in helper | Calculate in controller |

---

## 5. Service Layer

### 5.1 Service Implementation

```typescript
// src/modules/tours/tour.service.ts
export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
}

export const tourService = {
  async findAll(params: TourFilters & PaginationParams): Promise<PaginatedResult<Tour>> {
    const { page, limit, ...filters } = params;

    // Service calculates offset
    const offset = (page - 1) * limit;

    // Call repository with offset and limit
    const { items, totalItems } = await tourRepo.findMany({
      ...filters,
      offset,
      limit,
    });

    return { items, totalItems };
  },
};
```

### 5.2 Service Rules

| Responsibility | Location |
|---------------|----------|
| Calculate offset | Service |
| Return items + totalItems | Service |
| Build pagination metadata | Controller (via helper) |

```typescript
// Service returns:
return {
  items: tours,
  totalItems: count,
};

// NOT:
return {
  items: tours,
  pagination: { ... },  // NO - controller handles this
};
```

---

## 6. Repository Layer

### 6.1 Repository Implementation

```typescript
// src/modules/tours/tour.repo.ts
export const tourRepo = {
  async findMany(params: {
    offset: number;
    limit: number;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<{ items: Tour[]; totalItems: number }> {
    const where = buildWhereClause(params);

    // Execute both queries in parallel
    const [items, totalItems] = await Promise.all([
      prisma.tour.findMany({
        where,
        skip: params.offset,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.tour.count({ where }),
    ]);

    return { items, totalItems };
  },
};
```

### 6.2 Query Optimization

```typescript
// ✅ Count with same WHERE clause
const where = { isActive: true, city: filters.city };
const [items, totalItems] = await Promise.all([
  prisma.tour.findMany({ where, skip, take }),
  prisma.tour.count({ where }),  // Same where clause
]);

// ❌ Count without filters (wrong total)
const totalItems = await prisma.tour.count();  // Ignores filters!
```

---

## 7. Filters & Sorting with Pagination

### 7.1 Query Parameter Order

```
?category=adventure&minPrice=100&sortBy=price&order=asc&page=2&limit=20
 └─────── filters ───────┘  └──── sorting ────┘  └─ pagination ─┘
```

### 7.2 Combined Schema

```typescript
// src/modules/tours/tour.schemas.ts
export const TourQuerySchema = z.object({
  // Filters
  category: z.string().optional(),
  city: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),

  // Sorting
  sortBy: z.enum(['price', 'rating', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),

  // Pagination (extends base schema)
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
```

### 7.3 Processing Order

```typescript
// 1. Apply WHERE (filters)
// 2. Apply ORDER BY (sorting)
// 3. Apply LIMIT/OFFSET (pagination)

const items = await prisma.tour.findMany({
  where: {                          // 1. Filters
    category: filters.category,
    price: { gte: filters.minPrice, lte: filters.maxPrice },
  },
  orderBy: { [filters.sortBy]: filters.order },  // 2. Sorting
  skip: offset,                     // 3. Pagination
  take: limit,
});
```

---

## 8. Strict Prohibitions

### 8.1 Forbidden Response Patterns

```typescript
// ❌ Raw array without wrapper
reply.send(tours);

// ❌ Custom pagination field names
reply.send({
  success: true,
  data: {
    items: tours,
    pageNumber: 2,      // Should be "page"
    perPage: 10,        // Should be "limit"
    count: 237,         // Should be "totalItems"
  },
});

// ❌ Zero-indexed pages
pagination: { page: 0, ... }  // Should start at 1

// ❌ Missing pagination fields
pagination: { page: 1, totalItems: 237 }  // Missing limit, totalPages, etc.

// ❌ Custom structure
reply.send({ tours, page, total });
reply.send({ items: tours, meta: { ... } });
```

### 8.2 Forbidden Implementation Patterns

```typescript
// ❌ Calculate pagination in repository
async findMany() {
  return {
    items,
    pagination: { page, totalPages, ... },  // NO
  };
}

// ❌ Skip validation
const page = request.query.page || 1;  // No type safety

// ❌ Unlimited results
const limit = request.query.limit || 1000;  // Too high
```

---

## 9. Example: Complete Flow

### 9.1 Route Definition

```typescript
// src/modules/tours/tour.routes.ts
export async function tourRoutes(fastify: FastifyInstance) {
  fastify.get('/', tourController.getAll);
}
```

### 9.2 Controller

```typescript
// src/modules/tours/tour.controller.ts
async getAll(request: FastifyRequest, reply: FastifyReply) {
  const query = TourQuerySchema.parse(request.query);
  const { page, limit, ...filters } = query;

  const { items, totalItems } = await tourService.findAll({ ...filters, page, limit });

  return reply.send(
    paginatedResponse('Tours retrieved successfully', items, page, limit, totalItems)
  );
}
```

### 9.3 Service

```typescript
// src/modules/tours/tour.service.ts
async findAll(params: TourQueryParams): Promise<PaginatedResult<Tour>> {
  const { page, limit, ...filters } = params;
  const offset = (page - 1) * limit;

  return tourRepo.findMany({ ...filters, offset, limit });
}
```

### 9.4 Repository

```typescript
// src/modules/tours/tour.repo.ts
async findMany(params: RepoParams): Promise<{ items: Tour[]; totalItems: number }> {
  const where = buildWhereClause(params);

  const [items, totalItems] = await Promise.all([
    prisma.tour.findMany({
      where,
      skip: params.offset,
      take: params.limit,
      orderBy: { [params.sortBy]: params.order },
    }),
    prisma.tour.count({ where }),
  ]);

  return { items, totalItems };
}
```

---

## 10. Checklist

- [ ] All paginated endpoints use `paginatedResponse` helper
- [ ] Pagination input validated with `PaginationSchema`
- [ ] Pages are 1-indexed (never 0)
- [ ] Maximum limit is 100
- [ ] Services calculate offset: `(page - 1) * limit`
- [ ] Services return `{ items, totalItems }`
- [ ] Count query uses same WHERE clause as items query
- [ ] Filters applied before pagination
- [ ] All pagination fields present in response

---

**Version**: 2.0
**Last Updated**: 2025-01-30
