# andrewaltair.ge Quality Catalog (100 items)

Scope: whole app. Method: 3 read-only finder passes (architecture/consistency/dead-code, performance/data-fetching, types/validation/tests) plus main-thread grep on docs, states, and config. Judged against the repo house rules in .claude/rules/ (01-08).
This is NOT the security catalog (see VULNERABILITIES.md). Items here are maintainability, performance, type-safety, test, docs, and config quality. Some overlap security at the root (validation gaps, JWT verifier count) and cross-reference it.
Impact = High / Med / Low. Effort = S / M / L.

---

## Architecture (12)

**Q001 [High] Three-plus divergent JWT verification implementations** · architecture · src/lib/jwt-config.ts, server-auth.ts, api/{sessions,auth/me,auth/2fa,auth/logout,users/[id]}/route.ts · M
jwt-config validates issuer/audience/algorithm; server-auth and ~7 routes do bare jwt.verify. Fix: route every caller through jwt-config.verifyToken, delete inline copies. (Security twin: V036.)

**Q002 [High] Auth logic fragmented across four modules** · architecture · src/lib/{server-auth,jwt-config,admin-auth}.ts, src/services/auth.service.ts · M
Session create in auth.service, validate in server-auth, verify in jwt-config, admin separate; getUserFromRequest (22 uses) vs getCurrentUser (2). Fix: one AuthService facade backed by jwt-config.

**Q003 [High] 37 API routes embed Mongoose calls inline** · architecture · src/app/api/**/route.ts (comments/[id], conversion/*, bots/*, auth/*) · L
Routes call Model.find/create/findByIdAndUpdate directly instead of the static-class service layer (rule 04), duplicating query + dbConnect logic. Fix: move persistence into services/*.service.ts.

**Q004 [Med] media/[id] inline DB logic plus non-contract response** · architecture · src/app/api/media/[id]/route.ts:66 · S
GET/PATCH/DELETE call Media.findById* directly and return raw {error} not apiError. Fix: add MediaService, use apiSuccess/apiError.

**Q005 [High] brand.ts colors is a dead second palette, hex hand-copied** · architecture · src/lib/brand.ts:38, src/app/not-found.tsx:142, videos/page.tsx:110, lib/blog-utils.ts:44 · M
brand.colors (cyber #6366f1/#22d3ee) has zero consumers, yet those hex are hand-copied into the 404 snake, videos, category colors, competing with globals.css --primary #3525cd. Fix: delete brand.colors, drive all color from CSS tokens. (UIUX twin: U041.)

**Q006 [Med] Category colors defined in three disconnected places** · consistency · src/lib/blog-utils.ts:44, videos/page.tsx:102, components/blog/PostCard.tsx:250 · S
getCategoryInfo returns hex, videos redefines a local map, PostCard applies inline style: no single source, drifts. Fix: one getCategoryInfo returning a token class.

**Q007 [Med] Rate-limiting implemented four-plus times** · architecture · src/lib/{rate-limit,rate-limiter,forum-ratelimit}.ts, admin-auth.ts, auth.service.ts · M
An in-memory attempts Map re-implemented in 5 places with different windows. Fix: one rateLimit util (Redis-ready), all callers import it. (Security twin: V079.)

**Q008 [Med] Blog / insights / en-insights [slug] pages triplicated** · architecture · src/app/blog/[slug]/page.tsx:291, insights/[slug]/page.tsx:233, en/insights/[slug]/page.tsx:208 · M
Three near-parallel article pages (732 lines) duplicate fetch, metadata, layout for the same Post entity. Fix: extract a shared ArticlePage component parameterized by locale/query.

**Q009 [Med] PostContentParser is a 976-line monolith amid a parser cluster** · maintainability · src/lib/PostContentParser.ts:976, TutorialParser.ts, RepositoryParser.ts · L
One 976-line parser plus siblings with overlapping strip/normalize logic and no shared primitives. Fix: extract shared helpers, split by concern.

**Q010 [Med] Duplicated helper logic (slug, id, sanitize)** · consistency · src/lib/{slug,indexnow,seo-migrations}.ts, {id-format,id-system}.ts, {sanitize,prompt-sanitizer}.ts · M
Slug generation in 3 files, ID formatting split in 2, sanitization split in 2, no canonical owner. Fix: one owner per concern, re-export from the rest.

**Q011 [Med] Mixed Next async-params convention (14 vs 15)** · consistency · 83 handlers await Promise params vs 16 sync params (encyclopedia/**, bots/[id]/check-purchase) · M
Same repo mixes both param contracts. Fix: standardize on awaited params: Promise<...>.

**Q012 [Low] Import-order deviations from rule 01** · consistency · src/components/blog/PostCard.tsx:3 (representative) · M
React not group 1, third-party after @/components, lib before react. Fix: enforce with eslint import/order.

---

## Consistency (10)

**Q013 [High] 246 files hardcode Tailwind palette colors** · consistency · src/{components,app}/**/*.tsx (PostCard bg-red-500/90, videos text-red-500) · L
Rule 02 forbids bg-blue-500/text-red-500 in favor of semantic tokens, but 246 files use them: theming and dark mode fragment. Fix: replace with semantic token classes. (UIUX twin: U042.)

**Q014 [Med] 115 files use inline style={{}}** · consistency · src/{components,app}/**/*.tsx (PostCard.tsx:249) · L
Rule 02 forbids inline styles; 115 files set color/dimensions via style, bypassing tokens. Fix: move to cn() + Tailwind/CVA.

**Q015 [Med] 90 component files use default exports** · consistency · src/components/**/*.tsx · M
Rules 01/02 require named exports (default only for pages/layouts), but 90 components default-export, breaking import + displayName conventions. Fix: convert to named exports.

**Q016 [Med] 98 components exceed the 250-line limit** · maintainability · src/app/bots/BotsPageClient.tsx:2852, admin/posts/page.tsx:1804, admin/videos/page.tsx:1420, prompt-builder/page.tsx:1378 · L
Rule 02 caps at 250 lines; 98 exceed, several past 1000, mixing fetch/state/render. Fix: split into sub-components, extract hooks.

**Q017 [Med] useState overload past the 3-hook limit** · maintainability · src/app/prompt-builder/page.tsx:25, bots/BotsPageClient.tsx:22, bots/[id]/BotDetailClient.tsx:12 · M
12 to 25 useState per component vs the 3-cap (use useReducer). Fix: consolidate into useReducer.

**Q018 [Med] PostCard multi-violation exemplar** · maintainability · src/components/blog/PostCard.tsx:53 · M
6 props (cap 5), 5 useState (cap 3), 472 lines, any[] fields, duplicated comment, inline getContentPreview. Fix: group props, move parser to blog-utils, split card.

**Q019 [Med] transition:all across 170 files (369 occurrences)** · maintainability · src/{app,components}/** · L
transition-all animates every property (perf/repaint smell, masks which state changes). Fix: name the properties (transition-colors / -transform / -opacity). (UIUX twin: U001.)

**Q020 [Med] 404 page ships a 258-line inline canvas snake game** · maintainability · src/app/not-found.tsx:1 · M
A full game loop plus hardcoded hex in a 404 boundary. Fix: extract a SnakeGame component using tokens, keep not-found thin.

**Q021 [Low] 19 files retain debug console.log/console.debug** · consistency · src/**/*.ts(x) · S
Rule 08 requires removing debug logs; 19 source files still log. Fix: remove or route through a guarded logger. (See Q090 for the full 57-hit count.)

**Q022 [Low] Naming/boolean-prefix deviations** · consistency · src/components/** · M
Some booleans lack is/has/can prefixes and handlers lack handle/on split (rule 01). Fix: rename to the convention, enforce via lint.

---

## Performance and indexing (26)

**Q023 [High] Post model missing index on publishedAt** · index · src/models/Post.ts:422 · S
getAllPosts + home sort {publishedAt:-1} with only a text index: in-memory sort/scan. Fix: PostSchema.index({ status:1, publishedAt:-1 }).

**Q024 [High] Post model missing {status, createdAt} compound** · index · src/app/blog/page.tsx:99 · S
Blog list filters status published, sorts {createdAt:-1}, no index. Fix: PostSchema.index({ status:1, createdAt:-1 }).

**Q025 [High] Blog list fetches full article bodies for 24 cards** · perf-query · src/app/blog/page.tsx:98 · S
find(query).lean() returns full sections/content/rawContent for cards that render only title/excerpt/cover. Fix: .select() the card fields.

**Q026 [High] Public posts API returns full bodies per infinite-scroll page** · perf-query · src/services/post.service.ts:133 · S
getAllPosts has no .select(), so each 10-post scroll page ships full article bodies. Fix: card-field projection.

**Q027 [High] PostCard next/image fill without sizes** · perf-image · src/components/blog/PostCard.tsx:209 · S
Image fill with no sizes defaults to 100vw: each of 24 cards fetches up to 3840px for a ~400px slot (LCP/bandwidth). Fix: sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw".

**Q028 [High] Blog detail runs 3 dependent fetches sequentially** · perf-fetch · src/app/blog/[slug]/page.tsx:139 · S
getAdjacentPosts, getRelatedPosts, getInitialComments run serial though independent. Fix: Promise.all them after getPostBySlug.

**Q029 [High] Uncapped limit param allows unbounded full-body fetch** · perf-query · src/app/api/posts/route.ts:12 · S
?limit=100000 returns every full-body post. Fix: Math.min(limit, 50). (Security twin: V042.)

**Q030 [Med] Home page fetches full post bodies for 10 cards** · perf-query · src/app/page.tsx:53 · S
getPosts pulls full sections/content even under ISR (bloated RSC payload). Fix: .select() card fields.

**Q031 [Med] Blog detail fetches the same post twice** · perf-fetch · src/app/blog/[slug]/page.tsx:37 · S
generateMetadata and the body both call getPostBySlug (not deduped). Fix: wrap in React cache().

**Q032 [Med] Public posts API is force-dynamic with no caching** · caching · src/app/api/posts/route.ts:1 · M
Even identical first-page listing runs a live query+count. Fix: unstable_cache with revalidate 120, tags ['posts'].

**Q033 [Med] framer-motion loaded on every page via PageTransition** · perf-bundle · src/components/layout/PageTransition.tsx:4 · M
Always-mounted client component imports motion for a route fade (~50KB into the shared bundle). Fix: CSS transition or dynamic import.

**Q034 [Med] RichTextEditor stack statically imported** · perf-bundle · src/app/admin/content/page.tsx:8 · S
Static import pulls tiptap + mermaid + recharts into the chunk before the editor opens. Fix: dynamic(() => import(...), { ssr:false }).

**Q035 [Med] AI-persona avatars are 500KB unoptimized PNGs** · perf-image · public/ai-personas/einstein.png · M
10 PNGs at ~440-580KB (~5MB total). Fix: pre-compress to WebP/AVIF, ensure next/image with sizes.

**Q036 [Med] Blog search uses unanchored $regex over nested text** · perf-query · src/app/blog/page.tsx:80 · M
$regex over title/description/sections.content cannot use the text index, full-scans nested arrays. Fix: switch to the $text index.

**Q037 [Med] Blog tag filter scans all posts via distinct()** · perf-query · src/app/blog/page.tsx:91 · M
Post.distinct('tags', {status:published}) per request to reverse-map slug. Fix: cached tag-slug map.

**Q038 [Med] Insights tag-count fetches 100 full-content docs to count tags** · perf-fetch · src/app/insights/page.tsx:12 · S
getAllInsights(limit:100) returns full content only to tally tags. Fix: .select('tags') variant or aggregation.

**Q039 [Med] Post.views has no index for top-content sorts** · index · src/services/analytics.service.ts:62 · S
Dashboard topPosts sorts {views:-1} with no index. Fix: PostSchema.index({ status:1, views:-1 }).

**Q040 [Med] Post.order unindexed drives adjacent-post navigation** · index · src/services/post.service.ts:246 · S
getAdjacentPosts filters/sorts on order with no index on every detail view. Fix: PostSchema.index({ status:1, order:1, createdAt:1 }).

**Q041 [Med] getRelatedPosts issues up to 3 serial queries per detail view** · perf-query · src/services/post.service.ts:178 · M
findOne(current) then up to 2 more sequential finds. Fix: fetch relatedPosts with the main post, then one $or find.

**Q042 [Med] Video model missing publishedAt / views indexes** · index · src/models/Video.ts:48 · S
Home sorts {publishedAt:-1}, analytics by views, no indexes. Fix: VideoSchema.index({ publishedAt:-1 }) and { views:-1 }.

**Q043 [Med] Home hot-quote sorts ForumPost by agrees with no index** · index · src/services/forum.service.ts:67 · S
getHotQuote sorts {agrees:-1} on every home render. Fix: ForumPostSchema.index({ agrees:-1 }).

**Q044 [Med] framer-motion imported across 107 components for trivial motion** · perf-bundle · src/components/home/HeroCarousel.tsx:1 · L
Many fade/slide sections use effects a CSS transition covers. Fix: CSS transitions for static entrances, reserve framer for gesture/layout.

**Q045 [Med] Static-data GET routes forced dynamic** · caching · src/app/api/bots/subscriptions/plans/route.ts:1 · S
Plans/tools/categories set force-dynamic, hitting Mongo per request. Fix: drop force-dynamic, export const revalidate = 3600.

**Q046 [Med] Per-visitor geo lookup on the tracking write path** · perf-fetch · src/services/analytics.service.ts:185 · M
trackVisitor awaits getGeoFromIP before every upsert (high-frequency write). Fix: cache geo per IP, resolve on first-seen only.

**Q047 [Low] Certificate images ~350KB JPEGs bulk-render on /about** · perf-image · public/certificates/*.jpg · M
~20 JPEGs at 300-380KB, mostly offscreen. Fix: WebP + next/image sizes + lazy (no priority).

**Q048 [Low] priority set on a hidden modal image in PostCard** · perf-image · src/components/blog/PostCard.tsx:233 · S
The zoom-dialog Image priority preloads full-res for a closed modal, competing with real LCP. Fix: remove priority.

---

## Types and validation (16)

**Q049 [High] noUncheckedIndexedAccess disabled despite rule 03** · noindex · tsconfig.json:11 · L
Commented out with a TODO (~400 fixes), so every index access is silently non-undefined. Fix: enable and fix, or amend the rule to reality.

**Q050 [High] Pervasive any usage (234 occurrences, ~104 files)** · types-any · src (SlashCommandsExtension 17, app/page.tsx 13, tools/[id] 13) · L
Rule 03 bans any; mostly .map((x:any)=>) and Record<string,any>. Fix: unknown + narrowing or interfaces, add eslint no-explicit-any.

**Q051 [Med] Mongo query objects typed Record<string,any> from unvalidated input** · types-any · src/app/api/builder-prompts/[id]/route.ts:74 · M
updateData/pushData/updateQuery are any, populated from body. Fix: UpdateQuery<IPrompt>/FilterQuery<IPrompt> + Zod-derived fields.

**Q052 [Med] any-typed mutation/match objects in tracking routes** · types-any · src/app/api/tracking/engagement/route.ts:20, tracking/clicks/route.ts:107 · S
updateOps:any and match:any defeat type checks on aggregation/update. Fix: PipelineStage / UpdateQuery types.

**Q053 [Med] Service layer leaks any in data mapping** · types-any · src/services/insight.service.ts:376 · S
posts.map((p:any)) discards lean-doc types. Fix: .lean<IInsight[]>() and typed callback.

**Q054 [Med] 240 as assertions, several unjustified** · types-any · src/lib/interlinking.ts:33 (representative) · L
.lean() as (IPost & {_id:any})[] double-casts bypass the type system. Fix: .lean<IPost[]>() + type guards.

**Q055 [Med] 95 service methods lack explicit return types** · types-return · src/services/*.service.ts · L
Rule 03 requires explicit returns on exported functions; inference lets contracts drift. Fix: add Promise<T> annotations.

**Q056 [Med] Auth service entry points untyped** · types-return · src/services/auth.service.ts:55 · S
register/login/issueSession return inferred shapes for a security-critical contract. Fix: declare AuthResult, annotate.

**Q057 [High] 113 of 209 API routes parse a body with no Zod** · validation-zod · src/app/api · L
Only workshop validates; rule 07 mandates server Zod on all input. Fix: shared validateBody(schema, request), schema per route. (Security twin: V040.)

**Q058 [High] Auth routes accept raw unvalidated JSON** · validation-zod · src/app/api/auth/{register,login,2fa}/route.ts, admin/login/route.ts · S
The highest-risk endpoints parse the body with no schema. Fix: strict Zod schemas. (Security twin: V034.)

**Q059 [Med] register type Pick<IUser> gives a false runtime guarantee** · validation-zod · src/services/auth.service.ts:55 · S
The compile-time Pick implies safety but the route passes untyped json. Fix: one Zod schema, validate at route, infer service param via z.infer.

**Q060 [Med] Query-building conversion routes build filters from body without schema** · validation-zod · src/app/api/conversion/quests/route.ts:24, conversion/challenges/route.ts:49 · M
Filter/mutate with (p:any)=>p.userId over unvalidated ids. Fix: Zod schema + typed callbacks.

**Q061 [Med] Forms bypass react-hook-form + zodResolver** · validation-zod · src/features/profile/components/tabs/ProfileInfoTab.tsx:33, SecurityTab.tsx:25 · M
Manual useState + safeParse instead of useForm({resolver}) (rule 04); QuickPurchaseForm, PremiumRequestModal, EditSuggestion, Comments also skip RHF. Fix: migrate to useForm + zodResolver.

**Q062 [Med] PromptSubmission model has no typed interface** · model-types · src/models/PromptSubmission.ts:48 · S
The only model of 70 with no IPromptSubmission interface and an untyped model() call. Fix: add the interface + generic.

**Q063 [Low] Loosely typed schema internals (this:any validator, untyped sub-schema)** · model-types · src/models/Bot.ts:132, Quest.ts:30 · S
validator(this:any) and standalone new Schema drop doc typing. Fix: type this as the doc interface, give sub-schemas a generic.

**Q064 [Low] Unchecked split-index used as definite value** · noindex · src/app/api/auth/register/route.ts:31 · S
parseInt(msg.split(':')[2]) assumes index 2 exists (yields NaN). Fix: destructure with a length guard.

---

## Tests (6)

**Q065 [High] 16 of 19 services have zero tests** · test-gap · src/services (only auth, post, workshop tested) · L
analytics, bot, communication, encyclopedia, forum, insight, link, media, seo, system, taxonomy, tool, tutorial, user, vibecode, youtube untested. Fix: Vitest suites (mocked DB), prioritize user/bot/insight.

**Q066 [High] Security-critical lib utilities untested (5 of 57 lib files)** · test-gap · src/lib (sanitize, csrf, totp, jwt-config, prompt-sanitizer untested) · M
Exactly the utilities rule 08 flags as must-test. Fix: unit tests with malformed-input assertions. (Security twin: V041.)

**Q067 [Med] user.service and bot.service untested** · test-gap · src/services/user.service.ts, bot.service.ts · M
Account/profile mutations and marketplace logic with no regression coverage. Fix: create/update/delete + permission-branch suites.

**Q068 [Med] insight.service and seo.service untested** · test-gap · src/services/insight.service.ts, seo.service.ts · M
Public-facing rendering and SEO/redirect generation ship regressions silently. Fix: query-mapping, slug/canonical, empty-result tests.

**Q069 [Med] No regression test harness for the auth/session flows** · test-gap · src/services/auth.service.ts · M
Login, session revocation, 2FA have thin coverage; the security fixes in Phase B need tests to lock them. Fix: add auth-flow suites before/with the security batch.

**Q070 [Low] No component tests for the shared UI primitives** · test-gap · src/components/ui · M
Button/Card/Input have no tests; the Phase B primitive changes (press, transitions) risk silent regressions. Fix: Testing Library render + interaction tests.

---

## Dead code (8)

**Q071 [Med] rate-limiter.ts is dead (zero imports)** · dead-code · src/lib/rate-limiter.ts:1 · S
createRateLimiter has no importers, a third unused rate-limit variant. Fix: delete.

**Q072 [Low] email-resend.ts is dead (zero imports)** · dead-code · src/lib/email-resend.ts · S
Orphaned parallel mailer; active one is lib/email.ts. Fix: delete or fold into email.ts.

**Q073 [Low] test-parser.ts is dead (zero imports)** · dead-code · src/lib/test-parser.ts:1 · S
83-line parser experiment, no importers. Fix: delete.

**Q074 [Med] Committed .broken and .backup component files** · dead-code · src/components/vibe-coding/VibeCodingLibraryV2.tsx.broken, .backup · S
Broken/backup copies tracked in git (they even contain console.log). Fix: delete, add *.broken/*.backup to .gitignore.

**Q075 [Med] Git-tracked dev junk at repo root** · dead-code · check-all-icons.js, check-db-users.js, check-icons.js, test-youtube-api.js, repro_parser.ts, _devserver.log, WORKSHOP_KA_HOST_REVIEW.md.bak, scratch/*.patch · S
One-off scripts, a dev log, a .bak, a scratch patch committed (contradicts rule 08 .gitignore essentials). Fix: git rm + add *.log/*.bak/scratch/ patterns.

**Q076 [Low] Stale Groq code paths and comments** · dead-code · src/lib/openrouter-georgian.ts, ai-comment-generator.ts · S
References to the retired Groq provider remain in code/comments after the Gemini migration. Fix: remove dead branches, update comments.

**Q077 [Low] Unused exports across lib** · dead-code · src/lib (various) · M
Helpers exported with no importers (beyond the three dead files). Fix: run ts-prune, remove unused exports.

**Q078 [Low] Backup .env on disk (not tracked) plus example drift** · dead-code · .env.local.bak_prebmongo, .env.example · S
A stale env backup sits in the tree (gitignored) and .env.example drifts from real keys. Fix: remove the backup, sync example keys.

---

## Docs, error-handling, config, state (22)

**Q079 [High] API_AGENTS.md documents Groq while code uses Gemini** · docs · API_AGENTS.md · S
The READ-FIRST architecture doc names Groq; the code is @google/generative-ai (gemini-2.5-flash-lite). New contributors wire the wrong provider. Fix: rewrite the AI section for Gemini.

**Q080 [Med] README / AGENTS / GEMINI doc drift vs code** · docs · README.md, AGENTS.md, GEMINI.md · M
Version, stack, and feature descriptions lag the code (v2.1.0-Alpha claims, dropped features). Fix: reconcile in one docs pass.

**Q081 [Med] .env.example drift vs actual process.env usage** · docs · .env.example · S
Keys the code reads (or no longer reads) are missing/stale in the example. Fix: generate the example from a grepped env-key list.

**Q082 [High] Missing error.tsx on ~14 user-facing route groups** · missing-state · src/app/{insights,forum,services,projects,about,mystic,profile,prompt-builder,workshop,repositories,lessons,quiz,search,en/insights} · M
Only 9 routes have an error boundary; the rest fall back to the root, losing route context. Fix: add a route-scoped error.tsx (reduced-motion, retry action). (UIUX twin: U066.)

**Q083 [Med] Missing loading.tsx on ~10 list routes** · missing-state · src/app/{insights,forum,prompts,services,repositories,lessons,quiz,mystic,prompt-builder,projects} · M
Only 9 routes have a loader; the rest flash blank. Fix: add content-shaped skeleton loading.tsx. (UIUX twin: U061.)

**Q084 [Med] No boot-time env validation** · config · src/lib (no env schema) · M
Rule 07 says validate env with Zod at startup; missing MONGODB_URI/JWT_SECRET fail late at request time (jwt-config checks JWT only). Fix: a Zod env schema loaded once at boot.

**Q085 [Med] Hardcoded UI strings, no i18n layer** · i18n · src/app, src/components (KA inline, some EN) · L
Georgian strings inline in components with EN mirror pages hand-duplicated (en/insights). Fix: a lightweight i18n dictionary, one source per string.

**Q086 [Med] Error leakage beyond the diploma route** · error-leak · src/app/api (routes returning e.message) · M
Several catch blocks return error.message to the client (paths, driver text), contrary to rule 06. Fix: generic apiError code + server-side log. (Security-adjacent: V077.)

**Q087 [Med] Empty or log-only catch blocks** · error-handling · src/app/api, src/services · M
Catches that only console.log then continue (or return success) swallow failures (rule 06). Fix: log with context and return a real error code.

**Q088 [Med] No structured logger or request correlation** · logging · src/lib (no logger) · M
console.error/log scattered with no levels, no request id, no redaction. Fix: a small logger wrapper with levels + a per-request id.

**Q089 [Low] 57 console.log/debug across 21 files** · logging · src/** · S
Beyond the 19 flagged in Q021, log/debug calls sit in production paths (BlogPostClient, tracking/cleanup, premium-request, tools/deduplicate, indexnow). Fix: strip or gate behind the logger.

**Q090 [Low] Magic numbers and strings not named** · constants · src/lib/rate-limit.ts, admin-auth.ts, auth.service.ts · S
Rate windows, attempt caps, token TTLs are inline literals. Fix: UPPER_SNAKE_CASE constants in a config module.

**Q091 [Low] next.config.mjs deploy coupling undocumented** · config · next.config.mjs · S
experimental.cpus:1 and workerThreads:false are VPS-tuning that will surprise a reader on other hardware. Fix: a comment plus an env-driven toggle.

**Q092 [Low] Dockerfile review (standalone copy, cache layers)** · config · Dockerfile · M
Standalone output copy and layer ordering can be tightened for build cache and image size. Fix: multi-stage cache of node_modules, copy .next/standalone last.

**Q093 [Low] Missing JSDoc on complex lib** · docs · src/lib/PostContentParser.ts, og-parser.ts · M
The 976-line parser and the OG fetcher have no top-level contract docs. Fix: add JSDoc describing input/output/failure modes.

**Q094 [Low] No shared date/number/locale formatter** · consistency · src/components, src/lib · M
Dates and numbers formatted ad hoc (some ka-GE, some default). Fix: one formatDate/formatNumber util with the ka-GE locale.

**Q095 [Low] Health route depth unknown** · observability · src/app/api/health/route.ts · S
Confirm /api/health checks DB connectivity, not just process liveness, so orchestration restarts on a dead Mongo. Fix: add a dbConnect ping with a short timeout.

**Q096 [Low] TODO/FIXME debt uncatalogued** · docs · src/** · S
Scattered TODO/FIXME (including the noUncheckedIndexedAccess TODO) with no tracking. Fix: grep to an issues list, link to owners.

**Q097 [Low] package.json version vs docs mismatch** · docs · package.json, docs · S
Docs cite v2.1.0-Alpha; package.json version is out of sync. Fix: single-source the version, add a CHANGELOG.

**Q098 [Low] Mixed response helpers in a few routes** · consistency · src/app/api/media/[id]/route.ts and 2 others · S
206 of 209 routes use apiSuccess/apiError; the 3 offenders return raw Response.json. Fix: convert the 3 to the contract.

**Q099 [Low] Inconsistent revalidate/dynamic policy per route** · caching · src/app/api/** · M
Some read-only routes are force-dynamic, some cached, with no documented policy. Fix: a short caching-policy note plus per-route revalidate defaults.

**Q100 [Low] .gitignore gaps** · config · .gitignore · S
*.log, *.bak, *.broken, scratch/ not fully covered, letting junk (Q074, Q075) get committed. Fix: extend .gitignore patterns.

---

## Suggested fix order (feeds Phase B quality batch)

1. Foundational + cascading: unify JWT verifiers (Q001), one rate-limit util (Q007), delete dead files (Q071-Q078), the transition:all sweep (Q019).
2. Perf quick wins: Post/Video/Forum indexes (Q023, Q024, Q039, Q040, Q042, Q043), list projections (Q025, Q026, Q030), image sizes (Q027).
3. Type-safety: enable noUncheckedIndexedAccess plan (Q049), the any sweep (Q050), explicit service return types (Q055).
4. Validation: the Zod route sweep (Q057, Q058) shared with the security batch.
5. Tests: security-lib and service suites (Q065, Q066) that lock the Phase B fixes.
6. Docs and state coverage: Groq to Gemini (Q079), error.tsx/loading.tsx coverage (Q082, Q083), env validation (Q084).
