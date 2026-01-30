---
trigger: always_on
---

> **SCOPE**: These rules apply to **all client projects** (React SPA and Next.js).

# Component Patterns & Architecture

## Version: 2.0

---

## 1. Component Structure Template

### 1.1 Standard Component Layout

```tsx
// 1. IMPORTS (grouped and ordered per 01-project-structure.md)
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTours } from '../hooks/useTours';
import type { Tour } from '../types/tour.types';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/format.utils';

// 2. TYPES (component-specific only)
interface TourCardProps {
  tour: Tour;
  onSelect?: (id: string) => void;
  className?: string;
}

// 3. COMPONENT
export const TourCard = ({ tour, onSelect, className }: TourCardProps) => {
  // 3a. HOOKS (order: router → external libs → custom → state)
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // 3b. DERIVED STATE (useMemo for expensive computations)
  const formattedPrice = useMemo(
    () => formatCurrency(tour.price, tour.currency),
    [tour.price, tour.currency]
  );

  // 3c. EVENT HANDLERS (useCallback for handlers passed to children)
  const handleClick = useCallback(() => {
    onSelect?.(tour.id);
    navigate(`/tours/${tour.id}`);
  }, [onSelect, tour.id, navigate]);

  // 3d. EARLY RETURNS (loading, error, empty states)
  if (!tour) return null;

  // 3e. RENDER
  return (
    <Card
      className={cn('cursor-pointer transition-shadow hover:shadow-lg', className)}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={tour.imageUrl} alt={tour.title} className="h-48 w-full object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{tour.title}</h3>
        <p className="text-muted-foreground">{tour.city}</p>
        <p className="text-primary font-bold mt-2">{formattedPrice}</p>
      </div>
    </Card>
  );
};
```

---

## 2. Component Types

### 2.1 Presentational Components

**Purpose**: Display UI based on props. No business logic.

**Location**: `components/common/` or `features/*/components/`

**Rules**:
- ❌ NO API calls
- ❌ NO business logic
- ❌ NO global state (Redux/Context) except theme
- ✅ Receive ALL data via props
- ✅ Focus ONLY on rendering

```tsx
// ✅ GOOD - Pure presentation
interface TourCardProps {
  tour: Tour;
  onClick: (id: string) => void;
  isSelected?: boolean;
}

export const TourCard = ({ tour, onClick, isSelected }: TourCardProps) => {
  return (
    <Card
      className={cn(isSelected && 'ring-2 ring-primary')}
      onClick={() => onClick(tour.id)}
    >
      <h3>{tour.title}</h3>
      <p>{tour.price}</p>
    </Card>
  );
};

// ❌ BAD - Contains business logic
export const TourCard = ({ tourId }: { tourId: string }) => {
  const { data: tour } = useTour(tourId);  // ❌ API call
  const { user } = useAuth();               // ❌ Global state
  const canBook = user && tour.isAvailable; // ❌ Business logic
  return <div>{tour.title}</div>;
};
```

### 2.2 Container Components

**Purpose**: Handle business logic, pass data to presentational components.

**Location**: `features/*/pages/` or `features/*/components/`

**Rules**:
- ✅ Make API calls via hooks
- ✅ Manage local state
- ✅ Handle events and navigation
- ✅ Pass data to presentational components

```tsx
// ✅ GOOD - Container component
export const ToursPage = () => {
  // State
  const [filters, setFilters] = useState<TourFilters>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // API calls
  const { data, isLoading, error } = useTours(filters);

  // Handlers
  const handleTourSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleFilterChange = useCallback((newFilters: TourFilters) => {
    setFilters(newFilters);
  }, []);

  // Early returns
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data?.items.length) return <EmptyState title="No tours found" />;

  // Render with presentational components
  return (
    <div className="container mx-auto py-8">
      <TourFilters value={filters} onChange={handleFilterChange} />
      <div className="grid grid-cols-3 gap-4 mt-6">
        {data.items.map((tour) => (
          <TourCard
            key={tour.id}
            tour={tour}
            onClick={handleTourSelect}
            isSelected={tour.id === selectedId}
          />
        ))}
      </div>
      <Pagination
        page={data.pagination.page}
        totalPages={data.pagination.totalPages}
        onChange={(page) => setFilters((f) => ({ ...f, page }))}
      />
    </div>
  );
};
```

### 2.3 Layout Components

**Purpose**: Define page structure. Wrap content.

**Location**: `components/layout/`

**Rules**:
- ✅ Render `children` prop
- ✅ Can use auth state for conditional rendering
- ❌ NO business logic

```tsx
// ✅ GOOD - Layout component
interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={isAuthenticated} />
      <main className="flex-1 container mx-auto py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};
```

### 2.4 Page Components

**Purpose**: Route entry points. Coordinate feature display.

**Location**: `features/*/pages/` (React) or `app/*/page.tsx` (Next.js)

**Rules**:
- ✅ One page = One route
- ✅ Suffix with `Page` (React) or use default export (Next.js)
- ✅ Handle page-level concerns (title, meta, breadcrumbs)

```tsx
// React SPA
export const TourDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: tour, isLoading, error } = useTour(id!);

  useDocumentTitle(tour?.title || 'Tour Details');

  if (isLoading) return <LoadingPage />;
  if (error) return <ErrorPage error={error} />;
  if (!tour) return <NotFoundPage />;

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Tours', href: '/tours' }, { label: tour.title }]} />
      <TourHeader tour={tour} />
      <TourContent tour={tour} />
      <TourBookingSection tour={tour} />
    </div>
  );
};

// Next.js (App Router)
export default async function TourDetailsPage({ params }: { params: { id: string } }) {
  const tour = await getTour(params.id);

  if (!tour) notFound();

  return (
    <div>
      <TourHeader tour={tour} />
      <TourContent tour={tour} />
      <TourBookingSection tour={tour} />
    </div>
  );
}
```

---

## 3. Component Size Limits

### 3.1 Hard Limits

| Metric | Limit | Action When Exceeded |
|--------|-------|---------------------|
| Lines of code | 250 | Split into smaller components |
| Props count | 5 | Group related props into objects |
| JSX nesting | 3 levels | Extract nested elements |
| useState hooks | 3 | Use useReducer or extract logic |

### 3.2 When to Split

```tsx
// ❌ BAD - Too many responsibilities
export const TourDetailsPage = () => {
  // 50 lines of state and hooks
  // 30 lines of handlers
  // 200 lines of JSX with 5 levels of nesting
  return (
    <div>
      {/* Everything inline */}
    </div>
  );
};

// ✅ GOOD - Split into focused components
export const TourDetailsPage = () => {
  const { id } = useParams();
  const { tour, isLoading } = useTour(id);

  if (isLoading) return <LoadingPage />;

  return (
    <div className="space-y-8">
      <TourHeader tour={tour} />
      <TourGallery images={tour.images} />
      <TourDescription tour={tour} />
      <TourPricing tour={tour} />
      <TourBookingForm tourId={tour.id} />
      <TourReviews tourId={tour.id} />
    </div>
  );
};
```

---

## 4. Props Patterns

### 4.1 Props Interface Rules

```tsx
// ✅ GOOD - Grouped related props
interface TourCardProps {
  tour: Tour;                    // Domain object
  actions?: TourActions;         // Grouped callbacks
  display?: TourDisplayOptions;  // Grouped display options
  className?: string;            // Standard className support
}

interface TourActions {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onBook?: (id: string) => void;
}

interface TourDisplayOptions {
  showPrice?: boolean;
  showRating?: boolean;
  compact?: boolean;
}

// ❌ BAD - Too many flat props
interface TourCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  city: string;
  rating: number;
  imageUrl: string;
  onEdit: () => void;
  onDelete: () => void;
  onBook: () => void;
  showPrice: boolean;
  showRating: boolean;
  compact: boolean;
  // ... 15+ props
}
```

### 4.2 Children Prop

```tsx
// ✅ GOOD - Flexible composition
interface CardProps {
  children: React.ReactNode;
  title?: string;
  footer?: React.ReactNode;
  className?: string;
}

export const Card = ({ children, title, footer, className }: CardProps) => {
  return (
    <div className={cn('rounded-lg border bg-card p-4', className)}>
      {title && <h3 className="font-semibold mb-2">{title}</h3>}
      {children}
      {footer && <div className="mt-4 pt-4 border-t">{footer}</div>}
    </div>
  );
};

// Usage
<Card title="Tour Details" footer={<Button>Book Now</Button>}>
  <p>{tour.description}</p>
</Card>
```

### 4.3 Spread Props Pattern

```tsx
// ✅ GOOD - Forward HTML attributes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
};
```

---

## 5. Event Handlers

### 5.1 Naming Convention

```tsx
// Component internal handlers: handle<Event>
const handleClick = () => { ... };
const handleSubmit = () => { ... };
const handleChange = () => { ... };

// Prop callbacks: on<Event>
interface Props {
  onClick?: () => void;
  onSubmit?: (data: FormData) => void;
  onChange?: (value: string) => void;
}
```

### 5.2 Handler Patterns

```tsx
// ✅ GOOD - useCallback for handlers passed to children
const handleTourClick = useCallback((id: string) => {
  navigate(`/tours/${id}`);
}, [navigate]);

// ✅ GOOD - Typed event
const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  onSubmit(formData);
}, [formData, onSubmit]);

// ✅ GOOD - Stop propagation when needed
const handleDeleteClick = useCallback((e: React.MouseEvent) => {
  e.stopPropagation();  // Prevent card click
  onDelete(id);
}, [id, onDelete]);

// ❌ BAD - Inline arrow functions in render (creates new function each render)
{tours.map(tour => (
  <TourCard onClick={() => handleClick(tour.id)} />  // New function each render
))}

// ✅ GOOD - Pass handler and id separately
{tours.map(tour => (
  <TourCard tour={tour} onClick={handleTourClick} />
))}
```

---

## 6. Conditional Rendering

### 6.1 Early Returns (Preferred)

```tsx
export const TourCard = ({ tour }: TourCardProps) => {
  // Early return for null/undefined
  if (!tour) return null;

  // Early return for special states
  if (tour.isDeleted) return <DeletedTourCard />;
  if (!tour.isActive) return <InactiveTourCard tour={tour} />;

  // Main render
  return <div>{tour.title}</div>;
};
```

### 6.2 Inline Conditions

```tsx
// ✅ GOOD - && for optional rendering
{user && <WelcomeMessage user={user} />}
{hasError && <ErrorBanner message={errorMessage} />}

// ✅ GOOD - Ternary for binary choice
{isEditing ? <EditForm /> : <ViewMode />}

// ✅ GOOD - Extract complex conditions
const shouldShowActions = isOwner && !isDeleted && !isLocked;
{shouldShowActions && <ActionButtons />}

// ❌ BAD - Nested ternaries
{isLoading ? <Spinner /> : error ? <Error /> : data ? <Content /> : <Empty />}

// ✅ GOOD - Early returns instead
if (isLoading) return <Spinner />;
if (error) return <Error />;
if (!data) return <Empty />;
return <Content data={data} />;
```

### 6.3 Switch-like Rendering

```tsx
// ✅ GOOD - Object lookup for multiple states
const statusComponents = {
  pending: <PendingBadge />,
  confirmed: <ConfirmedBadge />,
  cancelled: <CancelledBadge />,
  completed: <CompletedBadge />,
} as const;

return statusComponents[booking.status] ?? <UnknownBadge />;
```

---

## 7. Performance Optimization

### 7.1 React.memo

```tsx
// ✅ Use for components in lists or with expensive renders
export const TourCard = React.memo(({ tour, onClick }: TourCardProps) => {
  return (
    <Card onClick={() => onClick(tour.id)}>
      <h3>{tour.title}</h3>
    </Card>
  );
});

TourCard.displayName = 'TourCard';

// ✅ Custom comparison for complex props
export const TourCard = React.memo(
  ({ tour, onClick }: TourCardProps) => { ... },
  (prevProps, nextProps) => {
    return prevProps.tour.id === nextProps.tour.id
        && prevProps.tour.updatedAt === nextProps.tour.updatedAt;
  }
);
```

### 7.2 useMemo

```tsx
// ✅ For expensive computations
const sortedTours = useMemo(() => {
  return [...tours].sort((a, b) => b.rating - a.rating);
}, [tours]);

const filteredTours = useMemo(() => {
  return tours.filter(tour =>
    tour.city === selectedCity &&
    tour.price >= minPrice &&
    tour.price <= maxPrice
  );
}, [tours, selectedCity, minPrice, maxPrice]);

// ❌ DON'T memoize simple values
const fullName = useMemo(() => `${first} ${last}`, [first, last]); // Overkill
const fullName = `${first} ${last}`; // ✅ Just compute it
```

### 7.3 useCallback

```tsx
// ✅ For callbacks passed to memoized children
const handleSelect = useCallback((id: string) => {
  setSelectedId(id);
}, []);

// ✅ For callbacks with dependencies
const handleSearch = useCallback((query: string) => {
  search({ ...filters, query });
}, [filters, search]);

// ❌ DON'T useCallback for handlers not passed to children
const handleLocalClick = useCallback(() => {  // Unnecessary
  setIsOpen(true);
}, []);
```

---

## 8. Styling Rules

### 8.1 Tailwind CSS

```tsx
// ✅ GOOD - Tailwind classes
<div className="p-4 bg-background text-foreground rounded-lg shadow-md">

// ✅ GOOD - Responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ✅ GOOD - Conditional with cn()
<Button className={cn(
  "w-full",
  isLoading && "opacity-50 cursor-not-allowed",
  variant === "danger" && "bg-destructive"
)} />

// ❌ BAD - Inline styles
<div style={{ padding: '1rem', backgroundColor: '#fff' }}>

// ❌ BAD - Hardcoded colors (see 08-color-system.md)
<div className="bg-blue-500 text-white">
```

### 8.2 The cn() Utility

```tsx
// lib/utils.ts (or lib/cn.ts)
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className  // Allow override from props
)} />
```

---

## 9. Accessibility Requirements

### 9.1 Interactive Elements

```tsx
// ✅ GOOD - Accessible button
<button
  type="button"
  onClick={handleDelete}
  aria-label="Delete tour"
  disabled={isDeleting}
>
  <TrashIcon className="w-4 h-4" />
</button>

// ✅ GOOD - Accessible form
<form onSubmit={handleSubmit} aria-labelledby="form-title">
  <h2 id="form-title">Create Tour</h2>

  <label htmlFor="title">Title</label>
  <input
    id="title"
    type="text"
    aria-invalid={!!errors.title}
    aria-describedby={errors.title ? 'title-error' : undefined}
  />
  {errors.title && (
    <p id="title-error" role="alert" className="text-destructive">
      {errors.title.message}
    </p>
  )}
</form>

// ✅ GOOD - Accessible loading state
<div aria-busy={isLoading} aria-live="polite">
  {isLoading ? <LoadingSpinner /> : <Content />}
</div>
```

### 9.2 Semantic HTML

```tsx
// ✅ GOOD - Semantic elements
<article className="tour-card">
  <header>
    <h3>{tour.title}</h3>
  </header>
  <main>
    <p>{tour.description}</p>
  </main>
  <footer>
    <Button>Book Now</Button>
  </footer>
</article>

// ❌ BAD - Div soup
<div className="tour-card">
  <div>
    <div>{tour.title}</div>
  </div>
  <div>
    <div>{tour.description}</div>
  </div>
</div>
```

---

## 10. Anti-Patterns to Avoid

### 10.1 God Components

```tsx
// ❌ BAD
export const DashboardPage = () => {
  // 500 lines handling auth, tours, bookings, analytics, settings
};

// ✅ GOOD
export const DashboardPage = () => (
  <div className="grid gap-6">
    <DashboardHeader />
    <DashboardStats />
    <RecentTours />
    <RecentBookings />
    <QuickActions />
  </div>
);
```

### 10.2 Prop Drilling

```tsx
// ❌ BAD
<Parent user={user}>
  <Child user={user}>
    <GrandChild user={user}>
      <GreatGrandChild user={user} />
    </GrandChild>
  </Child>
</Parent>

// ✅ GOOD - Use context or hooks
const { user } = useAuth();
```

### 10.3 Derived State in useState

```tsx
// ❌ BAD
const [tours, setTours] = useState<Tour[]>([]);
const [filteredTours, setFilteredTours] = useState<Tour[]>([]);

useEffect(() => {
  setFilteredTours(tours.filter(t => t.isActive));
}, [tours]);

// ✅ GOOD - Compute on render
const [tours, setTours] = useState<Tour[]>([]);
const filteredTours = useMemo(
  () => tours.filter(t => t.isActive),
  [tours]
);
```

---

## 11. Component Checklist

Before completing a component, verify:

- [ ] Under 250 lines
- [ ] Max 5 props (grouped if more needed)
- [ ] Max 3 levels JSX nesting
- [ ] Event handlers use useCallback when passed to children
- [ ] Expensive computations use useMemo
- [ ] Early returns for loading/error/empty
- [ ] Tailwind classes (no inline styles)
- [ ] Semantic HTML elements
- [ ] Accessibility attributes (aria-*, roles)
- [ ] Named export (not default, except pages)
- [ ] displayName set if using React.memo
- [ ] TypeScript props interface defined

---

**Version**: 2.0
**Last Updated**: 2025-01-30
