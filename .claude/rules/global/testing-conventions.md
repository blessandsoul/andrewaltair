---
trigger: always_on
---

> **SCOPE**: These rules apply to the **entire workspace** (server and client).

# Testing Conventions

## Version: 1.0

---

## 1. Testing Philosophy

### 1.1 Test Pyramid

```
        /\
       /  \      E2E Tests (Few)
      /----\     - Critical user journeys
     /      \    - Slow, expensive
    /--------\   Integration Tests (Some)
   /          \  - API endpoints, DB operations
  /------------\ Unit Tests (Many)
 /              \- Functions, services, components
/________________\
```

### 1.2 Coverage Requirements

| Type | Minimum Coverage | Target |
|------|-----------------|--------|
| Business Logic | 80% | 90% |
| API Endpoints | 70% | 85% |
| UI Components | 60% | 75% |
| Utilities | 90% | 100% |

---

## 2. File Organization

### 2.1 Test File Location

```
# Option A: Co-located (PREFERRED for components)
src/
├── features/
│   └── tours/
│       ├── components/
│       │   ├── TourCard.tsx
│       │   └── TourCard.test.tsx    # Next to component
│       └── hooks/
│           ├── useTours.ts
│           └── useTours.test.ts

# Option B: __tests__ folder (for services/complex modules)
src/
├── modules/
│   └── tours/
│       ├── tour.service.ts
│       ├── tour.repo.ts
│       └── __tests__/
│           ├── tour.service.test.ts
│           └── tour.repo.test.ts
```

### 2.2 File Naming

```
# Unit tests
ComponentName.test.tsx
serviceName.test.ts
utilityName.test.ts

# Integration tests
feature.integration.test.ts
api.integration.test.ts

# E2E tests
user-journey.e2e.test.ts
checkout-flow.e2e.test.ts
```

---

## 3. Test Structure

### 3.1 Describe/It Pattern

```typescript
describe('TourService', () => {
  describe('createTour', () => {
    it('should create a tour with valid data', async () => {
      // Test implementation
    });

    it('should throw ValidationError for invalid price', async () => {
      // Test implementation
    });

    it('should throw UnauthorizedError for non-company user', async () => {
      // Test implementation
    });
  });

  describe('getTours', () => {
    it('should return paginated tours', async () => {
      // Test implementation
    });

    it('should filter by city', async () => {
      // Test implementation
    });
  });
});
```

### 3.2 AAA Pattern (Arrange, Act, Assert)

```typescript
it('should create a tour with valid data', async () => {
  // Arrange - Setup test data and mocks
  const tourData = {
    title: 'Mountain Adventure',
    price: 150,
    ownerId: 'user-123',
  };
  mockTourRepo.create.mockResolvedValue({ id: 'tour-1', ...tourData });

  // Act - Execute the function
  const result = await tourService.createTour(tourData);

  // Assert - Verify the result
  expect(result).toMatchObject({
    id: 'tour-1',
    title: 'Mountain Adventure',
  });
  expect(mockTourRepo.create).toHaveBeenCalledWith(tourData);
});
```

### 3.3 Test Naming Convention

```typescript
// Pattern: should [expected behavior] when [condition]

// ✅ GOOD
it('should return empty array when no tours match filter', () => {});
it('should throw NotFoundError when tour does not exist', () => {});
it('should apply discount when user has premium membership', () => {});

// ❌ BAD
it('test tour creation', () => {});
it('works', () => {});
it('createTour', () => {});
```

---

## 4. Unit Testing

### 4.1 Service Tests

```typescript
// tour.service.test.ts
import { TourService } from '../tour.service';
import { TourRepository } from '../tour.repo';
import { NotFoundError, ValidationError } from '@/libs/errors';

// Mock the repository
jest.mock('../tour.repo');

describe('TourService', () => {
  let tourService: TourService;
  let mockTourRepo: jest.Mocked<TourRepository>;

  beforeEach(() => {
    mockTourRepo = new TourRepository() as jest.Mocked<TourRepository>;
    tourService = new TourService(mockTourRepo);
    jest.clearAllMocks();
  });

  describe('getTourById', () => {
    it('should return tour when found', async () => {
      // Arrange
      const mockTour = { id: '1', title: 'Test Tour', price: 100 };
      mockTourRepo.findById.mockResolvedValue(mockTour);

      // Act
      const result = await tourService.getTourById('1');

      // Assert
      expect(result).toEqual(mockTour);
      expect(mockTourRepo.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundError when tour not found', async () => {
      // Arrange
      mockTourRepo.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(tourService.getTourById('999'))
        .rejects
        .toThrow(NotFoundError);
    });
  });
});
```

### 4.2 Utility Tests

```typescript
// format.test.ts
import { formatCurrency, formatDate, truncate } from '../format';

describe('formatCurrency', () => {
  it('should format GEL currency correctly', () => {
    expect(formatCurrency(100, 'GEL')).toBe('₾100');
  });

  it('should format with decimals', () => {
    expect(formatCurrency(99.99, 'USD')).toBe('$99.99');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0, 'EUR')).toBe('€0');
  });

  it('should handle negative numbers', () => {
    expect(formatCurrency(-50, 'USD')).toBe('-$50');
  });
});

describe('truncate', () => {
  it('should truncate long strings', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...');
  });

  it('should not truncate short strings', () => {
    expect(truncate('Hi', 5)).toBe('Hi');
  });

  it('should handle exact length', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });
});
```

### 4.3 React Component Tests

```typescript
// TourCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TourCard } from './TourCard';

const mockTour = {
  id: '1',
  title: 'Mountain Adventure',
  price: 150,
  city: 'Tbilisi',
  imageUrl: '/tour.jpg',
};

describe('TourCard', () => {
  it('should render tour information', () => {
    render(<TourCard tour={mockTour} onClick={jest.fn()} />);

    expect(screen.getByText('Mountain Adventure')).toBeInTheDocument();
    expect(screen.getByText('Tbilisi')).toBeInTheDocument();
    expect(screen.getByText('$150')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<TourCard tour={mockTour} onClick={handleClick} />);

    fireEvent.click(screen.getByRole('article'));

    expect(handleClick).toHaveBeenCalledWith('1');
  });

  it('should show placeholder when no image', () => {
    const tourWithoutImage = { ...mockTour, imageUrl: null };
    render(<TourCard tour={tourWithoutImage} onClick={jest.fn()} />);

    expect(screen.getByTestId('image-placeholder')).toBeInTheDocument();
  });
});
```

### 4.4 Hook Tests

```typescript
// useTours.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTours } from './useTours';
import { tourService } from '../services/tour.service';

jest.mock('../services/tour.service');

const wrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useTours', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch tours successfully', async () => {
    const mockTours = [{ id: '1', title: 'Tour 1' }];
    (tourService.getTours as jest.Mock).mockResolvedValue({
      items: mockTours,
      totalItems: 1,
    });

    const { result } = renderHook(() => useTours(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.items).toEqual(mockTours);
  });

  it('should handle error state', async () => {
    (tourService.getTours as jest.Mock).mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useTours(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
```

---

## 5. Integration Testing

### 5.1 API Endpoint Tests

```typescript
// tours.integration.test.ts
import { build } from '../app';
import { prisma } from '@/libs/prisma';

describe('Tours API', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await build();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean database
    await prisma.tour.deleteMany();
  });

  describe('GET /api/v1/tours', () => {
    it('should return paginated tours', async () => {
      // Seed test data
      await prisma.tour.createMany({
        data: [
          { title: 'Tour 1', price: 100, ownerId: 'user-1' },
          { title: 'Tour 2', price: 200, ownerId: 'user-1' },
        ],
      });

      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/tours?page=1&limit=10',
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.items).toHaveLength(2);
      expect(body.data.pagination.totalItems).toBe(2);
    });

    it('should filter by city', async () => {
      await prisma.tour.createMany({
        data: [
          { title: 'Tbilisi Tour', price: 100, city: 'Tbilisi', ownerId: 'user-1' },
          { title: 'Batumi Tour', price: 200, city: 'Batumi', ownerId: 'user-1' },
        ],
      });

      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/tours?city=Tbilisi',
      });

      const body = JSON.parse(response.body);
      expect(body.data.items).toHaveLength(1);
      expect(body.data.items[0].city).toBe('Tbilisi');
    });
  });

  describe('POST /api/v1/tours', () => {
    it('should create tour with valid data', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/tours',
        headers: { Authorization: 'Bearer valid-token' },
        payload: {
          title: 'New Tour',
          price: 150,
        },
      });

      expect(response.statusCode).toBe(201);

      const body = JSON.parse(response.body);
      expect(body.data.title).toBe('New Tour');
    });

    it('should return 400 for invalid data', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/tours',
        headers: { Authorization: 'Bearer valid-token' },
        payload: {
          title: '', // Invalid: empty
          price: -100, // Invalid: negative
        },
      });

      expect(response.statusCode).toBe(400);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
```

---

## 6. Mocking Guidelines

### 6.1 What to Mock

```typescript
// ✅ MOCK:
- External APIs (payment providers, email services)
- Database (for unit tests)
- Time-sensitive functions (Date.now, setTimeout)
- Randomness (Math.random, UUID generation)
- File system operations
- Network requests

// ❌ DON'T MOCK:
- The code you're testing
- Simple utility functions
- Internal dependencies (unless testing in isolation)
```

### 6.2 Mock Patterns

```typescript
// Mock module
jest.mock('@/libs/prisma', () => ({
  prisma: {
    tour: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock implementation
mockPrisma.tour.findMany.mockResolvedValue([]);

// Mock return value once
mockPrisma.tour.findMany.mockResolvedValueOnce([tour1]);

// Verify mock calls
expect(mockPrisma.tour.create).toHaveBeenCalledWith({
  data: expect.objectContaining({ title: 'New Tour' }),
});
```

### 6.3 Mock Factories

```typescript
// __mocks__/tour.factory.ts
export const createMockTour = (overrides = {}) => ({
  id: 'tour-1',
  title: 'Test Tour',
  price: 100,
  currency: 'USD',
  city: 'Tbilisi',
  isActive: true,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
  ...overrides,
});

// Usage in tests
const tour = createMockTour({ price: 200, city: 'Batumi' });
```

---

## 7. Test Data Management

### 7.1 Fixtures

```typescript
// __fixtures__/tours.ts
export const tourFixtures = {
  basic: {
    id: '1',
    title: 'Basic Tour',
    price: 100,
  },
  premium: {
    id: '2',
    title: 'Premium Tour',
    price: 500,
    isPremium: true,
  },
  inactive: {
    id: '3',
    title: 'Inactive Tour',
    isActive: false,
  },
};
```

### 7.2 Database Seeding (Integration Tests)

```typescript
// __tests__/helpers/seed.ts
export async function seedTours(prisma: PrismaClient) {
  return prisma.tour.createMany({
    data: [
      { title: 'Tour 1', price: 100, ownerId: 'user-1' },
      { title: 'Tour 2', price: 200, ownerId: 'user-1' },
    ],
  });
}

export async function cleanDatabase(prisma: PrismaClient) {
  await prisma.booking.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.user.deleteMany();
}
```

---

## 8. Async Testing

### 8.1 Promises

```typescript
// ✅ Using async/await
it('should fetch data', async () => {
  const result = await fetchData();
  expect(result).toBeDefined();
});

// ✅ Testing rejections
it('should throw error', async () => {
  await expect(fetchData()).rejects.toThrow('Not found');
});

// ✅ With waitFor (React Testing Library)
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### 8.2 Timers

```typescript
// Use fake timers
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

it('should debounce search', () => {
  const onSearch = jest.fn();
  render(<SearchInput onSearch={onSearch} />);

  fireEvent.change(input, { target: { value: 'test' } });

  // Fast-forward debounce delay
  jest.advanceTimersByTime(300);

  expect(onSearch).toHaveBeenCalledWith('test');
});
```

---

## 9. Test Configuration

### 9.1 Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // or 'jsdom' for React
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### 9.2 Test Setup

```typescript
// jest.setup.ts
import '@testing-library/jest-dom';

// Global mocks
jest.mock('@/libs/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
```

---

## 10. Anti-Patterns to Avoid

### 10.1 Don't Do This

```typescript
// ❌ Testing implementation details
it('should call setState', () => {
  const setState = jest.spyOn(React, 'useState');
  // Don't test internal state
});

// ❌ Hardcoded waits
await new Promise(resolve => setTimeout(resolve, 1000));

// ❌ Testing multiple things
it('should create, update, and delete tour', async () => {
  // Too many responsibilities
});

// ❌ Shared mutable state between tests
let sharedData = [];
beforeAll(() => { sharedData = [1, 2, 3]; });

// ❌ Not cleaning up
// Missing afterEach cleanup

// ❌ Snapshot abuse
expect(hugeObject).toMatchSnapshot(); // Too large
```

### 10.2 Do This Instead

```typescript
// ✅ Test behavior, not implementation
it('should show loading state while fetching', () => {
  render(<TourList />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

// ✅ Use waitFor for async
await waitFor(() => {
  expect(screen.getByText('Tour 1')).toBeInTheDocument();
});

// ✅ One assertion per test (or closely related)
it('should create tour', async () => { /* ... */ });
it('should update tour', async () => { /* ... */ });

// ✅ Isolated tests
beforeEach(() => {
  testData = createFreshTestData();
});

// ✅ Cleanup
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});
```

---

## Quick Reference

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific file
npm test -- tour.service.test.ts

# Run in watch mode
npm test -- --watch

# Run only changed tests
npm test -- --onlyChanged
```

---

**Version**: 1.0
**Last Updated**: 2025-01-30
