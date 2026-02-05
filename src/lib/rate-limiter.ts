// TODO: Replace with Redis/Upstash for production multi-instance support
// Current in-memory implementation resets on server restart and doesn't work across instances

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn?: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

export function createRateLimiter(
  name: string,
  maxAttempts: number,
  windowMs: number
): {
  check: (key: string) => RateLimitResult;
  record: (key: string) => void;
  clear: (key: string) => void;
} {
  if (!stores.has(name)) {
    stores.set(name, new Map());
  }
  const store = stores.get(name)!;

  return {
    check(key: string): RateLimitResult {
      const now = Date.now();
      const entry = store.get(key);

      if (!entry) {
        return { allowed: true, remaining: maxAttempts };
      }

      // Window expired — reset
      if (now - entry.lastAttempt >= windowMs) {
        store.delete(key);
        return { allowed: true, remaining: maxAttempts };
      }

      if (entry.count >= maxAttempts) {
        const resetIn = Math.ceil((windowMs - (now - entry.lastAttempt)) / 1000);
        return { allowed: false, remaining: 0, resetIn };
      }

      return { allowed: true, remaining: maxAttempts - entry.count };
    },

    record(key: string): void {
      const now = Date.now();
      const entry = store.get(key);

      if (!entry) {
        store.set(key, { count: 1, firstAttempt: now, lastAttempt: now });
        return;
      }

      // Window expired — start fresh
      if (now - entry.lastAttempt >= windowMs) {
        store.set(key, { count: 1, firstAttempt: now, lastAttempt: now });
        return;
      }

      entry.count++;
      entry.lastAttempt = now;
    },

    clear(key: string): void {
      store.delete(key);
    },
  };
}
