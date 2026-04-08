# Insights Blog System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a short-form "Insights" blog system with auto-tagging, OG image extraction, and cross-linking to existing long articles.

**Architecture:** Separate `Insight` Mongoose model with own API routes (`/api/insights/`) and frontend pages (`/insights/`). Shares the Tag collection with Posts. Tag extraction uses a local dictionary + TF scoring (no external API). OG images from source URLs are downloaded locally. Cross-linking is computed at save time and stored in DB.

**Tech Stack:** Next.js 14 App Router, TypeScript, Mongoose/MongoDB, Tailwind CSS 4, Radix UI

---

## File Map

### New Files
| File | Responsibility |
|------|---------------|
| `src/models/Insight.ts` | Mongoose model + TypeScript interfaces |
| `src/data/tag-dictionary.ts` | Keyword-to-tag static mapping |
| `src/lib/tag-extractor.ts` | Hybrid tag extraction (dictionary + TF) |
| `src/lib/og-parser.ts` | OG meta extraction + image download |
| `src/lib/interlinking.ts` | Cross-linking scorer for insights <-> posts |
| `src/services/insight.service.ts` | Business logic layer |
| `src/app/api/insights/route.ts` | GET (list) + POST (create) |
| `src/app/api/insights/[id]/route.ts` | GET/PUT/DELETE single insight |
| `src/app/api/insights/[id]/react/route.ts` | Reactions endpoint |
| `src/app/insights/page.tsx` | Feed page (Server Component) |
| `src/app/insights/[slug]/page.tsx` | Individual insight page (Server Component) |
| `src/components/insights/InsightCard.tsx` | Card for feed display |
| `src/components/insights/InsightsFeed.tsx` | Infinite scroll feed |
| `src/components/insights/InsightPageClient.tsx` | Individual page client component |
| `src/components/insights/InsightRelatedPosts.tsx` | Related articles section |
| `src/components/insights/index.ts` | Barrel exports |

### Modified Files
| File | Change |
|------|--------|
| `src/lib/error-codes.ts` | Add `INSIGHT_*` error codes |
| `src/lib/id-system.ts` | Add Insight to unique ID collision check |
| `src/lib/indexnow.ts` | Add `indexInsight()` helper |

---

### Task 1: Insight Model + Error Codes

**Files:**
- Create: `src/models/Insight.ts`
- Modify: `src/lib/error-codes.ts`

- [ ] **Step 1: Create the Insight model**

Create `src/models/Insight.ts`:

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IInsightSEO {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
}

export interface IInsightAuthor {
    name: string;
    avatar?: string;
    role?: string;
}

export interface IInsightReactions {
    fire: number;
    love: number;
    mindblown: number;
    applause: number;
    insightful: number;
}

export interface IInsight extends Document {
    _id: mongoose.Types.ObjectId;
    slug: string;
    content: string;
    excerpt: string;
    sourceUrl: string;
    sourceTitle: string;
    sourceDomain: string;
    sourceImage: string;
    tags: string[];
    autoTags: string[];
    categories: string[];
    relatedInsights: string[];
    relatedPosts: string[];
    seo: IInsightSEO;
    author: IInsightAuthor;
    status: 'draft' | 'published' | 'archived';
    publishedAt: Date;
    views: number;
    reactions: IInsightReactions;
    numericId: string;
    createdAt: Date;
    updatedAt: Date;
}

const InsightSEOSchema = new Schema<IInsightSEO>(
    {
        metaTitle: { type: String, maxlength: 70 },
        metaDescription: { type: String, maxlength: 160 },
        ogImage: { type: String },
        canonicalUrl: { type: String },
    },
    { _id: false }
);

const InsightAuthorSchema = new Schema<IInsightAuthor>(
    {
        name: { type: String, required: true },
        avatar: { type: String },
        role: { type: String },
    },
    { _id: false }
);

const InsightReactionsSchema = new Schema<IInsightReactions>(
    {
        fire: { type: Number, default: 0 },
        love: { type: Number, default: 0 },
        mindblown: { type: Number, default: 0 },
        applause: { type: Number, default: 0 },
        insightful: { type: Number, default: 0 },
    },
    { _id: false }
);

const InsightSchema = new Schema<IInsight>(
    {
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: true,
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        excerpt: {
            type: String,
            required: [true, 'Excerpt is required'],
            trim: true,
        },
        sourceUrl: {
            type: String,
            required: [true, 'Source URL is required'],
        },
        sourceTitle: {
            type: String,
            default: '',
        },
        sourceDomain: {
            type: String,
            default: '',
        },
        sourceImage: {
            type: String,
            default: '',
        },
        tags: {
            type: [String],
            default: [],
        },
        autoTags: {
            type: [String],
            default: [],
        },
        categories: {
            type: [String],
            default: [],
            index: true,
        },
        relatedInsights: {
            type: [String],
            default: [],
        },
        relatedPosts: {
            type: [String],
            default: [],
        },
        seo: {
            type: InsightSEOSchema,
            default: () => ({}),
        },
        author: {
            type: InsightAuthorSchema,
            required: true,
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'draft',
            index: true,
        },
        publishedAt: {
            type: Date,
            default: Date.now,
        },
        views: {
            type: Number,
            default: 0,
        },
        reactions: {
            type: InsightReactionsSchema,
            default: () => ({
                fire: 0,
                love: 0,
                mindblown: 0,
                applause: 0,
                insightful: 0,
            }),
        },
        numericId: {
            type: String,
            unique: true,
            sparse: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

InsightSchema.index({ status: 1, publishedAt: -1 });
InsightSchema.index({ tags: 1 });
InsightSchema.index({ content: 'text', excerpt: 'text', sourceTitle: 'text' });

const Insight = mongoose.models.Insight || mongoose.model<IInsight>('Insight', InsightSchema);

export default Insight;
```

- [ ] **Step 2: Add Insight error codes**

In `src/lib/error-codes.ts`, add after the `// Post` section (after line 36):

```typescript
  // Insight
  INSIGHT_NOT_FOUND: 'INSIGHT_NOT_FOUND',
  INSIGHT_CREATE_FAILED: 'INSIGHT_CREATE_FAILED',
  INSIGHT_UPDATE_FAILED: 'INSIGHT_UPDATE_FAILED',
  INSIGHT_DELETE_FAILED: 'INSIGHT_DELETE_FAILED',
  INSIGHT_FETCH_FAILED: 'INSIGHT_FETCH_FAILED',
```

- [ ] **Step 3: Commit**

```bash
git add src/models/Insight.ts src/lib/error-codes.ts
git commit -m "feat(insights): add Insight model and error codes"
```

---

### Task 2: Tag Dictionary + Tag Extractor

**Files:**
- Create: `src/data/tag-dictionary.ts`
- Create: `src/lib/tag-extractor.ts`

- [ ] **Step 1: Create the tag dictionary**

Create `src/data/tag-dictionary.ts`:

```typescript
/**
 * Static keyword-to-tag mapping for auto-tagging.
 * Keys are lowercase. Values are tag slugs.
 * Supports both English and Georgian keywords.
 */
export const TAG_DICTIONARY: Record<string, string[]> = {
    // --- Companies & Brands ---
    'openai': ['openai', 'ai'],
    'gpt': ['openai', 'gpt', 'ai'],
    'chatgpt': ['openai', 'chatgpt', 'ai'],
    'claude': ['anthropic', 'claude', 'ai'],
    'anthropic': ['anthropic', 'ai'],
    'meta': ['meta', 'big-tech'],
    'google': ['google', 'big-tech'],
    'deepmind': ['google', 'deepmind', 'ai'],
    'gemini': ['google', 'gemini', 'ai'],
    'microsoft': ['microsoft', 'big-tech'],
    'copilot': ['microsoft', 'copilot', 'ai'],
    'apple': ['apple', 'big-tech'],
    'nvidia': ['nvidia', 'ai-hardware'],
    'tesla': ['tesla', 'elon-musk'],
    'xai': ['xai', 'elon-musk', 'ai'],
    'grok': ['grok', 'xai', 'ai'],
    'neuralink': ['neuralink', 'elon-musk', 'neurotechnology'],
    'midjourney': ['midjourney', 'image-ai'],
    'stability': ['stability-ai', 'image-ai'],
    'runway': ['runway', 'video-ai'],
    'sora': ['sora', 'openai', 'video-ai'],
    'perplexity': ['perplexity', 'ai-search'],
    'hugging face': ['hugging-face', 'open-source-ai'],
    'huggingface': ['hugging-face', 'open-source-ai'],
    'mistral': ['mistral', 'open-source-ai'],
    'llama': ['llama', 'meta', 'open-source-ai'],
    'cursor': ['cursor', 'ai-coding'],
    'devin': ['devin', 'ai-coding'],

    // --- People ---
    'musk': ['elon-musk', 'tech-industry'],
    'altman': ['sam-altman', 'openai'],
    'zuckerberg': ['zuckerberg', 'meta'],
    'pichai': ['sundar-pichai', 'google'],
    'nadella': ['satya-nadella', 'microsoft'],
    // Georgian
    'მასკ': ['elon-musk', 'tech-industry'],
    'ოლტმენ': ['sam-altman', 'openai'],
    'ილონ': ['elon-musk', 'tech-industry'],
    'ცუკერბერგ': ['zuckerberg', 'meta'],

    // --- Tech Concepts ---
    'agent': ['ai-agents', 'ai'],
    'აგენტ': ['ai-agents', 'ai'],
    'token': ['ai-tokens', 'ai'],
    'ტოკენ': ['ai-tokens', 'ai'],
    'superintelligence': ['superintelligence', 'ai-safety'],
    'სუპერინტელექტ': ['superintelligence', 'ai-safety'],
    'agi': ['agi', 'ai-safety'],
    'api': ['api', 'developer-tools'],
    'automation': ['automation', 'ai'],
    'ავტომატიზაც': ['automation', 'ai'],
    'llm': ['llm', 'ai'],
    'transformer': ['transformer', 'ai'],
    'fine-tuning': ['fine-tuning', 'ai'],
    'prompt': ['prompt-engineering', 'ai'],
    'პრომპტ': ['prompt-engineering', 'ai'],
    'neural': ['neural-networks', 'ai'],
    'ნეირონ': ['neural-networks', 'ai'],
    'robotics': ['robotics', 'ai'],
    'რობოტ': ['robotics', 'ai'],
    'autonomous': ['autonomous-systems', 'ai'],
    'ავტონომიურ': ['autonomous-systems', 'ai'],
    'blockchain': ['blockchain', 'web3'],
    'crypto': ['crypto', 'web3'],
    'open source': ['open-source'],
    'open-source': ['open-source'],
    'startup': ['startup', 'tech-industry'],
    'სტარტაპ': ['startup', 'tech-industry'],

    // --- Domains ---
    'healthcare': ['healthcare', 'ai-applications'],
    'education': ['education', 'ai-applications'],
    'განათლება': ['education', 'ai-applications'],
    'cybersecurity': ['cybersecurity'],
    'კიბერუსაფრთხოება': ['cybersecurity'],
    'regulation': ['ai-regulation', 'policy'],
    'რეგულაცია': ['ai-regulation', 'policy'],
    'copyright': ['copyright', 'ai-regulation'],
    'lawsuit': ['legal', 'tech-industry'],
    'სარჩელ': ['legal', 'tech-industry'],
};

/**
 * Common Georgian stop-words to filter out during TF extraction.
 */
export const GEORGIAN_STOP_WORDS = new Set([
    'და', 'არის', 'რომ', 'ეს', 'იყო', 'მაგრამ', 'ან', 'თუ', 'კი', 'რა',
    'ვინ', 'სად', 'როგორ', 'რატომ', 'როდის', 'უფრო', 'ყველა', 'ერთ',
    'ისე', 'ასე', 'მხოლოდ', 'უკვე', 'ჯერ', 'აქ', 'იქ', 'ახლა', 'მაშინ',
    'რადგან', 'ამიტომ', 'თუმცა', 'ხოლო', 'მიუხედავად', 'შესაძლოა',
    'უნდა', 'შეიძლება', 'საჭიროა', 'აუცილებელია', 'დიდი', 'პატარა',
    'ახალი', 'ძველი', 'კარგი', 'ცუდი', 'ბევრი', 'ცოტა', 'სხვა', 'იგივე',
    'ჩემი', 'შენი', 'მისი', 'ჩვენი', 'თქვენი', 'მათი', 'ამ', 'იმ',
    'რომელიც', 'რომელსაც', 'რომლის', 'რასაც', 'ვინც', 'სადაც',
    'არა', 'კი', 'დიახ', 'ჰო', 'ვერ', 'არ', 'ნუ', 'იყოს',
    'იქნება', 'ხდება', 'აქვს', 'გააჩნია', 'შეუძლია',
    'ის', 'მე', 'შენ', 'ჩვენ', 'თქვენ', 'ისინი',
    'მას', 'მათ', 'ჩემს', 'შენს',
    'ზე', 'ში', 'დან', 'კენ', 'თან', 'ით', 'სთვის', 'ამდე',
    'წინ', 'უკან', 'შემდეგ', 'წინათ', 'შორის', 'გარეშე',
]);

export const ENGLISH_STOP_WORDS = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'shall', 'must', 'need',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her',
    'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their',
    'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom',
    'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either',
    'if', 'then', 'else', 'when', 'where', 'why', 'how',
    'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
    'up', 'about', 'into', 'over', 'after', 'before', 'between',
    'all', 'each', 'every', 'some', 'any', 'no', 'more', 'most',
    'very', 'just', 'also', 'now', 'here', 'there', 'than',
]);
```

- [ ] **Step 2: Create the tag extractor**

Create `src/lib/tag-extractor.ts`:

```typescript
import { TAG_DICTIONARY, GEORGIAN_STOP_WORDS, ENGLISH_STOP_WORDS } from '@/data/tag-dictionary';
import dbConnect from '@/lib/db';
import Tag from '@/models/Tag';

interface TagExtractionResult {
    tags: string[];
    autoTags: string[];
}

/**
 * Extract tags from content using hybrid approach:
 * 1. Dictionary scan for known keywords
 * 2. TF scoring for remaining words
 * 3. Match against existing Tag collection
 */
export async function extractTags(content: string): Promise<TagExtractionResult> {
    const lowerContent = content.toLowerCase();
    const allAutoTags: string[] = [];

    // --- Phase 1: Dictionary scan ---
    const dictionaryTags: string[] = [];
    for (const [keyword, tagSlugs] of Object.entries(TAG_DICTIONARY)) {
        if (lowerContent.includes(keyword.toLowerCase())) {
            dictionaryTags.push(...tagSlugs);
            allAutoTags.push(keyword);
        }
    }

    // --- Phase 2: TF scoring ---
    const tokens = tokenize(content);
    const filteredTokens = tokens.filter(
        (t) => t.length > 2 && !GEORGIAN_STOP_WORDS.has(t) && !ENGLISH_STOP_WORDS.has(t)
    );

    const frequency: Record<string, number> = {};
    for (const token of filteredTokens) {
        frequency[token] = (frequency[token] || 0) + 1;
    }

    const topWords = Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([word]) => word);

    allAutoTags.push(...topWords);

    // --- Phase 3: Match against existing tags in DB ---
    await dbConnect();
    const existingTags = await Tag.find({}).select('slug name').lean();
    const matchedFromTF: string[] = [];

    for (const word of topWords) {
        const match = existingTags.find(
            (tag) =>
                tag.slug.includes(word) ||
                word.includes(tag.slug) ||
                tag.name.toLowerCase().includes(word) ||
                word.includes(tag.name.toLowerCase())
        );
        if (match) {
            matchedFromTF.push(match.slug);
        }
    }

    // --- Merge & dedupe ---
    const merged = [...new Set([...dictionaryTags, ...matchedFromTF])];
    const tags = merged.slice(0, 15);
    const autoTags = [...new Set(allAutoTags)];

    return { tags, autoTags };
}

/**
 * Tokenize text into words. Handles both Georgian and Latin scripts.
 */
function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/https?:\/\/\S+/g, '')        // Remove URLs
        .replace(/[^\p{L}\p{N}\s-]/gu, ' ')    // Keep letters, numbers, spaces, hyphens
        .split(/\s+/)
        .filter((t) => t.length > 0);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/data/tag-dictionary.ts src/lib/tag-extractor.ts
git commit -m "feat(insights): add tag dictionary and hybrid tag extractor"
```

---

### Task 3: OG Parser

**Files:**
- Create: `src/lib/og-parser.ts`

- [ ] **Step 1: Create the OG parser**

Create `src/lib/og-parser.ts`:

```typescript
import fs from 'fs';
import path from 'path';

interface OGParseResult {
    title: string;
    image: string;
    domain: string;
    description: string;
}

/**
 * Fetch a URL and extract Open Graph metadata.
 * Downloads og:image locally to public/uploads/insights/.
 */
export async function parseSourceUrl(url: string): Promise<OGParseResult> {
    const domain = extractDomain(url);
    let title = '';
    let image = '';
    let description = '';

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; AndrewAltairBot/1.0)',
                'Accept': 'text/html',
            },
            signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
            return { title: '', image: '', domain, description: '' };
        }

        const html = await response.text();

        title = extractMeta(html, 'og:title') || extractHtmlTitle(html) || '';
        image = extractMeta(html, 'og:image') || '';
        description = extractMeta(html, 'og:description') || '';

        // Download og:image locally
        if (image) {
            const localPath = await downloadImage(image, domain);
            if (localPath) {
                image = localPath;
            }
        }
    } catch (error) {
        console.error('[og-parser] Failed to parse:', url, error);
    }

    return { title, image, domain, description };
}

/**
 * Extract meta content by property name from raw HTML.
 */
function extractMeta(html: string, property: string): string {
    // Match both property="og:..." and name="og:..."
    const patterns = [
        new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i'),
        new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`, 'i'),
    ];

    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match?.[1]) return match[1];
    }
    return '';
}

/**
 * Extract <title> tag content as fallback.
 */
function extractHtmlTitle(html: string): string {
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return match?.[1]?.trim() || '';
}

/**
 * Extract domain from URL.
 */
function extractDomain(url: string): string {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return '';
    }
}

/**
 * Download image to public/uploads/insights/YYYY-MM/ and return local path.
 */
async function downloadImage(imageUrl: string, domain: string): Promise<string | null> {
    try {
        // Resolve relative URLs
        let fullUrl = imageUrl;
        if (imageUrl.startsWith('//')) {
            fullUrl = `https:${imageUrl}`;
        } else if (imageUrl.startsWith('/')) {
            fullUrl = `https://${domain}${imageUrl}`;
        }

        const response = await fetch(fullUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AndrewAltairBot/1.0)' },
            signal: AbortSignal.timeout(15000),
        });

        if (!response.ok) return null;

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.startsWith('image/')) return null;

        const buffer = Buffer.from(await response.arrayBuffer());

        // Determine extension
        const ext = contentType.includes('png') ? '.png'
            : contentType.includes('webp') ? '.webp'
            : contentType.includes('gif') ? '.gif'
            : '.jpg';

        // Create directory: public/uploads/insights/YYYY-MM/
        const now = new Date();
        const yearMonth = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
        const dirPath = path.join(process.cwd(), 'public', 'uploads', 'insights', yearMonth);
        fs.mkdirSync(dirPath, { recursive: true });

        // Generate filename from domain + timestamp
        const safeDomain = domain.replace(/[^a-z0-9]/g, '-');
        const filename = `${safeDomain}-${Date.now()}${ext}`;
        const filePath = path.join(dirPath, filename);

        fs.writeFileSync(filePath, buffer);

        // Return path relative to public (for serving via /api/files/ or /uploads/)
        return `/uploads/insights/${yearMonth}/${filename}`;
    } catch (error) {
        console.error('[og-parser] Image download failed:', error);
        return null;
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/og-parser.ts
git commit -m "feat(insights): add OG meta parser with image download"
```

---

### Task 4: Interlinking System

**Files:**
- Create: `src/lib/interlinking.ts`

- [ ] **Step 1: Create the interlinking module**

Create `src/lib/interlinking.ts`:

```typescript
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import Insight from '@/models/Insight';

import type { IPost } from '@/models/Post';
import type { IInsight } from '@/models/Insight';

interface RelatedContent {
    relatedInsights: string[];
    relatedPosts: string[];
}

/**
 * Compute related content for an insight based on tag overlap,
 * category overlap, and keyword similarity. Stores results in DB.
 */
export async function computeRelatedContent(insight: IInsight): Promise<RelatedContent> {
    await dbConnect();

    const insightTags = new Set(insight.tags);
    const insightCategories = new Set(insight.categories);
    const insightKeywords = new Set(insight.autoTags);

    // --- Find candidate Posts ---
    const candidatePosts = await Post.find({
        status: 'published',
        $or: [
            { tags: { $in: insight.tags } },
            { categories: { $in: insight.categories } },
        ],
    })
        .select('slug tags categories entities')
        .lean() as (IPost & { _id: any })[];

    const postScores = candidatePosts.map((post) => {
        let score = 0;

        // Tag overlap (weight: 3)
        const sharedTags = (post.tags || []).filter((t: string) => insightTags.has(t)).length;
        score += sharedTags * 3;

        // Category overlap (weight: 2)
        const sharedCats = (post.categories || []).filter((c: string) => insightCategories.has(c)).length;
        score += sharedCats * 2;

        // Entity/keyword overlap (weight: 1)
        const sharedKeywords = (post.entities || []).filter((e: string) => insightKeywords.has(e.toLowerCase())).length;
        score += sharedKeywords;

        return { slug: post.slug, score };
    });

    const relatedPosts = postScores
        .filter((p) => p.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((p) => p.slug);

    // --- Find candidate Insights ---
    const candidateInsights = await Insight.find({
        status: 'published',
        slug: { $ne: insight.slug },
        $or: [
            { tags: { $in: insight.tags } },
            { categories: { $in: insight.categories } },
        ],
    })
        .select('slug tags categories autoTags')
        .lean() as (IInsight & { _id: any })[];

    const insightScores = candidateInsights.map((other) => {
        let score = 0;

        const sharedTags = (other.tags || []).filter((t: string) => insightTags.has(t)).length;
        score += sharedTags * 3;

        const sharedCats = (other.categories || []).filter((c: string) => insightCategories.has(c)).length;
        score += sharedCats * 2;

        const sharedKeywords = (other.autoTags || []).filter((k: string) => insightKeywords.has(k)).length;
        score += sharedKeywords;

        return { slug: other.slug, score };
    });

    const relatedInsights = insightScores
        .filter((i) => i.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((i) => i.slug);

    // --- Bidirectional update: add this insight to related insights' relatedInsights ---
    if (relatedInsights.length > 0) {
        await Insight.updateMany(
            { slug: { $in: relatedInsights } },
            { $addToSet: { relatedInsights: insight.slug } }
        );
    }

    return { relatedInsights, relatedPosts };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/interlinking.ts
git commit -m "feat(insights): add cross-linking scorer with bidirectional updates"
```

---

### Task 5: Update ID System + IndexNow

**Files:**
- Modify: `src/lib/id-system.ts`
- Modify: `src/lib/indexnow.ts`

- [ ] **Step 1: Add Insight to ID collision check**

In `src/lib/id-system.ts`, add the import at the top (after line 2):

```typescript
import Insight from '@/models/Insight';
```

Then update the `generateUniqueId` function. Replace the collision check block (lines 32-35):

```typescript
        const [existingPost, existingPrompt] = await Promise.all([
            Post.findOne({ numericId: potentialId }).select('_id').lean(),
            MarketplacePrompt.findOne({ numericId: potentialId }).select('_id').lean()
        ]);

        if (!existingPost && !existingPrompt) {
```

With:

```typescript
        const [existingPost, existingPrompt, existingInsight] = await Promise.all([
            Post.findOne({ numericId: potentialId }).select('_id').lean(),
            MarketplacePrompt.findOne({ numericId: potentialId }).select('_id').lean(),
            Insight.findOne({ numericId: potentialId }).select('_id').lean()
        ]);

        if (!existingPost && !existingPrompt && !existingInsight) {
```

- [ ] **Step 2: Add indexInsight to IndexNow**

In `src/lib/indexnow.ts`, add after the `indexBlogPost` function (after line 83):

```typescript
/**
 * Submit a single insight URL
 */
export async function indexInsight(slug: string): Promise<IndexNowResult> {
    return submitToIndexNow([`/insights/${slug}`])
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/id-system.ts src/lib/indexnow.ts
git commit -m "feat(insights): add Insight to ID system and IndexNow"
```

---

### Task 6: Insight Service

**Files:**
- Create: `src/services/insight.service.ts`

- [ ] **Step 1: Create the service**

Create `src/services/insight.service.ts`:

```typescript
import mongoose from 'mongoose';

import dbConnect from '@/lib/db';
import Insight from '@/models/Insight';
import { generateUniqueId } from '@/lib/id-system';
import { indexInsight } from '@/lib/indexnow';
import { extractTags } from '@/lib/tag-extractor';
import { parseSourceUrl } from '@/lib/og-parser';
import { computeRelatedContent } from '@/lib/interlinking';

import type { IInsight } from '@/models/Insight';

export interface InsightCreateData {
    content: string;
    sourceUrl: string;
    categories?: string[];
    tags?: string[];
    status?: IInsight['status'];
    author?: { name: string; avatar?: string; role?: string };
}

export interface InsightUpdateData {
    content?: string;
    sourceUrl?: string;
    categories?: string[];
    tags?: string[];
    status?: IInsight['status'];
}

export interface InsightQueryOptions {
    page?: number;
    limit?: number;
    status?: string | null;
    tag?: string | null;
    search?: string | null;
    afterSlug?: string | null;
}

export class InsightService {
    /**
     * Get all insights with pagination and filtering
     */
    static async getAllInsights(options: InsightQueryOptions) {
        await dbConnect();

        const {
            page = 1,
            limit = 10,
            status,
            tag,
            search,
            afterSlug,
        } = options;

        const query: Record<string, unknown> = {};

        if (status) query.status = status;
        if (tag) query.tags = tag;

        if (search) {
            if (/^\d{6}$/.test(search)) {
                query.numericId = search;
            } else {
                query.$text = { $search: search };
            }
        }

        // Cursor-based pagination for infinite scroll
        if (afterSlug) {
            const ref = await Insight.findOne({ slug: afterSlug }).select('publishedAt').lean();
            if (ref) {
                query.publishedAt = { $lt: ref.publishedAt };
                query.slug = { $ne: afterSlug };
            }
        }

        const skip = afterSlug ? 0 : (page - 1) * limit;

        const [insights, total] = await Promise.all([
            Insight.find(query)
                .sort({ publishedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Insight.countDocuments(query),
        ]);

        return {
            insights: insights.map((insight) => ({
                ...insight,
                id: (insight._id as mongoose.Types.ObjectId).toString(),
            })),
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit,
            },
        };
    }

    /**
     * Get a single insight by slug
     */
    static async getInsightBySlug(slug: string) {
        await dbConnect();
        const insight = await Insight.findOne({ slug }).lean();
        if (!insight) return null;
        return {
            ...insight,
            id: insight._id.toString(),
            _id: insight._id.toString(),
        };
    }

    /**
     * Create a new insight. Orchestrates:
     * 1. Parse source URL (OG data + image)
     * 2. Extract tags from content
     * 3. Generate slug, numericId
     * 4. Save to DB
     * 5. Compute cross-links
     * 6. Submit to IndexNow
     */
    static async createInsight(data: InsightCreateData) {
        await dbConnect();

        // 1. Parse source URL
        const ogData = await parseSourceUrl(data.sourceUrl);

        // 2. Extract tags
        const { tags: extractedTags, autoTags } = await extractTags(data.content);
        const finalTags = data.tags && data.tags.length > 0
            ? [...new Set([...data.tags, ...extractedTags])]
            : extractedTags;

        // 3. Generate slug from source title or content
        const slugBase = ogData.title
            ? ogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60)
            : `insight-${Date.now()}`;

        let slug = slugBase;
        let counter = 2;
        while (await Insight.findOne({ slug })) {
            slug = `${slugBase}-${counter}`;
            counter++;
            if (counter > 100) break;
        }

        // 4. Generate numericId
        const numericId = await generateUniqueId();

        // 5. Build excerpt
        const excerpt = data.content
            .replace(/[⚠️🛠👁🔬⚡️]/g, '')
            .trim()
            .slice(0, 160);

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge';

        const insightData = {
            slug,
            content: data.content,
            excerpt,
            sourceUrl: data.sourceUrl,
            sourceTitle: ogData.title,
            sourceDomain: ogData.domain,
            sourceImage: ogData.image,
            tags: finalTags,
            autoTags,
            categories: data.categories || ['ai', 'tech-insights'],
            author: data.author || {
                name: 'Andrew Altair',
                avatar: '/avatar.jpg',
                role: 'AI Innovator',
            },
            status: data.status || 'published',
            numericId,
            seo: {
                metaTitle: ogData.title
                    ? `${ogData.title.slice(0, 50)} — ინსაითი`
                    : excerpt.slice(0, 60),
                metaDescription: excerpt,
                ogImage: ogData.image || '',
                canonicalUrl: `${siteUrl}/insights/${slug}`,
            },
        };

        const insight = new Insight(insightData);
        await insight.save();

        // 6. Compute cross-links (non-blocking-ish but awaited for data integrity)
        try {
            const related = await computeRelatedContent(insight);
            insight.relatedInsights = related.relatedInsights;
            insight.relatedPosts = related.relatedPosts;
            await insight.save();
        } catch (error) {
            console.error('[InsightService] Cross-linking failed:', error);
        }

        // 7. IndexNow
        if (insight.status === 'published') {
            indexInsight(insight.slug).catch((err) =>
                console.error('[IndexNow] Insight submit failed:', err)
            );
        }

        return {
            ...insight.toObject(),
            id: insight._id.toString(),
        };
    }

    /**
     * Update an existing insight
     */
    static async updateInsight(id: string, data: InsightUpdateData) {
        await dbConnect();

        const insight = await Insight.findById(id);
        if (!insight) return null;

        // If content changed, re-extract tags
        if (data.content && data.content !== insight.content) {
            const { tags: extractedTags, autoTags } = await extractTags(data.content);
            insight.tags = data.tags && data.tags.length > 0
                ? [...new Set([...data.tags, ...extractedTags])]
                : extractedTags;
            insight.autoTags = autoTags;
            insight.content = data.content;
            insight.excerpt = data.content.replace(/[⚠️🛠👁🔬⚡️]/g, '').trim().slice(0, 160);
        }

        // If source URL changed, re-parse
        if (data.sourceUrl && data.sourceUrl !== insight.sourceUrl) {
            const ogData = await parseSourceUrl(data.sourceUrl);
            insight.sourceUrl = data.sourceUrl;
            insight.sourceTitle = ogData.title;
            insight.sourceDomain = ogData.domain;
            insight.sourceImage = ogData.image;
        }

        if (data.categories) insight.categories = data.categories;
        if (data.status) insight.status = data.status;
        if (data.tags) insight.tags = [...new Set([...insight.tags, ...data.tags])];

        await insight.save();

        // Recompute cross-links
        try {
            const related = await computeRelatedContent(insight);
            insight.relatedInsights = related.relatedInsights;
            insight.relatedPosts = related.relatedPosts;
            await insight.save();
        } catch (error) {
            console.error('[InsightService] Cross-linking update failed:', error);
        }

        return {
            ...insight.toObject(),
            id: insight._id.toString(),
        };
    }

    /**
     * Delete an insight and clean up bidirectional links
     */
    static async deleteInsight(id: string) {
        await dbConnect();

        const insight = await Insight.findById(id);
        if (!insight) return null;

        // Remove this insight from others' relatedInsights
        await Insight.updateMany(
            { relatedInsights: insight.slug },
            { $pull: { relatedInsights: insight.slug } }
        );

        await insight.deleteOne();
        return { deleted: true };
    }

    /**
     * Increment views
     */
    static async incrementViews(id: string) {
        await dbConnect();
        await Insight.findByIdAndUpdate(id, { $inc: { views: 1 } });
    }

    /**
     * Get related posts for display on insight page
     */
    static async getRelatedPosts(slugs: string[]) {
        if (!slugs || slugs.length === 0) return [];
        await dbConnect();

        const Post = (await import('@/models/Post')).default;
        const posts = await Post.find({
            slug: { $in: slugs },
            status: 'published',
        })
            .select('slug title excerpt coverImage coverImages categories')
            .lean();

        return posts.map((p: any) => ({
            ...p,
            id: p._id.toString(),
        }));
    }

    /**
     * Get related insights for display
     */
    static async getRelatedInsights(slugs: string[]) {
        if (!slugs || slugs.length === 0) return [];
        await dbConnect();

        const insights = await Insight.find({
            slug: { $in: slugs },
            status: 'published',
        })
            .select('slug content excerpt sourceUrl sourceDomain sourceImage tags publishedAt')
            .lean();

        return insights.map((i: any) => ({
            ...i,
            id: i._id.toString(),
        }));
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/services/insight.service.ts
git commit -m "feat(insights): add InsightService with full CRUD and orchestration"
```

---

### Task 7: API Routes

**Files:**
- Create: `src/app/api/insights/route.ts`
- Create: `src/app/api/insights/[id]/route.ts`
- Create: `src/app/api/insights/[id]/react/route.ts`

- [ ] **Step 1: Create list + create route**

Create `src/app/api/insights/route.ts`:

```typescript
export const dynamic = 'force-dynamic';

import { apiSuccess, apiError, apiPaginated } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';
import { InsightService } from '@/services/insight.service';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const status = searchParams.get('status') || 'published';
        const tag = searchParams.get('tag');
        const search = searchParams.get('search');
        const afterSlug = searchParams.get('afterSlug');

        const { insights, pagination } = await InsightService.getAllInsights({
            page,
            limit,
            status,
            tag,
            search,
            afterSlug,
        });

        return apiPaginated(insights, {
            page: pagination.page,
            limit: pagination.limit,
            total: pagination.total,
        }, 'Insights fetched');
    } catch (error) {
        console.error('[API] GET /api/insights error:', error);
        return apiError(ERROR_CODES.INSIGHT_FETCH_FAILED, 'Failed to fetch insights', 500);
    }
}

export async function POST(request: Request) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const body = await request.json();

        if (!body.content || !body.sourceUrl) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'content and sourceUrl are required', 400);
        }

        const insight = await InsightService.createInsight(body);
        return apiSuccess(insight, 'Insight created', 201);
    } catch (error) {
        console.error('[API] POST /api/insights error:', error);
        return apiError(ERROR_CODES.INSIGHT_CREATE_FAILED, 'Failed to create insight', 500);
    }
}
```

- [ ] **Step 2: Create single insight CRUD route**

Create `src/app/api/insights/[id]/route.ts`:

```typescript
export const dynamic = 'force-dynamic';

import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';
import { InsightService } from '@/services/insight.service';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const insight = await InsightService.getInsightBySlug(id);

        if (!insight) {
            return apiError(ERROR_CODES.INSIGHT_NOT_FOUND, 'Insight not found', 404);
        }

        return apiSuccess(insight, 'Insight fetched');
    } catch (error) {
        console.error('[API] GET /api/insights/[id] error:', error);
        return apiError(ERROR_CODES.INSIGHT_FETCH_FAILED, 'Failed to fetch insight', 500);
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const insight = await InsightService.updateInsight(id, body);

        if (!insight) {
            return apiError(ERROR_CODES.INSIGHT_NOT_FOUND, 'Insight not found', 404);
        }

        return apiSuccess(insight, 'Insight updated');
    } catch (error) {
        console.error('[API] PUT /api/insights/[id] error:', error);
        return apiError(ERROR_CODES.INSIGHT_UPDATE_FAILED, 'Failed to update insight', 500);
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const { id } = await params;
        const result = await InsightService.deleteInsight(id);

        if (!result) {
            return apiError(ERROR_CODES.INSIGHT_NOT_FOUND, 'Insight not found', 404);
        }

        return apiSuccess(result, 'Insight deleted');
    } catch (error) {
        console.error('[API] DELETE /api/insights/[id] error:', error);
        return apiError(ERROR_CODES.INSIGHT_DELETE_FAILED, 'Failed to delete insight', 500);
    }
}
```

- [ ] **Step 3: Create reactions route**

Create `src/app/api/insights/[id]/react/route.ts`:

```typescript
export const dynamic = 'force-dynamic';

import dbConnect from '@/lib/db';
import Insight from '@/models/Insight';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

const VALID_REACTIONS = ['fire', 'love', 'mindblown', 'applause', 'insightful'] as const;

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { reaction } = await request.json();

        if (!reaction || !VALID_REACTIONS.includes(reaction)) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, `Invalid reaction. Valid: ${VALID_REACTIONS.join(', ')}`, 400);
        }

        await dbConnect();

        const insight = await Insight.findByIdAndUpdate(
            id,
            { $inc: { [`reactions.${reaction}`]: 1 } },
            { new: true }
        ).select('reactions').lean();

        if (!insight) {
            return apiError(ERROR_CODES.INSIGHT_NOT_FOUND, 'Insight not found', 404);
        }

        return apiSuccess(insight.reactions, 'Reaction added');
    } catch (error) {
        console.error('[API] POST /api/insights/[id]/react error:', error);
        return apiError(ERROR_CODES.INTERNAL_ERROR, 'Failed to add reaction', 500);
    }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/insights/
git commit -m "feat(insights): add API routes for CRUD and reactions"
```

---

### Task 8: Insights Feed Page + Components

**Files:**
- Create: `src/app/insights/page.tsx`
- Create: `src/components/insights/InsightCard.tsx`
- Create: `src/components/insights/InsightsFeed.tsx`
- Create: `src/components/insights/index.ts`

- [ ] **Step 1: Create InsightCard component**

Create `src/components/insights/InsightCard.tsx`:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TbExternalLink, TbFlame, TbHeart, TbBrain, TbHandClick, TbBulb, TbEye, TbCalendar } from 'react-icons/tb';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface InsightCardProps {
    insight: {
        id: string;
        slug: string;
        content: string;
        excerpt: string;
        sourceUrl: string;
        sourceTitle: string;
        sourceDomain: string;
        sourceImage: string;
        tags: string[];
        publishedAt: string;
        views: number;
        reactions: {
            fire: number;
            love: number;
            mindblown: number;
            applause: number;
            insightful: number;
        };
    };
}

const REACTION_CONFIG = [
    { key: 'fire', icon: TbFlame, label: 'Fire' },
    { key: 'love', icon: TbHeart, label: 'Love' },
    { key: 'mindblown', icon: TbBrain, label: 'Mind Blown' },
    { key: 'applause', icon: TbHandClick, label: 'Applause' },
    { key: 'insightful', icon: TbBulb, label: 'Insightful' },
] as const;

export function InsightCard({ insight }: InsightCardProps) {
    const [reactions, setReactions] = useState(insight.reactions);
    const [isReacting, setIsReacting] = useState(false);

    const handleReaction = async (reaction: string) => {
        if (isReacting) return;
        setIsReacting(true);

        try {
            const res = await fetch(`/api/insights/${insight.id}/react`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reaction }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setReactions(data.data);
                }
            }
        } catch {
            // Silent fail for reactions
        } finally {
            setIsReacting(false);
        }
    };

    const publishedDate = new Date(insight.publishedAt).toLocaleDateString('ka-GE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <article className="bg-card border border-border rounded-2xl overflow-hidden transition-all hover:border-primary/20 hover:shadow-lg">
            {/* Source Image */}
            {insight.sourceImage && (
                <Link href={`/insights/${insight.slug}`}>
                    <div className="relative w-full aspect-[2/1] overflow-hidden">
                        <Image
                            src={insight.sourceImage}
                            alt={insight.sourceTitle || 'Source preview'}
                            fill
                            className="object-cover transition-transform hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 640px"
                        />
                        {/* Domain badge */}
                        <div className="absolute bottom-3 left-3">
                            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">
                                {insight.sourceDomain}
                            </Badge>
                        </div>
                    </div>
                </Link>
            )}

            {/* Content */}
            <div className="p-5 space-y-4">
                {/* Full text */}
                <Link href={`/insights/${insight.slug}`} className="block">
                    <div className="text-foreground whitespace-pre-line leading-relaxed text-[15px]">
                        {insight.content}
                    </div>
                </Link>

                {/* Tags */}
                {insight.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {insight.tags.slice(0, 6).map((tag) => (
                            <Link key={tag} href={`/insights?tag=${tag}`}>
                                <Badge
                                    variant="outline"
                                    className="text-xs hover:bg-primary/10 transition-colors cursor-pointer"
                                >
                                    #{tag}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Source link */}
                <a
                    href={insight.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                    <TbExternalLink className="w-4 h-4 shrink-0" />
                    <span className="truncate">{insight.sourceTitle || insight.sourceUrl}</span>
                </a>

                {/* Footer: date, views, reactions */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <TbCalendar className="w-3.5 h-3.5" />
                            {publishedDate}
                        </span>
                        <span className="flex items-center gap-1">
                            <TbEye className="w-3.5 h-3.5" />
                            {insight.views}
                        </span>
                    </div>

                    {/* Reactions */}
                    <div className="flex items-center gap-1">
                        {REACTION_CONFIG.map(({ key, icon: Icon }) => {
                            const count = reactions[key as keyof typeof reactions];
                            return (
                                <button
                                    key={key}
                                    onClick={() => handleReaction(key)}
                                    disabled={isReacting}
                                    className={cn(
                                        'flex items-center gap-0.5 px-1.5 py-1 rounded-full text-xs transition-colors',
                                        'hover:bg-primary/10 text-muted-foreground hover:text-primary',
                                        count > 0 && 'text-primary/70'
                                    )}
                                    aria-label={`React with ${key}`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {count > 0 && <span>{count}</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </article>
    );
}
```

- [ ] **Step 2: Create InsightsFeed component**

Create `src/components/insights/InsightsFeed.tsx`:

```tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { TbLoader2 } from 'react-icons/tb';
import { InsightCard } from './InsightCard';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Insight {
    id: string;
    slug: string;
    content: string;
    excerpt: string;
    sourceUrl: string;
    sourceTitle: string;
    sourceDomain: string;
    sourceImage: string;
    tags: string[];
    publishedAt: string;
    views: number;
    reactions: {
        fire: number;
        love: number;
        mindblown: number;
        applause: number;
        insightful: number;
    };
}

interface InsightsFeedProps {
    initialInsights: Insight[];
    initialHasMore: boolean;
    activeTag?: string | null;
    allTags?: string[];
}

export function InsightsFeed({ initialInsights, initialHasMore, activeTag, allTags = [] }: InsightsFeedProps) {
    const [insights, setInsights] = useState<Insight[]>(initialInsights);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const observerRef = useRef<HTMLDivElement>(null);

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore || insights.length === 0) return;
        setIsLoading(true);

        try {
            const lastSlug = insights[insights.length - 1].slug;
            const params = new URLSearchParams({
                afterSlug: lastSlug,
                limit: '10',
                status: 'published',
            });
            if (activeTag) params.set('tag', activeTag);

            const res = await fetch(`/api/insights?${params}`);
            const data = await res.json();

            if (data.success) {
                const newInsights = data.data.items;
                setInsights((prev) => [...prev, ...newInsights]);
                setHasMore(data.data.pagination.hasNextPage);
            }
        } catch {
            // Silent fail
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, hasMore, insights, activeTag]);

    // Intersection observer for infinite scroll
    useEffect(() => {
        const target = observerRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { rootMargin: '200px' }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [loadMore]);

    return (
        <div className="space-y-6">
            {/* Tag filter */}
            {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <a href="/insights">
                        <Badge
                            variant={!activeTag ? 'default' : 'outline'}
                            className="cursor-pointer"
                        >
                            All
                        </Badge>
                    </a>
                    {allTags.map((tag) => (
                        <a key={tag} href={`/insights?tag=${tag}`}>
                            <Badge
                                variant={activeTag === tag ? 'default' : 'outline'}
                                className="cursor-pointer"
                            >
                                #{tag}
                            </Badge>
                        </a>
                    ))}
                </div>
            )}

            {/* Feed */}
            <div className="flex flex-col gap-6 max-w-2xl mx-auto">
                {insights.map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={observerRef} className="flex justify-center py-8">
                {isLoading && (
                    <TbLoader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                )}
                {!hasMore && insights.length > 0 && (
                    <p className="text-sm text-muted-foreground">All insights loaded</p>
                )}
            </div>
        </div>
    );
}
```

- [ ] **Step 3: Create barrel export**

Create `src/components/insights/index.ts`:

```typescript
export { InsightCard } from './InsightCard';
export { InsightsFeed } from './InsightsFeed';
```

- [ ] **Step 4: Create the insights feed page**

Create `src/app/insights/page.tsx`:

```tsx
import { Metadata } from 'next';
import { InsightsFeed } from '@/components/insights';
import { InsightService } from '@/services/insight.service';

export const metadata: Metadata = {
    title: 'Insights | Andrew Altair',
    description: 'მოკლე ანალიტიკა და კომენტარები ხელოვნური ინტელექტისა და ტექნოლოგიების სამყაროდან.',
    openGraph: {
        title: 'Insights | Andrew Altair',
        description: 'მოკლე ანალიტიკა და კომენტარები ხელოვნური ინტელექტისა და ტექნოლოგიების სამყაროდან.',
        type: 'website',
    },
};

export default async function InsightsPage({
    searchParams,
}: {
    searchParams: Promise<{ tag?: string }>;
}) {
    const { tag } = await searchParams;

    const { insights, pagination } = await InsightService.getAllInsights({
        status: 'published',
        limit: 10,
        tag: tag || null,
    });

    // Get popular tags for filter
    const allInsights = await InsightService.getAllInsights({
        status: 'published',
        limit: 100,
    });

    const tagCounts: Record<string, number> = {};
    for (const insight of allInsights.insights) {
        for (const t of (insight.tags || [])) {
            tagCounts[t] = (tagCounts[t] || 0) + 1;
        }
    }

    const popularTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([t]) => t);

    const serializedInsights = JSON.parse(JSON.stringify(insights));

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-10 max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-foreground mb-3">
                        Insights
                    </h1>
                    <p className="text-muted-foreground">
                        მოკლე ანალიტიკა და კომენტარები AI სამყაროდან
                    </p>
                </div>

                <InsightsFeed
                    initialInsights={serializedInsights}
                    initialHasMore={pagination.page < pagination.pages}
                    activeTag={tag}
                    allTags={popularTags}
                />
            </div>
        </main>
    );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/insights/ src/app/insights/page.tsx
git commit -m "feat(insights): add feed page with InsightCard and infinite scroll"
```

---

### Task 9: Individual Insight Page

**Files:**
- Create: `src/app/insights/[slug]/page.tsx`
- Create: `src/components/insights/InsightPageClient.tsx`
- Create: `src/components/insights/InsightRelatedPosts.tsx`

- [ ] **Step 1: Create InsightRelatedPosts component**

Create `src/components/insights/InsightRelatedPosts.tsx`:

```tsx
import Link from 'next/link';
import Image from 'next/image';

interface RelatedPost {
    slug: string;
    title: string;
    excerpt: string;
    coverImage?: string;
    coverImages?: { horizontal?: string };
    categories: string[];
}

interface InsightRelatedPostsProps {
    posts: RelatedPost[];
}

export function InsightRelatedPosts({ posts }: InsightRelatedPostsProps) {
    if (posts.length === 0) return null;

    return (
        <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
                დაწვრილებით ამ თემაზე
            </h3>
            <div className="grid gap-3">
                {posts.map((post) => {
                    const image = post.coverImages?.horizontal || post.coverImage;
                    return (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="flex gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors"
                        >
                            {image && (
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                                    <Image
                                        src={image}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                </div>
                            )}
                            <div className="min-w-0">
                                <h4 className="font-medium text-sm text-foreground line-clamp-2">
                                    {post.title}
                                </h4>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                    {post.excerpt}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
```

- [ ] **Step 2: Create InsightPageClient component**

Create `src/components/insights/InsightPageClient.tsx`:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TbExternalLink, TbFlame, TbHeart, TbBrain, TbHandClick, TbBulb, TbEye, TbCalendar, TbArrowLeft, TbShare } from 'react-icons/tb';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InsightRelatedPosts } from './InsightRelatedPosts';

interface InsightPageClientProps {
    insight: {
        id: string;
        slug: string;
        content: string;
        sourceUrl: string;
        sourceTitle: string;
        sourceDomain: string;
        sourceImage: string;
        tags: string[];
        publishedAt: string;
        views: number;
        reactions: {
            fire: number;
            love: number;
            mindblown: number;
            applause: number;
            insightful: number;
        };
        author: {
            name: string;
            avatar?: string;
            role?: string;
        };
    };
    relatedPosts: {
        slug: string;
        title: string;
        excerpt: string;
        coverImage?: string;
        coverImages?: { horizontal?: string };
        categories: string[];
    }[];
    relatedInsights: {
        id: string;
        slug: string;
        content: string;
        excerpt: string;
        sourceUrl: string;
        sourceDomain: string;
        sourceImage: string;
        tags: string[];
        publishedAt: string;
        views: number;
        reactions: {
            fire: number;
            love: number;
            mindblown: number;
            applause: number;
            insightful: number;
        };
    }[];
}

const REACTION_CONFIG = [
    { key: 'fire', icon: TbFlame, label: '🔥' },
    { key: 'love', icon: TbHeart, label: '❤️' },
    { key: 'mindblown', icon: TbBrain, label: '🤯' },
    { key: 'applause', icon: TbHandClick, label: '👏' },
    { key: 'insightful', icon: TbBulb, label: '💡' },
] as const;

export function InsightPageClient({ insight, relatedPosts, relatedInsights }: InsightPageClientProps) {
    const [reactions, setReactions] = useState(insight.reactions);
    const [isReacting, setIsReacting] = useState(false);

    const handleReaction = async (reaction: string) => {
        if (isReacting) return;
        setIsReacting(true);

        try {
            const res = await fetch(`/api/insights/${insight.id}/react`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reaction }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success) setReactions(data.data);
            }
        } catch {
            // Silent fail
        } finally {
            setIsReacting(false);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            await navigator.share({ title: insight.sourceTitle, url });
        } else {
            await navigator.clipboard.writeText(url);
        }
    };

    const publishedDate = new Date(insight.publishedAt).toLocaleDateString('ka-GE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Back link */}
                <Link
                    href="/insights"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <TbArrowLeft className="w-4 h-4" />
                    Insights
                </Link>

                {/* Source image */}
                {insight.sourceImage && (
                    <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden mb-6">
                        <Image
                            src={insight.sourceImage}
                            alt={insight.sourceTitle || 'Source preview'}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 640px"
                            priority
                        />
                        <div className="absolute bottom-3 left-3">
                            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                                {insight.sourceDomain}
                            </Badge>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="text-foreground whitespace-pre-line leading-relaxed text-[16px] mb-6">
                    {insight.content}
                </div>

                {/* Source link */}
                <a
                    href={insight.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex items-center gap-2 p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors mb-6"
                >
                    <TbExternalLink className="w-5 h-5 text-primary shrink-0" />
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                            {insight.sourceTitle || 'Source'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {insight.sourceDomain}
                        </p>
                    </div>
                </a>

                {/* Tags */}
                {insight.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {insight.tags.map((tag) => (
                            <Link key={tag} href={`/insights?tag=${tag}`}>
                                <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">
                                    #{tag}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Meta + Reactions */}
                <div className="flex items-center justify-between py-4 border-y border-border mb-8">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <TbCalendar className="w-4 h-4" />
                            {publishedDate}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <TbEye className="w-4 h-4" />
                            {insight.views}
                        </span>
                        <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-primary transition-colors" aria-label="Share">
                            <TbShare className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {REACTION_CONFIG.map(({ key, icon: Icon }) => {
                            const count = reactions[key as keyof typeof reactions];
                            return (
                                <button
                                    key={key}
                                    onClick={() => handleReaction(key)}
                                    disabled={isReacting}
                                    className={cn(
                                        'flex items-center gap-1 px-2.5 py-1.5 rounded-full text-sm transition-colors',
                                        'hover:bg-primary/10 text-muted-foreground hover:text-primary',
                                        count > 0 && 'bg-primary/5 text-primary/80'
                                    )}
                                    aria-label={`React with ${key}`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {count > 0 && <span className="text-xs">{count}</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Related articles */}
                <InsightRelatedPosts posts={relatedPosts} />

                {/* Related insights */}
                {relatedInsights.length > 0 && (
                    <section className="mt-8 space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">
                            მსგავსი ინსაითები
                        </h3>
                        <div className="grid gap-3">
                            {relatedInsights.map((related) => (
                                <Link
                                    key={related.slug}
                                    href={`/insights/${related.slug}`}
                                    className="p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors"
                                >
                                    <p className="text-sm text-foreground line-clamp-3">
                                        {related.excerpt}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {related.sourceDomain}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Author */}
                <div className="flex items-center gap-3 mt-10 pt-6 border-t border-border">
                    {insight.author.avatar && (
                        <Image
                            src={insight.author.avatar}
                            alt={insight.author.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    )}
                    <div>
                        <p className="text-sm font-medium text-foreground">{insight.author.name}</p>
                        {insight.author.role && (
                            <p className="text-xs text-muted-foreground">{insight.author.role}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
```

- [ ] **Step 3: Create the individual insight page**

Create `src/app/insights/[slug]/page.tsx`:

```tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { InsightPageClient } from '@/components/insights/InsightPageClient';
import { InsightService } from '@/services/insight.service';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    try {
        const insight = await InsightService.getInsightBySlug(slug);
        if (!insight) return { title: 'Insight Not Found | Andrew Altair' };

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge';

        let imageUrl = insight.sourceImage;
        if (imageUrl && !imageUrl.startsWith('http')) {
            if (imageUrl.includes('/uploads/')) {
                imageUrl = `${siteUrl}${imageUrl}`;
            }
        }
        if (!imageUrl) {
            imageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(insight.excerpt.slice(0, 60))}&type=insight`;
        }

        return {
            title: `${insight.seo?.metaTitle || insight.excerpt.slice(0, 60)} | Andrew Altair`,
            description: insight.seo?.metaDescription || insight.excerpt,
            openGraph: {
                title: insight.seo?.metaTitle || insight.excerpt.slice(0, 60),
                description: insight.seo?.metaDescription || insight.excerpt,
                url: `${siteUrl}/insights/${slug}`,
                images: [{ url: imageUrl }],
                type: 'article',
                siteName: 'Andrew Altair',
                authors: [insight.author?.name || 'Andrew Altair'],
                publishedTime: insight.publishedAt as unknown as string,
            },
            twitter: {
                card: 'summary_large_image',
                title: insight.seo?.metaTitle || insight.excerpt.slice(0, 60),
                description: insight.seo?.metaDescription || insight.excerpt,
                images: [imageUrl],
            },
            alternates: {
                canonical: insight.seo?.canonicalUrl || `${siteUrl}/insights/${slug}`,
            },
        };
    } catch (error) {
        console.error(`[generateMetadata] Error for /insights/${slug}:`, error);
        return { title: 'Andrew Altair | Insights' };
    }
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    try {
        const rawInsight = await InsightService.getInsightBySlug(slug);
        if (!rawInsight) return notFound();

        // Increment views
        InsightService.incrementViews(rawInsight._id).catch(() => {});

        // Get related content
        const [relatedPosts, relatedInsights] = await Promise.all([
            InsightService.getRelatedPosts(rawInsight.relatedPosts || []),
            InsightService.getRelatedInsights(rawInsight.relatedInsights || []),
        ]);

        const insight = JSON.parse(JSON.stringify({
            ...rawInsight,
            views: (rawInsight.views || 0) + 1,
        }));

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://andrewaltair.ge';

        let imageUrl = insight.sourceImage;
        if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = `${siteUrl}${imageUrl}`;
        }

        // Schema.org: SocialMediaPosting
        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'SocialMediaPosting',
            headline: insight.seo?.metaTitle || insight.excerpt.slice(0, 60),
            text: insight.content,
            image: imageUrl ? [imageUrl] : [],
            datePublished: insight.publishedAt,
            dateModified: insight.updatedAt || insight.publishedAt,
            author: {
                '@type': 'Person',
                name: insight.author?.name || 'Andrew Altair',
                url: siteUrl,
            },
            publisher: {
                '@type': 'Organization',
                name: 'Andrew Altair',
                logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
            },
            sharedContent: {
                '@type': 'WebPage',
                url: insight.sourceUrl,
                headline: insight.sourceTitle,
            },
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${siteUrl}/insights/${slug}`,
            },
        };

        const breadcrumbLd = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'Insights', item: `${siteUrl}/insights` },
                { '@type': 'ListItem', position: 3, name: insight.seo?.metaTitle || 'Insight', item: `${siteUrl}/insights/${slug}` },
            ],
        };

        return (
            <article>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
                />

                <InsightPageClient
                    insight={insight}
                    relatedPosts={JSON.parse(JSON.stringify(relatedPosts))}
                    relatedInsights={JSON.parse(JSON.stringify(relatedInsights))}
                />
            </article>
        );
    } catch (error) {
        console.error(`[InsightPage] Error rendering /insights/${slug}:`, error);
        return notFound();
    }
}
```

- [ ] **Step 4: Update barrel export**

In `src/components/insights/index.ts`, add:

```typescript
export { InsightCard } from './InsightCard';
export { InsightsFeed } from './InsightsFeed';
export { InsightPageClient } from './InsightPageClient';
export { InsightRelatedPosts } from './InsightRelatedPosts';
```

- [ ] **Step 5: Commit**

```bash
git add src/app/insights/[slug]/ src/components/insights/InsightPageClient.tsx src/components/insights/InsightRelatedPosts.tsx src/components/insights/index.ts
git commit -m "feat(insights): add individual insight page with SEO and cross-links"
```

---

### Task 10: Verify & Test

- [ ] **Step 1: Verify the build compiles**

```bash
npx next build
```

Expected: No TypeScript errors, all pages compile.

- [ ] **Step 2: Test manually — create an insight via API**

Start the dev server, then create an insight using curl or the admin panel:

```bash
curl -X POST http://localhost:3000/api/insights \
  -H "Content-Type: application/json" \
  -H "Cookie: <admin-session-cookie>" \
  -d '{
    "content": "⚠️ ილონ მასკის ახალი სარჩელი სემ ოლტმენის წინააღმდეგ 150 მილიარდ დოლარზეა...",
    "sourceUrl": "https://the-decoder.com/musk-updates-openai-lawsuit-to-redirect-potential-150b-in-damages-to-the-nonprofit-foundation/",
    "categories": ["ai", "tech-industry"]
  }'
```

Expected: 201 response with auto-generated slug, tags, sourceImage, related content.

- [ ] **Step 3: Verify the feed page**

Navigate to `http://localhost:3000/insights` — should show the created insight with source image, tags, reactions.

- [ ] **Step 4: Verify individual page**

Navigate to `http://localhost:3000/insights/<slug>` — should show full content, schema.org markup (check in DevTools), related posts section.

- [ ] **Step 5: Verify tag filtering**

Click a tag in the feed — URL should change to `/insights?tag=<tag>`, feed should filter.

- [ ] **Step 6: Commit final state**

```bash
git add -A
git commit -m "feat(insights): complete insights blog system"
```
