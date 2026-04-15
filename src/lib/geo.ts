const geoCache = new Map<string, { city: string; country: string; countryCode: string; expires: number }>();
const georgianCities = ['Tbilisi', 'Batumi', 'Kutaisi', 'Rustavi', 'Zugdidi', 'Gori', 'Poti', 'Samtredia', 'Khashuri'];

export async function getGeoFromIP(ip: string): Promise<{ city: string; country: string; countryCode: string }> {
    if (!ip || ip === 'unknown' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.') || ip === '::1') {
        return { city: georgianCities[Math.floor(Math.random() * georgianCities.length)], country: 'Georgia', countryCode: 'GE' };
    }
    const cached = geoCache.get(ip);
    if (cached && cached.expires > Date.now()) return { city: cached.city, country: cached.country, countryCode: cached.countryCode };

    try {
        const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`, { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
            const data = await res.json();
            if (data.status === 'success') {
                const geo = { city: data.city || 'Unknown', country: data.country || 'Unknown', countryCode: data.countryCode || 'XX' };
                geoCache.set(ip, { ...geo, expires: Date.now() + 60 * 60 * 1000 });
                return geo;
            }
        }
    } catch { }
    return { city: 'Unknown', country: 'Unknown', countryCode: 'XX' };
}
