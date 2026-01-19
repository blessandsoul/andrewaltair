# 🏗️ DESIGN SPEC: AI 2026 Article — "კაცობრიობის დიდი ფილტრი"

**Target Audience:** Frontend Developer / AI Coder  
**Source File:** `deep.json`  
**Goal:** Render an aggressive, futuristic encyclopedia article that feels like a manifesto, not a blog post.

---

## 1. GENERAL AESTHETIC ("The Vibe")

| Property | Value |
|----------|-------|
| **Theme** | Dark Mode Only — Apocalyptic Tech |
| **Background** | Deep Black (`#0a0a0f`) with subtle red vein gradients |
| **Primary Accent** | Blood Red (`#ff2d2d`) — danger, urgency |
| **Secondary Accent** | Electric Blue (`#00d4ff`) — tech, AI |
| **Tertiary Accent** | Gold (`#ffd700`) — elite, architect status |
| **Typography (Headings)** | `Space Grotesk` or `Bebas Neue` — Bold, Uppercase |
| **Typography (Body)** | `Inter` — 18px, Line-height 1.7 |
| **Typography (Code)** | `JetBrains Mono` |
| **Effects** | Glassmorphism cards, inner red glows, grain overlay |

---

## 2. PAGE STRUCTURE

```
┌─────────────────────────────────────────────────┐
│                   HERO SECTION                  │
│  (Full-screen, Parallax BG, Title + Reading Time)│
├─────────────────────────────────────────────────┤
│              TABLE OF CONTENTS (TOC)            │
│         (Sticky sidebar on desktop)             │
├─────────────────────────────────────────────────┤
│                   INTRO SECTION                 │
│        (type: "intro" — aggressive hook)        │
├─────────────────────────────────────────────────┤
│              CONTENT SECTIONS (1-9)             │
│     (type: "section" — each with callouts)      │
├─────────────────────────────────────────────────┤
│              INTERACTIVE QUIZ                   │
│     (type: "quiz" — "Are you Architect?")       │
├─────────────────────────────────────────────────┤
│                   RESOURCES                     │
│   (type: "resources" — links, books, tools)     │
├─────────────────────────────────────────────────┤
│                 CLOSING FACT                    │
│         (type: "fact" — final warning)          │
└─────────────────────────────────────────────────┘
```

---

## 3. COMPONENT MAPPING (JSON → UI)

### 3.1 `meta` Object
```json
{
  "reading_time": "18 წუთი",
  "difficulty": "Advanced",
  "last_updated": "2026-01-19"
}
```
**Render:** Top bar below hero with:
- ⏱️ Reading time badge (red background)
- 🎯 Difficulty badge (gold for Advanced)
- 📅 Last updated (subtle gray text)

---

### 3.2 `type: "intro"`
**Visual:** 
- Full-width dark card with RED left border (4px solid #ff2d2d)
- First paragraph: Large text (24px), bold
- Background: Subtle dark red gradient (`linear-gradient(135deg, #0a0a0f 0%, #1a0505 100%)`)

**Animation:** Text fades in with slight upward motion.

---

### 3.3 `type: "section"`
**Layout:**
- Max-width: 800px, centered
- H3 Headers: Uppercase, Gold underline
- Paragraphs: Standard body text

**Special Elements to Parse:**
| Pattern | Render As |
|---------|-----------|
| `### N. Title` | Section Header with number badge |
| `რა არის ეს:` | "Definition Block" — blue left border |
| `სცენარი:` | "Scenario Block" — dark card with icon 🎬 |
| `რატომ ხარ დებილი:` | "Wake Up Block" — RED pulsing border, skull icon ☠️ |
| `ვინ გადარჩება?` | "Survivor Block" — green accent |

---

### 3.4 `type: "callout"` (NEW — Must be added to JSON)
**Variants:**
```json
{ "type": "callout", "variant": "warning", "content": "..." }
{ "type": "callout", "variant": "tip", "content": "..." }
{ "type": "callout", "variant": "example", "content": "..." }
{ "type": "callout", "variant": "counter", "content": "..." }
```

| Variant | Border Color | Icon | Background |
|---------|--------------|------|------------|
| `warning` | #ff2d2d | ⚠️ | Dark red gradient |
| `tip` | #00d4ff | 💡 | Dark blue gradient |
| `example` | #ffd700 | 📌 | Dark gold gradient |
| `counter` | #9b59b6 | 🤔 | Dark purple gradient |

---

### 3.5 `type: "quiz"` (NEW)
**Structure:**
```json
{
  "type": "quiz",
  "title": "ტესტი: არქიტექტორი ხარ თუ რესურსი?",
  "questions": [
    {
      "q": "რამდენი AI აგენტი გყავს რომელიც შენთვის მუშაობს?",
      "options": ["0", "1-2", "3-5", "5+"],
      "scores": [0, 1, 2, 3]
    }
  ],
  "results": {
    "0-3": { "title": "რესურსი", "desc": "შენ ხარ საკვები.", "color": "#ff2d2d" },
    "4-7": { "title": "ტრანზიტი", "desc": "შენ გაქვს შანსი.", "color": "#ffd700" },
    "8+": { "title": "არქიტექტორი", "desc": "კეთილი იყოს შენი მობრძანება 2026-ში.", "color": "#00ff41" }
  }
}
```

**Interaction:**
- Radio buttons for each question
- Submit button at end
- Result shows with animated counter
- Share result button (Twitter/Facebook)

---

### 3.6 `type: "resources"` (NEW)
**Structure:**
```json
{
  "type": "resources",
  "categories": [
    {
      "name": "📚 წიგნები",
      "items": [
        { "title": "The Singularity Is Near", "author": "Ray Kurzweil", "link": "..." }
      ]
    },
    {
      "name": "🛠️ ხელსაწყოები",
      "items": [
        { "title": "ChatGPT", "desc": "დაიწყე აქედან.", "link": "..." }
      ]
    }
  ]
}
```

**Render:** Grid of cards (3 columns desktop, 1 mobile). Hover effect: lift + glow.

---

### 3.7 `type: "fact"` (Closing)
**Visual:**
- Centered, full-width
- Shield emoji (🛡️) as large icon
- Text in a glassmorphism card
- Background: Gold gradient glow

---

## 4. TABLE OF CONTENTS (TOC)

**Behavior:**
- **Desktop:** Sticky sidebar on the left (200px width)
- **Mobile:** Collapsible hamburger menu at top

**Content:** Auto-generated from `### N. Title` headers  
**Active State:** Highlight current section based on scroll position  
**Style:** Monospace font, numbered list, subtle hover effect

---

## 5. FAQ SECTION (Expandable)

**Source:** `seo.faq` array  
**Render:** Accordion style
- Click to expand/collapse
- "+" icon rotates to "−" on open
- Smooth height animation

**Schema:** Inject `FAQPage` JSON-LD for SEO.

---

## 6. GLOSSARY SYSTEM

**Source:** `seo.entities` array  
**Behavior:**
1. Scan all text content
2. If a word matches an entity, wrap in `<span class="glossary-term">`
3. On hover → Show tooltip with definition

**Style:**
- Dotted cyan underline
- Tooltip: Glassmorphism card, 200px max-width

---

## 7. SPECIAL EFFECTS

| Effect | Where | How |
|--------|-------|-----|
| **Parallax BG** | Hero Section | CSS `background-attachment: fixed` |
| **Grain Overlay** | Entire page | SVG noise filter, opacity 0.03 |
| **Pulsing Border** | "რატომ ხარ დებილი" blocks | CSS animation, 2s infinite |
| **Typing Animation** | Hero title | Optional, on first load only |
| **Counter Animation** | Quiz results | Count up from 0 to score |

---

## 8. MOBILE RESPONSIVENESS

| Element | Desktop | Mobile |
|---------|---------|--------|
| TOC | Sticky sidebar | Hamburger menu |
| Section width | 800px | 100% padding 16px |
| Font size | 18px body | 16px body |
| Quiz | Inline | Full-screen modal |
| Images | Float left/right | Full width, centered |

---

## 9. METADATA & SEO INJECTION

**Head Tags:**
```html
<title>{meta.title}</title>
<meta name="description" content="{seo.excerpt}">
<meta property="og:title" content="{meta.title}">
<meta property="og:description" content="{seo.excerpt}">
<script type="application/ld+json">{schema_org}</script>
<script type="application/ld+json">{faq_schema}</script>
```

---

## 10. INTERACTION REQUIREMENTS

| Feature | Description |
|---------|-------------|
| **Copy Button** | On hover of any code block |
| **Share Bar** | Floating right side (X, LinkedIn, Telegram) |
| **Progress Bar** | Top of page, shows reading progress |
| **Back to Top** | Floating button appears after 50% scroll |

---

## 11. COLOR PALETTE SUMMARY

```css
:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #1a0505;
  --accent-danger: #ff2d2d;
  --accent-info: #00d4ff;
  --accent-elite: #ffd700;
  --accent-success: #00ff41;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
}
```

---

## 12. FONT STACK

```css
:root {
  --font-heading: 'Space Grotesk', 'Bebas Neue', sans-serif;
  --font-body: 'Inter', 'Segoe UI', sans-serif;
  --font-code: 'JetBrains Mono', 'Fira Code', monospace;
  --font-georgian: 'BPG Nino Mtavruli', 'DejaVu Sans', sans-serif;
}
```

---

**Created by:** Alpha Architect  
**Version:** 1.0  
**Date:** 2026-01-19
