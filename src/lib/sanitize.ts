import DOMPurify from 'dompurify';

/**
 * Sanitize HTML string using DOMPurify.
 * Strips dangerous tags/attributes while preserving safe HTML.
 */
export function sanitizeHtml(html: string): string {
    if (typeof window === 'undefined') {
        // Server-side: return as-is (DOMPurify requires DOM)
        // Actual sanitization happens on client render
        return html;
    }
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['strong', 'em', 'b', 'i', 'br', 'p', 'a', 'ul', 'ol', 'li', 'code', 'pre', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'figure', 'figcaption', 'video', 'source', 'hr', 'sup', 'sub', 'mark', 'del', 'ins', 'details', 'summary'],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id', 'src', 'alt', 'width', 'height', 'style', 'title', 'loading', 'decoding', 'type', 'colspan', 'rowspan'],
        ALLOW_DATA_ATTR: false,
    });
}
