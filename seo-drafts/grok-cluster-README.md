# Grok Content Cluster — SEO Boost Drafts

**Why this exists:** GSC export 2026-05-12 showed Georgian keyword `გროკი` driving **679 impressions** with only 0.15% CTR at position ~8. Existing post `/blog/-generali-groki-pentagonis-akhali-tvini` ranks but doesn't convert. Strategy: 3-post cluster to dominate top results.

**Workflow:**
1. Open admin at `/admin/posts`
2. For each draft below, copy → paste into the editor
3. Set the manual `relatedPosts` field on each post to the slugs of the other two (cluster wiring)
4. Update existing post `-generali-groki-pentagonis-akhali-tvini`:
   - Change `title` and `seo.metaDescription` to start with `გროკი` (currently buried)
   - Append a 5-question FAQ section (drafted below in `existing-post-update.md`)
   - Add 4 internal links inside body: 2 to new cluster posts, 1 to `/tools`, 1 to `/prompt-builder`
   - Save (auto-touches `updatedAt` → triggers visible "განახლებულია" banner per BlogPostClient.tsx)
5. After all three are live:
   - In GSC, open URL Inspection for each → "Request Indexing"
   - Update sitemap if it doesn't include the new posts automatically

**Files in this folder:**
- `existing-post-update.md` — what to change on the existing Pentagon/Grok post
- `post-1-grokis-akhali-shesadzleblobebi-2026.md` — NEW pillar overview
- `post-2-grok-vs-claude-vs-chatgpt.md` — NEW comparison post

**Targets:**
- 14 days post-publish: expect `გროკი` CTR climb from 0.15% → 2-5%, position → top-5
- 30 days: expect new posts indexed and ranking for long-tail Grok queries
