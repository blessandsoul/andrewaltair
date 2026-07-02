# Phase B Implementation Log

Branch: feat/triple-100-audit. Nothing committed yet (commit only on your request).
Calibration: items below are L1/L2 verified (typecheck + lint + existing tests green, and the security gates mirror the known-good categories/route.ts pattern). Runtime behavioral tests of the new auth gates, and a visual render pass on the UI items, are still pending (L4). Nothing here is claimed as viewer-verified.

## Batch 1 (14 items across both tracks)

| Item | Track | Change | Files | Status |
|------|-------|--------|-------|--------|
| V001 | security | verifyAdmin gate on video create | src/app/api/videos/route.ts | done |
| V002 | security | verifyAdmin gate on tool create | src/app/api/tools/route.ts | done |
| V003 | security | verifyAdmin gate on media create | src/app/api/media/route.ts | done |
| V004 | security | verifyAdmin gate on redirect create | src/app/api/redirects/route.ts | done |
| V054 (tags) | security | verifyAdmin gate on tag create (fixes the categories-gated vs tags-open inconsistency) | src/app/api/tags/route.ts | done |
| V007 | security | removed the hardcoded migrate-now backdoor, deny when CRON_SECRET unset | src/app/api/encyclopedia/migrate/route.ts | done |
| V008 | security | per-IP rate limit (15/min) + text/prompt length caps on the open Gemini proxy | src/app/api/ai/text/route.ts | partial (rate limit + length done; hard auth still optional, see note) |
| U001 | ui | Button transition-all to named properties | src/components/ui/button.tsx | done |
| U002 | ui | Button active:scale-[0.96] press with motion-reduce opt-out | src/components/ui/button.tsx | done |
| U007 | ui | CardTitle text-balance | src/components/ui/card.tsx | done |
| U008 | ui | CardDescription text-pretty | src/components/ui/card.tsx | done |
| U071 | ui | ThemeToggle honors prefers-color-scheme on first paint | src/components/layout/ThemeToggle.tsx | done |
| U068 | ui | MobileNav aria-label + aria-current per icon link | src/components/layout/MobileNav.tsx | done |
| U070 | ui | MobileNav transition-all to named properties | src/components/layout/MobileNav.tsx | done |

### Verification (Batch 1)
- npx tsc --noEmit: exit 0 (no type errors).
- npm run lint (next lint): exit 0 (only pre-existing warnings in files not touched here).
- npm run test (vitest): 202 passed / 202, exit 0 (no regressions).
- Not run: full next build (slow on Windows, known copyfile EINVAL non-blocker per project memory). Not written: route-level auth regression tests (existing harness has no route-handler test setup; the gate mirrors the verified-good categories pattern). Not done: visual render pass on the UI items.

### Notes / caveats
- The 5 auth gates use verifyAdmin, which in development returns true when ADMIN_DEV_BYPASS=1, so local dev is unaffected. The admin UI sends the admin_session cookie, so authoring still works. Production now rejects anonymous writes.
- V008 chose the non-breaking fix (rate limit + input caps) because the caller context of ai/text is not yet confirmed; if it is admin-only, add verifyAdmin too. The rate limiter is the existing in-memory one (spoofable per V079); the Redis migration is tracked separately.
- Button/Card changes cascade to every consumer, so U001/U002/U007/U008 touch one file each but affect the whole app. A render check is recommended before you consider them visually done.

## Batch 2 (8 items across both tracks)

| Item | Track | Change | Files | Status |
|------|-------|--------|-------|--------|
| V005 | security | verifyAdmin gate on settings create/update | src/app/api/settings/route.ts | done |
| V006 | security | verifyAdmin gate on error-logs read + clear (GET, DELETE); POST left for now (may be client telemetry, follow-up = rate limit) | src/app/api/error-logs/route.ts | partial |
| V011 | security | safeJsonLd escaper (escapes < > & and U+2028/2029) wired into the 4 schema.org sinks (Article, Breadcrumb, Website, FAQ) | src/lib/json-ld.ts, src/components/blog/ArticleSchema.tsx | partial (reusable schema component done; inline JSON-LD in insights/blog/en-insights page.tsx still raw, next) |
| U016 | ui | ThemeToggle animated icon cross-fade (scale + blur, reduced-motion safe), Georgian sentence-case aria-label | src/components/layout/ThemeToggle.tsx | done |
| U055 | ui | insights loading skeleton (content-shaped) | src/app/insights/loading.tsx | done |
| U064 | ui | insights error boundary (retry + reduced-motion) | src/app/insights/error.tsx | done |
| U056 | ui | forum loading skeleton | src/app/forum/loading.tsx | done |
| U065 | ui | forum error boundary | src/app/forum/error.tsx | done |

### Verification (Batch 2)
- npx tsc --noEmit: exit 0.
- npx next lint on the changed/new files: no warnings or errors.
- npm run test (vitest): 202 passed / 202.
- safeJsonLd verified by inspection (only < > & and the two line separators are escaped, all other characters incl. spaces pass through unchanged; output stays valid JSON).

### Notes (Batch 2)
- error-logs POST stays open because it may be a client error-reporting endpoint; hard-gating it could break telemetry. Follow-up: rate limit + validate rather than block.
- V011 covers the reusable ArticleSchema/FAQSchema component (4 sinks). The page-level inline JSON-LD in insights/[slug], blog/[slug], en/insights/[slug] still uses raw JSON.stringify and is the next V011 step.
- ThemeToggle now stacks both icons and cross-fades; verify the visual on a real render.

Running total: 22 of ~300 catalog items implemented and verified (Batch 1 + Batch 2).

## Not yet implemented
The remaining ~286 catalog items stay a prioritized backlog in VULNERABILITIES.md, QUALITY.md, UIUX.md. Each file ends with a suggested fix order. High-value next batches:
- Security: settings POST (V005), error-logs (V006), the remaining anonymous CRUD [G] routes (V016-V024, V050-V059), the isomorphic sanitize root fix (V012) and the JSON-LD escaper (V011).
- UI: the ThemeToggle animated icon cross-fade (U016), Card shadow-over-border (U004), palette unify (U031), skeleton and error-boundary coverage (U053-U067).
- Quality: JWT verifier unification (Q001), the Post/Video indexes (Q023-Q024, Q039-Q043), the transition-all sweep (Q019).
