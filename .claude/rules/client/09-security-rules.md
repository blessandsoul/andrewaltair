---
trigger: always_on
---

> **SCOPE**: These rules apply to **all client projects** (React SPA and Next.js).

# Frontend Security Rules

## Version: 2.0

---

## 1. Core Principles

| # | Principle | Description |
|---|-----------|-------------|
| 1 | Never trust user input | All input is potentially malicious |
| 2 | Never expose secrets | No API keys, tokens, or credentials in client code |
| 3 | Defense in depth | Multiple layers of protection |
| 4 | Fail secure | Errors should deny access, not grant it |

---

## 2. XSS Prevention

### 2.1 React's Built-in Protection

React automatically escapes values rendered in JSX:

```tsx
// ✅ SAFE - React escapes these
<div>{userInput}</div>
<p>{tour.title}</p>
<span>{comment.text}</span>

// The above renders: &lt;script&gt; instead of <script>
```

### 2.2 Dangerous Patterns

```tsx
// ❌ DANGEROUS - Never use without sanitization
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ❌ DANGEROUS - Dynamic href with user input
<a href={userProvidedUrl}>Click here</a>

// ❌ DANGEROUS - Dynamic event handlers
<button onClick={eval(userCode)}>Click</button>
```

### 2.3 When HTML is Required

```tsx
// ✅ SAFE - Use DOMPurify to sanitize
import DOMPurify from 'dompurify';

interface SafeHtmlProps {
  html: string;
  allowedTags?: string[];
  className?: string;
}

export const SafeHtml = ({ html, allowedTags, className }: SafeHtmlProps) => {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedTags || ['b', 'i', 'strong', 'em', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};

// Usage
<SafeHtml html={tour.description} />
```

### 2.4 URL Sanitization

```typescript
// lib/utils/security.utils.ts

/**
 * Check if URL is safe (not javascript:, data:, etc.)
 */
export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
  } catch {
    // Relative URLs are safe
    return !url.includes(':') || url.startsWith('/');
  }
}

/**
 * Sanitize URL or return fallback
 */
export function sanitizeUrl(url: string, fallback = '#'): string {
  return isSafeUrl(url) ? url : fallback;
}

// Usage
<a href={sanitizeUrl(userUrl)}>Link</a>
```

---

## 3. Authentication & Token Security

### 3.1 Token Storage

| Storage | XSS Risk | CSRF Risk | Recommendation |
|---------|----------|-----------|----------------|
| localStorage | High | None | Avoid for sensitive tokens |
| sessionStorage | High | None | OK for short sessions |
| httpOnly Cookie | None | High | Best with CSRF protection |
| Memory (Redux) | High | None | OK with refresh token rotation |

### 3.2 Token Handling Pattern

```typescript
// store/slices/authSlice.ts

// Access token in memory (Redux)
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

// Persist auth state with caution
const loadAuthState = (): Partial<AuthState> => {
  try {
    const stored = localStorage.getItem('auth');
    if (!stored) return {};

    const parsed = JSON.parse(stored);
    // Only restore user info, not tokens from localStorage
    return {
      user: parsed.user,
      isAuthenticated: false, // Force re-auth
    };
  } catch {
    return {};
  }
};
```

### 3.3 Token Transmission

```typescript
// ✅ CORRECT - In Authorization header
apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ❌ NEVER - In URL parameters
fetch(`/api/data?token=${token}`);

// ❌ NEVER - Log tokens
console.log('Token:', token);
```

### 3.4 Auto Logout

```typescript
// hooks/useAutoLogout.ts
import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function useAutoLogout(timeoutMinutes = 30) {
  const { logout, isAuthenticated } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      logout();
    }, timeoutMinutes * 60 * 1000);
  }, [logout, timeoutMinutes]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => document.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach((event) => document.removeEventListener(event, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isAuthenticated, resetTimer]);
}

// Use in App or Layout
useAutoLogout(30); // 30 minutes
```

---

## 4. Input Validation & Sanitization

### 4.1 Client-Side Validation (UX Only)

```typescript
// Client validation is for UX, NOT security
// Backend MUST validate everything

const tourSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long')
    .regex(/^[a-zA-Z0-9\s\-.,!?'"()]+$/, 'Title contains invalid characters'),
  price: z.number().min(0).max(1000000),
  description: z.string().max(10000).optional(),
});
```

### 4.2 Sanitization Functions

```typescript
// lib/utils/sanitize.utils.ts

/**
 * Sanitize string input
 */
export function sanitizeString(input: string, maxLength = 1000): string {
  return input
    .trim()
    .replace(/[<>]/g, '')  // Remove < and >
    .slice(0, maxLength);
}

/**
 * Sanitize email
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim().slice(0, 255);
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

/**
 * Sanitize for display (prevents log injection)
 */
export function sanitizeForLog(input: unknown): string {
  const str = String(input);
  return str.replace(/[\r\n]/g, ' ').slice(0, 500);
}
```

---

## 5. Environment Variables

### 5.1 What Can Be Exposed

```env
# ✅ SAFE to expose (public)
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=Tourism Georgia
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
VITE_GOOGLE_MAPS_KEY=AIza...

# ❌ NEVER expose (server-only)
# DATABASE_URL=postgres://...
# JWT_SECRET=xxx
# STRIPE_SECRET_KEY=sk_live_xxx
# AWS_SECRET_KEY=xxx
```

### 5.2 Environment Validation

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_APP_NAME: z.string().min(1),
  // Public keys only
  VITE_STRIPE_PUBLIC_KEY: z.string().startsWith('pk_').optional(),
});

// Validate at build time
export const env = envSchema.parse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  VITE_STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
});
```

### 5.3 .gitignore

```gitignore
# Environment files
.env
.env.local
.env.*.local
!.env.example

# Never commit
*.pem
*.key
credentials.json
secrets/
```

---

## 6. Sensitive Data Handling

### 6.1 Never Log Sensitive Data

```typescript
// ❌ DANGEROUS
console.log('User:', user);
console.log('Form data:', formData);
console.log('Request:', { headers, body });

// ✅ SAFE - Log only IDs/non-sensitive info
if (import.meta.env.DEV) {
  console.log('User ID:', user.id);
  console.log('Action:', action);
}
```

### 6.2 Clear Data on Logout

```typescript
const logout = async () => {
  try {
    await authService.logout();
  } finally {
    // Clear all sensitive data
    dispatch(logoutAction());
    localStorage.removeItem('auth');
    sessionStorage.clear();

    // Clear React Query cache
    queryClient.clear();

    // Redirect
    navigate('/login');
  }
};
```

### 6.3 Mask Sensitive Information

```typescript
// lib/utils/mask.utils.ts

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***@***';

  const maskedLocal = local.length > 2
    ? `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`
    : '***';

  return `${maskedLocal}@${domain}`;
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7) return '****';

  return `${digits.slice(0, 3)}****${digits.slice(-3)}`;
}

export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  return `**** **** **** ${digits.slice(-4)}`;
}

// Usage
<p>Email: {maskEmail(user.email)}</p>  // j***n@example.com
<p>Phone: {maskPhone(user.phone)}</p>  // 555****1234
```

---

## 7. File Upload Security

### 7.1 Validate Before Upload

```typescript
// lib/utils/file.utils.ts

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ValidationResult {
  // Check MIME type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  // Check extension matches MIME type
  const extension = file.name.split('.').pop()?.toLowerCase();
  const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  if (!extension || !validExtensions.includes(extension)) {
    return { valid: false, error: 'Invalid file extension' };
  }

  return { valid: true };
}

// Usage
const handleFileSelect = (files: FileList) => {
  for (const file of files) {
    const result = validateImageFile(file);
    if (!result.valid) {
      toast.error(result.error);
      return;
    }
  }
  // Proceed with upload
};
```

---

## 8. Third-Party Dependencies

### 8.1 Audit Regularly

```bash
# Check for vulnerabilities
npm audit

# Fix automatically where possible
npm audit fix

# Check for outdated packages
npm outdated
```

### 8.2 Package Selection Criteria

Before adding a dependency, verify:

- [ ] Weekly downloads > 100k (or well-known maintainer)
- [ ] Last commit < 6 months ago
- [ ] No critical vulnerabilities in `npm audit`
- [ ] Clear documentation
- [ ] TypeScript support

### 8.3 Lock Versions

```json
// package.json - Use exact versions for critical packages
{
  "dependencies": {
    "react": "18.2.0",           // Exact
    "axios": "^1.6.0",           // Minor updates OK
    "some-ui-lib": "~2.0.0"      // Patch updates only
  }
}
```

---

## 9. Content Security Policy

```html
<!-- index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://js.stripe.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https: blob:;
    connect-src 'self' https://api.example.com https://api.stripe.com;
    frame-src https://js.stripe.com;
  "
/>
```

---

## 10. Secure Communication

### 10.1 HTTPS Only

```typescript
// lib/api/axios.config.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Validate HTTPS in production
if (import.meta.env.PROD && !API_BASE_URL.startsWith('https://')) {
  throw new Error('API_BASE_URL must use HTTPS in production');
}
```

### 10.2 External Links

```tsx
// Always use rel="noopener noreferrer" for external links
<a
  href={externalUrl}
  target="_blank"
  rel="noopener noreferrer"
>
  External Link
</a>

// Component wrapper
interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const ExternalLink = ({ href, children, className }: ExternalLinkProps) => (
  <a
    href={sanitizeUrl(href)}
    target="_blank"
    rel="noopener noreferrer"
    className={className}
  >
    {children}
  </a>
);
```

---

## 11. Security Checklist

### Pre-Deployment

- [ ] No secrets in client code
- [ ] All env variables validated
- [ ] HTTPS enforced in production
- [ ] No console.log with sensitive data
- [ ] Dependencies audited (`npm audit`)
- [ ] File uploads validated
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] Auto-logout configured
- [ ] External links have `rel="noopener noreferrer"`
- [ ] All inputs validated (client + server)
- [ ] Sensitive data cleared on logout
- [ ] CSP headers configured

### Ongoing

- [ ] Weekly `npm audit`
- [ ] Monthly dependency updates
- [ ] Code reviews check for security issues
- [ ] Security testing in CI/CD

---

**Version**: 2.0
**Last Updated**: 2025-01-30
