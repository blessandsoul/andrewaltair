---
trigger: always_on
---

> **SCOPE**: These rules apply specifically to the **server** directory.

# Tourism Server – Response & Error Handling

## Version: 2.0

---

## 1. Response Contract

All API responses MUST follow a unified structure. No exceptions.

### 1.1 Success Response

```typescript
interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}
```

```json
{
  "success": true,
  "message": "Tour created successfully",
  "data": { "id": "uuid", "title": "..." }
}
```

### 1.2 Error Response

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
```

```json
{
  "success": false,
  "error": {
    "code": "TOUR_NOT_FOUND",
    "message": "The requested tour does not exist"
  }
}
```

---

## 2. Response Helpers

### 2.1 Success Helper (Required)

```typescript
// src/shared/helpers/response.ts
export function successResponse<T>(message: string, data: T): SuccessResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

// Usage in controller
return reply.send(successResponse('Tour created successfully', tour));
```

### 2.2 Paginated Response Helper (Required)

```typescript
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

---

## 3. Controller Rules

### 3.1 Controllers MUST

```typescript
// ✅ Use response helpers
return reply.send(successResponse('Tour retrieved', tour));

// ✅ Validate input with Zod
const dto = CreateTourSchema.parse(request.body);

// ✅ Call services only
const tour = await tourService.create(dto);

// ✅ Throw typed errors
if (!authorized) {
  throw new ForbiddenError('INSUFFICIENT_PERMISSIONS', 'Cannot modify this tour');
}
```

### 3.2 Controllers MUST NOT

```typescript
// ❌ Return raw values
reply.send(tour);

// ❌ Build custom JSON
reply.send({ data: tour });
reply.send({ success: true, tour });

// ❌ Set error status codes
reply.status(404).send({ error: 'Not found' });

// ❌ Contain business logic
const price = tour.basePrice * 1.1; // NO - belongs in service

// ❌ Catch errors (unless rethrowing typed)
try {
  await service.create(dto);
} catch (e) {
  reply.send({ error: e.message }); // NO
}
```

---

## 4. Error System

### 4.1 Base Error Class

```typescript
// src/shared/errors/app-error.ts
export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}
```

### 4.2 Typed Error Classes

```typescript
// src/shared/errors/errors.ts
export class BadRequestError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 400);
  }
}

export class ValidationError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(code: string = 'UNAUTHORIZED', message: string = 'Authentication required') {
    super(code, message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(code: string = 'FORBIDDEN', message: string = 'Access denied') {
    super(code, message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 409);
  }
}

export class InternalError extends AppError {
  constructor(code: string = 'INTERNAL_ERROR', message: string = 'An unexpected error occurred') {
    super(code, message, 500);
  }
}
```

### 4.3 Error Codes Convention

```typescript
// Format: DOMAIN_ACTION_REASON
const errorCodes = {
  // Auth
  AUTH_INVALID_CREDENTIALS: 'Invalid email or password',
  AUTH_TOKEN_EXPIRED: 'Access token has expired',

  // Tour
  TOUR_NOT_FOUND: 'Tour does not exist',
  TOUR_ALREADY_BOOKED: 'Tour is already fully booked',
  TOUR_INVALID_DATE: 'Tour date is in the past',

  // Booking
  BOOKING_NOT_FOUND: 'Booking does not exist',
  BOOKING_CANCELLED: 'Booking has already been cancelled',

  // Payment
  PAYMENT_FAILED: 'Payment processing failed',
  PAYMENT_INSUFFICIENT_FUNDS: 'Insufficient funds',
};
```

---

## 5. Global Error Handler

### 5.1 Single Error Handler

```typescript
// src/app.ts
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from './shared/errors/app-error';
import { logger } from './libs/logger';

app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  // Handle AppError instances
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  // Handle Zod validation errors
  if (error.name === 'ZodError') {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
      },
    });
  }

  // Handle Fastify validation errors
  if (error.validation) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message,
      },
    });
  }

  // Log unexpected errors
  logger.error({ error, requestId: request.id }, 'Unhandled error');

  // Generic error response (hide internals)
  return reply.status(500).send({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
});
```

### 5.2 Error Handler Responsibilities

| Responsibility | Location |
|---------------|----------|
| Map errors to HTTP status | Global error handler |
| Format error response | Global error handler |
| Log internal details | Global error handler |
| Throw typed errors | Services & Controllers |
| Set status codes | Global error handler ONLY |

---

## 6. Service Layer Rules

### 6.1 Services MUST

```typescript
// ✅ Throw typed errors
async function getTour(id: string): Promise<Tour> {
  const tour = await tourRepo.findById(id);
  if (!tour) {
    throw new NotFoundError('TOUR_NOT_FOUND', 'Tour does not exist');
  }
  return tour;
}

// ✅ Return data only (not response objects)
async function createTour(dto: CreateTourDto): Promise<Tour> {
  return tourRepo.create(dto);
}

// ✅ Be HTTP-agnostic
async function calculatePrice(tourId: string, participants: number): Promise<number> {
  const tour = await tourRepo.findById(tourId);
  return tour.basePrice * participants;
}
```

### 6.2 Services MUST NOT

```typescript
// ❌ Access Fastify objects
async function create(request: FastifyRequest) { ... }

// ❌ Return response objects
async function create(dto): Promise<SuccessResponse<Tour>> { ... }

// ❌ Throw raw errors
throw new Error('Something went wrong');
throw 'error message';
throw { message: 'error' };

// ❌ Set HTTP status codes
// Services don't know about HTTP
```

---

## 7. Logging Rules

### 7.1 Where to Log

| Location | Logging |
|----------|---------|
| Global error handler | ✅ Log all errors |
| Services | ✅ Log business events |
| Controllers | ❌ No logging |
| Repositories | ✅ Log slow queries |

### 7.2 What to Log

```typescript
// ✅ Log with context
logger.info({ tourId, userId }, 'Tour booked');
logger.error({ error, bookingId }, 'Payment failed');

// ❌ Don't expose to client
// Internal logs stay on server
```

### 7.3 What NOT to Expose

```typescript
// ❌ NEVER send to client
- Stack traces
- SQL queries
- Internal error messages
- File paths
- Environment variables
- Database connection details
```

---

## 8. Strict Prohibitions

| ❌ Forbidden Pattern | ✅ Correct Pattern |
|---------------------|-------------------|
| `reply.send(tour)` | `reply.send(successResponse('...', tour))` |
| `reply.send({ data: tour })` | `reply.send(successResponse('...', tour))` |
| `reply.send({ error: 'text' })` | `throw new AppError(...)` |
| `throw new Error('message')` | `throw new NotFoundError(...)` |
| `reply.status(404).send(...)` | Let error handler set status |
| Multiple response formats | Single unified format |

---

## 9. Examples

### 9.1 Complete Controller

```typescript
// src/modules/tours/tour.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { successResponse, paginatedResponse } from '@/shared/helpers/response';
import { tourService } from './tour.service';
import { CreateTourSchema, TourFiltersSchema } from './tour.schemas';

export const tourController = {
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const filters = TourFiltersSchema.parse(request.query);
    const { items, totalItems } = await tourService.findAll(filters);

    return reply.send(
      paginatedResponse('Tours retrieved successfully', items, filters.page, filters.limit, totalItems)
    );
  },

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const tour = await tourService.findById(request.params.id);
    return reply.send(successResponse('Tour retrieved successfully', tour));
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const dto = CreateTourSchema.parse(request.body);
    const tour = await tourService.create(dto);
    return reply.status(201).send(successResponse('Tour created successfully', tour));
  },
};
```

### 9.2 Complete Service

```typescript
// src/modules/tours/tour.service.ts
import { NotFoundError, BadRequestError } from '@/shared/errors';
import { tourRepo } from './tour.repo';
import type { CreateTourDto, TourFilters, Tour } from './tour.types';

export const tourService = {
  async findAll(filters: TourFilters) {
    return tourRepo.findMany(filters);
  },

  async findById(id: string): Promise<Tour> {
    const tour = await tourRepo.findById(id);
    if (!tour) {
      throw new NotFoundError('TOUR_NOT_FOUND', 'Tour does not exist');
    }
    return tour;
  },

  async create(dto: CreateTourDto): Promise<Tour> {
    if (dto.startDate < new Date()) {
      throw new BadRequestError('TOUR_INVALID_DATE', 'Tour start date cannot be in the past');
    }
    return tourRepo.create(dto);
  },
};
```

---

## 10. Checklist

- [ ] All responses use `successResponse` or `paginatedResponse`
- [ ] All errors extend `AppError`
- [ ] Single global error handler registered
- [ ] Controllers never set error status codes
- [ ] Services throw typed errors only
- [ ] No stack traces exposed to clients
- [ ] Logging in error handler only
- [ ] Error codes follow DOMAIN_ACTION_REASON format

---

**Version**: 2.0
**Last Updated**: 2025-01-30
