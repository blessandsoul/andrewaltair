# Security Rules

## XSS Prevention
- React auto-escapes JSX — safe by default
- **Never** use `dangerouslySetInnerHTML` without DOMPurify sanitization
- Sanitize user-provided URLs: only allow `http:`, `https:`, `mailto:`, `tel:` protocols
- External links: always `rel="noopener noreferrer"` with `target="_blank"`

## Authentication & Tokens
- Access tokens in memory or httpOnly cookies, never in localStorage for sensitive data
- Never log tokens or sensitive data (`console.log('token:', token)`)
- Clear all sensitive data on logout (cached queries, stored state)
- Authorization header: `Bearer ${token}` — never in URL params

## Environment Variables
- `NEXT_PUBLIC_*` for client-exposed values only
- Server secrets (`MONGODB_URI`, `JWT_SECRET`, API keys) — no prefix, server-only
- Validate env vars at startup with Zod
- Never commit `.env` with real secrets — provide `.env.example`

## Input Validation
- Client validation is for UX only — server MUST validate everything
- Use Zod schemas for both client forms and API route input
- Validate file uploads: check MIME type, extension, and size before uploading

## Dependencies
- Run `npm audit` regularly
- Use exact versions for critical packages
- Verify new packages: downloads, maintenance, no known vulnerabilities

## What to Never Commit
`.env`, `.env.local`, `*.pem`, `*.key`, `credentials.json`, `node_modules/`
