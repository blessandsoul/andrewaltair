/**
 * Next.js instrumentation hook — runs once per server boot.
 * Kicks off the one-shot SEO data migrations (src/lib/seo-migrations.ts) so a
 * redeploy applies them automatically — no manual `npx tsx scripts/*` on the VPS.
 *
 * The dynamic import MUST stay inside the NEXT_RUNTIME === 'nodejs' branch:
 * this file is also compiled for the edge runtime, and webpack dead-code-
 * eliminates the branch there — otherwise mongoose (net/fs/child_process)
 * lands in the edge bundle and the build fails.
 *
 * Fire-and-forget: migrations must never block or crash the server start.
 * Requires `experimental.instrumentationHook: true` in next.config.mjs (Next 14).
 */
export async function register(): Promise<void> {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // skip during `next build` (placeholder env, no real DB)
        if ((process.env.MONGODB_URI || '').includes('placeholder')) return;

        const { runSeoMigrations } = await import('@/lib/seo-migrations');
        runSeoMigrations().catch((error) => {
            console.error('[instrumentation] seo migrations crashed:', error);
        });
    }
}
