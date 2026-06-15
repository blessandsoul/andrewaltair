const geoCache = new Map<string, { city: string; country: string; countryCode: string; expires: number }>();
const georgianCities = ['Tbilisi', 'Batumi', 'Kutaisi', 'Rustavi', 'Zugdidi', 'Gori', 'Poti', 'Samtredia', 'Khashuri'];
const inflight = new Set<string>();

// Populate the cache OUT OF BAND — never on the request path. ip-api.com is HTTP-only,
// rate-limited (~45 req/min) and can stall up to the 3s timeout; awaiting it inline used to
// hold a Mongo pool connection for seconds and lag the whole app. Now the first hit for an IP
// returns a placeholder instantly and this backfills the cache for subsequent hits.
function refreshGeo(ip: string): void {
    if (inflight.has(ip)) return;
    inflight.add(ip);
    fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`, { signal: AbortSignal.timeout(3000) })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
            if (data && data.status === 'success') {
                geoCache.set(ip, {
                    city: data.city || 'Unknown',
                    country: data.country || 'Unknown',
                    countryCode: data.countryCode || 'XX',
                    expires: Date.now() + 60 * 60 * 1000,
                });
            }
        })
        .catch(() => {})
        .finally(() => inflight.delete(ip));
}

/** Non-blocking geo lookup: cache hit, or an instant placeholder + background cache refresh. */
export async function getGeoFromIP(ip: string): Promise<{ city: string; country: string; countryCode: string }> {
    if (!ip || ip === 'unknown' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.') || ip === '::1') {
        return { city: georgianCities[Math.floor(Math.random() * georgianCities.length)], country: 'Georgia', countryCode: 'GE' };
    }
    const cached = geoCache.get(ip);
    if (cached && cached.expires > Date.now()) return { city: cached.city, country: cached.country, countryCode: cached.countryCode };

    refreshGeo(ip); // fire-and-forget — do NOT await the external call
    return { city: 'Unknown', country: 'Unknown', countryCode: 'XX' };
}
