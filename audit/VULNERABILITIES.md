# andrewaltair.ge Security Catalog (100 findings)

Scope: whole app (Next.js 14, ~200 API routes, Mongoose, custom JWT, LiveKit workshop).
Method: 5 read-only finder passes (auth/session, access-control, injection/XSS, SSRF/secrets/ratelimit, workshop) plus main-thread grep verification. Diffed against repo-root SECURITY_AUDIT_REPORT.md, SECURITY_FIXES_IMPLEMENTATION.md, SECURITY_VERIFICATION_REPORT.md (2026-01).
Confidence tags: [C] confirmed by reading the code, [G] grep-inferred (no auth-helper import found, verify the exact line at fix time).
Honesty note: several items share one root cause (in-memory rate limit keyed on x-forwarded-for; server-side sanitize no-op; JSON-LD serialization). They are listed per affected surface because each is fixed at a different site. Counts are real, not padded.

Legend: Sev = Crit / High / Med / Low. Prior = new / still-open / fixed-but-regressed.

---

## CRITICAL (15)

**V001 [Crit] Anonymous content CRUD: videos** · unauth · src/app/api/videos/route.ts:27 · S · new · [C]
POST creates Video docs with no auth gate (contrast categories/route.ts:20 which calls verifyAdmin). Anyone injects or spams site content. Fix: add `if (!verifyAdmin(request)) return apiError(...)` at handler top.

**V002 [Crit] Anonymous content CRUD: tools** · unauth · src/app/api/tools/route.ts:30 · S · new · [C]
POST creates Tool docs unauthenticated. Public marketplace pollution. Fix: verifyAdmin gate.

**V003 [Crit] Anonymous content CRUD: media** · unauth · src/app/api/media/route.ts:26 · S · new · [C]
POST creates Media records unauthenticated. Fix: verifyAdmin gate.

**V004 [Crit] Anonymous redirect creation + mass-assignment** · unauth · src/app/api/redirects/route.ts:30 · S · new · [C]
POST does `new Redirect(data)` from raw body with no auth: attacker creates on-domain open redirects for phishing/SEO poisoning. Fix: verifyAdmin + whitelist fields + http(s) allowlist on target.

**V005 [Crit] Unauthenticated site-config write** · unauth · src/app/api/settings/route.ts:39 · S · new · [C]
POST upserts any Settings key/value (findOneAndUpdate upsert) with no auth: arbitrary config tampering. Fix: verifyAdmin gate.

**V006 [Crit] Unauthenticated error-log wipe (anti-forensics)** · unauth · src/app/api/error-logs/route.ts:33 · S · new · [C]
DELETE clears all error logs with no auth; POST allows log injection; GET leaks stack traces. Fix: verifyAdmin on all three verbs.

**V007 [Crit] Hardcoded migrate-now backdoor** · default-cred · src/app/api/encyclopedia/migrate/route.ts:112 · S · new · [C]
`secret !== CRON_SECRET && secret !== 'migrate-now'` lets anyone run destructive DB upserts by passing migrate-now. Fix: delete the literal branch, require admin session or CRON_SECRET.

**V008 [Crit] Unauthenticated Gemini proxy (cost abuse + prompt injection)** · unauth · src/app/api/ai/text/route.ts:7 · S · new · [C]
No auth, no rate limit, no CSRF; userMessage is fully attacker-controlled: free LLM proxy and injection. Fix: getUserFromRequest + rate limit + prompt-sanitizer (mirror mystic/dream).

**V009 [Crit] Privilege escalation: non-god admin mints a god account** · privesc · src/services/user.service.ts:241 (via src/app/api/users/route.ts:67) · S · new · [C]
POST /api/users authorizes {god,admin} then passes raw body to createUser (new User(data)) which accepts role, so admin creates a god user. Fix: whitelist role unless caller is verified god.

**V010 [Crit] Seed route creates god account with password andrew** · default-cred · src/app/api/seed/route.ts:45 · S · new · [C]
Inserts role god user andrew/andrew (plus editor123/viewer123), gated only by NODE_ENV + SEED_SECRET. Misset NODE_ENV exposes a trivial god login. Fix: require a generated password, gate on an explicit allow flag not NODE_ENV.

**V011 [Crit] Stored XSS via JSON-LD script breakout** · xss · src/app/insights/[slug]/page.tsx:215 · S · new · [C]
Comment/body/author text goes into JSON.stringify(jsonLd) inside a script tag; JSON.stringify does not escape `<`/`>`, so `</script><img onerror>` in an approved comment executes for every reader. Same pattern in blog/[slug]/page.tsx:268,277, en/insights/[slug]/page.tsx:189, components/blog/ArticleSchema.tsx:76, components/geo/FAQSection.tsx:41, ConceptCard.tsx:34. Fix: one JSON-LD serializer that escapes `<`,`>`,`&`,U+2028/2029.

**V012 [Crit] Server-side sanitizeHtml is a no-op (SSR stored XSS)** · xss · src/lib/sanitize.ts:8 · M · new · [C]
Returns input unmodified when window is undefined, so every SSR render of dangerouslySetInnerHTML ships raw untrusted HTML; onerror/onload fire on parse before client re-sanitize. 42 sinks depend on it. Fix: isomorphic-dompurify (jsdom on server).

**V013 [Crit] Workshop caption endpoint is unauthenticated** · unauth · src/app/api/workshop/rooms/[code]/caption/route.ts:27 · S · new · [C]
Knowing the 5-char code, anyone POSTs arbitrary caption text shown to all viewers and, with final:true, appended to the saved transcript. Screen flooding + permanent record poisoning. Fix: require hostKey.

**V014 [Crit] Workshop LiveKit identity is caller-supplied (impersonation + publisher escalation)** · token-scope · src/app/api/workshop/rooms/[code]/watch-token/route.ts:40 · M · new · [C]
Token identity is the caller-chosen clientId, so an attacker joins as another participant (eviction via identity collision) and, if a speaker clientId is known, receives a canPublish token to inject A/V. Fix: derive identity from an authenticated participant secret, verify membership.

**V015 [Crit] Workshop diploma IDOR discloses participant PII** · idor · src/app/api/workshop/rooms/[code]/diploma/[clientId]/route.tsx:86 · M · new · [C]
Any path clientId returns a diploma with real name, free-text dream, photo, rank; clientIds are enumerable and leak in shareable URLs. Fix: bind clientId to a server-issued per-participant token.

---

## HIGH (32)

**V016 [High] Anonymous content update/delete: videos/[id]** · authz · src/app/api/videos/[id]/route.ts · S · new · [G]
PUT/DELETE present, no auth-helper import found (mutating set minus auth set). Fix: verifyAdmin.

**V017 [High] Anonymous content update/delete: tools/[id]** · authz · src/app/api/tools/[id]/route.ts · S · new · [G]
Same pattern as V016. Fix: verifyAdmin.

**V018 [High] Anonymous media update/delete + non-contract response** · authz · src/app/api/media/[id]/route.ts:66 · S · new · [C]
GET/PATCH/DELETE call Media.findById* directly with no auth and return raw {error} not apiError. Fix: verifyAdmin + apiError.

**V019 [High] Bulk tool operations unauthenticated** · authz · src/app/api/tools/bulk/route.ts, tools/bulk-import/route.ts, tools/deduplicate/route.ts · M · new · [G]
Mass create/import/dedupe with no auth-helper import: one request rewrites the tool catalog. Fix: verifyAdmin on all three.

**V020 [High] Email send endpoint unauthenticated** · unauth · src/app/api/email/route.ts · M · new · [G]
POST reaches the mailer with no auth-helper import: spam/relay via the site domain. Fix: verifyAdmin or internal-only guard.

**V021 [High] Unauthenticated PII CSV export** · info-leak · src/app/api/tracking/export/route.ts:12 · S · new · [C]
GET exports up to 10,000 visitor rows (IDs, city/country, device, referrer, search queries, click coords) with no auth. Fix: verifyAdmin.

**V022 [High] Unauthenticated destructive tracking cleanup** · authz · src/app/api/tracking/cleanup/route.ts · S · new · [G]
Cleanup verb with no auth-helper import deletes analytics data. Fix: verifyAdmin or CRON_SECRET.

**V023 [High] Unauthenticated user enumeration/dump** · info-leak · src/app/api/users/list/route.ts:8 · S · new · [C]
GET dumps up to 100 users (username, fullName, bio, avatar) plus a verified flag that reveals admin/god accounts. Fix: verifyAdmin.

**V024 [High] Unauthenticated Telegram bot send** · unauth · src/app/api/telegram/post/route.ts:7 · S · new · [C]
POST forwards arbitrary body to sendTelegramPost: anyone posts through the site bot. Fix: verifyAdmin.

**V025 [High] og-parser SSRF (no host allowlist)** · ssrf · src/lib/og-parser.ts:22 · M · new · [C]
fetch(url) on an admin-supplied sourceUrl with no scheme/IP filter reaches 169.254.169.254, 127.0.0.1, RFC1918. Admin barrier is one shared password (V030). Fix: block private/loopback/link-local + non-http(s) before fetch.

**V026 [High] og:image download is a second SSRF that persists internal responses** · ssrf · src/lib/og-parser.ts:103 · M · new · [C]
Fetches attacker-influenced og:image, writes any image/* body under public/uploads (served at /uploads). Fix: same guard, only download from the validated public origin.

**V027 [High] Link click webhook fetches arbitrary stored URL (SSRF)** · ssrf · src/services/link.service.ts:303 · M · new · [C]
fetch(link.webhookUrl) to any saved URL on every tracked click. Fix: public-host allowlist.

**V028 [High] Public bots search unescaped $regex (ReDoS)** · redos · src/services/bot.service.ts:65 · S · new · [C]
GET /api/bots passes search into $regex with no escape across 4 fields: `(a+)+` stalls the DB thread. Fix: escapeRegex or $text index.

**V029 [High] Login brute-force limiter keyed on spoofable x-forwarded-for** · ratelimit · src/services/auth.service.ts:20 · M · new · [C]
IP taken as xff.split(',')[0] (client-controlled), so header rotation defeats the 5-try lockout; Map is per-instance. Same in admin login src/app/api/admin/login/route.ts:16. Fix: trusted-proxy IP + shared store.

**V030 [High] Single shared admin password, timing-unsafe compare** · authn · src/lib/admin-auth.ts:121 · M · new · [C]
`password === ADMIN_PASSWORD` (short-circuit) with no per-admin identity or rotation. Fix: crypto.timingSafeEqual + per-user admin accounts.

**V031 [High] Sanitize no-op reaches blog/repository body HTML** · xss · src/components/interactive/CodeBlock.tsx:147 · S · new · [C]
EnhancedContent feeds post content HTML through the no-op server sanitize into dangerouslySetInnerHTML (blog/[slug]/BlogPostClient.tsx:425, repositories/[slug]/RepoPostClient.tsx:276). Fix: depends on V012.

**V032 [High] Universal TextColumns renders stored HTML via broken sanitize** · xss · src/components/universal/UniversalText.tsx:32 · S · new · [C]
Section content strings pass through the no-op sanitize into dangerouslySetInnerHTML. Fix: depends on V012.

**V033 [High] Scraped OG title/description stored unsanitized then flows to JSON-LD** · injection · src/lib/og-parser.ts:60 · M · new · [C]
Attacker controls a source page meta tags; og:title/description are stored as insight fields that reach the JSON-LD sinks (V011). Fix: strip HTML control chars at ingest + escaping serializer downstream.

**V034 [High] Registration/login/2FA accept unvalidated JSON** · validation · src/app/api/auth/register/route.ts:13, auth/login/route.ts, auth/2fa/route.ts · S · new · [C]
Bodies are read and forwarded to auth logic with no Zod schema at the trust boundary. Fix: strict Zod schemas, reject on parse failure.

**V035 [High] Admin session token unpinned and not identity-bound** · jwt · src/lib/admin-auth.ts:146 · M · new · [C]
generateAdminToken signs only {role, iat} (no sub/jti/iss/aud), verify omits algorithms: all admins share one unrevocable token. Fix: pin HS256, add sub/jti/iss/aud, back with a revocable record.

**V036 [High] Six routes bypass the hardened JWT verifier** · jwt · src/lib/server-auth.ts:36 (also sessions:26/64, auth/me, auth/2fa:31, users/[id]:26, logout) · M · still-open · [C]
Bare jwt.verify(token, JWT_SECRET) with no algorithms/issuer/audience, dropping the pinning jwt-config.verifyToken provides. Fix: route all through verifyToken.

**V037 [High] Cron routes fall back to a public default secret** · default-cred · src/app/api/cron/seo-update/route.ts:25, cron/forum-daily/route.ts:18 · S · new · [C]
`CRON_SECRET || 'your-cron-secret-key'` plus non-constant compare: the known default triggers heavy DB scans, file writes, and 20-persona AI generation (cost abuse). Fix: require CRON_SECRET, timingSafeEqual.

**V038 [High] Workshop host key travels in the URL path (Referer/log leak)** · authz · src/app/api/workshop/host/[hostKey]/control/route.ts:50 · M · new · [C]
Full room control is authorized only by hostKey in the path, leaked via Referer to third-party assets and proxy logs, enabling complete takeover; no rate limit. Fix: move hostKey to a header/cookie + rate limit.

**V039 [High] Workshop room-code enumeration reads all student state** · idor · src/app/api/workshop/rooms/[code]/route.ts:16 · M · new · [C]
A 5-char code (about 28.6M keyspace, no throttle) is the only gate: scripts enumerate live rooms, read chat/results/captions, and mint a subscribe token to eavesdrop on host A/V. Fix: per-IP throttling, longer codes, room expiry.

**V040 [High] 113 of 209 API routes parse a body with no Zod validation** · validation · src/app/api (only 12 workshop routes validate) · L · new · [C]
Rule 07 mandates server Zod on all input; most mutating routes use request.json() raw. Fix: shared validateBody(schema, request) helper, schema per route.

**V041 [High] 16 of 19 services and the security libs have no tests** · test-gap · src/services, src/lib (sanitize/csrf/totp/jwt-config untested) · L · new · [C]
Security-critical logic (sanitize, CSRF, TOTP, JWT, rate-limit) has zero regression coverage. Fix: Vitest suites with malformed-input assertions (this is quality-adjacent but a security risk, see QUALITY Q).

**V042 [High] Uncapped limit param allows unbounded full-body fetch** · dos · src/app/api/posts/route.ts:12 · S · new · [C]
`limit = parseInt(...)` passed straight to .limit(); ?limit=100000 returns every full-body post (memory/DoS). Fix: Math.min(limit, 50).

**V043 [High] Mass-assignment on prompt update via as-any cast** · mass-assign · src/app/api/prompts/[id]/route.ts:109 · M · new · [C]
Field allowlist iterated but each body[field] written through an as-any cast with no Zod type check (price/status/arrays). Fix: Zod partial schema, typed assignment.

**V044 [High] Builder-prompts routes unauthenticated with any-typed Mongo writes** · authz · src/app/api/builder-prompts/route.ts, builder-prompts/[id]/route.ts:74 · M · new · [G/C]
updateData/pushData are Record<string,any> from body; mutating verbs, no auth-helper import found. Fix: verifyAdmin/owner check + typed UpdateQuery.

**V045 [High] Forum AI-generation endpoints unauthenticated (cost abuse)** · unauth · src/app/api/forum/ask-council/route.ts, forum/suggest/route.ts, forum/duel/route.ts · M · new · [G]
Trigger Gemini/OpenRouter generation with no auth-helper import: attacker burns API budget. Fix: getUserFromRequest + rate limit.

**V046 [High] Post AI helper routes unauthenticated (cost abuse)** · unauth · src/app/api/posts/ai-suggest/route.ts, posts/generate-tags/route.ts, posts/parse-ai/route.ts, prompt-builder/route.ts · M · new · [G]
AI calls with no auth-helper import. Fix: auth + rate limit + prompt-sanitizer.

**V047 [High] Production CSP keeps script-src unsafe-inline** · csp · next.config.mjs:34 · M · new · [C]
scriptSrc is 'self' 'unsafe-inline' with no nonce, so any injected inline script executes (defeats the main XSS mitigation). Fix: per-request nonces.

---

## MEDIUM (38)

**V048 [Med] Config disclosure via unauthenticated settings GET** · info-leak · src/app/api/settings/route.ts:8 · S · new · [C]
GET returns site config unauthenticated. Fix: verifyAdmin or a public-safe projection.

**V049 [Med] error-logs GET/POST unauthenticated** · info-leak · src/app/api/error-logs/route.ts:7 · S · new · [C]
GET leaks internal error text/stack, POST allows log injection/flooding. Fix: verifyAdmin.

**V050 [Med] Unauthenticated tracking writes (activities/clicks/engagement/anomalies)** · unauth · src/app/api/tracking/activities/route.ts, tracking/clicks/route.ts, tracking/engagement/route.ts, tracking/anomalies/route.ts · M · new · [G]
Mutating analytics writes with no auth-helper import: data poisoning + spoofed metrics. Fix: bind to a session or signed token, rate limit.

**V051 [Med] Newsletter creates real User with weak password** · unauth · src/app/api/newsletter/route.ts:69 · S · new · [C]
Unauth POST creates a subscriber User with password Math.random().toString(36): DB pollution + weak-credential accounts + email enumeration. Fix: dedupe/verify before persist, no User creation.

**V052 [Med] Unbounded vote/react stuffing** · unauth · src/app/api/insights/[id]/react/route.ts:10 (also posts/[id]/react, videos/[id]/react, forum/posts/[id]/react) · S · new · [C/G]
No auth, no rate limit, unbounded $inc. Fix: per-IP rate limit + one-vote-per-identity.

**V053 [Med] Notifications routes unauthenticated** · authz · src/app/api/notifications/route.ts, notifications/[id]/route.ts · S · new · [G]
Read/mutate notifications with no auth-helper import (IDOR on [id]). Fix: getUserFromRequest + owner check.

**V054 [Med] Content CRUD unauthenticated: tags, tutorials, folders, encyclopedia sections** · authz · src/app/api/tags/route.ts:18, tutorials/route.ts, folders/route.ts, encyclopedia/sections/route.ts · S · new · [C/G]
tags POST confirmed unauth (sibling categories is gated); the rest lack an auth-helper import. Fix: verifyAdmin, and fix the categories/tags inconsistency.

**V055 [Med] cron-jobs and jobs routes unauthenticated** · authz · src/app/api/cron-jobs/route.ts, cron-jobs/[id]/route.ts, jobs/route.ts · S · new · [G]
Job scheduling/management with no auth-helper import. Fix: verifyAdmin.

**V056 [Med] tasks routes unauthenticated** · authz · src/app/api/tasks/route.ts, tasks/[id]/route.ts · S · new · [G]
Task CRUD with no auth-helper import (IDOR on [id]). Fix: getUserFromRequest + owner check.

**V057 [Med] verify-telegram-code unauthenticated** · authz · src/app/api/verify-telegram-code/route.ts · S · new · [G]
Verification flow with no auth-helper import: code brute-force/abuse. Fix: bind to a session + rate limit.

**V058 [Med] phone-lead capture unauthenticated and unthrottled** · unauth · src/app/api/phone-lead/route.ts · S · new · [G]
Lead write with no auth or rate limit: spam/DB pollution. Fix: rate limit + captcha token.

**V059 [Med] bot-comments unauthenticated** · authz · src/app/api/bot-comments/route.ts · S · new · [G]
Comment write with no auth-helper import. Fix: getUserFromRequest.

**V060 [Med] Search numericId branch reuses raw regex** · redos · src/app/api/search/route.ts:90 · S · new · [C]
Line 79 escapes the main query but line 90 uses raw query in numericId $regex. Fix: escapeRegex on the numericId branch.

**V061 [Med] Admin user search unescaped $regex (ReDoS)** · redos · src/services/user.service.ts:189 · S · new · [C]
search interpolated into $regex over username/email/fullName. Fix: escapeRegex.

**V062 [Med] Link search builds RegExp from raw input (ReDoS)** · redos · src/services/link.service.ts:142 · S · new · [C]
new RegExp(search, 'i') over slug/title/originalUrl. Fix: escape or anchor.

**V063 [Med] Premium-request fields injected into Telegram Markdown** · markdown · src/app/api/premium-request/route.ts:49 · S · new · [C]
name/email/phone/social/sourcePage interpolated unescaped into parse_mode Markdown: phishing links, message corruption. Fix: escape Markdown specials (contrast contact/route.ts:133 which escapes).

**V064 [Med] Short-link redirect returns unvalidated originalUrl** · redirect · src/app/api/link/[slug]/route.ts:41 · S · new · [C]
No scheme check at create or return: on-domain open redirect and javascript:/data: URI if the client assigns location.href. Fix: http(s) allowlist.

**V065 [Med] Link passwords stored plaintext, timing-unsafe compare** · secrets · src/services/link.service.ts:217 · S · new · [C]
password saved as-is, verified with ===. Fix: bcrypt hash + constant-time compare.

**V066 [Med] Google OAuth links account without email_verified check** · authn · src/app/api/auth/google/callback/route.ts:36 · S · new · [C]
Finds-or-links by email and issues a session without checking profile.email_verified: account-linking takeover. Fix: require email_verified true.

**V067 [Med] /api/sessions verifies signature but not revocation** · session · src/app/api/sessions/route.ts:26 · S · new · [C]
GET/DELETE bare jwt.verify with no Session.isActive lookup: a logged-out token still enumerates/revokes sessions for 7 days. Fix: route through getUserFromRequest.

**V068 [Med] 2FA management accepts revoked tokens** · 2fa · src/app/api/auth/2fa/route.ts:31 · S · new · [C]
getUserFromToken bare-verifies with no session lookup: stolen-then-logged-out token runs setup/enable/disable. Fix: session-aware verifier.

**V069 [Med] Admin API trusts stale role claim from user JWT** · authz · src/app/api/users/[id]/route.ts:26 · S · new · [C]
Local verifyAdmin authorizes on decoded.role from the 7-day token with no DB re-read: a demoted/blocked admin keeps access. Fix: re-fetch role + isBlocked + active session per request.

**V070 [Med] TOTP codes are replayable within the window** · 2fa · src/lib/totp.ts:48 · M · new · [C]
verify uses window 1 and never records the consumed timestep: a captured code is accepted repeatedly for ~90s. Fix: persist last-accepted counter, reject reuse.

**V071 [Med] Workshop respond has no rate limit or membership check** · dos · src/app/api/workshop/rooms/[code]/respond/route.ts:38 · M · new · [C]
Fabricated clientIds submit unlimited poll responses (ballot-stuffing, skewed auto-reveal). Fix: require joined participant + per-IP limit.

**V072 [Med] Workshop message/vote stuffing via rotating clientId** · dos · src/services/workshop.service.ts:1331 · S · new · [C]
voteMessage dedupes on self-asserted clientId with no rate limit: pin/bury any question, unbounded voters array growth. Fix: authenticate voter + rate limit.

**V073 [Med] Workshop join has no rate limit, default cap is unlimited** · dos · src/app/api/workshop/rooms/[code]/join/route.ts:32 · M · new · [C]
Fabricated clientIds create unlimited participant docs (default maxParticipants 0). Fix: per-IP limit + sane default cap.

**V074 [Med] Workshop chat rate limit bypassable by rotating clientId** · dos · src/app/api/workshop/rooms/[code]/messages/route.ts:39 · M · new · [C]
Limiter key is wsmsg:${clientId}, caller-supplied, so rotation defeats the 1-per-4s limit and floods stored messages. Fix: key on IP + shared store.

**V075 [Med] Workshop raise-hand unbounded + victim hand-lowering** · dos · src/services/workshop.service.ts:1443 · S · new · [C]
$addToSet of a caller-supplied clientId with no cap/rate limit; raise:false with a victim clientId drops their hand. Fix: membership + cap + rate limit.

**V076 [Med] Workshop diploma de-anonymization** · pii · src/services/workshop.service.ts:1072 · S · new · [C]
getDiplomaData returns part.name even when anonymousNames is on, so V015 IDOR de-anonymizes an anonymous room. Fix: honor anonymousNames or gate ownership.

**V077 [Med] Workshop diploma route leaks internal error text** · info-leak · src/app/api/workshop/rooms/[code]/diploma/[clientId]/route.tsx:256 · S · new · [C]
catch returns 'diploma error: ' + e.message (paths, font failures). Fix: generic message, log server-side.

**V078 [Med] Contact/newsletter/search limiters spoofable and per-instance** · ratelimit · src/app/api/contact/route.ts:50, newsletter/route.ts:32, search/route.ts:48 · S · new · [C]
All key on xff in a per-instance Map: Telegram cost abuse, DB pollution, expensive regex scans on bypass. Fix: trusted-proxy IP + shared store (+ captcha on contact).

**V079 [Med] In-memory rate-limit libraries are per-instance (root cause)** · ratelimit · src/lib/rate-limit.ts:19, src/lib/rate-limiter.ts:16 · M · still-open · [C]
Counters in a process-local Map (rate-limit.ts also only schedules reset when usage===1): ineffective on multi-instance/Docker or after restart. Root cause behind V029/V071-V075/V078. Fix: Redis atomic INCR+EXPIRE.

**V080 [Med] og-parser writes downloaded bytes with no size cap (disk-fill)** · dos · src/lib/og-parser.ts:132 · S · new · [C]
Buffers full arrayBuffer and writeFileSync under public/uploads with only a content-type check. Fix: max byte cap, reject oversize.

**V081 [Med] Unvetted low-reputation dependency agentation** · deps · package.json:64 · S · new · [C]
Obscure package in the prod tree with full server privileges (DB, env). Fix: remove if unused or pin an audited exact version after vetting.

**V082 [Med] Security-critical deps use caret ranges, no CI npm audit** · deps · package.json:78 · M · still-open · [C]
next/jsonwebtoken/mongoose use ^ (contrary to the repo rule) with no audit in CI. Fix: pin exact, add npm audit to CI.

**V083 [Med] Link webhook injects fields into Telegram HTML** · markdown · src/services/link.service.ts:291 · S · new · [C]
sendWebhook builds a parse_mode HTML message from link.title/originalUrl unescaped. Fix: HTML-escape or drop parse_mode.

**V084 [Med] Workshop pick-question trusts self-asserted clientId** · authz · src/services/workshop.service.ts:1996 · S · new · [C]
Only checks questionPickerIds.includes(clientId); a leaked picker id hijacks the turn. Fix: bind to an authenticated participant secret.

**V085 [Med] FAQ/loop/vibe-coding sections render stored HTML via broken sanitize** · xss · src/components/geo/FAQSection.tsx:64, components/loops/sections/LoopBody.tsx:34, components/vibe-coding/sections/StandardSection.tsx:81 · S · new · [C]
Content strings pass through the no-op server sanitize into dangerouslySetInnerHTML. Fix: depends on V012.

---

## LOW (15)

**V086 [Low] auth_token cookie sameSite=lax while CSRF unenforced** · csrf · src/lib/auth-cookie.ts:13 · S · new · [C]
lax is the sole cross-site barrier on user cookie-auth routes (admin uses strict). Fix: sameSite strict or enforce CSRF on user mutations.

**V087 [Low] CSRF util built but applied to only 8 routes** · csrf · src/lib/csrf.ts (httpOnly cookie), src/app/api/admin/settings/route.ts:37 · M · still-open · [C]
requireCSRF guards only mystic + logout; the csrf cookie is httpOnly so client JS cannot echo it. Fix: readable double-submit token + requireCSRF on every cookie-auth mutation.

**V088 [Low] Middleware matcher excludes /api/admin/*** · authz · src/middleware.ts:73 · S · new · [C]
No edge backstop; every admin API depends on its own verifyAdmin. Fix: add /api/admin/:path* to the matcher.

**V089 [Low] ADMIN_DEV_BYPASS disables admin auth in development** · authn · src/lib/admin-auth.ts:34 · S · new · [C]
Returns true on NODE_ENV development + ADMIN_DEV_BYPASS=1; a misset NODE_ENV on a reachable preview opens admin. Fix: also gate on a hostname allowlist or compile out in deployed builds.

**V090 [Low] Email verification effectively disabled (regressed)** · authn · src/models/User.ts:133 · S · still-open · [C]
isEmailVerified defaults true, register hardcodes true, refactored login dropped the gate. Fix: default false, re-add the login gate.

**V091 [Low] No session rotation or invalidation on credential change** · session · src/services/auth.service.ts:194 · M · still-open · [C]
Each login mints an additive 7-day session, none invalidated on password/2FA change. Fix: rotate/cap + invalidate on credential change.

**V092 [Low] Workshop react spoofs sender name, unthrottled** · dos · src/app/api/workshop/rooms/[code]/react/route.ts:28 · S · new · [C]
Anyone with the code spams reactions and sets name to a victim (unlike messages which server-resolve). Fix: rate limit + server-resolve name.

**V093 [Low] Workshop presence poll writes for arbitrary clientId** · dos · src/app/api/workshop/rooms/[code]/route.ts:24 · S · new · [C]
GET ?clientId=X calls touchParticipant unthrottled: keep any participant online, hammer DB. Fix: rate limit + authenticated participant only.

**V094 [Low] Workshop data has no retention/TTL** · pii · src/models/WorkshopRoom.ts:154 · M · new · [C]
Names, dreams, chat, captions persist forever; ended rooms still served. Fix: TTL/retention policy, stop serving ended rooms after a window.

**V095 [Low] .env.example ships a realistic default admin password** · default-cred · .env.example:20 · S · new · [C]
your_secure_admin_password_2026! reads like a real value. Fix: CHANGE_ME placeholders + a startup check rejecting example values.

**V096 [Low] Weak/legacy security headers** · csp · next.config.mjs:91 · S · new · [C]
HSTS without preload, deprecated X-XSS-Protection 1;mode=block, img-src allows whole https:. Fix: HSTS 63072000 preload, X-XSS-Protection 0, tighten img-src.

**V097 [Low] SVG served inline from uploads (latent stored XSS)** · xss · src/app/api/files/[...path]/route.ts:57 · S · new · [C]
Serves .svg as image/svg+xml inline; if any SVG lands in uploads it executes. Fix: force download or block svg content-type.

**V098 [Low] vibe-codes/share-unlock and mystic/history unauthenticated** · authz · src/app/api/vibe-codes/share-unlock/route.ts, mystic/history/route.ts · S · new · [G]
Mutations/reads with no auth-helper import (mystic/history may expose other users runs). Fix: getUserFromRequest + owner scope.

**V099 [Low] encyclopedia/certificates and articles/[id]/comments unauthenticated** · authz · src/app/api/encyclopedia/certificates/route.ts, encyclopedia/articles/[id]/comments/route.ts · S · new · [G]
Certificate mint and comment write with no auth-helper import (forgery/spam). Fix: getUserFromRequest + rate limit.

**V100 [Low] Unchecked array-index IP parsing across routes** · dos · src/app/api/auth/register/route.ts:9,31 · S · new · [C]
xff?.split(',')[0] and split(':')[2] assume presence (noUncheckedIndexedAccess is disabled): NaN/undefined edge cases. Fix: safe first-IP helper + length guard.

---

## Prior-report reconciliation

- Confirmed still fixed (not re-reported): CSP unsafe-eval removed, image optimizer wildcard hostname closed, LiveKit webhook IS signature-verified (src/lib/livekit.ts:84).
- Regressed vs prior report: email verification (V090), session invalidation (V091).
- Prior reports covered general auth/2FA/CSRF/prompt-injection and rated SSRF and rate-limiting as fine; this pass shows both are broadly open (V025-V027 SSRF, V029/V078/V079 rate-limit) and adds the entire access-control, JSON-LD XSS, and workshop classes as new.

## Suggested fix order (feeds Phase B critical-security batch)

1. Auth gates on the anonymous mutation routes (V001-V006, V016-V024, V044-V046, V050-V059): one sweep adding verifyAdmin / getUserFromRequest.
2. Kill switches: migrate-now backdoor (V007), ai/text (V008), seed creds (V010), cron defaults (V037).
3. XSS root causes: isomorphic sanitize (V012), JSON-LD escaping serializer (V011), then the dependent sinks.
4. JWT unification (V036) + admin token hardening (V030, V035).
5. SSRF allowlist (V025-V027), ReDoS escapes (V028, V060-V062), Redis rate-limit (V079).
6. Zod validation sweep (V040) + workshop authz (V013-V015, V038-V039, V071-V076).
