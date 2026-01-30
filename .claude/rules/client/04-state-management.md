---
trigger: always_on
---

> **SCOPE**: These rules apply to **all client projects** (React SPA and Next.js).
> Note: Next.js Server Components have different patterns - see `/client/nextjs/`.

# State Management

## Version: 2.0

---

## 1. State Strategy

### 1.1 Decision Matrix

| State Type | Tool | When to Use | Examples |
|------------|------|-------------|----------|
| **Server Data** | React Query | Data from API | Tours, bookings, user profile |
| **Global Client** | Redux/Zustand | Shared across app | Auth, theme, cart |
| **Local** | useState | Single component | Form inputs, modals, toggles |
| **URL** | Router params | Shareable/bookmarkable | Filters, pagination, search |
| **Form** | React Hook Form | Form data | All forms |

### 1.2 State Location Flowchart

```
Is it from the server/API?
  ├─ YES → React Query
  └─ NO → Is it shared across multiple components?
            ├─ YES → Should it persist in URL?
            │         ├─ YES → URL State (searchParams)
            │         └─ NO → Redux/Zustand
            └─ NO → useState/useReducer
```

---

## 2. React Query (Server State)

### 2.1 Setup

```typescript
// lib/api/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      gcTime: 10 * 60 * 1000,        // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
      throwOnError: false,
    },
    mutations: {
      retry: 0,
      throwOnError: false,
    },
  },
});
```

### 2.2 Query Keys Factory

```typescript
// features/tours/utils/tour.keys.ts
export const tourKeys = {
  all: ['tours'] as const,
  lists: () => [...tourKeys.all, 'list'] as const,
  list: (filters: TourFilters) => [...tourKeys.lists(), filters] as const,
  details: () => [...tourKeys.all, 'detail'] as const,
  detail: (id: string) => [...tourKeys.details(), id] as const,
};

// Usage
useQuery({ queryKey: tourKeys.detail(id) });
queryClient.invalidateQueries({ queryKey: tourKeys.lists() });
```

### 2.3 Query Hook Pattern

```typescript
// features/tours/hooks/useTours.ts
import { useQuery } from '@tanstack/react-query';
import { tourService } from '../services/tour.service';
import { tourKeys } from '../utils/tour.keys';
import type { TourFilters } from '../types/tour.types';

export const useTours = (filters: TourFilters = {}) => {
  return useQuery({
    queryKey: tourKeys.list(filters),
    queryFn: () => tourService.getTours(filters),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });
};

// Single item query
export const useTour = (id: string) => {
  return useQuery({
    queryKey: tourKeys.detail(id),
    queryFn: () => tourService.getTour(id),
    enabled: !!id,  // Only fetch when id exists
  });
};
```

### 2.4 Mutation Hook Pattern

```typescript
// features/tours/hooks/useCreateTour.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { tourService } from '../services/tour.service';
import { tourKeys } from '../utils/tour.keys';
import { getErrorMessage } from '@/lib/utils/error.utils';
import type { CreateTourRequest } from '../types/tour.types';

export const useCreateTour = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateTourRequest) => tourService.createTour(data),
    onSuccess: (newTour) => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: tourKeys.lists() });

      // Optionally set the new tour in cache
      queryClient.setQueryData(tourKeys.detail(newTour.id), newTour);

      toast.success('Tour created successfully');
      navigate(`/tours/${newTour.id}`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
```

### 2.5 Update Mutation

```typescript
// features/tours/hooks/useUpdateTour.ts
export const useUpdateTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTourRequest }) =>
      tourService.updateTour(id, data),
    onSuccess: (updatedTour) => {
      // Update cache directly
      queryClient.setQueryData(tourKeys.detail(updatedTour.id), updatedTour);

      // Invalidate list to reflect changes
      queryClient.invalidateQueries({ queryKey: tourKeys.lists() });

      toast.success('Tour updated successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
```

### 2.6 Delete Mutation

```typescript
// features/tours/hooks/useDeleteTour.ts
export const useDeleteTour = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (id: string) => tourService.deleteTour(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: tourKeys.detail(deletedId) });

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: tourKeys.lists() });

      toast.success('Tour deleted successfully');
      navigate('/tours');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
```

### 2.7 Optimistic Updates

```typescript
// features/tours/hooks/useToggleFavorite.ts
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tourId, isFavorite }: { tourId: string; isFavorite: boolean }) =>
      isFavorite ? tourService.removeFavorite(tourId) : tourService.addFavorite(tourId),

    // Optimistic update
    onMutate: async ({ tourId, isFavorite }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: tourKeys.detail(tourId) });

      // Snapshot previous value
      const previousTour = queryClient.getQueryData<Tour>(tourKeys.detail(tourId));

      // Optimistically update
      if (previousTour) {
        queryClient.setQueryData(tourKeys.detail(tourId), {
          ...previousTour,
          isFavorite: !isFavorite,
        });
      }

      return { previousTour };
    },

    // Rollback on error
    onError: (error, { tourId }, context) => {
      if (context?.previousTour) {
        queryClient.setQueryData(tourKeys.detail(tourId), context.previousTour);
      }
      toast.error(getErrorMessage(error));
    },

    // Refetch after success or error
    onSettled: (_, __, { tourId }) => {
      queryClient.invalidateQueries({ queryKey: tourKeys.detail(tourId) });
    },
  });
};
```

---

## 3. Redux (Global Client State)

### 3.1 Store Setup

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/features/auth/store/authSlice';
import { uiReducer } from './slices/uiSlice';

// Load persisted auth state
const loadAuthState = (): AuthState | undefined => {
  try {
    const serialized = localStorage.getItem('auth');
    return serialized ? JSON.parse(serialized) : undefined;
  } catch {
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
  preloadedState: {
    auth: loadAuthState(),
  },
});

// Persist auth state
store.subscribe(() => {
  const authState = store.getState().auth;
  try {
    localStorage.setItem('auth', JSON.stringify(authState));
  } catch {
    // Ignore write errors
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 3.2 Typed Hooks

```typescript
// store/hooks.ts
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### 3.3 Slice Pattern

```typescript
// features/auth/store/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, AuthTokens } from '../types/auth.types';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; tokens: AuthTokens }>
    ) => {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
    },
    updateTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.tokens = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logout: () => initialState,
  },
});

export const { setCredentials, updateTokens, updateUser, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
```

### 3.4 Selector Pattern

```typescript
// features/auth/store/authSelectors.ts
import type { RootState } from '@/store';

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectTokens = (state: RootState) => state.auth.tokens;
export const selectUserRole = (state: RootState) => state.auth.user?.role;
```

### 3.5 Custom Hook Wrapper

```typescript
// features/auth/hooks/useAuth.ts
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCredentials, logout as logoutAction } from '../store/authSlice';
import { selectUser, selectIsAuthenticated, selectTokens } from '../store/authSelectors';
import { authService } from '../services/auth.service';
import { queryClient } from '@/lib/api/query-client';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const tokens = useAppSelector(selectTokens);

  const login = useCallback(async (credentials: LoginRequest) => {
    const { user, tokens } = await authService.login(credentials);
    dispatch(setCredentials({ user, tokens }));
    navigate('/dashboard');
  }, [dispatch, navigate]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      dispatch(logoutAction());
      queryClient.clear();  // Clear all cached data
      navigate('/login');
    }
  }, [dispatch, navigate]);

  return {
    user,
    isAuthenticated,
    tokens,
    login,
    logout,
  };
};
```

---

## 4. Local State

### 4.1 useState

```typescript
// Simple state
const [isOpen, setIsOpen] = useState(false);
const [count, setCount] = useState(0);
const [selectedId, setSelectedId] = useState<string | null>(null);

// State with initial value from props
const [value, setValue] = useState(initialValue);

// Lazy initialization for expensive computations
const [data, setData] = useState(() => computeExpensiveValue());

// Functional updates (always current)
const increment = () => setCount((prev) => prev + 1);
```

### 4.2 useReducer (Complex State)

```typescript
// For state with multiple sub-values or complex transitions
interface FormState {
  values: { title: string; price: number };
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
}

type FormAction =
  | { type: 'SET_FIELD'; field: string; value: string | number }
  | { type: 'SET_ERROR'; field: string; error: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR' }
  | { type: 'RESET' };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        isDirty: true,
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true };
    case 'SUBMIT_SUCCESS':
      return { ...state, isSubmitting: false, isDirty: false };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Usage
const [state, dispatch] = useReducer(formReducer, initialState);
```

---

## 5. URL State

### 5.1 Search Params Pattern

```typescript
// React Router
import { useSearchParams } from 'react-router-dom';

export const ToursPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read from URL
  const page = parseInt(searchParams.get('page') || '1', 10);
  const city = searchParams.get('city') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';

  // Construct filters
  const filters: TourFilters = {
    page,
    city: city || undefined,
    sortBy: sortBy as TourFilters['sortBy'],
  };

  // Update URL
  const handleFilterChange = (newFilters: Partial<TourFilters>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change (except page itself)
    if (!('page' in newFilters)) {
      params.set('page', '1');
    }

    setSearchParams(params);
  };

  const { data } = useTours(filters);

  return (
    <div>
      <TourFilters value={filters} onChange={handleFilterChange} />
      <TourList tours={data?.items} />
      <Pagination
        page={page}
        totalPages={data?.pagination.totalPages}
        onChange={(p) => handleFilterChange({ page: p })}
      />
    </div>
  );
};
```

### 5.2 Custom URL State Hook

```typescript
// hooks/useUrlState.ts
export function useUrlState<T extends Record<string, string | number | undefined>>(
  defaultValues: T
): [T, (updates: Partial<T>) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo(() => {
    const result = { ...defaultValues };

    for (const key of Object.keys(defaultValues)) {
      const value = searchParams.get(key);
      if (value !== null) {
        const defaultValue = defaultValues[key];
        result[key as keyof T] = (
          typeof defaultValue === 'number' ? parseInt(value, 10) : value
        ) as T[keyof T];
      }
    }

    return result;
  }, [searchParams, defaultValues]);

  const setState = useCallback((updates: Partial<T>) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== defaultValues[key]) {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });

      return params;
    });
  }, [setSearchParams, defaultValues]);

  return [state, setState];
}

// Usage
const [filters, setFilters] = useUrlState({
  page: 1,
  city: '',
  sortBy: 'createdAt',
});
```

---

## 6. Derived State

### 6.1 Compute, Don't Store

```typescript
// ❌ BAD - Redundant state
const [tours, setTours] = useState<Tour[]>([]);
const [activeTours, setActiveTours] = useState<Tour[]>([]);

useEffect(() => {
  setActiveTours(tours.filter((t) => t.isActive));
}, [tours]);

// ✅ GOOD - Compute on render
const [tours, setTours] = useState<Tour[]>([]);
const activeTours = useMemo(
  () => tours.filter((t) => t.isActive),
  [tours]
);

// ✅ GOOD - Simple computation (no memoization needed)
const tourCount = tours.length;
const hasActiveTours = tours.some((t) => t.isActive);
```

---

## 7. Anti-Patterns

### 7.1 What NOT to Do

```typescript
// ❌ Server data in Redux
const toursSlice = createSlice({
  reducers: {
    setTours: (state, action) => { state.tours = action.payload; },
    setLoading: (state, action) => { state.isLoading = action.payload; },
  },
});
// ✅ Use React Query instead

// ❌ Modal state in Redux
const uiSlice = createSlice({
  reducers: {
    openModal: (state) => { state.isModalOpen = true; },
  },
});
// ✅ Use local useState instead

// ❌ Form data in Redux
const formSlice = createSlice({
  reducers: {
    setFieldValue: (state, action) => { ... },
  },
});
// ✅ Use React Hook Form instead

// ❌ Derived data as state
const [total, setTotal] = useState(0);
useEffect(() => {
  setTotal(items.reduce((sum, item) => sum + item.price, 0));
}, [items]);
// ✅ Compute: const total = useMemo(() => items.reduce(...), [items]);
```

---

## 8. State Checklist

- [ ] Server data uses React Query
- [ ] Auth/theme uses Redux/Zustand
- [ ] Form state uses React Hook Form
- [ ] URL reflects shareable state (filters, pagination)
- [ ] Local state stays local (modals, hover, form inputs)
- [ ] No derived state in useState
- [ ] Query keys use factory pattern
- [ ] Mutations invalidate relevant queries

---

**Version**: 2.0
**Last Updated**: 2025-01-30
