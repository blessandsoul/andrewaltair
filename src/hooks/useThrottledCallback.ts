import { useCallback, useRef } from 'react';

/**
 * RAF-based throttle hook. Ensures callback runs at most once per animation frame.
 * For scroll, resize, mousemove — anything that fires faster than 60fps.
 */
export function useThrottledCallback<T extends (...args: unknown[]) => void>(
  callback: T
): T {
  const rafId = useRef<number | null>(null);
  const latestArgs = useRef<unknown[]>([]);

  return useCallback(
    ((...args: unknown[]) => {
      latestArgs.current = args;
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        callback(...latestArgs.current);
      });
    }) as T,
    [callback]
  );
}
