/**
 * Serialize an object as a JSON-LD string that is safe to place inside a
 * <script type="application/ld+json"> via dangerouslySetInnerHTML.
 *
 * JSON.stringify does not escape < > &, so a value containing the sequence
 * </script> (in a comment, title, body, or scraped field) would break out of
 * the script element and execute as HTML. Escaping those characters plus the
 * two JavaScript line separators (0x2028, 0x2029) closes that hole while
 * keeping valid JSON. See audit V011.
 */
export function safeJsonLd(data: unknown): string {
    const json = JSON.stringify(data);
    let out = '';
    for (const ch of json) {
        const code = ch.charCodeAt(0);
        if (ch === '<' || ch === '>' || ch === '&' || code === 0x2028 || code === 0x2029) {
            out += '\\u' + code.toString(16).padStart(4, '0');
        } else {
            out += ch;
        }
    }
    return out;
}
