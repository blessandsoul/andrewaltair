---
trigger: always_on
---

> **SCOPE**: These rules apply specifically to the **server** directory.

# Tourism Server – Architecture & Conventions

## Version: 2.0

---

## 1. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | 20+ LTS |
| Framework | Fastify | 4.x |
| Language | TypeScript | 5.x (strict mode) |
| Database | MySQL | 8.0+ |
| ORM | Prisma | 6.x |
| Cache | Redis | 7.x |
| Validation | Zod | 3.x |
| Testing | Vitest | 1.x |
| Process Manager | PM2 | 5.x |

---

## 2. Package Manager Detection

Detect from lockfile:
```
pnpm-lock.yaml exists → use pnpm
yarn.lock exists → use yarn
otherwise → use npm
```

---

## 3. Project Structure

```
src/
├── app.ts                 # Fastify instance & plugin registration
├── server.ts              # Server bootstrap (listen only)
├── config/
│   ├── env.ts             # Environment variable loader
│   ├── constants.ts       # App constants
│   └── index.ts           # Config exports
├── libs/
│   ├── prisma.ts          # Prisma client singleton
│   ├── redis.ts           # Redis client singleton
│   ├── logger.ts          # Pino logger instance
│   └── auth.ts            # Auth utilities (JWT verify, etc.)
├── shared/
│   ├── errors/
│   │   ├── app-error.ts   # Base error class
│   │   └── errors.ts      # Typed error classes
│   ├── helpers/
│   │   ├── response.ts    # Response helpers
│   │   └── pagination.ts  # Pagination utilities
│   └── schemas/
│       └── common.ts      # Shared Zod schemas
├── modules/
│   └── <domain>/
│       ├── <domain>.routes.ts      # Route definitions
│       ├── <domain>.controller.ts  # HTTP handlers (no logic)
│       ├── <domain>.service.ts     # Business logic
│       ├── <domain>.repo.ts        # Database queries
│       ├── <domain>.schemas.ts     # Zod input/output schemas
│       └── <domain>.types.ts       # Domain-specific types
└── plugins/
    ├── auth.ts            # Auth plugin (preHandler hook)
    ├── rate-limit.ts      # Rate limiting plugin
    └── cors.ts            # CORS configuration
```

---

## 4. Domain Modules

### 4.1 Core Domains

| Domain | Route Prefix | Description |
|--------|-------------|-------------|
| auth | `/api/v1/auth` | Login, register, password reset |
| users | `/api/v1/users` | User profiles, preferences |
| companies | `/api/v1/companies` | Tour operators, hotels |
| tours | `/api/v1/tours` | Tour listings |
| hotels | `/api/v1/hotels` | Hotel listings |
| restaurants | `/api/v1/restaurants` | Restaurant listings |
| bookings | `/api/v1/bookings` | Reservations |
| payments | `/api/v1/payments` | Payment processing |
| locations | `/api/v1/locations` | Cities, regions |
| media | `/api/v1/media` | File uploads |

### 4.2 Module File Responsibilities

```typescript
// <domain>.routes.ts - Route definitions ONLY
export async function tourRoutes(fastify: FastifyInstance) {
  fastify.get('/', { schema: getToursSchema }, tourController.getAll);
  fastify.get('/:id', { schema: getTourSchema }, tourController.getById);
  fastify.post('/', { schema: createTourSchema }, tourController.create);
}

// <domain>.controller.ts - HTTP handling ONLY
export const tourController = {
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const filters = request.query as TourFilters;
    const result = await tourService.findAll(filters);
    return reply.send(successResponse('Tours retrieved', result));
  }
};

// <domain>.service.ts - Business logic ONLY
export const tourService = {
  async findAll(filters: TourFilters): Promise<PaginatedResult<Tour>> {
    // Validation, business rules, orchestration
    const { items, totalItems } = await tourRepo.findMany(filters);
    return { items, totalItems };
  }
};

// <domain>.repo.ts - Database queries ONLY
export const tourRepo = {
  async findMany(filters: TourFilters) {
    return prisma.tour.findMany({
      where: buildWhereClause(filters),
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    });
  }
};
```

---

## 5. Layered Architecture

### 5.1 Request Flow

```
Request → Routes → Controller → Service → Repository → Database
                      ↓             ↓
               Validation    Business Logic
                      ↓             ↓
                  Response ←── Data/Error
```

### 5.2 Layer Rules

| Layer | Can Call | Cannot Call | Returns |
|-------|----------|-------------|---------|
| Routes | Controller | Service, Repo | — |
| Controller | Service | Repo, Prisma | Fastify Reply |
| Service | Repo, other Services | Controller, Fastify | Data or throws Error |
| Repository | Prisma | Service, Controller | Raw data |

### 5.3 Strict Separation

```typescript
// ❌ FORBIDDEN: Service accessing HTTP objects
export const tourService = {
  async create(request: FastifyRequest) { // NO!
    return reply.send(data); // NO!
  }
};

// ✅ CORRECT: Service is HTTP-agnostic
export const tourService = {
  async create(dto: CreateTourDto): Promise<Tour> {
    // Business logic only
    if (!dto.companyId) {
      throw new BadRequestError('COMPANY_REQUIRED', 'Company ID is required');
    }
    return tourRepo.create(dto);
  }
};
```

---

## 6. TypeScript Standards

### 6.1 Strict Mode Required

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### 6.2 Type Everything

```typescript
// ✅ CORRECT: Explicit types
async function createTour(dto: CreateTourDto): Promise<Tour> {
  return tourRepo.create(dto);
}

// ❌ FORBIDDEN: Implicit any
async function createTour(dto) {
  return tourRepo.create(dto);
}
```

### 6.3 Import Conventions

```typescript
// Within same module: relative imports
import { tourRepo } from './tour.repo';
import { TourDto } from './tour.schemas';

// Cross-module: aliased imports (if configured)
import { prisma } from '@/libs/prisma';
import { AppError } from '@/shared/errors';

// External packages: no default imports
import { z } from 'zod';
import { FastifyInstance } from 'fastify';
```

### 6.4 Export Conventions

```typescript
// ✅ Named exports (preferred)
export const tourService = { ... };
export function createTour() { ... }
export interface TourDto { ... }

// ✅ Default export ONLY for app.ts
// src/app.ts
export default fastify;
```

---

## 7. Fastify Patterns

### 7.1 Plugin Registration

```typescript
// src/app.ts
import Fastify from 'fastify';
import { tourRoutes } from './modules/tours/tour.routes';
import { authPlugin } from './plugins/auth';

const app = Fastify({ logger: true });

// Register plugins
await app.register(authPlugin);
await app.register(rateLimitPlugin);

// Register routes with prefix
await app.register(tourRoutes, { prefix: '/api/v1/tours' });
await app.register(userRoutes, { prefix: '/api/v1/users' });

export default app;
```

### 7.2 Schema Validation

```typescript
// Use Fastify schemas for automatic validation
const createTourSchema = {
  body: {
    type: 'object',
    required: ['title', 'price'],
    properties: {
      title: { type: 'string', minLength: 1 },
      price: { type: 'number', minimum: 0 },
    },
  },
};

// Or Zod with type inference
const CreateTourSchema = z.object({
  title: z.string().min(1),
  price: z.number().min(0),
});

type CreateTourDto = z.infer<typeof CreateTourSchema>;
```

---

## 8. Security Requirements

### 8.1 Authentication

```typescript
// JWT configuration
const jwtConfig = {
  algorithm: 'RS256', // or 'HS256'
  expiresIn: '15m',   // Access token
  refreshExpiresIn: '7d',
};

// Minimal token payload
interface TokenPayload {
  sub: string;    // User ID
  role: UserRole; // ADMIN | USER | COMPANY
  iat: number;
  exp: number;
}
```

### 8.2 Input Validation

```typescript
// ✅ ALWAYS validate with Zod
const validated = CreateTourSchema.parse(request.body);

// ✅ NEVER trust user input
const id = z.string().uuid().parse(request.params.id);
```

### 8.3 SQL Injection Prevention

```typescript
// ✅ ALWAYS use Prisma query builder
const tours = await prisma.tour.findMany({
  where: { city: userInput },
});

// ❌ NEVER interpolate raw values
const tours = await prisma.$queryRaw`
  SELECT * FROM tours WHERE city = '${userInput}'  // DANGER!
`;
```

### 8.4 Rate Limiting

```typescript
// Apply to public endpoints
await app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  keyGenerator: (request) => request.ip,
});
```

---

## 9. Redis Usage

### 9.1 Caching Strategy

```typescript
// Cache frequently accessed data
const CACHE_TTL = 60 * 5; // 5 minutes

async function getPopularTours(): Promise<Tour[]> {
  const cached = await redis.get('popular_tours');
  if (cached) return JSON.parse(cached);

  const tours = await tourRepo.findPopular();
  await redis.setex('popular_tours', CACHE_TTL, JSON.stringify(tours));
  return tours;
}
```

### 9.2 Cache Invalidation

```typescript
// Invalidate on mutation
async function updateTour(id: string, dto: UpdateTourDto) {
  const tour = await tourRepo.update(id, dto);
  await redis.del(`tour:${id}`);
  await redis.del('popular_tours');
  return tour;
}
```

---

## 10. Logging

### 10.1 Use Shared Logger

```typescript
// src/libs/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});
```

### 10.2 Logging Rules

```typescript
// ✅ Use logger for production logging
logger.info({ tourId }, 'Tour created');
logger.error({ error, userId }, 'Payment failed');

// ❌ NEVER use console.log in production code
console.log('Tour created'); // FORBIDDEN
```

---

## 11. Code Change Rules

### 11.1 Preservation

- Do NOT break existing exports or types unless explicitly asked
- Keep changes focused and minimal
- Reuse existing helpers (db, logger, env) instead of recreating

### 11.2 Documentation

- Add TODO comments for non-trivial follow-up tasks
- Document complex business logic inline
- Update API documentation when changing endpoints

---

## 12. Checklist

Before submitting code changes:

- [ ] TypeScript strict mode passes
- [ ] All inputs validated with Zod
- [ ] Services throw typed AppError instances
- [ ] Controllers use response helpers only
- [ ] No raw SQL with interpolated values
- [ ] Logging uses shared logger
- [ ] Existing exports preserved
- [ ] Tests added for critical paths

---

**Version**: 2.0
**Last Updated**: 2025-01-30
