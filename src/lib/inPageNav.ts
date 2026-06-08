// Client-only module singleton. Set immediately BEFORE an in-page
// history.replaceState (the infinite-scroll URL sync) and consumed by
// PageTransition to suppress its scroll-to-top + remount for that change.
// Read/written ONLY inside client event handlers / effects, never during
// render — so the shared module-level mutable is SSR-safe.
let shallowNavPending = false

export function flagShallowNav(): void {
    shallowNavPending = true
}

export function consumeShallowNav(): boolean {
    const v = shallowNavPending
    shallowNavPending = false
    return v
}
