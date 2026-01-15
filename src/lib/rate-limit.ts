type RateLimitConfig = {
    interval: number; // in milliseconds
    uniqueTokenPerInterval: number; // Max capacity
};

const lruCache = new Map();

export function rateLimit(options: RateLimitConfig) {
    return {
        check: (res: any, limit: number, token: string) =>
            new Promise<void>((resolve, reject) => {
                const tokenCount = lruCache.get(token) || [0];
                if (tokenCount[0] === 0) {
                    lruCache.set(token, tokenCount);
                }
                tokenCount[0] += 1;

                const currentUsage = tokenCount[0];
                const isRateLimited = currentUsage >= limit;

                // Reset cache after interval
                /* 
                 * This is a simplified implementation. 
                 * In production, use Redis (Upstash) or a real LRU library.
                 */
                if (currentUsage === 1) {
                    setTimeout(() => {
                        lruCache.delete(token);
                    }, options.interval);
                }

                if (isRateLimited) {
                    reject('Rate limit exceeded');
                } else {
                    resolve();
                }
            }),
    };
}
