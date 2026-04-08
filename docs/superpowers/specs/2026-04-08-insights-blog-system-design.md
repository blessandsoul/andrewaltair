# Insights Blog System — Design Spec

**Date:** 2026-04-08
**Status:** Approved

## Overview

New "Insights" content type — short-form tech commentary posts (300-800 words) in Georgian, alongside existing long-form articles. Each insight links to a source URL, auto-extracts OG image, gets auto-generated tags, and cross-links with both other insights and long articles.

## Architecture Decisions

- **Separate Mongoose model `Insight`** — own collection, own API routes, own URL namespace `/insights/`
- **Shared Tag collection** — insights use the same `Tag` model as posts for unified taxonomy
- **No external API for tags** — hybrid keyword extraction (dictionary + TF scoring) runs server-side
- **OG image extraction** — fetch source URL HTML, parse `og:image`, download to `public/uploads/insights/`
- **Cross-linking stored in DB** — computed at save time, not at render time

## 1. Data Model — `Insight`

```typescript
// src/models/Insight.ts
interface IInsight extends Document {
  _id: mongoose.Types.ObjectId;
  slug: string;                    // English, auto-generated from source title or content keywords
  content: string;                 // Full Georgian text (the post body)
  excerpt: string;                 // First ~160 chars for meta description

  // Source
  sourceUrl: string;               // Required — the article being commented on
  sourceTitle: string;             // Parsed from og:title
  sourceDomain: string;            // Extracted domain (e.g. "the-decoder.com")
  sourceImage: string;             // Local path to downloaded og:image

  // Taxonomy
  tags: string[];                  // Tag slugs (same format as Post.tags)
  autoTags: string[];              // Raw extracted keywords before curation
  categories: string[];            // e.g. ['ai', 'tech-industry']

  // Interlinking
  relatedInsights: string[];       // Slugs of related short posts
  relatedPosts: string[];          // Slugs of related long articles

  // SEO
  seo: {
    metaTitle: string;             // Auto-generated, editable
    metaDescription: string;       // = excerpt
    ogImage: string;               // = sourceImage local path
    canonicalUrl: string;
  };

  // Meta
  author: { name: string; avatar?: string; role?: string };
  status: 'draft' | 'published' | 'archived';
  publishedAt: Date;
  views: number;
  reactions: { fire, love, mindblown, applause, insightful };
  numericId: string;               // 6-digit unique ID (shared system with Post)

  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**
- `slug` — unique
- `status` + `publishedAt` — compound for feed queries
- `tags` — for cross-linking queries
- `numericId` — unique, sparse
- Text index on `content`, `excerpt`, `sourceTitle`

## 2. Auto-Tag System (No API Key)

### 2a. Tag Dictionary (`src/data/tag-dictionary.ts`)

Static mapping of keywords to tag slugs:

```typescript
export const TAG_DICTIONARY: Record<string, string[]> = {
  // Company/Brand → tags
  'openai': ['openai', 'ai'],
  'gpt': ['openai', 'gpt', 'ai'],
  'claude': ['anthropic', 'claude', 'ai'],
  'meta': ['meta', 'big-tech'],
  'google': ['google', 'big-tech'],
  'gemini': ['google', 'gemini', 'ai'],
  'musk': ['elon-musk', 'tech-industry'],
  'მასკ': ['elon-musk', 'tech-industry'],
  'tesla': ['tesla', 'elon-musk'],
  'grok': ['grok', 'xai', 'ai'],
  'sora': ['sora', 'openai', 'video-ai'],
  'midjourney': ['midjourney', 'image-ai'],
  'neuralink': ['neuralink', 'neurotechnology'],
  // Tech concepts
  'agent': ['ai-agents', 'ai'],
  'აგენტ': ['ai-agents', 'ai'],
  'token': ['ai-tokens', 'ai'],
  'ტოკენ': ['ai-tokens', 'ai'],
  'superintelligence': ['superintelligence', 'ai-safety'],
  'სუპერინტელექტ': ['superintelligence', 'ai-safety'],
  'api': ['api', 'developer-tools'],
  'automation': ['automation', 'ai'],
  'ავტომატიზაც': ['automation', 'ai'],
  // ... extensible
};
```

### 2b. Keyword Extraction (`src/lib/tag-extractor.ts`)

```
extractTags(content: string): { tags: string[], autoTags: string[] }
```

Algorithm:
1. **Dictionary scan** — scan content for dictionary keys (case-insensitive), collect matched tag slugs
2. **TF scoring** — tokenize remaining content, remove Georgian stop-words, score by frequency
3. **Existing tag matching** — query Tag collection, match top TF words against existing tag names/slugs
4. **Merge & dedupe** — dictionary tags first (higher confidence), then TF-matched tags, cap at 15
5. **Return** — `tags` = final curated list, `autoTags` = all raw extracted keywords

Stop-words list includes common Georgian particles/conjunctions (~100 words) plus common English stop-words.

## 3. OG Image Extraction (`src/lib/og-parser.ts`)

```
parseSourceUrl(url: string): Promise<{ title, image, domain }>
```

1. `fetch(url)` with User-Agent header (avoid bot blocks)
2. Parse HTML with regex for `<meta property="og:title"`, `og:image`, `og:description"`
3. Extract domain from URL
4. Download og:image to `public/uploads/insights/YYYY-MM/` via existing upload infrastructure
5. Return local path, title, domain

Fallback: if og:image not found or download fails, generate OG image via existing `/api/og` endpoint.

## 4. Cross-Linking System (`src/lib/interlinking.ts`)

```
computeRelatedContent(insight: IInsight): Promise<{ relatedInsights: string[], relatedPosts: string[] }>
```

**Scoring algorithm:**
1. **Tag overlap (weight: 3)** — count shared tags between this insight and all published posts/insights
2. **Category overlap (weight: 2)** — shared categories
3. **Keyword overlap (weight: 1)** — compare `autoTags` arrays for shared keywords
4. **Recency bonus (weight: 0.5)** — posts from last 30 days get slight boost

**Process:**
- Query all published Posts and Insights with at least 1 shared tag
- Score each candidate
- Return top 3 `relatedInsights` + top 3 `relatedPosts`
- **Bidirectional update** — when saving insight X, also add X to the `relatedInsights` of matched insights

**When triggered:** On create and on update of an insight.

## 5. Service Layer — `InsightService`

File: `src/services/insight.service.ts`

Static methods:
- `getAllInsights(options)` — paginated feed, cursor-based (like PostService)
- `getInsightBySlug(slug)` — single insight
- `createInsight(data)` — orchestrates: parse source URL → extract tags → save → compute links → index
- `updateInsight(id, data)` — re-extracts tags if content changed, recomputes links
- `deleteInsight(id)` — removes from others' relatedInsights
- `incrementViews(id)`
- `getRelatedContent(slug)` — returns related insights + posts

## 6. API Routes

### `src/app/api/insights/route.ts`
- **GET** — list insights with pagination, status filter, tag filter, search
- **POST** — create insight (admin only). Accepts `{ content, sourceUrl, categories?, status? }`. Auto-generates everything else.

### `src/app/api/insights/[id]/route.ts`
- **GET** — single insight by ID or slug
- **PUT** — update insight
- **DELETE** — delete insight

### `src/app/api/insights/[id]/react/route.ts`
- **POST** — add reaction (same system as posts)

## 7. Frontend Pages

### `/insights` page — `src/app/insights/page.tsx`
- Server Component, fetches published insights
- Renders `InsightsFeed` client component
- SEO metadata: title, description, og tags for the hub page

### `/insights/[slug]` page — `src/app/insights/[slug]/page.tsx`
- Server Component with `generateMetadata`
- Schema.org `SocialMediaPosting` type
- Breadcrumbs: Home > Insights > [title]
- JSON-LD structured data
- Renders `InsightPageClient`

### Components — `src/components/insights/`

**`InsightCard.tsx`** (~100 lines)
- Card showing full text in feed
- Source link with domain badge at bottom
- Source OG image as card header/background
- Tags row
- Reactions bar
- "Read more" link to `/insights/[slug]` (for SEO crawlability)

**`InsightsFeed.tsx`** (~150 lines)
- Vertical card feed with infinite scroll
- Filter by tag (clickable tags)
- Uses cursor-based pagination (afterSlug pattern from PostService)

**`InsightPageClient.tsx`** (~200 lines)
- Full insight view for individual page
- Source link with preview image
- Related insights section ("Similar insights")
- Related posts section ("Read more about this topic" — links to long articles)
- Reactions
- Share buttons
- Adjacent navigation (prev/next insight)

**`InsightRelatedPosts.tsx`** (~80 lines)
- Shows related long articles from Post collection
- Compact card format with title + excerpt + cover image

## 8. Cross-Linking on Post Pages

Modify existing `BlogPostClient.tsx` to show related insights:
- Add "Related Insights" section below existing related posts
- Query insights that have this post's slug in their `relatedPosts`
- Small compact cards linking to `/insights/[slug]`

## 9. SEO Details

### URL Structure
- Hub: `/insights/`
- Individual: `/insights/[english-slug]`

### Schema.org Markup
```json
{
  "@type": "SocialMediaPosting",
  "headline": "...",
  "sharedContent": { "@type": "WebPage", "url": "sourceUrl" },
  "author": { "@type": "Person", "name": "Andrew Altair" },
  "datePublished": "...",
  "image": "sourceImage"
}
```

### Sitemap
Add insights to existing sitemap generation (or create `/insights/sitemap.xml`).

### IndexNow
Auto-submit published insights to IndexNow (same as posts).

### Internal Linking Power
- Each insight links to source (external, nofollow)
- Each insight links to 3 related long articles (internal, dofollow — SEO juice)
- Each insight links to 3 related insights (internal, dofollow)
- Long articles link back to related insights
- Tags pages aggregate both posts and insights

## 10. Admin

Extend existing admin or create minimal admin page at `/admin/insights/`:
- List all insights with status filter
- Create: paste content + source URL → preview auto-generated tags, source info, related content → publish
- Edit: modify content, tags, status, related content
- Delete

## 11. Files to Create

```
src/models/Insight.ts                          — Mongoose model
src/services/insight.service.ts                — Service layer
src/lib/tag-extractor.ts                       — Hybrid tag extraction
src/lib/og-parser.ts                           — OG meta + image extraction
src/lib/interlinking.ts                        — Cross-linking scorer
src/data/tag-dictionary.ts                     — Keyword → tag mapping
src/app/api/insights/route.ts                  — List + Create API
src/app/api/insights/[id]/route.ts             — CRUD single insight
src/app/api/insights/[id]/react/route.ts       — Reactions API
src/app/insights/page.tsx                      — Feed page (server)
src/app/insights/[slug]/page.tsx               — Individual page (server)
src/components/insights/InsightCard.tsx         — Card component
src/components/insights/InsightsFeed.tsx        — Feed with infinite scroll
src/components/insights/InsightPageClient.tsx   — Individual page client
src/components/insights/InsightRelatedPosts.tsx — Related articles section
src/components/insights/index.ts               — Barrel exports
```

## 12. Files to Modify

```
src/lib/id-system.ts                           — Add Insight to unique ID check
src/app/blog/[slug]/BlogPostClient.tsx         — Add "Related Insights" section
```

## 13. Out of Scope (for now)

- Cron-based re-computation of all links
- Georgian NLP stemming
- RSS feed for insights
- Telegram auto-posting for insights
- Admin bulk import
