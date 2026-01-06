/**
 * Simple in-memory cache with TTL support
 * For production with multiple instances, replace with Redis
 */

interface CacheEntry<T> {
    data: T
    expires: number
}

const cache = new Map<string, CacheEntry<any>>()

/**
 * Get cached data or fetch fresh if expired/missing
 * @param key - Cache key
 * @param ttlMs - Time to live in milliseconds
 * @param fetcher - Async function to fetch fresh data
 */
export async function getCached<T>(
    key: string,
    ttlMs: number,
    fetcher: () => Promise<T>
): Promise<T> {
    const now = Date.now()
    const entry = cache.get(key)

    // Return cached if valid
    if (entry && entry.expires > now) {
        return entry.data
    }

    // Fetch fresh data
    const data = await fetcher()

    // Store in cache
    cache.set(key, {
        data,
        expires: now + ttlMs
    })

    return data
}

/**
 * Invalidate a specific cache key
 */
export function invalidateCache(key: string): void {
    cache.delete(key)
}

/**
 * Invalidate all cache entries matching a prefix
 */
export function invalidateCachePrefix(prefix: string): void {
    for (const key of cache.keys()) {
        if (key.startsWith(prefix)) {
            cache.delete(key)
        }
    }
}

/**
 * Clear entire cache
 */
export function clearCache(): void {
    cache.clear()
}

/**
 * Get cache stats for monitoring
 */
export function getCacheStats(): { size: number; keys: string[] } {
    return {
        size: cache.size,
        keys: Array.from(cache.keys())
    }
}
