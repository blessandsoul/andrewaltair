---
trigger: always_on
---

> **SCOPE**: These rules apply specifically to **React SPA** projects (Vite + React Router).
> For shared rules, see `/client/` directory.

# React SPA Setup & Configuration

## Version: 1.0

---

## 1. Project Structure

### 1.1 React SPA Structure

```
my-react-app/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── app/                    # App configuration
│   │   ├── App.tsx            # Root component
│   │   ├── router.tsx         # React Router config
│   │   └── providers.tsx      # Provider wrapper
│   ├── components/            # Shared components
│   ├── features/              # Feature modules
│   ├── hooks/                 # Global hooks
│   ├── lib/                   # Utilities & config
│   ├── store/                 # Redux store
│   ├── types/                 # Global types
│   ├── styles/
│   │   └── globals.css
│   ├── main.tsx              # Entry point
│   └── vite-env.d.ts
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 2. Vite Configuration

### 2.1 vite.config.ts

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
});
```

### 2.2 TypeScript Config

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 3. React Router Setup

### 3.1 Router Configuration

```typescript
// app/router.tsx
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { LoadingPage } from '@/components/common/LoadingPage';
import { ErrorPage } from '@/components/common/ErrorPage';
import { NotFoundPage } from '@/components/common/NotFoundPage';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/features/home/pages/HomePage'));
const ToursPage = lazy(() => import('@/features/tours/pages/ToursPage'));
const TourDetailsPage = lazy(() => import('@/features/tours/pages/TourDetailsPage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));

// Suspense wrapper for lazy components
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingPage />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      // Public routes
      {
        index: true,
        element: <SuspenseWrapper><HomePage /></SuspenseWrapper>,
      },
      {
        path: 'tours',
        element: <SuspenseWrapper><ToursPage /></SuspenseWrapper>,
      },
      {
        path: 'tours/:id',
        element: <SuspenseWrapper><TourDetailsPage /></SuspenseWrapper>,
      },
      {
        path: 'login',
        element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
      },
      {
        path: 'register',
        element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper>,
      },

      // Protected routes
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <SuspenseWrapper><DashboardPage /></SuspenseWrapper>
          </ProtectedRoute>
        ),
      },

      // 404
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
```

### 3.2 Navigation Hooks

```typescript
// React Router navigation
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';

// Navigation
const navigate = useNavigate();
navigate('/tours');
navigate('/tours/123');
navigate(-1);  // Go back

// URL parameters
const { id } = useParams<{ id: string }>();

// Search params
const [searchParams, setSearchParams] = useSearchParams();
const page = searchParams.get('page') || '1';

// Location
const location = useLocation();
const { pathname, search, state } = location;
```

---

## 4. Entry Point & Providers

### 4.1 main.tsx

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

### 4.2 providers.tsx

```typescript
// app/providers.tsx
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { store } from '@/store';
import { queryClient } from '@/lib/api/query-client';
import { LoadingPage } from '@/components/common/LoadingPage';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => (
  <ErrorBoundary>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingPage />}>
          {children}
        </Suspense>
        <Toaster position="top-right" richColors />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </Provider>
  </ErrorBoundary>
);
```

---

## 5. Layout Components

### 5.1 MainLayout

```typescript
// components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
```

### 5.2 Page Components

```typescript
// features/tours/pages/ToursPage.tsx
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { TourList } from '../components/TourList';
import { TourFilters } from '../components/TourFilters';

export default function ToursPage() {
  useDocumentTitle('Tours');

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Tours</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <TourFilters />
        </aside>
        <section className="lg:col-span-3">
          <TourList />
        </section>
      </div>
    </div>
  );
}
```

---

## 6. Environment Variables

### 6.1 Vite Environment

```env
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Tourism Georgia

# .env.production
VITE_API_BASE_URL=https://api.tourismgeorgia.com/api/v1
VITE_APP_NAME=Tourism Georgia
```

### 6.2 Type-Safe Access

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_APP_NAME: z.string().min(1),
  DEV: z.boolean(),
  PROD: z.boolean(),
});

export const env = envSchema.parse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
});
```

---

## 7. Build & Deploy

### 7.1 Build Commands

```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  }
}
```

### 7.2 SPA Hosting Configuration

For SPA hosting (Netlify, Vercel, etc.), configure redirects for client-side routing:

```toml
# netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 8. React-Specific Patterns

### 8.1 Client-Side Only Features

React SPA runs entirely in the browser:

```typescript
// All data fetching is client-side
const { data } = useQuery({
  queryKey: ['tours'],
  queryFn: () => tourService.getTours(),
});

// Document title hook
useEffect(() => {
  document.title = `${title} | ${APP_NAME}`;
}, [title]);

// Local storage access (always available)
const value = localStorage.getItem('key');
```

### 8.2 SEO Considerations

For SPAs, use React Helmet for meta tags:

```typescript
import { Helmet } from 'react-helmet-async';

export const TourDetailsPage = () => {
  const { tour } = useTour(id);

  return (
    <>
      <Helmet>
        <title>{tour?.title} | Tourism Georgia</title>
        <meta name="description" content={tour?.summary} />
        <meta property="og:title" content={tour?.title} />
        <meta property="og:description" content={tour?.summary} />
      </Helmet>
      {/* Page content */}
    </>
  );
};
```

---

## 9. Checklist

- [ ] Vite configured with aliases and proxy
- [ ] TypeScript strict mode enabled
- [ ] React Router with lazy loading
- [ ] Providers wrap the app correctly
- [ ] Environment variables typed
- [ ] SPA hosting redirects configured
- [ ] Error boundary at root level

---

**Version**: 1.0
**Last Updated**: 2025-01-30
