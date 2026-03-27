# Homepage Redesign: "The Digital Curator"

Apply the Luminous Interface design system from the Stitch template to andrewaltair.ge homepage, using the template's visual language with the site's real content and data models.

## Design System

### Color Palette (MD3-based)

Replace current Indigo+Cyan palette with full Material Design 3 token set. Support both light and dark modes.

**Light mode:**

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#3525cd` | CTAs, active nav, links |
| `primary-container` | `#4f46e5` | Gradient endpoint for CTAs |
| `primary-fixed` | `#e2dfff` | Callout backgrounds, bot icon BG |
| `primary-fixed-dim` | `#c3c0ff` | Hover states |
| `on-primary` | `#ffffff` | Text on primary |
| `on-primary-fixed` | `#0f0069` | Text on primary-fixed |
| `secondary` | `#8127cf` | Secondary actions, links |
| `secondary-container` | `#9c48ea` | Secondary gradient endpoint |
| `secondary-fixed` | `#f0dbff` | Secondary callout backgrounds |
| `on-secondary-fixed` | `#2c0051` | Text on secondary-fixed |
| `tertiary` | `#7b3300` | Tertiary accent |
| `tertiary-fixed` | `#ffdbca` | Perspective Tags background |
| `on-tertiary-fixed` | `#341100` | Perspective Tags text |
| `surface` | `#f8f9ff` | Page base background |
| `surface-container-low` | `#eff4ff` | Secondary areas (bots section, quick access cards) |
| `surface-container-lowest` | `#ffffff` | Interactive cards ("lifted" effect) |
| `surface-container` | `#e5eeff` | Input backgrounds, chips |
| `surface-container-high` | `#dce9ff` | Elevated surfaces |
| `surface-variant` | `#d3e4fe` | Glassmorphism base (at 60% opacity) |
| `on-surface` | `#0b1c30` | Primary text |
| `on-surface-variant` | `#464555` | Secondary text, labels |
| `outline` | `#777587` | Placeholder text, disabled |
| `outline-variant` | `#c7c4d8` | Ghost borders (at 15% opacity) |
| `inverse-surface` | `#213145` | Dark surface blocks |
| `inverse-on-surface` | `#eaf1ff` | Text on dark blocks |
| `error` | `#ba1a1a` | Error states |
| `success` | `#10b981` | Success, free tier badge (keep existing) |
| `warning` | `#f59e0b` | Warning states (keep existing) |

**Dark mode:** Derive from the same token structure. Invert surface hierarchy: `surface` becomes dark (`#0f1729`), `on-surface` becomes light (`#e2e8f0`). Primary and secondary colors shift to lighter variants for contrast.

### Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display/Headline | Manrope | 700-800 | Hero titles, section headings |
| Body/Label | Inter | 400-600 | Paragraphs, labels, metadata |
| Georgian | Noto Sans Georgian | 400-700 | All Georgian text (fallback chain) |
| Monospace | JetBrains Mono | 400 | Code snippets (keep existing) |

Font family chains:
- `font-headline`: `Manrope, Noto Sans Georgian, sans-serif`
- `font-body`: `Inter, Noto Sans Georgian, sans-serif`

Georgian text requires `line-height: 1.6` minimum.

### Visual Principles

1. **No-Line Rule:** No 1px solid borders for section separation. Use color shifts between surface tokens or whitespace. Exception: ghost borders at 15% opacity of `outline-variant` when card sits on same-color background.
2. **Tonal Layering:** Elevation via color temperature, not drop shadows. Cards on `surface-container-lowest` (#ffffff) placed on `surface-container-low` (#eff4ff) background.
3. **Glassmorphism:** For top nav and floating elements. `backdrop-filter: blur(20px)` with `bg-white/60` (light) or `bg-slate-900/60` (dark).
4. **Gradient CTAs:** Primary buttons use `linear-gradient(135deg, primary, primary-container)`. Soft glow shadow on hover.
5. **Perspective Tags:** Custom chip using `tertiary-fixed` bg + `on-tertiary-fixed` text. Used for article categories, "New" badges.
6. **Ambient Shadows:** When needed: `box-shadow: 0 12px 32px -4px rgba(11, 28, 48, 0.06)`.
7. **Icons Only:** Use Material Symbols Outlined for all iconography. No emoji anywhere in the UI.
8. **Hover Effects:** Cards lift with `-translate-y-1` and subtle shadow on hover. Icon containers rotate 6deg on hover (bots section).

## Navigation

### Desktop: Glassmorphism Top Nav

Fixed top, full-width. `bg-white/60 backdrop-blur-xl` (light) / `bg-slate-900/60 backdrop-blur-xl` (dark).

**Left:** Logo "Altair AI" (font-headline, bold) + main nav links.
**Right:** Search input (rounded, surface-container-low bg) + notifications icon + settings icon + user avatar.

Main nav items (visible):
- **Blog** (`/blog`)
- **Prompts** (`/prompts`)
- **Bots** (`/bots`)
- **Services** (`/services`)
- **Explore** (dropdown)

Explore dropdown contains:
- Videos (`/videos`)
- Tools (`/tools`)
- Encyclopedia (`/encyclopedia`)
- Lessons (`/lessons`)
- About (`/about`)

Active link: `text-primary font-semibold border-b-2 border-primary`. Inactive: `text-on-surface-variant hover:text-primary`.

### Mobile: Pill-shaped Bottom Nav

Fixed bottom, centered. `bg-white/90 backdrop-blur-xl rounded-full` with ambient shadow. 85% width, max-w-sm.

4 nav items with Material Symbols icons:
- **Home** (`home`, filled) -- active state: `bg-primary rounded-full text-white`
- **Explore** (`auto_awesome`)
- **Analytics/Insights** (`insights`)
- **Profile** (`person`)

Mobile top: simplified header with avatar + name + hamburger menu icon.

## Homepage Sections

All data fetched server-side (Server Components). Page uses ISR with `revalidate: 3600`.

### Section 1: Hero (8/12) + Quick Access (4/12)

**Layout:** `grid grid-cols-12 gap-8`. Hero spans `col-span-12 lg:col-span-8`. Quick Access spans `col-span-12 lg:col-span-4`.

**Hero block:**
- Full-height image background from featured post cover (HeroCarousel rotates 5 featured posts)
- Gradient overlay: `bg-gradient-to-t from-black/80 via-black/20 to-transparent`
- Content overlay (z-10): Featured badge + carousel dots, headline, bio text, 2 CTA buttons, AI Tool Tags
- Primary CTA: gradient button "read blog" linking to `/blog`
- Secondary CTA: glass button with play icon "watch videos" linking to `/videos`
- AI Tool Tags (HeroTags component): interactive category filters (LLMs, Visual, Dev, Audio, Automation)
- Image hover: `scale-105` with 700ms transition

**Quick Access grid:**
- `grid grid-cols-2 gap-4` inside the 4/12 column
- Top card spans 2 columns (featured promo, e.g., AI Quiz) with Perspective Tag "New"
- 4 smaller cards: Mystic AI, Encyclopedia, AI Tools, Prompt Builder
- All cards: `bg-surface-container-low rounded-xl` with hover transition to `bg-white` + ghost border
- Each card has Material Symbols icon + title + subtitle label

**Data source:** `PostService.getPublishedPosts()` for hero carousel (5 featured). Quick Access cards are static links to site sections.

### Section 2: Popular Prompts (horizontal scroll)

**Layout:** Section with header row (title + "view all" link) + horizontal scrollable container.

**Header:** "Popular Prompts" (headline-md, font-black) + subtitle + "View All" link (text-primary, arrow icon).

**Cards:** `min-w-[280px]` each, horizontal scroll with `overflow-x-auto hide-scrollbar`. Each card:
- Status dots (colored by category)
- Copy icon (top-right, appears on hover as text-primary)
- Prompt text (truncated, 2 lines)
- Bottom row: category label + download count (uppercase, tracking-widest)
- Price line: "Free" (text-success) or "X GEL" (text-primary/secondary)
- Hover: `-translate-y-1` lift

**Data source:** `MarketplacePromptService` or direct fetch. 8 latest published prompts. Fields: `title`, `promptText`, `category`, `downloads`, `price.amount`, `price.isFree`.

### Section 3: Latest Articles (3-column grid)

**Layout:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`.

**Each article card:**
- `aspect-video` image container with `rounded-xl overflow-hidden`
- Perspective Tag positioned `absolute top-3 right-3` showing post category
- Image hover: `scale-110` with 500ms transition
- Below image: metadata row (date + reading time + views), title (xl font-bold, hover text-primary), excerpt (2-line clamp)

**Data source:** `PostService.getPublishedPosts()`. 3 latest posts (separate from hero). Fields: `title`, `excerpt`, `coverImage.horizontal`, `category`, `publishedAt`, `readingTime`, `views`.

### Section 4: AI Bots (tinted background section)

**Layout:** Full-width section with `bg-surface-container-low rounded-2xl p-10`.

**Header:** Title + subtitle.

**Grid:** `grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6`.

**Each bot card:** White bg, rounded-xl, centered layout:
- Icon container: colored rounded-2xl (primary-fixed, secondary-fixed, tertiary-fixed, etc.) with Material Symbols icon
- Bot name (font-bold)
- Category label (uppercase, tracking)
- Tier badge: "Free" (text-success) or "Premium" (text-secondary)
- Hover: `shadow-xl shadow-primary/5`, icon container rotates 6deg

**Last card:** "Custom / Create Own" with plus icon on slate bg.

**Data source:** Featured bots array (currently hardcoded in HubLayout). Fields: `name`, `category`, `tier`, `icon`, `rating`, `downloads`.

### Section 5: Services (2-column feature blocks)

**Layout:** `grid grid-cols-1 md:grid-cols-2 gap-8`.

**Left block:** `bg-primary` gradient (primary to primary-container), white text. Decorative blurred circle top-right. Material Symbols icon, title, description with real pricing, white CTA button.

**Right block:** `bg-secondary` gradient (secondary to secondary-container), same structure.

**Services shown:**
- AI Consultation (150 GEL/hour) -- primary block
- AI Training (500 GEL/team) -- secondary block

**Data source:** Static service data from HubLayout. Links to `/services`.

### Section 6: Video Tutorials (horizontal scroll)

**Layout:** Same pattern as prompts -- header + horizontal scroll.

**Each video card:** `min-w-[320px]`:
- `aspect-video rounded-xl overflow-hidden` with thumbnail
- Play button overlay: glassmorphism circle (`bg-white/20 backdrop-blur-md rounded-full border-white/40`)
- Duration badge: `absolute bottom-2 right-2 bg-black/60` text
- Below: title (font-bold, 2-line clamp) + category/views metadata
- Hover: image `scale-105`

**Data source:** Video model, 8 latest. YouTube thumbnail from video ID. Fields: `title`, `videoId`, `category`, `views`, `duration`.

### Section 7: Social Proof + Footer

**Social Proof:** Centered row of subscriber counts. Each: large number (font-black, alternating primary/secondary color) + platform label (uppercase, small).

Platforms: YouTube 25K, Instagram 15K, Facebook 10K, TikTok 8K, Telegram 5K (from brand.ts stats).

**Footer:** `bg-slate-50 border-t border-slate-100` (light) / dark equivalent.

Grid: `grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12`.
- Column 1 (span-2): Brand name "Altair Intelligence" + description + social icon links
- Column 2: Product (Blog, Prompts, Bots)
- Column 3: Resources (Tools, Encyclopedia, Tutorials)
- Column 4: Company (About, Services, Contact)
- Column 5: Legal (Terms, Privacy)

Bottom bar: copyright + language switcher (English / Georgian).

## Responsive Behavior

**Mobile (< 768px):**
- Hero: single column, full-width hero image, Quick Access grid below as 2-col
- Articles: single column stack
- Bots: 2-col grid
- Services: single column stack
- Top nav replaced by simplified header + hamburger
- Bottom pill nav visible

**Tablet (768-1024px):**
- Hero: still single column or 8/4 split
- Articles: 2-col grid
- Bots: 4-col grid
- Full top nav visible

**Desktop (> 1024px):**
- Full 12-col grid layouts
- Max content width: 1600px centered
- All horizontal scrolls show 3-4 items

## Files to Modify

### New/Modified globals.css
- Replace CSS custom properties with MD3 token values
- Add dark mode token overrides
- Add Manrope to font imports
- Keep existing animations that still apply (fade-in, slide-in, hover-lift)
- Remove unused neon/cyberpunk utilities

### New/Modified tailwind.config
- Update color tokens to MD3 palette
- Add font-headline, font-body families with Manrope/Inter
- Update border-radius values per design system

### New/Modified Components
- `components/layout/Header.tsx` -- glassmorphism top nav with Explore dropdown
- `components/layout/Footer.tsx` -- full footer from template design
- `components/layout/MobileNav.tsx` -- pill-shaped bottom nav (new)
- `components/home/HeroSection.tsx` -- redesigned hero with 8/4 grid
- `components/home/QuickAccessGrid.tsx` -- side panel cards (new)
- `components/home/PromptsSection.tsx` -- horizontal scroll prompt cards (new)
- `components/home/ArticlesSection.tsx` -- 3-col article grid (new)
- `components/home/BotsSection.tsx` -- tinted background bots grid (new)
- `components/home/ServicesSection.tsx` -- 2-col gradient blocks (new)
- `components/home/VideosSection.tsx` -- horizontal scroll videos (new)
- `components/home/SocialProof.tsx` -- subscriber counts (new)
- `components/ui/PerspectiveTag.tsx` -- reusable tag component (new)
- `components/ui/GradientButton.tsx` -- primary CTA button (new)

### Modified Pages
- `app/page.tsx` -- compose new sections in order, remove HubLayout/HomeLayoutSwitcher
- `app/layout.tsx` -- update font imports (add Manrope), update theme script for new tokens

### Keep Unchanged
- All data models (Post, Video, MarketplacePrompt)
- All services
- Auth system
- API routes
- Admin pages
- Other page routes (blog, videos, bots, etc.)
- HeroCarousel.tsx, HeroTags.tsx (adapt styling only)
- NewsletterForm.tsx (removed from homepage, keep component for other pages if needed)

## What NOT to Do

- No emoji anywhere in the UI -- Material Symbols icons only
- No 1px solid borders for section separation
- No pure black (#000000) text -- use on-surface (#0b1c30)
- No hardcoded Tailwind palette colors (blue-500, etc.) -- use semantic tokens
- No inline styles
- No new data models or API routes
- No changes to business logic or services
