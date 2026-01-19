# 🎨 DESIGN SPEC: Vibe Coding Article Renderer

**Target Audience:** Frontend AI Coder / Developer
**Goal:** Render `vibe_coding.json` with a "Cyberpunk / High-Tech" aesthetic suitable for 2026.

## 1. General Aesthetic ("The Vibe")
*   **Theme:** Dark Mode Only. Deep Navy / Black background (`#050510`).
*   **Accent Colors:** Neon Cyan (`#00f3ff`) for tech, Magenta (`#ff00ff`) for concepts, Matrix Green (`#00ff41`) for code.
*   **Typography:**
    *   Headings: `Inter` or `Space Grotesk` (Bold, Tracking -2%).
    *   Body: `Inter` or `JetBrains Mono` (for code/technical terms).
*   **Effects:** Glassmorphism cards, inner glows, subtle grain overlay. No flat design.

## 2. Component Mapping (JSON -> UI)

### `section_intro`
*   **Visual:** Full-screen Hero Section.
*   **Headline:** Large, gradient text (Cyan to Purle).
*   **Background:** Use `image_prompt` to generate a Parallax background.
*   **Animation:** Text fades in up.

### `timeline`
*   **Layout:** Vertical line on the left (mobile) or center (desktop).
*   **Nodes:** Glowing dots. Active node pulses.
*   **Content:**
    *   `title` should be Bold.
    *   `year` needs to be in a monospaced "badge".
    *   `desc` appears on hover or click.

### `section_standard`
*   **Layout:** Single column text, max-width 800px.
*   **Highlight Quote:** If `highlight_quote` exists, render as a large, centered blockquote with a "Glowing Border" effect.

### `comparison_table`
*   **Style:** Not a boring Excel table!
*   **Cards:** On mobile, convert rows to "Feature Cards".
*   **Desktop:** Transparent table with hover row effects (lighting up the row).
*   **Vibe Level:** Render the 🔥 emojis as animated particles if possible, or just high-quality SVGs.

### `checklist_section`
*   **Interaction:** Clicking a list item toggles a "Neon Checkmark".
*   **Sound:** Optional subtle "future click" sound on toggle.

### `warning_section` (The Dark Side)
*   **Border:** Red pulsing border (`#ff0000`).
*   **Icons:** Use warning triangles.
*   **Background:** Very dark red gradient overlay.

### `glossary` (Tooltip System)
*   **Behavior:** Scan the `content.body` text. If a word matches a key in `glossary` object, wrap it in a `<span class="glossary-term">`.
*   **Interaction:** On Hover -> Show a small glassmorphism tooltip with the definition.
*   **Style:** Dotted underline (Cyan color).

## 3. Metadata & SEO
*   **Reading Time:** Display at top "⏱️ 15 min read".
*   **Difficulty:** Display badge "Intermediate" (Color: Orange).
*   **Schema.org:** Inject the `schema_org` and `faq_schema` JSON-LD into the `<head>`.

## 4. Image Generation
*   **Action:** Use the `image_prompt` fields found in the JSON to generate assets via Midjourney/DALL-E.
*   **Fallback:** If no image generated, use a CSS Gradient placeholder matching the section vibes.

## 5. Interaction Needs
*   **Copy Button:** Any code block must have a "Copy Vibe" button.
*   **Share:** Floating share bar (Twitter/X, LinkedIn).

---
*Created by Alpha Architect | 2026*
