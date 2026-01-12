# 🔒 Security Fixes - Implementation Guide

**Reference:** SECURITY_AUDIT_REPORT.md  
**Priority:** Critical & High Severity Issues  
**Estimated Time:** 20-30 hours

---

## 🚨 Critical Fix #1: Secure Backup Code Hashing

### Current Issue
```typescript
// ❌ INSECURE - Base64 is reversible
export function hashBackupCode(code: string): string {
    return Buffer.from(code).toString('base64')
}
```

### Implementation

**Step 1:** Update `src/lib/totp.ts`

```typescript
import { authenticator } from 'otplib'
import * as QRCode from 'qrcode'
import bcrypt from 'bcryptjs'

// ... existing code ...

/**
 * Hash backup codes for secure storage
 * Uses bcrypt with salt rounds of 10
 */
export async function hashBackupCode(code: string): Promise<string> {
    const normalizedCode = code.toUpperCase().replace(/\s/g, '');
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(normalizedCode, salt);
}

/**
 * Verify a backup code against stored hashes
 * Returns the index of the matched code for removal
 */
export async function verifyBackupCode(
    code: string, 
    hashedCodes: string[]
): Promise<{ valid: boolean; index: number }> {
    const normalizedCode = code.toUpperCase().replace(/\s/g, '');
    
    for (let i = 0; i < hashedCodes.length; i++) {
        try {
            const isMatch = await bcrypt.compare(normalizedCode, hashedCodes[i]);
            if (isMatch) {
                return { valid: true, index: i };
            }
        } catch (error) {
            console.error('Backup code verification error:', error);
            continue;
        }
    }
    
    return { valid: false, index: -1 };
}

/**
 * Generate backup codes (one-time use)
 * Format: XXXX-XXXX (8 characters with dash for readability)
 */
export function generateBackupCodes(count: number = 8): string[] {
    const codes: string[] = [];
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars
    
    for (let i = 0; i < count; i++) {
        const code = Array.from({ length: 8 }, () =>
            chars[Math.floor(Math.random() * chars.length)]
        ).join('');
        
        // Format as XXXX-XXXX for readability
        const formatted = `${code.slice(0, 4)}-${code.slice(4)}`;
        codes.push(formatted);
    }
    
    return codes;
}
```

**Step 2:** Update 2FA API endpoint to use async hashing

```typescript
// src/app/api/auth/2fa/route.ts
import { generateBackupCodes, hashBackupCode } from '@/lib/totp';

export async function POST(request: Request) {
    // ... existing code ...
    
    if (action === 'enable') {
        const backupCodes = generateBackupCodes(8);
        
        // Hash all backup codes asynchronously
        const hashedCodes = await Promise.all(
            backupCodes.map(code => hashBackupCode(code))
        );
        
        user.backupCodes = hashedCodes;
        await user.save();
        
        return NextResponse.json({
            success: true,
            backupCodes // Return plain codes to user ONCE
        });
    }
}
```

**Step 3:** Update User model

```typescript
// src/models/User.ts
backupCodes: {
    type: [String],
    select: false, // Never include by default
    validate: {
        validator: function(codes: string[]) {
            // Ensure all codes are bcrypt hashes
            return codes.every(code => code.startsWith('$2'));
        },
        message: 'Invalid backup code format'
    }
}
```

**Testing:**
```bash
# Test backup code generation and verification
npm run test -- totp.test.ts
```

---

## 🚨 Critical Fix #2: JWT Secret Validation

### Implementation

**Step 1:** Create `src/lib/jwt-config.ts`

```typescript
import jwt from 'jsonwebtoken';

// Validate JWT_SECRET at startup
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('❌ JWT_SECRET environment variable is required');
}

if (JWT_SECRET.length < 32) {
    throw new Error('❌ JWT_SECRET must be at least 32 characters for security');
}

// Check for common weak secrets
const WEAK_SECRETS = [
    'secret', 'password', 'test', 'dev', 'development', 
    '12345678', 'qwerty', 'admin', 'changeme'
];

const lowerSecret = JWT_SECRET.toLowerCase();
if (WEAK_SECRETS.some(weak => lowerSecret.includes(weak))) {
    throw new Error('❌ JWT_SECRET appears to be weak. Use: openssl rand -base64 32');
}

// Validate it's not the example from .env.example
if (JWT_SECRET === 'your_nextauth_secret_here' || JWT_SECRET === 'your_jwt_secret_here') {
    throw new Error('❌ JWT_SECRET is still set to example value. Generate a real secret.');
}

export const JWT_CONFIG = {
    secret: JWT_SECRET,
    expiresIn: '7d',
    algorithm: 'HS256' as const,
    issuer: 'andrewaltair.ge',
    audience: 'andrewaltair-users'
} as const;

/**
 * Sign a JWT token with secure defaults
 */
export function signToken(payload: object): string {
    return jwt.sign(payload, JWT_CONFIG.secret, {
        expiresIn: JWT_CONFIG.expiresIn,
        algorithm: JWT_CONFIG.algorithm,
        issuer: JWT_CONFIG.issuer,
        audience: JWT_CONFIG.audience
    });
}

/**
 * Verify a JWT token with secure defaults
 */
export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, JWT_CONFIG.secret, {
            algorithms: [JWT_CONFIG.algorithm],
            issuer: JWT_CONFIG.issuer,
            audience: JWT_CONFIG.audience
        });
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token expired');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid token');
        }
        throw error;
    }
}
```

**Step 2:** Update all JWT usage

```typescript
// src/app/api/auth/login/route.ts
import { signToken } from '@/lib/jwt-config';

export async function POST(request: Request) {
    // ... authentication logic ...
    
    // Generate JWT token with secure config
    const token = signToken({
        userId: user._id.toString(),
        role: user.role,
        sessionId: crypto.randomBytes(16).toString('hex')
    });
    
    // ... rest of code ...
}
```

```typescript
// src/lib/server-auth.ts
import { verifyToken } from '@/lib/jwt-config';

export async function getUserFromRequest(req: Request) {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    
    const token = authHeader.substring(7);
    
    try {
        const decoded = verifyToken(token);
        
        await dbConnect();
        
        // Verify session exists and is active
        const session = await Session.findOne({
            token,
            userId: decoded.userId,
            isActive: true,
            expiresAt: { $gt: new Date() }
        });
        
        if (!session) {
            return null;
        }
        
        // ... rest of code ...
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}
```

**Step 3:** Generate strong secret

```bash
# Generate a cryptographically secure JWT_SECRET
openssl rand -base64 32

# Add to .env.local
JWT_SECRET=<generated_secret_here>
```

---

## 🔴 High Fix #3: Remove 'unsafe-eval' from CSP

### Implementation

**Step 1:** Update `next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://counter.top.ge https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://region1.google-analytics.com https://www.google-analytics.com https://api.groq.com",
              "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
              "media-src 'self' https:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Download-Options',
            value: 'noopen'
          }
        ],
      },
    ];
  },
  
  async rewrites() {
    return [
      {
        source: '/feed.xml',
        destination: '/api/rss',
      },
    ];
  },
};

export default nextConfig;
```

**Step 2:** Test all features

```bash
# Start dev server
npm run dev

# Test checklist:
# ✓ Google Analytics loads
# ✓ YouTube embeds work
# ✓ Forms submit correctly
# ✓ No console CSP errors
# ✓ All interactive features work
```

---

## 🔴 High Fix #4: AI Prompt Sanitization

### Implementation

**Step 1:** Create `src/lib/prompt-sanitizer.ts`

```typescript
/**
 * Sanitize user input before sending to AI
 * Prevents prompt injection attacks
 */

interface SanitizeOptions {
    maxLength?: number;
    allowNewlines?: boolean;
    allowSpecialChars?: boolean;
}

export function sanitizeAIInput(
    input: string, 
    options: SanitizeOptions = {}
): string {
    const {
        maxLength = 200,
        allowNewlines = true,
        allowSpecialChars = true
    } = options;
    
    if (!input || typeof input !== 'string') {
        return '';
    }
    
    // Remove control characters (except newlines if allowed)
    let sanitized = allowNewlines 
        ? input.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '')
        : input.replace(/[\x00-\x1F\x7F-\x9F]/g, ' ');
    
    // Remove potential prompt injection patterns
    const dangerousPatterns = [
        // Instruction override attempts
        /ignore\s+(previous|above|all|prior)\s+(instructions?|prompts?|commands?)/gi,
        /disregard\s+(previous|above|all)\s+/gi,
        /forget\s+(everything|all|previous)/gi,
        
        // System/role manipulation
        /system\s*:/gi,
        /assistant\s*:/gi,
        /user\s*:/gi,
        /<\|.*?\|>/gi,
        /\[INST\]/gi,
        /\[\/INST\]/gi,
        /\[SYS\]/gi,
        /\[\/SYS\]/gi,
        
        // Code execution attempts
        /```[\s\S]*?```/g,
        /<script[\s\S]*?<\/script>/gi,
        /javascript:/gi,
        /data:text\/html/gi,
        
        // Prompt leaking attempts
        /show\s+(me\s+)?(your|the)\s+(system\s+)?(prompt|instructions?)/gi,
        /what\s+(is|are)\s+your\s+(instructions?|rules?|guidelines?)/gi,
        /repeat\s+(your|the)\s+(prompt|instructions?)/gi
    ];
    
    dangerousPatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
    });
    
    // Remove excessive whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim();
    
    // Limit length
    if (sanitized.length > maxLength) {
        sanitized = sanitized.slice(0, maxLength);
    }
    
    // Escape quotes if not allowing special chars
    if (!allowSpecialChars) {
        sanitized = sanitized.replace(/["'`]/g, '');
    }
    
    return sanitized;
}

/**
 * Validate AI input meets requirements
 */
export function validateAIInput(
    input: string,
    fieldName: string,
    minLength: number = 1,
    maxLength: number = 500
): { valid: boolean; error?: string } {
    if (!input || input.trim().length === 0) {
        return { 
            valid: false, 
            error: `${fieldName} არ შეიძლება იყოს ცარიელი` 
        };
    }
    
    const trimmed = input.trim();
    
    if (trimmed.length < minLength) {
        return { 
            valid: false, 
            error: `${fieldName} უნდა იყოს მინიმუმ ${minLength} სიმბოლო` 
        };
    }
    
    if (trimmed.length > maxLength) {
        return { 
            valid: false, 
            error: `${fieldName} არ უნდა აღემატებოდეს ${maxLength} სიმბოლოს` 
        };
    }
    
    return { valid: true };
}

/**
 * Sanitize AI response before sending to client
 * Prevents response injection
 */
export function sanitizeAIResponse(response: string): string {
    if (!response || typeof response !== 'string') {
        return '';
    }
    
    // Remove any potential script tags
    let sanitized = response.replace(/<script[\s\S]*?<\/script>/gi, '');
    
    // Remove data URIs
    sanitized = sanitized.replace(/data:text\/html[^"'\s]*/gi, '');
    
    // Remove javascript: protocols
    sanitized = sanitized.replace(/javascript:/gi, '');
    
    return sanitized;
}
```

**Step 2:** Apply to all AI endpoints

```typescript
// src/app/api/mystic/fortune/route.ts
import { sanitizeAIInput, validateAIInput, sanitizeAIResponse } from '@/lib/prompt-sanitizer';

export async function POST(request: NextRequest) {
    try {
        const { user, error } = await protectMysticEndpoint(request, 'fortune');
        if (error) return error;
        
        const client = getClient();
        const { name, birthDate } = await request.json();
        
        // Validate input
        const nameValidation = validateAIInput(name, 'სახელი', 2, 100);
        if (!nameValidation.valid) {
            return NextResponse.json(
                { error: nameValidation.error },
                { status: 400 }
            );
        }
        
        // Sanitize inputs
        const safeName = sanitizeAIInput(name, { 
            maxLength: 100, 
            allowNewlines: false,
            allowSpecialChars: false
        });
        
        const safeBirthDate = birthDate 
            ? sanitizeAIInput(birthDate, { maxLength: 20, allowSpecialChars: false })
            : '';
        
        const style = pickRandom(FORTUNE_RULES.styles);
        const theme = pickRandom(FORTUNE_RULES.themes);
        const currentDate = new Date().toLocaleDateString("ka-GE");
        
        const prompt = `შენ ხარ უძველესი მისტიკოსი და წინასწარმეტყველი. დღეს არის ${currentDate}.

მომხმარებლის სახელი: "${safeName}"${safeBirthDate ? `\nდაბადების თარიღი: ${safeBirthDate}` : ""}

შექმენი **უნიკალური** და **პერსონალური** წინასწარმეტყველება ${style}.
ფოკუსირდი თემაზე: ${theme}.

მოთხოვნები:
• წინასწარმეტყველება უნდა იყოს ღრმა, პოეტური და შთამაგონებელი
• გამოიყენე მდიდარი ქართული ლექსიკა და მეტაფორები
• თითოეული პასუხი უნდა იყოს სრულიად განსხვავებული
• არ გაიმეორო კლიშეები

პასუხი მხოლოდ JSON ფორმატში:
{
    "prediction": "...",
    "luckyColor": "...",
    "luckyNumber": "...",
    "luckyDay": "..."
}`;
        
        const response = await client.chat.completions.create({
            model: AI_CONFIG.model,
            messages: [
                {
                    role: "system",
                    content: FORTUNE_RULES.systemPrompt
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: AI_CONFIG.temperature,
            max_tokens: 800,
        });
        
        const content = response.choices[0]?.message?.content || "";
        
        // Sanitize AI response
        const safeContent = sanitizeAIResponse(content);
        
        try {
            const jsonMatch = safeContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                
                // Sanitize each field in response
                return NextResponse.json({
                    prediction: sanitizeAIResponse(parsed.prediction || ''),
                    luckyColor: sanitizeAIResponse(parsed.luckyColor || ''),
                    luckyNumber: sanitizeAIResponse(parsed.luckyNumber || ''),
                    luckyDay: sanitizeAIResponse(parsed.luckyDay || '')
                });
            }
        } catch {
            // Fallback
        }
        
        return NextResponse.json({
            prediction: "ვარსკვლავთა ქარავანი შენს სახელს ეძებს ცის კამარაზე.",
            luckyColor: "ზურმუხტისფერი",
            luckyNumber: "7",
            luckyDay: "პარასკევი"
        });
        
    } catch (error) {
        console.error("Fortune API error:", error);
        return NextResponse.json(
            { error: "Failed to generate fortune" },
            { status: 500 }
        );
    }
}
```

**Step 3:** Apply to ALL mystic endpoints

- `src/app/api/mystic/tarot/route.ts`
- `src/app/api/mystic/love/route.ts`
- `src/app/api/mystic/dream/route.ts`
- `src/app/api/mystic/horoscope/route.ts`
- `src/app/api/mystic/numerology/route.ts`
- `src/app/api/mystic/chat/route.ts`

---

## 🔴 High Fix #5: HttpOnly Cookies for Tokens

### Implementation

**Step 1:** Update login endpoint

```typescript
// src/app/api/auth/login/route.ts
import { signToken } from '@/lib/jwt-config';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // ... authentication logic ...
        
        // Generate JWT token
        const token = signToken({
            userId: user._id.toString(),
            role: user.role,
            sessionId: crypto.randomBytes(16).toString('hex')
        });
        
        // Create session
        await Session.create({
            userId: user._id,
            token,
            deviceInfo: { /* ... */ },
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        
        // Return user data WITHOUT token in body
        const userData = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            avatar: user.avatar,
            role: user.role,
            badge: user.badge,
            createdAt: user.createdAt.toISOString(),
        };
        
        const response = NextResponse.json({
            success: true,
            user: userData
            // ❌ NO TOKEN IN RESPONSE BODY
        });
        
        // ✅ Set httpOnly cookie
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            path: '/'
        });
        
        return response;
        
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'სერვერის შეცდომა' },
            { status: 500 }
        );
    }
}
```

**Step 2:** Update client-side auth context

```typescript
// src/lib/auth.tsx
"use client"

import * as React from "react"

export interface User {
    id: string
    username: string
    email: string
    fullName: string
    bio?: string
    avatar?: string
    coverImage?: string
    coverOffsetY?: number
    role: "god" | "admin" | "editor" | "viewer"
    badge?: string
    createdAt: string
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
    register: (data: { username: string; email: string; password: string; fullName: string }) => Promise<{ success: boolean; error?: string }>
    logout: () => void
    isGod: boolean
    isAdmin: boolean
    canEdit: boolean
    updateUser: (user: User) => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    // Load user on mount (token is in httpOnly cookie)
    React.useEffect(() => {
        const loadUser = async () => {
            try {
                // Token automatically sent via cookie
                const response = await fetch("/api/auth/me", {
                    credentials: 'include' // Important: include cookies
                })

                if (response.ok) {
                    const data = await response.json()
                    setUser(data.user)
                }
            } catch (error) {
                console.error('Failed to load user:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadUser()
    }, [])

    const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include', // Include cookies
                body: JSON.stringify({ username, password })
            })

            const data = await response.json()

            if (!response.ok) {
                return { success: false, error: data.error || "შესვლა ვერ მოხერხდა" }
            }

            setUser(data.user)
            // ✅ No localStorage usage

            return { success: true }
        } catch {
            return { success: false, error: "სერვერთან დაკავშირება ვერ მოხერხდა" }
        }
    }

    const register = async (data: { username: string; email: string; password: string; fullName: string }): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if (!response.ok) {
                return { success: false, error: result.error || "რეგისტრაცია ვერ მოხერხდა" }
            }

            // If email verification is required, don't set user
            if (result.requiresVerification) {
                return { success: true }
            }

            setUser(result.user)
            return { success: true }
        } catch {
            return { success: false, error: "სერვერთან დაკავშირება ვერ მოხერხდა" }
        }
    }

    const updateUser = (userData: User) => {
        setUser(userData)
    }

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: 'include'
            })
        } catch (error) {
            console.error('Logout error:', error)
        }
        
        setUser(null)
    }

    const isGod = user?.role === "god"
    const isAdmin = user?.role === "god" || user?.role === "admin"
    const canEdit = user?.role === "god" || user?.role === "admin" || user?.role === "editor"

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, isGod, isAdmin, canEdit, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = React.useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
```

**Step 3:** Update server-side auth

```typescript
// src/lib/server-auth.ts
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt-config';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Session from '@/models/Session';

export async function getUserFromRequest(req: Request) {
    // Try Authorization header first (for API clients)
    const authHeader = req.headers.get('authorization');
    let token: string | null = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    } else {
        // Try cookie (for browser clients)
        const cookieStore = await cookies();
        token = cookieStore.get('auth_token')?.value || null;
    }
    
    if (!token) {
        return null;
    }

    try {
        const decoded = verifyToken(token);

        await dbConnect();

        // Verify session exists and is active
        const session = await Session.findOne({
            token,
            userId: decoded.userId,
            isActive: true,
            expiresAt: { $gt: new Date() }
        });

        if (!session) {
            return null;
        }

        // Update session activity
        await Session.findByIdAndUpdate(session._id, {
            lastActivity: new Date()
        });

        const user = await User.findById(decoded.userId);

        if (user?.isBlocked) {
            return null;
        }

        return user;
    } catch (error) {
        return null;
    }
}
```

**Step 4:** Add logout endpoint

```typescript
// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Session from '@/models/Session';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;
        
        if (token) {
            await dbConnect();
            
            // Invalidate session
            await Session.updateOne(
                { token },
                { isActive: false }
            );
        }
        
        const response = NextResponse.json({ success: true });
        
        // Clear cookie
        response.cookies.delete('auth_token');
        
        return response;
        
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Logout failed' },
            { status: 500 }
        );
    }
}
```

---

## 🔴 High Fix #6: CSRF Protection

### Implementation

**Step 1:** Create `src/lib/csrf.ts`

```typescript
import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// In-memory store (use Redis in production for multi-instance deployments)
const csrfTokens = new Map<string, { token: string; expires: number }>();

// Cleanup interval
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of csrfTokens.entries()) {
        if (value.expires < now) {
            csrfTokens.delete(key);
        }
    }
}, 5 * 60 * 1000); // Cleanup every 5 minutes

/**
 * Generate CSRF token for a session
 */
export async function generateCSRFToken(): Promise<string> {
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('session_id')?.value;
    
    // Create session ID if doesn't exist
    if (!sessionId) {
        sessionId = randomBytes(32).toString('hex');
    }
    
    const token = randomBytes(32).toString('hex');
    const expires = Date.now() + 60 * 60 * 1000; // 1 hour
    
    csrfTokens.set(sessionId, { token, expires });
    
    return token;
}

/**
 * Verify CSRF token from request
 */
export async function verifyCSRFToken(request: Request): Promise<boolean> {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;
    
    if (!sessionId) {
        return false;
    }
    
    const csrfToken = request.headers.get('x-csrf-token');
    
    if (!csrfToken) {
        return false;
    }
    
    const stored = csrfTokens.get(sessionId);
    
    if (!stored || stored.expires < Date.now()) {
        csrfTokens.delete(sessionId);
        return false;
    }
    
    return stored.token === csrfToken;
}

/**
 * Middleware to require CSRF token
 */
export async function requireCSRF(request: Request): Promise<Response | null> {
    // Skip CSRF for GET, HEAD, OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
        return null;
    }
    
    const isValid = await verifyCSRFToken(request);
    
    if (!isValid) {
        return NextResponse.json(
            { error: 'Invalid CSRF token' },
            { status: 403 }
        );
    }
    
    return null;
}
```

**Step 2:** Add CSRF endpoint

```typescript
// src/app/api/csrf/route.ts
import { NextResponse } from 'next/server';
import { generateCSRFToken } from '@/lib/csrf';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

export async function GET() {
    try {
        const cookieStore = await cookies();
        let sessionId = cookieStore.get('session_id')?.value;
        
        // Create session if doesn't exist
        if (!sessionId) {
            sessionId = randomBytes(32).toString('hex');
        }
        
        const csrfToken = await generateCSRFToken();
        
        const response = NextResponse.json({ 
            csrfToken 
        });
        
        // Set session cookie
        response.cookies.set('session_id', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60, // 1 hour
            path: '/'
        });
        
        return response;
        
    } catch (error) {
        console.error('CSRF token generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate CSRF token' },
            { status: 500 }
        );
    }
}
```

**Step 3:** Apply to protected routes

```typescript
// Example: src/app/api/posts/route.ts
import { requireCSRF } from '@/lib/csrf';

export async function POST(request: Request) {
    // Check CSRF token
    const csrfError = await requireCSRF(request);
    if (csrfError) return csrfError;
    
    // ... rest of endpoint logic ...
}

export async function PUT(request: Request) {
    const csrfError = await requireCSRF(request);
    if (csrfError) return csrfError;
    
    // ... rest of endpoint logic ...
}

export async function DELETE(request: Request) {
    const csrfError = await requireCSRF(request);
    if (csrfError) return csrfError;
    
    // ... rest of endpoint logic ...
}
```

**Step 4:** Update client to send CSRF token

```typescript
// src/lib/api-client.ts
let csrfToken: string | null = null;

async function getCSRFToken(): Promise<string> {
    if (csrfToken) return csrfToken;
    
    const response = await fetch('/api/csrf', {
        credentials: 'include'
    });
    
    const data = await response.json();
    csrfToken = data.csrfToken;
    
    return csrfToken;
}

export async function apiPost(url: string, body: any) {
    const token = await getCSRFToken();
    
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        credentials: 'include',
        body: JSON.stringify(body)
    });
}

export async function apiPut(url: string, body: any) {
    const token = await getCSRFToken();
    
    return fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        credentials: 'include',
        body: JSON.stringify(body)
    });
}

export async function apiDelete(url: string) {
    const token = await getCSRFToken();
    
    return fetch(url, {
        method: 'DELETE',
        headers: {
            'X-CSRF-Token': token
        },
        credentials: 'include'
    });
}
```

---

## 🔴 High Fix #7: Enable Email Verification

### Implementation

**Step 1:** Uncomment verification check

```typescript
// src/app/api/auth/login/route.ts
export async function POST(request: Request) {
    // ... existing code ...
    
    // ✅ ENABLE email verification
    if (!user.isEmailVerified) {
        return NextResponse.json({
            error: 'გთხოვთ დაადასტუროთ თქვენი ელ-ფოსტა',
            requiresVerification: true,
            email: user.email
        }, { status: 403 });
    }
    
    // ... rest of code ...
}
```

**Step 2:** Ensure verification page exists

```typescript
// src/app/verify-email/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function VerifyEmailPage() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage('ვერიფიკაციის ტოკენი არ არის მითითებული')
            return
        }

        fetch('/api/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setStatus('success')
                    setMessage(data.message)
                    setTimeout(() => router.push('/login'), 3000)
                } else {
                    setStatus('error')
                    setMessage(data.error)
                }
            })
            .catch(() => {
                setStatus('error')
                setMessage('ვერიფიკაცია ვერ მოხერხდა')
            })
    }, [token, router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
                {status === 'loading' && (
                    <>
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                        <h1 className="text-2xl font-bold text-white mb-2">მიმდინარეობს ვერიფიკაცია...</h1>
                    </>
                )}
                
                {status === 'success' && (
                    <>
                        <div className="text-6xl mb-4">✅</div>
                        <h1 className="text-2xl font-bold text-white mb-2">წარმატებული!</h1>
                        <p className="text-white/80">{message}</p>
                        <p className="text-white/60 text-sm mt-4">გადამისამართება...</p>
                    </>
                )}
                
                {status === 'error' && (
                    <>
                        <div className="text-6xl mb-4">❌</div>
                        <h1 className="text-2xl font-bold text-white mb-2">შეცდომა</h1>
                        <p className="text-white/80">{message}</p>
                        <button 
                            onClick={() => router.push('/register')}
                            className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            უკან რეგისტრაციაზე
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
```

---

## ✅ Testing Checklist

After implementing all fixes:

### Security Tests
- [ ] JWT tokens cannot be brute-forced (32+ char secret)
- [ ] Backup codes are properly hashed with bcrypt
- [ ] CSRF protection works on all POST/PUT/DELETE routes
- [ ] HttpOnly cookies prevent XSS token theft
- [ ] AI prompt injection attempts are blocked
- [ ] CSP doesn't allow 'unsafe-eval'
- [ ] Email verification is enforced

### Functional Tests
- [ ] Login/logout works with httpOnly cookies
- [ ] 2FA with backup codes works
- [ ] All mystic AI tools work with sanitized inputs
- [ ] Forms submit correctly with CSRF tokens
- [ ] Session management works across devices
- [ ] Email verification flow is complete

### Performance Tests
- [ ] No performance degradation from security changes
- [ ] CSRF token generation is fast
- [ ] Prompt sanitization doesn't slow AI requests

---

## 📝 Deployment Steps

1. **Update environment variables**
   ```bash
   # Generate strong secrets
   JWT_SECRET=$(openssl rand -base64 32)
   ADMIN_SESSION_SECRET=$(openssl rand -base64 32)
   ```

2. **Run database migration** (if needed for backup codes)

3. **Deploy code changes**

4. **Test in staging environment**

5. **Monitor logs for errors**

6. **Gradually roll out to production**

---

## 🔍 Monitoring

After deployment, monitor:
- Failed authentication attempts
- CSRF token validation failures
- AI prompt injection attempts
- Session hijacking attempts
- Unusual API usage patterns

Set up alerts for:
- > 10 failed login attempts from same IP
- > 100 CSRF failures per hour
- Suspicious AI prompt patterns
- Token expiration errors

---

**Estimated Total Time:** 20-30 hours  
**Priority Order:** Fix #1, #2, #7, #4, #3, #5, #6

**Next Steps:**
1. Review this implementation guide
2. Test each fix in development
3. Deploy to staging
4. Run security tests
5. Deploy to production
