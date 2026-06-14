/**
 * Workshop localization layer.
 *
 * Каждый переводимый текст в workshop-templates.ts — это объект `L`:
 *   { ru: '...', ctx: 'контекст для переводчика', ka: '' }
 *
 * - `ru`  — мастер-текст (русский, ясный). Пишем и доводим до идеала здесь.
 * - `ctx` — заметка переводчику: что значит, тон, аудитория, где показывается.
 *           Стоит рядом с каждым текстом, чтобы перевод был точным.
 * - `ka`  — грузинский перевод. Заполняется позже; пока пустой.
 *
 * Тул показывает `ka` если заполнен, иначе откатывается на `ru`.
 * `resolveDeep` прогоняет шаблон раунда и заменяет каждый `L` на строку —
 * комната хранит плоские строки, поэтому модель/сервис/UI не меняются.
 */

export interface L {
    ru: string
    ctx: string
    ka?: string
}

/** Compact authoring helper: l('русский текст', 'контекст для переводчика'). */
export const l = (ru: string, ctx: string, ka = ''): L => ({ ru, ctx, ka })

/**
 * Resolve one localized string to the display string for `lang`.
 * - 'ka' (default): Georgian if filled, else the Russian master.
 * - 'ru': always the Russian master.
 */
export function tr(l: L | string, lang: 'ka' | 'ru' = 'ka'): string {
    if (typeof l === 'string') return l
    if (lang === 'ru') return l.ru
    return l.ka && l.ka.trim() ? l.ka : l.ru
}

function isL(v: unknown): v is L {
    return (
        typeof v === 'object' &&
        v !== null &&
        typeof (v as Record<string, unknown>).ru === 'string' &&
        typeof (v as Record<string, unknown>).ctx === 'string'
    )
}

/**
 * Deep-resolve a value: every `L` object becomes its display string,
 * everything else (strings, numbers, booleans, arrays, plain objects)
 * is walked through unchanged. Used to flatten a template round into the
 * plain-string shape the room document / service / UI expect.
 */
export function resolveDeep<T = unknown>(v: T, lang: 'ka' | 'ru' = 'ka'): T {
    if (v == null) return v
    if (typeof v !== 'object') return v
    if (isL(v)) return tr(v, lang) as unknown as T
    if (Array.isArray(v)) return v.map((x) => resolveDeep(x, lang)) as unknown as T
    const out: Record<string, unknown> = {}
    for (const key of Object.keys(v as Record<string, unknown>)) {
        out[key] = resolveDeep((v as Record<string, unknown>)[key], lang)
    }
    return out as T
}
