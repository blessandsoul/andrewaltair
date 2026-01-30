---
trigger: always_on
---

> **SCOPE**: These rules apply to **all client projects** (React SPA and Next.js).
> Note: Next.js has additional patterns for Server Components - see `/client/nextjs/`.

# API Integration & Error Handling

## Version: 2.0

---

## 1. HTTP Client Setup

### 1.1 Axios Configuration

```typescript
// lib/api/axios.config.ts
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { store } from '@/store';
import { logout, updateTokens } from '@/features/auth/store/authSlice';
import { env } from '@/lib/env';

// Create instance
export const apiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.tokens?.accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Wait for refresh to complete
        return new Promise((resolve) => {
          refreshQueue.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = store.getState().auth.tokens?.refreshToken;
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(
          `${env.VITE_API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        store.dispatch(updateTokens({ accessToken, refreshToken: newRefreshToken }));

        // Retry queued requests
        refreshQueue.forEach((cb) => cb(accessToken));
        refreshQueue = [];

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        refreshQueue = [];
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

---

## 2. Service Pattern

### 2.1 Base Service Structure

```typescript
// features/tours/services/tour.service.ts
import { apiClient } from '@/lib/api/axios.config';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/lib/api/api.types';
import type {
  Tour,
  CreateTourRequest,
  UpdateTourRequest,
  TourFilters
} from '../types/tour.types';

class TourService {
  /**
   * Get paginated list of tours
   */
  async getTours(params: TourFilters & PaginationParams = {}) {
    const response = await apiClient.get<PaginatedResponse<Tour>>(
      API_ENDPOINTS.TOURS.LIST,
      { params }
    );
    return response.data.data;
  }

  /**
   * Get single tour by ID
   */
  async getTour(id: string): Promise<Tour> {
    const response = await apiClient.get<ApiResponse<Tour>>(
      API_ENDPOINTS.TOURS.GET(id)
    );
    return response.data.data;
  }

  /**
   * Create new tour
   */
  async createTour(data: CreateTourRequest): Promise<Tour> {
    const response = await apiClient.post<ApiResponse<Tour>>(
      API_ENDPOINTS.TOURS.CREATE,
      data
    );
    return response.data.data;
  }

  /**
   * Update existing tour
   */
  async updateTour(id: string, data: UpdateTourRequest): Promise<Tour> {
    const response = await apiClient.patch<ApiResponse<Tour>>(
      API_ENDPOINTS.TOURS.UPDATE(id),
      data
    );
    return response.data.data;
  }

  /**
   * Delete tour
   */
  async deleteTour(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.TOURS.DELETE(id));
  }

  /**
   * Search tours
   */
  async searchTours(query: string): Promise<Tour[]> {
    const response = await apiClient.get<ApiResponse<Tour[]>>(
      API_ENDPOINTS.TOURS.SEARCH,
      { params: { q: query } }
    );
    return response.data.data;
  }
}

export const tourService = new TourService();
```

### 2.2 Auth Service

```typescript
// features/auth/services/auth.service.ts
import { apiClient } from '@/lib/api/axios.config';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';
import type { ApiResponse } from '@/lib/api/api.types';
import type {
  User,
  AuthTokens,
  LoginRequest,
  RegisterRequest
} from '../types/auth.types';

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );
    return response.data.data;
  }

  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async getMe(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.ME
    );
    return response.data.data;
  }

  async verifyEmail(token: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
  }

  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.REQUEST_PASSWORD_RESET, { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword });
  }
}

export const authService = new AuthService();
```

---

## 3. Error Handling

### 3.1 Error Utilities

```typescript
// lib/utils/error.utils.ts
import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/lib/api/api.types';

/**
 * Extract user-friendly error message from any error
 */
export function getErrorMessage(error: unknown): string {
  // API error response
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    // Server returned error response
    if (axiosError.response?.data?.error?.message) {
      return axiosError.response.data.error.message;
    }

    // Network error
    if (axiosError.code === 'ERR_NETWORK') {
      return 'Network error. Please check your connection.';
    }

    // Timeout
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }

    // Server error
    if (axiosError.response?.status && axiosError.response.status >= 500) {
      return 'Server error. Please try again later.';
    }

    return axiosError.message;
  }

  // Standard Error
  if (error instanceof Error) {
    return error.message;
  }

  // Unknown
  return 'An unexpected error occurred';
}

/**
 * Get error code from API error
 */
export function getErrorCode(error: unknown): string | undefined {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    return axiosError.response?.data?.error?.code;
  }
  return undefined;
}

/**
 * Check if error has specific code
 */
export function isErrorCode(error: unknown, code: string): boolean {
  return getErrorCode(error) === code;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    return error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED';
  }
  return false;
}

/**
 * Extract field-specific errors for forms
 */
export function getFieldErrors(error: unknown): Record<string, string> | null {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.error?.fields) {
      return data.error.fields;
    }
  }
  return null;
}
```

### 3.2 Error Type Guards

```typescript
// lib/api/api.types.ts
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

// Type guard
export function isApiError(error: unknown): error is AxiosError<ApiErrorResponse> {
  return (
    axios.isAxiosError(error) &&
    error.response?.data?.success === false
  );
}
```

---

## 4. Error Components

### 4.1 Error Message Component

```typescript
// components/common/ErrorMessage.tsx
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/utils/error.utils';

interface ErrorMessageProps {
  error: unknown;
  title?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage = ({
  error,
  title = 'Error',
  onRetry,
  className
}: ErrorMessageProps) => {
  const message = getErrorMessage(error);

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
```

### 4.2 Error Boundary

```typescript
// components/common/ErrorBoundary.tsx
import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // TODO: Send to error reporting service
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
          <h2 className="mb-2 text-2xl font-bold">Something went wrong</h2>
          <p className="mb-4 text-muted-foreground">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button onClick={this.handleRetry}>Try Again</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 5. Loading States

### 5.1 Loading Spinner

```typescript
// components/common/LoadingSpinner.tsx
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => (
  <Loader2 className={cn('animate-spin text-muted-foreground', sizeClasses[size], className)} />
);
```

### 5.2 Loading Page

```typescript
// components/common/LoadingPage.tsx
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingPageProps {
  message?: string;
}

export const LoadingPage = ({ message = 'Loading...' }: LoadingPageProps) => (
  <div className="flex min-h-[400px] flex-col items-center justify-center">
    <LoadingSpinner size="lg" />
    <p className="mt-4 text-muted-foreground">{message}</p>
  </div>
);
```

### 5.3 Skeleton Components

```typescript
// components/common/Skeletons.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const TourCardSkeleton = () => (
  <Card>
    <Skeleton className="h-48 w-full rounded-t-lg rounded-b-none" />
    <CardHeader className="space-y-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3 mt-2" />
    </CardContent>
  </Card>
);

export const TourListSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <TourCardSkeleton key={i} />
    ))}
  </div>
);

export const TableRowSkeleton = ({ columns = 4 }: { columns?: number }) => (
  <tr>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="p-4">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);
```

---

## 6. Toast Notifications

### 6.1 Toast Usage

```typescript
// Using sonner
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils/error.utils';

// Success
toast.success('Tour created successfully');

// Error
toast.error(getErrorMessage(error));

// With description
toast.success('Tour created', {
  description: 'Your tour is now live',
});

// Loading state
const toastId = toast.loading('Creating tour...');
try {
  await createTour(data);
  toast.success('Tour created!', { id: toastId });
} catch (error) {
  toast.error(getErrorMessage(error), { id: toastId });
}

// With action
toast.error('Failed to delete tour', {
  action: {
    label: 'Retry',
    onClick: () => handleRetry(),
  },
});

// Promise-based
toast.promise(createTour(data), {
  loading: 'Creating tour...',
  success: 'Tour created!',
  error: (error) => getErrorMessage(error),
});
```

---

## 7. File Upload

### 7.1 Upload Service

```typescript
// features/media/services/upload.service.ts
import { apiClient } from '@/lib/api/axios.config';
import type { ApiResponse } from '@/lib/api/api.types';

interface UploadedFile {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class UploadService {
  async uploadImages(
    files: File[],
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadedFile[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const response = await apiClient.post<ApiResponse<UploadedFile[]>>(
      '/media/upload',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (event.total && onProgress) {
            onProgress({
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
            });
          }
        },
      }
    );

    return response.data.data;
  }
}

export const uploadService = new UploadService();
```

### 7.2 Upload Hook

```typescript
// features/media/hooks/useUpload.ts
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { uploadService } from '../services/upload.service';
import { getErrorMessage } from '@/lib/utils/error.utils';

export const useUpload = () => {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: (files: File[]) =>
      uploadService.uploadImages(files, (p) => setProgress(p.percentage)),
    onSuccess: () => {
      setProgress(0);
      toast.success('Files uploaded successfully');
    },
    onError: (error) => {
      setProgress(0);
      toast.error(getErrorMessage(error));
    },
  });

  return {
    upload: mutation.mutate,
    uploadAsync: mutation.mutateAsync,
    isUploading: mutation.isPending,
    progress,
    error: mutation.error,
  };
};
```

---

## 8. Advanced Patterns

### 8.1 Debounced Search

```typescript
// features/tours/hooks/useSearchTours.ts
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import { tourService } from '../services/tour.service';
import { tourKeys } from '../utils/tour.keys';

export const useSearchTours = (minLength = 2, debounceMs = 300) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceMs);

  const { data, isLoading, error } = useQuery({
    queryKey: [...tourKeys.all, 'search', debouncedQuery],
    queryFn: () => tourService.searchTours(debouncedQuery),
    enabled: debouncedQuery.length >= minLength,
  });

  const results = useMemo(() => data ?? [], [data]);

  return {
    query,
    setQuery,
    results,
    isLoading: isLoading && debouncedQuery.length >= minLength,
    error,
    isEmpty: !isLoading && results.length === 0 && debouncedQuery.length >= minLength,
  };
};
```

### 8.2 Infinite Scroll

```typescript
// features/tours/hooks/useInfiniteTours.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { tourService } from '../services/tour.service';
import { tourKeys } from '../utils/tour.keys';
import type { TourFilters } from '../types/tour.types';

export const useInfiniteTours = (filters: TourFilters = {}) => {
  return useInfiniteQuery({
    queryKey: [...tourKeys.lists(), 'infinite', filters],
    queryFn: ({ pageParam = 1 }) =>
      tourService.getTours({ ...filters, page: pageParam, limit: 12 }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: 1,
  });
};

// Usage in component
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage
} = useInfiniteTours(filters);

const allTours = data?.pages.flatMap((page) => page.items) ?? [];

<div>
  {allTours.map((tour) => (
    <TourCard key={tour.id} tour={tour} />
  ))}

  {hasNextPage && (
    <Button
      onClick={() => fetchNextPage()}
      disabled={isFetchingNextPage}
    >
      {isFetchingNextPage ? 'Loading...' : 'Load More'}
    </Button>
  )}
</div>
```

### 8.3 Retry Logic

```typescript
// features/tours/hooks/useTourWithRetry.ts
export const useTourWithRetry = (id: string) => {
  return useQuery({
    queryKey: tourKeys.detail(id),
    queryFn: () => tourService.getTour(id),
    retry: (failureCount, error) => {
      // Don't retry on 404
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
```

---

## 9. API Integration Checklist

- [ ] Axios instance configured with baseURL and interceptors
- [ ] Token refresh handles concurrent requests
- [ ] Services use typed responses
- [ ] Error utilities extract user-friendly messages
- [ ] Loading states show skeletons/spinners
- [ ] Toast notifications for success/error
- [ ] File uploads track progress
- [ ] Search debounced appropriately
- [ ] Infinite scroll handles pagination

---

**Version**: 2.0
**Last Updated**: 2025-01-30
