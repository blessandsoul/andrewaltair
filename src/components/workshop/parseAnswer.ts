/**
 * Multi-field answers are stored as «label: value» lines (one per field).
 * Parse them back for structured display; plain answers pass through.
 */

export interface AnswerRow {
    label: string
    value: string
}

const LINE_RE = /^(.{2,60}?):\s+(.+)$/

/** Strip the parenthetical hint from a field label: «სფერო (1-2 სიტყვა)» → «სფერო». */
function cleanLabel(label: string): string {
    return label.replace(/\s*\(.*?\)\s*$/, '').trim()
}

/**
 * Returns structured rows when the text looks like a multi-field answer
 * (≥2 «label: value» lines), otherwise null → render as plain text.
 */
export function parseStructuredAnswer(text: string): AnswerRow[] | null {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
    if (lines.length < 2) return null
    const rows: AnswerRow[] = []
    for (const line of lines) {
        const m = line.match(LINE_RE)
        if (!m) return null
        rows.push({ label: cleanLabel(m[1]), value: m[2].trim() })
    }
    return rows
}

/** Compact one-line preview: just the values — «SMM · ChatGPT · ვირუსული Reels». */
export function answerPreview(text: string): string {
    const rows = parseStructuredAnswer(text)
    if (!rows) return text
    return rows.map((r) => r.value).join(' · ')
}
