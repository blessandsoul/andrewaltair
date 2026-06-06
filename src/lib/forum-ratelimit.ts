/**
 * In-memory rate limiter + kill-switch for PUBLIC forum AI actions (ask / duel /
 * comment-reply). Protects the free OpenRouter Gemma quota from anonymous abuse.
 *
 * Note: in-memory → resets on restart and is per-instance (fine for the single
 * Coolify container). Reactions/votes do NOT use this (they're free, no AI).
 */

const COOLDOWN_MS = 20_000;     // min gap between AI actions per IP
const DAILY_CAP_PER_IP = 40;    // AI actions per IP per day
const GLOBAL_DAILY_CAP = 500;   // whole-forum AI actions per day (quota guard)

interface IpEntry {
    last: number;
    count: number;
    day: string;
}

const ipMap = new Map<string, IpEntry>();
let globalDay = '';
let globalCount = 0;

function today(): string {
    const d = new Date();
    return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
}

/** Master kill-switch: set FORUM_PUBLIC_AI=off to disable all public AI actions. */
export function publicAiEnabled(): boolean {
    return (process.env.FORUM_PUBLIC_AI ?? 'on').toLowerCase() !== 'off';
}

export function getClientIp(req: Request): string {
    const xf = req.headers.get('x-forwarded-for');
    if (xf) return xf.split(',')[0].trim();
    return req.headers.get('x-real-ip') || 'unknown';
}

export type RateReason = 'disabled' | 'global_cap' | 'cooldown' | 'daily_cap';

/** Check (does NOT consume) whether this IP may perform an AI action now. */
export function checkAiRateLimit(ip: string): { ok: boolean; reason?: RateReason } {
    if (!publicAiEnabled()) return { ok: false, reason: 'disabled' };
    const d = today();
    if (globalDay !== d) {
        globalDay = d;
        globalCount = 0;
    }
    if (globalCount >= GLOBAL_DAILY_CAP) return { ok: false, reason: 'global_cap' };

    const e = ipMap.get(ip);
    if (e) {
        if (e.day !== d) {
            e.day = d;
            e.count = 0;
            e.last = 0;
        }
        if (Date.now() - e.last < COOLDOWN_MS) return { ok: false, reason: 'cooldown' };
        if (e.count >= DAILY_CAP_PER_IP) return { ok: false, reason: 'daily_cap' };
    }
    return { ok: true };
}

/** Record one consumed AI action for this IP (call after a successful generation). */
export function recordAiUse(ip: string): void {
    const d = today();
    const now = Date.now();
    if (globalDay !== d) {
        globalDay = d;
        globalCount = 0;
    }
    globalCount++;
    const e = ipMap.get(ip);
    if (e && e.day === d) {
        e.last = now;
        e.count++;
    } else {
        ipMap.set(ip, { last: now, count: 1, day: d });
    }
}

/** Georgian user-facing message for a rate-limit reason. */
export function rateLimitMessageKa(reason?: RateReason): string {
    switch (reason) {
        case 'disabled': return 'AI-ფუნქცია დროებით გათიშულია.';
        case 'cooldown': return 'ცოტა ხანში სცადე — ძალიან ხშირად.';
        case 'daily_cap': return 'დღევანდელი ლიმიტი ამოიწურა, სცადე ხვალ.';
        case 'global_cap': return 'ფორუმის დღიური ლიმიტი ამოიწურა, სცადე ხვალ.';
        default: return 'სცადე მოგვიანებით.';
    }
}
