---
trigger: always_on
---

> **SCOPE**: These rules apply to **all client projects** (React SPA and Next.js).

# Common Patterns & Utilities

## Version: 2.0

---

## 1. Custom Hooks

### 1.1 useDebounce

```typescript
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);

useEffect(() => {
  if (debouncedSearch) {
    performSearch(debouncedSearch);
  }
}, [debouncedSearch]);
```

### 1.2 useLocalStorage

```typescript
// hooks/useLocalStorage.ts
import { useState, useCallback, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Read from localStorage or use initial value
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Update localStorage when value changes
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const newValue = value instanceof Function ? value(storedValue) : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sync with other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

// Usage
const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
```

### 1.3 useMediaQuery

```typescript
// hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Usage
const isMobile = useMediaQuery('(max-width: 768px)');
const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
const isDesktop = useMediaQuery('(min-width: 1025px)');
const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
```

### 1.4 useClickOutside

```typescript
// hooks/useClickOutside.ts
import { useEffect, useRef, type RefObject } from 'react';

export function useClickOutside<T extends HTMLElement>(
  handler: () => void
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [handler]);

  return ref;
}

// Usage
const dropdownRef = useClickOutside<HTMLDivElement>(() => {
  setIsOpen(false);
});

return <div ref={dropdownRef}>{/* dropdown content */}</div>;
```

### 1.5 useDocumentTitle

```typescript
// hooks/useDocumentTitle.ts
import { useEffect } from 'react';

export function useDocumentTitle(title: string, suffix = 'Tourism Georgia'): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | ${suffix}` : suffix;

    return () => {
      document.title = previousTitle;
    };
  }, [title, suffix]);
}

// Usage
useDocumentTitle('Mountain Adventure Tour');
// Result: "Mountain Adventure Tour | Tourism Georgia"
```

### 1.6 useCopyToClipboard

```typescript
// hooks/useCopyToClipboard.ts
import { useState, useCallback } from 'react';

interface UseCopyToClipboardReturn {
  copy: (text: string) => Promise<boolean>;
  copied: boolean;
  error: Error | null;
}

export function useCopyToClipboard(resetDelay = 2000): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);

      setTimeout(() => setCopied(false), resetDelay);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to copy'));
      setCopied(false);
      return false;
    }
  }, [resetDelay]);

  return { copy, copied, error };
}

// Usage
const { copy, copied } = useCopyToClipboard();

<Button onClick={() => copy(shareUrl)}>
  {copied ? 'Copied!' : 'Copy Link'}
</Button>
```

---

## 2. Common Components

### 2.1 Pagination

```typescript
// components/common/Pagination.tsx
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

export const Pagination = ({ page, totalPages, onChange, className }: PaginationProps) => {
  // Generate page numbers to display
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (page > 3) {
      pages.push('ellipsis');
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push('ellipsis');
    }

    pages.push(totalPages);

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className={cn('flex items-center justify-center gap-1', className)} aria-label="Pagination">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((pageNum, index) =>
        pageNum === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-2">
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <Button
            key={pageNum}
            variant={pageNum === page ? 'default' : 'outline'}
            size="icon"
            onClick={() => onChange(pageNum)}
            aria-current={pageNum === page ? 'page' : undefined}
          >
            {pageNum}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
};
```

### 2.2 Empty State

```typescript
// components/common/EmptyState.tsx
import { FileQuestion, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = ({
  icon: Icon = FileQuestion,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => (
  <div className={cn('flex min-h-[300px] flex-col items-center justify-center p-8 text-center', className)}>
    <Icon className="mb-4 h-12 w-12 text-muted-foreground" />
    <h3 className="mb-2 text-xl font-semibold">{title}</h3>
    {description && (
      <p className="mb-4 max-w-md text-muted-foreground">{description}</p>
    )}
    {action && (
      <Button onClick={action.onClick}>{action.label}</Button>
    )}
  </div>
);

// Usage
<EmptyState
  title="No tours found"
  description="Try adjusting your filters or create a new tour"
  action={{ label: 'Create Tour', onClick: () => navigate('/tours/create') }}
/>
```

### 2.3 Confirm Dialog

```typescript
// components/common/ConfirmDialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void;
  isLoading?: boolean;
}

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isLoading}>{cancelLabel}</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          disabled={isLoading}
          className={variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
        >
          {isLoading ? 'Loading...' : confirmLabel}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

// Usage
const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
  open: false,
  id: null,
});

<ConfirmDialog
  open={deleteDialog.open}
  onOpenChange={(open) => setDeleteDialog({ open, id: null })}
  title="Delete Tour"
  description="Are you sure you want to delete this tour? This action cannot be undone."
  confirmLabel="Delete"
  variant="destructive"
  onConfirm={() => {
    if (deleteDialog.id) {
      deleteTour(deleteDialog.id);
    }
  }}
/>
```

### 2.4 Protected Route

```typescript
// components/common/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { LoadingPage } from './LoadingPage';
import type { UserRole } from '@/features/auth/types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerified?: boolean;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({
  children,
  requireVerified = false,
  allowedRoles,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  // Show loading while checking auth
  if (isLoading) {
    return <LoadingPage />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect if email verification required but not verified
  if (requireVerified && !user?.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Redirect if role not allowed
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

// Usage in router
<Route
  path="/dashboard"
  element={
    <ProtectedRoute requireVerified>
      <DashboardPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

---

## 3. Utility Functions

### 3.1 Format Utilities

```typescript
// lib/utils/format.utils.ts

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency = 'GEL',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat('en-US', options || defaultOptions).format(
    new Date(date)
  );
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = (then.getTime() - now.getTime()) / 1000;

  const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
  ];

  for (const { unit, seconds } of units) {
    if (Math.abs(diffInSeconds) >= seconds) {
      return rtf.format(Math.round(diffInSeconds / seconds), unit);
    }
  }

  return rtf.format(Math.round(diffInSeconds), 'second');
}

/**
 * Format duration in minutes to readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Pluralize word based on count
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || `${singular}s`);
}

// Usage
formatCurrency(150, 'USD'); // "$150"
formatDate('2025-01-30'); // "January 30, 2025"
formatRelativeTime('2025-01-28'); // "2 days ago"
formatDuration(150); // "2 hr 30 min"
truncate('Long text...', 20); // "Long text..."
pluralize(5, 'tour'); // "tours"
```

### 3.2 Validation Utilities

```typescript
// lib/utils/validation.utils.ts

/**
 * Check if valid email
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Check if valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if valid phone number
 */
export function isValidPhone(phone: string): boolean {
  return /^\+?[0-9]{10,15}$/.test(phone.replace(/[\s-]/g, ''));
}

/**
 * Check if file is valid image
 */
export function isValidImage(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  return validTypes.includes(file.type) && file.size <= maxSize;
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .slice(0, 255);
}
```

---

## 4. Router Setup

### 4.1 React Router Setup

```typescript
// app/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { ErrorPage } from '@/components/common/ErrorPage';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/features/home/pages/HomePage'));
const ToursPage = lazy(() => import('@/features/tours/pages/ToursPage'));
const TourDetailsPage = lazy(() => import('@/features/tours/pages/TourDetailsPage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      // Public routes
      { index: true, element: <HomePage /> },
      { path: 'tours', element: <ToursPage /> },
      { path: 'tours/:id', element: <TourDetailsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },

      // Protected routes
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute requireVerified>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-tours',
        element: (
          <ProtectedRoute allowedRoles={['COMPANY']}>
            <MyToursPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
```

### 4.2 Providers Setup

```typescript
// app/providers.tsx
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { store } from '@/store';
import { queryClient } from '@/lib/api/query-client';
import { LoadingPage } from '@/components/common/LoadingPage';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingPage />}>
        {children}
      </Suspense>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  </Provider>
);
```

### 4.3 Main Entry

```typescript
// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Providers } from './app/providers';
import { router } from './app/router';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>
);
```

---

## 5. Pattern Checklist

- [ ] Custom hooks are reusable and typed
- [ ] Common components handle edge cases
- [ ] Utility functions are pure and tested
- [ ] Protected routes check auth and roles
- [ ] Lazy loading used for route code splitting
- [ ] Providers wrap the app correctly
- [ ] Error boundaries catch component errors

---

**Version**: 2.0
**Last Updated**: 2025-01-30
